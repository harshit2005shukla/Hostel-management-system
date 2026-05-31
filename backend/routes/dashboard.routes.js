import express from 'express';
import { getDashboardAnalytics } from '../controllers/dashboard.controller.js';
import { protect } from '../middleware/auth.middleware.js';
import { authorizeRoles } from '../middleware/role.middleware.js';

const router = express.Router();

// Apply global session protection to all routes in this module
router.use(protect);

// @route   GET /api/v1/dashboard/analytics
router.get(
  '/analytics', 
  authorizeRoles('Admin', 'Warden'), 
  getDashboardAnalytics
);

export default router;
