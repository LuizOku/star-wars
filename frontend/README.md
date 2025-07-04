# 🌌 Star Wars Search Frontend

Next.js frontend application for searching Star Wars characters and movies using the Star Wars API.

---

## ✨ Features

✅ **Character Search** – Search for Star Wars characters with real-time results  
✅ **Movie Search** – Search for Star Wars films  
✅ **Character Details** – View detailed character information and associated films  
✅ **Movie Details** – View movie details with opening crawl and character lists  
✅ **Responsive Design** – Works on desktop and mobile devices  
✅ **Modern UI** – Built with Tailwind CSS v4 and custom design system  
✅ **TypeScript** – Full type safety throughout the application  

---

## 🚀 Getting Started

### Prerequisites

- Node.js 18+ 
- npm or yarn
- Backend API running on `http://localhost:8000`

### Development Setup

1️⃣ **Install dependencies:**
```bash
npm install
# or
yarn install
```

2️⃣ **Start the development server:**
```bash
npm run dev
# or
yarn dev
```

3️⃣ **Open your browser:**
Navigate to [http://localhost:3000](http://localhost:3000)

### Production Build

```bash
npm run build
npm start
```

### Docker Setup

```bash
docker build -t star-wars-frontend .
docker run -p 3000:3000 star-wars-frontend
```

---

## 🎯 Application Features

### 🔎 Search Interface
- **Dual search types**: Switch between People and Movies
- **Real-time search**: Results update as you type
- **Dynamic placeholders**: Context-aware search hints
- **Results display**: Clean list with "SEE DETAILS" buttons

### 👤 Character Details
- **Personal information**: Birth year, gender, physical attributes
- **Associated films**: Clickable links to movie details
- **Two-column layout**: Details on left, movies on right
- **Navigation**: Easy return to search

### 🎬 Movie Details  
- **Opening crawl**: Full Star Wars opening text
- **Character list**: All characters with clickable links
- **Movie metadata**: Director, release date, episode info
- **Dynamic data**: Characters fetched in real-time from SWAPI

---

## 🔧 Technologies Used

- **Framework**: Next.js 15 with App Router
- **Language**: TypeScript
- **Styling**: Tailwind CSS v4 with @theme configuration
- **HTTP Client**: Fetch API with custom service layer
- **Fonts**: Montserrat via Next.js font optimization
- **Container**: Docker with multi-stage builds

---

## 🌐 API Integration

The frontend connects to the Star Wars API backend:

- **Search**: `GET /api/search?query={query}&type={type}`
- **Character Details**: `GET /api/people/{uid}`  
- **Movie Details**: `GET /api/movies/{uid}`

**Base URL**: `http://localhost:8000`

---

## 📱 Responsive Design

- **Mobile-first**: Optimized for mobile devices
- **Grid layouts**: Responsive columns that stack on mobile
- **Touch-friendly**: Proper button sizes and spacing
- **Typography**: Scales appropriately across devices

---

## 🚢 Deployment

### Docker
```bash
docker build -t star-wars-frontend .
docker run -p 3000:3000 -e NEXT_PUBLIC_API_URL=https://your-api.com star-wars-frontend
```

### Environment Variables
```bash
NEXT_PUBLIC_API_URL=http://localhost:8000  # Backend API URL
```

---

## 📄 License

MIT – see LICENSE file for details.
