import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  build: {
    rollupOptions: {
      output: {
        entryFileNames: `assets/wizard.js`,
        chunkFileNames: `assets/wizard-chunk.js`,
        assetFileNames: (assetInfo) => {
          if (assetInfo.name && assetInfo.name.endsWith('.css')) {
            return 'assets/wizard.[ext]';
          }
          return 'assets/[name]-[hash].[ext]';
        }
      }
    }
  }
});
