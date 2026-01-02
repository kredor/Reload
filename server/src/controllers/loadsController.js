import Load from '../models/Load.js';

export const getAllLoads = (req, res) => {
    try {
        const filters = {
            caliber: req.query.caliber,
            bullet_weight_min: req.query.bullet_weight_min,
            bullet_weight_max: req.query.bullet_weight_max,
            powder_type: req.query.powder_type,
            source: req.query.source,
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
            return res.status(400).json({ error: 'Caliber is required' });
        }

        const newLoad = Load.create(req.body);
        res.status(201).json(newLoad);
    } catch (error) {
        console.error('Error creating load:', error);
        res.status(500).json({ error: 'Failed to create load' });
    }
};

export const updateLoad = (req, res) => {
    try {
        const existing = Load.getById(req.params.id);

        if (!existing) {
            return res.status(404).json({ error: 'Load not found' });
        }

        // Validate required field
        if (!req.body.caliber) {
            return res.status(400).json({ error: 'Caliber is required' });
        }

        const updatedLoad = Load.update(req.params.id, req.body);
        res.json(updatedLoad);
    } catch (error) {
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
