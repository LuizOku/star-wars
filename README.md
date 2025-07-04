# 🌌 Star Wars Search Application

A full-stack web application for searching and exploring Star Wars characters and movies, built with Laravel (backend) and Next.js (frontend).

<p align="center">
  <img src="https://img.shields.io/badge/Laravel-FF2D20?style=for-the-badge&logo=laravel&logoColor=white" alt="Laravel" />
  <img src="https://img.shields.io/badge/Next.js-000000?style=for-the-badge&logo=nextdotjs&logoColor=white" alt="Next.js" />
  <img src="https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white" alt="TypeScript" />
  <img src="https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white" alt="Tailwind CSS" />
  <img src="https://img.shields.io/badge/Docker-2496ED?style=for-the-badge&logo=docker&logoColor=white" alt="Docker" />
</p>

---

## ✨ Features

### 🔎 **Search & Discovery**
- **Dual Search Types**: Search for both characters and movies
- **Real-time Results**: Instant search as you type
- **SWAPI Integration**: Direct connection to the Star Wars API
- **Smart Filtering**: Context-aware search with dynamic placeholders

### 👤 **Character Exploration**
- **Detailed Profiles**: Birth year, gender, physical attributes
- **Film Connections**: See which movies each character appears in
- **Dynamic Data**: All character-film relationships fetched in real-time
- **Easy Navigation**: Seamless browsing between characters and movies

### 🎬 **Movie Deep Dives**
- **Opening Crawls**: Full Star Wars opening texts
- **Character Lists**: All characters with direct links to their profiles
- **Movie Metadata**: Directors, release dates, episode information
- **Parallel Processing**: Fast character data fetching using async requests

### 📊 **Analytics & Insights**
- **Search Statistics**: Track popular queries and usage patterns
- **Performance Metrics**: Monitor search duration and response times
- **Usage Analytics**: Most popular search hours and trends
- **Cached Results**: Optimized statistics updated every 5 minutes

### 🎨 **Modern UI/UX**
- **Responsive Design**: Perfect on desktop, tablet, and mobile
- **Skeleton Loading**: Smooth loading states for better experience
- **Custom Design System**: Consistent colors, typography, and components
- **Accessibility**: Keyboard navigation and screen reader support

---

## 🏗️ Architecture

```
┌─────────────────┐    HTTP/JSON    ┌─────────────────┐    HTTPS/JSON    ┌─────────────────┐
│                 │ ──────────────► │                 │ ──────────────► │                 │
│  Next.js        │                 │  Laravel API    │                 │  SWAPI.tech     │
│  Frontend       │ ◄────────────── │  Backend        │ ◄────────────── │  (Star Wars)    │
│  (Docker)       │                 │  (Docker)       │                 │                 │
└─────────────────┘                 └─────────────────┘                 └─────────────────┘
│                                   │
│ • TypeScript                      │ • PHP 8.2+
│ • Tailwind CSS v4                 │ • Laravel 12
│ • App Router                      │ • MySQL Database
│ • Node.js Alpine                  │ • Nginx + PHP-FPM
│ • Multi-stage Build               │ • Composer & Artisan
│                                   │ • Statistics Engine
│                                   │
└── Port 3000                       └── Port 8000
```

---

## 🚀 Quick Start

### Prerequisites

- **Docker & Docker Compose** (required)
- **Node.js 18+** and **PHP 8.2+** (only for local development)

### Docker Setup (Recommended)

1️⃣ **Clone the repository:**
```bash
git clone <repository-url>
cd star-wars
```

2️⃣ **Start the entire stack:**
```bash
docker-compose up -d --build
```

3️⃣ **Setup Laravel:**
```bash
docker-compose exec app composer install
docker-compose exec app php artisan key:generate
docker-compose exec app php artisan migrate
docker-compose exec app php artisan cache:table
docker-compose exec app php artisan migrate
```

4️⃣ **Initialize statistics (optional):**
```bash
docker-compose exec app php artisan stats:compute
```

**That's it!** 🎉 The full stack is now running:
- **Frontend**: [http://localhost:3000](http://localhost:3000) (Next.js container)
- **Backend API**: [http://localhost:8000](http://localhost:8000) (Laravel container)  
- **MySQL Database**: Running internally on the Docker network

**Services Included:**
- `app` - Laravel backend with Nginx  
- `frontend` - Next.js frontend application
- `db` - MySQL 8.0 database
- `app-network` - Internal Docker network for service communication

### Alternative: Local Development

**Backend Setup:**
```bash
cd backend
composer install
cp .env.example .env
# Configure database in .env
php artisan key:generate
php artisan migrate
php artisan serve --port=8000
```

**Frontend Setup:**
```bash
cd frontend
npm install
npm run dev
```

### 🌐 Access the Application

- **Frontend**: [http://localhost:3000](http://localhost:3000)
- **Backend API**: [http://localhost:8000](http://localhost:8000)
- **API Documentation**: See individual README files

---

## 📊 API Endpoints

### Search & Discovery
```bash
GET /api/search?query=skywalker&type=people
GET /api/search?query=hope&type=movies
```

### Character & Movie Details
```bash
GET /api/people/1      # Character details with films
GET /api/movies/1      # Movie details with characters
```

### Analytics
```bash
GET /api/stats         # Cached search statistics
```

---

## 🛠️ Tech Stack

### **Backend (Laravel)**
- **Framework**: Laravel 12 (PHP 8.2+)
- **Database**: MySQL 8+ with migrations
- **Cache**: Database-driven caching system
- **HTTP Client**: Guzzle for SWAPI integration
- **Scheduler**: Laravel's task scheduling
- **Container**: Docker with Nginx

### **Frontend (Next.js)**
- **Framework**: Next.js 15 with App Router
- **Language**: TypeScript for type safety
- **Styling**: Tailwind CSS v4 with custom design system
- **Fonts**: Montserrat via Next.js font optimization
- **HTTP**: Native Fetch API with service layer
- **Container**: Docker with Node.js Alpine (multi-stage build)

### **Development & DevOps**
- **Containerization**: Docker & Docker Compose
- **Version Control**: Git with conventional commits
- **Code Quality**: ESLint, TypeScript strict mode
- **Package Management**: Composer (PHP), npm (Node.js)

---

## 📁 Project Structure

```
star-wars/
├── backend/                    # Laravel API Backend
│   ├── app/
│   │   ├── Http/Controllers/   # API controllers
│   │   ├── Models/            # Eloquent models
│   │   └── Console/Commands/  # Artisan commands
│   ├── database/
│   │   └── migrations/        # Database migrations
│   ├── routes/api.php         # API routes
│   ├── docker-compose.yml     # Backend-only services
│   └── Dockerfile             # Laravel container
│
├── frontend/                   # Next.js Frontend
│   ├── src/
│   │   ├── app/               # App Router pages
│   │   ├── components/        # React components
│   │   ├── services/          # API integration
│   │   └── shared/            # Shared interfaces
│   ├── public/                # Static assets
│   ├── Dockerfile             # Frontend container
│   └── package.json           # Dependencies
│
├── docker-compose.yml          # Full stack setup (frontend + backend + db)
└── README.md                   # This file
```

---

## 🔧 Development Workflow

### Adding New Features

1️⃣ **Backend (Laravel)**:
```bash
cd backend
php artisan make:controller NewController
php artisan make:model NewModel -m
php artisan migrate
```

2️⃣ **Frontend (Next.js)**:
```bash
cd frontend
# Create new components in src/components/
# Add new pages in src/app/
# Update services in src/services/
```

### Running Tests

**Backend:**
```bash
cd backend
php artisan test
```

**Frontend:**
```bash
cd frontend
npm run test
npm run lint
```

### Database Management

```bash
# Fresh migration
docker-compose exec app php artisan migrate:fresh

# Seed data (if implemented)
docker-compose exec app php artisan db:seed

# Check migration status
docker-compose exec app php artisan migrate:status
```

---

## 📈 Performance Features

### **Backend Optimizations**
- **Parallel Requests**: GuzzleHttp async for character fetching
- **Caching Strategy**: Database-driven cache with 1-hour TTL
- **Query Optimization**: Efficient database queries and indexing
- **Scheduled Tasks**: Background statistics computation

### **Frontend Optimizations**
- **Code Splitting**: Automatic with Next.js App Router
- **Font Optimization**: Next.js font optimization
- **Image Optimization**: Next.js automatic image optimization
- **Skeleton Loading**: Instant perceived performance

---

## 🚢 Production Deployment

### Docker Production

**Full Stack Deployment:**
```bash
# Build both services
docker build -t star-wars-api ./backend
docker build -t star-wars-frontend ./frontend

# Run backend
docker run -d --name star-wars-api -p 8000:80 \
  -e APP_ENV=production \
  -e DB_HOST=your-db-host \
  -e DB_DATABASE=star_wars \
  star-wars-api

# Run frontend
docker run -d --name star-wars-frontend -p 3000:3000 \
  -e NEXT_PUBLIC_API_URL=https://your-api-domain.com \
  star-wars-frontend
```

**Or with Docker Compose (using existing setup):**
```bash
# For production, update environment variables and run
docker-compose up -d --build

# Or create a production override file
docker-compose -f docker-compose.yml -f docker-compose.prod.yml up -d --build
```

### Environment Variables

**Backend (.env):**
```env
APP_ENV=production
DB_CONNECTION=mysql
DB_HOST=your-db-host
DB_DATABASE=star_wars
CACHE_STORE=database
```

**Frontend:**
```env
NEXT_PUBLIC_API_URL=https://your-api-domain.com
```

---

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

### Development Guidelines

- **Backend**: Follow PSR-12 coding standards
- **Frontend**: Use TypeScript strict mode
- **Git**: Use conventional commit messages
- **Testing**: Add tests for new features
- **Documentation**: Update README files

---

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

## 🙏 Acknowledgments

- **SWAPI.tech** for providing the Star Wars API
- **Laravel** for the robust backend framework
- **Next.js** for the modern frontend framework
- **Tailwind CSS** for the utility-first styling
- **Docker** for containerization

---

<p align="center">
  <strong>May the Force be with you! 🌟</strong>
</p>
