<p align="center">
  <img src="https://raw.githubusercontent.com/laravel/art/master/logo-lockup/5%20SVG/2%20CMYK/1%20Full%20Color/laravel-logolockup-cmyk-red.svg" width="300" alt="Laravel Logo">
</p>

# 🌌 Star Wars API Backend

Laravel API for searching Star Wars characters using [SWAPI](https://swapi.tech) and providing search statistics.

---

## ✨ Features

✅ **Search API** – Fetch Star Wars characters via `/api/search`  
✅ **Statistics API** – Get live search stats via `/api/stats`  
✅ **Logs** – All searches saved with query time  
✅ **Scheduler** – Recomputes stats every 5 minutes via Laravel's scheduler  
✅ **Dockerized** – Easy setup with Docker & Docker Compose

---

## 🔗 API Endpoints

### 🔎 Search Characters

GET /api/search?query=skywalker

Returns data from SWAPI filtered by your query.

### 📊 Get Statistics

GET /api/stats

Returns cached stats:
- Top 5 queries (with percentages)
- Average search duration
- Most popular hour for searches

---

## ⚙️ Running Locally with Docker

Make sure you have **Docker** and **Docker Compose** installed. From the project root:

1️⃣ Build and start containers:
docker-compose up -d --build

2️⃣ Install dependencies and set up Laravel inside the app container:
docker-compose exec app composer install
docker-compose exec app php artisan key:generate
docker-compose exec app php artisan migrate
docker-compose exec app php artisan cache:table
docker-compose exec app php artisan migrate

3️⃣ Force run scheduler job (optional, to compute stats immediately):
docker-compose exec app php artisan schedule:run

Your API will be available at http://localhost:8000.

---

## 🗂️ Project Structure Highlights

backend/
├── app/
│   ├── Http/Controllers/        # API controllers (Search, Stats)
│   ├── Models/SearchLog.php     # Model for search logs
│   └── Console/Kernel.php       # Scheduler with stats recomputation
├── routes/api.php               # API routes
├── database/migrations/         # DB migrations (logs, cache table)
├── Dockerfile                   # App Dockerfile
├── docker-compose.yml           # App + MySQL services
└── .env.example                 # Environment template

---

## ✅ Notes

- Stats are cached using the database driver. Run `php artisan cache:table && php artisan migrate` if needed.
- All searches are stored in the `search_logs` table.
- Scheduler job recomputes stats every 5 minutes; can also be run manually.
- Docker exposes the app on port **8000**.

---

## 📄 License

MIT – see LICENSE file for details.
