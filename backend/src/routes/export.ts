import { Router } from 'express';
import {
  exportContainersJSON,
  exportContainersCSV,
  exportItemsJSON,
  exportItemsCSV,
  exportAllJSON
} from '../controllers/exportController';

const router = Router();

// Export containers
router.get('/containers.json', exportContainersJSON);
router.get('/containers.csv', exportContainersCSV);

// Export items
router.get('/items.json', exportItemsJSON);
router.get('/items.csv', exportItemsCSV);

// Export everything
router.get('/all.json', exportAllJSON);

export default router;
