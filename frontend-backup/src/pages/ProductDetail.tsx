import React, { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { useProduct } from '@/hooks/useProducts'
import { useApp } from '@/contexts/AppContext'
import { Button } from '@/components/ui/Button'
import { Badge } from '@/components/ui/Badge'
import { Card, CardContent } from '@/components/ui/Card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/Tabs'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/Select'
import { Heart, ShoppingCart, Star, ArrowLeft, Share2, Truck, Shield, RotateCcw } from 'lucide-react'

export function ProductDetail() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const { addToCart } = useApp()
  
  const [selectedColor, setSelectedColor] = useState('')
  const [selectedStrap, setSelectedStrap] = useState('')
  const [quantity, setQuantity] = useState(1)
  const [isWishlisted, setIsWishlisted] = useState(false)
  const [mainImage, setMainImage] = useState('')

  const { data: product, isLoading, error } = useProduct(id || '')

  useEffect(() => {
    if (product) {
      setMainImage(product.imageUrl)
      setSelectedColor(product.specifications?.material || '')
      setSelectedStrap('Leather') // Default strap
    }
  }, [product])

  const handleAddToCart = () => {
    if (!product) return
    
    addToCart(product, quantity)
    
    // Show success message (you can integrate with a toast system)
    alert(`${product.name} added to cart!`)
  }

  const handleWishlistToggle = () => {
    setIsWishlisted(!isWishlisted)
    // Add wishlist functionality
  }

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      maximumFractionDigits: 0,
    }).format(price)
  }

  const discount = product?.originalPrice 
    ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
    : 0

  if (isLoading) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          <div>
            <div className="h-96 w-full mb-4 bg-gray-200 animate-pulse rounded-lg" />
            <div className="flex gap-2">
              {[...Array(4)].map((_, i) => (
                <div key={i} className="h-20 w-20 bg-gray-200 animate-pulse rounded" />
              ))}
            </div>
          </div>
          <div className="space-y-6">
            <div className="h-8 w-3/4 bg-gray-200 animate-pulse rounded" />
            <div className="h-4 w-1/2 bg-gray-200 animate-pulse rounded" />
            <div className="h-6 w-1/4 bg-gray-200 animate-pulse rounded" />
            <div className="h-24 w-full bg-gray-200 animate-pulse rounded" />
          </div>
        </div>
      </div>
    )
  }

  if (error || !product) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 text-center">
        <h1 className="text-2xl font-bold mb-4">Product Not Found</h1>
        <Button onClick={() => navigate('/watches')}>
          Back to Products
        </Button>
      </div>
    )
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Breadcrumb */}
      <div className="flex items-center gap-2 mb-8 text-sm text-gray-500">
        <button onClick={() => navigate('/watches')} className="hover:text-gray-700">
          Watches
        </button>
        <span>/</span>
        <span>{product.category}</span>
        <span>/</span>
        <span className="text-gray-900">{product.name}</span>
      </div>

      <Button
        variant="ghost"
        onClick={() => navigate(-1)}
        className="mb-6"
      >
        <ArrowLeft size={16} className="mr-2" />
        Back
      </Button>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
        {/* Product Images */}
        <div>
          <div className="relative mb-4">
            <img
              src={mainImage}
              alt={product.name}
              className="w-full h-96 object-cover rounded-lg"
            />
            
            {/* Badges */}
            <div className="absolute top-4 left-4 flex flex-col gap-2">
              {product.featured && (
                <Badge className="bg-yellow-500 text-white">Featured</Badge>
              )}
              {discount > 0 && (
                <Badge variant="secondary">{discount}% OFF</Badge>
              )}
            </div>

            {/* Share Button */}
            <Button
              size="icon"
              variant="secondary"
              className="absolute top-4 right-4"
              onClick={() => navigator.share?.({ title: product.name, url: window.location.href })}
            >
              <Share2 size={16} />
            </Button>
          </div>

          {/* Thumbnail Images */}
          <div className="flex gap-2 overflow-x-auto">
            {[product.imageUrl, ...product.additionalImages].slice(0, 4).map((img, index) => (
              <button
                key={index}
                onClick={() => setMainImage(img)}
                className={`flex-shrink-0 w-20 h-20 rounded-lg overflow-hidden border-2 ${
                  mainImage === img ? 'border-yellow-500' : 'border-gray-200'
                }`}
              >
                <img src={img} alt={`${product.name} ${index + 1}`} className="w-full h-full object-cover" />
              </button>
            ))}
          </div>
        </div>

        {/* Product Info */}
        <div className="space-y-6">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              {product.name}
            </h1>
            <p className="text-gray-600 mb-4">{product.brand} • {product.category}</p>
            
            {/* Rating */}
            <div className="flex items-center gap-2 mb-4">
              <div className="flex items-center">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    size={16}
                    className={
                      i < Math.floor(4.5) // Default rating
                        ? "fill-yellow-400 text-yellow-400"
                        : "text-gray-300"
                    }
                  />
                ))}
              </div>
              <span className="text-sm text-gray-500">(4.5)</span>
            </div>

            {/* Price */}
            <div className="flex items-center gap-3 mb-6">
              <span className="text-3xl font-bold text-gray-900">
                {formatPrice(product.price)}
              </span>
              {product.originalPrice && (
                <span className="text-xl text-gray-500 line-through">
                  {formatPrice(product.originalPrice)}
                </span>
              )}
            </div>

            <p className="text-gray-700 mb-6">{product.description}</p>
          </div>

          {/* Specifications Preview */}
          <div className="grid grid-cols-2 gap-4 mb-6">
            <div>
              <span className="font-medium">Material:</span>
              <span className="ml-2 text-gray-600">{product.specifications.material}</span>
            </div>
            <div>
              <span className="font-medium">Movement:</span>
              <span className="ml-2 text-gray-600">{product.specifications.movement}</span>
            </div>
            <div>
              <span className="font-medium">Water Resistance:</span>
              <span className="ml-2 text-gray-600">{product.specifications.waterResistance}</span>
            </div>
            <div>
              <span className="font-medium">Size:</span>
              <span className="ml-2 text-gray-600">{product.specifications.size}</span>
            </div>
          </div>

          {/* Options */}
          <div className="space-y-4">
            {/* Quantity */}
            <div>
              <label className="block text-sm font-medium mb-2">Quantity</label>
              <Select value={quantity.toString()} onValueChange={(value) => setQuantity(Number(value))}>
                <SelectTrigger className="w-24">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {[1, 2, 3, 4, 5].map(num => (
                    <SelectItem key={num} value={num.toString()}>{num}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-4">
            <Button 
              onClick={handleAddToCart} 
              className="btn-gold flex-1"
              disabled={!product.inStock}
            >
              <ShoppingCart size={16} className="mr-2" />
              {product.inStock ? 'Add to Cart' : 'Out of Stock'}
            </Button>
            <Button
              variant="outline"
              size="icon"
              onClick={handleWishlistToggle}
              className={isWishlisted ? "text-red-500 border-red-500" : ""}
            >
              <Heart size={16} className={isWishlisted ? "fill-current" : ""} />
            </Button>
          </div>

          {/* Features */}
          <Card className="p-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-center">
              <div className="flex flex-col items-center gap-2">
                <Truck size={24} className="text-yellow-600" />
                <span className="text-sm">Free Shipping</span>
              </div>
              <div className="flex flex-col items-center gap-2">
                <Shield size={24} className="text-yellow-600" />
                <span className="text-sm">2 Year Warranty</span>
              </div>
              <div className="flex flex-col items-center gap-2">
                <RotateCcw size={24} className="text-yellow-600" />
                <span className="text-sm">30 Day Returns</span>
              </div>
            </div>
          </Card>
        </div>
      </div>

      {/* Product Details Tabs */}
      <div className="mt-12">
        <Tabs defaultValue="description" className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="description">Description</TabsTrigger>
            <TabsTrigger value="specifications">Specifications</TabsTrigger>
            <TabsTrigger value="reviews">Reviews</TabsTrigger>
          </TabsList>
          
          <TabsContent value="description" className="mt-6">
            <Card className="p-6">
              <p className="text-gray-700 leading-relaxed">{product.description}</p>
            </Card>
          </TabsContent>
          
          <TabsContent value="specifications" className="mt-6">
            <Card className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <h4 className="font-semibold mb-2">Technical Details</h4>
                  <ul className="space-y-2 text-sm">
                    <li><span className="font-medium">Material:</span> {product.specifications.material}</li>
                    <li><span className="font-medium">Movement:</span> {product.specifications.movement}</li>
                    <li><span className="font-medium">Water Resistance:</span> {product.specifications.waterResistance}</li>
                    <li><span className="font-medium">Case Size:</span> {product.specifications.size}</li>
                  </ul>
                </div>
                <div>
                  <h4 className="font-semibold mb-2">Features</h4>
                  <ul className="space-y-2 text-sm">
                    {product.specifications.features.map((feature, index) => (
                      <li key={index} className="flex items-center gap-2">
                        <div className="w-2 h-2 bg-yellow-500 rounded-full"></div>
                        <span>{feature}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </Card>
          </TabsContent>
          
          <TabsContent value="reviews" className="mt-6">
            <Card className="p-6">
              <p className="text-center text-gray-500 py-8">
                Reviews feature coming soon
              </p>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}