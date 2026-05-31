import mongoose from 'mongoose';

const RoomSchema = new mongoose.Schema({
  roomNumber: {
    type: String,
    required: [true, 'Alphanumeric room number is required'],
    uppercase: true,
    trim: true
  },
  hostelBlock: {
    type: String,
    required: [true, 'Hostel block building designator is required'],
    trim: true
  },
  floorNumber: {
    type: Number,
    required: [true, 'Floor index is required'],
    min: 0,
    max: 20
  },
  capacity: {
    type: Number,
    required: [true, 'Maximum room capacity is required'],
    min: [1, 'Room capacity cannot be less than 1'],
    max: [6, 'Hostel safety guidelines forbid more than 6 beds per room'],
    default: 2
  },
  currentOccupancy: {
    type: Number,
    required: true,
    default: 0,
    min: 0
  },
  type: {
    type: String,
    required: [true, 'Room classification type is required'],
    enum: ['Single', 'Double', 'Triple', 'Dormitory']
  },
  facilities: {
    type: [String],
    default: []
  },
  status: {
    type: String,
    required: true,
    enum: {
      values: ['Available', 'Full', 'Maintenance', 'Reserved'],
      message: '{VALUE} is not a valid operational status'
    },
    default: 'Available'
  }
}, {
  timestamps: true
});

// Enforce compound uniqueness for room identifiers per physical block
RoomSchema.index({ hostelBlock: 1, roomNumber: 1 }, { unique: true });

// Optimize lookups filtering by status and availability
RoomSchema.index({ status: 1, currentOccupancy: 1 });

export const Room = mongoose.model('Room', RoomSchema);
