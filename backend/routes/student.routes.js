import express from 'express';
import { body } from 'express-validator';
import { 
  createStudent, 
  getStudents, 
  getStudentById, 
  updateStudent,
  deleteStudent
} from '../controllers/student.controller.js';
import { protect } from '../middleware/auth.middleware.js';
import { authorizeRoles } from '../middleware/role.middleware.js';
import { validateRequest } from '../middleware/validate.middleware.js';

const router = express.Router();

// Apply global session protection to all routes in this module
router.use(protect);

// @route   POST /api/v1/students
// @route   GET /api/v1/students
router.route('/')
  .post(
    authorizeRoles('Admin'),
    [
      body('email').isEmail().withMessage('Valid student email is required'),
      body('password').isLength({ min: 6 }).withMessage('Minimum password length is 6 characters'),
      body('firstName').notEmpty().withMessage('First name is required'),
      body('lastName').notEmpty().withMessage('Last name is required'),
      body('phone').notEmpty().withMessage('Contact phone number is required'),
      body('enrollmentNumber').notEmpty().withMessage('Enrollment number is required'),
      body('course').notEmpty().withMessage('Academic course mapping is required'),
      body('gender').isIn(['Male', 'Female', 'Other']).withMessage('Valid gender disclosure is required'),
      body('dateOfBirth').isISO8601().withMessage('Provide a valid date of birth'),
      body('address.street').notEmpty().withMessage('Street address is required'),
      body('address.city').notEmpty().withMessage('City is required'),
      body('address.state').notEmpty().withMessage('State is required'),
      body('address.zipCode').notEmpty().withMessage('Postal zip code is required'),
      body('guardian.name').notEmpty().withMessage('Guardian name is required'),
      body('guardian.relation').notEmpty().withMessage('Guardian relationship is required'),
      body('guardian.phone').notEmpty().withMessage('Guardian contact number is required')
    ],
    validateRequest,
    createStudent
  )
  .get(
    authorizeRoles('Admin', 'Warden'),
    getStudents
  );

// @route   GET /api/v1/students/:id
// @route   PUT /api/v1/students/:id
router.route('/:id')
  .get(getStudentById)
  .put(
    [
      body('course').optional().notEmpty().withMessage('Course cannot be empty'),
      body('address').optional().isObject().withMessage('Address must be a structured object')
    ],
    validateRequest,
    updateStudent
  )
  .delete(
    authorizeRoles('Admin'),
    deleteStudent
  );

export default router;
