#!/bin/bash
# Setup automated daily backups for Storage Labels database

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
BACKUP_SCRIPT="${SCRIPT_DIR}/backup-database.sh"
CRON_TIME="0 2 * * *"  # Run at 2:00 AM daily

echo "🔧 Setting up automated database backups..."
echo "📅 Schedule: Daily at 2:00 AM"
echo "📜 Script: ${BACKUP_SCRIPT}"

# Check if backup script exists
if [ ! -f "${BACKUP_SCRIPT}" ]; then
  echo "❌ Error: Backup script not found: ${BACKUP_SCRIPT}"
  exit 1
fi

# Create cron job entry
CRON_JOB="${CRON_TIME} ${BACKUP_SCRIPT} >> /home/jodfie/storage-labels/backups/backup.log 2>&1"

# Check if cron job already exists
if crontab -l 2>/dev/null | grep -q "${BACKUP_SCRIPT}"; then
  echo "⚠️  Cron job already exists!"
  echo ""
  echo "Current crontab entries for backup:"
  crontab -l | grep "${BACKUP_SCRIPT}"
  echo ""
  read -p "Do you want to replace it? (yes/no): " -r
  echo ""

  if [[ $REPLY =~ ^[Yy]es$ ]]; then
    # Remove old entry
    crontab -l | grep -v "${BACKUP_SCRIPT}" | crontab -
    echo "✅ Removed old cron job"
  else
    echo "❌ Setup cancelled"
    exit 0
  fi
fi

# Add new cron job
(crontab -l 2>/dev/null; echo "${CRON_JOB}") | crontab -

echo "✅ Cron job added successfully!"
echo ""
echo "📋 Cron job details:"
echo "  Schedule: ${CRON_TIME} (2:00 AM daily)"
echo "  Command:  ${BACKUP_SCRIPT}"
echo "  Log file: /home/jodfie/storage-labels/backups/backup.log"
echo ""
echo "📊 Current crontab:"
crontab -l | grep "${BACKUP_SCRIPT}"
echo ""
echo "🎉 Automated backups configured!"
echo ""
echo "💡 To view backup logs: tail -f /home/jodfie/storage-labels/backups/backup.log"
echo "💡 To list backups: ls -lh /home/jodfie/storage-labels/backups/"
echo "💡 To remove cron job: crontab -e"
