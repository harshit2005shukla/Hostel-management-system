import { Room } from '../models/Room.model.js';
import { Complaint } from '../models/Complaint.model.js';
import { Fee } from '../models/Fee.model.js';
import { Allocation } from '../models/Allocation.model.js';

// Helper: Convert array of flat objects to strict CSV string
const convertToCSV = (data, fields) => {
  const header = fields.map(f => `"${f.label.replace(/"/g, '""')}"`).join(',');
  const rows = data.map(row => {
    return fields.map(f => {
      let val = f.value(row);
      if (val === null || val === undefined) val = '';
      return `"${String(val).replace(/"/g, '""')}"`;
    }).join(',');
  });
  return [header, ...rows].join('\n');
};

// @desc    Export native CSV report for Hostel Occupancy
// @route   GET /api/v1/reports/occupancy/csv
// @access  Private / Admin & Warden
export const exportOccupancyReport = async (req, res, next) => {
  try {
    const query = {};
    if (req.query.hostelBlock) query.hostelBlock = new RegExp(req.query.hostelBlock, 'i');
    if (req.query.status) query.status = req.query.status;

    const rooms = await Room.find(query).sort({ hostelBlock: 1, floorNumber: 1, roomNumber: 1 });

    const fields = [
      { label: 'Hostel Block', value: r => r.hostelBlock },
      { label: 'Room Number', value: r => r.roomNumber },
      { label: 'Floor Level', value: r => r.floorNumber },
      { label: 'Room Type', value: r => r.type },
      { label: 'Total Capacity', value: r => r.capacity },
      { label: 'Current Occupancy', value: r => r.currentOccupancy },
      { label: 'Operational Status', value: r => r.status },
      { label: 'Facilities Configured', value: r => (r.facilities || []).join('; ') }
    ];

    const csvStr = convertToCSV(rooms, fields);

    res.header('Content-Type', 'text/csv');
    res.attachment('Hostel_Occupancy_Report.csv');
    return res.send(csvStr);

  } catch (error) {
    next(error);
  }
};

// @desc    Export native CSV report for Complaints
// @route   GET /api/v1/reports/complaints/csv
// @access  Private / Admin & Warden
export const exportComplaintReport = async (req, res, next) => {
  try {
    const query = {};
    if (req.query.status) query.status = req.query.status;
    if (req.query.priority) query.priority = req.query.priority;
    if (req.query.category) query.category = req.query.category;

    const complaints = await Complaint.find(query)
      .populate({
        path: 'student',
        select: 'enrollmentNumber user',
        populate: { path: 'user', select: 'firstName lastName' }
      })
      .populate('room', 'roomNumber hostelBlock')
      .sort({ createdAt: -1 });

    const fields = [
      { label: 'Ticket ID', value: c => c._id },
      { label: 'Originator Enrollment', value: c => c.student?.enrollmentNumber },
      { label: 'Originator Name', value: c => `${c.student?.user?.firstName || ''} ${c.student?.user?.lastName || ''}`.trim() },
      { label: 'Hostel Block', value: c => c.room?.hostelBlock },
      { label: 'Room Number', value: c => c.room?.roomNumber },
      { label: 'Defect Category', value: c => c.category },
      { label: 'Incident Heading', value: c => c.title },
      { label: 'Priority Urgency', value: c => c.priority },
      { label: 'Current Status', value: c => c.status },
      { label: 'Filing Date', value: c => new Date(c.createdAt).toISOString().split('T')[0] }
    ];

    const csvStr = convertToCSV(complaints, fields);

    res.header('Content-Type', 'text/csv');
    res.attachment('Hostel_Complaints_Report.csv');
    return res.send(csvStr);

  } catch (error) {
    next(error);
  }
};

// @desc    Export native CSV report for Financial Ledgers
// @route   GET /api/v1/reports/fees/csv
// @access  Private / Admin Only
export const exportFeeReport = async (req, res, next) => {
  try {
    const query = {};
    if (req.query.status) query.status = req.query.status;
    if (req.query.feeType) query.feeType = req.query.feeType;
    if (req.query.billingPeriod) query.billingPeriod = req.query.billingPeriod;

    const fees = await Fee.find(query)
      .populate({
        path: 'student',
        select: 'enrollmentNumber user currentRoom',
        populate: { path: 'user', select: 'firstName lastName text' }
      })
      .sort({ dueDate: 1 });

    const fields = [
      { label: 'Ledger ID', value: f => f._id },
      { label: 'Student Enrollment', value: f => f.student?.enrollmentNumber },
      { label: 'Student Name', value: f => `${f.student?.user?.firstName || ''} ${f.student?.user?.lastName || ''}`.trim() },
      { label: 'Fee Category', value: f => f.feeType },
      { label: 'Billing Period', value: f => f.billingPeriod },
      { label: 'Total Billed Amount', value: f => f.amount },
      { label: 'Amount Cleared', value: f => f.paidAmount },
      { label: 'Payment Status', value: f => f.status },
      { label: 'Clearing Deadline', value: f => new Date(f.dueDate).toISOString().split('T')[0] },
      { label: 'Transaction Hash', value: f => f.transactionId || 'N/A' }
    ];

    const csvStr = convertToCSV(fees, fields);

    res.header('Content-Type', 'text/csv');
    res.attachment('Hostel_Financial_Ledger_Report.csv');
    return res.send(csvStr);

  } catch (error) {
    next(error);
  }
};
