import React, { ReactNode } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useApp } from '@/contexts/AppContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Shield, RefreshCw, AlertTriangle } from 'lucide-react';

interface ProtectedRouteProps {
  children: ReactNode;
  requireDoubleCheck?: boolean;
  requireAdmin?: boolean;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ 
  children, 
  requireDoubleCheck = false,
  requireAdmin = false
}) => {
  const { state } = useApp();
  const location = useLocation();

  if (state.loading) {
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

  if (!state.user) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // Check admin role if required
  if (requireAdmin && state.user.role !== 'admin') {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <Card className="w-full max-w-md">
          <CardHeader className="text-center">
            <AlertTriangle className="mx-auto h-12 w-12 text-red-600 mb-4" />
            <CardTitle className="text-red-600">Access Denied</CardTitle>
            <CardDescription>You don't have permission to access this area</CardDescription>
          </CardHeader>
          <CardContent className="text-center">
            <p className="text-sm text-gray-600 mb-4">
              Admin privileges are required to view this page.
            </p>
            <Navigate to="/" replace />
          </CardContent>
        </Card>
      </div>
    );
  }

  // For now, we'll skip the double check requirement since it's not implemented in AppContext
  // if (requireDoubleCheck && !isDoubleChecked) {
  //   return <Navigate to="/verify-email" state={{ from: location }} replace />;
  // }

  return <>{children}</>;
};

export default ProtectedRoute;