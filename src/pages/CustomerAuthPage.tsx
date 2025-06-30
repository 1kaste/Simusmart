import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams, Link } from 'react-router-dom';
import Button from '../components/ui/Button';
import Input from '../components/ui/Input';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '../components/ui/Card';
import { Icons } from '../components/icons';
import { useAuth } from '../contexts/AuthContext';
import { useData } from '../contexts/DataContext';

const CustomerAuthPage: React.FC = () => {
  const [authMode, setAuthMode] = useState<'login' | 'signup'>('login');
  const { settings } = useData();

  useEffect(() => {
    document.title = `${authMode === 'login' ? 'Login' : 'Sign Up'} - ${settings.shopName}`;
  }, [settings.shopName, authMode]);

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-100 dark:bg-background-dark p-4">
        <div className="w-full max-w-md">
            <Link to="/" className="flex items-center gap-2 justify-center mb-6">
                <Icons.Store className="h-8 w-8 text-primary-dark dark:text-white" />
                <span className="font-bold text-2xl text-primary-dark dark:text-white">{settings.shopName}</span>
            </Link>
            <Card>
                <CardHeader>
                    <div className="flex border-b mb-4">
                        <button 
                            className={`flex-1 p-3 font-semibold ${authMode === 'login' ? 'border-b-2 border-accent-teal text-accent-teal' : 'text-gray-500'}`}
                            onClick={() => setAuthMode('login')}
                        >
                            Login
                        </button>
                        <button 
                             className={`flex-1 p-3 font-semibold ${authMode === 'signup' ? 'border-b-2 border-accent-teal text-accent-teal' : 'text-gray-500'}`}
                             onClick={() => setAuthMode('signup')}
                        >
                            Sign Up
                        </button>
                    </div>
                    <CardTitle>{authMode === 'login' ? 'Welcome Back!' : 'Create an Account'}</CardTitle>
                    <CardDescription>{authMode === 'login' ? 'Enter your details to access your account.' : 'Join us to get the best deals.'}</CardDescription>
                </CardHeader>

                {authMode === 'login' ? <LoginForm /> : <SignUpForm />}
            
                 <p className="text-center text-xs text-gray-500 mt-4 mb-2 px-6">
                    Are you a store owner? <Link to="/admin/login" className="font-semibold text-accent-teal hover:underline">Admin Login</Link>
                </p>
            </Card>
        </div>
    </div>
  );
};

const LoginForm: React.FC = () => {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [searchParams] = useSearchParams();
  
  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Customer login attempt...');
    login();
    alert('Login successful!');
    const redirectPath = searchParams.get('redirect');
    navigate(redirectPath || '/');
  };

  return (
      <form onSubmit={handleLogin}>
        <CardContent className="space-y-4">
            <div className="space-y-2">
            <label htmlFor="email">Email</label>
            <Input id="email" type="email" placeholder="you@example.com" />
            </div>
            <div className="space-y-2">
            <label htmlFor="password">Password</label>
            <Input id="password" type="password" />
            </div>
        </CardContent>
        <CardFooter className="flex flex-col gap-4">
            <Button type="submit" className="w-full" variant="accent">
                Login
            </Button>
        </CardFooter>
      </form>
  )
};

const SignUpForm: React.FC = () => {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [searchParams] = useSearchParams();

  const handleSignUp = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Customer sign up attempt...');
    login();
    alert('Sign up successful! Welcome!');
    const redirectPath = searchParams.get('redirect');
    navigate(redirectPath || '/');
  };

  return (
      <form onSubmit={handleSignUp}>
        <CardContent className="space-y-4">
            <div className="space-y-2">
                <label htmlFor="name">Full Name</label>
                <Input id="name" type="text" placeholder="John Doe" />
            </div>
            <div className="space-y-2">
                <label htmlFor="email">Email</label>
                <Input id="email" type="email" placeholder="you@example.com" />
            </div>
            <div className="space-y-2">
                <label htmlFor="password">Password</label>
                <Input id="password" type="password" />
            </div>
        </CardContent>
        <CardFooter>
            <Button type="submit" className="w-full" variant="accent">
                Create Account
            </Button>
        </CardFooter>
    </form>
  )
};


export default CustomerAuthPage;