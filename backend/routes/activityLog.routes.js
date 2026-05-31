import express from 'express';
import { getActivityLogs } from '../controllers/activityLog.controller.js';
import { protect } from '../middleware/auth.middleware.js';
import { authorizeRoles } from '../middleware/role.middleware.js';

const router = express.Router();

// Apply global session protection
router.use(protect);

// Only authorized administrators and wardens can retrieve the enterprise audit trail
router.get('/', authorizeRoles('Admin', 'Warden'), getActivityLogs);

export default router;
