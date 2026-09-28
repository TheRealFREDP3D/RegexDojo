/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import path from 'path';
import {defineConfig} from 'vite';

export default defineConfig(() => {
  return {
    plugins: [react(), tailwindcss()],
    resolve: {
      alias: {
        '@': path.resolve(__dirname, '.'),
      },
    },
    server: {
      hmr: true,
    },
    publicDir: 'public',
    build: {
      // Optimize chunk splitting for better caching
      rollupOptions: {
        output: {
          manualChunks: {
            // Split vendor dependencies for better caching
            'react-vendor': ['react', 'react-dom'],
            'ui-vendor': ['lucide-react'],
            'effects-vendor': ['canvas-confetti'],
          },
        },
      },
      // Enable source maps for production debugging
      sourcemap: false,
      // Chunk size warning limit (increased from default 500kb)
      chunkSizeWarningLimit: 600,
    },
  };
});