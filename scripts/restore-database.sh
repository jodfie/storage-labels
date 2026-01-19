#!/bin/bash
# Storage Labels Database Restore Script
# Restores PostgreSQL database from a compressed backup

set -e  # Exit on error

# Configuration
BACKUP_DIR="/home/jodfie/storage-labels/backups"
DB_NAME="storage_labels"
DB_USER="postgres"
DB_PASSWORD="storage_labels_secure_password_2026"
CONTAINER_NAME="storage-labels-db"

# Check if backup file was provided
if [ -z "$1" ]; then
  echo "❌ Error: No backup file specified"
  echo ""
  echo "Usage: $0 <backup_file>"
  echo ""
  echo "Available backups:"
  ls -lh "${BACKUP_DIR}"/storage_labels_*.sql.gz 2>/dev/null || echo "  No backups found"
  exit 1
fi

BACKUP_FILE="$1"

# Check if backup file exists
if [ ! -f "${BACKUP_FILE}" ]; then
  # Try looking in backup directory
  if [ -f "${BACKUP_DIR}/${BACKUP_FILE}" ]; then
    BACKUP_FILE="${BACKUP_DIR}/${BACKUP_FILE}"
  else
    echo "❌ Error: Backup file not found: ${BACKUP_FILE}"
    exit 1
  fi
fi

echo "⚠️  WARNING: This will REPLACE all data in the database!"
echo "📁 Backup file: ${BACKUP_FILE}"
echo ""
read -p "Are you sure you want to continue? (yes/no): " -r
echo ""

if [[ ! $REPLY =~ ^[Yy]es$ ]]; then
  echo "❌ Restore cancelled"
  exit 0
fi

echo "🔄 Starting database restore..."

# Decompress and restore
gunzip -c "${BACKUP_FILE}" | docker exec -i -e PGPASSWORD="${DB_PASSWORD}" "${CONTAINER_NAME}" \
  psql -U "${DB_USER}" -d "${DB_NAME}"

# Check if restore was successful
if [ $? -eq 0 ]; then
  echo "✅ Database restored successfully!"
  echo "📊 Restored from: ${BACKUP_FILE}"
else
  echo "❌ Restore failed!"
  exit 1
fi

echo "🎉 Restore complete!"
