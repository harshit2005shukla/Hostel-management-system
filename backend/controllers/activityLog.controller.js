import { ActivityLog } from '../models/ActivityLog.model.js';

// @desc    Retrieve immutable system audit trails and activity logs
// @route   GET /api/v1/audit-logs
// @access  Private / Admin & Warden
export const getActivityLogs = async (req, res, next) => {
  try {
    const page = parseInt(req.query.page, 10) || 1;
    const limit = parseInt(req.query.limit, 10) || 50;
    const startIndex = (page - 1) * limit;

    const query = {};

    if (req.query.module) {
      query.module = req.query.module;
    }

    if (req.query.action) {
      query.action = req.query.action;
    }

    if (req.query.search) {
      query.description = new RegExp(req.query.search, 'i');
    }

    if (req.query.userId) {
      query.user = req.query.userId;
    }

    const total = await ActivityLog.countDocuments(query);

    const logs = await ActivityLog.find(query)
      .populate('user', 'firstName lastName email role')
      .skip(startIndex)
      .limit(limit)
      .sort({ createdAt: -1 });

    res.status(200).json({
      status: 'success',
      results: logs.length,
      pagination: {
        total,
        page,
        pages: Math.ceil(total / limit),
        limit
      },
      data: {
        logs
      }
    });

  } catch (error) {
    next(error);
  }
};
