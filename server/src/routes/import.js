import express from 'express';
import multer from 'multer';
import path from 'path';
import { fileURLToPath } from 'url';
import {
    uploadAndImportExcel,
    previewExcel,
    getImportStatus,
    replaceImportedLoads
} from '../controllers/importController.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const router = express.Router();

// Configure multer for file uploads
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        // Use temporary directory for uploads
        const uploadDir = path.join(__dirname, '../../uploads/temp');
        cb(null, uploadDir);
    },
    filename: (req, file, cb) => {
        // Generate unique filename
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        cb(null, `import-${uniqueSuffix}${path.extname(file.originalname)}`);
    }
});

const fileFilter = (req, file, cb) => {
    // Accept Excel files only
    const allowedExtensions = ['.xlsx', '.xls'];
    const ext = path.extname(file.originalname).toLowerCase();

    if (allowedExtensions.includes(ext)) {
        cb(null, true);
    } else {
        cb(new Error('Only Excel files (.xlsx, .xls) are allowed'), false);
    }
};

const upload = multer({
    storage,
    fileFilter,
    limits: {
        fileSize: 10 * 1024 * 1024 // 10MB max file size
    }
});

// Routes
router.post('/excel', upload.single('file'), uploadAndImportExcel);
router.post('/preview', upload.single('file'), previewExcel);
router.post('/replace', upload.single('file'), replaceImportedLoads);
router.get('/status', getImportStatus);

export default router;
