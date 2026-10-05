<!DOCTYPE html>
<html lang="en" class="dark">
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <title>404 — Page Not Found | DevCenterPoint Studio</title>
    <link rel="preconnect" href="https://fonts.bunny.net">
    <link href="https://fonts.bunny.net/css?family=plus-jakarta-sans:400,500,700,800,900&display=swap" rel="stylesheet">
    <style>
        *, *::before, *::after { box-sizing: border-box; }
        html, body { margin: 0; padding: 0; overflow-x: hidden; max-width: 100vw; }
        body {
            min-height: 100vh;
            display: flex;
            align-items: center;
            justify-content: center;
            padding: 24px;
            font-family: 'Plus Jakarta Sans', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
            background-color: #07090e;
            color: #f1f5f9;
            text-align: center;
        }
        .orb {
            position: fixed;
            border-radius: 9999px;
            filter: blur(140px);
            pointer-events: none;
            opacity: 0.5;
        }
        .orb-a { top: 8%; left: 20%; width: 280px; height: 280px; background: rgba(46, 74, 249, 0.28); }
        .orb-b { bottom: 10%; right: 18%; width: 300px; height: 300px; background: rgba(139, 92, 246, 0.24); }
        .card {
            position: relative;
            max-width: 520px;
            width: 100%;
            padding: 48px 32px;
            border-radius: 28px;
            background: rgba(10, 14, 23, 0.74);
            border: 1px solid rgba(255, 255, 255, 0.1);
            box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.6);
        }
        .code {
            font-family: 'JetBrains Mono', ui-monospace, monospace;
            font-size: 12px;
            letter-spacing: 0.28em;
            text-transform: uppercase;
            color: #60a5fa;
            font-weight: 700;
            margin-bottom: 14px;
        }
        h1 { font-size: 30px; font-weight: 900; margin: 0 0 12px; letter-spacing: -0.02em; }
        p { font-size: 14px; line-height: 1.7; color: #94a3b8; margin: 0 0 28px; font-weight: 500; }
        a.home {
            display: inline-flex;
            align-items: center;
            gap: 8px;
            padding: 14px 26px;
            border-radius: 16px;
            background: #2563eb;
            color: #fff;
            font-size: 12px;
            font-weight: 800;
            text-transform: uppercase;
            letter-spacing: 0.08em;
            text-decoration: none;
            transition: background 0.2s ease;
        }
        a.home:hover { background: #1d4ed8; }
        @media (min-width: 640px) { h1 { font-size: 36px; } }
    </style>
</head>
<body>
    <div class="orb orb-a"></div>
    <div class="orb orb-b"></div>
    <div class="card">
        <div class="code">Error 404</div>
        <h1>Page not found</h1>
        <p>The page you are looking for does not exist, was moved, or is temporarily unavailable. Let us get you back on track.</p>
        <a class="home" href="{{ url('/') }}">Return to Homepage</a>
    </div>
</body>
</html>
