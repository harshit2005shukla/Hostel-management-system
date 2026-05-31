import express from 'express';
import { body } from 'express-validator';
import { 
  createRoom, 
  getRooms, 
  getRoomById, 
  updateRoomStatus 
} from '../controllers/room.controller.js';
import { protect } from '../middleware/auth.middleware.js';
import { authorizeRoles } from '../middleware/role.middleware.js';
import { validateRequest } from '../middleware/validate.middleware.js';

const router = express.Router();

router.use(protect);

// @route   POST /api/v1/rooms
// @route   GET /api/v1/rooms
router.route('/')
  .post(
    authorizeRoles('Admin'),
    [
      body('roomNumber').notEmpty().withMessage('Room number identifier is required'),
      body('hostelBlock').notEmpty().withMessage('Hostel block building designator is required'),
      body('floorNumber').isInt({ min: 0 }).withMessage('Floor index must be a non-negative integer'),
      body('capacity').isInt({ min: 1, max: 6 }).withMessage('Capacity must be between 1 and 6'),
      body('type').isIn(['Single', 'Double', 'Triple', 'Dormitory']).withMessage('Invalid room type selection')
    ],
    validateRequest,
    createRoom
  )
  .get(getRooms);

// @route   GET /api/v1/rooms/:id
// @route   PATCH /api/v1/rooms/:id
router.route('/:id')
  .get(getRoomById)
  .patch(
    authorizeRoles('Admin', 'Warden'),
    [
      body('status').optional().isIn(['Available', 'Full', 'Maintenance', 'Reserved']).withMessage('Invalid status update'),
      body('capacity').optional().isInt({ min: 1, max: 6 }).withMessage('Capacity must be between 1 and 6')
    ],
    validateRequest,
    updateRoomStatus
  );

export default router;
