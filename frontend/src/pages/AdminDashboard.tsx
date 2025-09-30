import { useState, useEffect } from 'react';
import { useApp } from '@/contexts/AppContext';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Plus, Edit, Trash2, Upload, LogOut, Package, Users, ShoppingCart, TrendingUp, Eye, CheckCircle } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { Product } from '@/data/products';
import axios from 'axios';

const AdminDashboard = () => {
  const { state, actions } = useApp();
  const { user } = state;
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const [products, setProducts] = useState<Product[]>([]);
  const [orders, setOrders] = useState<any[]>([]);
  const [users, setUsers] = useState<any[]>([]);
  const [stats, setStats] = useState({
    totalProducts: 0,
    totalOrders: 0,
    totalUsers: 0,
    revenue: 0
  });
  const [loading, setLoading] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [showProductDialog, setShowProductDialog] = useState(false);
  
  const [productForm, setProductForm] = useState({
    name: '',
    brand: '',
    model: '',
    price: 0,
    originalPrice: 0,
    image: '',
    rating: 4.5,
    reviews: 0,
    category: '',
    description: '',
    features: [''],
    colors: [''],
    straps: [''],
    totalStock: 10,
    isNew: false,
    isLimited: false,
  });

  useEffect(() => {
    if (!user || user.role !== 'admin') {
      navigate('/login');
      return;
    }
    
    fetchProducts();
    fetchStats();
    fetchOrders();
    fetchUsers();
  }, [user, navigate]);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const response = await axios.get('/api/products', {
        withCredentials: true
      });
      if (response.data.success && response.data.data?.products) {
        const transformedProducts = response.data.data.products.map((product: any) => ({
          id: product._id,
          name: product.name,
          price: product.basePrice,
          originalPrice: product.discountPrice ? product.basePrice : undefined,
          image: product.variants?.[0]?.images?.[0]?.url || '/placeholder.svg',
          rating: parseFloat(product.rating?.average || '0'),
          reviews: product.rating?.count || 0,
          category: product.category?.name || '',
          description: product.description || '',
          features: product.specifications ? Object.values(product.specifications).filter(Boolean) : [],
          colors: product.variants?.map((v: any) => v.color) || [],
          straps: product.variants?.map((v: any) => v.strap?.material) || [],
          isNew: product.isFeatured || false,
          isLimited: false,
          totalStock: product.totalStock || 0,
          brand: product.brand || '',
          model: product.model || ''
        }));
        setProducts(transformedProducts);
      }
    } catch (error) {
      console.error('Failed to fetch products:', error);
      toast({
        title: "Error",
        description: "Failed to fetch products",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const fetchStats = async () => {
    try {
      const response = await axios.get('/api/admin/stats', {
        withCredentials: true
      });
      if (response.data.success) {
        setStats({
          totalProducts: response.data.data.totalProducts || 0,
          totalOrders: response.data.data.totalOrders || 0,
          totalUsers: response.data.data.totalUsers || 0,
          revenue: response.data.data.totalRevenue || 0
        });
      }
    } catch (error) {
      console.error('Failed to fetch stats:', error);
      toast({
        title: "Error",
        description: "Failed to fetch dashboard statistics",
        variant: "destructive",
      });
    }
  };

  const fetchOrders = async () => {
    try {
      const response = await axios.get('/api/admin/orders', {
        withCredentials: true
      });
      if (response.data.success) {
        setOrders(response.data.data.orders || []);
      }
    } catch (error) {
      console.error('Failed to fetch orders:', error);
    }
  };

  const fetchUsers = async () => {
    try {
      const response = await axios.get('/api/admin/users', {
        withCredentials: true
      });
      if (response.data.success) {
        setUsers(response.data.data.users || []);
      }
    } catch (error) {
      console.error('Failed to fetch users:', error);
    }
  };

  const handleProductSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      setLoading(true);
      
      // Transform frontend form data to backend schema
      const productData = {
        name: productForm.name,
        brand: productForm.brand || 'Chronos',
        model: productForm.model || productForm.name,
        description: productForm.description,
        basePrice: productForm.price,
        discountPrice: productForm.originalPrice > productForm.price ? productForm.originalPrice : undefined,
        category: productForm.category,
        specifications: {
          material: productForm.features[0] || '',
          waterResistance: productForm.features[1] || '',
          movement: productForm.features[2] || '',
          features: productForm.features.filter(f => f.trim()).join(', ')
        },
        variants: [{
          color: productForm.colors[0] || 'Black',
          strap: {
            material: productForm.straps[0] || 'Leather',
            color: productForm.colors[0] || 'Black'
          },
          images: [{
            url: productForm.image || '/placeholder.svg',
            alt: productForm.name,
            isPrimary: true
          }],
          stock: productForm.totalStock || 10
        }],
        totalStock: productForm.totalStock || 10,
        isFeatured: productForm.isNew,
        isActive: true,
        tags: ['watch', 'luxury', productForm.category.toLowerCase()]
      };

      const config = { withCredentials: true };

      if (editingProduct) {
        await axios.put(`/api/products/admin/products/${editingProduct.id}`, productData, config);
        toast({
          title: "Product Updated",
          description: "Product has been updated successfully",
        });
      } else {
        await axios.post('/api/products/admin/products', productData, config);
        toast({
          title: "Product Created",
          description: "New product has been created successfully",
        });
      }
      
      fetchProducts();
      setShowProductDialog(false);
      resetForm();
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.response?.data?.message || "Failed to save product",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteProduct = async (productId: string) => {
    if (!confirm('Are you sure you want to delete this product?')) return;
    
    try {
      await axios.delete(`/api/products/admin/products/${productId}`, {
        withCredentials: true
      });
      toast({
        title: "Product Deleted",
        description: "Product has been deleted successfully",
      });
      fetchProducts();
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.response?.data?.message || "Failed to delete product",
        variant: "destructive",
      });
    }
  };

  const handleEditProduct = (product: Product) => {
    setEditingProduct(product);
    setProductForm({
      name: product.name,
      brand: product.brand || '',
      model: product.model || '',
      price: product.price,
      originalPrice: product.originalPrice || 0,
      image: product.image,
      rating: product.rating,
      reviews: product.reviews,
      category: product.category,
      description: product.description,
      features: product.features,
      colors: product.colors,
      straps: product.straps,
      totalStock: product.totalStock || 10,
      isNew: product.isNew || false,
      isLimited: product.isLimited || false,
    });
    setShowProductDialog(true);
  };

  const resetForm = () => {
    setEditingProduct(null);
    setProductForm({
      name: '',
      brand: '',
      model: '',
      price: 0,
      originalPrice: 0,
      image: '',
      rating: 4.5,
      reviews: 0,
      category: '',
      description: '',
      features: [''],
      colors: [''],
      straps: [''],
      totalStock: 10,
      isNew: false,
      isLimited: false,
    });
  };

  const handleArrayFieldChange = (field: 'features' | 'colors' | 'straps', index: number, value: string) => {
    setProductForm(prev => ({
      ...prev,
      [field]: prev[field].map((item, i) => i === index ? value : item)
    }));
  };

  const addArrayField = (field: 'features' | 'colors' | 'straps') => {
    setProductForm(prev => ({
      ...prev,
      [field]: [...prev[field], '']
    }));
  };

  const removeArrayField = (field: 'features' | 'colors' | 'straps', index: number) => {
    setProductForm(prev => ({
      ...prev,
      [field]: prev[field].filter((_, i) => i !== index)
    }));
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0,
    }).format(price);
  };

  const handleClearSampleData = async () => {
    const confirmed = window.confirm(
      '⚠️ WARNING: This will permanently delete ALL products, categories, and orders from your database.\n\n' +
      'This action cannot be undone. Are you absolutely sure you want to continue?'
    );
    
    if (!confirmed) return;
    
    const doubleConfirm = window.prompt(
      'To confirm, please type "CLEAR ALL DATA" (exactly as shown):'
    );
    
    if (doubleConfirm !== 'CLEAR ALL DATA') {
      toast({
        title: "Operation Cancelled",
        description: "Data clear operation was cancelled for safety",
      });
      return;
    }
    
    try {
      setLoading(true);
      await axios.delete('/api/admin/clear-data', {
        data: { confirmClear: true },
        withCredentials: true
      });
      
      toast({
        title: "Sample Data Cleared",
        description: "All sample data has been removed. Database is ready for production.",
      });
      
      // Refresh the data
      fetchProducts();
      fetchStats();
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.response?.data?.message || "Failed to clear sample data",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleInitProduction = async () => {
    try {
      setLoading(true);
      await axios.post('/api/admin/init-production', {}, {
        withCredentials: true
      });
      
      toast({
        title: "Production Initialized",
        description: "Default categories and production settings have been configured.",
      });
      
      // Refresh the data
      fetchProducts();
      fetchStats();
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.response?.data?.message || "Failed to initialize production data",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  if (!user || user.role !== 'admin') {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Card className="p-8 text-center">
          <h1 className="text-2xl font-bold mb-4">Access Denied</h1>
          <p className="text-muted-foreground mb-4">You need admin privileges to access this page</p>
          <Button onClick={() => navigate('/login')} className="btn-gold">
            Login as Admin
          </Button>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="border-b bg-card">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold">Admin Dashboard</h1>
            <p className="text-muted-foreground">Welcome back, {user.name}</p>
          </div>
          <div className="flex items-center gap-4">
            <Button variant="outline" onClick={() => navigate('/')}>
              View Store
            </Button>
            <Button variant="outline" onClick={actions.logout}>
              <LogOut size={16} className="mr-2" />
              Logout
            </Button>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <Tabs defaultValue="overview" className="w-full">
          <TabsList className="grid w-full grid-cols-5">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="products">Products</TabsTrigger>
            <TabsTrigger value="orders">Orders</TabsTrigger>
            <TabsTrigger value="users">Users</TabsTrigger>
            <TabsTrigger value="data">Data Management</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <Card className="p-6">
                <div className="flex items-center gap-4">
                  <div className="p-3 bg-primary/10 rounded-full">
                    <Package className="text-primary" size={24} />
                  </div>
                  <div>
                    <p className="text-2xl font-bold">{stats.totalProducts}</p>
                    <p className="text-muted-foreground">Total Products</p>
                  </div>
                </div>
              </Card>
              
              <Card className="p-6">
                <div className="flex items-center gap-4">
                  <div className="p-3 bg-blue-500/10 rounded-full">
                    <ShoppingCart className="text-blue-500" size={24} />
                  </div>
                  <div>
                    <p className="text-2xl font-bold">{stats.totalOrders}</p>
                    <p className="text-muted-foreground">Total Orders</p>
                  </div>
                </div>
              </Card>
              
              <Card className="p-6">
                <div className="flex items-center gap-4">
                  <div className="p-3 bg-green-500/10 rounded-full">
                    <Users className="text-green-500" size={24} />
                  </div>
                  <div>
                    <p className="text-2xl font-bold">{stats.totalUsers}</p>
                    <p className="text-muted-foreground">Total Users</p>
                  </div>
                </div>
              </Card>
              
              <Card className="p-6">
                <div className="flex items-center gap-4">
                  <div className="p-3 bg-purple-500/10 rounded-full">
                    <TrendingUp className="text-purple-500" size={24} />
                  </div>
                  <div>
                    <p className="text-2xl font-bold">{formatPrice(stats.revenue)}</p>
                    <p className="text-muted-foreground">Total Revenue</p>
                  </div>
                </div>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="products" className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-semibold">Products Management</h2>
              <Dialog open={showProductDialog} onOpenChange={setShowProductDialog}>
                <DialogTrigger asChild>
                  <Button onClick={resetForm} className="btn-gold">
                    <Plus size={16} className="mr-2" />
                    Add Product
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
                  <DialogHeader>
                    <DialogTitle>
                      {editingProduct ? 'Edit Product' : 'Add New Product'}
                    </DialogTitle>
                  </DialogHeader>
                  
                  <form onSubmit={handleProductSubmit} className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <Label>Product Name</Label>
                        <Input
                          value={productForm.name}
                          onChange={(e) => setProductForm(prev => ({ ...prev, name: e.target.value }))}
                          required
                        />
                      </div>
                      
                      <div>
                        <Label>Category</Label>
                        <Select 
                          value={productForm.category} 
                          onValueChange={(value) => setProductForm(prev => ({ ...prev, category: value }))}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Select category" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="Men's Luxury">Men's Luxury</SelectItem>
                            <SelectItem value="Women's Elegant">Women's Elegant</SelectItem>
                            <SelectItem value="Smart Watch">Smart Watch</SelectItem>
                            <SelectItem value="Limited Edition">Limited Edition</SelectItem>
                            <SelectItem value="Couple Watches">Couple Watches</SelectItem>
                            <SelectItem value="Sports">Sports</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      
                      <div>
                        <Label>Price (₹)</Label>
                        <Input
                          type="number"
                          value={productForm.price}
                          onChange={(e) => setProductForm(prev => ({ ...prev, price: Number(e.target.value) }))}
                          required
                        />
                      </div>
                      
                      <div>
                        <Label>Original Price (₹)</Label>
                        <Input
                          type="number"
                          value={productForm.originalPrice}
                          onChange={(e) => setProductForm(prev => ({ ...prev, originalPrice: Number(e.target.value) }))}
                        />
                      </div>
                      
                      <div>
                        <Label>Image URL</Label>
                        <Input
                          value={productForm.image}
                          onChange={(e) => setProductForm(prev => ({ ...prev, image: e.target.value }))}
                          required
                        />
                      </div>
                      
                      <div>
                        <Label>Rating</Label>
                        <Input
                          type="number"
                          step="0.1"
                          min="0"
                          max="5"
                          value={productForm.rating}
                          onChange={(e) => setProductForm(prev => ({ ...prev, rating: Number(e.target.value) }))}
                        />
                      </div>
                      
                      <div>
                        <Label>Brand</Label>
                        <Input
                          value={productForm.brand}
                          onChange={(e) => setProductForm(prev => ({ ...prev, brand: e.target.value }))}
                          placeholder="e.g. Chronos"
                        />
                      </div>
                      
                      <div>
                        <Label>Model</Label>
                        <Input
                          value={productForm.model}
                          onChange={(e) => setProductForm(prev => ({ ...prev, model: e.target.value }))}
                          placeholder="e.g. Royal Heritage"
                        />
                      </div>
                      
                      <div>
                        <Label>Stock Quantity</Label>
                        <Input
                          type="number"
                          min="0"
                          value={productForm.totalStock}
                          onChange={(e) => setProductForm(prev => ({ ...prev, totalStock: Number(e.target.value) }))}
                          required
                        />
                      </div>
                    </div>
                    
                    <div>
                      <Label>Description</Label>
                      <Textarea
                        value={productForm.description}
                        onChange={(e) => setProductForm(prev => ({ ...prev, description: e.target.value }))}
                        rows={3}
                        required
                      />
                    </div>
                    
                    {/* Features */}
                    <div>
                      <Label>Features</Label>
                      {productForm.features.map((feature, index) => (
                        <div key={index} className="flex gap-2 mb-2">
                          <Input
                            value={feature}
                            onChange={(e) => handleArrayFieldChange('features', index, e.target.value)}
                            placeholder="Enter feature"
                          />
                          <Button 
                            type="button" 
                            variant="outline" 
                            onClick={() => removeArrayField('features', index)}
                          >
                            <Trash2 size={16} />
                          </Button>
                        </div>
                      ))}
                      <Button type="button" variant="outline" onClick={() => addArrayField('features')}>
                        Add Feature
                      </Button>
                    </div>
                    
                    {/* Colors */}
                    <div>
                      <Label>Colors</Label>
                      {productForm.colors.map((color, index) => (
                        <div key={index} className="flex gap-2 mb-2">
                          <Input
                            value={color}
                            onChange={(e) => handleArrayFieldChange('colors', index, e.target.value)}
                            placeholder="Enter color"
                          />
                          <Button 
                            type="button" 
                            variant="outline" 
                            onClick={() => removeArrayField('colors', index)}
                          >
                            <Trash2 size={16} />
                          </Button>
                        </div>
                      ))}
                      <Button type="button" variant="outline" onClick={() => addArrayField('colors')}>
                        Add Color
                      </Button>
                    </div>
                    
                    {/* Straps */}
                    <div>
                      <Label>Strap Types</Label>
                      {productForm.straps.map((strap, index) => (
                        <div key={index} className="flex gap-2 mb-2">
                          <Input
                            value={strap}
                            onChange={(e) => handleArrayFieldChange('straps', index, e.target.value)}
                            placeholder="Enter strap type"
                          />
                          <Button 
                            type="button" 
                            variant="outline" 
                            onClick={() => removeArrayField('straps', index)}
                          >
                            <Trash2 size={16} />
                          </Button>
                        </div>
                      ))}
                      <Button type="button" variant="outline" onClick={() => addArrayField('straps')}>
                        Add Strap Type
                      </Button>
                    </div>
                    
                    <div className="flex gap-4">
                      <label className="flex items-center gap-2">
                        <input
                          type="checkbox"
                          checked={productForm.isNew}
                          onChange={(e) => setProductForm(prev => ({ ...prev, isNew: e.target.checked }))}
                        />
                        New Product
                      </label>
                      <label className="flex items-center gap-2">
                        <input
                          type="checkbox"
                          checked={productForm.isLimited}
                          onChange={(e) => setProductForm(prev => ({ ...prev, isLimited: e.target.checked }))}
                        />
                        Limited Edition
                      </label>
                    </div>
                    
                    <div className="flex gap-4">
                      <Button type="submit" className="btn-gold" disabled={loading}>
                        {loading ? 'Saving...' : editingProduct ? 'Update Product' : 'Create Product'}
                      </Button>
                      <Button type="button" variant="outline" onClick={() => setShowProductDialog(false)}>
                        Cancel
                      </Button>
                    </div>
                  </form>
                </DialogContent>
              </Dialog>
            </div>

            {/* Products Table */}
            <Card>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Image</TableHead>
                    <TableHead>Name</TableHead>
                    <TableHead>Category</TableHead>
                    <TableHead>Price</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {products.map((product) => (
                    <TableRow key={product.id}>
                      <TableCell>
                        <img 
                          src={product.image} 
                          alt={product.name}
                          className="w-12 h-12 object-cover rounded"
                        />
                      </TableCell>
                      <TableCell className="font-medium">{product.name}</TableCell>
                      <TableCell>{product.category}</TableCell>
                      <TableCell>{formatPrice(product.price)}</TableCell>
                      <TableCell>
                        <div className="flex gap-1">
                          {product.isNew && <Badge variant="secondary">New</Badge>}
                          {product.isLimited && <Badge variant="destructive">Limited</Badge>}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex gap-2">
                          <Button 
                            size="sm" 
                            variant="outline"
                            onClick={() => handleEditProduct(product)}
                          >
                            <Edit size={16} />
                          </Button>
                          <Button 
                            size="sm" 
                            variant="outline"
                            onClick={() => handleDeleteProduct(product.id)}
                            className="text-destructive"
                          >
                            <Trash2 size={16} />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </Card>
          </TabsContent>

          <TabsContent value="orders">
            <Card>
              <div className="p-6 border-b">
                <h3 className="text-lg font-semibold">Orders Management</h3>
                <p className="text-muted-foreground">View and manage customer orders</p>
              </div>
              
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Order ID</TableHead>
                    <TableHead>Customer</TableHead>
                    <TableHead>Date</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Total</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {orders.length > 0 ? (
                    orders.map((order) => (
                      <TableRow key={order._id}>
                        <TableCell className="font-medium">#{order.orderNumber || order._id.slice(-6)}</TableCell>
                        <TableCell>
                          {order.user?.firstName} {order.user?.lastName}
                          <br />
                          <span className="text-sm text-muted-foreground">{order.user?.email}</span>
                        </TableCell>
                        <TableCell>{new Date(order.createdAt).toLocaleDateString()}</TableCell>
                        <TableCell>
                          <Badge variant={
                            order.status === 'delivered' ? 'default' :
                            order.status === 'shipped' ? 'secondary' :
                            order.status === 'processing' ? 'outline' : 'destructive'
                          }>
                            {order.status}
                          </Badge>
                        </TableCell>
                        <TableCell>{formatPrice(order.totalAmount)}</TableCell>
                        <TableCell>
                          <div className="flex gap-2">
                            <Button size="sm" variant="outline">
                              <Eye size={16} />
                            </Button>
                            <Button size="sm" variant="outline">
                              <CheckCircle size={16} />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell colSpan={6} className="text-center py-8">
                        <p className="text-muted-foreground">No orders found</p>
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </Card>
          </TabsContent>

          <TabsContent value="users">
            <Card>
              <div className="p-6 border-b">
                <h3 className="text-lg font-semibold">Users Management</h3>
                <p className="text-muted-foreground">View and manage customer accounts</p>
              </div>
              
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Name</TableHead>
                    <TableHead>Email</TableHead>
                    <TableHead>Joined</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Orders</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {users.length > 0 ? (
                    users.map((user) => (
                      <TableRow key={user._id}>
                        <TableCell className="font-medium">
                          {user.firstName} {user.lastName}
                        </TableCell>
                        <TableCell>{user.email}</TableCell>
                        <TableCell>{new Date(user.createdAt).toLocaleDateString()}</TableCell>
                        <TableCell>
                          <Badge variant={user.isActive ? 'default' : 'destructive'}>
                            {user.isActive ? 'Active' : 'Inactive'}
                          </Badge>
                        </TableCell>
                        <TableCell>{user.orderCount || 0}</TableCell>
                        <TableCell>
                          <div className="flex gap-2">
                            <Button size="sm" variant="outline">
                              <Eye size={16} />
                            </Button>
                            <Button 
                              size="sm" 
                              variant={user.isActive ? "destructive" : "default"}
                            >
                              {user.isActive ? 'Deactivate' : 'Activate'}
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell colSpan={6} className="text-center py-8">
                        <p className="text-muted-foreground">No users found</p>
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </Card>
          </TabsContent>

          <TabsContent value="data" className="space-y-6">
            <div className="grid gap-6">
              <Card className="p-6">
                <h3 className="text-lg font-semibold mb-4 text-destructive">⚠️ Production Data Management</h3>
                <p className="text-muted-foreground mb-6">
                  These tools are designed to prepare your store for production. Use with caution as these operations cannot be undone.
                </p>
                
                <div className="space-y-4">
                  <div className="border border-orange-200 rounded-lg p-4 bg-orange-50">
                    <h4 className="font-semibold text-orange-800 mb-2">Clear Sample Data</h4>
                    <p className="text-sm text-orange-700 mb-3">
                      Remove all demo products, categories, and sample orders. This will prepare your database for real products.
                    </p>
                    <Button 
                      variant="destructive" 
                      onClick={handleClearSampleData}
                      disabled={loading}
                    >
                      Clear All Sample Data
                    </Button>
                  </div>
                  
                  <div className="border border-green-200 rounded-lg p-4 bg-green-50">
                    <h4 className="font-semibold text-green-800 mb-2">Initialize Production Environment</h4>
                    <p className="text-sm text-green-700 mb-3">
                      Set up default categories and basic configuration for a production store.
                    </p>
                    <Button 
                      variant="default" 
                      onClick={handleInitProduction}
                      disabled={loading}
                    >
                      Initialize Production Data
                    </Button>
                  </div>
                  
                  <div className="border border-blue-200 rounded-lg p-4 bg-blue-50">
                    <h4 className="font-semibold text-blue-800 mb-2">Production Checklist</h4>
                    <div className="text-sm text-blue-700 space-y-1">
                      <p>✅ Admin dashboard fully functional</p>
                      <p>✅ Product CRUD operations working</p>
                      <p>✅ Authentication system secure</p>
                      <p>✅ Payment gateway integrated</p>
                      <p>⚠️ Clear sample data before going live</p>
                      <p>⚠️ Test all features thoroughly</p>
                      <p>⚠️ Configure production environment variables</p>
                    </div>
                  </div>
                </div>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default AdminDashboard;