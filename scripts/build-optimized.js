const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

console.log('🚀 Starting optimized build...');

// Set environment variables for faster builds
process.env.GENERATE_SOURCEMAP = 'false';
process.env.SKIP_PREFLIGHT_CHECK = 'true';
process.env.FAST_REFRESH = 'true';
process.env.NODE_ENV = 'production';

// Clean previous build
if (fs.existsSync('build')) {
  console.log('🧹 Cleaning previous build...');
  fs.rmSync('build', { recursive: true, force: true });
}

// Clear cache
if (fs.existsSync('node_modules/.cache')) {
  console.log('🗑️ Clearing cache...');
  fs.rmSync('node_modules/.cache', { recursive: true, force: true });
}

try {
  console.log('📦 Building with optimizations...');
  execSync('react-scripts build', { 
    stdio: 'inherit',
    env: { ...process.env }
  });
  
  console.log('✅ Build completed successfully!');
  console.log('📊 Build size:');
  
  // Show build size
  const buildPath = path.join(__dirname, '../build');
  if (fs.existsSync(buildPath)) {
    const files = fs.readdirSync(buildPath, { recursive: true });
    let totalSize = 0;
    
    files.forEach(file => {
      if (typeof file === 'string' && file.endsWith('.js')) {
        const filePath = path.join(buildPath, file);
        const stats = fs.statSync(filePath);
        totalSize += stats.size;
        console.log(`  ${file}: ${(stats.size / 1024).toFixed(2)} KB`);
      }
    });
    
    console.log(`\n📈 Total JS size: ${(totalSize / 1024 / 1024).toFixed(2)} MB`);
  }
  
} catch (error) {
  console.error('❌ Build failed:', error.message);
  process.exit(1);
} 