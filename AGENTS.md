# Project Architecture & Guidelines

## Primary / Default Application
- **Default Frontend & Backend**: The deployed and primary application is the **Laravel + Inertia.js (React)** application located in [`backend/`](file:///d:/DevCenterPoint-Studio/backend).
- **Frontend Source Directory**: [`backend/resources/js/`](file:///d:/DevCenterPoint-Studio/backend/resources/js/) (Pages, Components, Layouts, Context).
- **Backend Directory**: [`backend/`](file:///d:/DevCenterPoint-Studio/backend/) (Laravel 11/12, Artisan, SQLite DB, Controllers, Migrations).

## Development Workflow
- **Backend Server**: Run `php artisan serve --port=8000` inside `backend/`.
- **Frontend Dev / HMR**: Run `npm run dev` inside `backend/` for Vite asset compilation and HMR, or `npm run build` for production bundles.
