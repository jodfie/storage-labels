#!/bin/bash

# Start Development Environment
# Usage: ./scripts/start-dev.sh

set -e

echo "🔧 Starting Development Environment..."
echo ""

cd "$(dirname "$0")/.."

docker compose -f docker-compose.dev.yml -p storage-labels-dev up -d

echo ""
echo "✅ Development environment started!"
echo ""
echo "📍 Local:       http://localhost:3100"
echo "🌐 Development: https://storage-dev.redleif.dev"
echo ""
echo "View logs:"
echo "  docker logs storage-labels-dev-frontend --tail 50 -f"
echo "  docker logs storage-labels-dev-backend --tail 50 -f"
echo ""
