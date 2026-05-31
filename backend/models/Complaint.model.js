import mongoose from 'mongoose';

const CommentSchema = new mongoose.Schema({
  postedBy: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'User', 
    required: true 
  },
  message: { 
    type: String, 
    required: [true, 'Comment payload cannot be empty'],
    trim: true 
  },
  postedAt: { 
    type: Date, 
    default: Date.now 
  }
}, { _id: false });

const ComplaintSchema = new mongoose.Schema({
  student: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Student',
    required: [true, 'Originator student reference is required'],
    index: true
  },
  room: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Room',
    required: [true, 'Defect location room reference is required'],
    index: true
  },
  category: {
    type: String,
    required: [true, 'Infrastructure defect category is required'],
    enum: ['Electrical', 'Plumbing', 'Carpentry', 'Cleanliness', 'Internet', 'Discipline', 'Other']
  },
  title: {
    type: String,
    required: [true, 'Incident summary title is required'],
    trim: true
  },
  description: {
    type: String,
    required: [true, 'Detailed breakdown of the issue is required'],
    trim: true
  },
  priority: {
    type: String,
    enum: ['Low', 'Medium', 'High', 'Critical'],
    default: 'Medium'
  },
  status: {
    type: String,
    enum: ['Pending', 'In-Progress', 'Resolved', 'Rejected'],
    default: 'Pending'
  },
  assignedWarden: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    default: null
  },
  comments: {
    type: [CommentSchema],
    default: []
  }
}, {
  timestamps: true
});

// Index optimization for fast status queue and priority filtering
ComplaintSchema.index({ status: 1, priority: 1 });

export const Complaint = mongoose.model('Complaint', ComplaintSchema);
