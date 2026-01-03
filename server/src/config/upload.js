import multer from 'multer';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Upload directory path
const UPLOAD_DIR = process.env.UPLOAD_DIR || join(__dirname, '../../uploads/group-photos');

// Ensure upload directory exists
if (!fs.existsSync(UPLOAD_DIR)) {
    fs.mkdirSync(UPLOAD_DIR, { recursive: true });
}

// File storage configuration
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, UPLOAD_DIR);
    },
    filename: (req, file, cb) => {
        // Generate unique filename: timestamp-randomstring-original.ext
        const uniqueSuffix = Date.now() + '-' + Math.random().toString(36).substring(2, 15);
        const ext = path.extname(file.originalname).toLowerCase();
        const sanitizedName = path.basename(file.originalname, ext)
            .replace(/[^a-zA-Z0-9]/g, '-')
            .substring(0, 50);
        cb(null, `${uniqueSuffix}-${sanitizedName}${ext}`);
    }
});

// File filter for security
const fileFilter = (req, file, cb) => {
    const allowedMimes = ['image/jpeg', 'image/jpg', 'image/png'];
    const allowedExts = ['.jpg', '.jpeg', '.png'];

    const ext = path.extname(file.originalname).toLowerCase();
    const mimeValid = allowedMimes.includes(file.mimetype);
    const extValid = allowedExts.includes(ext);

    if (mimeValid && extValid) {
        cb(null, true);
    } else {
        cb(new Error('Invalid file type. Only JPG and PNG images are allowed.'), false);
    }
};

// Multer configuration
export const upload = multer({
    storage: storage,
    fileFilter: fileFilter,
    limits: {
        fileSize: 5 * 1024 * 1024, // 5MB max file size
        files: 1 // Only 1 file per upload
    }
});

// Helper function to delete old photo
export const deletePhoto = (photoPath) => {
    if (!photoPath) return;

    const fullPath = join(UPLOAD_DIR, path.basename(photoPath));
    if (fs.existsSync(fullPath)) {
        try {
            fs.unlinkSync(fullPath);
            console.log(`Deleted old photo: ${photoPath}`);
        } catch (error) {
            console.error(`Failed to delete photo ${photoPath}:`, error);
        }
    }
};

// Get upload directory for serving static files
export const getUploadDir = () => UPLOAD_DIR;

export default upload;
