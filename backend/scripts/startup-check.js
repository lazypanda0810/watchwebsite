#!/usr/bin/env node

/**
 * Startup check script for Chronos Watch Shop
 * Validates all required services and configurations before starting
 */

const fs = require('fs');
const path = require('path');
const mongoose = require('mongoose');
require('dotenv').config();

const colors = {
  red: '\x1b[31m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  magenta: '\x1b[35m',
  cyan: '\x1b[36m',
  white: '\x1b[37m',
  reset: '\x1b[0m'
};

console.log(`${colors.cyan}
╭─────────────────────────────────────────────────────────╮
│                                                         │
│   🏪 Chronos Watch Shop - Startup Validation          │
│                                                         │
╰─────────────────────────────────────────────────────────╯
${colors.reset}`);

let hasErrors = false;

// Check environment file
console.log(`${colors.blue}📋 Checking environment configuration...${colors.reset}`);
if (!fs.existsSync('.env')) {
  console.log(`${colors.red}❌ .env file not found${colors.reset}`);
  console.log(`${colors.yellow}💡 Run: cp .env.example .env${colors.reset}`);
  hasErrors = true;
} else {
  console.log(`${colors.green}✅ .env file exists${colors.reset}`);
}

// Check required environment variables
const requiredEnvVars = [
  'MONGODB_URI',
  'SESSION_SECRET',
  'CORS_ORIGIN'
];

const optionalEnvVars = [
  'GOOGLE_CLIENT_ID',
  'GOOGLE_CLIENT_SECRET',
  'RAZORPAY_KEY_ID',
  'RAZORPAY_KEY_SECRET',
  'EMAIL_USER',
  'EMAIL_PASSWORD'
];

console.log(`${colors.blue}🔑 Checking required environment variables...${colors.reset}`);
requiredEnvVars.forEach(envVar => {
  if (!process.env[envVar]) {
    console.log(`${colors.red}❌ Missing required: ${envVar}${colors.reset}`);
    hasErrors = true;
  } else {
    console.log(`${colors.green}✅ ${envVar}${colors.reset}`);
  }
});

console.log(`${colors.blue}⚡ Checking optional environment variables...${colors.reset}`);
optionalEnvVars.forEach(envVar => {
  if (!process.env[envVar]) {
    console.log(`${colors.yellow}⚠️  Optional missing: ${envVar}${colors.reset}`);
  } else {
    console.log(`${colors.green}✅ ${envVar}${colors.reset}`);
  }
});

// Check MongoDB connection
console.log(`${colors.blue}🗄️  Testing MongoDB connection...${colors.reset}`);
async function checkMongoDB() {
  try {
    await mongoose.connect(process.env.MONGODB_URI, {
      serverSelectionTimeoutMS: 5000
    });
    console.log(`${colors.green}✅ MongoDB connection successful${colors.reset}`);
    await mongoose.connection.close();
  } catch (error) {
    console.log(`${colors.red}❌ MongoDB connection failed: ${error.message}${colors.reset}`);
    hasErrors = true;
  }
}

// Check node modules
console.log(`${colors.blue}📦 Checking dependencies...${colors.reset}`);
if (!fs.existsSync('node_modules')) {
  console.log(`${colors.red}❌ node_modules not found${colors.reset}`);
  console.log(`${colors.yellow}💡 Run: npm install${colors.reset}`);
  hasErrors = true;
} else {
  console.log(`${colors.green}✅ Dependencies installed${colors.reset}`);
}

// Check package.json scripts
const packageJson = JSON.parse(fs.readFileSync('package.json', 'utf8'));
const requiredScripts = ['start', 'dev'];
console.log(`${colors.blue}🚀 Checking npm scripts...${colors.reset}`);
requiredScripts.forEach(script => {
  if (packageJson.scripts && packageJson.scripts[script]) {
    console.log(`${colors.green}✅ Script '${script}' exists${colors.reset}`);
  } else {
    console.log(`${colors.yellow}⚠️  Script '${script}' missing${colors.reset}`);
  }
});

// Check critical files
const criticalFiles = [
  'src/index.js',
  'src/config/database.js',
  'src/middleware/errorHandler.js'
];

console.log(`${colors.blue}📁 Checking critical files...${colors.reset}`);
criticalFiles.forEach(file => {
  if (fs.existsSync(file)) {
    console.log(`${colors.green}✅ ${file}${colors.reset}`);
  } else {
    console.log(`${colors.red}❌ Missing: ${file}${colors.reset}`);
    hasErrors = true;
  }
});

// Run async checks
async function runAsyncChecks() {
  if (process.env.MONGODB_URI) {
    await checkMongoDB();
  }

  console.log(`\n${colors.cyan}📊 Validation Summary:${colors.reset}`);
  
  if (hasErrors) {
    console.log(`${colors.red}❌ Some critical issues found. Please fix them before starting the server.${colors.reset}`);
    
    console.log(`\n${colors.yellow}💡 Quick fix commands:${colors.reset}`);
    if (!fs.existsSync('.env')) {
      console.log(`   cp .env.example .env`);
    }
    if (!fs.existsSync('node_modules')) {
      console.log(`   npm install`);
    }
    console.log(`   # Edit .env file with your configurations`);
    
    process.exit(1);
  } else {
    console.log(`${colors.green}✅ All checks passed! The application is ready to start.${colors.reset}`);
    
    console.log(`\n${colors.cyan}🚀 Start commands:${colors.reset}`);
    console.log(`   Development: ${colors.green}npm run dev${colors.reset}`);
    console.log(`   Production:  ${colors.green}npm start${colors.reset}`);
    
    process.exit(0);
  }
}

runAsyncChecks();