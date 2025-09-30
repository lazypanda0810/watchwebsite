import { ArrowRight, Star, Award, Shield, Truck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import Header from "@/components/Header";
import Hero from "@/components/Hero";
import ProductCard from "@/components/ProductCard";
import { products } from "@/data/products";

const HomePage = () => {
  const featuredProducts = products.slice(0, 4);
  const newArrivals = products.filter(p => p.isNew).slice(0, 3);
  const bestSellers = products.slice(2, 5);

  const features = [
    {
      icon: Award,
      title: "Premium Quality",
      description: "Handcrafted timepieces with Swiss precision"
    },
    {
      icon: Shield,
      title: "Lifetime Warranty", 
      description: "Comprehensive protection for your investment"
    },
    {
      icon: Truck,
      title: "Free Delivery",
      description: "Complimentary shipping across India"
    },
    {
      icon: Star,
      title: "Expert Curation",
      description: "Carefully selected by watch connoisseurs"
    }
  ];

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <Hero />

      {/* Features Section */}
      <section className="py-16 bg-card">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <div key={index} className="text-center">
                <div className="w-16 h-16 mx-auto mb-4 bg-primary/10 rounded-full flex items-center justify-center">
                  <feature.icon className="w-8 h-8 text-primary" />
                </div>
                <h3 className="font-semibold mb-2">{feature.title}</h3>
                <p className="text-sm text-muted-foreground">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* New Arrivals */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h2 className="text-3xl font-heading font-bold mb-2">New Arrivals</h2>
              <p className="text-muted-foreground">Discover our latest timepiece collections</p>
            </div>
            <Button variant="outline" className="hidden md:flex">
              View All
              <ArrowRight size={16} className="ml-2" />
            </Button>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {newArrivals.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </div>
      </section>

      {/* Featured Collections */}
      <section className="py-16 bg-card">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-heading font-bold mb-4">Featured Collections</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Explore our curated selection of premium timepieces, each representing the pinnacle of craftsmanship and design
            </p>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            <div className="group cursor-pointer">
              <div className="aspect-square bg-gradient-to-br from-accent to-accent/50 rounded-xl p-6 mb-4 hover:scale-105 transition-transform duration-300">
                <div className="text-center h-full flex flex-col justify-center">
                  <h3 className="font-heading font-bold text-xl text-accent-foreground mb-2">Men's</h3>
                  <p className="text-accent-foreground/80 text-sm">Premium Collection</p>
                </div>
              </div>
            </div>
            <div className="group cursor-pointer">
              <div className="aspect-square bg-gradient-to-br from-secondary to-secondary/50 rounded-xl p-6 mb-4 hover:scale-105 transition-transform duration-300">
                <div className="text-center h-full flex flex-col justify-center">
                  <h3 className="font-heading font-bold text-xl text-secondary-foreground mb-2">Women's</h3>
                  <p className="text-secondary-foreground/80 text-sm">Elegant Designs</p>
                </div>
              </div>
            </div>
            <div className="group cursor-pointer">
              <div className="aspect-square bg-gradient-to-br from-primary to-primary/70 rounded-xl p-6 mb-4 hover:scale-105 transition-transform duration-300">
                <div className="text-center h-full flex flex-col justify-center">
                  <h3 className="font-heading font-bold text-xl text-primary-foreground mb-2">Smart</h3>
                  <p className="text-primary-foreground/80 text-sm">Tech Innovation</p>
                </div>
              </div>
            </div>
            <div className="group cursor-pointer">
              <div className="aspect-square bg-gradient-to-br from-destructive to-destructive/70 rounded-xl p-6 mb-4 hover:scale-105 transition-transform duration-300">
                <div className="text-center h-full flex flex-col justify-center">
                  <h3 className="font-heading font-bold text-xl text-destructive-foreground mb-2">Limited</h3>
                  <p className="text-destructive-foreground/80 text-sm">Exclusive Pieces</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Best Sellers */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h2 className="text-3xl font-heading font-bold mb-2">Best Sellers</h2>
              <p className="text-muted-foreground">Most loved timepieces by our customers</p>
            </div>
            <Button variant="outline" className="hidden md:flex">
              View All
              <ArrowRight size={16} className="ml-2" />
            </Button>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {bestSellers.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 gradient-hero">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-4xl font-heading font-bold mb-6 text-white">
            Experience Timeless Luxury
          </h2>
          <p className="text-xl text-white/80 mb-8 max-w-2xl mx-auto">
            Join thousands of satisfied customers who trust LuxeTimes for their premium timepiece needs
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button className="btn-gold text-lg px-8 py-3">
              Shop Now
            </Button>
            <Button variant="outline" className="bg-white/10 border-white/20 text-white hover:bg-white/20 text-lg px-8 py-3">
              Book Consultation
            </Button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-card border-t border-border py-12">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <h3 className="text-xl font-heading font-bold text-premium mb-4">LuxeTimes</h3>
              <p className="text-muted-foreground mb-4">
                Premium timepieces for the discerning individual. Crafted with precision, designed for life.
              </p>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Collections</h4>
              <ul className="space-y-2 text-muted-foreground">
                <li><a href="#" className="hover:text-primary transition-colors">Men's Watches</a></li>
                <li><a href="#" className="hover:text-primary transition-colors">Women's Watches</a></li>
                <li><a href="#" className="hover:text-primary transition-colors">Smart Watches</a></li>
                <li><a href="#" className="hover:text-primary transition-colors">Limited Edition</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Support</h4>
              <ul className="space-y-2 text-muted-foreground">
                <li><a href="#" className="hover:text-primary transition-colors">Customer Service</a></li>
                <li><a href="#" className="hover:text-primary transition-colors">Warranty</a></li>
                <li><a href="#" className="hover:text-primary transition-colors">Repairs</a></li>
                <li><a href="#" className="hover:text-primary transition-colors">Size Guide</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Contact</h4>
              <ul className="space-y-2 text-muted-foreground">
                <li>1800-LUXETIMES</li>
                <li>support@luxetimes.com</li>
                <li>Mumbai, Delhi, Bangalore</li>
              </ul>
            </div>
          </div>
          <div className="border-t border-border mt-8 pt-8 text-center text-muted-foreground">
            <p>&copy; 2024 LuxeTimes. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default HomePage;