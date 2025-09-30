#!/usr/bin/env node

/**
 * Complete project validation script
 * Checks both frontend and backend configurations
 */

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

const colors = {
  red: '\x1b[31m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  cyan: '\x1b[36m',
  magenta: '\x1b[35m',
  reset: '\x1b[0m'
};

console.log(`${colors.cyan}
╭─────────────────────────────────────────────────────────╮
│                                                         │
│   🏪 Chronos Watch Shop - Complete Validation         │
│                                                         │
╰─────────────────────────────────────────────────────────╯
${colors.reset}`);

let totalErrors = 0;
let totalWarnings = 0;

function printStatus(message, type = 'info') {
  const symbols = {
    success: `${colors.green}✅`,
    error: `${colors.red}❌`,
    warning: `${colors.yellow}⚠️`,
    info: `${colors.blue}ℹ️`
  };
  console.log(`${symbols[type]} ${message}${colors.reset}`);
}

function checkDirectory(dir, name) {
  console.log(`\n${colors.magenta}📁 Checking ${name}...${colors.reset}`);
  
  if (!fs.existsSync(dir)) {
    printStatus(`${name} directory not found`, 'error');
    totalErrors++;
    return false;
  }
  
  printStatus(`${name} directory exists`, 'success');
  
  // Check package.json
  const packageJsonPath = path.join(dir, 'package.json');
  if (fs.existsSync(packageJsonPath)) {
    printStatus(`${name} package.json exists`, 'success');
    
    try {
      const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf8'));
      printStatus(`${name} package.json is valid JSON`, 'success');
    } catch (error) {
      printStatus(`${name} package.json is invalid JSON`, 'error');
      totalErrors++;
    }
  } else {
    printStatus(`${name} package.json missing`, 'error');
    totalErrors++;
  }
  
  // Check node_modules
  const nodeModulesPath = path.join(dir, 'node_modules');
  if (fs.existsSync(nodeModulesPath)) {
    printStatus(`${name} dependencies installed`, 'success');
  } else {
    printStatus(`${name} dependencies not installed`, 'warning');
    totalWarnings++;
  }
  
  // Check .env file
  const envPath = path.join(dir, '.env');
  const envExamplePath = path.join(dir, '.env.example');
  
  if (fs.existsSync(envPath)) {
    printStatus(`${name} .env file exists`, 'success');
  } else if (fs.existsSync(envExamplePath)) {
    printStatus(`${name} .env missing (but .env.example exists)`, 'warning');
    totalWarnings++;
  } else {
    printStatus(`${name} .env and .env.example missing`, 'error');
    totalErrors++;
  }
  
  return true;
}

function checkBackendSpecific() {
  console.log(`\n${colors.magenta}🔧 Backend-specific checks...${colors.reset}`);
  
  const backendFiles = [
    'backend/src/index.js',
    'backend/src/config/database.js',
    'backend/src/middleware/errorHandler.js',
    'backend/scripts/startup-check.js'
  ];
  
  backendFiles.forEach(file => {
    if (fs.existsSync(file)) {
      printStatus(`${file} exists`, 'success');
    } else {
      printStatus(`${file} missing`, 'error');
      totalErrors++;
    }
  });
}

function checkFrontendSpecific() {
  console.log(`\n${colors.magenta}⚛️  Frontend-specific checks...${colors.reset}`);
  
  const frontendFiles = [
    'frontend/src/main.tsx',
    'frontend/src/App.tsx',
    'frontend/vite.config.ts',
    'frontend/index.html',
    'frontend/scripts/startup-check.js'
  ];
  
  frontendFiles.forEach(file => {
    if (fs.existsSync(file)) {
      printStatus(`${file} exists`, 'success');
    } else {
      printStatus(`${file} missing`, 'error');
      totalErrors++;
    }
  });
}

function checkGlobalFiles() {
  console.log(`\n${colors.magenta}🌐 Global project files...${colors.reset}`);
  
  const globalFiles = [
    'README.md',
    'setup.sh',
    '.gitignore'
  ];
  
  globalFiles.forEach(file => {
    if (fs.existsSync(file)) {
      printStatus(`${file} exists`, 'success');
    } else {
      printStatus(`${file} missing`, 'warning');
      totalWarnings++;
    }
  });
  
  // Check if setup.sh is executable
  try {
    const stats = fs.statSync('setup.sh');
    if (stats.mode & parseInt('100', 8)) {
      printStatus('setup.sh is executable', 'success');
    } else {
      printStatus('setup.sh is not executable', 'warning');
      totalWarnings++;
    }
  } catch (error) {
    // File doesn't exist, already reported above
  }
}

function checkNodeVersion() {
  console.log(`\n${colors.magenta}📦 Node.js version check...${colors.reset}`);
  
  try {
    const nodeVersion = execSync('node --version', { encoding: 'utf8' }).trim();
    const majorVersion = parseInt(nodeVersion.replace('v', '').split('.')[0]);
    
    if (majorVersion >= 18) {
      printStatus(`Node.js ${nodeVersion} (compatible)`, 'success');
    } else {
      printStatus(`Node.js ${nodeVersion} (upgrade recommended to v18+)`, 'warning');
      totalWarnings++;
    }
  } catch (error) {
    printStatus('Node.js not found', 'error');
    totalErrors++;
  }
}

function checkMongoDB() {
  console.log(`\n${colors.magenta}🗄️  MongoDB connectivity...${colors.reset}`);
  
  try {
    execSync('mongosh --eval "quit()" --quiet', { stdio: 'pipe' });
    printStatus('MongoDB is accessible', 'success');
  } catch (error) {
    printStatus('MongoDB connection failed', 'warning');
    totalWarnings++;
  }
}

function printSummary() {
  console.log(`\n${colors.cyan}📊 Validation Summary:${colors.reset}`);
  console.log(`${colors.green}✅ Total Successes: Many checks passed${colors.reset}`);
  console.log(`${colors.yellow}⚠️  Total Warnings: ${totalWarnings}${colors.reset}`);
  console.log(`${colors.red}❌ Total Errors: ${totalErrors}${colors.reset}`);
  
  if (totalErrors === 0 && totalWarnings === 0) {
    console.log(`\n${colors.green}🎉 Perfect! Your project is ready to go!${colors.reset}`);
    console.log(`\n${colors.cyan}🚀 Quick start:${colors.reset}`);
    console.log(`   ${colors.blue}Terminal 1:${colors.reset} cd backend && npm run dev`);
    console.log(`   ${colors.blue}Terminal 2:${colors.reset} cd frontend && npm run dev`);
  } else if (totalErrors === 0) {
    console.log(`\n${colors.yellow}⚠️  Your project has some warnings but should work fine.${colors.reset}`);
    console.log(`\n${colors.cyan}🚀 You can start the project:${colors.reset}`);
    console.log(`   ${colors.blue}Terminal 1:${colors.reset} cd backend && npm run dev`);
    console.log(`   ${colors.blue}Terminal 2:${colors.reset} cd frontend && npm run dev`);
  } else {
    console.log(`\n${colors.red}❌ Please fix the errors before running the project.${colors.reset}`);
    console.log(`\n${colors.yellow}💡 Try running the setup script:${colors.reset}`);
    console.log(`   ${colors.blue}./setup.sh${colors.reset}`);
  }
  
  console.log(`\n${colors.cyan}📞 Need help? Check the troubleshooting section in README.md${colors.reset}`);
}

// Run all checks
function main() {
  checkNodeVersion();
  checkMongoDB();
  
  checkDirectory('backend', 'Backend');
  checkDirectory('frontend', 'Frontend');
  
  checkBackendSpecific();
  checkFrontendSpecific();
  checkGlobalFiles();
  
  printSummary();
  
  process.exit(totalErrors > 0 ? 1 : 0);
}

main();