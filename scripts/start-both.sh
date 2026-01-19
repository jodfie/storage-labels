#!/bin/bash

# Start Both Production and Development Environments
# Usage: ./scripts/start-both.sh

set -e

cd "$(dirname "$0")/.."

echo "🚀 Starting Both Environments..."
echo ""

echo "Starting Production..."
docker compose -f docker-compose.prod.yml --env-file .env.production up -d

echo ""
echo "Starting Development..."
docker compose -f docker-compose.dev.yml -p storage-labels-dev up -d

echo ""
echo "✅ Both environments started!"
echo ""
echo "Production:"
echo "  📍 Local:      http://localhost:3000"
echo "  🌐 Live:       https://storage.redleif.dev"
echo ""
echo "Development:"
echo "  📍 Local:      http://localhost:3100"
echo "  🌐 Live:       https://storage-dev.redleif.dev"
echo ""
echo "Check status:"
echo "  docker ps | grep storage-labels"
echo ""
