# Reload - Reloading Data Management

A mobile-friendly web application for managing ammunition reloading data. Track your reloading recipes, import data from public sources, and search your database with ease.

## Features

- **Add/Edit/Delete** your own reloading data
- **Search and Filter** by caliber, bullet weight, powder type, and more
- **Import Data** from CSV, JSON, or public sources like Norma
- **Mobile-Optimized** UI with responsive design
- **No Authentication** - simple, fast access to your data

## Tech Stack

- Frontend: React + Vite + Tailwind CSS
- Backend: Node.js + Express
- Database: SQLite
- State Management: React Query (TanStack Query)

## Getting Started

### Prerequisites

- Node.js 18+ and npm

### Installation

1. Clone the repository:
```bash
git clone https://github.com/kredor/Reload.git
cd Reload
```

2. Install dependencies:
```bash
npm run install:all
```

### Development

Run both frontend and backend in development mode:
```bash
npm run dev
```

Or run them separately:
```bash
# Backend (http://localhost:3000)
npm run dev:server

# Frontend (http://localhost:5173)
npm run dev:client
```

### Production

Build and run for production:
```bash
npm run build
npm start
```

## Project Structure

```
Reload/
├── client/          # React frontend
├── server/          # Node.js backend
├── package.json     # Root package with scripts
└── README.md
```

## License

MIT
