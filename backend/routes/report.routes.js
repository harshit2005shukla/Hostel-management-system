import express from 'express';
import { exportOccupancyReport, exportComplaintReport, exportFeeReport } from '../controllers/report.controller.js';
import { protect } from '../middleware/auth.middleware.js';
import { authorizeRoles } from '../middleware/role.middleware.js';

const router = express.Router();

// Apply global session protection
router.use(protect);

// Native Export Endpoints
router.get('/occupancy/csv', authorizeRoles('Admin', 'Warden'), exportOccupancyReport);
router.get('/complaints/csv', authorizeRoles('Admin', 'Warden'), exportComplaintReport);
router.get('/fees/csv', authorizeRoles('Admin'), exportFeeReport);

export default router;
