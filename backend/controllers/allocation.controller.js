import { Allocation } from '../models/Allocation.model.js';
import { Room } from '../models/Room.model.js';
import { Student } from '../models/Student.model.js';
import { ActivityLog } from '../models/ActivityLog.model.js';
import { sendEmail, emailTemplates } from '../services/email.service.js';
import mongoose from 'mongoose';

// @desc    Execute an atomic room bed assignment
// @route   POST /api/v1/allocations
// @access  Private / Admin & Warden
export const createAllocation = async (req, res, next) => {
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const { studentId, roomId, bedIdentifier, expectedVacateDate } = req.body;

    // 1. Verify target student profile
    const student = await Student.findById(studentId).populate('user').session(session);
    if (!student) {
      await session.abortTransaction();
      session.endSession();
      return res.status(404).json({ status: 'error', message: 'Candidate student profile not found.' });
    }

    // 2. Check if student already holds an active residency
    const activeAllocation = await Allocation.findOne({ student: studentId, status: 'Active' }).session(session);
    if (activeAllocation) {
      await session.abortTransaction();
      session.endSession();
      return res.status(409).json({ 
        status: 'error', 
        message: `Student already holds an active allocation in Room ${activeAllocation.room}.` 
      });
    }

    // 3. Verify physical room asset capability
    const room = await Room.findById(roomId).session(session);
    if (!room) {
      await session.abortTransaction();
      session.endSession();
      return res.status(404).json({ status: 'error', message: 'Target room asset not found.' });
    }

    if (room.status === 'Maintenance') {
      await session.abortTransaction();
      session.endSession();
      return res.status(400).json({ status: 'error', message: 'Target room is currently locked under Maintenance.' });
    }

    if (room.currentOccupancy >= room.capacity || room.status === 'Full') {
      await session.abortTransaction();
      session.endSession();
      return res.status(400).json({ status: 'error', message: 'Target room bed capacity is completely saturated.' });
    }

    // 4. Create new binding record
    const newAllocation = new Allocation({
      student: studentId,
      room: roomId,
      bedIdentifier,
      expectedVacateDate,
      status: 'Active',
      assignedBy: req.user._id
    });

    await newAllocation.save({ session });

    // 5. Update parent Room occupancy and operational state
    room.currentOccupancy += 1;
    if (room.currentOccupancy >= room.capacity) {
      room.status = 'Full';
    }
    await room.save({ session });

    // 6. Bind currentRoom pointer inside Student profile
    student.currentRoom = roomId;
    await student.save({ session });

    // 7. Write to the immutable audit trail
    const auditLog = new ActivityLog({
      user: req.user._id,
      action: 'ROOM_ALLOCATED',
      module: 'Allocations',
      description: `Assigned resident ${student.enrollmentNumber} to ${room.roomNumber} (${bedIdentifier})`,
      ipAddress: req.ip || req.socket?.remoteAddress,
      metadata: { studentId, roomId, bedIdentifier }
    });
    await auditLog.save({ session });

    // Commit all operations atomically
    await session.commitTransaction();
    session.endSession();

    // Dispatch verification email outside the transaction to avoid transport delays
    if (student.user && student.user.email) {
      const studentName = `${student.user.firstName} ${student.user.lastName}`;
      await sendEmail({
        to: student.user.email,
        subject: 'SmartHostel System - Room Allocation Confirmed',
        html: emailTemplates.roomAllocation(studentName, room.roomNumber, room.hostelBlock)
      });
    }

    res.status(201).json({
      status: 'success',
      message: `Bed ${bedIdentifier} in Room ${room.roomNumber} successfully assigned.`,
      data: {
        allocation: newAllocation
      }
    });

  } catch (error) {
    await session.abortTransaction();
    session.endSession();
    next(error);
  }
};

// @desc    Retrieve active and historical room allocations
// @route   GET /api/v1/allocations
// @access  Private
export const getAllocations = async (req, res, next) => {
  try {
    const page = parseInt(req.query.page, 10) || 1;
    const limit = parseInt(req.query.limit, 10) || 20;
    const startIndex = (page - 1) * limit;

    const query = {};

    if (req.query.status) {
      query.status = req.query.status;
    }

    if (req.query.studentId) {
      query.student = req.query.studentId;
    }

    if (req.query.roomId) {
      query.room = req.query.roomId;
    }

    // Enforce isolation: Students can only list their own assignments
    if (req.user.role === 'Student') {
      const selfStudent = await Student.findOne({ user: req.user._id });
      if (!selfStudent) {
        return res.status(404).json({ status: 'error', message: 'Student profile mapping missing.' });
      }
      query.student = selfStudent._id;
    }

    const total = await Allocation.countDocuments(query);

    const allocations = await Allocation.find(query)
      .populate({
        path: 'student',
        select: 'enrollmentNumber course gender user',
        populate: { path: 'user', select: 'firstName lastName email phone' }
      })
      .populate({
        path: 'room',
        select: 'roomNumber hostelBlock floorNumber type'
      })
      .populate('assignedBy', 'firstName lastName role')
      .skip(startIndex)
      .limit(limit)
      .sort({ allocationDate: -1 });

    res.status(200).json({
      status: 'success',
      results: allocations.length,
      pagination: { total, page, pages: Math.ceil(total / limit), limit },
      data: { allocations }
    });

  } catch (error) {
    next(error);
  }
};

// @desc    Finalize checkout and vacate a resident bed slot
// @route   POST /api/v1/allocations/:id/vacate
// @access  Private / Admin & Warden
export const vacateAllocation = async (req, res, next) => {
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const allocation = await Allocation.findById(req.params.id).session(session);

    if (!allocation) {
      await session.abortTransaction();
      session.endSession();
      return res.status(404).json({ status: 'error', message: 'Allocation record not found.' });
    }

    if (allocation.status !== 'Active') {
      await session.abortTransaction();
      session.endSession();
      return res.status(400).json({ status: 'error', message: `Allocation is already flagged as '${allocation.status}'.` });
    }

    // 1. Mark allocation record as vacated
    allocation.status = 'Vacated';
    allocation.actualVacateDate = new Date();
    await allocation.save({ session });

    // 2. Decrement room occupancy and open availability
    const room = await Room.findById(allocation.room).session(session);
    if (room && room.currentOccupancy > 0) {
      room.currentOccupancy -= 1;
      if (room.status === 'Full') {
        room.status = 'Available';
      }
      await room.save({ session });
    }

    // 3. Clear active room reference on student profile
    const student = await Student.findById(allocation.student).session(session);
    if (student) {
      student.currentRoom = null;
      await student.save({ session });
    }

    // 4. Log the checkout in the audit trail
    const auditLog = new ActivityLog({
      user: req.user._id,
      action: 'ROOM_VACATED',
      module: 'Allocations',
      description: `Finalized room checkout for Allocation ${allocation._id}`,
      ipAddress: req.ip || req.socket?.remoteAddress,
      metadata: { allocationId: allocation._id, roomId: allocation.room }
    });
    await auditLog.save({ session });

    await session.commitTransaction();
    session.endSession();

    res.status(200).json({
      status: 'success',
      message: 'Checkout complete. Room occupancy decremented.',
      data: { allocation }
    });

  } catch (error) {
    await session.abortTransaction();
    session.endSession();
    next(error);
  }
};
