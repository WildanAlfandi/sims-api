const multer = require('multer');
const path = require('path');
const { errorResponse } = require('../utils/response');

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads/');
    },
    filename: (req, file, cb) => {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        cb(null, 'profile-' + uniqueSuffix + path.extname(file.originalname));
    }
});

const fileFilter = (req, file, cb) => {
    const allowedTypes = /jpeg|jpg|png/;
    const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = allowedTypes.test(file.mimetype);

    if (mimetype && extname) {
        return cb(null, true);
    } else {
        cb(new Error('Format Image tidak sesuai'));
    }
};

const upload = multer({
    storage: storage,
    limits: {
        fileSize: parseInt(process.env.MAX_FILE_SIZE) || 102400 // 100KB default
    },
    fileFilter: fileFilter
});

const uploadMiddleware = (req, res, next) => {
    upload.single('file')(req, res, (err) => {
        if (err instanceof multer.MulterError) {
            if (err.code === 'LIMIT_FILE_SIZE') {
                return errorResponse(res, 'Ukuran file maksimal 100KB', 400);
            }
            return errorResponse(res, err.message, 400);
        } else if (err) {
            return errorResponse(res, err.message, 400);
        }
        next();
    });
};

module.exports = { uploadMiddleware };