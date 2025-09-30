import React from 'react'
import { useNavigate } from 'react-router-dom'
import { useApp } from '@/contexts/AppContext'
import { Button } from '@/components/ui/Button'
import { Card, CardContent } from '@/components/ui/Card'
import { Input } from '@/components/ui/Input'
import { ArrowLeft, ShoppingBag, Minus, Plus, Trash2 } from 'lucide-react'

export function Cart() {
  const navigate = useNavigate()
  const { state, removeFromCart, updateCartQuantity, getTotalPrice, getTotalItems } = useApp()
  const { cart } = state

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      maximumFractionDigits: 0,
    }).format(price)
  }

  const updateQuantity = (productId: string, newQuantity: number) => {
    if (newQuantity <= 0) {
      removeFromCart(productId)
    } else {
      updateCartQuantity(productId, newQuantity)
    }
  }

  if (cart.length === 0) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="text-center py-12">
          <ShoppingBag size={64} className="mx-auto text-gray-400 mb-4" />
          <h2 className="text-2xl font-bold mb-4">Your cart is empty</h2>
          <p className="text-gray-600 mb-6">
            Add some premium watches to get started
          </p>
          <Button onClick={() => navigate('/watches')} className="btn-gold">
            Shop Now
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <Button
        variant="ghost"
        onClick={() => navigate(-1)}
        className="mb-6"
      >
        <ArrowLeft size={16} className="mr-2" />
        Continue Shopping
      </Button>

      <h1 className="text-3xl font-bold mb-8">Shopping Cart</h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Cart Items */}
        <div className="lg:col-span-2 space-y-4">
          {cart.map((item) => (
            <Card key={item.product._id} className="p-6">
              <div className="flex flex-col md:flex-row gap-4">
                {/* Product Image */}
                <div className="w-full md:w-32 h-32 flex-shrink-0">
                  <img
                    src={item.product.imageUrl}
                    alt={item.product.name}
                    className="w-full h-full object-cover rounded-lg"
                  />
                </div>

                {/* Product Details */}
                <div className="flex-1">
                  <div className="flex justify-between items-start mb-2">
                    <div>
                      <h3 className="font-semibold text-gray-900">
                        {item.product.name}
                      </h3>
                      <p className="text-sm text-gray-600">
                        {item.product.brand} • {item.product.category}
                      </p>
                    </div>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => removeFromCart(item.product._id)}
                      className="text-red-500 hover:text-red-700"
                    >
                      <Trash2 size={16} />
                    </Button>
                  </div>

                  {/* Price and Quantity */}
                  <div className="flex justify-between items-end">
                    <div className="flex items-center gap-2">
                      <Button
                        variant="outline"
                        size="icon"
                        onClick={() => updateQuantity(item.product._id, item.quantity - 1)}
                        className="w-8 h-8"
                      >
                        <Minus size={12} />
                      </Button>
                      <Input
                        type="number"
                        value={item.quantity}
                        onChange={(e) => updateQuantity(item.product._id, parseInt(e.target.value) || 0)}
                        className="w-16 text-center"
                        min="1"
                      />
                      <Button
                        variant="outline"
                        size="icon"
                        onClick={() => updateQuantity(item.product._id, item.quantity + 1)}
                        className="w-8 h-8"
                      >
                        <Plus size={12} />
                      </Button>
                    </div>
                    <div className="text-right">
                      <p className="text-lg font-semibold">
                        {formatPrice(item.product.price * item.quantity)}
                      </p>
                      <p className="text-sm text-gray-500">
                        {formatPrice(item.product.price)} each
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </Card>
          ))}
        </div>

        {/* Order Summary */}
        <div className="lg:col-span-1">
          <Card className="p-6 sticky top-8">
            <h3 className="text-lg font-semibold mb-4">Order Summary</h3>
            
            <div className="space-y-3 mb-6">
              <div className="flex justify-between">
                <span>Items ({getTotalItems()})</span>
                <span>{formatPrice(getTotalPrice())}</span>
              </div>
              <div className="flex justify-between">
                <span>Shipping</span>
                <span className="text-green-600">Free</span>
              </div>
              <div className="flex justify-between">
                <span>Tax</span>
                <span>{formatPrice(getTotalPrice() * 0.08)}</span>
              </div>
              <hr />
              <div className="flex justify-between text-lg font-semibold">
                <span>Total</span>
                <span>{formatPrice(getTotalPrice() * 1.08)}</span>
              </div>
            </div>

            <Button 
              onClick={() => navigate('/checkout')}
              className="w-full btn-gold mb-4"
            >
              Proceed to Checkout
            </Button>

            <Button 
              variant="outline"
              onClick={() => navigate('/watches')}
              className="w-full"
            >
              Continue Shopping
            </Button>

            {/* Promo Code */}
            <div className="mt-6 pt-6 border-t">
              <h4 className="font-medium mb-3">Promo Code</h4>
              <div className="flex gap-2">
                <Input placeholder="Enter code" />
                <Button variant="outline">Apply</Button>
              </div>
            </div>

            {/* Trust Badges */}
            <div className="mt-6 pt-6 border-t text-center text-sm text-gray-600">
              <p className="mb-2">🔒 Secure checkout with SSL encryption</p>
              <p className="mb-2">📦 Free shipping on all orders</p>
              <p>↩️ 30-day return policy</p>
            </div>
          </Card>
        </div>
      </div>
    </div>
  )
}