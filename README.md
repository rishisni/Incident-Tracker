# Incident Tracker

A production-grade full-stack incident management system built with Node.js, Express, JavaScript, Sequelize, MySQL, React, Vite, and Material UI.

## 🏗️ Architecture

### Backend
- **Framework**: Express.js with JavaScript
- **ORM**: Sequelize
- **Database**: MySQL
- **Validation**: Zod
- **Architecture**: Clean Architecture (Controller → Service → Repository)
- **API Documentation**: Swagger/OpenAPI

### Frontend
- **Framework**: React 18 with Vite
- **UI Library**: Material UI (MUI)
- **State Management**: TanStack Query
- **Forms**: React Hook Form + Zod
- **Routing**: React Router

## 📋 Prerequisites

- Node.js 18+ and npm
- MySQL 8.0+
- Git

## 🚀 Quick Start

### 1. Clone the Repository

```bash
git clone <repository-url>
cd ZeoTap
```

### 2. Backend Setup

```bash
cd backend

# Install dependencies
npm install

# Create .env file (copy from .env.example)
cp .env.example .env

# Update .env with your MySQL credentials
# DB_HOST=localhost
# DB_PORT=3306
# DB_NAME=incident_tracker
# DB_USER=root
# DB_PASSWORD=your_password

# Run migrations
npm run migrate

# Seed the database with 200 incidents
npm run seed

# Start development server
npm run dev
```

The backend will run on `http://localhost:200`
API documentation available at `http://localhost:2000/api-docs`

### 3. Frontend Setup

```bash
cd frontend

# Install dependencies
npm install

# Create .env file (optional, defaults to http://localhost:2000)
# VITE_API_BASE_URL=http://localhost:2000

# Start development server
npm run dev
```

The frontend will run on `http://localhost:3000`

## 📁 Project Structure

```
ZeoTap/
├── backend/
│   ├── src/
│   │   ├── database/
│   │   │   ├── config/          # Sequelize config
│   │   │   ├── models/          # Sequelize models
│   │   │   ├── migrations/      # Database migrations
│   │   │   └── seeders/         # Seed scripts
│   │   ├── modules/
│   │   │   └── incidents/
│   │   │       ├── controller/  # HTTP handlers
│   │   │       ├── service/     # Business logic
│   │   │       ├── repository/ # Data access
│   │   │       ├── dto/         # Data transfer objects
│   │   │       ├── validators/  # Zod schemas
│   │   │       ├── mappers/     # Model to DTO mappers
│   │   │       └── routes.ts    # Express routes
│   │   ├── middlewares/         # Express middlewares
│   │   ├── utils/               # Utility functions
│   │   └── server.ts            # Express app entry point
│   ├── package.json
│   └── tsconfig.json
│
└── frontend/
    ├── src/
    │   ├── features/
    │   │   └── incidents/
    │   │       ├── api/         # API client functions
    │   │       ├── components/ # React components
    │   │       ├── pages/      # Page components
    │   │       ├── hooks/       # Custom React hooks
    │   │       └── types/       # TypeScript types
    │   ├── shared/
    │   │   ├── hooks/           # Shared hooks
    │   │   └── utils/           # Shared utilities
    │   ├── App.jsx
    │   └── main.jsx
    ├── package.json
    └── vite.config.js
```

## 🔌 API Endpoints

### Incidents

- `POST /api/incidents` - Create a new incident
- `GET /api/incidents` - List incidents (with pagination, filtering, sorting)
- `GET /api/incidents/:id` - Get incident by ID
- `PATCH /api/incidents/:id` - Update incident

### Query Parameters (GET /api/incidents)

- `page` - Page number (default: 1)
- `limit` - Items per page (default: 10)
- `search` - Search in title, service, or summary
- `severity` - Filter by severity (SEV1, SEV2, SEV3, SEV4)
- `status` - Filter by status (OPEN, MITIGATED, RESOLVED)
- `sortBy` - Sort field (title, service, severity, status, createdAt, updatedAt)
- `order` - Sort order (ASC, DESC)

## 🗄️ Database Schema

### Incidents Table

| Field     | Type         | Description                    |
|-----------|--------------|--------------------------------|
| id        | UUID         | Primary key                    |
| title     | VARCHAR(255) | Incident title                |
| service   | VARCHAR(255) | Affected service              |
| severity  | ENUM         | SEV1, SEV2, SEV3, SEV4        |
| status    | ENUM         | OPEN, MITIGATED, RESOLVED      |
| owner     | VARCHAR(255) | Assigned owner (nullable)     |
| summary   | TEXT         | Incident summary (nullable)   |
| createdAt | DATETIME     | Creation timestamp            |
| updatedAt | DATETIME     | Last update timestamp         |

**Indexes**: severity, status, service, createdAt, title

## 🧪 Features

### Backend
- ✅ Clean Architecture with separation of concerns
- ✅ Repository pattern for data access
- ✅ DTO pattern for data transfer
- ✅ Zod validation on all endpoints
- ✅ Centralized error handling
- ✅ Swagger API documentation
- ✅ Database migrations
- ✅ Seed script with 200 realistic incidents
- ✅ Server-side pagination, filtering, and sorting
- ✅ Proper HTTP status codes

### Frontend
- ✅ Material UI components
- ✅ Server-side pagination with MUI DataGrid
- ✅ Debounced search
- ✅ Column sorting
- ✅ Filtering by status and severity
- ✅ Incident detail page with editable fields
- ✅ Create incident form with validation
- ✅ Loading and error states
- ✅ TanStack Query for data fetching
- ✅ React Hook Form + Zod validation

## 📝 Scripts

### Backend

```bash
npm run dev          # Start development server
npm run build        # Build for production
npm run start        # Start production server
npm run migrate      # Run database migrations
npm run migrate:undo # Rollback last migration
npm run seed         # Seed database with sample data
```

### Frontend

```bash
npm run dev          # Start development server
npm run build        # Build for production
npm run preview      # Preview production build
npm run lint         # Run ESLint
```

## 🔒 Environment Variables

### Backend (.env)

```env
PORT=2000
NODE_ENV=development
DB_HOST=localhost
DB_PORT=3306
DB_NAME=incident_tracker
DB_USER=root
DB_PASSWORD=password
API_BASE_URL=http://localhost:2000
```

### Frontend (.env)

```env
VITE_API_BASE_URL=http://localhost:2000
```

## 🎯 Usage

1. **View Incidents**: Navigate to the home page to see the list of incidents
2. **Search**: Use the search bar to filter incidents by title, service, or summary
3. **Filter**: Use the severity and status dropdowns to filter incidents
4. **Sort**: Click on column headers to sort incidents
5. **View Details**: Click on any incident row to view details
6. **Edit**: Update status, owner, or summary on the detail page
7. **Create**: Click "Create Incident" to add a new incident

## 🛠️ Development

### Best Practices

- Clean Architecture principles
- Repository pattern for data access
- DTO pattern for API responses
- Separation of concerns
- Reusable components and hooks
- Proper loading and error states

## 📚 Documentation

- API documentation available at `/api-docs` when backend is running
- Swagger UI provides interactive API testing

