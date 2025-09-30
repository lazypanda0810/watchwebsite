import React, { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { CheckCircle, Download, RefreshCw, Home, Package, IndianRupee } from 'lucide-react';

interface PaymentDetails {
  paymentId: string;
  orderId: string;
  amount: number;
  currency: string;
  status: string;
  method: string;
  timestamp: string;
  receipt: string;
}

const PaymentSuccess: React.FC = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [paymentDetails, setPaymentDetails] = useState<PaymentDetails | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchPaymentDetails();
  }, []);

  const fetchPaymentDetails = async () => {
    try {
      // First try to get details from URL params
      const paymentId = searchParams.get('paymentId');
      const orderId = searchParams.get('orderId');

      if (paymentId && orderId) {
        // Try to get details from session first (more secure)
        const sessionResponse = await fetch('/api/payment/success-details', {
          credentials: 'include'
        });

        if (sessionResponse.ok) {
          const sessionData = await sessionResponse.json();
          if (sessionData.success) {
            setPaymentDetails(sessionData.payment);
            setLoading(false);
            return;
          }
        }

        // Fallback to API call with payment ID
        const apiResponse = await fetch(`/api/payment/status/${paymentId}`, {
          credentials: 'include'
        });

        if (apiResponse.ok) {
          const apiData = await apiResponse.json();
          if (apiData.success) {
            setPaymentDetails({
              paymentId: apiData.payment.id,
              orderId: apiData.payment.orderId,
              amount: apiData.payment.amount,
              currency: apiData.payment.currency,
              status: apiData.payment.status,
              method: apiData.payment.method,
              timestamp: new Date(apiData.payment.createdAt * 1000).toISOString(),
              receipt: `receipt_${Date.now()}`
            });
          } else {
            setError('Payment details not found');
          }
        } else {
          setError('Failed to fetch payment details');
        }
      } else {
        setError('Invalid payment reference');
      }
    } catch (err) {
      setError('Failed to load payment details');
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString('en-IN', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const generateInvoice = () => {
    // In a real application, this would generate and download a PDF invoice
    alert('Invoice generation feature will be implemented soon!');
  };

  const trackOrder = () => {
    if (paymentDetails) {
      navigate(`/orders/track/${paymentDetails.receipt}`);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <Card className="w-full max-w-md">
          <CardContent className="pt-6 text-center">
            <RefreshCw className="mx-auto h-12 w-12 animate-spin text-blue-600 mb-4" />
            <p className="text-gray-600">Loading payment details...</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (error || !paymentDetails) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <Card className="w-full max-w-md">
          <CardHeader className="text-center">
            <div className="mx-auto w-12 h-12 bg-red-100 rounded-full flex items-center justify-center mb-4">
              <CheckCircle className="h-6 w-6 text-red-600" />
            </div>
            <CardTitle className="text-red-600">Payment Details Not Found</CardTitle>
            <CardDescription>{error}</CardDescription>
          </CardHeader>
          <CardContent className="text-center space-y-4">
            <Button onClick={() => navigate('/')} className="w-full">
              <Home className="mr-2 h-4 w-4" />
              Go to Home
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-2xl mx-auto">
        {/* Success Header */}
        <div className="text-center mb-8">
          <div className="mx-auto w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-4">
            <CheckCircle className="h-8 w-8 text-green-600" />
          </div>
          <h1 className="text-3xl font-bold text-gray-900">Payment Successful!</h1>
          <p className="mt-2 text-sm text-gray-600">
            Your order has been confirmed and is being processed
          </p>
        </div>

        {/* Payment Details Card */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <span>Payment Details</span>
              <Badge variant="default" className="bg-green-100 text-green-800">
                {paymentDetails.status.toUpperCase()}
              </Badge>
            </CardTitle>
            <CardDescription>
              Transaction completed on {formatDate(paymentDetails.timestamp)}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <p className="text-sm font-medium text-gray-500">Payment ID</p>
                <p className="font-mono text-sm text-gray-900">{paymentDetails.paymentId}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-500">Order ID</p>
                <p className="font-mono text-sm text-gray-900">{paymentDetails.orderId}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-500">Amount Paid</p>
                <div className="flex items-center space-x-1">
                  <IndianRupee className="h-4 w-4" />
                  <span className="text-lg font-semibold text-gray-900">
                    {paymentDetails.amount.toLocaleString()}
                  </span>
                  <span className="text-sm text-gray-500">{paymentDetails.currency}</span>
                </div>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-500">Payment Method</p>
                <p className="text-sm text-gray-900 capitalize">{paymentDetails.method}</p>
              </div>
            </div>

            <Separator />

            <div className="bg-blue-50 p-4 rounded-lg">
              <h3 className="font-medium text-blue-900 mb-2">What happens next?</h3>
              <ul className="text-sm text-blue-800 space-y-1">
                <li>• Order confirmation email has been sent</li>
                <li>• Your order will be processed within 24 hours</li>
                <li>• You will receive tracking details via SMS and email</li>
                <li>• Estimated delivery: 3-5 business days</li>
              </ul>
            </div>
          </CardContent>
        </Card>

        {/* Action Buttons */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <Button onClick={generateInvoice} variant="outline" className="w-full">
            <Download className="mr-2 h-4 w-4" />
            Download Invoice
          </Button>
          
          <Button onClick={trackOrder} variant="outline" className="w-full">
            <Package className="mr-2 h-4 w-4" />
            Track Order
          </Button>
          
          <Button onClick={() => navigate('/')} className="w-full">
            <Home className="mr-2 h-4 w-4" />
            Continue Shopping
          </Button>
        </div>

        {/* Order Summary */}
        <Card>
          <CardHeader>
            <CardTitle>Need Help?</CardTitle>
            <CardDescription>Contact our support team for any assistance</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-2 text-sm">
              <p><strong>Email:</strong> support@chronoswatch.com</p>
              <p><strong>Phone:</strong> +91 9876543210</p>
              <p><strong>Support Hours:</strong> Mon-Sat, 9:00 AM - 6:00 PM IST</p>
            </div>
          </CardContent>
        </Card>

        {/* Receipt Number */}
        <div className="mt-6 text-center">
          <p className="text-xs text-gray-500">
            Receipt: {paymentDetails.receipt} | Keep this for your records
          </p>
        </div>
      </div>
    </div>
  );
};

export default PaymentSuccess;