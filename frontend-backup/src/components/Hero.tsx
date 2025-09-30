import React from 'react'
import { Link } from 'react-router-dom'
import { Button } from '@/components/ui/Button'
import { ArrowRight, Play } from 'lucide-react'

export function Hero() {
  return (
    <section className="relative min-h-[80vh] flex items-center justify-center overflow-hidden gradient-hero">
      {/* Background with overlay */}
      <div className="absolute inset-0 bg-black/40 z-10"></div>
      
      {/* Background image - you can replace with actual hero image */}
      <div 
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{
          backgroundImage: 'url("https://images.unsplash.com/photo-1523170335258-f5ed11844a49?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2940&q=80")'
        }}
      />

      {/* Content */}
      <div className="relative z-20 text-center text-white max-w-4xl mx-auto px-4">
        <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold font-heading mb-6">
          Luxury Watches
          <span className="block text-premium">Redefined</span>
        </h1>
        
        <p className="text-xl md:text-2xl text-white/90 mb-8 max-w-3xl mx-auto leading-relaxed">
          Discover our exquisite collection of premium timepieces crafted with precision and elegance. 
          Each watch tells a story of exceptional craftsmanship and timeless design.
        </p>

        <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
          <Button asChild size="lg" className="btn-gold text-lg px-8 py-4">
            <Link to="/watches">
              Explore Collection
              <ArrowRight className="ml-2 w-5 h-5" />
            </Link>
          </Button>
          
          <Button 
            asChild 
            size="lg" 
            variant="outline" 
            className="border-white text-white hover:bg-white hover:text-gray-900 text-lg px-8 py-4"
          >
            <Link to="/about">
              <Play className="mr-2 w-5 h-5" />
              Watch Story
            </Link>
          </Button>
        </div>

        {/* Trust indicators */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center text-white/80">
          <div>
            <div className="text-2xl font-bold">50+</div>
            <div className="text-sm">Premium Brands</div>
          </div>
          <div>
            <div className="text-2xl font-bold">10K+</div>
            <div className="text-sm">Happy Customers</div>
          </div>
          <div>
            <div className="text-2xl font-bold">25+</div>
            <div className="text-sm">Years Experience</div>
          </div>
          <div>
            <div className="text-2xl font-bold">100%</div>
            <div className="text-sm">Authentic</div>
          </div>
        </div>
      </div>

      {/* Scroll indicator */}
      <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 z-20">
        <div className="animate-bounce">
          <div className="w-6 h-10 border-2 border-white/50 rounded-full flex justify-center">
            <div className="w-1 h-3 bg-white/50 rounded-full mt-2 animate-pulse"></div>
          </div>
        </div>
      </div>
    </section>
  )
}