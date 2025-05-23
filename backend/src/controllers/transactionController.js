const Transaction = require('../models/Transaction');

// @desc Get all transactions
// @route GET /api/transactions/get
// @access Private
const getTransactions = async (req, res) => {
    try {
        const transactions = await Transaction.find({ userId: req.user.id }).sort({ date: -1 });
        res.json(transactions);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc Add a transaction
// @route POST /api/transactions/add
// @access Private
const addTransaction = async (req, res) => {
    const { amount, category, description, date } = req.body;

    try {
        const newTransaction = new Transaction({ userId: req.user.id, amount, category, description, date });
        await newTransaction.save();
        res.status(201).json(newTransaction);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = {
    getTransactions,
    addTransaction
};
