const Category = require('../models/Category');

const getCategories = async (req, res) => {
  try {
    const categories = await Category.find({ status: 'active' }).sort({ name: 1 });
    res.status(200).json(categories);
  } catch (error) {
    res.status(500).json({
      message: 'Failed to fetch categories',
      error: error.message
    });
  }
};

module.exports = {
  getCategories
};