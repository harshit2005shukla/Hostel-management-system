import jwt from 'jsonwebtoken';
import { User } from '../models/User.model.js';
import { Student } from '../models/Student.model.js';
import { ActivityLog } from '../models/ActivityLog.model.js';
import { sendEmail, emailTemplates } from '../services/email.service.js';

// Helper: Issue JSON Web Token
const generateToken = (id, role) => {
  return jwt.sign(
    { id, role }, 
    process.env.JWT_SECRET || 'super_secret_hostel_jwt_key_2026',
    { expiresIn: process.env.JWT_EXPIRE || '7d' }
  );
};

// @desc    Register a new administrative or warden user
// @route   POST /api/v1/auth/register
// @access  Public / Admin Setup
export const register = async (req, res, next) => {
  try {
    const { email, password, role, firstName, lastName, phone } = req.body;

    // Check if account email already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(409).json({
        status: 'error',
        message: 'An account with this email address already exists.'
      });
    }

    // Create central user credentials
    const newUser = await User.create({
      email,
      passwordHash: password,
      role: role || 'Student',
      firstName,
      lastName,
      phone,
      status: 'Active'
    });

    // Log the user registration in the immutable audit trail
    await ActivityLog.create({
      user: newUser._id,
      action: 'USER_REGISTERED',
      module: 'Auth',
      description: `New user provisioned with role ${newUser.role}`,
      ipAddress: req.ip || req.socket.remoteAddress,
      metadata: { email: newUser.email, role: newUser.role }
    });

    // Strip passwordHash from response payload
    newUser.passwordHash = undefined;

    // Generate JWT access token
    const token = generateToken(newUser._id, newUser.role);

    res.status(201).json({
      status: 'success',
      message: 'Account created successfully.',
      data: {
        token,
        user: newUser
      }
    });

  } catch (error) {
    next(error);
  }
};

// @desc    Authenticate user and return JWT
// @route   POST /api/v1/auth/login
// @access  Public
export const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    // Retrieve active user record with explicit select for password comparison
    const user = await User.findOne({ email }).select('+passwordHash');

    if (!user) {
      return res.status(401).json({
        status: 'error',
        message: 'Invalid credentials. No account found for this email.'
      });
    }

    // Verify status authorization
    if (user.status !== 'Active') {
      return res.status(403).json({
        status: 'error',
        message: `Your account is currently flagged as '${user.status}'. Portal access is blocked.`
      });
    }

    // Verify cryptographic secret
    const isMatch = await user.comparePassword(password);

    if (!isMatch) {
      return res.status(401).json({
        status: 'error',
        message: 'Invalid credentials. The password provided is incorrect.'
      });
    }

    // Update last access timestamp
    user.lastLogin = new Date();
    await user.save({ validateBeforeSave: false });

    // Log the successful login session securely
    await ActivityLog.create({
      user: user._id,
      action: 'USER_LOGIN',
      module: 'Auth',
      description: 'User successfully authenticated via credentials',
      ipAddress: req.ip || req.socket.remoteAddress,
      metadata: { email: user.email, role: user.role }
    });

    // Strip password from returned payload
    user.passwordHash = undefined;

    // Generate token
    const token = generateToken(user._id, user.role);

    res.status(200).json({
      status: 'success',
      message: 'Authentication successful.',
      data: {
        token,
        user
      }
    });

  } catch (error) {
    next(error);
  }
};

// @desc    Get currently logged in user context
// @route   GET /api/v1/auth/me
// @access  Private
export const getMe = async (req, res, next) => {
  try {
    const user = await User.findById(req.user._id);

    let studentProfile = null;
    if (user.role === 'Student') {
      studentProfile = await Student.findOne({ user: user._id }).populate('currentRoom');
    }

    res.status(200).json({
      status: 'success',
      data: {
        user,
        studentProfile
      }
    });

  } catch (error) {
    next(error);
  }
};

// @desc    Initiate forgot password recovery
// @route   POST /api/v1/auth/forgot-password
// @access  Public
export const forgotPassword = async (req, res, next) => {
  try {
    const { email } = req.body;

    const user = await User.findOne({ email }).select('+passwordHash');
    if (!user) {
      // Return a standard 200 to prevent user enumeration attacks
      return res.status(200).json({
        status: 'success',
        message: 'If the email exists in our records, a password reset link has been dispatched.'
      });
    }

    // Create a highly secure single-use stateless secret combining the application JWT secret and the user's password hash
    const secret = (process.env.JWT_SECRET || 'super_secret_hostel_jwt_key_2026') + user.passwordHash;
    
    const payload = {
      email: user.email,
      id: user._id
    };

    const token = jwt.sign(payload, secret, { expiresIn: '15m' });

    // Generate link directing to the frontend React reset-password view
    const clientOrigin = process.env.CLIENT_ORIGIN || 'http://localhost:5173';
    const resetUrl = `${clientOrigin}/reset-password?token=${token}&id=${user._id}`;

    // Dispatch verification email
    await sendEmail({
      to: user.email,
      subject: 'SmartHostel System - Password Reset Request',
      html: emailTemplates.forgotPassword(resetUrl)
    });

    // Log the request
    await ActivityLog.create({
      user: user._id,
      action: 'PASSWORD_RESET_REQUESTED',
      module: 'Auth',
      description: 'User initiated password recovery flow',
      ipAddress: req.ip || req.socket.remoteAddress,
      metadata: { email: user.email }
    });

    res.status(200).json({
      status: 'success',
      message: 'If the email exists in our records, a password reset link has been dispatched.'
    });

  } catch (error) {
    next(error);
  }
};

// @desc    Execute final password reset
// @route   POST /api/v1/auth/reset-password
// @access  Public
export const resetPassword = async (req, res, next) => {
  try {
    const { id, token, newPassword } = req.body;

    const user = await User.findById(id).select('+passwordHash');
    if (!user) {
      return res.status(400).json({
        status: 'error',
        message: 'Invalid or expired password reset token.'
      });
    }

    // Verify the one-time token
    const secret = (process.env.JWT_SECRET || 'super_secret_hostel_jwt_key_2026') + user.passwordHash;

    try {
      jwt.verify(token, secret);
    } catch (err) {
      return res.status(400).json({
        status: 'error',
        message: 'Invalid or expired password reset token.'
      });
    }

    // Update password hash safely
    user.passwordHash = newPassword;
    await user.save();

    // Log the successful password mutation
    await ActivityLog.create({
      user: user._id,
      action: 'PASSWORD_RESET_COMPLETED',
      module: 'Auth',
      description: 'User successfully modified their password using a stateless token',
      ipAddress: req.ip || req.socket.remoteAddress,
      metadata: { email: user.email }
    });

    res.status(200).json({
      status: 'success',
      message: 'Password has been reset successfully. You can now log in.'
    });

  } catch (error) {
    next(error);
  }
};
