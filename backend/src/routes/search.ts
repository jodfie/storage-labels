import { Router } from 'express';
import { search } from '../controllers/searchController';

const router = Router();

// GET /api/search?q={query} - Full-text search across containers and items
router.get('/', search);

export default router;
