-- Migration: Remove velocity_sd and velocity_es columns
-- These fields are not commonly used

-- SQLite doesn't support DROP COLUMN directly, so we need to recreate the table
-- First, create a backup
CREATE TABLE loads_backup AS SELECT * FROM loads;

-- Drop the old table
DROP TABLE loads;

-- Recreate the table without velocity_sd and velocity_es
CREATE TABLE loads (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    test_weapon TEXT,
    caliber TEXT NOT NULL,
    bullet_manufacturer TEXT,
    bullet_type TEXT,
    bullet_weight_grains REAL,
    powder_manufacturer TEXT,
    powder_type TEXT,
    charge_weight_grains REAL,
    primer_manufacturer TEXT,
    primer_type TEXT,
    case_manufacturer TEXT,
    total_cartridge_length_mm REAL,
    free_travel_mm REAL,
    velocity_ms REAL,
    group_size_mm REAL,
    distance_meters INTEGER,
    notes TEXT,
    source TEXT DEFAULT 'user',
    is_imported INTEGER DEFAULT 0,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    search_text TEXT,
    loading_date DATE,
    cartridges_loaded INTEGER,
    group_photo_path TEXT,
    batch_number TEXT,
    tested_date DATE,
    temperature_celsius REAL,
    humidity_percent INTEGER,
    barrel_length_inches REAL,
    twist_rate TEXT
);

-- Copy data back (excluding velocity_sd and velocity_es)
INSERT INTO loads (
    id, test_weapon, caliber, bullet_manufacturer, bullet_type,
    bullet_weight_grains, powder_manufacturer, powder_type,
    charge_weight_grains, primer_manufacturer, primer_type,
    case_manufacturer, total_cartridge_length_mm, free_travel_mm,
    velocity_ms, group_size_mm, distance_meters, notes, source,
    is_imported, created_at, updated_at, search_text,
    loading_date, cartridges_loaded, group_photo_path, batch_number,
    tested_date, temperature_celsius, humidity_percent,
    barrel_length_inches, twist_rate
)
SELECT
    id, test_weapon, caliber, bullet_manufacturer, bullet_type,
    bullet_weight_grains, powder_manufacturer, powder_type,
    charge_weight_grains, primer_manufacturer, primer_type,
    case_manufacturer, total_cartridge_length_mm, free_travel_mm,
    velocity_ms, group_size_mm, distance_meters, notes, source,
    is_imported, created_at, updated_at, search_text,
    loading_date, cartridges_loaded, group_photo_path, batch_number,
    tested_date, temperature_celsius, humidity_percent,
    barrel_length_inches, twist_rate
FROM loads_backup;

-- Drop the backup table
DROP TABLE loads_backup;

-- Recreate the search trigger
DROP TRIGGER IF EXISTS loads_search_update;
CREATE TRIGGER loads_search_update AFTER INSERT ON loads
BEGIN
    UPDATE loads SET search_text =
        COALESCE(NEW.caliber, '') || ' ' ||
        COALESCE(NEW.bullet_manufacturer, '') || ' ' ||
        COALESCE(NEW.bullet_type, '') || ' ' ||
        COALESCE(NEW.powder_manufacturer, '') || ' ' ||
        COALESCE(NEW.powder_type, '') || ' ' ||
        COALESCE(NEW.primer_manufacturer, '') || ' ' ||
        COALESCE(NEW.test_weapon, '') || ' ' ||
        COALESCE(NEW.notes, '')
    WHERE id = NEW.id;
END;

DROP TRIGGER IF EXISTS loads_search_update_on_update;
CREATE TRIGGER loads_search_update_on_update AFTER UPDATE ON loads
BEGIN
    UPDATE loads SET search_text =
        COALESCE(NEW.caliber, '') || ' ' ||
        COALESCE(NEW.bullet_manufacturer, '') || ' ' ||
        COALESCE(NEW.bullet_type, '') || ' ' ||
        COALESCE(NEW.powder_manufacturer, '') || ' ' ||
        COALESCE(NEW.powder_type, '') || ' ' ||
        COALESCE(NEW.primer_manufacturer, '') || ' ' ||
        COALESCE(NEW.test_weapon, '') || ' ' ||
        COALESCE(NEW.notes, '')
    WHERE id = NEW.id;
END;
