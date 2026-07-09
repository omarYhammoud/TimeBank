import mongoose from "mongoose";
import Category from "../models/Category.js";

export const getCategories = async (req, res) => {
  try {
    const categories = await mongoose.connection.db
      .collection("categories")
      .find({})
      .toArray();
	console.log(categories);
    res.status(200).json(categories);
  } catch (error) {
    res.status(500).json({
      message: "Error fetching categories",
      error: error.message,
    });
  }
};

export const createCategory = async (req, res) => {
  try {
    const category = await Category.create(req.body);

    res.status(201).json(category);
  } catch (error) {
    res.status(500).json({
      error: error.message,
    });
  }
};
