-- Migration: Add in_my_collection flag to separate personal collection from reference database
-- Browse tab will show: source = 'user' OR in_my_collection = 1
-- Database tab will show: all imported loads (reference data)

-- Add the flag column (default false for existing records)
ALTER TABLE loads ADD COLUMN in_my_collection INTEGER DEFAULT 0;

-- Create index for efficient filtering
CREATE INDEX IF NOT EXISTS idx_loads_in_my_collection ON loads(in_my_collection);

-- Mark all user-created loads as in collection by default
UPDATE loads SET in_my_collection = 1 WHERE source = 'user';
