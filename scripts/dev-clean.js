const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

console.log('🧹 Cleaning development cache...');

// Remove Next.js cache directories
const cacheDirs = [
  '.next',
  'node_modules/.cache',
  '.swc',
];

cacheDirs.forEach(dir => {
  if (fs.existsSync(dir)) {
    console.log(`Removing ${dir}...`);
    try {
      fs.rmSync(dir, { recursive: true, force: true });
    } catch (error) {
      console.log(`Could not remove ${dir}:`, error.message);
    }
  }
});

// Clear npm cache
console.log('Clearing npm cache...');
try {
  execSync('npm cache clean --force', { stdio: 'inherit' });
} catch (error) {
  console.log('Could not clear npm cache:', error.message);
}

// Reinstall dependencies if needed
console.log('Reinstalling dependencies...');
try {
  execSync('npm install', { stdio: 'inherit' });
} catch (error) {
  console.log('Could not reinstall dependencies:', error.message);
}

console.log('✅ Cache cleaned! Starting development server...');

// Start development server
try {
  execSync('npm run dev', { stdio: 'inherit' });
} catch (error) {
  console.log('Could not start development server:', error.message);
} 