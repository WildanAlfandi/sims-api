const express = require('express');
const router = express.Router();
const { getBanner, getServices } = require('../controllers/informationController');
const { authenticateToken } = require('../middleware/auth');

router.get('/banner', authenticateToken, getBanner);
router.get('/services', authenticateToken, getServices);

module.exports = router;