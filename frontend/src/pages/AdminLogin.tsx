import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '@/contexts/AppContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Shield, Lock, User } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

const AdminLogin = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  
  const { actions } = useApp();
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
    setError(''); // Clear error when user types
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      await actions.login(formData.email, formData.password);
      
      // Check if the logged-in user is an admin
      const token = localStorage.getItem('auth_token');
      if (token) {
        // Parse the token to check role (basic check)
        const payload = JSON.parse(atob(token.split('.')[1]));
        if (payload.role === 'admin') {
          toast({
            title: "Admin Login Successful",
            description: "Welcome to the admin dashboard",
          });
          navigate('/admin/dashboard');
        } else {
          setError('Access denied. Admin privileges required.');
          localStorage.removeItem('auth_token');
        }
      }
    } catch (error: any) {
      setError(error.message || 'Login failed. Please check your credentials.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center p-4">
      <div className="w-full max-w-md space-y-8">
        {/* Header */}
        <div className="text-center space-y-2">
          <div className="flex justify-center">
            <div className="bg-white/10 backdrop-blur-sm p-3 rounded-full">
              <Shield className="h-12 w-12 text-white" />
            </div>
          </div>
          <h1 className="text-3xl font-bold text-white">Admin Portal</h1>
          <p className="text-slate-300">Secure access to dashboard</p>
        </div>

        {/* Login Form */}
        <Card className="bg-white/10 backdrop-blur-md border-white/20">
          <CardHeader className="space-y-1">
            <CardTitle className="text-2xl text-center text-white">Sign In</CardTitle>
            <CardDescription className="text-center text-slate-300">
              Enter your admin credentials to access the dashboard
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              {error && (
                <Alert className="bg-red-500/20 border-red-500/50 text-red-100">
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}
              
              <div className="space-y-2">
                <Label htmlFor="email" className="text-white">Email</Label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 h-4 w-4" />
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    placeholder="admin@premiumwatches.com"
                    value={formData.email}
                    onChange={handleChange}
                    required
                    className="pl-10 bg-white/10 border-white/20 text-white placeholder-slate-400 focus:border-white/40"
                  />
                </div>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="password" className="text-white">Password</Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 h-4 w-4" />
                  <Input
                    id="password"
                    name="password"
                    type="password"
                    placeholder="Enter your password"
                    value={formData.password}
                    onChange={handleChange}
                    required
                    className="pl-10 bg-white/10 border-white/20 text-white placeholder-slate-400 focus:border-white/40"
                  />
                </div>
              </div>
              
              <Button 
                type="submit" 
                className="w-full bg-white text-slate-900 hover:bg-slate-100 font-medium"
                disabled={loading}
              >
                {loading ? 'Signing In...' : 'Sign In'}
              </Button>
            </form>
            
            <div className="mt-6 text-center">
              <p className="text-slate-400 text-sm">
                Forgot your credentials? Contact system administrator
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Security Notice */}
        <div className="text-center text-xs text-slate-400 space-y-1">
          <p>🔒 This is a secure admin area</p>
          <p>All access attempts are logged and monitored</p>
        </div>
      </div>
    </div>
  );
};

export default AdminLogin;