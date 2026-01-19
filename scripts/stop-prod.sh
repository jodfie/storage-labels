#!/bin/bash

# Stop Production Environment
# Usage: ./scripts/stop-prod.sh

set -e

echo "🛑 Stopping Production Environment..."
echo ""

cd "$(dirname "$0")/.."

docker compose -f docker-compose.prod.yml down

echo ""
echo "✅ Production environment stopped!"
echo ""
