import mongoose from 'mongoose';

const ActivityLogSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'User reference is mandatory for the audit trail'],
    index: true
  },
  action: {
    type: String,
    required: [true, 'Action event identifier is required'],
    index: true
  },
  module: {
    type: String,
    required: [true, 'Affected domain module is required'],
    enum: ['Auth', 'Students', 'Rooms', 'Allocations', 'Complaints', 'Visitors', 'Fees', 'System'],
    index: true
  },
  description: {
    type: String,
    required: [true, 'Detailed audit description is required']
  },
  ipAddress: {
    type: String,
    default: '127.0.0.1'
  },
  metadata: {
    type: Object,
    default: {}
  }
}, {
  timestamps: true
});

// Fast lookups for security auditing
ActivityLogSchema.index({ createdAt: -1 });

export const ActivityLog = mongoose.model('ActivityLog', ActivityLogSchema);
