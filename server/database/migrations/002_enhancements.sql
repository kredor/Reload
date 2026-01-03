-- Migration 002: Add enhancements for better UX and tracking

-- Add new columns to loads table
ALTER TABLE loads ADD COLUMN loading_date DATE;
ALTER TABLE loads ADD COLUMN cartridges_loaded INTEGER;
ALTER TABLE loads ADD COLUMN group_photo_path TEXT;
ALTER TABLE loads ADD COLUMN batch_number TEXT;

-- Optional enhancement fields
ALTER TABLE loads ADD COLUMN tested_date DATE;
ALTER TABLE loads ADD COLUMN temperature_celsius REAL;
ALTER TABLE loads ADD COLUMN humidity_percent INTEGER;
ALTER TABLE loads ADD COLUMN barrel_length_inches REAL;
ALTER TABLE loads ADD COLUMN twist_rate TEXT;
ALTER TABLE loads ADD COLUMN velocity_sd REAL;  -- Standard deviation
ALTER TABLE loads ADD COLUMN velocity_es REAL;  -- Extreme spread

-- Create table for predefined calibers (for autocomplete)
CREATE TABLE IF NOT EXISTS caliber_presets (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT UNIQUE NOT NULL
);

-- Create table for predefined bullet brands
CREATE TABLE IF NOT EXISTS bullet_brand_presets (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT UNIQUE NOT NULL
);

-- Create table for predefined powder manufacturers
CREATE TABLE IF NOT EXISTS powder_manufacturer_presets (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT UNIQUE NOT NULL
);

-- Create table for predefined powder types
CREATE TABLE IF NOT EXISTS powder_type_presets (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    manufacturer TEXT NOT NULL,
    name TEXT NOT NULL,
    UNIQUE(manufacturer, name)
);

-- Insert predefined calibers
INSERT OR IGNORE INTO caliber_presets (name) VALUES
('.22 Hornet'),
('.22 K-Hornet'),
('.222 Rem'),
('6.5x55'),
('7x57 R'),
('8x57 JS'),
('8x57 JRS'),
('8x64 S');

-- Insert predefined bullet brands
INSERT OR IGNORE INTO bullet_brand_presets (name) VALUES
('Hornady'),
('Nosler'),
('S&B'),
('Norma'),
('Sako'),
('RWS');

-- Insert predefined powder manufacturers
INSERT OR IGNORE INTO powder_manufacturer_presets (name) VALUES
('Norma'),
('Vihtavuori'),
('Hodgdon');

-- Insert predefined powder types
INSERT OR IGNORE INTO powder_type_presets (manufacturer, name) VALUES
('Norma', '202'),
('Norma', '204'),
('Norma', 'MRP'),
('Vihtavuori', 'N150'),
('Vihtavuori', 'N110'),
('Hodgdon', 'Lil''Gun');

-- Create index for photo queries
CREATE INDEX IF NOT EXISTS idx_loads_has_photo ON loads(group_photo_path) WHERE group_photo_path IS NOT NULL;
