import db from '../config/database.js';

class Load {
    /**
     * Get all loads with optional filters and pagination
     */
    static getAll(filters = {}) {
        let query = 'SELECT * FROM loads WHERE 1=1';
        const params = [];

        // Exact match filters for dropdown selections
        if (filters.caliber) {
            query += ' AND caliber = ?';
            params.push(filters.caliber);
        }
        if (filters.bullet_manufacturer) {
            query += ' AND bullet_manufacturer = ?';
            params.push(filters.bullet_manufacturer);
        }
        if (filters.bullet_type) {
            query += ' AND bullet_type = ?';
            params.push(filters.bullet_type);
        }
        if (filters.bullet_weight_grains) {
            query += ' AND bullet_weight_grains = ?';
            params.push(parseFloat(filters.bullet_weight_grains));
        }
        if (filters.powder_manufacturer) {
            query += ' AND powder_manufacturer = ?';
            params.push(filters.powder_manufacturer);
        }
        if (filters.powder_type) {
            query += ' AND powder_type = ?';
            params.push(filters.powder_type);
        }
        if (filters.charge_weight_grains) {
            query += ' AND charge_weight_grains = ?';
            params.push(parseFloat(filters.charge_weight_grains));
        }
        if (filters.velocity_ms) {
            query += ' AND velocity_ms = ?';
            params.push(parseFloat(filters.velocity_ms));
        }
        if (filters.total_cartridge_length_mm) {
            query += ' AND total_cartridge_length_mm = ?';
            params.push(parseFloat(filters.total_cartridge_length_mm));
        }
        if (filters.source) {
            query += ' AND source = ?';
            params.push(filters.source);
        }

        // My Collection filter: show user loads OR loads marked as in_my_collection
        if (filters.my_collection) {
            query += " AND (source = 'user' OR in_my_collection = 1)";
        }

        // Range filters (kept for backward compatibility)
        if (filters.bullet_weight_min) {
            query += ' AND bullet_weight_grains >= ?';
            params.push(parseFloat(filters.bullet_weight_min));
        }
        if (filters.bullet_weight_max) {
            query += ' AND bullet_weight_grains <= ?';
            params.push(parseFloat(filters.bullet_weight_max));
        }

        // Full-text search
        if (filters.search) {
            query += ' AND search_text LIKE ?';
            params.push(`%${filters.search.toLowerCase()}%`);
        }

        // Sorting
        const sortField = filters.sort_field || 'created_at';
        const sortOrder = filters.sort_order || 'DESC';
        const allowedSortFields = [
            'created_at', 'caliber', 'bullet_manufacturer', 'bullet_type',
            'bullet_weight_grains', 'powder_manufacturer', 'powder_type',
            'charge_weight_grains', 'velocity_ms', 'total_cartridge_length_mm', 'source'
        ];
        const field = allowedSortFields.includes(sortField) ? sortField : 'created_at';
        const order = sortOrder.toUpperCase() === 'ASC' ? 'ASC' : 'DESC';

        query += ` ORDER BY ${field} ${order}`;

        // Pagination
        const page = parseInt(filters.page) || 1;
        const limit = parseInt(filters.limit) || 50;
        const offset = (page - 1) * limit;

        query += ' LIMIT ? OFFSET ?';
        params.push(limit, offset);

        const loads = db.prepare(query).all(...params);

        // Get total count for pagination
        let countQuery = 'SELECT COUNT(*) as total FROM loads WHERE 1=1';
        const countParams = params.slice(0, -2); // Remove LIMIT and OFFSET params

        // Match all filters from main query
        if (filters.caliber) countQuery += ' AND caliber = ?';
        if (filters.bullet_manufacturer) countQuery += ' AND bullet_manufacturer = ?';
        if (filters.bullet_type) countQuery += ' AND bullet_type = ?';
        if (filters.bullet_weight_grains) countQuery += ' AND bullet_weight_grains = ?';
        if (filters.powder_manufacturer) countQuery += ' AND powder_manufacturer = ?';
        if (filters.powder_type) countQuery += ' AND powder_type = ?';
        if (filters.charge_weight_grains) countQuery += ' AND charge_weight_grains = ?';
        if (filters.velocity_ms) countQuery += ' AND velocity_ms = ?';
        if (filters.total_cartridge_length_mm) countQuery += ' AND total_cartridge_length_mm = ?';
        if (filters.source) countQuery += ' AND source = ?';
        if (filters.my_collection) countQuery += " AND (source = 'user' OR in_my_collection = 1)";
        if (filters.bullet_weight_min) countQuery += ' AND bullet_weight_grains >= ?';
        if (filters.bullet_weight_max) countQuery += ' AND bullet_weight_grains <= ?';
        if (filters.search) countQuery += ' AND search_text LIKE ?';

        const { total } = db.prepare(countQuery).get(...countParams);

        return {
            loads,
            pagination: {
                page,
                limit,
                total,
                totalPages: Math.ceil(total / limit)
            }
        };
    }

    /**
     * Get a single load by ID
     */
    static getById(id) {
        return db.prepare('SELECT * FROM loads WHERE id = ?').get(id);
    }

    /**
     * Create a new load
     */
    static create(data) {
        const stmt = db.prepare(`
            INSERT INTO loads (
                test_weapon, caliber,
                bullet_manufacturer, bullet_type, bullet_weight_grains,
                bullet_weight_grams, bullet_diameter_inches, bullet_diameter_mm,
                powder_manufacturer, powder_type, charge_weight_grains,
                primer_manufacturer, primer_type,
                case_manufacturer, total_cartridge_length_mm, free_travel_mm,
                velocity_ms, group_size_mm, distance_meters,
                notes, source,
                loading_date, cartridges_loaded, group_photo_path, batch_number,
                tested_date, temperature_celsius, humidity_percent,
                barrel_length_inches, twist_rate
            ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        `);

        const result = stmt.run(
            data.test_weapon || null,
            data.caliber,
            data.bullet_manufacturer || null,
            data.bullet_type || null,
            data.bullet_weight_grains || null,
            data.bullet_weight_grams || null,
            data.bullet_diameter_inches || null,
            data.bullet_diameter_mm || null,
            data.powder_manufacturer || null,
            data.powder_type || null,
            data.charge_weight_grains || null,
            data.primer_manufacturer || null,
            data.primer_type || null,
            data.case_manufacturer || null,
            data.total_cartridge_length_mm || null,
            data.free_travel_mm || null,
            data.velocity_ms || null,
            data.group_size_mm || null,
            data.distance_meters || null,
            data.notes || null,
            data.source || 'user',
            data.loading_date || null,
            data.cartridges_loaded || null,
            data.group_photo_path || null,
            data.batch_number || null,
            data.tested_date || null,
            data.temperature_celsius || null,
            data.humidity_percent || null,
            data.barrel_length_inches || null,
            data.twist_rate || null
        );

        return this.getById(result.lastInsertRowid);
    }

    /**
     * Update an existing load
     */
    static update(id, data) {
        const stmt = db.prepare(`
            UPDATE loads SET
                test_weapon = ?,
                caliber = ?,
                bullet_manufacturer = ?,
                bullet_type = ?,
                bullet_weight_grains = ?,
                bullet_weight_grams = ?,
                bullet_diameter_inches = ?,
                bullet_diameter_mm = ?,
                powder_manufacturer = ?,
                powder_type = ?,
                charge_weight_grains = ?,
                primer_manufacturer = ?,
                primer_type = ?,
                case_manufacturer = ?,
                total_cartridge_length_mm = ?,
                free_travel_mm = ?,
                velocity_ms = ?,
                group_size_mm = ?,
                distance_meters = ?,
                notes = ?,
                loading_date = ?,
                cartridges_loaded = ?,
                group_photo_path = ?,
                batch_number = ?,
                tested_date = ?,
                temperature_celsius = ?,
                humidity_percent = ?,
                barrel_length_inches = ?,
                twist_rate = ?
            WHERE id = ?
        `);

        stmt.run(
            data.test_weapon || null,
            data.caliber,
            data.bullet_manufacturer || null,
            data.bullet_type || null,
            data.bullet_weight_grains || null,
            data.bullet_weight_grams || null,
            data.bullet_diameter_inches || null,
            data.bullet_diameter_mm || null,
            data.powder_manufacturer || null,
            data.powder_type || null,
            data.charge_weight_grains || null,
            data.primer_manufacturer || null,
            data.primer_type || null,
            data.case_manufacturer || null,
            data.total_cartridge_length_mm || null,
            data.free_travel_mm || null,
            data.velocity_ms || null,
            data.group_size_mm || null,
            data.distance_meters || null,
            data.notes || null,
            data.loading_date || null,
            data.cartridges_loaded || null,
            data.group_photo_path || null,
            data.batch_number || null,
            data.tested_date || null,
            data.temperature_celsius || null,
            data.humidity_percent || null,
            data.barrel_length_inches || null,
            data.twist_rate || null,
            id
        );

        return this.getById(id);
    }

    /**
     * Delete a load
     */
    static delete(id) {
        return db.prepare('DELETE FROM loads WHERE id = ?').run(id);
    }

    /**
     * Toggle in_my_collection status for a load
     */
    static toggleCollection(id) {
        const load = this.getById(id);
        if (!load) {
            throw new Error('Load not found');
        }
        const newValue = load.in_my_collection ? 0 : 1;
        db.prepare('UPDATE loads SET in_my_collection = ? WHERE id = ?').run(newValue, id);
        return this.getById(id);
    }

    /**
     * Add a load to my collection
     */
    static addToCollection(id) {
        db.prepare('UPDATE loads SET in_my_collection = 1 WHERE id = ?').run(id);
        return this.getById(id);
    }

    /**
     * Remove a load from my collection
     */
    static removeFromCollection(id) {
        db.prepare('UPDATE loads SET in_my_collection = 0 WHERE id = ?').run(id);
        return this.getById(id);
    }

    /**
     * Delete all imported loads (where source != 'user')
     * Preserves user-created loads
     */
    static deleteImportedLoads() {
        try {
            // Count what will be preserved
            const preservedResult = db.prepare(
                "SELECT COUNT(*) as count FROM loads WHERE source = 'user'"
            ).get();

            // Count what will be deleted
            const toDeleteResult = db.prepare(
                "SELECT COUNT(*) as count FROM loads WHERE source != 'user' OR source IS NULL"
            ).get();

            // Delete imported loads (preserve user loads)
            const deleteStmt = db.prepare(
                "DELETE FROM loads WHERE source != 'user' OR source IS NULL"
            );
            const result = deleteStmt.run();

            return {
                success: true,
                deletedCount: result.changes,
                preservedCount: preservedResult.count,
                expectedDeletes: toDeleteResult.count
            };
        } catch (error) {
            console.error('Error deleting imported loads:', error);
            throw new Error(`Failed to delete imported loads: ${error.message}`);
        }
    }

    /**
     * Get available filter options (for autocomplete/dropdowns)
     */
    static getFilterOptions() {
        const calibers = db.prepare('SELECT DISTINCT caliber FROM loads WHERE caliber IS NOT NULL ORDER BY caliber').all();
        const bulletManufacturers = db.prepare('SELECT DISTINCT bullet_manufacturer FROM loads WHERE bullet_manufacturer IS NOT NULL ORDER BY bullet_manufacturer').all();
        const powderTypes = db.prepare('SELECT DISTINCT powder_type FROM loads WHERE powder_type IS NOT NULL ORDER BY powder_type').all();

        return {
            calibers: calibers.map(r => r.caliber),
            bulletManufacturers: bulletManufacturers.map(r => r.bullet_manufacturer),
            powderTypes: powderTypes.map(r => r.powder_type)
        };
    }

    /**
     * Get preset calibers
     */
    static getCaliberPresets() {
        const presets = db.prepare('SELECT name FROM caliber_presets ORDER BY name').all();
        return presets.map(p => p.name);
    }

    /**
     * Get preset bullet brands
     */
    static getBulletBrandPresets() {
        const presets = db.prepare('SELECT name FROM bullet_brand_presets ORDER BY name').all();
        return presets.map(p => p.name);
    }

    /**
     * Get preset powder manufacturers
     */
    static getPowderManufacturerPresets() {
        const presets = db.prepare('SELECT name FROM powder_manufacturer_presets ORDER BY name').all();
        return presets.map(p => p.name);
    }

    /**
     * Get preset powder types for a specific manufacturer
     */
    static getPowderTypePresets(manufacturer) {
        if (!manufacturer) {
            // Return all powder types if no manufacturer specified
            const presets = db.prepare('SELECT DISTINCT name FROM powder_type_presets ORDER BY name').all();
            return presets.map(p => p.name);
        }
        const presets = db.prepare('SELECT name FROM powder_type_presets WHERE manufacturer = ? ORDER BY name').all(manufacturer);
        return presets.map(p => p.name);
    }

    /**
     * Get distinct values for a specific column (for filter dropdowns)
     */
    static getDistinctValues(column) {
        // List of allowed columns for security
        const allowedColumns = [
            'caliber', 'test_weapon',
            'bullet_manufacturer', 'bullet_type', 'bullet_weight_grains',
            'powder_manufacturer', 'powder_type', 'charge_weight_grains',
            'primer_manufacturer', 'primer_type',
            'case_manufacturer', 'total_cartridge_length_mm',
            'velocity_ms', 'group_size_mm', 'distance_meters',
            'source', 'batch_number',
            'bullet_weight_grams', 'bullet_diameter_inches', 'bullet_diameter_mm'
        ];

        if (!allowedColumns.includes(column)) {
            throw new Error(`Column "${column}" is not allowed for distinct values query`);
        }

        // Query distinct values, excluding NULL
        const query = `SELECT DISTINCT ${column} FROM loads WHERE ${column} IS NOT NULL ORDER BY ${column}`;
        const results = db.prepare(query).all();

        // Return array of distinct values
        return results.map(row => row[column]);
    }
}

export default Load;
