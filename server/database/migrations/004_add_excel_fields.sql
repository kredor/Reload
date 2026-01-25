-- Migration: Add Excel-specific fields for imported database
-- These fields are present in the Excel database but not in user-created loads

-- Add bullet weight in grams (Excel has both grains and grams)
ALTER TABLE loads ADD COLUMN bullet_weight_grams REAL;

-- Add bullet diameter measurements (Excel-specific metrics)
ALTER TABLE loads ADD COLUMN bullet_diameter_inches REAL;
ALTER TABLE loads ADD COLUMN bullet_diameter_mm REAL;

-- Add index on source column for efficient filtering between user loads and imported database
CREATE INDEX IF NOT EXISTS idx_loads_source ON loads(source);

-- Add indexes on commonly filtered columns for performance
CREATE INDEX IF NOT EXISTS idx_loads_caliber ON loads(caliber);
CREATE INDEX IF NOT EXISTS idx_loads_bullet_weight ON loads(bullet_weight_grains);
CREATE INDEX IF NOT EXISTS idx_loads_velocity ON loads(velocity_ms);
