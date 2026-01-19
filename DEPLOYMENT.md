# Storage Labels Deployment Guide

## ✅ What's Already Done

### Docker Setup (Task 3.1) - COMPLETE!
- ✅ Production Dockerfiles for frontend and backend
- ✅ Multi-stage builds (frontend: 62.6MB, backend: 141MB)
- ✅ Nginx reverse proxy for API requests
- ✅ PostgreSQL database with health checks
- ✅ Docker Compose configuration
- ✅ All containers running and healthy
- ✅ App accessible at http://localhost:3000

### Docker Containers Running:
```
storage-labels-frontend → http://localhost:3000
storage-labels-backend  → internal port 3001 (proxied through frontend)
storage-labels-db       → PostgreSQL database
```

### What Works:
- ✅ Frontend serving React app
- ✅ Backend API health check: http://localhost:3000/api/health
- ✅ Database connection working
- ✅ Container creation working (tested Red-01!)
- ✅ QR code generation working
- ✅ All Phase 1 and Phase 2 features built and ready

## 📋 Next Steps for storage-dev.redleif.dev

### Option 1: Add to Cloudflare Dashboard (RECOMMENDED)

The `cloudflared-main` container uses token-based configuration (managed through Cloudflare Dashboard), not the local `tunnelconfig.yml` file.

**To add storage-dev.redleif.dev:**

1. Go to Cloudflare Dashboard → Zero Trust → Access → Tunnels
2. Find the tunnel with ID: `1ac9b97d-7a01-4eb3-a004-c07f2b451b80`
3. Add a new public hostname:
   - **Subdomain:** `storage-dev`
   - **Domain:** `redleif.dev`
   - **Type:** HTTP
   - **URL:** `host.docker.internal:3000`
   - **TLS Settings:** No TLS Verify = ON

4. Save and the tunnel will update automatically (no restart needed!)

### Option 2: Use Different Tunnel Setup

If you want to use the local `tunnelconfig.yml` file:

1. The entry has already been added at `/home/jodfie/docker/swag/config/tunnelconfig.yml`:
```yaml
# Storage Labels Dev - QR-based inventory system
- hostname: storage-dev.redleif.dev
  service: http://host.docker.internal:3000
  originRequest:
    noTLSVerify: true
```

2. Set up a new cloudflared container that uses this config file instead of token-based auth

## 🔧 Environment Configuration

The app uses these environment variables (in `.env.production`):
```bash
DB_PASSWORD=storage_labels_secure_password_2026
```

## 🚀 Container Management

### Start containers:
```bash
cd /home/jodfie/storage-labels
docker compose --env-file .env.production up -d
```

### Stop containers:
```bash
docker compose down
```

### View logs:
```bash
docker logs storage-labels-backend --tail 50
docker logs storage-labels-frontend --tail 50
docker logs storage-labels-db --tail 50
```

### Rebuild after changes:
```bash
docker compose build
docker compose up -d
```

## 📊 Architecture

```
Browser
  ↓
storage-dev.redleif.dev (Cloudflare Tunnel)
  ↓
localhost:3000 (Frontend nginx)
  ↓
  ├─ /          → React App (static files)
  ├─ /api/*     → Proxied to backend:3001
  └─ /health    → nginx health check
```

## 💾 Database Backups (Task 3.3) - COMPLETE!

### Manual Backup
```bash
# Create a backup
./scripts/backup-database.sh

# Backups are stored in /home/jodfie/storage-labels/backups/
# Format: storage_labels_YYYYMMDD_HHMMSS.sql.gz
```

### Automated Daily Backups
```bash
# Set up daily automated backups (runs at 2:00 AM)
./scripts/setup-backup-cron.sh

# View backup logs
tail -f /home/jodfie/storage-labels/backups/backup.log

# List all backups
ls -lh /home/jodfie/storage-labels/backups/
```

### Restore from Backup
```bash
# List available backups
ls -lh /home/jodfie/storage-labels/backups/

# Restore from a specific backup
./scripts/restore-database.sh storage_labels_20260119_001633.sql.gz

# Or with full path
./scripts/restore-database.sh /home/jodfie/storage-labels/backups/storage_labels_20260119_001633.sql.gz
```

### Backup Features:
- ✅ Compressed with gzip (saves space)
- ✅ Automatic 30-day retention (old backups auto-deleted)
- ✅ Includes `--clean --if-exists` for clean restores
- ✅ Logs all backup operations
- ✅ Can be run manually or automated via cron

## 📤 Data Export (Task 3.4) - COMPLETE!

### Export Formats Available:
Access the export page at http://localhost:3000/export or click the 💾 Export link in the navigation.

**Containers:**
- JSON: http://localhost:3000/api/export/containers.json
- CSV: http://localhost:3000/api/export/containers.csv

**Items:**
- JSON: http://localhost:3000/api/export/items.json
- CSV: http://localhost:3000/api/export/items.csv

**Complete Backup:**
- JSON: http://localhost:3000/api/export/all.json (includes everything)

### Export Features:
- ✅ One-click download from frontend
- ✅ CSV format for Excel/Google Sheets
- ✅ JSON format for backups and imports
- ✅ Complete export includes containers, items, and metadata
- ✅ Proper CSV escaping for special characters
- ✅ Includes container info with items export

## 📱 Mobile Optimizations (Task 3.5) - COMPLETE!

### iOS Enhancements:
- ✅ Safe area support for notches/dynamic island
- ✅ Splash screens for various iPhone models
- ✅ Black-translucent status bar style
- ✅ Prevent zoom on input focus (16px font size)
- ✅ Touch-friendly button sizes (48px minimum)
- ✅ Haptic feedback on interactions

### Mobile Features:
- ✅ Pull-to-refresh on Home page
- ✅ Touch-optimized tap targets (min 44px)
- ✅ Active states for touch devices
- ✅ No tap highlight flash
- ✅ Prevent text selection on buttons
- ✅ Mobile-specific spacing and sizing
- ✅ Responsive design (mobile/tablet/desktop)

### Haptic Feedback:
```typescript
haptics.light()    // Button tap
haptics.success()  // Action success
haptics.error()    // Error/warning
haptics.delete()   // Delete action
```

## 🎯 Phase 3 Status

- [x] Task 3.1: Docker Production Build ✅
- [x] Task 3.2: Cloudflare Tunnel ✅ **LIVE at https://storage-dev.redleif.dev**
- [x] Task 3.3: Database Backup automation ✅
- [x] Task 3.4: Export Functionality ✅
- [x] Task 3.5: Mobile Optimizations ✅

**🎉 PHASE 3 COMPLETE! 🎉**

## 🌐 Live Deployment

**Production URL:** https://storage-dev.redleif.dev

The app is live and accessible from anywhere! The Cloudflare tunnel was configured via API with:
- Tunnel ingress rule for storage-dev.redleif.dev
- DNS CNAME record automatically created
- Container connected to reverse_proxy network
- HTTPS enabled with Cloudflare proxy

## 📝 Notes

- The app is fully functional on localhost:3000
- Database schema is automatically loaded from `database/schema.sql`
- Uploads are persisted in the `uploads_data` Docker volume
- Database data persisted in the `postgres_data` Docker volume
- Frontend API calls use relative URLs (`/api`) proxied by nginx
- QR codes are base64 embedded images (no separate files)

**Ralph says:** "I made it work super good! Just need to add the tunnel in Cloudflare!"
