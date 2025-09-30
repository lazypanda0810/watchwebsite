import React, { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { XCircle, RefreshCw, Home, CreditCard, HelpCircle } from 'lucide-react';

const PaymentFailure: React.FC = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [error, setError] = useState('');
  const [retryCount, setRetryCount] = useState(0);

  useEffect(() => {
    const errorParam = searchParams.get('error');
    if (errorParam) {
      setError(decodeURIComponent(errorParam));
    } else {
      setError('Payment was not completed successfully');
    }
  }, [searchParams]);

  const getErrorMessage = (error: string) => {
    const lowerError = error.toLowerCase();
    
    if (lowerError.includes('cancelled') || lowerError.includes('dismissed')) {
      return {
        title: 'Payment Cancelled',
        message: 'You cancelled the payment process. No amount has been charged.',
        suggestion: 'You can retry the payment or contact support if you need assistance.'
      };
    }
    
    if (lowerError.includes('network') || lowerError.includes('connection')) {
      return {
        title: 'Network Error',
        message: 'There was a network connectivity issue during payment.',
        suggestion: 'Please check your internet connection and try again.'
      };
    }
    
    if (lowerError.includes('insufficient') || lowerError.includes('declined')) {
      return {
        title: 'Payment Declined',
        message: 'Your payment was declined by the bank or payment provider.',
        suggestion: 'Please check your card details, balance, or try a different payment method.'
      };
    }
    
    if (lowerError.includes('expired') || lowerError.includes('timeout')) {
      return {
        title: 'Session Expired',
        message: 'Your payment session has expired.',
        suggestion: 'Please start a new payment process.'
      };
    }
    
    return {
      title: 'Payment Failed',
      message: error || 'An unexpected error occurred during payment processing.',
      suggestion: 'Please try again or contact our support team for assistance.'
    };
  };

  const errorInfo = getErrorMessage(error);

  const retryPayment = () => {
    setRetryCount(prev => prev + 1);
    // Navigate back to checkout page
    navigate('/checkout');
  };

  const contactSupport = () => {
    // In a real application, this could open a support chat or redirect to support page
    window.open('mailto:support@chronoswatch.com?subject=Payment Issue&body=I encountered a payment issue: ' + encodeURIComponent(error));
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-2xl mx-auto">
        {/* Failure Header */}
        <div className="text-center mb-8">
          <div className="mx-auto w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mb-4">
            <XCircle className="h-8 w-8 text-red-600" />
          </div>
          <h1 className="text-3xl font-bold text-gray-900">{errorInfo.title}</h1>
          <p className="mt-2 text-sm text-gray-600">
            Don't worry, no amount has been charged to your account
          </p>
        </div>

        {/* Error Details Card */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="text-red-600">What went wrong?</CardTitle>
            <CardDescription>Details about the payment issue</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <Alert variant="destructive">
              <XCircle className="h-4 w-4" />
              <AlertDescription>
                {errorInfo.message}
              </AlertDescription>
            </Alert>

            <div className="bg-blue-50 p-4 rounded-lg">
              <h3 className="font-medium text-blue-900 mb-2">Suggested Actions:</h3>
              <p className="text-sm text-blue-800">{errorInfo.suggestion}</p>
            </div>

            {retryCount > 0 && (
              <div className="bg-yellow-50 p-4 rounded-lg">
                <p className="text-sm text-yellow-800">
                  <strong>Retry attempt:</strong> {retryCount}
                  {retryCount >= 3 && ' - If you continue to face issues, please contact support.'}
                </p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Action Buttons */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
          <Button 
            onClick={retryPayment} 
            className="w-full"
            disabled={retryCount >= 5}
          >
            <CreditCard className="mr-2 h-4 w-4" />
            {retryCount >= 5 ? 'Max Retries Reached' : 'Retry Payment'}
          </Button>
          
          <Button onClick={() => navigate('/')} variant="outline" className="w-full">
            <Home className="mr-2 h-4 w-4" />
            Back to Home
          </Button>
        </div>

        {/* Help Section */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <HelpCircle className="h-5 w-5" />
              <span>Need Help?</span>
            </CardTitle>
            <CardDescription>Common payment issues and solutions</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-3">
              <div>
                <h4 className="font-medium text-gray-900">Payment Declined?</h4>
                <p className="text-sm text-gray-600">
                  Check with your bank for daily transaction limits or insufficient funds.
                </p>
              </div>
              
              <div>
                <h4 className="font-medium text-gray-900">Network Issues?</h4>
                <p className="text-sm text-gray-600">
                  Ensure stable internet connection and try from a different network if possible.
                </p>
              </div>
              
              <div>
                <h4 className="font-medium text-gray-900">Card Issues?</h4>
                <p className="text-sm text-gray-600">
                  Verify card details, expiry date, and CVV. Try a different card if available.
                </p>
              </div>
            </div>

            <div className="border-t pt-4">
              <Button 
                onClick={contactSupport} 
                variant="outline" 
                className="w-full"
              >
                <HelpCircle className="mr-2 h-4 w-4" />
                Contact Support Team
              </Button>
            </div>

            <div className="text-center space-y-1 text-sm text-gray-500">
              <p><strong>Email:</strong> support@chronoswatch.com</p>
              <p><strong>Phone:</strong> +91 9876543210</p>
              <p><strong>Support Hours:</strong> Mon-Sat, 9:00 AM - 6:00 PM IST</p>
            </div>
          </CardContent>
        </Card>

        {/* Security Notice */}
        <div className="mt-6 text-center">
          <p className="text-xs text-gray-500">
            🔒 Your payment information is secure and encrypted. 
            No sensitive data is stored on our servers.
          </p>
        </div>
      </div>
    </div>
  );
};

export default PaymentFailure;