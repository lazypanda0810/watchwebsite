# Google OAuth Double-Check Authentication Setup Guide

## 🔐 Secure Authentication System Implementation

This guide will help you set up Google OAuth authentication with email verification (double-check) for your Chronos Watch Shop application.

## 📋 Prerequisites

1. **Google Cloud Console Account**
2. **Gmail Account** (for sending verification emails)
3. **Node.js and npm** installed

## 🚀 Step-by-Step Setup

### 1. Google Cloud Console Configuration

1. **Go to Google Cloud Console**: https://console.cloud.google.com/
2. **Create a new project** or select existing one
3. **Enable Google+ API**:
   - Navigate to "APIs & Services" > "Library"
   - Search for "Google+ API" and enable it
4. **Create OAuth 2.0 Credentials**:
   - Go to "APIs & Services" > "Credentials"
   - Click "Create Credentials" > "OAuth 2.0 Client IDs"
   - Choose "Web application"
   - Add authorized redirect URIs:
     - `http://localhost:5000/auth/google/callback` (for development)
     - `https://yourdomain.com/auth/google/callback` (for production)
   - Save and copy the **Client ID** and **Client Secret**

### 2. Gmail App Password Setup

1. **Enable 2-Factor Authentication** on your Gmail account
2. **Generate App Password**:
   - Go to Google Account settings: https://myaccount.google.com/
   - Security > App passwords
   - Generate a new app password for "Mail"
   - Copy the 16-character password

### 3. Environment Configuration

Update your `.env` file with the following values:

```env
# Session Configuration
SESSION_SECRET=your-super-secret-session-key-change-this-in-production

# Google OAuth Configuration
GOOGLE_CLIENT_ID=your-google-client-id-from-step-1
GOOGLE_CLIENT_SECRET=your-google-client-secret-from-step-1

# Email Configuration (Update existing values)
EMAIL_USER=your-gmail-address@gmail.com
EMAIL_PASSWORD=your-16-character-app-password-from-step-2

# Authentication Configuration
EMAIL_FROM_NAME=Chronos Watch Shop
VERIFICATION_CODE_EXPIRES=600000
```

### 4. Start the Servers

1. **Backend Server**:
   ```bash
   cd backend
   npm start
   ```
   Server will run on: http://localhost:5000

2. **Frontend Server**:
   ```bash
   cd frontend
   npm run dev
   ```
   Frontend will run on: http://localhost:8080

## 🔄 Authentication Flow

1. **User clicks "Login with Google"** → Redirects to Google OAuth
2. **Google authentication successful** → User data received
3. **6-digit code generated** → Sent to user's email via Nodemailer
4. **User enters code** → System verifies and grants full access
5. **Session established** → User can access protected routes

## 🛡️ Security Features

- ✅ **Google OAuth 2.0** - Secure third-party authentication
- ✅ **Email Verification** - Double-check with 6-digit code
- ✅ **Session Management** - Secure express-session
- ✅ **Code Expiration** - 10-minute timeout
- ✅ **Protected Routes** - Middleware-based protection
- ✅ **HTTPS Support** - Production-ready security

## 🌐 API Endpoints

### Authentication Routes
- `GET /auth/google` - Initiate Google OAuth
- `GET /auth/google/callback` - OAuth callback
- `POST /auth/verify-code` - Submit verification code
- `POST /auth/resend-code` - Resend verification code
- `GET /auth/user` - Get current user info
- `POST /auth/logout` - Logout user

### Frontend Routes
- `/secure-login` - Google OAuth login page
- `/verify-email` - Email verification page
- Protected routes require authentication

## 🧪 Testing the System

1. **Navigate to**: http://localhost:8080/secure-login
2. **Click "Continue with Google"**
3. **Complete Google OAuth**
4. **Check your email** for the 6-digit code
5. **Enter the code** on the verification page
6. **Access protected features**

## 🚨 Troubleshooting

### Common Issues:

1. **"OAuth failed"** - Check Google Client ID/Secret
2. **"Email failed"** - Verify Gmail app password
3. **"Code expired"** - Request new code (10-minute limit)
4. **CORS errors** - Ensure frontend/backend ports match .env

### Debug Commands:
```bash
# Check server logs
npm start

# Test email configuration
curl -X POST http://localhost:5000/auth/resend-code

# Check session data
curl -X GET http://localhost:5000/auth/user --cookie-jar cookies.txt
```

## 🔧 Production Deployment

1. **Update CORS_ORIGIN** to your production domain
2. **Set SESSION_SECRET** to a strong random string
3. **Use HTTPS** for secure cookies
4. **Update OAuth redirect URIs** in Google Console
5. **Use production SMTP** service (optional)

## 📝 Code Structure

```
backend/
├── middleware/auth.js      # Passport config & middleware
├── routes/auth.js          # Authentication routes
└── src/index.js           # Updated main server

frontend/
├── src/pages/Login.tsx           # Google OAuth login
├── src/pages/VerifyEmail.tsx     # Email verification
├── src/context/AuthContext.tsx  # Auth state management
├── src/components/ProtectedRoute.tsx # Route protection
└── src/App.tsx                   # Updated with auth routes
```

## 🎯 Next Steps

1. **Customize email templates** in `middleware/auth.js`
2. **Add user database integration** for persistent user data
3. **Implement role-based access control** (RBAC)
4. **Add social login options** (Facebook, GitHub, etc.)
5. **Set up monitoring** and logging for security events

---

**🛡️ Your secure authentication system is now ready!**

Navigate to http://localhost:8080/secure-login to test the complete flow.