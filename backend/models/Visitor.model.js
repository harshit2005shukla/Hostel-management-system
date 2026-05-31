import mongoose from 'mongoose';

const VisitorSchema = new mongoose.Schema({
  visitorName: {
    type: String,
    required: [true, 'Arriving visitor legal name is required'],
    trim: true
  },
  phone: {
    type: String,
    required: [true, 'Verified guest phone number is required'],
    trim: true
  },
  idProofType: {
    type: String,
    required: [true, 'Government documentation class is required'],
    trim: true
  },
  idProofNumber: {
    type: String,
    required: [true, 'Government identity documentation number is required'],
    trim: true
  },
  relationToStudent: {
    type: String,
    required: [true, 'Relation disclosure to host student is required'],
    trim: true
  },
  studentToVisit: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Student',
    required: [true, 'Target resident reference is required'],
    index: true
  },
  checkInTime: {
    type: Date,
    required: true,
    default: Date.now
  },
  checkOutTime: {
    type: Date,
    default: null
  },
  status: {
    type: String,
    required: true,
    enum: ['Checked-In', 'Checked-Out', 'Overstayed'],
    default: 'Checked-In'
  },
  approvedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'Authorizing gate warden reference is required']
  }
}, {
  timestamps: true
});

// Query optimization for active on-premises guests
VisitorSchema.index({ status: 1, checkInTime: 1 });

export const Visitor = mongoose.model('Visitor', VisitorSchema);
