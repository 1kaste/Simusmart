import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Button from '../../components/ui/Button';
import Input from '../../components/ui/Input';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '../../components/ui/Card';
import { Icons } from '../../components/icons';
import ThemeToggleButton from '../../components/ThemeToggleButton';
import { useData } from '../../contexts/DataContext';

const AdminLoginPage: React.FC = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const { settings } = useData();

  useEffect(() => {
    document.title = `${settings.shopName} - Admin Login`;
  }, [settings.shopName]);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.startsWith('admin@')) {
      setError('Invalid admin email. Must start with "admin@".');
      return;
    }
    setError('');
    console.log('Login attempt with:', { email, password });
    // In a real app, you'd verify credentials. Here, we just redirect.
    navigate('/admin/dashboard');
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-100 dark:bg-background-dark">
      <div className="absolute top-4 right-4">
        <ThemeToggleButton />
      </div>
      <Card className="w-full max-w-sm">
        <form onSubmit={handleLogin}>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Icons.Store className="h-6 w-6 text-primary-dark dark:text-white"/> 
              {settings.shopName} Admin
            </CardTitle>
            <CardDescription>Enter your credentials to access the dashboard.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <label htmlFor="email" className="text-gray-800 dark:text-gray-300">Email</label>
              <Input
                id="email"
                type="email"
                placeholder="admin@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            <div className="space-y-2">
              <label htmlFor="password" className="text-gray-800 dark:text-gray-300">Password</label>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
            {error && <p className="text-sm text-red-500">{error}</p>}
          </CardContent>
          <CardFooter>
            <Button type="submit" className="w-full">
              Login
            </Button>
          </CardFooter>
        </form>
      </Card>
    </div>
  );
};

export default AdminLoginPage;