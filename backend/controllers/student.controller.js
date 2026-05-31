import { Student } from '../models/Student.model.js';
import { User } from '../models/User.model.js';
import { Allocation } from '../models/Allocation.model.js';
import { Room } from '../models/Room.model.js';
import { ActivityLog } from '../models/ActivityLog.model.js';
import mongoose from 'mongoose';

// @desc    Onboard a new student resident
// @route   POST /api/v1/students
// @access  Private / Admin Only
export const createStudent = async (req, res, next) => {
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const { 
      email, password, firstName, lastName, phone,
      enrollmentNumber, course, gender, dateOfBirth,
      address, guardian, medicalInfo 
    } = req.body;

    // Verify existing user or enrollment duplicate
    const userExists = await User.findOne({ email }).session(session);
    if (userExists) {
      await session.abortTransaction();
      session.endSession();
      return res.status(409).json({ status: 'error', message: 'Email address already mapped to an active user.' });
    }

    const studentExists = await Student.findOne({ enrollmentNumber }).session(session);
    if (studentExists) {
      await session.abortTransaction();
      session.endSession();
      return res.status(409).json({ status: 'error', message: 'Enrollment number already mapped to an existing student.' });
    }

    // 1. Create central User authentication entry
    const newUser = new User({
      email,
      passwordHash: password,
      role: 'Student',
      firstName,
      lastName,
      phone,
      status: 'Active'
    });

    await newUser.save({ session });

    // 2. Create rich operational Student domain entity
    const newStudent = new Student({
      user: newUser._id,
      enrollmentNumber,
      course,
      gender,
      dateOfBirth,
      address,
      guardian,
      medicalInfo: medicalInfo || {}
    });

    await newStudent.save({ session });

    // Commit transaction cleanly
    await session.commitTransaction();
    session.endSession();

    newUser.passwordHash = undefined;

    res.status(201).json({
      status: 'success',
      message: 'Student onboarded successfully. User identity and academic profile linked.',
      data: {
        student: newStudent,
        user: newUser
      }
    });

  } catch (error) {
    await session.abortTransaction();
    session.endSession();
    next(error);
  }
};

// @desc    Retrieve all students with pagination and search
// @route   GET /api/v1/students
// @access  Private / Admin & Warden
export const getStudents = async (req, res, next) => {
  try {
    const page = parseInt(req.query.page, 10) || 1;
    const limit = parseInt(req.query.limit, 10) || 10;
    const startIndex = (page - 1) * limit;

    // Search Query Engine
    const query = {};

    if (req.query.search) {
      const searchRegex = new RegExp(req.query.search, 'i');
      // Resolve across enrollment ID or academic course
      query.$or = [
        { enrollmentNumber: searchRegex },
        { course: searchRegex }
      ];
    }

    if (req.query.gender) {
      query.gender = req.query.gender;
    }

    const total = await Student.countDocuments(query);

    const students = await Student.find(query)
      .populate({
        path: 'user',
        select: 'firstName lastName email phone status'
      })
      .populate({
        path: 'currentRoom',
        select: 'roomNumber hostelBlock floorNumber type status'
      })
      .skip(startIndex)
      .limit(limit)
      .sort({ createdAt: -1 });

    res.status(200).json({
      status: 'success',
      results: students.length,
      pagination: {
        total,
        page,
        pages: Math.ceil(total / limit),
        limit
      },
      data: {
        students
      }
    });

  } catch (error) {
    next(error);
  }
};

// @desc    Get single student detail profile
// @route   GET /api/v1/students/:id
// @access  Private
export const getStudentById = async (req, res, next) => {
  try {
    const student = await Student.findById(req.params.id)
      .populate('user', 'firstName lastName email phone status role')
      .populate('currentRoom');

    if (!student) {
      return res.status(404).json({
        status: 'error',
        message: 'Student profile not found.'
      });
    }

    // Role-based security boundary: Students can only view their own identity profile
    if (req.user.role === 'Student' && student.user._id.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        status: 'error',
        message: 'Access denied. You are not authorized to view another student profile.'
      });
    }

    res.status(200).json({
      status: 'success',
      data: {
        student
      }
    });

  } catch (error) {
    next(error);
  }
};

// @desc    Update student operational profile
// @route   PUT /api/v1/students/:id
// @access  Private
export const updateStudent = async (req, res, next) => {
  try {
    const student = await Student.findById(req.params.id);

    if (!student) {
      return res.status(404).json({
        status: 'error',
        message: 'Student profile not found.'
      });
    }

    // Access authorization check
    if (req.user.role === 'Student' && student.user.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        status: 'error',
        message: 'Access denied. You can only modify your own profile attributes.'
      });
    }

    const { course, address, guardian, medicalInfo } = req.body;

    if (course) student.course = course;
    if (address) student.address = address;
    if (guardian) student.guardian = guardian;
    if (medicalInfo) student.medicalInfo = medicalInfo;

    const updatedStudent = await student.save();

    res.status(200).json({
      status: 'success',
      message: 'Student profile updated successfully.',
      data: {
        student: updatedStudent
      }
    });

  } catch (error) {
    next(error);
  }
};

// @desc    Delete a student profile and cascade cleanup active room allocations
// @route   DELETE /api/v1/students/:id
// @access  Private / Admin Only
export const deleteStudent = async (req, res, next) => {
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const student = await Student.findById(req.params.id).session(session);

    if (!student) {
      await session.abortTransaction();
      session.endSession();
      return res.status(404).json({
        status: 'error',
        message: 'Student profile not found.'
      });
    }

    // 1. Find any active allocations and vacate them safely
    const activeAllocations = await Allocation.find({ student: student._id, status: 'Active' }).session(session);
    for (const alloc of activeAllocations) {
      alloc.status = 'Vacated';
      alloc.actualVacateDate = new Date();
      await alloc.save({ session });

      // Decrement room occupancy safely
      const room = await Room.findById(alloc.room).session(session);
      if (room && room.currentOccupancy > 0) {
        room.currentOccupancy -= 1;
        if (room.status === 'Full') {
          room.status = 'Available';
        }
        await room.save({ session });
      }
    }

    // 2. Remove the student profile
    await Student.findByIdAndDelete(student._id).session(session);

    // 3. Remove the central user account to allow re-registration
    if (student.user) {
      await User.findByIdAndDelete(student.user).session(session);
    }

    // 4. Write to the immutable audit trail
    const auditLog = new ActivityLog({
      user: req.user._id,
      action: 'STUDENT_DELETED',
      module: 'Students',
      description: `Deleted student profile and user context for enrollment ${student.enrollmentNumber}`,
      ipAddress: req.ip || req.socket?.remoteAddress,
      metadata: { studentId: student._id, enrollmentNumber: student.enrollmentNumber }
    });
    await auditLog.save({ session });

    await session.commitTransaction();
    session.endSession();

    res.status(200).json({
      status: 'success',
      message: 'Student profile, user credentials, and active room allocations completely removed.'
    });

  } catch (error) {
    await session.abortTransaction();
    session.endSession();
    next(error);
  }
};
