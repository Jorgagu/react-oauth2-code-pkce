import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],

  // Ensure all assets are included
  assetsInclude: ['**/*.svg', '**/*.png', '**/*.jpg', '**/*.jpeg', '**/*.gif'],

  // Base path for deployment (change if deploying to subdirectory)
  base: './',

  // Build configuration for static deployment
  build: {
    // Output directory for static files
    outDir: 'dist',

    // Generate static assets with predictable names
    rollupOptions: {
      output: {
        // Organize assets in folders
        assetFileNames: 'assets/[name]-[hash][extname]',
        chunkFileNames: 'assets/[name]-[hash].js',
        entryFileNames: 'assets/[name]-[hash].js',
      },
    },

    // Minify for production
    minify: true,

    // Generate source maps for debugging (optional)
    sourcemap: false,
  },

  // Development server configuration
  server: {
    // Port for development
    port: 5173,

    // Enable CORS for development
    cors: true,
  },

  // Preview server configuration (for testing built app)
  preview: {
    port: 4173,
  },

  // Ensure client-only rendering
  ssr: {
    // Disable SSR completely
    noExternal: [],
  },

  // Define environment variables available to client
  define: {
    // Ensure we're in client-only mode
    'process.env.NODE_ENV': JSON.stringify(process.env.NODE_ENV || 'development'),
    // Add any other client-side env vars
    __CLIENT_ONLY__: true,
  },
})
