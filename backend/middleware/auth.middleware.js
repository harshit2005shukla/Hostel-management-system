import jwt from 'jsonwebtoken';
import { User } from '../models/User.model.js';

export const protect = async (req, res, next) => {
  try {
    let token;

    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
      token = req.headers.authorization.split(' ')[1];
    }

    if (!token) {
      return res.status(401).json({
        status: 'error',
        message: 'Access denied. No authentication token provided.'
      });
    }

    // Verify token cryptographic signature
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'super_secret_hostel_jwt_key_2026');

    // Retrieve active user record
    const currentUser = await User.findById(decoded.id).select('-passwordHash');

    if (!currentUser) {
      return res.status(401).json({
        status: 'error',
        message: 'The user belonging to this token no longer exists in the system.'
      });
    }

    if (currentUser.status !== 'Active') {
      return res.status(403).json({
        status: 'error',
        message: `Your account status is currently '${currentUser.status}'. Access is restricted.`
      });
    }

    // Attach verified user context to inbound request
    req.user = currentUser;
    next();

  } catch (error) {
    return res.status(401).json({
      status: 'error',
      message: 'Not authorized. Token verification failed.',
      detail: error.message
    });
  }
};
