#!/bin/bash

# Start Production Environment
# Usage: ./scripts/start-prod.sh

set -e

echo "🚀 Starting Production Environment..."
echo ""

cd "$(dirname "$0")/.."

docker compose -f docker-compose.prod.yml --env-file .env.production up -d

echo ""
echo "✅ Production environment started!"
echo ""
echo "📍 Local:      http://localhost:3000"
echo "🌐 Production: https://storage.redleif.dev"
echo ""
echo "View logs:"
echo "  docker logs storage-labels-prod-frontend --tail 50 -f"
echo "  docker logs storage-labels-prod-backend --tail 50 -f"
echo ""
