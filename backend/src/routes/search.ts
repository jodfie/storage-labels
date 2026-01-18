import { Router } from 'express';

const router = Router();

// GET /api/search?q={query} - Full-text search across containers and items
router.get('/', async (req, res) => {
  const { q } = req.query;
  res.json({ message: `Search for "${q}" - TODO` });
});

export default router;
