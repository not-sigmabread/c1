import React, { useEffect, useState } from 'react';
import { io, Socket } from 'socket.io-client';
import { useAuth } from '../../hooks/useAuth';

interface Message {
  content: string;
  user: string;
  timestamp: Date;
}

export const ChatWindow: React.FC = () => {
  const [socket, setSocket] = useState<Socket | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [currentChannel, setCurrentChannel] = useState('chat');
  const { user } = useAuth();

  useEffect(() => {
    const newSocket = io('http://localhost:3001');
    setSocket(newSocket);

    return () => {
      newSocket.close();
    };
  }, []);

  useEffect(() => {
    if (socket && user) {
      socket.emit('joinChannel', currentChannel, user.id);

      socket.on('newMessage', (message: Message) => {
        setMessages(prev => [...prev, message]);
      });
    }
  }, [socket, currentChannel, user]);

  const sendMessage = (content: string) => {
    if (socket && user) {
      socket.emit('sendMessage', {
        channelName: currentChannel,
        content,
        userId: user.id,
      });
    }
  };

  return (
    <div className="chat-window">
      <div className="channel-list">
        <button onClick={() => setCurrentChannel('announcements')}>
          Announcements
        </button>
        <button onClick={() => setCurrentChannel('chat')}>
          Chat
        </button>
        <button onClick={() => setCurrentChannel('links')}>
          Links
        </button>
      </div>

      <div className="messages">
        {messages.map((message, index) => (
          <div key={index} className="message">
            <span className="username">{message.user}</span>
            <span className="content">{message.content}</span>
            <span className="timestamp">
              {new Date(message.timestamp).toLocaleTimeString()}
            </span>
          </div>
        ))}
      </div>

      <MessageInput onSend={sendMessage} />
    </div>
  );
};
