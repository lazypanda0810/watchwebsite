# Project Setup Guide

## Prerequisites

- Node.js (v16 or higher)
- npm or yarn
- Git

## Initial Setup

1. **Clone or download the project**
   ```bash
   git clone <repository-url>
   cd watchwebsite
   ```

2. **Backend Setup**
   ```bash
   cd backend
   npm install
   cp .env.example .env
   # Edit .env file with your configuration
   npm run dev
   ```

3. **Frontend Setup**
   ```bash
   cd frontend
   npm install
   npm start
   ```

## Development Workflow

1. **Backend Development**
   - Add routes in `src/routes/`
   - Add controllers in `src/controllers/`
   - Add models in `src/models/`
   - Add middleware in `src/middleware/`
   - Add business logic in `src/services/`

2. **Frontend Development**
   - Add components in `src/components/`
   - Add pages in `src/pages/`
   - Add styles in `src/styles/`
   - Add API services in `src/services/`

## Testing

- Backend: `npm test`
- Frontend: `npm test`

## Building for Production

- Backend: `npm start`
- Frontend: `npm run build`

## Environment Variables

See `.env.example` files in both backend and frontend directories for required environment variables.