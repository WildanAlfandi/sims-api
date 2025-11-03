const express = require('express');
const router = express.Router();
const { 
    getBalance, 
    topUp, 
    transaction, 
    getTransactionHistory 
} = require('../controllers/transactionController');
const { authenticateToken } = require('../middleware/auth');

router.get('/balance', authenticateToken, getBalance);
router.post('/topup', authenticateToken, topUp);
router.post('/transaction', authenticateToken, transaction);
router.get('/transaction/history', authenticateToken, getTransactionHistory);

module.exports = router;