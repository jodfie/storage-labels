# Storage Labels - Development Guide

## Getting Started

### Prerequisites

- Docker & Docker Compose
- Node.js 20+ (for local development without Docker)
- PostgreSQL 15+ (for local development without Docker)

### Quick Start with Docker

1. **Start all services:**
   ```bash
   docker-compose -f docker-compose.dev.yml up -d
   ```

2. **Check service health:**
   ```bash
   # Backend API health check
   curl http://localhost:3001/api/health

   # Frontend
   open http://localhost:5173
   ```

3. **View logs:**
   ```bash
   # All services
   docker-compose -f docker-compose.dev.yml logs -f

   # Specific service
   docker-compose -f docker-compose.dev.yml logs -f backend
   ```

4. **Stop services:**
   ```bash
   docker-compose -f docker-compose.dev.yml down
   ```

### Local Development (without Docker)

#### Backend

```bash
cd backend

# Install dependencies
npm install

# Copy environment file
cp .env.example .env

# Start PostgreSQL (via Docker or local install)
# Edit .env with your database credentials

# Run development server
npm run dev
```

Backend runs on http://localhost:3001

#### Frontend

```bash
cd frontend

# Install dependencies
npm install

# Start development server
npm run dev
```

Frontend runs on http://localhost:5173

## Project Structure

```
storage-labels/
├── backend/              # Node.js + Express API
│   ├── src/
│   │   ├── config/      # Database and app configuration
│   │   ├── controllers/ # Request handlers
│   │   ├── middleware/  # Express middleware
│   │   ├── models/      # Data models
│   │   ├── routes/      # API routes
│   │   └── utils/       # Helper functions
│   ├── uploads/         # User-uploaded images
│   └── package.json
├── frontend/            # React + TypeScript PWA
│   ├── src/
│   │   ├── components/  # React components
│   │   ├── pages/       # Page components
│   │   ├── hooks/       # Custom React hooks
│   │   ├── services/    # API client
│   │   └── types/       # TypeScript types
│   └── package.json
├── database/            # Database schema and migrations
│   └── schema.sql
└── docker-compose.dev.yml
```

## API Endpoints

### Containers

- `GET /api/containers` - List all containers
- `GET /api/containers/:qr_code` - Get container by QR code
- `POST /api/containers/generate` - Generate new container
- `PUT /api/containers/:id` - Update container
- `DELETE /api/containers/:id` - Delete container
- `GET /api/containers/:id/items` - List items in container
- `POST /api/containers/:id/items` - Add item to container

### Items

- `PUT /api/items/:id` - Update item
- `DELETE /api/items/:id` - Delete item

### Search

- `GET /api/search?q={query}` - Full-text search

### Health

- `GET /api/health` - Health check

## Database

### Access PostgreSQL

```bash
# Via Docker
docker exec -it storage-labels-db psql -U postgres -d storage_labels

# Local
psql -U postgres -d storage_labels
```

### Reset Database

```bash
# Stop containers
docker-compose -f docker-compose.dev.yml down -v

# Restart (will reinitialize database)
docker-compose -f docker-compose.dev.yml up -d
```

## Development Workflow

1. **Create feature branch from dev:**
   ```bash
   git checkout dev
   git pull origin dev
   git checkout -b feature/your-feature-name
   ```

2. **Make changes and test locally**

3. **Commit with conventional commits:**
   ```bash
   git commit -m "feat: add QR code generation"
   git commit -m "fix: resolve database connection issue"
   ```

4. **Push and create PR to dev branch**

5. **After review, merge to dev**

6. **Deploy to staging/production from master**

## Environment Variables

### Backend (.env)

```env
PORT=3001
NODE_ENV=development
DB_HOST=localhost
DB_PORT=5432
DB_NAME=storage_labels
DB_USER=postgres
DB_PASSWORD=postgres
UPLOAD_DIR=uploads
MAX_FILE_SIZE=10485760
```

### Frontend

Environment variables in Vite must be prefixed with `VITE_`:

```env
VITE_API_URL=http://localhost:3001
```

## Testing

### Backend

```bash
cd backend
npm test
```

### Frontend

```bash
cd frontend
npm test
```

## Building for Production

### Backend

```bash
cd backend
npm run build
npm start
```

### Frontend

```bash
cd frontend
npm run build
npm run preview
```

## Troubleshooting

### Port already in use

```bash
# Find process using port
lsof -i :3001  # Backend
lsof -i :5173  # Frontend

# Kill process
kill -9 <PID>
```

### Database connection issues

1. Check PostgreSQL is running
2. Verify credentials in .env
3. Check Docker network connectivity

### Hot reload not working

1. Ensure volumes are mounted correctly in docker-compose
2. Check file permissions
3. Restart Docker services

## Next Steps

1. Implement container generation logic
2. Add QR code scanning in frontend
3. Build camera integration for photos
4. Implement search functionality
5. Create PWA manifest and service worker
6. Add authentication
7. Set up Cloudflare Tunnel for production
