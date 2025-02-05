import mongoose from 'mongoose';
import { UserRole } from '../../../shared/types/user.types';

const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: function() {
      return !this.isGuest;
    },
  },
  role: {
    type: String,
    enum: Object.values(UserRole),
    default: UserRole.USER,
  },
  description: {
    type: String,
    default: '',
  },
  isGuest: {
    type: Boolean,
    default: false,
  },
  permissions: [{
    type: String,
  }],
  friends: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
  }],
  blockedUsers: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
  }],
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

export const User = mongoose.model('User', userSchema);
