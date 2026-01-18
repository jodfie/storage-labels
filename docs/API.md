# Storage Labels API Documentation

Base URL: `http://localhost:3001/api`

## Container Endpoints

### Generate Container
Create a new container with QR code.

**POST** `/containers/generate`

**Request Body:**
```json
{
  "color": "Red",           // Optional: Red, Blue, Green, Yellow, Orange, Purple, Pink, Turquoise
  "number": 1,              // Optional: 1-99
  "description": "string",  // Optional
  "location_id": "uuid",    // Optional
  "location_text": "string" // Optional
}
```

If `color` and `number` are not provided, the system auto-assigns the next available combination.

**Response:** `201 Created`
```json
{
  "id": "uuid",
  "qr_code": "Red-01",
  "color": "Red",
  "number": 1,
  "location_id": "uuid",
  "location_text": "Attic-Left",
  "description": "Holiday decorations",
  "photo_url": null,
  "qr_code_image": "data:image/png;base64,...",
  "created_at": "2026-01-18T...",
  "updated_at": "2026-01-18T..."
}
```

**Errors:**
- `400` - Invalid color or number
- `409` - Container with QR code already exists

---

### List All Containers
Get all containers with location names.

**GET** `/containers`

**Response:** `200 OK`
```json
[
  {
    "id": "uuid",
    "qr_code": "Red-01",
    "color": "Red",
    "number": 1,
    "location_id": "uuid",
    "location_name": "Attic-Left",
    "location_text": "Attic-Left",
    "description": "Holiday decorations",
    "photo_url": null,
    "created_at": "2026-01-18T...",
    "updated_at": "2026-01-18T..."
  }
]
```

---

### Get Container by QR Code
Retrieve a container by its QR code.

**GET** `/containers/:qr_code`

**Example:** `/containers/Red-01`

**Response:** `200 OK`
```json
{
  "id": "uuid",
  "qr_code": "Red-01",
  "color": "Red",
  "number": 1,
  "location_name": "Attic-Left",
  "description": "Holiday decorations",
  "qr_code_image": "data:image/png;base64,...",
  "created_at": "2026-01-18T...",
  "updated_at": "2026-01-18T..."
}
```

**Errors:**
- `404` - Container not found

---

### Update Container
Update container details.

**PUT** `/containers/:id`

**Request Body:**
```json
{
  "location_id": "uuid",    // Optional
  "location_text": "string", // Optional
  "description": "string",  // Optional
  "photo_url": "string"     // Optional
}
```

**Response:** `200 OK`
```json
{
  "id": "uuid",
  "qr_code": "Red-01",
  "description": "Updated description",
  ...
}
```

**Errors:**
- `400` - Invalid container ID or no fields to update
- `404` - Container not found

---

### Delete Container
Delete a container (cascades to items).

**DELETE** `/containers/:id`

**Response:** `200 OK`
```json
{
  "message": "Container deleted successfully",
  "container": { ... }
}
```

**Errors:**
- `400` - Invalid container ID
- `404` - Container not found

---

### Get Container Items
List all items in a container.

**GET** `/containers/:id/items`

**Response:** `200 OK`
```json
[
  {
    "id": "uuid",
    "container_id": "uuid",
    "name": "Winter Jacket",
    "description": "Blue Columbia jacket",
    "quantity": 1,
    "photo_url": "/uploads/items/item-123456.jpg",
    "created_at": "2026-01-18T...",
    "updated_at": "2026-01-18T..."
  }
]
```

**Errors:**
- `400` - Invalid container ID

---

## Item Endpoints

### Add Item to Container
Add a new item to a container with optional photo.

**POST** `/containers/:id/items`

**Content-Type:** `multipart/form-data` (for photo) or `application/json`

**Form Fields:**
- `name` (required): Item name
- `description` (optional): Item description
- `quantity` (optional): Quantity (default: 1)
- `photo` (optional): Image file (JPG/PNG, max 10MB)

**JSON Request Body** (without photo):
```json
{
  "name": "Winter Jacket",
  "description": "Blue Columbia jacket, size L",
  "quantity": 1
}
```

**Response:** `201 Created`
```json
{
  "id": "uuid",
  "container_id": "uuid",
  "name": "Winter Jacket",
  "description": "Blue Columbia jacket, size L",
  "quantity": 1,
  "photo_url": "/uploads/items/item-123456.jpg",
  "created_at": "2026-01-18T...",
  "updated_at": "2026-01-18T..."
}
```

**Errors:**
- `400` - Invalid container ID or missing name
- `404` - Container not found

---

### Update Item
Update an item with optional new photo.

**PUT** `/items/:id`

**Content-Type:** `multipart/form-data` or `application/json`

**Form Fields:**
- `name` (optional): New item name
- `description` (optional): New description
- `quantity` (optional): New quantity
- `photo` (optional): New image file (replaces old photo)

**JSON Request Body** (without photo):
```json
{
  "name": "Winter Jacket - Updated",
  "quantity": 2
}
```

**Response:** `200 OK`
```json
{
  "id": "uuid",
  "name": "Winter Jacket - Updated",
  "quantity": 2,
  ...
}
```

**Errors:**
- `400` - Invalid item ID, empty name, negative quantity, or no fields to update
- `404` - Item not found

---

### Delete Item
Delete an item and its photo.

**DELETE** `/items/:id`

**Response:** `200 OK`
```json
{
  "message": "Item deleted successfully",
  "item": { ... }
}
```

**Errors:**
- `400` - Invalid item ID
- `404` - Item not found

---

## Search Endpoints

### Full-Text Search
Search across all containers and items.

**GET** `/search?q={query}`

**Query Parameters:**
- `q` (required): Search query string

**Example:** `/search?q=winter jacket`

**Response:** `200 OK`
```json
{
  "query": "winter jacket",
  "results": [
    {
      "type": "item",
      "relevance": 0.607927,
      "container_id": "uuid",
      "container_qr_code": "Blue-10",
      "container_color": "Blue",
      "container_number": 10,
      "container_description": "Winter clothing",
      "container_location_text": "Attic-Left",
      "item_id": "uuid",
      "item_name": "Winter Jacket",
      "item_description": "Navy blue Columbia jacket",
      "item_quantity": 1,
      "item_photo_url": "/uploads/items/item-123.jpg"
    },
    {
      "type": "container",
      "relevance": 0.304318,
      "container_id": "uuid",
      "container_qr_code": "Blue-10",
      "container_color": "Blue",
      "container_number": 10,
      "container_description": "Winter clothing - jackets, scarves",
      "container_location_text": "Attic-Left"
    }
  ],
  "total": 2,
  "execution_time_ms": 45
}
```

**Result Types:**
- `container` - Match found in container description
- `item` - Match found in item name or description

**Search Features:**
- Full-text search using PostgreSQL ts_vector
- Searches container descriptions
- Searches item names and descriptions
- Results sorted by relevance (highest first)
- Case-insensitive
- Handles special characters gracefully
- Multi-word queries supported

**Container Context:**
All results include container information:
- For container results: Full container details
- For item results: Associated container details + item details

**Relevance Scoring:**
Results are ranked by PostgreSQL's `ts_rank` function:
- Higher relevance score = better match
- Multiple word matches increase relevance
- Results limited to 50 per type (100 total max)

**Errors:**
- `400` - Missing or empty query parameter
- `500` - Search failed

**Example Queries:**
```bash
# Simple search
GET /search?q=Christmas

# Multi-word search
GET /search?q=holiday decorations

# Case-insensitive
GET /search?q=WINTER

# With special characters (automatically sanitized)
GET /search?q=pot's & pans!
```

---

## File Upload Specifications

### Allowed Image Types
- `image/jpeg`
- `image/jpg`
- `image/png`

### Size Limit
- Maximum: 10MB per file

### Storage
- Files stored in: `backend/uploads/items/`
- Filename format: `item-{timestamp}-{random}.{ext}`
- Access via: `/uploads/items/{filename}`

### Photo Cleanup
- Old photos are automatically deleted when:
  - Item is updated with new photo
  - Item is deleted

---

## Error Responses

All errors follow this format:

```json
{
  "error": "Error title",
  "message": "Detailed error message"
}
```

### Common HTTP Status Codes
- `200` - Success
- `201` - Created
- `400` - Bad Request (validation error)
- `404` - Not Found
- `409` - Conflict (duplicate QR code)
- `500` - Internal Server Error

---

## Testing

### Using curl

**Create container:**
```bash
curl -X POST http://localhost:3001/api/containers/generate \
  -H "Content-Type: application/json" \
  -d '{"color": "Red", "number": 1, "description": "Test container"}'
```

**Add item with photo:**
```bash
curl -X POST http://localhost:3001/api/containers/{id}/items \
  -F "name=Winter Jacket" \
  -F "description=Blue jacket" \
  -F "quantity=1" \
  -F "photo=@/path/to/image.jpg"
```

**Add item without photo:**
```bash
curl -X POST http://localhost:3001/api/containers/{id}/items \
  -H "Content-Type: application/json" \
  -d '{"name": "Winter Jacket", "quantity": 1}'
```

**Search:**
```bash
curl "http://localhost:3001/api/search?q=winter"
```

### Test Scripts
- `backend/tests/test-containers.sh` - Automated container API tests
- `backend/tests/test-items.sh` - Automated item API tests
- `backend/tests/test-search.sh` - Automated search API tests
- `backend/tests/container-api.http` - REST Client test file for containers
- `backend/tests/item-api.http` - REST Client test file for items
- `backend/tests/search-api.http` - REST Client test file for search
