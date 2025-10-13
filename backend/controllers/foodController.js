import foodModel from "../models/foodModel.js";
import fs from "fs";

// Add food
const addFood = async (req, res) => {
  try {
    const { name, description, price, category } = req.body;
    const image = req.file ? req.file.filename : null;

    const food = new foodModel({
      name,
      description,
      price,
      category,
      image,
    });

    await food.save();
    res.json({ success: true, message: "Food added successfully" });
  } catch (err) {
    console.log(err);
    res.status(500).json({ success: false, message: "Error adding food" });
  }
};

// List all foods
const listFood = async (req, res) => {
  try {
    const foods = await foodModel.find({});
    res.json({ success: true, data: foods });
  } catch (err) {
    res.status(500).json({ success: false, message: "Error fetching foods" });
  }
};

// Remove food
const removeFood = async (req, res) => {
  try {
    const { id } = req.body;
    const food = await foodModel.findById(id);

    if (!food) {
      return res.status(404).json({ success: false, message: "Food not found" });
    }

    if (food.image) {
      fs.unlink(`uploads/${food.image}`, (err) => {
        if (err) console.log("Error deleting image:", err);
      });
    }

    await foodModel.findByIdAndDelete(id);
    res.json({ success: true, message: "Food removed successfully" });
  } catch (err) {
    res.status(500).json({ success: false, message: "Error removing food" });
  }
};

// ✅ Update food
const updateFood = async (req, res) => {
  try {
    const { id, name, description, price, category } = req.body;

    if (!id) return res.status(400).json({ message: "Food ID is required" });

    const food = await foodModel.findById(id); // <-- use foodModel
    if (!food) return res.status(404).json({ message: "Food not found" });

    food.name = name || food.name;
    food.description = description || food.description;
    food.price = price || food.price;
    food.category = category || food.category;

    if (req.file) food.image = req.file.filename;

    await food.save();
    res.status(200).json({ message: "Food updated successfully", data: food });
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Error updating food" });
  }
};



export { addFood, listFood, removeFood, updateFood };
