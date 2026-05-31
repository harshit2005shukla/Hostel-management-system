import { Room } from '../models/Room.model.js';
import { Student } from '../models/Student.model.js';
import { Complaint } from '../models/Complaint.model.js';
import { Visitor } from '../models/Visitor.model.js';
import { Fee } from '../models/Fee.model.js';

// @desc    Retrieve core administrative macro KPIs
// @route   GET /api/v1/dashboard/analytics
// @access  Private / Admin & Warden
export const getDashboardAnalytics = async (req, res, next) => {
  try {
    // 1. Room Occupancy Aggregations
    const roomMetrics = await Room.aggregate([
      {
        $group: {
          _id: null,
          totalRooms: { $sum: 1 },
          totalCapacity: { $sum: '$capacity' },
          totalOccupiedBeds: { $sum: '$currentOccupancy' },
          roomsAvailable: {
            $sum: { $cond: [{ $eq: ['$status', 'Available'] }, 1, 0] }
          },
          roomsFull: {
            $sum: { $cond: [{ $eq: ['$status', 'Full'] }, 1, 0] }
          },
          roomsMaintenance: {
            $sum: { $cond: [{ $eq: ['$status', 'Maintenance'] }, 1, 0] }
          }
        }
      }
    ]);

    const metrics = roomMetrics[0] || {
      totalRooms: 0, totalCapacity: 0, totalOccupiedBeds: 0,
      roomsAvailable: 0, roomsFull: 0, roomsMaintenance: 0
    };

    const occupancyRate = metrics.totalCapacity > 0 
      ? Number(((metrics.totalOccupiedBeds / metrics.totalCapacity) * 100).toFixed(2))
      : 0;

    // 2. Student Resident Distribution
    const totalStudents = await Student.countDocuments();

    // 3. Outstanding Ticket Backlog
    const pendingComplaints = await Complaint.countDocuments({ status: 'Pending' });
    const activeComplaints = await Complaint.countDocuments({ status: { $in: ['Pending', 'In-Progress'] } });

    // 4. Live Gate Registries
    const activeVisitors = await Visitor.countDocuments({ status: 'Checked-In' });

    // 5. Financial Ledger Health
    const feeMetrics = await Fee.aggregate([
      {
        $group: {
          _id: null,
          totalBilled: { $sum: '$amount' },
          totalCollected: { $sum: '$paidAmount' }
        }
      }
    ]);

    const finance = feeMetrics[0] || { totalBilled: 0, totalCollected: 0 };
    const collectionRate = finance.totalBilled > 0
      ? Number(((finance.totalCollected / finance.totalBilled) * 100).toFixed(2))
      : 0;

    res.status(200).json({
      status: 'success',
      data: {
        telemetry: {
          occupancy: {
            totalRooms: metrics.totalRooms,
            totalBeds: metrics.totalCapacity,
            occupiedBeds: metrics.totalOccupiedBeds,
            availableRooms: metrics.roomsAvailable,
            fullRooms: metrics.roomsFull,
            maintenanceRooms: metrics.roomsMaintenance,
            occupancyRate
          },
          residents: {
            totalActiveStudents: totalStudents
          },
          facilities: {
            pendingTickets: pendingComplaints,
            totalActiveTickets: activeComplaints
          },
          security: {
            currentOnPremisesVisitors: activeVisitors
          },
          finance: {
            totalBilledAmount: finance.totalBilled,
            totalCollectedAmount: finance.totalCollected,
            outstandingAmount: finance.totalBilled - finance.totalCollected,
            collectionRate
          }
        },
        timestamp: new Date()
      }
    });

  } catch (error) {
    next(error);
  }
};
