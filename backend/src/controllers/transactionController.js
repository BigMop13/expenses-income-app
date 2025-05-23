const Transaction = require('../models/Transaction');
const mongoose = require('mongoose');

// @desc Get all transactions
// @route GET /api/transactions/get
// @access Private
const getTransactions = async (req, res) => {
    try {
        const transactions = await Transaction.find({ userId: req.user.id })
            .sort({ date: -1 }); // Sort by date descending (newest first)
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
        const newTransaction = new Transaction({ 
            userId: req.user.id, 
            amount: Number(amount), // Ensure amount is a number
            category, 
            description, 
            date: new Date(date)
        });
        await newTransaction.save();
        res.status(201).json(newTransaction);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc Get dashboard statistics
// @route GET /api/transactions/stats
// @access Private
const getDashboardStats = async (req, res) => {
    try {
        const currentDate = new Date();
        const firstDayOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1);
        const lastDayOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0, 23, 59, 59);

        console.log('Getting stats for user:', req.user.id);
        console.log('Date range:', { firstDayOfMonth, lastDayOfMonth });

        // Get category breakdown with separate income and expense totals
        const categoryBreakdown = await Transaction.aggregate([
            {
                $match: {
                    userId: new mongoose.Types.ObjectId(req.user.id),
                    date: {
                        $gte: firstDayOfMonth,
                        $lte: lastDayOfMonth
                    }
                }
            },
            {
                $group: {
                    _id: '$category',
                    income: {
                        $sum: {
                            $cond: [{ $gt: ['$amount', 0] }, '$amount', 0]
                        }
                    },
                    expenses: {
                        $sum: {
                            $cond: [{ $lt: ['$amount', 0] }, { $abs: '$amount' }, 0]
                        }
                    },
                    total: { $sum: '$amount' },
                    count: { $sum: 1 }
                }
            },
            {
                $sort: { total: -1 }
            }
        ]);

        console.log('Category breakdown:', categoryBreakdown);

        // Calculate monthly totals from the categoryBreakdown
        const monthlyStats = categoryBreakdown.reduce((acc, category) => {
            acc.income += category.income;
            acc.expenses += category.expenses;
            return acc;
        }, { income: 0, expenses: 0 });

        console.log('Monthly stats:', monthlyStats);

        const response = {
            monthly: monthlyStats,
            categoryBreakdown,
            balance: monthlyStats.income - monthlyStats.expenses
        };

        console.log('Sending response:', response);
        res.json(response);
    } catch (error) {
        console.error('Error in getDashboardStats:', error);
        res.status(500).json({ message: error.message });
    }
};

module.exports = {
    getTransactions,
    addTransaction,
    getDashboardStats
};
