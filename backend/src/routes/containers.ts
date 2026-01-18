import { Router } from 'express';

const router = Router();

// GET /api/containers - List all containers
router.get('/', async (req, res) => {
  res.json({ message: 'List containers - TODO' });
});

// GET /api/containers/:qr_code - Get container by QR code
router.get('/:qr_code', async (req, res) => {
  res.json({ message: `Get container ${req.params.qr_code} - TODO` });
});

// POST /api/containers/generate - Generate new container with QR code
router.post('/generate', async (req, res) => {
  res.json({ message: 'Generate container - TODO' });
});

// PUT /api/containers/:id - Update container
router.put('/:id', async (req, res) => {
  res.json({ message: `Update container ${req.params.id} - TODO` });
});

// DELETE /api/containers/:id - Delete container
router.delete('/:id', async (req, res) => {
  res.json({ message: `Delete container ${req.params.id} - TODO` });
});

// GET /api/containers/:id/items - Get items in container
router.get('/:id/items', async (req, res) => {
  res.json({ message: `List items in container ${req.params.id} - TODO` });
});

// POST /api/containers/:id/items - Add item to container
router.post('/:id/items', async (req, res) => {
  res.json({ message: `Add item to container ${req.params.id} - TODO` });
});

export default router;
