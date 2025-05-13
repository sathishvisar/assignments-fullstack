import React, { useEffect, useRef } from 'react';
import { useSocket } from '../contexts/SocketContext';
import ChatMessage from './ChatMessage';
import { useParams } from 'react-router-dom';

const ChatWindow: React.FC = () => {
  const { id } = useParams();
  const { socket, messages, isTyping } = useSocket(id!);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  useEffect(() => {
    if (socket && id) {
      socket.emit('init_chat', id);
    }
  }, [socket, id]);


  return (
    <div className="flex-1 p-4 overflow-y-auto">
      <div className="max-w-4xl mx-auto">
        {messages.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-gray-500">
            <div className="flex items-center justify-center w-16 h-16 mb-4 bg-blue-100 rounded-full">
              <div className="text-2xl font-bold text-blue-500">D</div>
            </div>
            <h2 className="text-xl font-semibold">Hi, I'm EngageBot</h2>
            <p className="max-w-md mt-2 text-center">
              How can I assist you today? Ask me anything!
            </p>
          </div>
        ) : (
          <>
            {messages.map((message, index) => (
              <ChatMessage key={`${message.timestamp}-${index}`} message={message} />
            ))}
            {isTyping && (
              <div className="flex justify-start mb-4">
                <div className="px-4 py-3 text-gray-800 bg-gray-100 rounded-lg">
                  <div className="flex items-center">
                    <div className="flex items-center justify-center w-8 h-8 mr-2 font-bold text-white bg-blue-500 rounded-full">
                      D
                    </div>
                    <div>EngageBot is typing...</div>
                  </div>
                </div>
              </div>
            )}
          </>
        )}
        <div ref={messagesEndRef} />
      </div>
    </div>
  );
};

export default ChatWindow;