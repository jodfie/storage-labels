import { Router } from 'express';
import {
  getAllLocations,
  createLocation,
  updateLocation,
  deleteLocation,
} from '../controllers/locationController';

const router = Router();

// GET /api/locations - Get all locations
router.get('/', getAllLocations);

// POST /api/locations - Create new location
router.post('/', createLocation);

// PUT /api/locations/:id - Update location
router.put('/:id', updateLocation);

// DELETE /api/locations/:id - Delete location
router.delete('/:id', deleteLocation);

export default router;
