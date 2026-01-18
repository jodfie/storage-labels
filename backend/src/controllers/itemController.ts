import { Request, Response } from 'express';
import pool from '../config/database';
import { CreateItemRequest, UpdateItemRequest } from '../types/Item';
import { isValidUUID } from '../utils/validation';
import fs from 'fs/promises';
import path from 'path';

/**
 * Add item to container
 * POST /api/containers/:id/items
 */
export async function addItemToContainer(req: Request, res: Response) {
  try {
    const container_id = req.params.id as string;
    const { name, description, quantity }: CreateItemRequest = req.body;
    const photo = req.file;

    if (!isValidUUID(container_id)) {
      return res.status(400).json({ error: 'Invalid container ID format' });
    }

    if (!name || name.trim().length === 0) {
      return res.status(400).json({ error: 'Item name is required' });
    }

    // Verify container exists
    const containerCheck = await pool.query(
      'SELECT id FROM containers WHERE id = $1',
      [container_id]
    );

    if (containerCheck.rows.length === 0) {
      return res.status(404).json({ error: 'Container not found' });
    }

    // Prepare photo URL if file was uploaded
    const photo_url = photo ? `/uploads/items/${photo.filename}` : null;

    // Insert item
    const result = await pool.query(
      `INSERT INTO items (container_id, name, description, quantity, photo_url)
       VALUES ($1, $2, $3, $4, $5)
       RETURNING *`,
      [container_id, name.trim(), description || null, quantity || 1, photo_url]
    );

    res.status(201).json(result.rows[0]);
  } catch (error) {
    console.error('Error adding item:', error);
    res.status(500).json({ error: 'Failed to add item' });
  }
}

/**
 * Update item
 * PUT /api/items/:id
 */
export async function updateItem(req: Request, res: Response) {
  try {
    const id = req.params.id as string;
    const { name, description, quantity }: UpdateItemRequest = req.body;
    const photo = req.file;

    if (!isValidUUID(id)) {
      return res.status(400).json({ error: 'Invalid item ID format' });
    }

    // Get current item to check if it exists and get old photo
    const currentItem = await pool.query('SELECT * FROM items WHERE id = $1', [id]);

    if (currentItem.rows.length === 0) {
      return res.status(404).json({ error: 'Item not found' });
    }

    // Build dynamic update query
    const updates: string[] = [];
    const values: any[] = [];
    let paramIndex = 1;

    if (name !== undefined) {
      if (name.trim().length === 0) {
        return res.status(400).json({ error: 'Item name cannot be empty' });
      }
      updates.push(`name = $${paramIndex}`);
      values.push(name.trim());
      paramIndex++;
    }

    if (description !== undefined) {
      updates.push(`description = $${paramIndex}`);
      values.push(description || null);
      paramIndex++;
    }

    if (quantity !== undefined) {
      if (quantity < 0) {
        return res.status(400).json({ error: 'Quantity cannot be negative' });
      }
      updates.push(`quantity = $${paramIndex}`);
      values.push(quantity);
      paramIndex++;
    }

    // Handle photo update
    if (photo) {
      const photo_url = `/uploads/items/${photo.filename}`;
      updates.push(`photo_url = $${paramIndex}`);
      values.push(photo_url);
      paramIndex++;

      // Delete old photo if it exists
      const oldPhotoUrl = currentItem.rows[0].photo_url;
      if (oldPhotoUrl) {
        const oldPhotoPath = path.join(process.cwd(), oldPhotoUrl);
        try {
          await fs.unlink(oldPhotoPath);
        } catch (err) {
          console.warn('Failed to delete old photo:', err);
        }
      }
    }

    if (updates.length === 0) {
      return res.status(400).json({ error: 'No fields to update' });
    }

    values.push(id);
    const result = await pool.query(
      `UPDATE items
       SET ${updates.join(', ')}, updated_at = CURRENT_TIMESTAMP
       WHERE id = $${paramIndex}
       RETURNING *`,
      values
    );

    res.json(result.rows[0]);
  } catch (error) {
    console.error('Error updating item:', error);
    res.status(500).json({ error: 'Failed to update item' });
  }
}

/**
 * Delete item
 * DELETE /api/items/:id
 */
export async function deleteItem(req: Request, res: Response) {
  try {
    const id = req.params.id as string;

    if (!isValidUUID(id)) {
      return res.status(400).json({ error: 'Invalid item ID format' });
    }

    // Get item to check if it exists and get photo path
    const itemResult = await pool.query('SELECT * FROM items WHERE id = $1', [id]);

    if (itemResult.rows.length === 0) {
      return res.status(404).json({ error: 'Item not found' });
    }

    const item = itemResult.rows[0];

    // Delete item from database
    await pool.query('DELETE FROM items WHERE id = $1', [id]);

    // Delete photo file if it exists
    if (item.photo_url) {
      const photoPath = path.join(process.cwd(), item.photo_url);
      try {
        await fs.unlink(photoPath);
      } catch (err) {
        console.warn('Failed to delete photo file:', err);
      }
    }

    res.json({
      message: 'Item deleted successfully',
      item,
    });
  } catch (error) {
    console.error('Error deleting item:', error);
    res.status(500).json({ error: 'Failed to delete item' });
  }
}
