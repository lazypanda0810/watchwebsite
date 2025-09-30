import { ArrowRight, Play } from "lucide-react";
import { Button } from "@/components/ui/button";
import heroImage from "@/assets/hero-watches.jpg";

const Hero = () => {
  return (
    <section className="relative min-h-[80vh] flex items-center overflow-hidden">
      {/* Background Image */}
      <div className="absolute inset-0">
        <img
          src={heroImage}
          alt="Luxury Watch Collection"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-background/90 via-background/50 to-transparent" />
      </div>

      {/* Content */}
      <div className="relative container mx-auto px-4 z-10">
        <div className="max-w-2xl">
          <div className="mb-6">
            <span className="inline-block px-4 py-2 bg-primary/10 text-primary rounded-full text-sm font-medium mb-4">
              New Collection 2024
            </span>
            <h1 className="text-hero font-heading mb-6">
              Timeless
              <span className="text-premium"> Luxury</span>
              <br />
              Redefined
            </h1>
            <p className="text-lg text-muted-foreground mb-8 leading-relaxed">
              Discover our premium collection of luxury timepieces crafted for the modern Indian connoisseur. 
              From classic elegance to contemporary sophistication.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-4">
            <Button className="btn-gold group">
              Explore Collection
              <ArrowRight 
                size={18} 
                className="ml-2 transition-transform group-hover:translate-x-1" 
              />
            </Button>
            <Button variant="outline" className="btn-premium group">
              <Play size={18} className="mr-2" />
              Watch Our Story
            </Button>
          </div>

          {/* Stats */}
          <div className="flex items-center gap-8 mt-12 pt-8 border-t border-border">
            <div>
              <div className="text-2xl font-bold text-primary">10K+</div>
              <div className="text-sm text-muted-foreground">Happy Customers</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-primary">500+</div>
              <div className="text-sm text-muted-foreground">Premium Watches</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-primary">50+</div>
              <div className="text-sm text-muted-foreground">Global Brands</div>
            </div>
          </div>
        </div>
      </div>

      {/* Decorative Elements */}
      <div className="absolute right-8 top-1/2 transform -translate-y-1/2 hidden lg:block">
        <div className="w-1 h-32 bg-gradient-to-b from-primary to-transparent opacity-50" />
      </div>
    </section>
  );
};

export default Hero;