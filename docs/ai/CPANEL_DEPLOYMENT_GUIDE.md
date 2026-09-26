# DevCenterPoint Studio — cPanel Deployment Guide

> **Stack:** Laravel 11/12 + Inertia.js v2 + React 19 + Tailwind CSS v4 + MySQL  
> **Target Environment:** cPanel Shared or VPS Hosting (Apache + PHP 8.2/8.3)  
> **Generated Packages:** Located in [`backend/cpanel_dist/`](file:///d:/DevCenterPoint-Studio/backend/cpanel_dist/)

---

## 1. Deployment Architecture Overview

To ensure **absolute security** (preventing `.env`, vendor code, or SQLite databases from being accessed via web browser), the application uses the standard two-tier split directory structure:

```
/home/username/
├── dcp_core/                  # Core Laravel Application (PRIVATE - NOT accessible from web)
│   ├── app/
│   ├── bootstrap/
│   ├── config/
│   ├── database/
│   ├── resources/
│   ├── routes/
│   ├── storage/
│   ├── vendor/
│   ├── .env                   # Database credentials, APP_KEY, Mail setup
│   └── artisan
│
└── public_html/               # Public Web Root (ACCESSIBLE TO BROWSERS)
    ├── build/                 # Compiled Vite React assets (JS, CSS)
    ├── storage -> /home/username/dcp_core/storage/app/public
    ├── index.php              # Bootstrap entrypoint pointing to ../dcp_core
    ├── .htaccess              # Apache rewrite rules & security headers
    └── favicon.ico
```

---

## 2. Pre-Packaged Deployment Archives

The automated packager has already pre-compiled all assets and created two ready-to-upload ZIP archives in:
`d:\DevCenterPoint-Studio\backend\cpanel_dist\`

1. **`dcp_core.zip` (~18 MB):** Contains the complete private Laravel application with all composer dependencies.
2. **`public_html.zip` (~550 KB):** Contains the pre-compiled React 19 + Inertia v2 assets, `index.php`, and `.htaccess`.

*(If you ever make code changes in the future, simply re-run `powershell -File backend/cpanel_deploy/package_cpanel.ps1` to rebuild both archives).*

---

## 3. Step-by-Step cPanel Deployment Instructions

### Step 1: Upload and Extract Files in cPanel File Manager
1. Log into your cPanel account.
2. Open **File Manager**.
3. In your home directory (`/home/username/`):
   - Upload **`dcp_core.zip`**.
   - Right-click and **Extract** into `/home/username/dcp_core`.
   - Delete the uploaded `dcp_core.zip`.
4. Navigate into your **`public_html/`** directory:
   - Upload **`public_html.zip`**.
   - Right-click and **Extract** directly into `/home/username/public_html/`.
   - Delete the uploaded `public_html.zip`.

---

### Step 2: Set PHP Version in cPanel MultiPHP Manager
1. In cPanel, search for **MultiPHP Manager**.
2. Select your domain.
3. Change the PHP version to **PHP 8.2** or **PHP 8.3**.
4. In **Select PHP Version** (or MultiPHP INI Editor), ensure the following PHP extensions are enabled:
   - `pdo_mysql`
   - `mbstring`
   - `fileinfo`
   - `gd`
   - `openssl`
   - `tokenizer`
   - `xml`
   - `curl`

---

### Step 3: Create MySQL Database & User
1. In cPanel, open **MySQL Database Wizard**.
2. **Step 1:** Create database (e.g., `username_dcpstudio`).
3. **Step 2:** Create user (e.g., `username_dcpuser`) with a strong password.
4. **Step 3:** Assign **ALL PRIVILEGES** to this user for the database.
5. In cPanel File Manager, open `/home/username/dcp_core/.env` (enable "Show Hidden Files" in File Manager settings if `.env` is hidden).
6. Update the database lines:
   ```env
   DB_CONNECTION=mysql
   DB_HOST=127.0.0.1
   DB_PORT=3306
   DB_DATABASE=username_dcpstudio
   DB_USERNAME=username_dcpuser
   DB_PASSWORD=your_strong_password
   ```

---

### Step 4: Run Database Migrations & Initial Seed
Run the migrations to create all tables and populate all initial CMS content (capabilities, projects, milestones, FAQs, and admin user).

**Option A (If you have cPanel Terminal / SSH access):**
```bash
cd /home/username/dcp_core
php artisan migrate --force --seed
```

**Option B (If you do NOT have Terminal access on shared hosting):**  
Create a temporary file in `public_html/setup.php`:
```php
<?php
require __DIR__ . '/../dcp_core/vendor/autoload.php';
$app = require_once __DIR__ . '/../dcp_core/bootstrap/app.php';
$kernel = $app->make(Illuminate\Contracts\Console\Kernel::class);

echo "<pre>";
$kernel->call('migrate', ['--force' => true, '--seed' => true]);
echo $kernel->output();
echo "</pre>";
```
Visit `https://yourdomain.com/setup.php` in your browser once, then **immediately delete `setup.php`**.

---

### Step 5: Create Storage Symlink (for Media Uploads)
**Option A (Terminal):**
```bash
cd /home/username/dcp_core
php artisan storage:link
```

**Option B (Browser script fallback):**  
Create a temporary file in `public_html/symlink.php`:
```php
<?php
symlink('/home/username/dcp_core/storage/app/public', '/home/username/public_html/storage');
echo "Symlink created successfully!";
```
Visit `https://yourdomain.com/symlink.php` once, then delete `symlink.php`.

---

### Step 6: Configure cPanel Cron Job
To process queued emails (inquiry notifications, newsletter welcomes) and clean up sessions:
1. In cPanel, open **Cron Jobs**.
2. Under "Add New Cron Job", select **Once Per Minute** (`* * * * *`).
3. Enter the command (adjust `/home/username/` to match your cPanel username):
   ```cron
   * * * * * cd /home/username/dcp_core && /usr/local/bin/php artisan schedule:run >> /dev/null 2>&1
   ```

---

## 4. Default Admin Login Credentials

Once deployed, log into your new React Admin CMS:

- **Login URL:** `https://yourdomain.com/login`
- **Email:** `admin@devcenterpoint.com`
- **Password:** `admin12345`

> **Security Note:** Once logged in, go to `Profile` or run a password update to change your password immediately.
