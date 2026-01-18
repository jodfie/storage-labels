import { Request, Response } from 'express';
import pool from '../config/database';
import { VALID_COLORS, CreateContainerRequest, UpdateContainerRequest } from '../types/Container';
import { formatQRCode, generateQRCodeImage } from '../utils/qrCodeGenerator';
import { isValidColor, isValidNumber, isValidUUID } from '../utils/validation';

/**
 * Generate a new container with QR code
 * POST /api/containers/generate
 */
export async function generateContainer(req: Request, res: Response) {
  try {
    const { color, number, location_id, location_text, description }: CreateContainerRequest = req.body;

    let finalColor: string;
    let finalNumber: number;

    // If color and number provided, validate them
    if (color && number) {
      if (!isValidColor(color)) {
        return res.status(400).json({
          error: 'Invalid color',
          message: `Color must be one of: ${VALID_COLORS.join(', ')}`,
        });
      }
      if (!isValidNumber(number)) {
        return res.status(400).json({
          error: 'Invalid number',
          message: 'Number must be between 1 and 99',
        });
      }
      finalColor = color;
      finalNumber = number;
    } else {
      // Auto-assign next available color-number combination
      const result = await findNextAvailableColorNumber();
      if (!result) {
        return res.status(400).json({
          error: 'No available container slots',
          message: 'All 792 container slots (8 colors × 99 numbers) are used',
        });
      }
      finalColor = result.color;
      finalNumber = result.number;
    }

    const qrCode = formatQRCode(finalColor as any, finalNumber);

    // Check if QR code already exists
    const checkResult = await pool.query(
      'SELECT id FROM containers WHERE qr_code = $1',
      [qrCode]
    );

    if (checkResult.rows.length > 0) {
      return res.status(409).json({
        error: 'Container already exists',
        message: `Container with QR code ${qrCode} already exists`,
      });
    }

    // Insert new container
    const insertResult = await pool.query(
      `INSERT INTO containers (qr_code, color, number, location_id, location_text, description)
       VALUES ($1, $2, $3, $4, $5, $6)
       RETURNING *`,
      [qrCode, finalColor, finalNumber, location_id || null, location_text || null, description || null]
    );

    const container = insertResult.rows[0];

    // Generate QR code image
    const qrCodeImage = await generateQRCodeImage(qrCode);

    res.status(201).json({
      ...container,
      qr_code_image: qrCodeImage,
    });
  } catch (error) {
    console.error('Error generating container:', error);
    res.status(500).json({ error: 'Failed to generate container' });
  }
}

/**
 * Get all containers
 * GET /api/containers
 */
export async function getAllContainers(req: Request, res: Response) {
  try {
    const result = await pool.query(
      `SELECT c.*, l.name as location_name
       FROM containers c
       LEFT JOIN locations l ON c.location_id = l.id
       ORDER BY c.created_at DESC`
    );

    res.json(result.rows);
  } catch (error) {
    console.error('Error fetching containers:', error);
    res.status(500).json({ error: 'Failed to fetch containers' });
  }
}

/**
 * Get container by QR code
 * GET /api/containers/:qr_code
 */
export async function getContainerByQRCode(req: Request, res: Response) {
  try {
    const qr_code = req.params.qr_code as string;

    const result = await pool.query(
      `SELECT c.*, l.name as location_name
       FROM containers c
       LEFT JOIN locations l ON c.location_id = l.id
       WHERE c.qr_code = $1`,
      [qr_code]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({
        error: 'Container not found',
        message: `No container with QR code ${qr_code}`,
      });
    }

    // Generate QR code image
    const container = result.rows[0];
    const qrCodeImage = await generateQRCodeImage(qr_code);

    res.json({
      ...container,
      qr_code_image: qrCodeImage,
    });
  } catch (error) {
    console.error('Error fetching container:', error);
    res.status(500).json({ error: 'Failed to fetch container' });
  }
}

/**
 * Update container
 * PUT /api/containers/:id
 */
export async function updateContainer(req: Request, res: Response) {
  try {
    const id = req.params.id as string;
    const { location_id, location_text, description, photo_url }: UpdateContainerRequest = req.body;

    if (!isValidUUID(id)) {
      return res.status(400).json({ error: 'Invalid container ID format' });
    }

    // Build dynamic update query
    const updates: string[] = [];
    const values: any[] = [];
    let paramIndex = 1;

    if (location_id !== undefined) {
      updates.push(`location_id = $${paramIndex}`);
      values.push(location_id || null);
      paramIndex++;
    }

    if (location_text !== undefined) {
      updates.push(`location_text = $${paramIndex}`);
      values.push(location_text || null);
      paramIndex++;
    }

    if (description !== undefined) {
      updates.push(`description = $${paramIndex}`);
      values.push(description || null);
      paramIndex++;
    }

    if (photo_url !== undefined) {
      updates.push(`photo_url = $${paramIndex}`);
      values.push(photo_url || null);
      paramIndex++;
    }

    if (updates.length === 0) {
      return res.status(400).json({ error: 'No fields to update' });
    }

    values.push(id);
    const result = await pool.query(
      `UPDATE containers
       SET ${updates.join(', ')}, updated_at = CURRENT_TIMESTAMP
       WHERE id = $${paramIndex}
       RETURNING *`,
      values
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Container not found' });
    }

    res.json(result.rows[0]);
  } catch (error) {
    console.error('Error updating container:', error);
    res.status(500).json({ error: 'Failed to update container' });
  }
}

/**
 * Delete container
 * DELETE /api/containers/:id
 */
export async function deleteContainer(req: Request, res: Response) {
  try {
    const id = req.params.id as string;

    if (!isValidUUID(id)) {
      return res.status(400).json({ error: 'Invalid container ID format' });
    }

    const result = await pool.query(
      'DELETE FROM containers WHERE id = $1 RETURNING *',
      [id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Container not found' });
    }

    res.json({
      message: 'Container deleted successfully',
      container: result.rows[0],
    });
  } catch (error) {
    console.error('Error deleting container:', error);
    res.status(500).json({ error: 'Failed to delete container' });
  }
}

/**
 * Get items in a container
 * GET /api/containers/:id/items
 */
export async function getContainerItems(req: Request, res: Response) {
  try {
    const id = req.params.id as string;

    if (!isValidUUID(id)) {
      return res.status(400).json({ error: 'Invalid container ID format' });
    }

    const result = await pool.query(
      'SELECT * FROM items WHERE container_id = $1 ORDER BY created_at DESC',
      [id]
    );

    res.json(result.rows);
  } catch (error) {
    console.error('Error fetching container items:', error);
    res.status(500).json({ error: 'Failed to fetch items' });
  }
}

/**
 * Helper: Find next available color-number combination
 */
async function findNextAvailableColorNumber(): Promise<{ color: string; number: number } | null> {
  try {
    // Get all used QR codes
    const result = await pool.query('SELECT qr_code FROM containers');
    const usedCodes = new Set(result.rows.map((row: any) => row.qr_code));

    // Try to find an available slot
    for (const color of VALID_COLORS) {
      for (let number = 1; number <= 99; number++) {
        const qrCode = formatQRCode(color, number);
        if (!usedCodes.has(qrCode)) {
          return { color, number };
        }
      }
    }

    return null; // All slots are taken
  } catch (error) {
    console.error('Error finding next available slot:', error);
    return null;
  }
}
