import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import ChatWindow from '../components/ChatWindow';
import ChatInput from '../components/ChatInput';
import { logout } from '../features/auth/authSlice';

const ChatPage: React.FC = () => {

  const dispatch = useDispatch();
  const navigate = useNavigate();
  
  const user = useSelector((state:any) => state.auth.user);

  const handleLogout = () => {
    dispatch(logout());
    navigate('/login');
  };

  return (
    <div className="flex flex-col h-screen bg-gray-50">
      <header className="flex items-center justify-between px-6 py-4 bg-white shadow-sm">
        <div className="flex items-center space-x-4">
          <h1 className="text-xl font-semibold text-gray-800">EngageBot Chat</h1>
          <button
            onClick={() => navigate('/jobs')}
            className="px-4 py-2 text-blue-500 transition-colors border border-blue-500 rounded-md hover:bg-blue-50"
          >
            Jobs Page
          </button>
        </div>
        
        <div className="flex items-center space-x-4">
          <span className="text-gray-600">
            Welcome, {`${user?.firstname} ${user?.lastname}` || user?.email}
          </span>
          <button
            onClick={handleLogout}
            className="px-4 py-2 text-white transition-colors bg-blue-500 rounded-md hover:bg-blue-600"
          >
            Logout
          </button>
        </div>
      </header>
      <main className="flex flex-col flex-1 overflow-hidden">
        <ChatWindow />
        <ChatInput />
      </main>
    </div>
  );
};

export default ChatPage;