// src/components/auth/AuthLayout.tsx
import React from 'react';
import { Link } from 'react-router-dom';

interface AuthLayoutProps {
  title: string;
  subtitle: string;
  linkText: string;
  linkPath: string;
  children: React.ReactNode;
}

const AuthLayout: React.FC<AuthLayoutProps> = ({
  title,
  subtitle,
  linkText,
  linkPath,
  children,
}) => {
  return (
    <div className="flex flex-col justify-center min-h-screen py-12 bg-gray-50 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <div className="flex justify-center">
          <div className="flex items-center justify-center w-16 h-16 text-2xl font-bold text-white bg-blue-500 rounded-full">
            D
          </div>
        </div>
        <h2 className="mt-6 text-3xl font-extrabold text-center text-gray-900">
          {title}
        </h2>
        <p className="mt-2 text-sm text-center text-gray-600">
          {subtitle}{' '}
          <Link
            to={linkPath}
            className="font-medium text-blue-600 hover:text-blue-500"
          >
            {linkText}
          </Link>
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        {children}
      </div>
    </div>
  );
};

export default AuthLayout;