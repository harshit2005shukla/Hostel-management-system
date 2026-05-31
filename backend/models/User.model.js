import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

const UserSchema = new mongoose.Schema({
  email: {
    type: String,
    required: [true, 'User email address is required'],
    unique: true,
    trim: true,
    lowercase: true,
    index: true,
    match: [/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/, 'Please provide a valid email format']
  },
  passwordHash: {
    type: String,
    required: [true, 'Account password hash is required'],
    select: false
  },
  role: {
    type: String,
    required: [true, 'System RBAC role is required'],
    enum: {
      values: ['Admin', 'Warden', 'Student'],
      message: '{VALUE} is not a valid system role'
    },
    default: 'Student'
  },
  firstName: {
    type: String,
    required: [true, 'First name is required'],
    trim: true
  },
  lastName: {
    type: String,
    required: [true, 'Last name is required'],
    trim: true
  },
  phone: {
    type: String,
    required: [true, 'Contact phone number is required'],
    trim: true
  },
  status: {
    type: String,
    enum: {
      values: ['Active', 'Suspended', 'Pending'],
      message: '{VALUE} is not an authorized state'
    },
    default: 'Active'
  },
  lastLogin: {
    type: Date,
    default: null
  }
}, {
  timestamps: true
});

// Optimized indexing for fast role-routing lookup
UserSchema.index({ role: 1, status: 1 });

// Pre-save lifecycle hook to cryptographically hash passwords
UserSchema.pre('save', async function(next) {
  if (!this.isModified('passwordHash')) {
    return next();
  }

  try {
    const salt = await bcrypt.genSalt(12);
    this.passwordHash = await bcrypt.hash(this.passwordHash, salt);
    next();
  } catch (error) {
    next(error);
  }
});

// Instance method to compare incoming plain-text secrets against stored hashes
UserSchema.methods.comparePassword = async function(candidatePassword) {
  return await bcrypt.compare(candidatePassword, this.passwordHash);
};

export const User = mongoose.model('User', UserSchema);
