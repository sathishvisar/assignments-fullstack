import React, { createContext, useContext, useEffect, useRef, useState } from 'react';
import { io, Socket } from 'socket.io-client';
import { IMessage } from '../types/message';

interface ISocketContext {
  socket: Socket | null;
  isConnected: boolean;
  messages: IMessage[];
  sendMessage: (content: any) => void;
  isTyping: boolean;
  clearMessages: () => void;
}

const SocketContext = createContext<ISocketContext>({
  socket: null,
  isConnected: false,
  messages: [],
  sendMessage: () => {},
  isTyping: false,
  clearMessages: () => {}
});


export const useSocket = (jobId: string) => {
  const context = useContext(SocketContext);
  
  useEffect(() => {
    if (context.socket) {
      console.log(`Switching to room: ${jobId}`);
      context.clearMessages();
      context.socket.emit('joinRoom', jobId);
    }
  }, [context.socket, jobId]); 

  return context;
};

interface SocketProviderProps {
  children: React.ReactNode;
}

export const SocketProvider: React.FC<SocketProviderProps> = ({ children }) => {
  const [socket, setSocket] = useState<Socket | null>(null);
  const [isConnected, setIsConnected] = useState(false);
  const [messages, setMessages] = useState<IMessage[]>([]);
  const [isTyping, setIsTyping] = useState(false);
  const clearMessages = () => setMessages([]);

  useEffect(() => {
    const socketInstance = io('http://localhost:3001', {
      auth: {
        token: localStorage.getItem('token'),
      },
    });

    socketInstance.on('connect', () => {
      setIsConnected(true);
    });

    socketInstance.on('disconnect', () => {
      setIsConnected(false);
    });

    socketInstance.on('message', (message: IMessage) => {
      setMessages((prev) => [...prev, message]);
    });

    socketInstance.on('typing', (typing: boolean) => {
      setIsTyping(typing);
    });

    setSocket(socketInstance);

    return () => {
      socketInstance.disconnect();
    };
  }, []);

  const sendMessage = (content: any) => {
    if (!socket) return;
    socket.emit('send_message', content);
  };

  return (
    <SocketContext.Provider
      value={{
        socket,
        isConnected,
        messages,
        sendMessage,
        isTyping,
        clearMessages,
      }}
    >
      {children}
    </SocketContext.Provider>
  );
};
