const express = require('express');
const router = express.Router();
const { addBudget, getBudgets } = require('../controllers/budgetController');
const { protect } = require('../middleware/auth');

// Protected routes (need to be logged in)
router.post('/add', protect, addBudget);
router.get('/get', protect, getBudgets);

module.exports = router; 