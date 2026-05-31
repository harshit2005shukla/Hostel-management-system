import { Complaint } from '../models/Complaint.model.js';
import { Student } from '../models/Student.model.js';
import { ActivityLog } from '../models/ActivityLog.model.js';
import { sendEmail, emailTemplates } from '../services/email.service.js';

// @desc    File a new facility or discipline service request
// @route   POST /api/v1/complaints
// @access  Private / Student Only
export const createComplaint = async (req, res, next) => {
  try {
    const { category, title, description, priority } = req.body;

    // Resolve student identity
    const student = await Student.findOne({ user: req.user._id });
    if (!student) {
      return res.status(403).json({
        status: 'error',
        message: 'Only registered student profiles can originate maintenance service tickets.'
      });
    }

    if (!student.currentRoom) {
      return res.status(400).json({
        status: 'error',
        message: 'You must hold an active room allocation to file an asset defect request.'
      });
    }

    const newComplaint = await Complaint.create({
      student: student._id,
      room: student.currentRoom,
      category,
      title,
      description,
      priority: priority || 'Medium',
      status: 'Pending'
    });

    // Write to the immutable audit trail
    await ActivityLog.create({
      user: req.user._id,
      action: 'COMPLAINT_FILED',
      module: 'Complaints',
      description: `Filed ticket: ${title} (${category})`,
      ipAddress: req.ip || req.socket?.remoteAddress,
      metadata: { complaintId: newComplaint._id, category, priority }
    });

    res.status(201).json({
      status: 'success',
      message: 'Service ticket filed successfully.',
      data: {
        complaint: newComplaint
      }
    });

  } catch (error) {
    next(error);
  }
};

// @desc    Retrieve tickets based on access role scope
// @route   GET /api/v1/complaints
// @access  Private
export const getComplaints = async (req, res, next) => {
  try {
    const page = parseInt(req.query.page, 10) || 1;
    const limit = parseInt(req.query.limit, 10) || 20;
    const startIndex = (page - 1) * limit;

    const query = {};

    if (req.query.status) query.status = req.query.status;
    if (req.query.priority) query.priority = req.query.priority;
    if (req.query.category) query.category = req.query.category;

    // Role boundary scoping
    if (req.user.role === 'Student') {
      const student = await Student.findOne({ user: req.user._id });
      if (!student) {
        return res.status(404).json({ status: 'error', message: 'Student identity mapping missing.' });
      }
      query.student = student._id;
    }

    const total = await Complaint.countDocuments(query);

    const complaints = await Complaint.find(query)
      .populate({
        path: 'student',
        select: 'enrollmentNumber user',
        populate: { path: 'user', select: 'firstName lastName email phone' }
      })
      .populate('room', 'roomNumber hostelBlock floorNumber')
      .populate('assignedWarden', 'firstName lastName')
      .skip(startIndex)
      .limit(limit)
      .sort({ createdAt: -1 });

    res.status(200).json({
      status: 'success',
      results: complaints.length,
      pagination: { total, page, pages: Math.ceil(total / limit), limit },
      data: { complaints }
    });

  } catch (error) {
    next(error);
  }
};

// @desc    Update ticket progression status or assign accountability
// @route   PATCH /api/v1/complaints/:id
// @access  Private / Admin & Warden
export const updateComplaintStatus = async (req, res, next) => {
  try {
    const { status, assignedWarden } = req.body;
    const complaint = await Complaint.findById(req.params.id)
      .populate({
        path: 'student',
        populate: { path: 'user' }
      });

    if (!complaint) {
      return res.status(404).json({ status: 'error', message: 'Service ticket not found.' });
    }

    const oldStatus = complaint.status;

    if (status) complaint.status = status;
    if (assignedWarden) complaint.assignedWarden = assignedWarden;

    const updatedComplaint = await complaint.save();

    // Log the status mutation securely
    await ActivityLog.create({
      user: req.user._id,
      action: 'COMPLAINT_UPDATED',
      module: 'Complaints',
      description: `Cycled ticket state from ${oldStatus} to ${updatedComplaint.status}`,
      ipAddress: req.ip || req.socket?.remoteAddress,
      metadata: { complaintId: updatedComplaint._id, status: updatedComplaint.status }
    });

    // Dispatch real-time state change email to the student
    if (status && oldStatus !== status && complaint.student?.user?.email) {
      await sendEmail({
        to: complaint.student.user.email,
        subject: `SmartHostel System - Service Ticket Status: ${status}`,
        html: emailTemplates.complaintUpdate(complaint.title, status, 'State transitioned by block warden.')
      });
    }

    res.status(200).json({
      status: 'success',
      message: 'Service ticket workflow state updated.',
      data: { complaint: updatedComplaint }
    });

  } catch (error) {
    next(error);
  }
};

// @desc    Append a dialogue comment to the ticket thread
// @route   POST /api/v1/complaints/:id/comments
// @access  Private
export const addComplaintComment = async (req, res, next) => {
  try {
    const { message } = req.body;

    const complaint = await Complaint.findById(req.params.id)
      .populate({
        path: 'student',
        populate: { path: 'user' }
      });

    if (!complaint) {
      return res.status(404).json({ status: 'error', message: 'Service ticket not found.' });
    }

    // Append thread node
    complaint.comments.push({
      postedBy: req.user._id,
      message,
      postedAt: new Date()
    });

    await complaint.save();

    // Log the comment securely
    await ActivityLog.create({
      user: req.user._id,
      action: 'COMPLAINT_COMMENTED',
      module: 'Complaints',
      description: `Appended feedback dialogue to ticket ${complaint._id}`,
      ipAddress: req.ip || req.socket?.remoteAddress,
      metadata: { complaintId: complaint._id }
    });

    // If an Admin/Warden posts a comment, notify the student
    if (req.user.role !== 'Student' && complaint.student?.user?.email) {
      await sendEmail({
        to: complaint.student.user.email,
        subject: `SmartHostel System - New Feedback on Ticket`,
        html: emailTemplates.complaintUpdate(complaint.title, complaint.status, message)
      });
    }

    res.status(201).json({
      status: 'success',
      message: 'Comment appended to dialogue thread.',
      data: { complaint }
    });

  } catch (error) {
    next(error);
  }
};
