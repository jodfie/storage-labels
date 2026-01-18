import { Request, Response } from 'express';
import pool from '../config/database';
import { isValidUUID } from '../utils/validation';

export async function getAllLocations(req: Request, res: Response) {
  try {
    const result = await pool.query(
      'SELECT * FROM locations ORDER BY name ASC'
    );
    
    res.json(result.rows);
  } catch (error) {
    console.error('Error fetching locations:', error);
    res.status(500).json({ error: 'Failed to fetch locations' });
  }
}

export async function createLocation(req: Request, res: Response) {
  try {
    const { name, description } = req.body;
    
    if (!name || name.trim().length === 0) {
      return res.status(400).json({ error: 'Location name is required' });
    }
    
    const result = await pool.query(
      'INSERT INTO locations (name, description) VALUES ($1, $2) RETURNING *',
      [name.trim(), description || null]
    );
    
    res.status(201).json(result.rows[0]);
  } catch (error: any) {
    if (error.code === '23505') {
      return res.status(409).json({ error: 'Location name already exists' });
    }
    console.error('Error creating location:', error);
    res.status(500).json({ error: 'Failed to create location' });
  }
}

export async function updateLocation(req: Request, res: Response) {
  try {
    const id = req.params.id as string;
    const { name, description } = req.body;
    
    if (!isValidUUID(id)) {
      return res.status(400).json({ error: 'Invalid location ID' });
    }
    
    if (!name || name.trim().length === 0) {
      return res.status(400).json({ error: 'Location name is required' });
    }
    
    const result = await pool.query(
      'UPDATE locations SET name = $1, description = $2 WHERE id = $3 RETURNING *',
      [name.trim(), description || null, id]
    );
    
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Location not found' });
    }
    
    res.json(result.rows[0]);
  } catch (error: any) {
    if (error.code === '23505') {
      return res.status(409).json({ error: 'Location name already exists' });
    }
    console.error('Error updating location:', error);
    res.status(500).json({ error: 'Failed to update location' });
  }
}

export async function deleteLocation(req: Request, res: Response) {
  try {
    const id = req.params.id as string;
    
    if (!isValidUUID(id)) {
      return res.status(400).json({ error: 'Invalid location ID' });
    }
    
    const result = await pool.query(
      'DELETE FROM locations WHERE id = $1 RETURNING *',
      [id]
    );
    
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Location not found' });
    }
    
    res.json({
      message: 'Location deleted successfully',
      location: result.rows[0],
    });
  } catch (error) {
    console.error('Error deleting location:', error);
    res.status(500).json({ error: 'Failed to delete location' });
  }
}
