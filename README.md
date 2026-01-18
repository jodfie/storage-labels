# Storage Labels PWA

**QR-based inventory system for physical containers**

## Overview

Self-hosted PWA for organizing storage containers using QR code labels. Print labels, stick them on containers, scan to catalog contents, and search to find items later.

## Features

### Phase 1 - MVP
- Generate printable QR code labels (Color-Number format: Red-01, Blue-15, etc.)
- Camera-based QR scanning
- Item inventory with photos and descriptions
- Full-text search across all items
- Location tracking (Attic-Left, Garage-A2, etc.)

### Phase 2 - Enhanced
- PWA offline mode
- Print-ready label sheets
- Photo gallery view
- Advanced search filters

### Phase 3 - Deployment
- Docker deployment
- Cloudflare Tunnel integration
- Backup/export functionality

## Tech Stack

- **Frontend:** React 18+ PWA (Vite)
- **Backend:** Node.js + Express
- **Database:** PostgreSQL
- **QR Generation:** `qrcode` npm package
- **QR Scanning:** Browser Camera API + `html5-qrcode`
- **Images:** Local filesystem storage
- **Deploy:** Docker Compose + Cloudflare Tunnel

## Container Numbering System

**Format:** `COLOR-NUMBER`

**Colors:** Red, Blue, Green, Yellow, Orange, Purple, Pink, Turquoise
**Range:** 01-99 per color (expandable)
**Examples:** Red-01, Blue-15, Green-03

This matches physical label sticker colors for easy visual identification.

## Use Cases

- Family photo archives
- Seasonal decorations
- Tax and financial records
- Children's keepsakes
- Sports equipment
- General attic/garage storage
- Moving/relocation organization

## Project Status

**Current Phase:** Initial Setup
**Deploy Target:** storage.redleif.dev
**Primary User:** Family organization

## Documentation

See `docs/` directory for:
- Implementation plan
- Architecture overview
- Database schema
- API endpoints
- Deployment guide

## Getting Started

```bash
# Install dependencies (to be added)
npm install

# Development server (to be added)
npm run dev
```

## License

MIT
