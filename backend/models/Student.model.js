import mongoose from 'mongoose';

const GuardianSchema = new mongoose.Schema({
  name: { 
    type: String, 
    required: [true, 'Guardian legal name is required'],
    trim: true 
  },
  relation: { 
    type: String, 
    required: [true, 'Relationship to student is required'],
    trim: true 
  },
  phone: { 
    type: String, 
    required: [true, 'Guardian contact number is required'],
    trim: true 
  },
  email: { 
    type: String,
    trim: true,
    lowercase: true 
  }
}, { _id: false });

const AddressSchema = new mongoose.Schema({
  street: { type: String, required: true, trim: true },
  city: { type: String, required: true, trim: true },
  state: { type: String, required: true, trim: true },
  zipCode: { type: String, required: true, trim: true }
}, { _id: false });

const MedicalSchema = new mongoose.Schema({
  bloodGroup: { type: String, trim: true },
  allergies: { type: String, trim: true },
  emergencyContact: { type: String, trim: true }
}, { _id: false });

const StudentSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    unique: true,
    index: true
  },
  enrollmentNumber: {
    type: String,
    required: [true, 'Institutional Enrollment Number is required'],
    unique: true,
    trim: true,
    index: true
  },
  course: {
    type: String,
    required: [true, 'Enrolled academic program is required'],
    trim: true
  },
  gender: {
    type: String,
    required: [true, 'Gender disclosure is required to map hostel block compatibility'],
    enum: ['Male', 'Female', 'Other']
  },
  dateOfBirth: {
    type: Date,
    required: [true, 'Student date of birth is required']
  },
  address: {
    type: AddressSchema,
    required: true
  },
  guardian: {
    type: GuardianSchema,
    required: true
  },
  medicalInfo: {
    type: MedicalSchema,
    default: {}
  },
  currentRoom: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Room',
    default: null,
    index: true
  }
}, {
  timestamps: true
});

export const Student = mongoose.model('Student', StudentSchema);
