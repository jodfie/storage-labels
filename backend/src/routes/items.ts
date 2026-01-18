import { Router } from 'express';
import { upload } from '../config/upload';
import { updateItem, deleteItem } from '../controllers/itemController';

const router = Router();

// PUT /api/items/:id - Update item
router.put('/:id', upload.single('photo'), updateItem);

// DELETE /api/items/:id - Delete item
router.delete('/:id', deleteItem);

export default router;
