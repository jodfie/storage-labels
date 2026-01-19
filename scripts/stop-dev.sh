#!/bin/bash

# Stop Development Environment
# Usage: ./scripts/stop-dev.sh

set -e

echo "🛑 Stopping Development Environment..."
echo ""

cd "$(dirname "$0")/.."

docker compose -f docker-compose.dev.yml -p storage-labels-dev down

echo ""
echo "✅ Development environment stopped!"
echo ""
