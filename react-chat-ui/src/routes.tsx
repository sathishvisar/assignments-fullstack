import { Navigate } from 'react-router-dom';
import AuthLayout from './components/auth/AuthLayout';
import LoginForm from './components/auth/LoginForm';
import RegisterForm from './components/auth/RegisterForm';
import ChatPage from './pages/ChatPage';
import ListJobs from './pages/ListJobs';

export const getRoutes = (user: any) => [
  {
    path: "/login",
    element: (
      <AuthLayout
        title="Sign in to your account"
        subtitle="Don't have an account?"
        linkText="Register here"
        linkPath="/register"
      >
        <LoginForm />
      </AuthLayout>
    )
  },
  {
    path: "/register",
    element: (
      <AuthLayout
        title="Create a new account"
        subtitle="Already have an account?"
        linkText="Login here"
        linkPath="/login"
      >
        <RegisterForm />
      </AuthLayout>
    )
  },
  {
    path: "/jobs",
    element: <ListJobs />
  },
  {
    path: "/chat/:id",
    element: <ChatPage />
  },
  {
    path: "/",
    element: <Navigate to={user ? "/jobs" : "/login"} />
  },
  {
    path: "*",
    element: <Navigate to="/" />
  }
];
