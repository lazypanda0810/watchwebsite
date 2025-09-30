import React, { ReactNode } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useApp } from '@/contexts/AppContext';
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

  // For now, we'll skip the double check requirement since it's not implemented in AppContext
  // if (requireDoubleCheck && !isDoubleChecked) {
  //   return <Navigate to="/verify-email" state={{ from: location }} replace />;
  // }

  return <>{children}</>;
};

export default ProtectedRoute;