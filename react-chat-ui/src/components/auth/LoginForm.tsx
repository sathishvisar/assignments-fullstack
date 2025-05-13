// src/components/auth/LoginForm.tsx
import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { toast } from 'react-toastify';
import { useLoginMutation } from '../../features/auth/authApi';
import { setCredentials } from '../../features/auth/authSlice';
import TextInput from '../TextInput';
import Button from '../Button';
import { useNavigate } from 'react-router-dom';

const LoginForm: React.FC = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({ email: '', password: '' });

  const [login, { isLoading, error }] = useLoginMutation();


  const handleChange = (e: any) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
        const res = await login(formData).unwrap();
        dispatch(setCredentials(res));
        toast.success('Logged in successfully!');
        navigate('/chat')
    } catch (err:any) {
        toast.error(err?.data?.message || 'Login failed!');
    }
  };

  return (
    <div className="max-w-md p-8 mx-auto bg-white rounded-lg shadow-md">
      <h2 className="mb-6 text-2xl font-bold text-center text-gray-800">Login to EngageBot</h2>
      
      {error && 'data' in error && (
        <div className="p-3 mb-4 text-red-700 bg-red-100 rounded-md">
          <span>{(error as any).data['error']}</span>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="email" className="block mb-1 text-sm font-medium text-gray-700">
            Email
          </label>
          <TextInput
            name="email"
            type="email"
            value={formData.email}
            onChange={handleChange}
            placeholder="your@email.com"
            required
          />
        </div>

        <div>
          <label htmlFor="password" className="block mb-1 text-sm font-medium text-gray-700">
            Password
          </label>
          <TextInput
            name="password"
            type="password"
            value={formData.password}
            onChange={handleChange}
            placeholder="••••••••"
            required
          />
        </div>

        <Button type="submit" disabled={isLoading} className="w-full">
          {isLoading ? 'Logging in...' : 'Login'}
        </Button>
      </form>
    </div>
  );
};

export default LoginForm;