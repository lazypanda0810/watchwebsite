import React from 'react'
import { Link } from 'react-router-dom'
import { ArrowRight, Clock, Shield, Award, Star } from 'lucide-react'
import { useFeaturedProducts } from '@/hooks/useProducts'
import { Hero } from '@/components/Hero'
import { ProductCard } from '@/components/ProductCard'
import { Button } from '@/components/ui/Button'
import { Card, CardContent } from '@/components/ui/Card'

export function Home() {
  const { data: featuredResponse, isLoading } = useFeaturedProducts()
  const featuredProducts = featuredResponse?.products || []

  const features = [
    {
      icon: Clock,
      title: "Precision Craftsmanship",
      description: "Every timepiece is meticulously crafted by master watchmakers with decades of experience."
    },
    {
      icon: Shield,
      title: "Lifetime Warranty",
      description: "We stand behind our quality with comprehensive warranty coverage and expert service."
    },
    {
      icon: Award,
      title: "Exclusive Collection",
      description: "Curated selection of limited edition and exclusive timepieces from renowned manufacturers."
    },
    {
      icon: Star,
      title: "Expert Curation",
      description: "Carefully selected by watch connoisseurs for discerning customers."
    }
  ]

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <Hero />

      {/* Features Section */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 font-heading mb-4">
              Why Choose Chronos
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              We're committed to providing the finest luxury timepieces with unmatched quality and service.
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <div key={index} className="text-center">
                <div className="w-16 h-16 mx-auto mb-4 bg-yellow-100 rounded-full flex items-center justify-center">
                  <feature.icon className="w-8 h-8 text-yellow-600" />
                </div>
                <h3 className="font-semibold mb-2">{feature.title}</h3>
                <p className="text-sm text-gray-600">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Products Section */}
      {featuredProducts.length > 0 && (
        <section className="py-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between mb-8">
              <div>
                <h2 className="text-3xl font-bold text-gray-900 font-heading mb-2">Featured Collection</h2>
                <p className="text-gray-600">Discover our handpicked selection of the finest luxury timepieces</p>
              </div>
              <Button asChild variant="outline" className="hidden md:flex">
                <Link to="/watches">
                  View All
                  <ArrowRight size={16} className="ml-2" />
                </Link>
              </Button>
            </div>
            
            {isLoading ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {[...Array(4)].map((_, i) => (
                  <Card key={i} className="p-4">
                    <div className="h-48 w-full mb-4 bg-gray-200 animate-pulse rounded" />
                    <div className="h-4 w-3/4 mb-2 bg-gray-200 animate-pulse rounded" />
                    <div className="h-4 w-1/2 bg-gray-200 animate-pulse rounded" />
                  </Card>
                ))}
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {featuredProducts.slice(0, 4).map((product) => (
                  <ProductCard key={product._id} product={product} />
                ))}
              </div>
            )}
          </div>
        </section>
      )}

      {/* Collections Preview */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 font-heading mb-4">
              Shop by Collection
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Explore our curated selection of premium timepieces, each representing the pinnacle of craftsmanship and design
            </p>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            <Link to="/watches?category=Men's%20Luxury" className="group cursor-pointer">
              <div className="aspect-square bg-gradient-to-br from-gray-800 to-gray-900 rounded-xl p-6 mb-4 hover:scale-105 transition-transform duration-300">
                <div className="text-center h-full flex flex-col justify-center">
                  <h3 className="font-heading font-bold text-xl text-white mb-2">Men's</h3>
                  <p className="text-white/80 text-sm">Luxury Collection</p>
                </div>
              </div>
            </Link>
            
            <Link to="/watches?category=Women's%20Elegant" className="group cursor-pointer">
              <div className="aspect-square bg-gradient-to-br from-yellow-400 to-yellow-600 rounded-xl p-6 mb-4 hover:scale-105 transition-transform duration-300">
                <div className="text-center h-full flex flex-col justify-center">
                  <h3 className="font-heading font-bold text-xl text-white mb-2">Women's</h3>
                  <p className="text-white/80 text-sm">Elegant Collection</p>
                </div>
              </div>
            </Link>
            
            <Link to="/watches?category=Smart%20Watch" className="group cursor-pointer">
              <div className="aspect-square bg-gradient-to-br from-blue-500 to-blue-700 rounded-xl p-6 mb-4 hover:scale-105 transition-transform duration-300">
                <div className="text-center h-full flex flex-col justify-center">
                  <h3 className="font-heading font-bold text-xl text-white mb-2">Smart</h3>
                  <p className="text-white/80 text-sm">Tech Collection</p>
                </div>
              </div>
            </Link>
            
            <Link to="/watches?category=Limited%20Edition" className="group cursor-pointer">
              <div className="aspect-square bg-gradient-to-br from-red-500 to-red-700 rounded-xl p-6 mb-4 hover:scale-105 transition-transform duration-300">
                <div className="text-center h-full flex flex-col justify-center">
                  <h3 className="font-heading font-bold text-xl text-white mb-2">Limited</h3>
                  <p className="text-white/80 text-sm">Exclusive Pieces</p>
                </div>
              </div>
            </Link>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 gradient-hero">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-4xl font-heading font-bold mb-6 text-white">
            Experience Timeless Luxury
          </h2>
          <p className="text-xl text-white/80 mb-8 max-w-2xl mx-auto">
            Join thousands of satisfied customers who trust Chronos for their premium timepiece needs
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button asChild className="btn-gold text-lg px-8 py-3">
              <Link to="/watches">
                Shop Now
                <ArrowRight className="ml-2 w-5 h-5" />
              </Link>
            </Button>
            <Button 
              asChild 
              variant="outline" 
              className="bg-white/10 border-white/20 text-white hover:bg-white/20 text-lg px-8 py-3"
            >
              <Link to="/contact">
                Book Consultation
              </Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Newsletter Section */}
      <section className="py-16 bg-gray-900 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold font-heading mb-4">
            Stay Updated
          </h2>
          <p className="text-lg text-gray-300 mb-8 max-w-2xl mx-auto">
            Subscribe to our newsletter and be the first to know about new arrivals and exclusive offers.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center max-w-md mx-auto">
            <input
              type="email"
              placeholder="Enter your email"
              className="flex-1 px-4 py-3 rounded-md text-gray-900"
            />
            <Button variant="gold">
              Subscribe
            </Button>
          </div>
        </div>
      </section>
    </div>
  )
}