import React, { useState } from 'react';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';
import { useRegisterMutation } from '../../features/auth/authApi';
import TextInput from '../TextInput';
import Button from '../Button';


const RegisterForm: React.FC = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({ firstname: '',  lastname: '', email: '', password: '' });

  const [register, { isLoading, error }] = useRegisterMutation();

  const handleChange = (e: any) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
        const res = await register(formData).unwrap();
        navigate('/login')
        toast.success(res?.data?.message || 'Registered successfully!!');
    } catch (err:any) {
        toast.error(err?.data?.error || 'Registration failed!');
    }
  };

  return (
    <div className="max-w-md p-8 mx-auto bg-white rounded-lg shadow-md">
      <h2 className="mb-6 text-2xl font-bold text-center text-gray-800">Create an Account</h2>
      
      {error && 'data' in error && (
        <div className="p-3 mb-4 text-red-700 bg-red-100 rounded-md">
          <span>{(error as any).data['error']}</span>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">

        <div>
          <label htmlFor="firstname" className="block mb-1 text-sm font-medium text-gray-700">
            Firstname
          </label>
          <TextInput
            name="firstname"
            type="text"
            value={formData.firstname}
            onChange={handleChange}
            placeholder="John"
            required
          />
        </div>

        <div>
          <label htmlFor="lastname" className="block mb-1 text-sm font-medium text-gray-700">
            Lastname
          </label>
          <TextInput
            name="lastname"
            type="text"
            value={formData.lastname}
            onChange={handleChange}
            placeholder="Doe"
            required
          />
        </div>

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
          {isLoading ? 'Registering...' : 'Register'}
        </Button>
      </form>
    </div>
  );
};

export default RegisterForm;