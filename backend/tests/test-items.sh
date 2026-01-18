#!/bin/bash
# Test script for Item API endpoints
# Usage: ./test-items.sh

BASE_URL="http://localhost:3001/api"

echo "🧪 Testing Storage Labels Item API"
echo "===================================="
echo ""

# Colors for output
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Test 1: Create a test container first
echo "1️⃣  Creating test container for items..."
response=$(curl -s -X POST "${BASE_URL}/containers/generate" \
  -H "Content-Type: application/json" \
  -d '{
    "color": "Green",
    "number": 10,
    "description": "Test container for items"
  }')
echo "$response" | jq '.'
container_id=$(echo "$response" | jq -r '.id')
if [[ -z "$container_id" || "$container_id" == "null" ]]; then
    echo -e "${RED}✗ Failed to create container${NC}"
    exit 1
fi
echo -e "${GREEN}✓ Created container: $container_id${NC}"
echo ""

# Test 2: Add item without photo
echo "2️⃣  Adding item without photo..."
response=$(curl -s -X POST "${BASE_URL}/containers/${container_id}/items" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Winter Jacket",
    "description": "Blue Columbia jacket, size L",
    "quantity": 1
  }')
echo "$response" | jq '.'
item1_id=$(echo "$response" | jq -r '.id')
echo -e "${GREEN}✓ Added item: $item1_id${NC}"
echo ""

# Test 3: Add another item
echo "3️⃣  Adding second item..."
response=$(curl -s -X POST "${BASE_URL}/containers/${container_id}/items" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Red Scarf",
    "description": "Hand-knitted wool scarf",
    "quantity": 2
  }')
item2_id=$(echo "$response" | jq -r '.id')
echo -e "${GREEN}✓ Added item: $item2_id${NC}"
echo ""

# Test 4: Get all items in container
echo "4️⃣  Getting all items in container..."
curl -s "${BASE_URL}/containers/${container_id}/items" | jq '.'
echo -e "${GREEN}✓ Retrieved items${NC}"
echo ""

# Test 5: Update item
echo "5️⃣  Updating item..."
response=$(curl -s -X PUT "${BASE_URL}/items/${item1_id}" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Winter Jacket - Updated",
    "quantity": 3
  }')
echo "$response" | jq '.'
echo -e "${GREEN}✓ Updated item${NC}"
echo ""

# Test 6: Try to add item to non-existent container (should fail)
echo "6️⃣  Testing non-existent container (should fail)..."
response=$(curl -s -X POST "${BASE_URL}/containers/00000000-0000-0000-0000-000000000000/items" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "This should fail",
    "quantity": 1
  }')
if [[ $response == *"Container not found"* ]]; then
    echo -e "${GREEN}✓ Correctly rejected non-existent container${NC}"
else
    echo -e "${RED}✗ Failed to reject non-existent container${NC}"
fi
echo ""

# Test 7: Try to add item without name (should fail)
echo "7️⃣  Testing missing name field (should fail)..."
response=$(curl -s -X POST "${BASE_URL}/containers/${container_id}/items" \
  -H "Content-Type: application/json" \
  -d '{
    "description": "Missing name"
  }')
if [[ $response == *"name is required"* ]]; then
    echo -e "${GREEN}✓ Correctly rejected missing name${NC}"
else
    echo -e "${RED}✗ Failed to reject missing name${NC}"
fi
echo ""

# Test 8: Try to update with negative quantity (should fail)
echo "8️⃣  Testing negative quantity (should fail)..."
response=$(curl -s -X PUT "${BASE_URL}/items/${item1_id}" \
  -H "Content-Type: application/json" \
  -d '{
    "quantity": -5
  }')
if [[ $response == *"cannot be negative"* ]]; then
    echo -e "${GREEN}✓ Correctly rejected negative quantity${NC}"
else
    echo -e "${RED}✗ Failed to reject negative quantity${NC}"
fi
echo ""

# Test 9: Try to update with empty name (should fail)
echo "9️⃣  Testing empty name (should fail)..."
response=$(curl -s -X PUT "${BASE_URL}/items/${item1_id}" \
  -H "Content-Type: application/json" \
  -d '{
    "name": ""
  }')
if [[ $response == *"cannot be empty"* ]]; then
    echo -e "${GREEN}✓ Correctly rejected empty name${NC}"
else
    echo -e "${RED}✗ Failed to reject empty name${NC}"
fi
echo ""

# Test 10: Delete item
echo "🔟  Deleting items..."
curl -s -X DELETE "${BASE_URL}/items/${item1_id}" | jq '.'
curl -s -X DELETE "${BASE_URL}/items/${item2_id}" | jq '.'
echo -e "${GREEN}✓ Deleted items${NC}"
echo ""

# Test 11: Verify cascade delete (delete container, items should be gone)
echo "1️⃣1️⃣   Testing cascade delete..."
# Add a new item
response=$(curl -s -X POST "${BASE_URL}/containers/${container_id}/items" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Test cascade delete",
    "quantity": 1
  }')
cascade_item_id=$(echo "$response" | jq -r '.id')

# Delete the container
curl -s -X DELETE "${BASE_URL}/containers/${container_id}" > /dev/null

# Try to update the item (should fail because container is deleted)
response=$(curl -s -X PUT "${BASE_URL}/items/${cascade_item_id}" \
  -H "Content-Type: application/json" \
  -d '{"quantity": 5}')
if [[ $response == *"not found"* ]]; then
    echo -e "${GREEN}✓ Cascade delete working correctly${NC}"
else
    echo -e "${RED}✗ Cascade delete may not be working${NC}"
fi
echo ""

echo "===================================="
echo -e "${GREEN}✅ All tests completed!${NC}"
