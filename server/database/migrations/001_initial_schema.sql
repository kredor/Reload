-- Main reloading loads table
CREATE TABLE IF NOT EXISTS loads (
    id INTEGER PRIMARY KEY AUTOINCREMENT,

    -- Weapon & Caliber
    test_weapon TEXT,
    caliber TEXT NOT NULL,

    -- Bullet
    bullet_manufacturer TEXT,
    bullet_type TEXT,
    bullet_weight_grains REAL,

    -- Powder
    powder_manufacturer TEXT,
    powder_type TEXT,
    charge_weight_grains REAL,

    -- Primer
    primer_manufacturer TEXT,
    primer_type TEXT,

    -- Cartridge
    case_manufacturer TEXT,
    total_cartridge_length_mm REAL,
    free_travel_mm REAL,

    -- Performance
    velocity_ms REAL,
    group_size_mm REAL,
    distance_meters INTEGER,
    notes TEXT,

    -- Metadata
    source TEXT DEFAULT 'user',
    is_imported BOOLEAN DEFAULT 0,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,

    -- Search optimization
    search_text TEXT
);

-- Indexes for common queries
CREATE INDEX IF NOT EXISTS idx_loads_caliber ON loads(caliber);
CREATE INDEX IF NOT EXISTS idx_loads_bullet_weight ON loads(bullet_weight_grains);
CREATE INDEX IF NOT EXISTS idx_loads_powder_type ON loads(powder_type);
CREATE INDEX IF NOT EXISTS idx_loads_source ON loads(source);
CREATE INDEX IF NOT EXISTS idx_loads_search ON loads(search_text);
CREATE INDEX IF NOT EXISTS idx_loads_created_at ON loads(created_at);

-- Trigger to update search_text automatically on INSERT
CREATE TRIGGER IF NOT EXISTS update_search_text_insert
AFTER INSERT ON loads
BEGIN
    UPDATE loads SET search_text =
        LOWER(COALESCE(NEW.caliber, '') || ' ' ||
              COALESCE(NEW.bullet_manufacturer, '') || ' ' ||
              COALESCE(NEW.bullet_type, '') || ' ' ||
              COALESCE(NEW.powder_manufacturer, '') || ' ' ||
              COALESCE(NEW.powder_type, '') || ' ' ||
              COALESCE(NEW.primer_manufacturer, '') || ' ' ||
              COALESCE(NEW.test_weapon, '') || ' ' ||
              COALESCE(NEW.notes, ''))
    WHERE id = NEW.id;
END;

-- Trigger to update search_text and updated_at on UPDATE
CREATE TRIGGER IF NOT EXISTS update_search_text_update
AFTER UPDATE ON loads
BEGIN
    UPDATE loads SET
        search_text =
            LOWER(COALESCE(NEW.caliber, '') || ' ' ||
                  COALESCE(NEW.bullet_manufacturer, '') || ' ' ||
                  COALESCE(NEW.bullet_type, '') || ' ' ||
                  COALESCE(NEW.powder_manufacturer, '') || ' ' ||
                  COALESCE(NEW.powder_type, '') || ' ' ||
                  COALESCE(NEW.primer_manufacturer, '') || ' ' ||
                  COALESCE(NEW.test_weapon, '') || ' ' ||
                  COALESCE(NEW.notes, '')),
        updated_at = CURRENT_TIMESTAMP
    WHERE id = NEW.id;
END;
