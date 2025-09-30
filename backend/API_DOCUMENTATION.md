# Premium Watch E-commerce Backend API

## Quick Start

1. **Install dependencies:**
   ```bash
   npm install
   ```

2. **Setup environment variables:**
   ```bash
   cp .env.example .env
   # Edit .env with your configurations
   ```

3. **Seed the database:**
   ```bash
   npm run seed
   ```

4. **Start development server:**
   ```bash
   npm run dev
   ```

5. **Start production server:**
   ```bash
   npm start
   ```

## API Endpoints

### Authentication (`/api/auth`)
- `POST /signup` - Customer registration
- `POST /login` - Customer/Admin login
- `GET /me` - Get current user profile
- `PUT /profile` - Update user profile
- `POST /addresses` - Add user address
- `POST /logout` - Logout user

### Products (`/api/products`)
- `GET /` - Get all products (with filters, pagination)
- `GET /:id` - Get single product
- `GET /category/:categoryId` - Get products by category
- `POST /:id/reviews` - Add product review (Auth required)

### Categories (`/api/products/categories`)
- `GET /all` - Get all categories

### Cart (`/api/cart`)
- `GET /` - Get user cart (Auth required)
- `POST /` - Add item to cart (Auth required)
- `PUT /:productId` - Update cart item (Auth required)
- `DELETE /:productId` - Remove item from cart (Auth required)
- `DELETE /` - Clear cart (Auth required)

### Wishlist (`/api/cart/wishlist`)
- `GET /` - Get user wishlist (Auth required)
- `POST /` - Add to wishlist (Auth required)
- `DELETE /:productId` - Remove from wishlist (Auth required)

### Orders (`/api/orders`)
- `GET /` - Get user orders (Auth required)
- `GET /:id` - Get single order (Auth required)
- `PUT /:id/cancel` - Cancel order (Auth required)

### Checkout (`/api/checkout`)
- `POST /` - Process checkout (Auth required)

### Admin Endpoints

#### Products (`/api/admin/products`)
- `POST /` - Create product (Admin only)
- `PUT /:id` - Update product (Admin only)
- `DELETE /:id` - Delete product (Admin only)

#### Categories (`/api/admin/categories`)
- `POST /` - Create category (Admin only)
- `PUT /:id` - Update category (Admin only)
- `DELETE /:id` - Delete category (Admin only)

#### Orders (`/api/admin/orders`)
- `GET /` - Get all orders (Admin only)
- `PUT /:id/status` - Update order status (Admin only)

## Request Examples

### Customer Registration
```bash
curl -X POST http://localhost:5000/api/auth/signup \
  -H "Content-Type: application/json" \
  -d '{
    "firstName": "John",
    "lastName": "Doe",
    "email": "john@example.com",
    "password": "SecurePass123!",
    "phone": "9876543210"
  }'
```

### Login
```bash
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "john@example.com",
    "password": "SecurePass123!"
  }'
```

### Get Products
```bash
curl "http://localhost:5000/api/products?page=1&limit=12&sort=price_asc&brand=Rolex"
```

### Add to Cart
```bash
curl -X POST http://localhost:5000/api/cart \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -d '{
    "productId": "PRODUCT_ID",
    "variantSku": "VARIANT_SKU",
    "quantity": 1
  }'
```

### Checkout
```bash
curl -X POST http://localhost:5000/api/checkout \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -d '{
    "shippingAddress": {
      "firstName": "John",
      "lastName": "Doe",
      "email": "john@example.com",
      "phone": "9876543210",
      "street": "123 Main St",
      "city": "Mumbai",
      "state": "Maharashtra",
      "pincode": "400001"
    },
    "paymentMethod": "UPI",
    "shippingPartner": "delhivery"
  }'
```

## Default Admin Credentials
- **Email:** admin@premiumwatches.com
- **Password:** SecureAdminPassword123!

## Features Implemented

✅ **Authentication & Authorization**
- JWT-based authentication
- Role-based access control (Admin/Customer)
- Password hashing with bcrypt
- Secure token generation

✅ **Product Management**
- CRUD operations for products
- Product variants (color, strap material)
- Categories and subcategories
- Advanced search and filtering
- Pagination and sorting
- Product reviews and ratings

✅ **Shopping Cart**
- Add/remove items
- Update quantities
- Cart persistence
- Stock validation

✅ **Wishlist**
- Add/remove products
- User-specific wishlist

✅ **Order Management**
- Complete checkout process
- Multiple payment methods (UPI, Cards, COD, PayPal)
- GST calculation (18% for watches)
- Order status tracking
- Order history

✅ **Shipping Integration**
- Multiple shipping partners (Delhivery, Shiprocket, BlueDart)
- Shipping cost calculation
- Tracking number generation
- Estimated delivery dates

✅ **Admin Features**
- Product management
- Category management
- Order management
- User management capabilities

✅ **Security**
- Rate limiting
- CORS protection
- XSS protection
- NoSQL injection prevention
- Helmet security headers
- Data sanitization

✅ **Performance**
- Database indexing
- Compression middleware
- Optimized queries
- Efficient pagination

✅ **Sample Data**
- 100+ premium watch products
- Multiple brands (Rolex, Omega, Tag Heuer, etc.)
- Various categories and variants
- Sample reviews and ratings

## Environment Variables

See `.env.example` for all required environment variables.

## Database Schema

The application uses MongoDB with the following main collections:
- **users** - Customer and admin accounts
- **products** - Watch products with variants
- **categories** - Product categories
- **carts** - Shopping carts
- **orders** - Order records

## High Traffic Support

The backend is designed to handle 5,000+ concurrent users with:
- Efficient database queries with proper indexing
- Rate limiting to prevent abuse
- Compression to reduce response sizes
- Proper error handling and logging
- Scalable architecture patterns

## Production Considerations

- Use Redis for session storage and caching
- Implement proper logging with Winston
- Set up monitoring with tools like PM2
- Use environment-specific configurations
- Implement proper backup strategies
- Set up SSL/HTTPS certificates
- Use production-grade database clusters