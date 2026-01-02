import db from '../config/database.js';

class Load {
    /**
     * Get all loads with optional filters and pagination
     */
    static getAll(filters = {}) {
        let query = 'SELECT * FROM loads WHERE 1=1';
        const params = [];

        // Filter by caliber
        if (filters.caliber) {
            query += ' AND caliber = ?';
            params.push(filters.caliber);
        }

        // Filter by bullet weight range
        if (filters.bullet_weight_min) {
            query += ' AND bullet_weight_grains >= ?';
            params.push(parseFloat(filters.bullet_weight_min));
        }
        if (filters.bullet_weight_max) {
            query += ' AND bullet_weight_grains <= ?';
            params.push(parseFloat(filters.bullet_weight_max));
        }

        // Filter by powder type
        if (filters.powder_type) {
            query += ' AND powder_type = ?';
            params.push(filters.powder_type);
        }

        // Filter by source
        if (filters.source) {
            query += ' AND source = ?';
            params.push(filters.source);
        }

        // Full-text search
        if (filters.search) {
            query += ' AND search_text LIKE ?';
            params.push(`%${filters.search.toLowerCase()}%`);
        }

        // Sorting
        const sortField = filters.sort_field || 'created_at';
        const sortOrder = filters.sort_order || 'DESC';
        const allowedSortFields = ['created_at', 'caliber', 'bullet_weight_grains', 'velocity_ms'];
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

        if (filters.caliber) countQuery += ' AND caliber = ?';
        if (filters.bullet_weight_min) countQuery += ' AND bullet_weight_grains >= ?';
        if (filters.bullet_weight_max) countQuery += ' AND bullet_weight_grains <= ?';
        if (filters.powder_type) countQuery += ' AND powder_type = ?';
        if (filters.source) countQuery += ' AND source = ?';
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
                powder_manufacturer, powder_type, charge_weight_grains,
                primer_manufacturer, primer_type,
                case_manufacturer, total_cartridge_length_mm, free_travel_mm,
                velocity_ms, group_size_mm, distance_meters,
                notes, source
            ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        `);

        const result = stmt.run(
            data.test_weapon || null,
            data.caliber,
            data.bullet_manufacturer || null,
            data.bullet_type || null,
            data.bullet_weight_grains || null,
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
            data.source || 'user'
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
                notes = ?
            WHERE id = ?
        `);

        stmt.run(
            data.test_weapon || null,
            data.caliber,
            data.bullet_manufacturer || null,
            data.bullet_type || null,
            data.bullet_weight_grains || null,
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
}

export default Load;
