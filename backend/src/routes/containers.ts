import { Router } from 'express';
import {
  generateContainer,
  getAllContainers,
  getContainerByQRCode,
  updateContainer,
  deleteContainer,
  getContainerItems,
} from '../controllers/containerController';

const router = Router();

// POST /api/containers/generate - Generate new container with QR code
// This must come BEFORE /:qr_code to avoid conflicts
router.post('/generate', generateContainer);

// GET /api/containers - List all containers
router.get('/', getAllContainers);

// GET /api/containers/:qr_code - Get container by QR code
router.get('/:qr_code', getContainerByQRCode);

// PUT /api/containers/:id - Update container
router.put('/:id', updateContainer);

// DELETE /api/containers/:id - Delete container
router.delete('/:id', deleteContainer);

// GET /api/containers/:id/items - Get items in container
router.get('/:id/items', getContainerItems);

export default router;
