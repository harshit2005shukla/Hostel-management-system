import express from 'express';
import { body } from 'express-validator';
import { 
  createFee, 
  getFees, 
  processPayment 
} from '../controllers/fee.controller.js';
import { protect } from '../middleware/auth.middleware.js';
import { authorizeRoles } from '../middleware/role.middleware.js';
import { validateRequest } from '../middleware/validate.middleware.js';

const router = express.Router();

router.use(protect);

// @route   POST /api/v1/fees
// @route   GET /api/v1/fees
router.route('/')
  .post(
    authorizeRoles('Admin'),
    [
      body('studentId').isMongoId().withMessage('Valid student Object ID reference is required'),
      body('feeType').isIn(['Room Rent', 'Mess Fee', 'Maintenance Fine', 'Late Fine', 'Security Deposit']).withMessage('Select a valid accounting bucket'),
      body('amount').isFloat({ min: 0 }).withMessage('Fee amount must be a non-negative number'),
      body('dueDate').isISO8601().withMessage('Provide a valid due date'),
      body('billingPeriod').notEmpty().withMessage('Accounting billing period designator is required')
    ],
    validateRequest,
    createFee
  )
  .get(getFees);

// @route   POST /api/v1/fees/:id/pay
router.post(
  '/:id/pay',
  authorizeRoles('Admin'),
  [
    body('paidAmount').isFloat({ min: 0.01 }).withMessage('Remittance amount must be greater than zero')
  ],
  validateRequest,
  processPayment
);

export default router;
