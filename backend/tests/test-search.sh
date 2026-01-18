#!/bin/bash
# Test script for Search API endpoint
# Usage: ./test-search.sh

BASE_URL="http://localhost:3001/api"

echo "🧪 Testing Storage Labels Search API"
echo "====================================="
echo ""

# Colors for output
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Setup: Create test data
echo "📦 Setting up test data..."

# Create containers
echo "Creating containers..."
container1=$(curl -s -X POST "${BASE_URL}/containers/generate" \
  -H "Content-Type: application/json" \
  -d '{
    "color": "Red",
    "number": 20,
    "description": "Holiday decorations - Christmas ornaments and festive lights"
  }' | jq -r '.id')

container2=$(curl -s -X POST "${BASE_URL}/containers/generate" \
  -H "Content-Type: application/json" \
  -d '{
    "color": "Blue",
    "number": 21,
    "description": "Winter clothing - jackets, scarves, warm gloves"
  }' | jq -r '.id')

container3=$(curl -s -X POST "${BASE_URL}/containers/generate" \
  -H "Content-Type: application/json" \
  -d '{
    "color": "Green",
    "number": 22,
    "description": "Kitchen supplies - cooking utensils, pots, pans"
  }' | jq -r '.id')

# Add items
echo "Adding items..."
curl -s -X POST "${BASE_URL}/containers/${container1}/items" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Christmas Tree Ornaments",
    "description": "Red and gold glass ornaments, set of 24",
    "quantity": 1
  }' > /dev/null

curl -s -X POST "${BASE_URL}/containers/${container2}/items" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Winter Jacket",
    "description": "Navy blue Columbia jacket, size L, waterproof",
    "quantity": 1
  }' > /dev/null

curl -s -X POST "${BASE_URL}/containers/${container2}/items" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Red Scarf",
    "description": "Hand-knitted wool scarf, warm for winter",
    "quantity": 2
  }' > /dev/null

curl -s -X POST "${BASE_URL}/containers/${container3}/items" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Cooking Pot Set",
    "description": "Stainless steel pots with lids, 5-piece set",
    "quantity": 1
  }' > /dev/null

echo -e "${GREEN}✓ Test data created${NC}"
echo ""

# Test 1: Search for "Christmas"
echo "1️⃣  Searching for 'Christmas'..."
response=$(curl -s "${BASE_URL}/search?q=Christmas")
count=$(echo "$response" | jq '.total')
echo "$response" | jq '.'
if [[ $count -gt 0 ]]; then
    echo -e "${GREEN}✓ Found $count result(s)${NC}"
else
    echo -e "${RED}✗ No results found${NC}"
fi
echo ""

# Test 2: Search for "winter"
echo "2️⃣  Searching for 'winter'..."
response=$(curl -s "${BASE_URL}/search?q=winter")
count=$(echo "$response" | jq '.total')
echo "$response" | jq '.query, .total, .execution_time_ms'
if [[ $count -gt 0 ]]; then
    echo -e "${GREEN}✓ Found $count result(s)${NC}"
else
    echo -e "${RED}✗ No results found${NC}"
fi
echo ""

# Test 3: Search for "jacket"
echo "3️⃣  Searching for 'jacket'..."
response=$(curl -s "${BASE_URL}/search?q=jacket")
count=$(echo "$response" | jq '.total')
has_item=$(echo "$response" | jq '.results[] | select(.type == "item") | .item_name' | grep -i jacket)
if [[ ! -z "$has_item" ]]; then
    echo -e "${GREEN}✓ Found jacket item${NC}"
else
    echo -e "${RED}✗ Jacket not found${NC}"
fi
echo ""

# Test 4: Search for "red"
echo "4️⃣  Searching for 'red'..."
response=$(curl -s "${BASE_URL}/search?q=red")
count=$(echo "$response" | jq '.total')
echo "Total results: $count"
if [[ $count -gt 0 ]]; then
    echo -e "${GREEN}✓ Found multiple results for 'red'${NC}"
else
    echo -e "${RED}✗ No results found${NC}"
fi
echo ""

# Test 5: Multi-word search
echo "5️⃣  Searching for 'holiday decorations'..."
response=$(curl -s "${BASE_URL}/search?q=holiday%20decorations")
count=$(echo "$response" | jq '.total')
echo "$response" | jq '.query, .total'
if [[ $count -gt 0 ]]; then
    echo -e "${GREEN}✓ Multi-word search working${NC}"
else
    echo -e "${RED}✗ Multi-word search failed${NC}"
fi
echo ""

# Test 6: Search with special characters
echo "6️⃣  Searching with special characters 'pot's & pans!'..."
response=$(curl -s "${BASE_URL}/search?q=pot%27s%20%26%20pans%21")
query=$(echo "$response" | jq -r '.query')
echo "Query processed as: $query"
if [[ ! -z "$response" ]]; then
    echo -e "${GREEN}✓ Special characters handled gracefully${NC}"
else
    echo -e "${RED}✗ Special characters caused error${NC}"
fi
echo ""

# Test 7: Non-existent term
echo "7️⃣  Searching for non-existent term..."
response=$(curl -s "${BASE_URL}/search?q=nonexistentitem12345")
count=$(echo "$response" | jq '.total')
if [[ $count -eq 0 ]]; then
    echo -e "${GREEN}✓ Correctly returns empty results${NC}"
else
    echo -e "${RED}✗ Should return empty results${NC}"
fi
echo ""

# Test 8: Empty query (should fail)
echo "8️⃣  Testing empty query (should fail)..."
response=$(curl -s "${BASE_URL}/search?q=")
error=$(echo "$response" | jq -r '.error')
if [[ $error == "Query parameter required" ]]; then
    echo -e "${GREEN}✓ Empty query rejected correctly${NC}"
else
    echo -e "${RED}✗ Empty query should be rejected${NC}"
fi
echo ""

# Test 9: Missing query parameter (should fail)
echo "9️⃣  Testing missing query parameter (should fail)..."
response=$(curl -s "${BASE_URL}/search")
error=$(echo "$response" | jq -r '.error')
if [[ $error == "Query parameter required" ]]; then
    echo -e "${GREEN}✓ Missing query parameter rejected correctly${NC}"
else
    echo -e "${RED}✗ Missing query parameter should be rejected${NC}"
fi
echo ""

# Test 10: Case-insensitive search
echo "🔟  Testing case-insensitive search 'CHRISTMAS'..."
response=$(curl -s "${BASE_URL}/search?q=CHRISTMAS")
count=$(echo "$response" | jq '.total')
if [[ $count -gt 0 ]]; then
    echo -e "${GREEN}✓ Case-insensitive search working${NC}"
else
    echo -e "${RED}✗ Case-insensitive search failed${NC}"
fi
echo ""

# Test 11: Verify relevance ranking
echo "1️⃣1️⃣   Verifying relevance ranking..."
response=$(curl -s "${BASE_URL}/search?q=winter")
first_relevance=$(echo "$response" | jq -r '.results[0].relevance')
second_relevance=$(echo "$response" | jq -r '.results[1].relevance // 0')
if (( $(echo "$first_relevance >= $second_relevance" | bc -l) )); then
    echo -e "${GREEN}✓ Results are sorted by relevance${NC}"
else
    echo -e "${RED}✗ Results may not be sorted correctly${NC}"
fi
echo ""

# Test 12: Verify container context in item results
echo "1️⃣2️⃣   Verifying container context in item results..."
response=$(curl -s "${BASE_URL}/search?q=jacket")
container_qr=$(echo "$response" | jq -r '.results[] | select(.type == "item") | .container_qr_code')
if [[ ! -z "$container_qr" && "$container_qr" != "null" ]]; then
    echo -e "${GREEN}✓ Container context included in item results${NC}"
else
    echo -e "${RED}✗ Container context missing${NC}"
fi
echo ""

# Cleanup: Delete test data
echo "🧹 Cleaning up test data..."
curl -s -X DELETE "${BASE_URL}/containers/${container1}" > /dev/null
curl -s -X DELETE "${BASE_URL}/containers/${container2}" > /dev/null
curl -s -X DELETE "${BASE_URL}/containers/${container3}" > /dev/null
echo -e "${GREEN}✓ Test data cleaned up${NC}"
echo ""

echo "====================================="
echo -e "${GREEN}✅ All tests completed!${NC}"
