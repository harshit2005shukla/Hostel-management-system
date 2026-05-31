import express from 'express';
import { body } from 'express-validator';
import { 
  createVisitor, 
  getVisitors, 
  checkoutVisitor 
} from '../controllers/visitor.controller.js';
import { protect } from '../middleware/auth.middleware.js';
import { authorizeRoles } from '../middleware/role.middleware.js';
import { validateRequest } from '../middleware/validate.middleware.js';

const router = express.Router();

router.use(protect);

// @route   POST /api/v1/visitors
// @route   GET /api/v1/visitors
router.route('/')
  .post(
    authorizeRoles('Warden'),
    [
      body('visitorName').notEmpty().withMessage('Visitor legal name is required'),
      body('phone').notEmpty().withMessage('Verified visitor phone number is required'),
      body('idProofType').notEmpty().withMessage('Government ID type disclosure is required'),
      body('idProofNumber').notEmpty().withMessage('Government identity document number is required'),
      body('relationToStudent').notEmpty().withMessage('Relation disclosure to host student is required'),
      body('studentToVisit').isMongoId().withMessage('Valid host student Object ID reference is required')
    ],
    validateRequest,
    createVisitor
  )
  .get(
    authorizeRoles('Admin', 'Warden'),
    getVisitors
  );

// @route   POST /api/v1/visitors/:id/checkout
router.post(
  '/:id/checkout',
  authorizeRoles('Warden'),
  checkoutVisitor
);

export default router;
