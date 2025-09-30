#!/usr/bin/env node

/**
 * Frontend startup validation for Chronos Watch Shop
 */

const fs = require('fs');
const path = require('path');

const colors = {
  red: '\x1b[31m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  cyan: '\x1b[36m',
  reset: '\x1b[0m'
};

console.log(`${colors.cyan}
╭─────────────────────────────────────────────────────────╮
│                                                         │
│   🏪 Chronos Watch Shop - Frontend Validation         │
│                                                         │
╰─────────────────────────────────────────────────────────╯
${colors.reset}`);

let hasErrors = false;

// Check environment file
console.log(`${colors.blue}📋 Checking environment configuration...${colors.reset}`);
if (!fs.existsSync('.env')) {
  console.log(`${colors.yellow}⚠️  .env file not found${colors.reset}`);
  console.log(`${colors.yellow}💡 Run: cp .env.example .env${colors.reset}`);
  
  if (fs.existsSync('.env.example')) {
    console.log(`${colors.green}✅ .env.example file exists${colors.reset}`);
  } else {
    console.log(`${colors.red}❌ .env.example file missing${colors.reset}`);
    hasErrors = true;
  }
} else {
  console.log(`${colors.green}✅ .env file exists${colors.reset}`);
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

// Check package.json
console.log(`${colors.blue}📄 Checking package.json...${colors.reset}`);
if (!fs.existsSync('package.json')) {
  console.log(`${colors.red}❌ package.json not found${colors.reset}`);
  hasErrors = true;
} else {
  const packageJson = JSON.parse(fs.readFileSync('package.json', 'utf8'));
  console.log(`${colors.green}✅ package.json exists${colors.reset}`);
  
  // Check critical scripts
  const requiredScripts = ['dev', 'build'];
  requiredScripts.forEach(script => {
    if (packageJson.scripts && packageJson.scripts[script]) {
      console.log(`${colors.green}✅ Script '${script}' exists${colors.reset}`);
    } else {
      console.log(`${colors.yellow}⚠️  Script '${script}' missing${colors.reset}`);
    }
  });
}

// Check critical frontend files
const criticalFiles = [
  'src/main.tsx',
  'src/App.tsx',
  'index.html',
  'vite.config.ts'
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

// Check if backend is accessible (optional)
console.log(`${colors.blue}🔗 Backend connectivity check...${colors.reset}`);
try {
  const { spawn } = require('child_process');
  const curl = spawn('curl', ['-s', '-o', '/dev/null', '-w', '%{http_code}', 'http://localhost:5000/health']);
  
  curl.stdout.on('data', (data) => {
    const statusCode = data.toString().trim();
    if (statusCode === '200') {
      console.log(`${colors.green}✅ Backend is accessible${colors.reset}`);
    } else {
      console.log(`${colors.yellow}⚠️  Backend not accessible (Status: ${statusCode})${colors.reset}`);
      console.log(`${colors.yellow}💡 Make sure backend server is running${colors.reset}`);
    }
  });
  
  curl.on('error', () => {
    console.log(`${colors.yellow}⚠️  Cannot check backend connectivity${colors.reset}`);
    console.log(`${colors.yellow}💡 Make sure backend server is running on port 5000${colors.reset}`);
  });
} catch (error) {
  console.log(`${colors.yellow}⚠️  Cannot perform backend connectivity check${colors.reset}`);
}

// Summary
setTimeout(() => {
  console.log(`\n${colors.cyan}📊 Validation Summary:${colors.reset}`);
  
  if (hasErrors) {
    console.log(`${colors.red}❌ Some critical issues found. Please fix them before starting the development server.${colors.reset}`);
    
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
    console.log(`${colors.green}✅ All critical checks passed! Frontend is ready to start.${colors.reset}`);
    
    console.log(`\n${colors.cyan}🚀 Start commands:${colors.reset}`);
    console.log(`   Development: ${colors.green}npm run dev${colors.reset}`);
    console.log(`   Build:       ${colors.green}npm run build${colors.reset}`);
    console.log(`   Preview:     ${colors.green}npm run preview${colors.reset}`);
    
    process.exit(0);
  }
}, 1000); // Give backend check time to complete