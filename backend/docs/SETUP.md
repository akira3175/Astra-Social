# Backend Setup Guide

## Requirements

- PHP >= 8.2
- Composer
- MySQL / MariaDB
- Node.js (optional, for frontend assets)

## Installation

### 1. Clone Repository
```bash
git clone https://github.com/akira3175/Astra-Social.git
cd Astra-Social/backend
```

### 2. Install Dependencies
```bash
composer install
```

### 3. Environment Setup
```bash
cp .env.example .env
php artisan key:generate
```

### 4. Configure Database
Edit `.env` file:
```env
DB_CONNECTION=mysql
DB_HOST=127.0.0.1
DB_PORT=3306
DB_DATABASE=astra_social
DB_USERNAME=root
DB_PASSWORD=your_password
```

### 5. Run Migrations & Seeders
```bash
php artisan migrate --seed
```

### 6. Start Development Server
```bash
php artisan serve
```

Server will run at: `http://localhost:8000`

---

## Default Test Accounts

| Email | Password | Role |
|-------|----------|------|
| dev@example.com | password | Dev |

---

## Common Commands

| Command | Description |
|---------|-------------|
| `php artisan serve` | Start dev server |
| `php artisan migrate` | Run migrations |
| `php artisan migrate:fresh --seed` | Reset DB with seeders |
| `php artisan route:list` | List all routes |
| `php artisan make:controller NameController` | Create controller |
| `php artisan make:model Name -m` | Create model + migration |
| `php artisan make:request NameRequest` | Create form request |

---

## Project Structure

```
backend/
├── app/
│   ├── Http/
│   │   ├── Controllers/     # API Controllers
│   │   ├── Middleware/      # Custom Middleware
│   │   └── Requests/        # Form Validation
│   ├── Models/              # Eloquent Models
│   └── Services/            # Business Logic
├── database/
│   ├── migrations/          # DB Schema
│   └── seeders/             # Test Data
├── routes/
│   └── api/                 # API Routes (modular)
└── docs/                    # Documentation
```

---

## API Base URL

```
http://localhost:8000/api
```

See [API Documentation](./api/README.md) for endpoints.

---

## Troubleshooting

### Port Already in Use
```bash
php artisan serve --port=8080
```

### Clear Cache
```bash
php artisan config:clear
php artisan cache:clear
php artisan route:clear
```

### Permission Issues (Linux/Mac)
```bash
chmod -R 775 storage bootstrap/cache
```
