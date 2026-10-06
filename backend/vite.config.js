import { defineConfig } from 'vite';
import laravel from 'laravel-vite-plugin';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';
import path from 'path';

export default defineConfig({
    plugins: [
        laravel({
            input: 'resources/js/app.tsx',
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
    build: {
        rollupOptions: {
            output: {
                manualChunks: {
                    'vendor-react': ['react', 'react-dom', 'react-helmet-async', '@inertiajs/react'],
                    'vendor-motion': ['framer-motion', 'motion'],
                    'vendor-charts': ['recharts'],
                    'vendor-ui': ['lucide-react', '@headlessui/react', 'clsx', 'tailwind-merge'],
                },
            },
        },
    },
});
