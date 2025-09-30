#!/bin/bash

# Chronos Watch Shop - Complete Setup Script
# This script sets up both frontend and backend development environment

set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
CYAN='\033[0;36m'
NC='\033[0m' # No Color

# Function to print colored output
print_status() {
    echo -e "${BLUE}[INFO]${NC} $1"
}

print_success() {
    echo -e "${GREEN}[SUCCESS]${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

print_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

print_header() {
    echo -e "${CYAN}"
    echo "╭─────────────────────────────────────────────────────────╮"
    echo "│                                                         │"
    echo "│   🏪 Chronos Watch Shop - Complete Setup              │"
    echo "│                                                         │"
    echo "╰─────────────────────────────────────────────────────────╯"
    echo -e "${NC}"
}

# Check if Node.js is installed
check_nodejs() {
    print_status "Checking Node.js installation..."
    if command -v node > /dev/null 2>&1; then
        NODE_VERSION=$(node --version)
        print_success "Node.js $NODE_VERSION is installed"
        
        # Check if version is 18 or higher
        MAJOR_VERSION=$(echo $NODE_VERSION | sed 's/v\([0-9]*\).*/\1/')
        if [ "$MAJOR_VERSION" -ge 18 ]; then
            print_success "Node.js version is compatible (>= 18)"
        else
            print_warning "Node.js version is $MAJOR_VERSION. Version 18+ is recommended."
        fi
    else
        print_error "Node.js is not installed. Please install Node.js 18+ from https://nodejs.org/"
        exit 1
    fi
}

# Check if npm is installed
check_npm() {
    print_status "Checking npm installation..."
    if command -v npm > /dev/null 2>&1; then
        NPM_VERSION=$(npm --version)
        print_success "npm $NPM_VERSION is installed"
    else
        print_error "npm is not installed. Please install npm."
        exit 1
    fi
}

# Check if MongoDB is running
check_mongodb() {
    print_status "Checking MongoDB connection..."
    if command -v mongosh > /dev/null 2>&1; then
        if mongosh --eval "quit()" > /dev/null 2>&1; then
            print_success "MongoDB is accessible"
        else
            print_warning "MongoDB might not be running. Please start MongoDB service."
            print_status "Start MongoDB with: brew services start mongodb-community (macOS) or sudo systemctl start mongod (Linux)"
        fi
    else
        print_warning "mongosh not found. Please install MongoDB and ensure it's running."
    fi
}

# Setup backend
setup_backend() {
    print_status "Setting up backend..."
    
    if [ ! -d "backend" ]; then
        print_error "Backend directory not found!"
        exit 1
    fi
    
    cd backend
    
    # Install dependencies
    print_status "Installing backend dependencies..."
    npm install
    
    # Copy environment file if it doesn't exist
    if [ ! -f ".env" ]; then
        if [ -f ".env.example" ]; then
            print_status "Copying .env.example to .env..."
            cp .env.example .env
            print_warning "Please edit backend/.env file with your configurations"
        else
            print_error "backend/.env.example not found!"
            exit 1
        fi
    else
        print_success "Backend .env file already exists"
    fi
    
    # Run startup check
    print_status "Running backend validation..."
    if npm run check; then
        print_success "Backend setup completed successfully"
    else
        print_warning "Backend validation had some warnings. Check the output above."
    fi
    
    cd ..
}

# Setup frontend
setup_frontend() {
    print_status "Setting up frontend..."
    
    if [ ! -d "frontend" ]; then
        print_error "Frontend directory not found!"
        exit 1
    fi
    
    cd frontend
    
    # Install dependencies
    print_status "Installing frontend dependencies..."
    npm install
    
    # Copy environment file if it doesn't exist
    if [ ! -f ".env" ]; then
        if [ -f ".env.example" ]; then
            print_status "Copying .env.example to .env..."
            cp .env.example .env
            print_success "Frontend .env file created"
        else
            print_warning "frontend/.env.example not found, creating basic .env file..."
            echo "VITE_API_BASE_URL=http://localhost:5000" > .env
            echo "VITE_RAZORPAY_KEY_ID=rzp_test_your_key_id" >> .env
        fi
    else
        print_success "Frontend .env file already exists"
    fi
    
    # Run startup check (but don't fail if it has warnings)
    print_status "Running frontend validation..."
    npm run check || print_warning "Frontend validation had some warnings"
    
    cd ..
}

# Main setup function
main() {
    print_header
    
    print_status "Starting complete setup for Chronos Watch Shop..."
    
    # Pre-flight checks
    check_nodejs
    check_npm
    check_mongodb
    
    # Setup components
    setup_backend
    setup_frontend
    
    # Final instructions
    echo -e "${CYAN}"
    echo "╭─────────────────────────────────────────────────────────╮"
    echo "│                                                         │"
    echo "│   🎉 Setup Complete!                                   │"
    echo "│                                                         │"
    echo "│   Next steps:                                           │"
    echo "│                                                         │"
    echo "│   1. Edit backend/.env with your configurations        │"
    echo "│   2. Edit frontend/.env if needed                      │"
    echo "│   3. Start backend:  cd backend && npm run dev         │"
    echo "│   4. Start frontend: cd frontend && npm run dev        │"
    echo "│                                                         │"
    echo "│   Access your app at: http://localhost:8080            │"
    echo "│   Backend API at:     http://localhost:5000            │"
    echo "│                                                         │"
    echo "╰─────────────────────────────────────────────────────────╯"
    echo -e "${NC}"
    
    print_success "All done! Happy coding! 🚀"
}

# Run main function
main "$@"