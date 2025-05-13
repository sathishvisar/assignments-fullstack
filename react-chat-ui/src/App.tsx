// src/App.tsx
import React from 'react';
import { BrowserRouter as Router, useRoutes } from 'react-router-dom';
import { Provider, useSelector } from 'react-redux';
import { ToastContainer } from 'react-toastify'; 
import { AuthProvider } from './contexts/AuthContext';
import { SocketProvider } from './contexts/SocketContext';
import { store } from './redux/store';

import { getRoutes } from './routes';

const AppRoutes = () => {
  const user = useSelector((state: any) => state.auth.user);
  const routes = getRoutes(user);
  return useRoutes(routes);
};


const App: React.FC = () => {
  return (
    <Router>
      <Provider store={store}>
        <AuthProvider>
          <SocketProvider>
             <AppRoutes />
          </SocketProvider>
        </AuthProvider>
        <ToastContainer />
      </Provider>
    </Router>
  );
};

export default App;