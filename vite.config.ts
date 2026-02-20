import path from 'path';
import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig(({ mode }) => {
    const env = loadEnv(mode, '.', '');
    return {
      server: {
        port: 3000,
        host: '0.0.0.0',
        proxy: {
          '/sina-api': {
            target: 'http://localhost:3002/api/stock',
            changeOrigin: true,
            rewrite: (path) => {
              const match = path.match(/^\/sina-api\/(.*)$/);
              const query = match ? match[1] : '';
              return `?path=${query}`;
            },
            configure: (proxy) => {
              proxy.on('error', (err) => {
                console.error('Proxy error:', err);
              });
            }
          }
        }
      },
      plugins: [react()],
      define: {
        'process.env.API_KEY': JSON.stringify(env.GEMINI_API_KEY),
        'process.env.GEMINI_API_KEY': JSON.stringify(env.GEMINI_API_KEY)
      },
      resolve: {
        alias: {
          '@': path.resolve(__dirname, '.'),
        }
      }
    };
});
