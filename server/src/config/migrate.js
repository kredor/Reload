import db from './database.js';
import fs from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

console.log('Running database migrations...');

try {
    // Read and execute migration file
    const migrationPath = join(__dirname, '../../database/migrations/001_initial_schema.sql');
    const migration = fs.readFileSync(migrationPath, 'utf8');

    db.exec(migration);
    console.log('✓ Schema created successfully');

    // Optionally seed with sample data
    const seedPath = join(__dirname, '../../database/seeds/sample_data.sql');
    if (fs.existsSync(seedPath)) {
        const seed = fs.readFileSync(seedPath, 'utf8');
        db.exec(seed);
        console.log('✓ Sample data inserted successfully');
    }

    console.log('Database setup complete!');

} catch (error) {
    console.error('Migration failed:', error);
    process.exit(1);
}

db.close();
