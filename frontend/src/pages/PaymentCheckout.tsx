import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import { CreditCard, Shield, RefreshCw, CheckCircle, AlertCircle, IndianRupee } from 'lucide-react';
import { get, post, API_ENDPOINTS, API_CONFIG } from '@/lib/api';

// Razorpay script loader
const loadRazorpayScript = () => {
  return new Promise((resolve) => {
    const script = document.createElement('script');
    script.src = 'https://checkout.razorpay.com/v1/checkout.js';
    script.onload = () => resolve(true);
    script.onerror = () => resolve(false);
    document.body.appendChild(script);
  });
};

interface OrderItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
  image?: string;
}

interface CheckoutProps {
  orderItems?: OrderItem[];
  totalAmount?: number;
}

const PaymentCheckout: React.FC<CheckoutProps> = ({ 
  orderItems = [], 
  totalAmount = 0 
}) => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [scriptLoaded, setScriptLoaded] = useState(false);
  const [error, setError] = useState('');
  const [paymentConfig, setPaymentConfig] = useState(null);
  
  // Customer details
  const [customerDetails, setCustomerDetails] = useState({
    name: '',
    email: '',
    phone: '',
    address: ''
  });

  // Default demo items if none provided
  const defaultItems: OrderItem[] = [
    {
      id: '1',
      name: 'Premium Chronos Watch',
      price: 25000,
      quantity: 1,
      image: '/watches/watch1.jpg'
    }
  ];

  const items = orderItems.length > 0 ? orderItems : defaultItems;
  const amount = totalAmount > 0 ? totalAmount : items.reduce((sum, item) => sum + (item.price * item.quantity), 0);

  useEffect(() => {
    initializePayment();
  }, []);

  const initializePayment = async () => {
    try {
      // Load Razorpay script
      const scriptLoaded = await loadRazorpayScript();
      if (!scriptLoaded) {
        setError('Failed to load payment gateway. Please refresh and try again.');
        return;
      }
      setScriptLoaded(true);

      // Get payment configuration using the API utility
      const configData = await get(API_ENDPOINTS.PAYMENT.CONFIG);
      
      if (configData.success) {
        setPaymentConfig(configData);
        if (!configData.configured) {
          setError('Payment gateway is not configured. Please contact support.');
        }
      } else {
        setError('Failed to load payment configuration.');
      }
    } catch (err: any) {
      setError(err.message || 'Failed to initialize payment system.');
    }
  };

  const handleInputChange = (field: string, value: string) => {
    setCustomerDetails(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const validateForm = () => {
    const { name, email, phone } = customerDetails;
    if (!name.trim() || !email.trim() || !phone.trim()) {
      setError('Please fill in all required fields.');
      return false;
    }
    
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setError('Please enter a valid email address.');
      return false;
    }
    
    const phoneRegex = /^[6-9]\d{9}$/;
    if (!phoneRegex.test(phone)) {
      setError('Please enter a valid 10-digit phone number.');
      return false;
    }
    
    return true;
  };

  const handlePayment = async () => {
    if (!validateForm()) return;
    if (!scriptLoaded || !paymentConfig?.configured) {
      setError('Payment system not ready. Please try again.');
      return;
    }

    setLoading(true);
    setError('');

    try {
      // Create Razorpay order using the API utility
      const orderData = await post(API_ENDPOINTS.PAYMENT.CREATE_ORDER, {
        amount: amount,
        currency: 'INR',
        notes: {
          customerName: customerDetails.name,
          customerEmail: customerDetails.email,
          customerPhone: customerDetails.phone,
          items: JSON.stringify(items)
        }
      });

      if (!orderData.success) {
        throw new Error(orderData.error || 'Failed to create payment order');
      }

      // Initialize Razorpay payment
      const options = {
        key: orderData.keyId,
        amount: orderData.order.amount,
        currency: orderData.order.currency,
        name: 'Chronos Watch Shop',
        description: `Payment for ${items.length} item(s)`,
        order_id: orderData.order.id,
        handler: async (response: any) => {
          await verifyPayment(response);
        },
        prefill: {
          name: customerDetails.name,
          email: customerDetails.email,
          contact: customerDetails.phone,
        },
        notes: orderData.order.notes,
        theme: {
          color: '#3B82F6',
        },
        modal: {
          ondismiss: () => {
            setLoading(false);
            setError('Payment was cancelled');
          },
        },
      };

      const razorpay = new (window as any).Razorpay(options);
      razorpay.open();

    } catch (err: any) {
      setError(err.message || 'Payment initialization failed');
      setLoading(false);
    }
  };

  const verifyPayment = async (paymentResponse: any) => {
    try {
      const verifyData = await post(API_ENDPOINTS.PAYMENT.VERIFY, {
        razorpay_order_id: paymentResponse.razorpay_order_id,
        razorpay_payment_id: paymentResponse.razorpay_payment_id,
        razorpay_signature: paymentResponse.razorpay_signature,
      });

      if (verifyData.success) {
        // Redirect to success page
        navigate(`/payment/success?paymentId=${verifyData.paymentId}&orderId=${verifyData.orderId}`);
      } else {
        throw new Error(verifyData.error || 'Payment verification failed');
      }
    } catch (err: any) {
      setError(err.message || 'Payment verification failed');
      navigate(`/payment/failure?error=${encodeURIComponent(err.message)}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-8">
          <CreditCard className="mx-auto h-12 w-12 text-blue-600" />
          <h1 className="mt-4 text-3xl font-bold text-gray-900">Secure Checkout</h1>
          <p className="mt-2 text-sm text-gray-600">Complete your purchase with our secure payment gateway</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Order Summary */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <CheckCircle className="h-5 w-5 text-green-600" />
                <span>Order Summary</span>
              </CardTitle>
              <CardDescription>Review your items before payment</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {items.map((item) => (
                <div key={item.id} className="flex justify-between items-center">
                  <div className="flex-1">
                    <h3 className="font-medium text-gray-900">{item.name}</h3>
                    <p className="text-sm text-gray-500">Quantity: {item.quantity}</p>
                  </div>
                  <div className="flex items-center space-x-1">
                    <IndianRupee className="h-4 w-4" />
                    <span className="font-medium">{(item.price * item.quantity).toLocaleString()}</span>
                  </div>
                </div>
              ))}
              
              <Separator />
              
              <div className="flex justify-between items-center text-lg font-bold">
                <span>Total Amount</span>
                <div className="flex items-center space-x-1">
                  <IndianRupee className="h-5 w-5" />
                  <span>{amount.toLocaleString()}</span>
                </div>
              </div>

              {paymentConfig && (
                <div className="mt-4 p-3 bg-blue-50 rounded-lg">
                  <div className="flex items-center justify-between text-sm">
                    <span>Payment Gateway:</span>
                    <Badge variant={paymentConfig.configured ? "default" : "destructive"}>
                      {paymentConfig.configured ? `${paymentConfig.mode} Mode` : 'Not Configured'}
                    </Badge>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Customer Details & Payment */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Shield className="h-5 w-5 text-blue-600" />
                <span>Payment Details</span>
              </CardTitle>
              <CardDescription>Enter your details for secure payment</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {error && (
                <Alert variant="destructive">
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}

              <div className="grid grid-cols-1 gap-4">
                <div>
                  <Label htmlFor="name">Full Name *</Label>
                  <Input
                    id="name"
                    type="text"
                    value={customerDetails.name}
                    onChange={(e) => handleInputChange('name', e.target.value)}
                    placeholder="Enter your full name"
                    required
                  />
                </div>

                <div>
                  <Label htmlFor="email">Email Address *</Label>
                  <Input
                    id="email"
                    type="email"
                    value={customerDetails.email}
                    onChange={(e) => handleInputChange('email', e.target.value)}
                    placeholder="Enter your email"
                    required
                  />
                </div>

                <div>
                  <Label htmlFor="phone">Phone Number *</Label>
                  <Input
                    id="phone"
                    type="tel"
                    value={customerDetails.phone}
                    onChange={(e) => handleInputChange('phone', e.target.value)}
                    placeholder="Enter 10-digit phone number"
                    maxLength={10}
                    required
                  />
                </div>

                <div>
                  <Label htmlFor="address">Address (Optional)</Label>
                  <Input
                    id="address"
                    type="text"
                    value={customerDetails.address}
                    onChange={(e) => handleInputChange('address', e.target.value)}
                    placeholder="Enter your address"
                  />
                </div>
              </div>

              <div className="bg-green-50 p-4 rounded-lg">
                <div className="flex items-center space-x-2 text-sm text-green-800">
                  <Shield className="h-4 w-4" />
                  <span className="font-medium">Secure Payment</span>
                </div>
                <p className="text-sm text-green-700 mt-1">
                  Your payment is secured by Razorpay with 256-bit SSL encryption
                </p>
              </div>

              <Button
                onClick={handlePayment}
                disabled={loading || !paymentConfig?.configured}
                className="w-full"
                size="lg"
              >
                {loading ? (
                  <>
                    <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                    Processing Payment...
                  </>
                ) : (
                  <>
                    <CreditCard className="mr-2 h-4 w-4" />
                    Pay ₹{amount.toLocaleString()}
                  </>
                )}
              </Button>

              <p className="text-xs text-gray-500 text-center">
                By clicking "Pay", you agree to our Terms of Service and Privacy Policy
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default PaymentCheckout;