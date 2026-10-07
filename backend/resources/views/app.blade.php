@php
    // Only the CMS-injected scripts are read here. Every other head tag —
    // title, description, canonical, Open Graph, Twitter and JSON-LD — is owned
    // by the Inertia <Head> component (resources/js/Components/SEOHead.tsx) so
    // that each route can render its own metadata, server-side, through
    // @inertiaHead below. Keeping a second copy here would emit duplicate
    // titles/canonicals that fight the per-page values.
    $dcpSettings = \App\Models\SiteSetting::whereIn('key', [
        'custom_head_scripts',
        'custom_body_scripts',
    ])->pluck('value', 'key');

    $dcpHeadScripts = $dcpSettings['custom_head_scripts'] ?? '';
    $dcpBodyScripts = $dcpSettings['custom_body_scripts'] ?? '';
@endphp
<!DOCTYPE html>
<html lang="{{ str_replace('_', '-', app()->getLocale()) }}" class="scroll-smooth overflow-x-hidden w-full max-w-full">
    <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1">

        <link rel="icon" type="image/svg+xml" href="/favicon.svg">
        <link rel="icon" type="image/x-icon" href="/favicon.ico">
        <link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png">

        {{-- Fallback title for the very first paint; the Inertia <Head> on each
             page replaces it (and SSR renders the real one into @inertiaHead). --}}
        <title inertia>{{ config('app.name', 'DevCenterPoint') }}</title>

        <!-- Geo / Local Intent (GEO) -->
        <meta name="geo.region" content="BD-13">
        <meta name="geo.placename" content="Dhaka, Global">
        <meta name="geo.position" content="23.8103;90.4125">
        <meta name="ICBM" content="23.8103, 90.4125">

        <meta name="theme-color" content="#f8fafc" media="(prefers-color-scheme: light)">
        <meta name="theme-color" content="#070b14" media="(prefers-color-scheme: dark)">

        <!-- Instant Pre-Hydration Theme Script (Light Mode Default) — prevents theme flash -->
        <script>
            (function () {
                try {
                    var saved = localStorage.getItem('dcp_theme');
                    var isDark = saved === 'dark';
                    if (isDark) {
                        document.documentElement.classList.add('dark');
                        document.documentElement.classList.remove('light');
                    } else {
                        document.documentElement.classList.remove('dark');
                        document.documentElement.classList.add('light');
                    }
                } catch (e) {}
            })();
        </script>

        <!-- Fonts -->
        <link rel="preconnect" href="https://fonts.googleapis.com">
        <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
        <link href="https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@400;500;600&family=Plus+Jakarta+Sans:wght@300;400;500;600;700;800&display=swap" rel="stylesheet">

        <!-- Custom Head Scripts (CMS) -->
        {!! $dcpHeadScripts !!}

        <!-- Scripts -->
        @routes
        @viteReactRefresh
        {{-- Only the entry is referenced: pages are resolved at runtime by
             app.tsx via import.meta.glob, so a per-page manifest lookup is both
             redundant and fragile (a page whose chunk is hoisted into a shared
             chunk disappears from the manifest and makes @vite abort with a 500). --}}
        @vite(['resources/js/app.tsx'])
        @inertiaHead
    </head>
    <body class="bg-slate-50 text-slate-900 dark:bg-[#0a0a0a] dark:text-white antialiased selection:bg-blue-600 selection:text-white font-sans overflow-x-hidden w-full max-w-full min-h-screen">
        @inertia

        <!-- Custom Body Scripts (CMS) -->
        {!! $dcpBodyScripts !!}
    </body>
</html>
