import db from './database.js';
import fs from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

console.log('Running database migrations...');

try {
    const migrationsDir = join(__dirname, '../../database/migrations');

    // Get all migration files and sort them
    const migrationFiles = fs.readdirSync(migrationsDir)
        .filter(file => file.endsWith('.sql'))
        .sort();

    console.log(`Found ${migrationFiles.length} migration(s)\n`);

    // Run each migration
    migrationFiles.forEach(file => {
        const migrationPath = join(migrationsDir, file);
        const migration = fs.readFileSync(migrationPath, 'utf8');

        console.log(`Running: ${file}...`);
        db.exec(migration);
        console.log(`✓ ${file} completed\n`);
    });

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
