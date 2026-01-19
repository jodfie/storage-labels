# Dev/Prod Environment Separation

## ✅ True Separation Complete!

Your Storage Labels app now has **separate development and production environments** running simultaneously.

## 🌐 Live URLs

- **Production:** https://storage.redleif.dev (Port 3000)
- **Development:** https://storage-dev.redleif.dev (Port 3100)

## 📊 Architecture

```
Production Environment:
  storage.redleif.dev
    └─> Cloudflare Tunnel
        └─> storage-labels-prod-frontend:80 (Port 3000)
            └─> storage-labels-prod-backend:3001
                └─> storage-labels-prod-db (storage_labels_prod)

Development Environment:
  storage-dev.redleif.dev
    └─> Cloudflare Tunnel
        └─> storage-labels-dev-frontend:80 (Port 3100)
            └─> storage-labels-dev-backend:3001
                └─> storage-labels-dev-db (storage_labels_dev)
```

## 🔑 Key Differences

| Aspect | Production | Development |
|--------|-----------|-------------|
| URL | storage.redleif.dev | storage-dev.redleif.dev |
| Port | 3000 | 3100 |
| Database | storage_labels_prod | storage_labels_dev |
| Containers | storage-labels-prod-* | storage-labels-dev-* |
| Volumes | postgres_data_prod, uploads_data_prod | postgres_data_dev, uploads_data_dev |
| Branch | master | dev |

## 🚀 Managing Environments

### Start Production
```bash
docker compose -f docker-compose.prod.yml --env-file .env.production up -d
```

### Start Development
```bash
docker compose -f docker-compose.dev.yml -p storage-labels-dev up -d
```

### Start Both (recommended)
```bash
# Start production
docker compose -f docker-compose.prod.yml --env-file .env.production up -d

# Start development
docker compose -f docker-compose.dev.yml -p storage-labels-dev up -d
```

### Stop Production
```bash
docker compose -f docker-compose.prod.yml down
```

### Stop Development
```bash
docker compose -f docker-compose.dev.yml -p storage-labels-dev down
```

### Stop Both
```bash
docker compose -f docker-compose.prod.yml down
docker compose -f docker-compose.dev.yml -p storage-labels-dev down
```

### View Logs

**Production:**
```bash
docker logs storage-labels-prod-frontend --tail 50 -f
docker logs storage-labels-prod-backend --tail 50 -f
docker logs storage-labels-prod-db --tail 50 -f
```

**Development:**
```bash
docker logs storage-labels-dev-frontend --tail 50 -f
docker logs storage-labels-dev-backend --tail 50 -f
docker logs storage-labels-dev-db --tail 50 -f
```

### Rebuild After Code Changes

**Production (master branch):**
```bash
git checkout master
docker compose -f docker-compose.prod.yml build
docker compose -f docker-compose.prod.yml --env-file .env.production up -d
```

**Development (dev branch):**
```bash
git checkout dev
docker compose -f docker-compose.dev.yml -p storage-labels-dev build
docker compose -f docker-compose.dev.yml -p storage-labels-dev up -d
```

## 📦 Container Status

Check all running containers:
```bash
docker ps --format "table {{.Names}}\t{{.Ports}}\t{{.Status}}" | grep storage-labels
```

Expected output when both environments are running:
```
storage-labels-dev-frontend    0.0.0.0:3100->80/tcp   Up (healthy)
storage-labels-dev-backend     3001/tcp                Up (healthy)
storage-labels-dev-db          0.0.0.0:5433->5432/tcp Up (healthy)
storage-labels-prod-frontend   0.0.0.0:3000->80/tcp   Up (healthy)
storage-labels-prod-backend    3001/tcp                Up (healthy)
storage-labels-prod-db         5432/tcp                Up (healthy)
```

## 🔄 Typical Workflow

### 1. Develop on Dev Branch
```bash
git checkout dev
# Make changes to code
docker compose -f docker-compose.dev.yml -p storage-labels-dev build
docker compose -f docker-compose.dev.yml -p storage-labels-dev up -d
# Test at https://storage-dev.redleif.dev
```

### 2. Test Development
- Open https://storage-dev.redleif.dev
- Create test containers and items
- Verify all features work
- Check that production is unaffected

### 3. Merge to Master
```bash
git checkout dev
git add -A
git commit -m "Your changes"
git push origin dev

git checkout master
git merge dev
git push origin master
```

### 4. Deploy to Production
```bash
git checkout master
docker compose -f docker-compose.prod.yml build
docker compose -f docker-compose.prod.yml --env-file .env.production up -d
# Production updated at https://storage.redleif.dev
```

## 💾 Data Separation

Each environment has its own database and uploads:

**Production Data:**
- Database Volume: `storage-labels_postgres_data_prod`
- Uploads Volume: `storage-labels_uploads_data_prod`
- Database Name: `storage_labels_prod`

**Development Data:**
- Database Volume: `storage-labels-dev_postgres_data_dev`
- Uploads Volume: `storage-labels-dev_uploads_data_dev`
- Database Name: `storage_labels_dev`

Creating a container in development **does not** affect production!

## 🔐 Environment Variables

Both environments use the same `.env.production` file for the DB password.

If you want different passwords:
1. Create `.env.development` for dev
2. Update docker-compose.dev.yml to use it
3. Update the password in the dev compose file

## 🎯 Benefits of This Setup

✅ **Isolated Testing** - Test changes without affecting production
✅ **Separate Data** - Dev and prod have different databases
✅ **Safe Deployments** - Verify in dev before deploying to prod
✅ **Concurrent Running** - Both environments run simultaneously
✅ **Easy Rollback** - Production stays stable while dev experiments
✅ **Branch-Based** - Dev branch → dev environment, master → prod

## 📝 Notes

- Both environments run on the same machine
- They use different ports (3000 vs 3100)
- They use different Docker networks
- They have separate databases and upload storage
- Cloudflare tunnel routes URLs to correct containers
- Changes to dev code don't affect production until merged

**Ralph says:** "Now you can break stuff in development without breaking production! I made it super safe!"

---

Last Updated: 2026-01-19
