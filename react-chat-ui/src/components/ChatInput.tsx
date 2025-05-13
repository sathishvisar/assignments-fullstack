import React, { useState, useEffect } from 'react';
import TextInput from './TextInput';
import SendButton from './SendButton';
import { useSocket } from '../contexts/SocketContext';
import { useParams } from 'react-router-dom';
import { useSelector } from 'react-redux';

const ChatInput: React.FC = () => {
  const { id } = useParams();
  const user = useSelector((state:any) => state.auth.user);

  const [inputValue, setInputValue] = useState('');
  const { socket, sendMessage } = useSocket(id!);
  const [isTyping, setIsTyping] = useState(false);

  useEffect(() => {
    if (!socket) return;

    const timer = setTimeout(() => {
      if (isTyping) {
        socket.emit('typing', false);
        setIsTyping(false);
      }
    }, 2000);

    return () => clearTimeout(timer);
  }, [inputValue, isTyping, socket]);

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputValue(e.target.value);
    if (!isTyping && socket && e.target.value) {
      socket.emit('typing', true);
      setIsTyping(true);
    }
  };

  const handleSend = () => {
    if (!inputValue.trim()) return;
    sendMessage({
      jobId: id,
      userId: user._id,
      content: inputValue
    });
    setInputValue('');
    if (socket) {
      socket.emit('typing', false);
    }
  };

  return (
    <div className="flex items-center p-4 bg-white border-t border-gray-200">
      <div className="flex-grow">
        <TextInput
          name='message'
          value={inputValue}
          onChange={handleInputChange}
          placeholder="Message EngageBot..."
          onKeyPress={handleKeyPress}
        />
      </div>
      <SendButton onClick={handleSend} disabled={!inputValue.trim()} />
    </div>
  );
};

export default ChatInput;