const path = require('path');

module.exports = {
  // Enable webpack 5 features
  experiments: {
    topLevelAwait: true,
  },
  
  // Optimize module resolution
  resolve: {
    extensions: ['.tsx', '.ts', '.js', '.jsx'],
    alias: {
      '@': path.resolve(__dirname, 'src'),
    },
  },
  
  // Optimize for production builds
  optimization: {
    splitChunks: {
      chunks: 'all',
      cacheGroups: {
        vendor: {
          test: /[\\/]node_modules[\\/]/,
          name: 'vendors',
          chunks: 'all',
        },
        kanji: {
          test: /[\\/]src[\\/]data[\\/]kanji.*\.ts$/,
          name: 'kanji-data',
          chunks: 'all',
          priority: 10,
        },
      },
    },
  },
  
  // Performance hints
  performance: {
    hints: 'warning',
    maxEntrypointSize: 512000,
    maxAssetSize: 512000,
  },
}; 