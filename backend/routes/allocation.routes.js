import express from 'express';
import { body } from 'express-validator';
import { 
  createAllocation, 
  getAllocations, 
  vacateAllocation 
} from '../controllers/allocation.controller.js';
import { protect } from '../middleware/auth.middleware.js';
import { authorizeRoles } from '../middleware/role.middleware.js';
import { validateRequest } from '../middleware/validate.middleware.js';

const router = express.Router();

router.use(protect);

// @route   POST /api/v1/allocations
// @route   GET /api/v1/allocations
router.route('/')
  .post(
    authorizeRoles('Admin', 'Warden'),
    [
      body('studentId').isMongoId().withMessage('Valid Student Object ID reference is required'),
      body('roomId').isMongoId().withMessage('Valid Room Object ID reference is required'),
      body('bedIdentifier').notEmpty().withMessage('Specific bed slot identifier is required'),
      body('expectedVacateDate').isISO8601().withMessage('Provide a valid expected checkout date')
    ],
    validateRequest,
    createAllocation
  )
  .get(getAllocations);

// @route   POST /api/v1/allocations/:id/vacate
router.post(
  '/:id/vacate',
  authorizeRoles('Admin', 'Warden'),
  vacateAllocation
);

export default router;
