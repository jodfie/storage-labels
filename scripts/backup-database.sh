#!/bin/bash
# Storage Labels Database Backup Script
# Backs up PostgreSQL database with compression and retention

set -e  # Exit on error

# Configuration
BACKUP_DIR="/home/jodfie/storage-labels/backups"
DB_NAME="storage_labels"
DB_USER="postgres"
DB_PASSWORD="storage_labels_secure_password_2026"
CONTAINER_NAME="storage-labels-db"
RETENTION_DAYS=30
TIMESTAMP=$(date +%Y%m%d_%H%M%S)
BACKUP_FILE="storage_labels_${TIMESTAMP}.sql.gz"

# Create backup directory if it doesn't exist
mkdir -p "${BACKUP_DIR}"

echo "🔄 Starting database backup..."
echo "📅 Timestamp: ${TIMESTAMP}"
echo "💾 Backup file: ${BACKUP_FILE}"

# Run pg_dump inside the container and compress
docker exec -e PGPASSWORD="${DB_PASSWORD}" "${CONTAINER_NAME}" \
  pg_dump -U "${DB_USER}" -d "${DB_NAME}" \
  --clean --if-exists \
  | gzip > "${BACKUP_DIR}/${BACKUP_FILE}"

# Check if backup was successful
if [ -f "${BACKUP_DIR}/${BACKUP_FILE}" ]; then
  BACKUP_SIZE=$(du -h "${BACKUP_DIR}/${BACKUP_FILE}" | cut -f1)
  echo "✅ Backup completed successfully!"
  echo "📦 Size: ${BACKUP_SIZE}"
  echo "📍 Location: ${BACKUP_DIR}/${BACKUP_FILE}"
else
  echo "❌ Backup failed!"
  exit 1
fi

# Clean up old backups (keep last 30 days)
echo "🧹 Cleaning up old backups (keeping last ${RETENTION_DAYS} days)..."
find "${BACKUP_DIR}" -name "storage_labels_*.sql.gz" -type f -mtime +${RETENTION_DAYS} -delete

# Count remaining backups
BACKUP_COUNT=$(find "${BACKUP_DIR}" -name "storage_labels_*.sql.gz" -type f | wc -l)
echo "📊 Total backups: ${BACKUP_COUNT}"

echo "🎉 Backup complete!"
