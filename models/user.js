import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import { connectDB } from '@/lib/db';

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  createdAt: { type: Date, default: Date.now },
});

userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();
  this.password = await bcrypt.hash(this.password, 10);
  next();
});

userSchema.methods.comparePassword = async function (candidatePassword) {
  return await bcrypt.compare(candidatePassword, this.password);
};

// Export a function that returns the model
export default async function getUserModel() {
  const conn = await connectDB('ezmart');
  return conn.models.User || conn.model('User', userSchema);
}