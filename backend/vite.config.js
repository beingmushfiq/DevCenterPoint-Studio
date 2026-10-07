import { defineConfig } from 'vite';
import laravel from 'laravel-vite-plugin';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';
import path from 'path';

export default defineConfig(({ isSsrBuild }) => ({
    plugins: [
        laravel({
            input: 'resources/js/app.tsx',
            // `vite build --ssr` compiles this entry into bootstrap/ssr/ssr.mjs,
            // which the Node SSR server that Inertia talks to loads at runtime.
            ssr: 'resources/js/ssr.tsx',
            refresh: true,
        }),
        react(),
        tailwindcss(),
    ],
    resolve: {
        alias: {
            '@': path.resolve(__dirname, 'resources/js'),
        },
    },
    // cPanel shared hosting cannot carry a production node_modules tree, so the
    // SSR bundle is compiled self-contained: every dependency is inlined into
    // bootstrap/ssr/ssr.mjs and Node built-ins stay external.
    ssr: {
        noExternal: true,
    },
    // manualChunks only makes sense for the browser bundle. The SSR build is
    // emitted as ONE self-contained .mjs file instead of hashed chunks: the
    // server carries no package.json, so a ".js" chunk would be parsed as
    // CommonJS and crash on its first ESM import.
    build: isSsrBuild
        ? {
              cssCodeSplit: false,
              rollupOptions: {
                  output: {
                      inlineDynamicImports: true,
                      entryFileNames: 'ssr.mjs',
                  },
              },
          }
        : {
              rollupOptions: {
                  output: {
                      manualChunks: {
                          'vendor-react': ['react', 'react-dom', '@inertiajs/react'],
                          'vendor-motion': ['framer-motion', 'motion'],
                          'vendor-charts': ['recharts'],
                          'vendor-ui': ['lucide-react', '@headlessui/react', 'clsx', 'tailwind-merge'],
                      },
                  },
              },
          },
}));
