import { importLoads, previewExcelData } from '../services/excelImportService.js';
import Load from '../models/Load.js';
import fs from 'fs';
import path from 'path';

/**
 * Import Controller
 * Handles Excel file uploads and imports
 */

/**
 * POST /api/import/excel
 * Upload and import Excel file
 */
export const uploadAndImportExcel = async (req, res) => {
    try {
        // Check if file was uploaded
        if (!req.file) {
            return res.status(400).json({ error: 'No file uploaded' });
        }

        const filePath = req.file.path;
        console.log(`Processing Excel import from: ${filePath}`);

        // Import loads from Excel
        const results = await importLoads(filePath, 'imported');

        // Clean up uploaded file
        try {
            fs.unlinkSync(filePath);
        } catch (cleanupError) {
            console.error('Failed to clean up uploaded file:', cleanupError);
        }

        if (!results.success) {
            return res.status(500).json({
                error: 'Import failed',
                details: results.errors
            });
        }

        // Return import results
        res.json({
            success: true,
            message: `Successfully imported ${results.imported} loads`,
            imported: results.imported,
            skipped: results.skipped,
            errors: results.errors
        });

    } catch (error) {
        console.error('Excel import error:', error);

        // Clean up file if it exists
        if (req.file?.path) {
            try {
                fs.unlinkSync(req.file.path);
            } catch (cleanupError) {
                // Ignore cleanup errors
            }
        }

        res.status(500).json({
            error: 'Failed to import Excel file',
            details: error.message
        });
    }
};

/**
 * POST /api/import/preview
 * Preview first 10 rows of Excel file before importing
 */
export const previewExcel = async (req, res) => {
    try {
        // Check if file was uploaded
        if (!req.file) {
            return res.status(400).json({ error: 'No file uploaded' });
        }

        const filePath = req.file.path;
        const limit = parseInt(req.query.limit) || 10;

        console.log(`Previewing Excel file: ${filePath}`);

        // Get preview data
        const previewData = previewExcelData(filePath, limit);

        // Clean up uploaded file
        try {
            fs.unlinkSync(filePath);
        } catch (cleanupError) {
            console.error('Failed to clean up uploaded file:', cleanupError);
        }

        res.json({
            success: true,
            total: previewData.total,
            preview: previewData.preview,
            message: `Preview of ${previewData.preview.length} rows from ${previewData.total} total`
        });

    } catch (error) {
        console.error('Excel preview error:', error);

        // Clean up file if it exists
        if (req.file?.path) {
            try {
                fs.unlinkSync(req.file.path);
            } catch (cleanupError) {
                // Ignore cleanup errors
            }
        }

        res.status(500).json({
            error: 'Failed to preview Excel file',
            details: error.message
        });
    }
};

/**
 * GET /api/import/status
 * Check if database has imported loads
 */
export const getImportStatus = async (req, res) => {
    try {
        // Count imported loads (source = 'imported' or source = 'Ladeboken' or similar)
        const result = Load.getAll({
            source: 'imported',
            limit: 1,
            page: 1
        });

        const hasImportedLoads = result.pagination.total > 0;

        res.json({
            hasImportedLoads,
            importedCount: result.pagination.total,
            message: hasImportedLoads
                ? `Database contains ${result.pagination.total} imported loads`
                : 'No imported loads found'
        });

    } catch (error) {
        console.error('Import status error:', error);
        res.status(500).json({
            error: 'Failed to check import status',
            details: error.message
        });
    }
};

/**
 * POST /api/import/replace
 * Replace all imported loads with new Excel file
 * Preserves user-created loads (source = 'user')
 */
export const replaceImportedLoads = async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ error: 'No file uploaded' });
        }

        const filePath = req.file.path;
        console.log(`Processing replace operation from: ${filePath}`);

        // Step 1: Get counts before operation
        const beforeStats = Load.getAll({ limit: 1 });
        const totalBefore = beforeStats.pagination.total;

        // Step 2: Delete imported loads
        const deleteResult = Load.deleteImportedLoads();

        console.log(`Deleted ${deleteResult.deletedCount} imported loads, preserved ${deleteResult.preservedCount} user loads`);

        // Verify deletion
        if (deleteResult.deletedCount !== deleteResult.expectedDeletes) {
            throw new Error(
                `Delete count mismatch: expected ${deleteResult.expectedDeletes}, got ${deleteResult.deletedCount}`
            );
        }

        // Step 3: Import new loads
        const importResult = await importLoads(filePath, 'imported');

        // Clean up uploaded file
        try {
            fs.unlinkSync(filePath);
        } catch (cleanupError) {
            console.error('Failed to clean up uploaded file:', cleanupError);
        }

        if (!importResult.success) {
            return res.status(500).json({
                error: 'Import failed after delete',
                warning: 'Old imported loads have been deleted but new import failed',
                deleteResult,
                importErrors: importResult.errors
            });
        }

        // Step 4: Get final counts
        const afterStats = Load.getAll({ limit: 1 });
        const totalAfter = afterStats.pagination.total;

        console.log(`After: ${totalAfter} total loads`);

        res.json({
            success: true,
            message: 'Successfully replaced imported data',
            operation: {
                deleted: deleteResult.deletedCount,
                preserved: deleteResult.preservedCount,
                imported: importResult.imported,
                skipped: importResult.skipped,
                errors: importResult.errors
            },
            counts: {
                before: totalBefore,
                after: totalAfter,
                userLoads: deleteResult.preservedCount
            }
        });

    } catch (error) {
        console.error('Replace operation error:', error);

        if (req.file?.path) {
            try {
                fs.unlinkSync(req.file.path);
            } catch (cleanupError) {
                // Ignore
            }
        }

        res.status(500).json({
            error: 'Failed to replace imported loads',
            details: error.message
        });
    }
};

export default {
    uploadAndImportExcel,
    previewExcel,
    getImportStatus,
    replaceImportedLoads
};
