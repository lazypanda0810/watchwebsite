import React, { ReactNode } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Shield, RefreshCw } from 'lucide-react';

interface ProtectedRouteProps {
  children: ReactNode;
  requireDoubleCheck?: boolean;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ 
  children, 
  requireDoubleCheck = true 
}) => {
  const { isAuthenticated, isDoubleChecked, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <Card className="w-full max-w-md">
          <CardHeader className="text-center">
            <Shield className="mx-auto h-12 w-12 text-blue-600 mb-4" />
            <CardTitle>Authenticating...</CardTitle>
            <CardDescription>Verifying your security credentials</CardDescription>
          </CardHeader>
          <CardContent className="text-center">
            <RefreshCw className="mx-auto h-8 w-8 animate-spin text-blue-600" />
          </CardContent>
        </Card>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  if (requireDoubleCheck && !isDoubleChecked) {
    return <Navigate to="/verify-email" state={{ from: location }} replace />;
  }

  return <>{children}</>;
};

export default ProtectedRoute;