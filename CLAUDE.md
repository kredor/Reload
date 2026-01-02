# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Reload is a mobile-friendly web application for managing ammunition reloading data. Users can:
- Add, edit, and delete their own reloading recipes
- Search and filter loads by caliber, bullet weight, powder type, etc.
- Import data from CSV, JSON, or public sources like Norma
- Access the app from mobile devices with a responsive, touch-friendly UI

## Tech Stack

- **Frontend**: React 18 + Vite + Tailwind CSS
- **Backend**: Node.js + Express
- **Database**: SQLite (better-sqlite3)
- **State Management**: React Query (TanStack Query)
- **Forms**: react-hook-form
- **No Authentication**: Single-user or shared database

## Architecture

### Project Structure

```
Reload/
├── client/                    # React frontend (port 5173)
│   ├── src/
│   │   ├── components/
│   │   │   ├── layout/        # Header, Navigation, Container
│   │   │   ├── reloading/     # LoadList, LoadCard, LoadForm, SearchFilter
│   │   │   └── common/        # Shared components (future)
│   │   ├── pages/             # BrowsePage, AddLoadPage, ImportPage
│   │   ├── hooks/             # useLoads (React Query hooks)
│   │   ├── services/          # api.js (axios client)
│   │   └── styles/            # Tailwind CSS
│   └── vite.config.js         # Proxy /api to backend
├── server/                    # Node.js backend (port 3000)
│   ├── src/
│   │   ├── config/            # database.js, migrate.js
│   │   ├── models/            # Load.js (SQLite queries)
│   │   ├── routes/            # loads.js (API routes)
│   │   ├── controllers/       # loadsController.js
│   │   └── server.js          # Express app entry
│   └── database/
│       ├── migrations/        # SQL schema
│       ├── seeds/             # Sample data
│       └── reloading.db       # SQLite database (gitignored)
└── package.json               # Root scripts for concurrency
```

### Data Model

Single main table `loads` with these key fields:

**Weapon**: test_weapon, caliber (required)
**Bullet**: bullet_manufacturer, bullet_type, bullet_weight_grains
**Powder**: powder_manufacturer, powder_type, charge_weight_grains
**Primer**: primer_manufacturer, primer_type
**Cartridge**: case_manufacturer, total_cartridge_length_mm, free_travel_mm
**Performance**: velocity_ms, group_size_mm, distance_meters, notes
**Metadata**: source (user/imported), created_at, updated_at, search_text

### API Endpoints

```
GET    /api/loads              # List all (with filters, pagination, search)
GET    /api/loads/:id          # Get single load
POST   /api/loads              # Create new load
PUT    /api/loads/:id          # Update load
DELETE /api/loads/:id          # Delete load
GET    /api/loads/filters      # Get filter options (calibers, powders, etc.)
```

### Frontend Architecture

- **React Router** for navigation (/, /add, /edit/:id, /import)
- **React Query** for server state management and caching
- **Tailwind CSS** with mobile-first responsive design
- **Bottom navigation** on mobile, top navigation on desktop
- **Card-based layout** for touch-friendly interaction

### Search & Filter

- Full-text search using SQLite `search_text` field (auto-updated by triggers)
- Faceted filters: caliber, bullet weight range, powder type, source
- Debounced search (300ms) to reduce API calls
- URL query params for shareable filter states (future enhancement)

## Common Development Commands

```bash
# Install all dependencies (root, client, server)
npm run install:all

# Development - Run both frontend and backend concurrently
npm run dev

# Or run separately:
npm run dev:client    # Frontend on http://localhost:5173
npm run dev:server    # Backend on http://localhost:3000

# Database operations
cd server
npm run migrate       # Run migrations and seed data

# Production build
npm run build         # Build frontend for production
npm start             # Start production server

# Backend API health check
curl http://localhost:3000/api/health
```

## Development Workflow

### Adding a New Load Field

1. **Update database schema** in `server/database/migrations/001_initial_schema.sql`
2. **Add to search trigger** if field should be searchable
3. **Update Load model** in `server/src/models/Load.js` (getAll, create, update)
4. **Update LoadForm** in `client/src/components/reloading/LoadForm.jsx`
5. **Update LoadCard** in `client/src/components/reloading/LoadCard.jsx` (display)
6. Run migration: `cd server && npm run migrate`

### Adding a New Filter

1. **Update backend**: Add filter logic in `Load.getAll()` method
2. **Update frontend**: Add filter UI in `SearchFilter.jsx`
3. **Add to filter options**: Update `Load.getFilterOptions()` if needed

### Mobile Optimization Notes

- Minimum touch target size: 44px (iOS/Android guidelines)
- Bottom navigation fixed on mobile, top on desktop
- Collapsible filters to save screen space
- Large, readable fonts (16px base)
- Test on actual mobile devices for touch interactions

## Important Implementation Details

### Database

- **better-sqlite3** v11.8.1+ required for Node.js v24+ compatibility
- **WAL mode** enabled for better concurrent access
- **Triggers** automatically maintain `search_text` and `updated_at` fields
- **Indexes** on commonly filtered fields (caliber, bullet_weight, powder_type, search_text)

### Frontend Data Flow

1. User interacts with UI (search, filter, CRUD)
2. React Query hook calls API service
3. Axios client sends request to `/api/*`
4. Vite dev proxy forwards to `localhost:3000`
5. Express routes to controller → model → SQLite
6. Response cached by React Query
7. UI automatically updates on cache invalidation

### React Query Cache Invalidation

- After **create**, **update**, or **delete**: invalidate `['loads']` queries
- Filter options cached for 5 minutes
- Individual loads cached with `['load', id]` key

## Testing the Application

1. **Start both servers**: `npm run dev`
2. **Open browser**: http://localhost:5173
3. **Verify sample data loads** (3 pre-seeded loads)
4. **Test CRUD operations**:
   - Browse loads with filters
   - Add new load via "Add Load" tab
   - Edit existing load
   - Delete load (with confirmation)
5. **Test search**: Type in search bar (debounced)
6. **Test mobile**: Open DevTools, toggle device toolbar, test bottom nav

## Future Enhancements

### Phase 1 Additions (Current baseline completed)
- CSV/JSON import functionality
- Norma database import
- Pagination for large datasets
- Sort options (by date, caliber, velocity, etc.)

### Phase 2 (Future)
- PWA features (offline support, installable)
- Export functionality (CSV, PDF reports)
- Advanced charts/visualizations (velocity vs charge weight)
- User preferences/settings
- Multi-user support with authentication
- Cloud database (PostgreSQL) for multi-device sync

## Troubleshooting

### Database issues
- **Reset database**: Delete `server/database/reloading.db` and run `npm run migrate`
- **Check schema**: Use SQLite browser or run `sqlite3 server/database/reloading.db ".schema"`

### Frontend not loading
- **Check Vite proxy**: Ensure backend is running on port 3000
- **Clear React Query cache**: Hard refresh (Ctrl+Shift+R)
- **Check console**: Look for API errors or CORS issues

### Build errors
- **better-sqlite3 compilation**: Requires C++ build tools on Windows
- **Node version**: Requires Node.js 18+ (tested with v24)

## Code Style Notes

- **No authentication**: Keep it simple, no user management
- **Mobile-first**: Write styles for mobile, then add desktop breakpoints
- **Component size**: Keep components focused and under 200 lines
- **API errors**: Always return appropriate HTTP status codes (200, 201, 400, 404, 500)
- **Validation**: Only caliber is required, all other fields optional
- **Units**: Weights in grains, lengths in mm, velocity in m/s, distance in m
