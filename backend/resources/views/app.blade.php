@php
    $dcpHeadScripts = \App\Models\SiteSetting::where('key', 'custom_head_scripts')->value('value');
    $dcpBodyScripts = \App\Models\SiteSetting::where('key', 'custom_body_scripts')->value('value');
    $dcpSiteUrl = rtrim(config('app.url') ?: url('/'), '/');
@endphp
<!DOCTYPE html>
<html lang="{{ str_replace('_', '-', app()->getLocale()) }}" class="scroll-smooth overflow-x-hidden w-full max-w-full">
    <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1">

        <link rel="icon" type="image/svg+xml" href="/favicon.svg">
        <title inertia>{{ config('app.name', 'DevCenterPoint Studio') }}</title>

        <!-- Primary SEO -->
        <meta name="description" content="DevCenterPoint designs and engineers mission-critical software products, scalable SaaS platforms, intelligent AI systems, and cloud infrastructure engineered for zero technical debt and real-world impact.">
        <meta name="robots" content="index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1">
        <link rel="canonical" href="{{ $dcpSiteUrl }}/">

        <!-- Geo / Local Intent (GEO) -->
        <meta name="geo.region" content="BD-13">
        <meta name="geo.placename" content="Dhaka, Global">
        <meta name="geo.position" content="23.8103;90.4125">
        <meta name="ICBM" content="23.8103, 90.4125">

        <!-- Open Graph / Facebook / LinkedIn -->
        <meta property="og:type" content="website">
        <meta property="og:site_name" content="{{ config('app.name', 'DevCenterPoint') }}">
        <meta property="og:locale" content="en_US">
        <meta property="og:title" content="{{ config('app.name', 'DevCenterPoint') }} — Digital Products, Software &amp; Intelligent Systems">
        <meta property="og:url" content="{{ $dcpSiteUrl }}/">
        <meta property="og:image" content="{{ $dcpSiteUrl }}/og-image.svg">

        <!-- Twitter / X -->
        <meta name="twitter:card" content="summary_large_image">
        <meta name="twitter:site" content="@devcenterpoint">
        <meta name="twitter:title" content="{{ config('app.name', 'DevCenterPoint') }} — Digital Products, Software &amp; Intelligent Systems">
        <meta name="twitter:image" content="{{ $dcpSiteUrl }}/og-image.svg">

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
        @vite(['resources/js/app.tsx', "resources/js/Pages/{$page['component']}.tsx"])
        @inertiaHead
    </head>
    <body class="bg-slate-50 text-slate-900 dark:bg-[#0a0a0a] dark:text-white antialiased selection:bg-blue-600 selection:text-white font-sans overflow-x-hidden w-full max-w-full min-h-screen">
        @inertia

        <!-- Custom Body Scripts (CMS) -->
        {!! $dcpBodyScripts !!}
    </body>
</html>
