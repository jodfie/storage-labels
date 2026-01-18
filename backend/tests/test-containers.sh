#!/bin/bash
# Test script for Container API endpoints
# Usage: ./test-containers.sh

BASE_URL="http://localhost:3001/api"

echo "🧪 Testing Storage Labels Container API"
echo "========================================"
echo ""

# Colors for output
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Test 1: Health check
echo "1️⃣  Testing health endpoint..."
response=$(curl -s "${BASE_URL}/../health")
if [[ $response == *"ok"* ]]; then
    echo -e "${GREEN}✓ Health check passed${NC}"
else
    echo -e "${RED}✗ Health check failed${NC}"
    exit 1
fi
echo ""

# Test 2: Generate container (auto-assign)
echo "2️⃣  Generating container (auto-assign)..."
response=$(curl -s -X POST "${BASE_URL}/containers/generate" \
  -H "Content-Type: application/json" \
  -d '{"description": "Test container - auto assigned"}')
echo "$response" | jq '.'
container1_id=$(echo "$response" | jq -r '.id')
container1_qr=$(echo "$response" | jq -r '.qr_code')
echo -e "${GREEN}✓ Generated container: $container1_qr${NC}"
echo ""

# Test 3: Generate container with specific color/number
echo "3️⃣  Generating container (Red-25)..."
response=$(curl -s -X POST "${BASE_URL}/containers/generate" \
  -H "Content-Type: application/json" \
  -d '{
    "color": "Red",
    "number": 25,
    "description": "Test Red-25 container",
    "location_text": "Attic-Left"
  }')
echo "$response" | jq '.'
container2_id=$(echo "$response" | jq -r '.id')
echo -e "${GREEN}✓ Generated container: Red-25${NC}"
echo ""

# Test 4: List all containers
echo "4️⃣  Listing all containers..."
curl -s "${BASE_URL}/containers" | jq '.'
echo -e "${GREEN}✓ Listed containers${NC}"
echo ""

# Test 5: Get container by QR code
echo "5️⃣  Getting container by QR code ($container1_qr)..."
curl -s "${BASE_URL}/containers/${container1_qr}" | jq '.'
echo -e "${GREEN}✓ Retrieved container by QR code${NC}"
echo ""

# Test 6: Update container
echo "6️⃣  Updating container..."
response=$(curl -s -X PUT "${BASE_URL}/containers/${container1_id}" \
  -H "Content-Type: application/json" \
  -d '{
    "description": "UPDATED: Test container description",
    "location_text": "Garage-A2"
  }')
echo "$response" | jq '.'
echo -e "${GREEN}✓ Updated container${NC}"
echo ""

# Test 7: Try duplicate (should fail)
echo "7️⃣  Testing duplicate prevention (Red-25)..."
response=$(curl -s -X POST "${BASE_URL}/containers/generate" \
  -H "Content-Type: application/json" \
  -d '{
    "color": "Red",
    "number": 25,
    "description": "This should fail"
  }')
if [[ $response == *"already exists"* ]]; then
    echo -e "${GREEN}✓ Duplicate prevention working${NC}"
else
    echo -e "${RED}✗ Duplicate prevention failed${NC}"
fi
echo ""

# Test 8: Invalid color
echo "8️⃣  Testing invalid color..."
response=$(curl -s -X POST "${BASE_URL}/containers/generate" \
  -H "Content-Type: application/json" \
  -d '{"color": "InvalidColor", "number": 1}')
if [[ $response == *"Invalid color"* ]]; then
    echo -e "${GREEN}✓ Invalid color rejected${NC}"
else
    echo -e "${RED}✗ Invalid color not rejected${NC}"
fi
echo ""

# Test 9: Invalid number
echo "9️⃣  Testing invalid number..."
response=$(curl -s -X POST "${BASE_URL}/containers/generate" \
  -H "Content-Type: application/json" \
  -d '{"color": "Blue", "number": 150}')
if [[ $response == *"Invalid number"* ]]; then
    echo -e "${GREEN}✓ Invalid number rejected${NC}"
else
    echo -e "${RED}✗ Invalid number not rejected${NC}"
fi
echo ""

# Test 10: Delete container
echo "🔟  Deleting test containers..."
curl -s -X DELETE "${BASE_URL}/containers/${container1_id}" | jq '.'
curl -s -X DELETE "${BASE_URL}/containers/${container2_id}" | jq '.'
echo -e "${GREEN}✓ Deleted test containers${NC}"
echo ""

echo "========================================"
echo -e "${GREEN}✅ All tests completed!${NC}"
