
import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

const userSchema = new mongoose.Schema({
  name: {type: String, required: true },
  email: {type: String, required: true, unique: true },
  password: {type: String, required: true, minlenght: 6 },
  isAdmin: {type: Boolean, default: false },
  verified: {type: Boolean, default: false },
  notificationPreference: {type: String, enum: ['email', 'whatsapp'], default: 'email'},
  phoneNumber: {type: String}
}, {timestamps: true });

userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next ();
  try {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    return next();
  } catch (err) {
    return next(err);
  }
});

const User = mongoose.model('User', userSchema);
export default User;
