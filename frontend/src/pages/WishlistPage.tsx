import { useApp } from '@/contexts/AppContext';
import Header from '@/components/Header';
import ProductCard from '@/components/ProductCard';
import { Button } from '@/components/ui/button';
import { Heart, ShoppingBag } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const WishlistPage = () => {
  const { state } = useApp();
  const { wishlist } = state;
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center gap-3 mb-8">
          <Heart size={32} className="text-primary" />
          <h1 className="text-3xl font-heading font-bold">My Wishlist</h1>
          <span className="text-muted-foreground">({wishlist.length} items)</span>
        </div>

        {wishlist.length === 0 ? (
          <div className="text-center py-12">
            <Heart size={64} className="mx-auto text-muted-foreground mb-4" />
            <h2 className="text-2xl font-bold mb-4">Your wishlist is empty</h2>
            <p className="text-muted-foreground mb-6">
              Save your favorite watches for later
            </p>
            <Button onClick={() => navigate('/products')} className="btn-gold">
              <ShoppingBag size={16} className="mr-2" />
              Shop Now
            </Button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {wishlist.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default WishlistPage;