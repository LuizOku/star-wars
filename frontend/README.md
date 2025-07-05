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

# 🧪 Frontend Testing Setup

This project includes comprehensive tests for React components using Jest and React Testing Library with a centralized test structure.

## Running Tests

First, install the dependencies:

```bash
npm install
```

Then you can run the tests using:

```bash
# Run all tests
npm test

# Run tests in watch mode
npm run test:watch

# Run tests with coverage
npm run test:coverage
```

## 📁 Test Structure

All tests are organized in the centralized `src/__tests__/` directory:

```
src/__tests__/
├── components/          # Component tests
│   ├── Button.test.tsx
│   ├── Header.test.tsx  
│   ├── Input.test.tsx
│   ├── RadioGroup.test.tsx
│   ├── SearchForm.test.tsx
│   └── ResultsList.test.tsx
└── pages/              # Page tests
    ├── home.test.tsx
    ├── movie-detail.test.tsx
    └── person-detail.test.tsx
```

### 📄 Page Tests
- **home.test.tsx**: Tests for the main search page (13 tests)
  - Component rendering and layout
  - Search functionality (people and movies)
  - Loading states and error handling
  - API integration and response handling
  - Search type switching and validation
  - Empty states and edge cases

- **movie-detail.test.tsx**: Tests for movie detail pages (16 tests)
  - Loading skeleton states
  - Movie data rendering (title, opening crawl)
  - Character links and navigation
  - Error handling and missing data
  - Router parameter handling
  - API integration and refetching

- **person-detail.test.tsx**: Tests for person detail pages (18 tests)
  - Loading skeleton states
  - Person details rendering (all properties)
  - Movie links and navigation
  - Error handling and missing data
  - Router parameter handling
  - API integration and refetching

### 🧩 Component Tests
- **SearchForm.test.tsx**: Search form component (15 tests)
  - Rendering and UI elements
  - User interactions (typing, clicking, radio button selection)
  - Form validation and state management
  - Error handling and loading states
  - Dynamic placeholder text

- **ResultsList.test.tsx**: Results list component (16 tests)
  - Loading states and empty states
  - Results rendering and navigation
  - UI structure and accessibility

- **UI Component Tests**: Button, Input, RadioGroup, Header (58 tests total)
  - User interactions and event handling
  - Form validation and state management
  - Accessibility and keyboard navigation
  - CSS classes and styling
  - Props forwarding and error handling

## 📊 Test Coverage

The Jest configuration includes coverage reporting for all TypeScript files in the `src` directory, excluding type definitions and index files.

## 📈 Test Results

- **✅ 9 test suites**: All passing (100% success rate)
- **✅ 120 tests**: All passing (100% success rate)
- **🎯 Full integration testing**: Real component interactions with mocked dependencies
- **⚡ Fast execution**: Optimized test setup with minimal dependencies

