# Admin Dashboard Guide

## Overview

The admin dashboard provides comprehensive management capabilities for the watch e-commerce platform, including product management, user management, and order tracking.

## Admin Access

### Login Credentials

**Default Admin Account:**

- **Email:** `admin@premiumwatches.com`
- **Password:** `SecureAdminPassword123!`

> ⚠️ **Security Note:** Change the default admin password in production by updating the `ADMIN_PASSWORD` environment variable.

### Access URLs

- **Admin Login:** `http://localhost:8081/admin/login`
- **Admin Dashboard:** `http://localhost:8081/admin/dashboard`

## Environment Configuration

### Backend (.env)

```bash
# Admin Configuration
ADMIN_EMAIL=admin@premiumwatches.com
ADMIN_PASSWORD=SecureAdminPassword123!
```

### Example Configuration (.env.example)

```bash
# Admin Configuration
ADMIN_EMAIL=admin@premiumwatches.com
ADMIN_PASSWORD=SecureAdminPassword123!
```

## Admin Features

### 1. Dashboard Statistics

- Total products count
- Total users count
- Total orders count
- Revenue analytics
- Recent orders overview
- Top-selling products
- Monthly sales charts

### 2. Product Management

- **View Products:** List all products with details
- **Add Products:** Create new watch products with specifications
- **Edit Products:** Update existing product information
- **Delete Products:** Remove products from catalog
- **Categories:** Manage product categories

### 3. User Management

- View all registered customers
- Activate/deactivate user accounts
- User activity monitoring
- User statistics

### 4. Order Management

- View all orders with status
- Update order status (pending → confirmed → processing → shipped → delivered)
- Order details and tracking
- Customer order history

## API Endpoints

### Admin Authentication

- `POST /api/auth/login` - Admin login (same as customer login)

### Admin Dashboard

- `GET /api/admin/stats` - Dashboard statistics
- `GET /api/admin/users` - User management
- `PUT /api/admin/users/:id/status` - Update user status
- `GET /api/admin/orders` - Order management
- `PUT /api/admin/orders/:id/status` - Update order status

### Product Management

- `GET /api/products` - Get all products
- `POST /api/products/admin/products` - Create product
- `PUT /api/products/admin/products/:id` - Update product
- `DELETE /api/products/admin/products/:id` - Delete product
- `POST /api/products/admin/categories` - Create category
- `PUT /api/products/admin/categories/:id` - Update category
- `DELETE /api/products/admin/categories/:id` - Delete category

## Security Features

### Authentication & Authorization

- JWT-based authentication
- Role-based access control (admin role required)
- Protected routes with middleware
- Session management

### Security Middleware

- Rate limiting on auth endpoints
- Input validation and sanitization
- XSS protection
- CORS configuration
- Helmet security headers

### Database Security

- MongoDB injection protection
- Encrypted password storage (bcrypt)
- User role validation
- Admin-only route protection

## Setup Instructions

### 1. Admin User Creation

The admin user is automatically created when running the seed script:

```bash
cd backend
node src/scripts/seedData.js
```

### 2. Backend Setup

Ensure the backend server is running with admin routes:

```bash
cd backend
npm start
```

### 3. Frontend Setup

Start the frontend development server:

```bash
cd frontend
npm run dev
```

### 4. Access Admin Dashboard

1. Navigate to `http://localhost:8081/admin/login`
2. Enter admin credentials
3. Access dashboard at `http://localhost:8081/admin/dashboard`

## Development Notes

### Product Management

- Products support multiple variants (colors, straps)
- Image management with placeholder support
- Rich product specifications
- Category-based organization
- Stock and price management

### Order Status Flow

```
pending → confirmed → processing → shipped → delivered
                    ↓
                cancelled (possible from any status)
```

### User Roles

- `customer` - Regular users with shopping access
- `admin` - Administrative users with full access

## Troubleshooting

### Common Issues

1. **Admin Login Fails**

   - Verify credentials in .env file
   - Check if admin user exists in database
   - Run seed script to create admin user

2. **Dashboard Not Loading**

   - Ensure backend server is running
   - Check admin routes are registered
   - Verify JWT token is valid

3. **API Endpoints Not Working**
   - Check if admin routes are imported in server
   - Verify middleware is applied correctly
   - Check authentication headers

### Logs and Monitoring

- All admin actions are logged
- Failed login attempts are tracked
- API errors are recorded with details
- Rate limiting prevents abuse

## Production Deployment

### Security Checklist

- [ ] Change default admin password
- [ ] Update JWT secrets
- [ ] Configure proper CORS origins
- [ ] Enable HTTPS
- [ ] Set up proper logging
- [ ] Configure rate limiting
- [ ] Review admin user permissions

### Environment Variables

Ensure all required environment variables are set in production:

- `ADMIN_EMAIL`
- `ADMIN_PASSWORD`
- `JWT_SECRET`
- `MONGODB_URI`
- And all other required variables

## Support

For technical support or questions about the admin dashboard:

1. Check the logs for error details
2. Verify environment configuration
3. Ensure all dependencies are installed
4. Review the API documentation

---

**Note:** This admin dashboard provides comprehensive management capabilities for the watch e-commerce platform. Always follow security best practices when deploying to production.
