const express = require('express');
const router = express.Router();
const { getProfile, updateProfile, updateProfileImage } = require('../controllers/profileController');
const { authenticateToken } = require('../middleware/auth');
const { uploadMiddleware } = require('../middleware/upload');

router.get('/profile', authenticateToken, getProfile);
router.put('/profile/update', authenticateToken, updateProfile);
router.put('/profile/image', authenticateToken, uploadMiddleware, updateProfileImage);

module.exports = router;