import mongoose from 'mongoose';
import bcrypt from 'bcrypt';
import { User } from '../models/User.model';
import { UserRole } from '../../../shared/types/user.types';

async function seedDatabase() {
  try {
    await mongoose.connect(process.env.MONGODB_URI!);

    // Create sigmabread admin account if it doesn't exist
    const adminExists = await User.findOne({ username: 'sigmabread' });
    if (!adminExists) {
      const hashedPassword = await bcrypt.hash('your_secure_password_here', 10);
      await User.create({
        username: 'sigmabread',
        password: hashedPassword,
        role: UserRole.OWNER,
        isGuest: false,
        
