const dotenv = require('dotenv');
const mongoose = require('mongoose');
const Category = require('../models/Category');

dotenv.config();

const categories = [
  {
    name: 'Education',
    description: 'Tutoring, teaching, and academic support services.',
    status: 'active'
  },
  {
    name: 'Music',
    description: 'Music lessons, instruments, and performance skills.',
    status: 'active'
  },
  {
    name: 'Moving Help',
    description: 'Assistance with moving, lifting, and transportation.',
    status: 'active'
  },
  {
    name: 'Programming',
    description: 'Software development and technical mentoring.',
    status: 'active'
  },
  {
    name: 'Cooking',
    description: 'Cooking lessons and meal preparation skills.',
    status: 'active'
  },
  {
    name: 'Fitness',
    description: 'Exercise, wellness, and personal training activities.',
    status: 'active'
  },
  {
    name: 'Gardening',
    description: 'Plant care, landscaping, and gardening support.',
    status: 'active'
  },
  {
    name: 'Home Repair',
    description: 'Basic maintenance and repair services.',
    status: 'active'
  }
];

const seedCategories = async () => {
  try {
    if (!process.env.MONGO_URI) {
      throw new Error('MONGO_URI is not defined');
    }

    await mongoose.connect(process.env.MONGO_URI);

    await Category.deleteMany({});
    await Category.insertMany(categories);

    console.log('Categories seeded successfully');
    process.exit(0);
  } catch (error) {
    console.error(`Seed failed: ${error.message}`);
    process.exit(1);
  }
};

seedCategories();
