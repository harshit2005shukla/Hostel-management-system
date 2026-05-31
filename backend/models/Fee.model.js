import mongoose from 'mongoose';

const FeeSchema = new mongoose.Schema({
  student: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Student',
    required: [true, 'Accountable student reference is required'],
    index: true
  },
  feeType: {
    type: String,
    required: [true, 'Accounting billing category is required'],
    enum: ['Room Rent', 'Mess Fee', 'Maintenance Fine', 'Late Fine', 'Security Deposit']
  },
  amount: {
    type: Number,
    required: [true, 'Total fee value is required'],
    min: [0, 'Fee amount cannot be negative']
  },
  dueDate: {
    type: Date,
    required: [true, 'Final date for penalty-free clearing is required'],
    index: true
  },
  status: {
    type: String,
    required: true,
    enum: ['Pending', 'Paid', 'Overdue', 'Partially Paid', 'Waived'],
    default: 'Pending'
  },
  paidAmount: {
    type: Number,
    required: true,
    default: 0,
    min: 0
  },
  paymentDate: {
    type: Date,
    default: null
  },
  transactionId: {
    type: String,
    trim: true,
    unique: true,
    sparse: true
  },
  billingPeriod: {
    type: String,
    required: [true, 'Accounting billing period designator is required'],
    trim: true
  }
}, {
  timestamps: true
});

// Index to retrieve outstanding balances quickly
FeeSchema.index({ student: 1, status: 1 });

export const Fee = mongoose.model('Fee', FeeSchema);
