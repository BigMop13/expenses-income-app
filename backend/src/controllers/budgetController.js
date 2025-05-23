const Budget = require('../models/Budget');

// @desc    Add a new budget
// @route   POST /api/budgets/add
// @access  Private
exports.addBudget = async (req, res) => {
  try {
    const { amount, category } = req.body;
    const budget = new Budget({
      userId: req.user.id,
      amount,
      category
    });
    await budget.save();
    res.status(201).json(budget);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Get all budgets for user
// @route   GET /api/budgets/get
// @access  Private
exports.getBudgets = async (req, res) => {
  try {
    const budgets = await Budget.find({ userId: req.user.id }).sort({ createdAt: -1 });
    res.json(budgets);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
}; 