import { Visitor } from '../models/Visitor.model.js';
import { Student } from '../models/Student.model.js';
import { ActivityLog } from '../models/ActivityLog.model.js';

// @desc    Register an arriving guest at the gate
// @route   POST /api/v1/visitors
// @access  Private / Warden Only
export const createVisitor = async (req, res, next) => {
  try {
    const { visitorName, phone, idProofType, idProofNumber, relationToStudent, studentToVisit } = req.body;

    // Validate target student resident
    const student = await Student.findById(studentToVisit);
    if (!student) {
      return res.status(404).json({ status: 'error', message: 'Target host student profile not found.' });
    }

    const newVisitor = await Visitor.create({
      visitorName,
      phone,
      idProofType,
      idProofNumber,
      relationToStudent,
      studentToVisit,
      checkInTime: new Date(),
      status: 'Checked-In',
      approvedBy: req.user._id
    });

    // Write to the immutable audit trail
    await ActivityLog.create({
      user: req.user._id,
      action: 'VISITOR_CHECKED_IN',
      module: 'Visitors',
      description: `Logged gate entry for visitor ${visitorName} visiting resident ${student.enrollmentNumber}`,
      ipAddress: req.ip || req.socket?.remoteAddress,
      metadata: { visitorId: newVisitor._id, visitorName, studentId: studentToVisit }
    });

    res.status(201).json({
      status: 'success',
      message: 'Gate security clearance granted. Visitor entry logged.',
      data: { visitor: newVisitor }
    });

  } catch (error) {
    next(error);
  }
};

// @desc    Retrieve security entry registries
// @route   GET /api/v1/visitors
// @access  Private / Admin & Warden
export const getVisitors = async (req, res, next) => {
  try {
    const page = parseInt(req.query.page, 10) || 1;
    const limit = parseInt(req.query.limit, 10) || 20;
    const startIndex = (page - 1) * limit;

    const query = {};

    if (req.query.status) {
      query.status = req.query.status;
    }

    if (req.query.search) {
      query.visitorName = new RegExp(req.query.search, 'i');
    }

    if (req.query.studentId) {
      query.studentToVisit = req.query.studentId;
    }

    const total = await Visitor.countDocuments(query);

    const visitors = await Visitor.find(query)
      .populate({
        path: 'studentToVisit',
        select: 'enrollmentNumber currentRoom user',
        populate: { path: 'user', select: 'firstName lastName phone' }
      })
      .populate('approvedBy', 'firstName lastName')
      .skip(startIndex)
      .limit(limit)
      .sort({ checkInTime: -1 });

    res.status(200).json({
      status: 'success',
      results: visitors.length,
      pagination: { total, page, pages: Math.ceil(total / limit), limit },
      data: { visitors }
    });

  } catch (error) {
    next(error);
  }
};

// @desc    Log physical departure and close gate security token
// @route   POST /api/v1/visitors/:id/checkout
// @access  Private / Warden Only
export const checkoutVisitor = async (req, res, next) => {
  try {
    const visitor = await Visitor.findById(req.params.id);

    if (!visitor) {
      return res.status(404).json({ status: 'error', message: 'Visitor entry log not found.' });
    }

    if (visitor.status !== 'Checked-In') {
      return res.status(400).json({
        status: 'error',
        message: `Visitor entry status is already locked as '${visitor.status}'.`
      });
    }

    visitor.status = 'Checked-Out';
    visitor.checkOutTime = new Date();

    const updatedVisitor = await visitor.save();

    // Log the successful checkout safely
    await ActivityLog.create({
      user: req.user._id,
      action: 'VISITOR_CHECKED_OUT',
      module: 'Visitors',
      description: `Stamped gate checkout for visitor ${visitor.visitorName}`,
      ipAddress: req.ip || req.socket?.remoteAddress,
      metadata: { visitorId: visitor._id }
    });

    res.status(200).json({
      status: 'success',
      message: 'Gate departure audit stamped.',
      data: { visitor: updatedVisitor }
    });

  } catch (error) {
    next(error);
  }
};
