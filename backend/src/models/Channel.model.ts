import mongoose from 'mongoose';

const channelSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    enum: ['announcements', 'chat', 'links'],
  },
  allowedRoles: [{
    type: String,
    required: true,
  }],
  messages: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Message',
  }],
});

export const Channel = mongoose.model('Channel', channelSchema);
