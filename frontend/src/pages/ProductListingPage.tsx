import { useState, useEffect, useCallback, useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useApp } from '@/contexts/AppContext';
import { Product } from '@/data/products';
import ProductCard from '@/components/ProductCard';
import Header from '@/components/Header';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';
import { Card } from '@/components/ui/card';
import { Search, Filter, Grid, List } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';

const ProductListingPage = () => {
  const { state, actions } = useApp();
  const { products, loading } = state;
  const [searchParams, setSearchParams] = useSearchParams();
  
  const [filters, setFilters] = useState({
    search: searchParams.get('search') || '',
    category: searchParams.get('category') || 'All',
    priceRange: [0, 100000],
    colors: [] as string[],
    straps: [] as string[],
    rating: 0,
    sortBy: 'popularity'
  });
  
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [showFilters, setShowFilters] = useState(false);
  const [mounted, setMounted] = useState(false);

  const categories = ['All', 'Men\'s Luxury', 'Women\'s Elegant', 'Smart Watch', 'Limited Edition', 'Couple Watches', 'Sports'];
  const colors = ['Black', 'Gold', 'Silver', 'Blue', 'Rose Gold', 'Carbon'];
  const strapTypes = ['Leather', 'Metal', 'Silicone'];
  const sortOptions = [
    { value: 'popularity', label: 'Most Popular' },
    { value: 'price-low', label: 'Price: Low to High' },
    { value: 'price-high', label: 'Price: High to Low' },
    { value: 'rating', label: 'Highest Rated' },
    { value: 'newest', label: 'Newest First' }
  ];

  // Debounced fetch function
  const debouncedFetchProducts = useCallback(
    (() => {
      let timeoutId: NodeJS.Timeout;
      return (fetchParams: any) => {
        clearTimeout(timeoutId);
        timeoutId = setTimeout(() => {
          actions.fetchProducts(fetchParams);
        }, 300); // 300ms debounce
      };
    })(),
    [actions]
  );

  // Initial fetch on mount
  useEffect(() => {
    if (!mounted) {
      setMounted(true);
      actions.fetchProducts();
    }
  }, [mounted, actions]);

  // Initial fetch on mount (without filters)
  useEffect(() => {
    if (!mounted) {
      setMounted(true);
      actions.fetchProducts(); // Fetch all products once
    }
  }, [mounted, actions]);

  // Memoized filtered and sorted products for better performance
  const filteredAndSortedProducts = useMemo(() => {
    let filtered = [...products];

    // Apply search filter
    if (filters.search) {
      const searchTerm = filters.search.toLowerCase();
      filtered = filtered.filter(product => 
        product.name.toLowerCase().includes(searchTerm) ||
        product.category.toLowerCase().includes(searchTerm) ||
        product.description.toLowerCase().includes(searchTerm)
      );
    }

    // Apply category filter
    if (filters.category && filters.category !== 'All') {
      filtered = filtered.filter(product => 
        product.category.toLowerCase().includes(filters.category.toLowerCase())
      );
    }

    // Apply price range filter
    filtered = filtered.filter(product => 
      product.price >= filters.priceRange[0] && product.price <= filters.priceRange[1]
    );

    // Apply colors filter
    if (filters.colors.length > 0) {
      filtered = filtered.filter(product => 
        product.colors.some(color => filters.colors.includes(color))
      );
    }

    // Apply straps filter
    if (filters.straps.length > 0) {
      filtered = filtered.filter(product => 
        product.straps.some(strap => filters.straps.includes(strap))
      );
    }

    // Apply rating filter
    if (filters.rating > 0) {
      filtered = filtered.filter(product => product.rating >= filters.rating);
    }

    // Apply sorting
    filtered.sort((a, b) => {
      switch (filters.sortBy) {
        case 'price-low':
          return a.price - b.price;
        case 'price-high':
          return b.price - a.price;
        case 'rating':
          return b.rating - a.rating;
        case 'newest':
          return (b.isNew ? 1 : 0) - (a.isNew ? 1 : 0);
        default:
          return 0;
      }
    });

    return filtered;
  }, [products, filters]);

  const handleFilterChange = useCallback((key: string, value: any) => {
    setFilters(prev => ({ ...prev, [key]: value }));
    
    // Update URL params
    const newParams = new URLSearchParams(searchParams);
    if (value && value !== 'All' && value !== '') {
      newParams.set(key, value);
    } else {
      newParams.delete(key);
    }
    setSearchParams(newParams);
  }, [searchParams, setSearchParams]);

  const handleArrayFilterChange = useCallback((key: string, value: string, checked: boolean) => {
    setFilters(prev => ({
      ...prev,
      [key]: checked 
        ? [...prev[key as keyof typeof prev] as string[], value]
        : (prev[key as keyof typeof prev] as string[]).filter(item => item !== value)
    }));
  }, []);

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
          <div>
            <h1 className="text-3xl font-heading font-bold text-foreground mb-2">
              Premium Watches
            </h1>
            <p className="text-muted-foreground">
              {filteredAndSortedProducts.length} products found
            </p>
          </div>
          
          <div className="flex items-center gap-4">
            <Button
              variant={showFilters ? "default" : "outline"}
              onClick={() => setShowFilters(!showFilters)}
              className="md:hidden"
            >
              <Filter size={16} className="mr-2" />
              Filters
            </Button>
            
            <div className="flex items-center gap-2">
              <Button
                variant={viewMode === 'grid' ? "default" : "outline"}
                size="icon"
                onClick={() => setViewMode('grid')}
              >
                <Grid size={16} />
              </Button>
              <Button
                variant={viewMode === 'list' ? "default" : "outline"}
                size="icon"
                onClick={() => setViewMode('list')}
              >
                <List size={16} />
              </Button>
            </div>
          </div>
        </div>

        <div className="flex flex-col md:flex-row gap-8">
          {/* Filters Sidebar */}
          <div className={`w-full md:w-80 space-y-6 ${showFilters ? 'block' : 'hidden md:block'}`}>
            <Card className="p-6">
              <h3 className="font-semibold text-lg mb-4">Filters</h3>
              
              {/* Search */}
              <div className="space-y-2 mb-6">
                <Label>Search</Label>
                <div className="relative">
                  <Search size={16} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" />
                  <Input
                    placeholder="Search watches..."
                    value={filters.search}
                    onChange={(e) => handleFilterChange('search', e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>

              {/* Category */}
              <div className="space-y-2 mb-6">
                <Label>Category</Label>
                <Select value={filters.category} onValueChange={(value) => handleFilterChange('category', value)}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {categories.map(category => (
                      <SelectItem key={category} value={category}>{category}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Price Range */}
              <div className="space-y-2 mb-6">
                <Label>Price Range</Label>
                <div className="px-2">
                  <Slider
                    value={filters.priceRange}
                    onValueChange={(value) => handleFilterChange('priceRange', value)}
                    max={100000}
                    min={0}
                    step={1000}
                    className="w-full"
                  />
                  <div className="flex justify-between text-sm text-muted-foreground mt-2">
                    <span>₹{filters.priceRange[0].toLocaleString()}</span>
                    <span>₹{filters.priceRange[1].toLocaleString()}</span>
                  </div>
                </div>
              </div>

              {/* Colors */}
              <div className="space-y-2 mb-6">
                <Label>Colors</Label>
                <div className="space-y-2">
                  {colors.map(color => (
                    <div key={color} className="flex items-center space-x-2">
                      <Checkbox
                        id={`color-${color}`}
                        checked={filters.colors.includes(color)}
                        onCheckedChange={(checked) => handleArrayFilterChange('colors', color, !!checked)}
                      />
                      <Label htmlFor={`color-${color}`} className="text-sm">{color}</Label>
                    </div>
                  ))}
                </div>
              </div>

              {/* Strap Types */}
              <div className="space-y-2 mb-6">
                <Label>Strap Type</Label>
                <div className="space-y-2">
                  {strapTypes.map(strap => (
                    <div key={strap} className="flex items-center space-x-2">
                      <Checkbox
                        id={`strap-${strap}`}
                        checked={filters.straps.includes(strap)}
                        onCheckedChange={(checked) => handleArrayFilterChange('straps', strap, !!checked)}
                      />
                      <Label htmlFor={`strap-${strap}`} className="text-sm">{strap}</Label>
                    </div>
                  ))}
                </div>
              </div>

              {/* Rating */}
              <div className="space-y-2 mb-6">
                <Label>Minimum Rating</Label>
                <Select value={filters.rating.toString()} onValueChange={(value) => handleFilterChange('rating', Number(value))}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="0">All Ratings</SelectItem>
                    <SelectItem value="4">4+ Stars</SelectItem>
                    <SelectItem value="3">3+ Stars</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </Card>
          </div>

          {/* Products Grid */}
          <div className="flex-1">
            {/* Sort Options */}
            <div className="flex justify-between items-center mb-6">
              <Select value={filters.sortBy} onValueChange={(value) => handleFilterChange('sortBy', value)}>
                <SelectTrigger className="w-48">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {sortOptions.map(option => (
                    <SelectItem key={option.value} value={option.value}>{option.label}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Products */}
            {loading ? (
              <div className={`grid ${viewMode === 'grid' ? 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3' : 'grid-cols-1'} gap-6`}>
                {[...Array(6)].map((_, i) => (
                  <Card key={i} className="p-4">
                    <Skeleton className="h-48 w-full mb-4" />
                    <Skeleton className="h-4 w-3/4 mb-2" />
                    <Skeleton className="h-4 w-1/2" />
                  </Card>
                ))}
              </div>
            ) : filteredAndSortedProducts.length > 0 ? (
              <div className={`grid ${viewMode === 'grid' ? 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3' : 'grid-cols-1'} gap-6`}>
                {filteredAndSortedProducts.map((product) => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <p className="text-muted-foreground">No products found matching your criteria.</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductListingPage;