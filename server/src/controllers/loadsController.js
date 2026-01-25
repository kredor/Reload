import Load from '../models/Load.js';
import { deletePhoto } from '../config/upload.js';

export const getAllLoads = (req, res) => {
    try {
        const filters = {
            caliber: req.query.caliber,
            bullet_manufacturer: req.query.bullet_manufacturer,
            bullet_type: req.query.bullet_type,
            bullet_weight_grains: req.query.bullet_weight_grains,
            bullet_weight_min: req.query.bullet_weight_min,
            bullet_weight_max: req.query.bullet_weight_max,
            powder_manufacturer: req.query.powder_manufacturer,
            powder_type: req.query.powder_type,
            charge_weight_grains: req.query.charge_weight_grains,
            velocity_ms: req.query.velocity_ms,
            total_cartridge_length_mm: req.query.total_cartridge_length_mm,
            source: req.query.source,
            my_collection: req.query.my_collection === 'true',
            search: req.query.search,
            sort_field: req.query.sort_field,
            sort_order: req.query.sort_order,
            page: req.query.page,
            limit: req.query.limit
        };

        const result = Load.getAll(filters);
        res.json(result);
    } catch (error) {
        console.error('Error fetching loads:', error);
        res.status(500).json({ error: 'Failed to fetch loads' });
    }
};

export const getLoadById = (req, res) => {
    try {
        const load = Load.getById(req.params.id);

        if (!load) {
            return res.status(404).json({ error: 'Load not found' });
        }

        res.json(load);
    } catch (error) {
        console.error('Error fetching load:', error);
        res.status(500).json({ error: 'Failed to fetch load' });
    }
};

export const createLoad = (req, res) => {
    try {
        // Validate required field
        if (!req.body.caliber) {
            if (req.file) {
                deletePhoto(req.file.filename);
            }
            return res.status(400).json({ error: 'Caliber is required' });
        }

        // Add photo path if uploaded
        const loadData = {
            ...req.body,
            group_photo_path: req.file ? `/uploads/group-photos/${req.file.filename}` : null
        };

        const newLoad = Load.create(loadData);
        res.status(201).json(newLoad);
    } catch (error) {
        // Clean up uploaded file on error
        if (req.file) {
            deletePhoto(req.file.filename);
        }
        console.error('Error creating load:', error);
        res.status(500).json({ error: 'Failed to create load' });
    }
};

export const updateLoad = (req, res) => {
    try {
        const existing = Load.getById(req.params.id);

        if (!existing) {
            if (req.file) {
                deletePhoto(req.file.filename);
            }
            return res.status(404).json({ error: 'Load not found' });
        }

        // Validate required field
        if (!req.body.caliber) {
            if (req.file) {
                deletePhoto(req.file.filename);
            }
            return res.status(400).json({ error: 'Caliber is required' });
        }

        const loadData = { ...req.body };

        // Handle photo update
        if (req.file) {
            // Delete old photo if exists
            if (existing.group_photo_path) {
                deletePhoto(existing.group_photo_path);
            }
            loadData.group_photo_path = `/uploads/group-photos/${req.file.filename}`;
        } else if (req.body.deletePhoto === 'true') {
            // Explicit photo deletion
            if (existing.group_photo_path) {
                deletePhoto(existing.group_photo_path);
            }
            loadData.group_photo_path = null;
        } else {
            // Keep existing photo
            loadData.group_photo_path = existing.group_photo_path;
        }

        const updatedLoad = Load.update(req.params.id, loadData);
        res.json(updatedLoad);
    } catch (error) {
        // Clean up uploaded file on error
        if (req.file) {
            deletePhoto(req.file.filename);
        }
        console.error('Error updating load:', error);
        res.status(500).json({ error: 'Failed to update load' });
    }
};

export const deleteLoad = (req, res) => {
    try {
        const existing = Load.getById(req.params.id);

        if (!existing) {
            return res.status(404).json({ error: 'Load not found' });
        }

        // Delete associated photo
        if (existing.group_photo_path) {
            deletePhoto(existing.group_photo_path);
        }

        Load.delete(req.params.id);
        res.status(204).send();
    } catch (error) {
        console.error('Error deleting load:', error);
        res.status(500).json({ error: 'Failed to delete load' });
    }
};

export const getFilterOptions = (req, res) => {
    try {
        const options = Load.getFilterOptions();
        res.json(options);
    } catch (error) {
        console.error('Error fetching filter options:', error);
        res.status(500).json({ error: 'Failed to fetch filter options' });
    }
};

// Preset endpoints
export const getCaliberPresets = (req, res) => {
    try {
        const presets = Load.getCaliberPresets();
        res.json(presets);
    } catch (error) {
        console.error('Error fetching caliber presets:', error);
        res.status(500).json({ error: 'Failed to fetch caliber presets' });
    }
};

export const getBulletBrandPresets = (req, res) => {
    try {
        const presets = Load.getBulletBrandPresets();
        res.json(presets);
    } catch (error) {
        console.error('Error fetching bullet brand presets:', error);
        res.status(500).json({ error: 'Failed to fetch bullet brand presets' });
    }
};

export const getPowderManufacturerPresets = (req, res) => {
    try {
        const presets = Load.getPowderManufacturerPresets();
        res.json(presets);
    } catch (error) {
        console.error('Error fetching powder manufacturer presets:', error);
        res.status(500).json({ error: 'Failed to fetch powder manufacturer presets' });
    }
};

export const getPowderTypePresets = (req, res) => {
    try {
        const manufacturer = req.params.manufacturer || req.query.manufacturer;
        const presets = Load.getPowderTypePresets(manufacturer);
        res.json(presets);
    } catch (error) {
        console.error('Error fetching powder type presets:', error);
        res.status(500).json({ error: 'Failed to fetch powder type presets' });
    }
};

// Get distinct values for a column (for advanced filtering)
export const getDistinctValues = (req, res) => {
    try {
        const { column } = req.params;

        if (!column) {
            return res.status(400).json({ error: 'Column parameter is required' });
        }

        const values = Load.getDistinctValues(column);
        res.json(values);
    } catch (error) {
        console.error('Error fetching distinct values:', error);

        // Return more specific error for invalid column
        if (error.message.includes('not allowed')) {
            return res.status(400).json({ error: error.message });
        }

        res.status(500).json({ error: 'Failed to fetch distinct values' });
    }
};

// Toggle collection status for a load
export const toggleCollection = (req, res) => {
    try {
        const load = Load.toggleCollection(req.params.id);
        if (!load) {
            return res.status(404).json({ error: 'Load not found' });
        }
        res.json(load);
    } catch (error) {
        console.error('Error toggling collection status:', error);
        res.status(500).json({ error: 'Failed to toggle collection status' });
    }
};

// Add load to my collection
export const addToCollection = (req, res) => {
    try {
        const load = Load.addToCollection(req.params.id);
        if (!load) {
            return res.status(404).json({ error: 'Load not found' });
        }
        res.json(load);
    } catch (error) {
        console.error('Error adding to collection:', error);
        res.status(500).json({ error: 'Failed to add to collection' });
    }
};

// Remove load from my collection
export const removeFromCollection = (req, res) => {
    try {
        const load = Load.removeFromCollection(req.params.id);
        if (!load) {
            return res.status(404).json({ error: 'Load not found' });
        }
        res.json(load);
    } catch (error) {
        console.error('Error removing from collection:', error);
        res.status(500).json({ error: 'Failed to remove from collection' });
    }
};
