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

### 🔎 Search

**GET** `/api/search?query={query}&type={type}`

Search for Star Wars characters or movies.

**Parameters:**
- `query` (required): Search term (e.g., "skywalker", "hope")
- `type` (optional): "people" or "movies" (defaults to "people")

**Examples:**
```bash
GET /api/search?query=skywalker&type=people
GET /api/search?query=hope&type=movies
GET /api/search?query=vader
```

**Response:**
```json
{
  "message": "Search completed",
  "result": [
    {
      "uid": "1",
      "name": "Luke Skywalker",
      "url": "https://swapi.tech/api/people/1"
    }
  ],
  "total_records": 1
}
```

---

### 👤 Get Person Details

**GET** `/api/people/{uid}`

Get detailed information about a specific character and their associated films.

**Parameters:**
- `uid` (required): Character ID from SWAPI

**Example:**
```bash
GET /api/people/1
```

**Response:**
```json
{
  "message": "Person details retrieved successfully",
  "result": {
    "uid": "1",
    "properties": {
      "name": "Luke Skywalker",
      "birth_year": "19BBY",
      "gender": "male",
      "height": "172",
      "mass": "77",
      "eye_color": "blue",
      "hair_color": "blond"
    }
  },
  "films": [
    {
      "uid": "1",
      "name": "A New Hope"
    }
  ]
}
```

---

### 🎬 Get Movie Details

**GET** `/api/movies/{uid}`

Get detailed information about a specific movie and its characters.

**Parameters:**
- `uid` (required): Movie ID from SWAPI

**Example:**
```bash
GET /api/movies/1
```

**Response:**
```json
{
  "message": "Movie details retrieved successfully",
  "result": {
    "uid": "1",
    "properties": {
      "title": "A New Hope",
      "episode_id": 4,
      "opening_crawl": "It is a period of civil war...",
      "director": "George Lucas",
      "release_date": "1977-05-25"
    }
  },
  "characters": [
    {
      "uid": "1",
      "name": "Luke Skywalker"
    }
  ]
}
```

---

### 📊 Get Statistics

**GET** `/api/stats`

Returns cached search statistics (updated every 5 minutes).

**Example:**
```bash
GET /api/stats
```

**Response:**
```json
{
  "top_queries": {
    "hope": {
      "count": 8,
      "percentage": 21.05
    },
    "skywalker": {
      "count": 4,
      "percentage": 10.53
    }
  },
  "average_duration_ms": 615.23,
  "most_popular_hour": 16
}
```

**Statistics Include:**
- Top 5 most searched queries with percentages
- Average search duration in milliseconds
- Most popular hour for searches (0-23)

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

## ✅ Notes

- Stats are cached using the database driver. Run `php artisan cache:table && php artisan migrate` if needed.
- All searches are stored in the `search_logs` table.
- Scheduler job recomputes stats every 5 minutes; can also be run manually.
- Docker exposes the app on port **8000**.

---

## 📄 License

MIT – see LICENSE file for details.
