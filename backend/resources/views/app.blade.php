@php
    $dcpSettings = \App\Models\SiteSetting::whereIn('key', [
        'custom_head_scripts',
        'custom_body_scripts',
        'seo_meta_title',
        'seo_meta_description',
        'seo_meta_keywords',
        'seo_og_image',
        'seo_canonical_url',
        'site_name',
    ])->pluck('value', 'key');

    $dcpHeadScripts = $dcpSettings['custom_head_scripts'] ?? '';
    $dcpBodyScripts = $dcpSettings['custom_body_scripts'] ?? '';

    $dcpBrand = ($dcpSettings['site_name'] ?? null) ?: config('app.name', 'DevCenterPoint Studio');

    $dcpTitle = ($dcpSettings['seo_meta_title'] ?? null) ?: $dcpBrand;

    $dcpDescription = ($dcpSettings['seo_meta_description'] ?? null)
        ?: 'DevCenterPoint designs and engineers mission-critical software products, scalable SaaS platforms, intelligent AI systems, and cloud infrastructure engineered for zero technical debt and real-world impact.';

    $dcpKeywords = ($dcpSettings['seo_meta_keywords'] ?? null) ?: '';

    $dcpSiteUrl = rtrim(($dcpSettings['seo_canonical_url'] ?? null) ?: (config('app.url') ?: url('/')), '/');

    $dcpOgImage = ($dcpSettings['seo_og_image'] ?? null) ?: '/og-image.png';
    if (! preg_match('#^https?://#', $dcpOgImage)) {
        $dcpOgImage = $dcpSiteUrl.'/'.ltrim($dcpOgImage, '/');
    }
@endphp
<!DOCTYPE html>
<html lang="{{ str_replace('_', '-', app()->getLocale()) }}" class="scroll-smooth overflow-x-hidden w-full max-w-full">
    <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1">

        <link rel="icon" type="image/svg+xml" href="/favicon.svg">
        <link rel="icon" type="image/x-icon" href="/favicon.ico">
        <link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png">
        <title inertia>{{ $dcpTitle }}</title>

        <!-- Primary SEO -->
        <meta name="description" content="{{ $dcpDescription }}">
        @if ($dcpKeywords)
        <meta name="keywords" content="{{ $dcpKeywords }}">
        @endif
        <meta name="robots" content="index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1">
        <link rel="canonical" href="{{ $dcpSiteUrl }}/">

        <!-- Geo / Local Intent (GEO) -->
        <meta name="geo.region" content="BD-13">
        <meta name="geo.placename" content="Dhaka, Global">
        <meta name="geo.position" content="23.8103;90.4125">
        <meta name="ICBM" content="23.8103, 90.4125">

        <!-- Open Graph / Facebook / LinkedIn -->
        <meta property="og:type" content="website">
        <meta property="og:site_name" content="{{ $dcpBrand }}">
        <meta property="og:locale" content="en_US">
        <meta property="og:title" content="{{ $dcpTitle }}">
        <meta property="og:description" content="{{ $dcpDescription }}">
        <meta property="og:url" content="{{ $dcpSiteUrl }}/">
        <meta property="og:image" content="{{ $dcpOgImage }}">
        <meta property="og:image:width" content="1200">
        <meta property="og:image:height" content="630">
        <meta property="og:image:alt" content="{{ $dcpBrand }} — Digital Products &amp; Intelligent Systems">

        <!-- Twitter / X -->
        <meta name="twitter:card" content="summary_large_image">
        <meta name="twitter:site" content="@devcenterpoint">
        <meta name="twitter:title" content="{{ $dcpTitle }}">
        <meta name="twitter:description" content="{{ $dcpDescription }}">
        <meta name="twitter:image" content="{{ $dcpOgImage }}">
        <meta name="twitter:image:alt" content="{{ $dcpBrand }} Architecture &amp; Systems">

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
