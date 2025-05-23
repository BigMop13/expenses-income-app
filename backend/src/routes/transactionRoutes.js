const express = require('express');
const router = express.Router();
const { getTransactions, addTransaction } = require('../controllers/transactionController');
const { protect } = require('../middleware/auth');

// Protected routes (need to be logged in)
router.get('/get', protect, getTransactions);
router.post('/add', protect, addTransaction);

module.exports = router;
