import { Fee } from '../models/Fee.model.js';
import { Student } from '../models/Student.model.js';
import { ActivityLog } from '../models/ActivityLog.model.js';
import { sendEmail, emailTemplates } from '../services/email.service.js';

// @desc    Generate a fee line item or operational fine
// @route   POST /api/v1/fees
// @access  Private / Admin Only
export const createFee = async (req, res, next) => {
  try {
    const { studentId, feeType, amount, dueDate, billingPeriod } = req.body;

    const student = await Student.findById(studentId).populate('user');
    if (!student) {
      return res.status(404).json({ status: 'error', message: 'Target student profile not found.' });
    }

    const newFee = await Fee.create({
      student: studentId,
      feeType,
      amount,
      dueDate,
      billingPeriod,
      status: 'Pending',
      paidAmount: 0
    });

    // Write to the immutable audit trail
    await ActivityLog.create({
      user: req.user._id,
      action: 'FEE_GENERATED',
      module: 'Fees',
      description: `Applied ${feeType} of ₹${amount} to student ${student.enrollmentNumber}`,
      ipAddress: req.ip || req.socket?.remoteAddress,
      metadata: { feeId: newFee._id, feeType, amount }
    });

    res.status(201).json({
      status: 'success',
      message: 'Accounting ledger entry generated successfully.',
      data: { fee: newFee }
    });

  } catch (error) {
    next(error);
  }
};

// @desc    Retrieve personal or universal accounting outstandings
// @route   GET /api/v1/fees
// @access  Private
export const getFees = async (req, res, next) => {
  try {
    const page = parseInt(req.query.page, 10) || 1;
    const limit = parseInt(req.query.limit, 10) || 20;
    const startIndex = (page - 1) * limit;

    const query = {};

    if (req.query.status) query.status = req.query.status;
    if (req.query.feeType) query.feeType = req.query.feeType;
    if (req.query.billingPeriod) query.billingPeriod = req.query.billingPeriod;

    // Enforce role barrier: Students see only personal dues
    if (req.user.role === 'Student') {
      const student = await Student.findOne({ user: req.user._id });
      if (!student) {
        return res.status(404).json({ status: 'error', message: 'Student profile mapping missing.' });
      }
      query.student = student._id;
    } else if (req.query.studentId) {
      query.student = req.query.studentId;
    }

    const total = await Fee.countDocuments(query);

    const fees = await Fee.find(query)
      .populate({
        path: 'student',
        select: 'enrollmentNumber user currentRoom',
        populate: { path: 'user', select: 'firstName lastName email phone' }
      })
      .skip(startIndex)
      .limit(limit)
      .sort({ dueDate: 1 });

    res.status(200).json({
      status: 'success',
      results: fees.length,
      pagination: { total, page, pages: Math.ceil(total / limit), limit },
      data: { fees }
    });

  } catch (error) {
    next(error);
  }
};

// @desc    Reconcile payment receipt and apply accounting clearance
// @route   POST /api/v1/fees/:id/pay
// @access  Private / Admin Only
export const processPayment = async (req, res, next) => {
  try {
    const { paidAmount, transactionId } = req.body;
    const fee = await Fee.findById(req.params.id)
      .populate({
        path: 'student',
        populate: { path: 'user' }
      });

    if (!fee) {
      return res.status(404).json({ status: 'error', message: 'Ledger fee record not found.' });
    }

    if (fee.status === 'Paid' || fee.status === 'Waived') {
      return res.status(400).json({
        status: 'error',
        message: `This fee ledger item is already marked as '${fee.status}'.`
      });
    }

    const currentPaid = fee.paidAmount + Number(paidAmount);

    if (currentPaid >= fee.amount) {
      fee.status = 'Paid';
      fee.paidAmount = fee.amount;
      fee.paymentDate = new Date();
    } else {
      fee.status = 'Partially Paid';
      fee.paidAmount = currentPaid;
    }

    const resolvedTxnId = transactionId || `TXN${Date.now()}`;
    fee.transactionId = resolvedTxnId;

    const updatedFee = await fee.save();

    // Log the successful remittance collection securely
    await ActivityLog.create({
      user: req.user._id,
      action: 'FEE_COLLECTED',
      module: 'Fees',
      description: `Collected remittance of ₹${paidAmount} for fee ${fee._id}`,
      ipAddress: req.ip || req.socket?.remoteAddress,
      metadata: { feeId: fee._id, paidAmount, transactionId: resolvedTxnId }
    });

    // Dispatch verification digital receipt
    if (fee.student?.user?.email) {
      const studentName = `${fee.student.user.firstName} ${fee.student.user.lastName}`;
      await sendEmail({
        to: fee.student.user.email,
        subject: `SmartHostel System - Payment Receipt: ${fee.feeType}`,
        html: emailTemplates.feeReceipt(studentName, paidAmount, fee.feeType, resolvedTxnId)
      });
    }

    res.status(200).json({
      status: 'success',
      message: 'Remittance processed. Accounting record updated.',
      data: { fee: updatedFee }
    });

  } catch (error) {
    next(error);
  }
};
