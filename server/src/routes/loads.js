import express from 'express';
import {
    getAllLoads,
    getLoadById,
    createLoad,
    updateLoad,
    deleteLoad,
    getFilterOptions,
    getCaliberPresets,
    getBulletBrandPresets,
    getPowderManufacturerPresets,
    getPowderTypePresets,
    getDistinctValues,
    toggleCollection,
    addToCollection,
    removeFromCollection
} from '../controllers/loadsController.js';
import { upload } from '../config/upload.js';

const router = express.Router();

// Get all loads (with filters and pagination)
router.get('/', getAllLoads);

// Get filter options for autocomplete
router.get('/filters', getFilterOptions);

// Preset endpoints
router.get('/presets/calibers', getCaliberPresets);
router.get('/presets/bullet-brands', getBulletBrandPresets);
router.get('/presets/powder-manufacturers', getPowderManufacturerPresets);
router.get('/presets/powder-types', getPowderTypePresets);

// Get distinct values for column (for advanced filtering)
router.get('/distinct/:column', getDistinctValues);

// Collection management (must be before /:id to avoid conflicts)
router.post('/:id/collection/toggle', toggleCollection);
router.post('/:id/collection/add', addToCollection);
router.post('/:id/collection/remove', removeFromCollection);

// Get single load by ID
router.get('/:id', getLoadById);

// Create new load (with optional photo upload)
router.post('/', upload.single('groupPhoto'), createLoad);

// Update existing load (with optional photo upload)
router.put('/:id', upload.single('groupPhoto'), updateLoad);

// Delete load
router.delete('/:id', deleteLoad);

export default router;
