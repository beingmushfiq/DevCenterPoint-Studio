import '../css/app.css';
import './bootstrap';

import { createInertiaApp } from '@inertiajs/react';
import { resolvePageComponent } from 'laravel-vite-plugin/inertia-helpers';
import { createRoot } from 'react-dom/client';
import { ErrorBoundary } from './Components/ErrorBoundary';

const appName = import.meta.env.VITE_APP_NAME || 'DevCenterPoint';

// The server-rendered <title inertia> already carries the CMS site title. Inertia
// derives its default title from `titleCallback('')`, so mirroring the existing
// title here keeps that element intact instead of replacing it with a bare
// app-name suffix.
const initialDocumentTitle =
    typeof document !== 'undefined'
        ? document.querySelector('title[inertia]')?.textContent?.trim() ?? ''
        : '';

createInertiaApp({
    title: (title) =>
        title
            ? title.includes(appName)
                ? title
                : `${title} - ${appName}`
            : initialDocumentTitle,
    resolve: (name) =>
        resolvePageComponent(
            `./Pages/${name}.tsx`,
            import.meta.glob('./Pages/**/*.tsx'),
        ),
    setup({ el, App, props }) {
        const root = createRoot(el);

        root.render(
            <ErrorBoundary>
                <App {...props} />
            </ErrorBoundary>,
        );
    },
    progress: {
        color: '#4B5563',
    },
});
