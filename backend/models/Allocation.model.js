import mongoose from 'mongoose';

const AllocationSchema = new mongoose.Schema({
  student: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Student',
    required: [true, 'Assigned student resident reference is required'],
    index: true
  },
  room: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Room',
    required: [true, 'Allocated physical room reference is required'],
    index: true
  },
  bedIdentifier: {
    type: String,
    required: [true, 'Specific bed slot identifier is required']
  },
  allocationDate: {
    type: Date,
    required: true,
    default: Date.now
  },
  expectedVacateDate: {
    type: Date,
    required: [true, 'Expected checkout date is required']
  },
  actualVacateDate: {
    type: Date,
    default: null
  },
  status: {
    type: String,
    required: true,
    enum: ['Active', 'Vacated', 'Cancelled'],
    default: 'Active'
  },
  assignedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'Staff assignment audit trace reference is required']
  }
}, {
  timestamps: true
});

// Partial unique index to natively prevent a student from holding multiple active room bed allocations concurrently
AllocationSchema.index(
  { student: 1, status: 1 },
  {
    unique: true,
    partialFilterExpression: { status: 'Active' }
  }
);

export const Allocation = mongoose.model('Allocation', AllocationSchema);
