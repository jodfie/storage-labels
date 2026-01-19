import { Request, Response } from 'express';
import pool from '../config/database';

// Export containers to JSON
export async function exportContainersJSON(req: Request, res: Response) {
  try {
    const result = await pool.query(`
      SELECT * FROM containers
      ORDER BY created_at DESC
    `);

    res.setHeader('Content-Type', 'application/json');
    res.setHeader('Content-Disposition', 'attachment; filename="containers.json"');
    res.json(result.rows);
  } catch (error) {
    console.error('Export containers error:', error);
    res.status(500).json({ error: 'Export failed' });
  }
}

// Export containers to CSV
export async function exportContainersCSV(req: Request, res: Response) {
  try {
    const result = await pool.query(`
      SELECT * FROM containers
      ORDER BY created_at DESC
    `);

    const containers = result.rows;
    
    // CSV headers
    const headers = ['ID', 'QR Code', 'Color', 'Number', 'Description', 'Location', 'Created At'];
    const csvRows = [headers.join(',')];

    // CSV data rows
    containers.forEach((c) => {
      const row = [
        c.id,
        c.qr_code,
        c.color,
        c.number,
        `"${(c.description || '').replace(/"/g, '""')}"`,
        `"${(c.location_text || '').replace(/"/g, '""')}"`,
        c.created_at
      ];
      csvRows.push(row.join(','));
    });

    const csv = csvRows.join('\n');

    res.setHeader('Content-Type', 'text/csv');
    res.setHeader('Content-Disposition', 'attachment; filename="containers.csv"');
    res.send(csv);
  } catch (error) {
    console.error('Export containers CSV error:', error);
    res.status(500).json({ error: 'Export failed' });
  }
}

// Export items to JSON
export async function exportItemsJSON(req: Request, res: Response) {
  try {
    const result = await pool.query(`
      SELECT 
        i.id,
        i.name,
        i.description,
        i.quantity,
        i.photo_url,
        i.created_at,
        c.qr_code as container_qr_code,
        c.color as container_color,
        c.location_text as container_location
      FROM items i
      JOIN containers c ON i.container_id = c.id
      ORDER BY i.created_at DESC
    `);

    res.setHeader('Content-Type', 'application/json');
    res.setHeader('Content-Disposition', 'attachment; filename="items.json"');
    res.json(result.rows);
  } catch (error) {
    console.error('Export items error:', error);
    res.status(500).json({ error: 'Export failed' });
  }
}

// Export items to CSV
export async function exportItemsCSV(req: Request, res: Response) {
  try {
    const result = await pool.query(`
      SELECT 
        i.id,
        i.name,
        i.description,
        i.quantity,
        i.photo_url,
        i.created_at,
        c.qr_code as container_qr_code,
        c.color as container_color,
        c.location_text as container_location
      FROM items i
      JOIN containers c ON i.container_id = c.id
      ORDER BY i.created_at DESC
    `);

    const items = result.rows;
    
    // CSV headers
    const headers = ['ID', 'Name', 'Description', 'Quantity', 'Container QR', 'Container Color', 'Container Location', 'Created At'];
    const csvRows = [headers.join(',')];

    // CSV data rows
    items.forEach((i) => {
      const row = [
        i.id,
        `"${(i.name || '').replace(/"/g, '""')}"`,
        `"${(i.description || '').replace(/"/g, '""')}"`,
        i.quantity,
        i.container_qr_code,
        i.container_color,
        `"${(i.container_location || '').replace(/"/g, '""')}"`,
        i.created_at
      ];
      csvRows.push(row.join(','));
    });

    const csv = csvRows.join('\n');

    res.setHeader('Content-Type', 'text/csv');
    res.setHeader('Content-Disposition', 'attachment; filename="items.csv"');
    res.send(csv);
  } catch (error) {
    console.error('Export items CSV error:', error);
    res.status(500).json({ error: 'Export failed' });
  }
}

// Export everything (containers + items) to JSON
export async function exportAllJSON(req: Request, res: Response) {
  try {
    const containersResult = await pool.query(`
      SELECT * FROM containers
      ORDER BY created_at DESC
    `);

    const itemsResult = await pool.query(`
      SELECT 
        i.*,
        c.qr_code as container_qr_code
      FROM items i
      JOIN containers c ON i.container_id = c.id
      ORDER BY i.created_at DESC
    `);

    const exportData = {
      export_date: new Date().toISOString(),
      containers: containersResult.rows,
      items: itemsResult.rows,
      summary: {
        total_containers: containersResult.rows.length,
        total_items: itemsResult.rows.length
      }
    };

    res.setHeader('Content-Type', 'application/json');
    res.setHeader('Content-Disposition', 'attachment; filename="storage_labels_export.json"');
    res.json(exportData);
  } catch (error) {
    console.error('Export all error:', error);
    res.status(500).json({ error: 'Export failed' });
  }
}
