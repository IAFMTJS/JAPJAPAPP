const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

console.log('🧹 Clearing cache and node_modules...');

// Remove node_modules cache
const cachePaths = [
  'node_modules/.cache',
  'node_modules/.cache/default-development',
  '.cache',
  'build',
  'dist'
];

cachePaths.forEach(cachePath => {
  if (fs.existsSync(cachePath)) {
    console.log(`Removing ${cachePath}...`);
    fs.rmSync(cachePath, { recursive: true, force: true });
  }
});

// Clear npm cache
try {
  console.log('Clearing npm cache...');
  execSync('npm cache clean --force', { stdio: 'inherit' });
} catch (error) {
  console.log('Failed to clear npm cache:', error.message);
}

// Clear yarn cache if yarn is used
try {
  console.log('Clearing yarn cache...');
  execSync('yarn cache clean', { stdio: 'inherit' });
} catch (error) {
  console.log('Yarn not found or failed to clear cache:', error.message);
}

// Reinstall dependencies
console.log('📦 Reinstalling dependencies...');
try {
  execSync('npm install', { stdio: 'inherit' });
} catch (error) {
  console.log('Failed to reinstall dependencies:', error.message);
}

console.log('✅ Cache cleared successfully!');
console.log('🚀 You can now start the development server with: npm start'); 