import express from 'express';
import {
    getAllLoads,
    getLoadById,
    createLoad,
    updateLoad,
    deleteLoad,
    getFilterOptions
} from '../controllers/loadsController.js';

const router = express.Router();

// Get all loads (with filters and pagination)
router.get('/', getAllLoads);

// Get filter options for autocomplete
router.get('/filters', getFilterOptions);

// Get single load by ID
router.get('/:id', getLoadById);

// Create new load
router.post('/', createLoad);

// Update existing load
router.put('/:id', updateLoad);

// Delete load
router.delete('/:id', deleteLoad);

export default router;
