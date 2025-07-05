
import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
  name: {type: String, required: true },
  email: {type: String, required: true, unique: true },
  password: {type: String, required: true, minlenght: 6 },
  isAdmin: {type: Boolean, default: false },
  verified: {type: Boolean, default: false },
  notificationPreference: {type: String, enum: ['email', 'whatsapp'], default: 'email'},
  phoneNumber: {type: String}
}, {timestamps: true });

const User = mongoose.model('User', userSchema);
export default User;
