// src/hooks/useLogout.ts
import { useDispatch } from 'react-redux';
import { logout } from '../features/auth/authSlice'; 

const useLogout = () => {
  const dispatch = useDispatch();

  const handleLogout = () => {
    dispatch(logout());
  };

  return handleLogout;
};

export default useLogout;
