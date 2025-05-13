import React from 'react';
import { IMessage } from '../types/message';

interface ChatMessageProps {
  message: IMessage;
}

const ChatMessage: React.FC<ChatMessageProps> = ({ message }) => {
  const isUser = message.role === 'user';

  return (
    <div className={`flex mb-4 ${isUser ? 'justify-end' : 'justify-start'}`}>
      <div
        className={`max-w-3xl rounded-lg px-4 py-3 ${
          isUser ? 'bg-blue-500 text-white' : 'bg-gray-100 text-gray-800'
        }`}
      >
        <div className="flex items-start">
          {!isUser && (
            <div className="flex-shrink-0 mt-1 mr-2">
              <div className="flex items-center justify-center w-8 h-8 font-bold text-white bg-blue-500 rounded-full">
                D
              </div>
            </div>
          )}
          <div>
            {!isUser && <div className="mb-1 font-semibold">EngageBot</div>}
            {/* <span>{ JSON.stringify(message) }</span> */}
            <div className="whitespace-pre-wrap">{message.content}</div>
            <div className="mt-1 text-xs opacity-70">
              {new Date(message.timestamp).toLocaleTimeString()}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChatMessage;