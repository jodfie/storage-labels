import { Router } from 'express';

const router = Router();

// PUT /api/items/:id - Update item
router.put('/:id', async (req, res) => {
  res.json({ message: `Update item ${req.params.id} - TODO` });
});

// DELETE /api/items/:id - Delete item
router.delete('/:id', async (req, res) => {
  res.json({ message: `Delete item ${req.params.id} - TODO` });
});

export default router;
