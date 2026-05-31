import express from 'express';
import { body } from 'express-validator';
import { register, login, getMe, forgotPassword, resetPassword } from '../controllers/auth.controller.js';
import { protect } from '../middleware/auth.middleware.js';
import { validateRequest } from '../middleware/validate.middleware.js';

const router = express.Router();

// Registration Gateway
router.post(
  '/register',
  [
    body('email').isEmail().withMessage('Provide a valid email address'),
    body('password').isLength({ min: 8 }).withMessage('Password must be at least 8 characters long'),
    body('firstName').notEmpty().withMessage('First name is required'),
    body('lastName').notEmpty().withMessage('Last name is required'),
    body('phone').notEmpty().withMessage('Phone number is required'),
    body('role').optional().isIn(['Admin', 'Warden', 'Student']).withMessage('Invalid role selection')
  ],
  validateRequest,
  register
);

// Session Login Gateway
router.post(
  '/login',
  [
    body('email').isEmail().withMessage('Provide a valid email address'),
    body('password').notEmpty().withMessage('Password is required')
  ],
  validateRequest,
  login
);

// Forgot Password Gateway
router.post(
  '/forgot-password',
  [
    body('email').isEmail().withMessage('Provide a valid email address')
  ],
  validateRequest,
  forgotPassword
);

// Reset Password Gateway
router.post(
  '/reset-password',
  [
    body('id').isMongoId().withMessage('Valid User ID is required'),
    body('token').notEmpty().withMessage('Reset token is required'),
    body('newPassword').isLength({ min: 6 }).withMessage('New password must be at least 6 characters long')
  ],
  validateRequest,
  resetPassword
);

// Protected Context Verification
router.get('/me', protect, getMe);

export default router;
