import express from 'express';
import { body } from 'express-validator';
import { 
  createComplaint, 
  getComplaints, 
  updateComplaintStatus, 
  addComplaintComment 
} from '../controllers/complaint.controller.js';
import { protect } from '../middleware/auth.middleware.js';
import { authorizeRoles } from '../middleware/role.middleware.js';
import { validateRequest } from '../middleware/validate.middleware.js';

const router = express.Router();

router.use(protect);

// @route   POST /api/v1/complaints
// @route   GET /api/v1/complaints
router.route('/')
  .post(
    authorizeRoles('Student'),
    [
      body('category').isIn(['Electrical', 'Plumbing', 'Carpentry', 'Cleanliness', 'Internet', 'Discipline', 'Other']).withMessage('Select a valid defect category'),
      body('title').notEmpty().withMessage('Incident title is required'),
      body('description').notEmpty().withMessage('Detailed breakdown of the failure is required'),
      body('priority').optional().isIn(['Low', 'Medium', 'High', 'Critical']).withMessage('Invalid priority selection')
    ],
    validateRequest,
    createComplaint
  )
  .get(getComplaints);

// @route   PATCH /api/v1/complaints/:id
router.patch(
  '/:id',
  authorizeRoles('Admin', 'Warden'),
  [
    body('status').optional().isIn(['Pending', 'In-Progress', 'Resolved', 'Rejected']).withMessage('Invalid status progression'),
    body('assignedWarden').optional().isMongoId().withMessage('Must provide a valid Warden Object ID')
  ],
  validateRequest,
  updateComplaintStatus
);

// @route   POST /api/v1/complaints/:id/comments
router.post(
  '/:id/comments',
  [
    body('message').notEmpty().withMessage('Comment text cannot be empty')
  ],
  validateRequest,
  addComplaintComment
);

export default router;
