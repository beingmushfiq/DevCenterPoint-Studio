import { createInertiaApp } from '@inertiajs/react';
import createServer from '@inertiajs/react/server';
import { resolvePageComponent } from 'laravel-vite-plugin/inertia-helpers';
import { renderToString } from 'react-dom/server';
import { ErrorBoundary } from './Components/ErrorBoundary';

const appName = import.meta.env.VITE_APP_NAME || 'DevCenterPoint';

/**
 * Server-side rendering entry point.
 *
 * The Node SSR server (started from `bootstrap/ssr/ssr.mjs`) answers the
 * `/render` call made by Laravel's Inertia `HttpGateway`, so every page is
 * shipped with a fully populated body and <head>. That is what lets search
 * engines and AI crawlers read the marketing copy, meta tags and JSON-LD
 * without executing JavaScript.
 *
 * Unlike `app.tsx` there is no DOM here, so the default title is read from the
 * page props (`siteSettings.seo_meta_title`) instead of `document`.
 */
createServer((page) => {
    const siteSettings = (page.props as { siteSettings?: Record<string, string> })
        ?.siteSettings;

    return createInertiaApp({
        page,
        render: renderToString,
        title: (title) =>
            title
                ? title.includes(appName)
                    ? title
                    : `${title} - ${appName}`
                : siteSettings?.seo_meta_title || appName,
        resolve: (name) =>
            resolvePageComponent(
                `./Pages/${name}.tsx`,
                import.meta.glob('./Pages/**/*.tsx'),
            ),
        setup: ({ App, props }) => (
            <ErrorBoundary>
                <App {...props} />
            </ErrorBoundary>
        ),
    });
});
