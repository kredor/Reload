import XLSX from 'xlsx';
import Load from '../models/Load.js';

/**
 * Excel Import Service
 * Handles importing loads from Excel file with Swedish column headers
 */

/**
 * Parse Excel file and return array of row objects
 * @param {string} filePath - Path to Excel file
 * @returns {Array} Array of row objects with Swedish column headers
 */
export function parseExcelFile(filePath) {
    try {
        const workbook = XLSX.readFile(filePath);
        const sheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[sheetName];

        // Convert to JSON with header row
        const data = XLSX.utils.sheet_to_json(worksheet);

        return data;
    } catch (error) {
        throw new Error(`Failed to parse Excel file: ${error.message}`);
    }
}

/**
 * Map Excel row (Swedish headers) to database schema
 * Excel columns (updated structure with separate columns):
 *   - Kaliber → caliber
 *   - Kultillverkare → bullet_manufacturer
 *   - Kultyp → bullet_type
 *   - Kulvikt (grains) → bullet_weight_grains
 *   - Kulvikt (gram) → bullet_weight_grams
 *   - Kuldiameter (tum) → bullet_diameter_inches
 *   - Kuldiameter (mm) → bullet_diameter_mm
 *   - Patronlängd (mm) → total_cartridge_length_mm
 *   - Kruttillverkare → powder_manufacturer
 *   - Kruttsort → powder_type
 *   - Laddvikt (grains) → charge_weight_grains
 *   - Hastighet (m/s) → velocity_ms
 *   - Källa → source
 *
 * @param {Object} excelRow - Row from Excel with Swedish column headers
 * @returns {Object} Mapped object matching database schema
 */
export function mapExcelToSchema(excelRow) {
    // Helper function to safely parse numbers
    const parseNumber = (value) => {
        if (value === null || value === undefined || value === '') return null;
        const num = parseFloat(value);
        return isNaN(num) ? null : num;
    };

    // Helper to get string value or null
    const getString = (value) => {
        if (value === null || value === undefined || value === '') return null;
        return String(value).trim();
    };

    return {
        // Direct mappings - all columns are now separate
        caliber: getString(excelRow['Kaliber']),
        bullet_manufacturer: getString(excelRow['Kultillverkare']),
        bullet_type: getString(excelRow['Kultyp']),
        bullet_weight_grains: parseNumber(excelRow['Kulvikt (grains)']),
        bullet_weight_grams: parseNumber(excelRow['Kulvikt (gram)']),
        bullet_diameter_inches: parseNumber(excelRow['Kuldiameter (tum)']),
        bullet_diameter_mm: parseNumber(excelRow['Kuldiameter (mm)']),
        total_cartridge_length_mm: parseNumber(excelRow['Patronlängd (mm)']),
        powder_manufacturer: getString(excelRow['Kruttillverkare']),
        powder_type: getString(excelRow['Kruttsort']),
        charge_weight_grains: parseNumber(excelRow['Laddvikt (grains)']),
        velocity_ms: parseNumber(excelRow['Hastighet (m/s)']),
        source: getString(excelRow['Källa']) || 'imported',

        // Fields not in Excel (will be NULL)
        test_weapon: null,
        primer_manufacturer: null,
        primer_type: null,
        case_manufacturer: null,
        free_travel_mm: null,
        group_size_mm: null,
        distance_meters: null,
        notes: null,
        loading_date: null,
        cartridges_loaded: null,
        group_photo_path: null,
        batch_number: null,
        tested_date: null,
        temperature_celsius: null,
        humidity_percent: null,
        barrel_length_inches: null,
        twist_rate: null
    };
}

/**
 * Import loads from Excel file into database
 * @param {string} filePath - Path to Excel file
 * @param {string} defaultSource - Default source value if not in Excel
 * @returns {Object} { success, imported, skipped, errors }
 */
export async function importLoads(filePath, defaultSource = 'imported') {
    const results = {
        success: false,
        imported: 0,
        skipped: 0,
        errors: []
    };

    try {
        // Parse Excel file
        const excelData = parseExcelFile(filePath);

        console.log(`Found ${excelData.length} rows in Excel file`);

        // Process each row
        for (let i = 0; i < excelData.length; i++) {
            try {
                const excelRow = excelData[i];

                // Skip rows without caliber (required field)
                if (!excelRow['Kaliber']) {
                    results.skipped++;
                    continue;
                }

                // Map to database schema
                const loadData = mapExcelToSchema(excelRow);

                // Use default source if not provided in Excel
                if (!loadData.source) {
                    loadData.source = defaultSource;
                }

                // Insert into database
                Load.create(loadData);
                results.imported++;

            } catch (error) {
                results.errors.push({
                    row: i + 2, // +2 because Excel rows are 1-indexed and we have header
                    error: error.message
                });
            }
        }

        results.success = true;
        console.log(`Import complete: ${results.imported} imported, ${results.skipped} skipped, ${results.errors.length} errors`);

    } catch (error) {
        results.errors.push({
            row: 'general',
            error: error.message
        });
    }

    return results;
}

/**
 * Preview first N rows from Excel file
 * @param {string} filePath - Path to Excel file
 * @param {number} limit - Number of rows to preview
 * @returns {Array} Array of mapped load objects
 */
export function previewExcelData(filePath, limit = 10) {
    try {
        const excelData = parseExcelFile(filePath);
        const preview = excelData.slice(0, limit).map(mapExcelToSchema);

        return {
            total: excelData.length,
            preview
        };
    } catch (error) {
        throw new Error(`Failed to preview Excel data: ${error.message}`);
    }
}

export default {
    parseExcelFile,
    mapExcelToSchema,
    importLoads,
    previewExcelData
};
