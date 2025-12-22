
import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Please add a name'],
  },
  email: {
    type: String,
    required: [true, 'Please add an email'],
    unique: true,
  },
  password: {
    type: String,
    required: [true, 'Please add a password'],
  },
  isVerified: {
    type: Boolean,
    default: false
  },
  verificationToken: {
    type: String
  },
  notificationSettings: {
    emailAlerts: { type: Boolean, default: true },
    appAlerts: { type: Boolean, default: true }
  }
}, {
  timestamps: true,
});

export default mongoose.model('User', userSchema);
