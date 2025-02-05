import { Server, Socket } from 'socket.io';
import { Channel } from '../models/Channel.model';
import { User } from '../models/User.model';

export class ChatService {
  private io: Server;

  constructor(io: Server) {
    this.io = io;
    this.setupSocketHandlers();
  }

  private setupSocketHandlers() {
    this.io.on('connection', (socket: Socket) => {
      // Handle joining channels
      socket.on('joinChannel', async (channelName: string, userId: string) => {
        try {
          const user = await User.findById(userId);
          const channel = await Channel.findOne({ name: channelName });

          if (!channel || !user) return;

          // Check permissions
          if (this.hasChannelAccess(user, channel)) {
            socket.join(channelName);
            socket.emit('channelJoined', channelName);
          }
        } catch (error) {
          console.error('Error joining channel:', error);
        }
      });

      // Handle messages
      socket.on('sendMessage', async (data: {
        channelName: string,
        content: string,
        userId: string
      }) => {
        try {
          const user = await User.findById(data.userId);
          const channel = await Channel.findOne({ name: data.channelName });

          if (!channel || !user) return;

          if (this.hasChannelAccess(user, channel)) {
            const message = {
              content: data.content,
              user: user.username,
              timestamp: new Date(),
            };

            this.io.to(data.channelName).emit('newMessage', message);
          }
        } catch (error) {
          console.error('Error sending message:', error);
        }
      });
    });
  }

  private hasChannelAccess(user: any, channel: any): boolean {
    if (channel.name === 'chat') return true;
    if (channel.name === 'announcements') {
      return ['owner', 'admin', 'moderator'].includes(user.role);
    }
    if (channel.name === 'links') {
      return ['owner', 'admin', 'moderator'].includes(user.role) || 
             user.permissions.includes('link_access');
    }
    return false;
  }
}
