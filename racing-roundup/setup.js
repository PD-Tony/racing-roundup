/**
 * Racing Roundup Setup Script
 * 
 * This script helps set up the Racing Roundup project for development and testing.
 * It checks for required dependencies and provides guidance on configuration.
 */

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');
const readline = require('readline');

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

console.log('\n\x1b[36m=== Racing Roundup Setup ===\x1b[0m\n');

// Check if .env.local exists and prompt for MongoDB URI
const envPath = path.join(__dirname, '.env.local');
if (fs.existsSync(envPath)) {
  console.log('✅ .env.local file found');
  
  // Read the file to check if MongoDB URI is set
  const envContent = fs.readFileSync(envPath, 'utf8');
  if (envContent.includes('mongodb+srv://username:password')) {
    console.log('\x1b[33m⚠️  Warning: Default MongoDB URI detected in .env.local\x1b[0m');
    console.log('   Please update with your actual MongoDB connection string');
  }
} else {
  console.log('\x1b[31m❌ .env.local file not found\x1b[0m');
  console.log('   Please create this file with your configuration settings');
}

// Function to check if a command exists
function commandExists(command) {
  try {
    execSync(`where ${command}`, { stdio: 'ignore' });
    return true;
  } catch (e) {
    return false;
  }
}

// Check for Node.js and npm
console.log('\n\x1b[36m=== Checking Dependencies ===\x1b[0m');
if (commandExists('node')) {
  const nodeVersion = execSync('node -v').toString().trim();
  console.log(`✅ Node.js ${nodeVersion} is installed`);
} else {
  console.log('\x1b[31m❌ Node.js not found\x1b[0m');
  console.log('   Please install Node.js from https://nodejs.org/');
}

if (commandExists('npm')) {
  const npmVersion = execSync('npm -v').toString().trim();
  console.log(`✅ npm ${npmVersion} is installed`);
} else {
  console.log('\x1b[31m❌ npm not found\x1b[0m');
  console.log('   npm should be installed with Node.js');
}

// Prompt to install dependencies
console.log('\n\x1b[36m=== Project Setup ===\x1b[0m');
rl.question('Would you like to install project dependencies now? (y/n): ', (answer) => {
  if (answer.toLowerCase() === 'y') {
    console.log('\nInstalling dependencies...');
    try {
      execSync('npm install', { stdio: 'inherit' });
      console.log('\n✅ Dependencies installed successfully');
      
      // Prompt to start the development server
      rl.question('\nWould you like to start the development server now? (y/n): ', (answer) => {
        if (answer.toLowerCase() === 'y') {
          console.log('\nStarting development server...');
          console.log('Press Ctrl+C to stop the server when finished');
          execSync('npm run dev', { stdio: 'inherit' });
        } else {
          showNextSteps();
          rl.close();
        }
      });
    } catch (error) {
      console.error('\n\x1b[31m❌ Error installing dependencies\x1b[0m');
      console.error(error.message);
      showNextSteps();
      rl.close();
    }
  } else {
    showNextSteps();
    rl.close();
  }
});

function showNextSteps() {
  console.log('\n\x1b[36m=== Next Steps ===\x1b[0m');
  console.log('1. Update .env.local with your MongoDB connection string');
  console.log('2. Install dependencies with: npm install');
  console.log('3. Run the development server with: npm run dev');
  console.log('4. Access the website at: http://localhost:3000');
  console.log('5. Run the RSS fetcher with: node scripts/fetch-news.js');
  console.log('\nThank you for using Racing Roundup!');
}
