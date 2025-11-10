import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { resolve } from 'path';
import { copyFileSync, mkdirSync, readdirSync } from 'fs';
import { join } from 'path';

// Recursive copy function
function copyDir(src: string, dest: string): void {
  mkdirSync(dest, { recursive: true });
  const entries = readdirSync(src, { withFileTypes: true });
  
  for (const entry of entries) {
    const srcPath = join(src, entry.name);
    const destPath = join(dest, entry.name);
    
    if (entry.isDirectory()) {
      copyDir(srcPath, destPath);
    } else {
      copyFileSync(srcPath, destPath);
    }
  }
}

// Custom plugin to handle Chrome extension specifics
function chromeExtension() {
  return {
    name: 'chrome-extension',
    writeBundle() {
      // Copy manifest.json to dist
      try {
        copyFileSync('manifest.json', 'dist/manifest.json');
      } catch (err) {
        console.error('Error copying manifest:', err);
      }

      // Copy sidepanel.html to dist root
      try {
        copyFileSync('src/sidepanel/sidepanel.html', 'dist/sidepanel.html');
      } catch (err) {
        console.error('Error copying sidepanel.html:', err);
      }

      // Copy public/icons directly to dist/icons (not dist/public/icons)
      try {
        const iconsPath = resolve(__dirname, 'public/icons');
        const distIconsPath = resolve(__dirname, 'dist/icons');
        
        copyDir(iconsPath, distIconsPath);
      } catch (err) {
        console.error('Error copying icons:', err);
      }
    }
  };
}

export default defineConfig({
  plugins: [react(), chromeExtension()],
  build: {
    outDir: 'dist',
    emptyOutDir: true,
    rollupOptions: {
      input: {
        sidepanel: resolve(__dirname, 'src/sidepanel/index.tsx'),
        background: resolve(__dirname, 'src/background/background.ts'),
        content: resolve(__dirname, 'src/content/content.ts'),
      },
      output: {
        entryFileNames: (chunkInfo) => {
          // Keep background and content scripts in root
          if (chunkInfo.name === 'background' || chunkInfo.name === 'content') {
            return '[name].js';
          }
          // Keep sidepanel.js in root too
          if (chunkInfo.name === 'sidepanel') {
            return '[name].js';
          }
          return 'assets/[name]-[hash].js';
        },
        chunkFileNames: 'assets/[name]-[hash].js',
        assetFileNames: (assetInfo) => {
          // Keep CSS in root for sidepanel
          if (assetInfo.name && assetInfo.name.endsWith('.css')) {
            return '[name][extname]';
          }
          return 'assets/[name]-[hash][extname]';
        },
      },
    },
    // Target for Chrome extension
    target: 'esnext',
    minify: 'esbuild',
    sourcemap: true,
  },
  resolve: {
    alias: {
      '@': resolve(__dirname, 'src'),
    },
  },
});

