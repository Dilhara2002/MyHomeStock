import Category from "../Model/CategoryModel.js";

// Get all categories
export const getAllCategories = async (req, res) => {
  try {
    const categories = await Category.find(); // Fetch all categories from the database

    if (!categories || categories.length === 0) {
      return res.status(404).json({ message: "No categories found" });
    }

    return res.status(200).json({ categories });
  } catch (err) {
    console.error("Error fetching categories:", err);
    return res.status(500).json({ message: "Failed to fetch categories" });
  }
};

// Add a new category
export const addCategory = async (req, res) => {
  const { name, description } = req.body;

  //Add validation
  if (!name || !description) {
    return res.status(400).json({ message: "Name and description are required" });
  }

  try {
    const category = new Category({ name, description });
    await category.save();

    return res.status(201).json({ category });
  } catch (err) {
    console.error("Error adding category:", err);
    return res.status(500).json({ message: "Failed to add category" });
  }
};

// Get category by ID
export const getCategoryById = async (req, res) => {
  const { id } = req.params;

  try {
    const category = await Category.findById(id);

    if (!category) {
      return res.status(404).json({ message: "Category not found" });
    }

    return res.status(200).json({ category });
  } catch (err) {
    console.error("Error fetching category by ID:", err);
    return res.status(500).json({ message: "Error fetching category" });
  }
};

// Update category details
export const updateCategory = async (req, res) => {
  const { id } = req.params;
  const { name, description } = req.body;

  //update validation
  if (!name || !description) {
    return res.status(400).json({ message: "Name and description are required" });
  }

  try {
    const category = await Category.findByIdAndUpdate(
      id,
      { name, description },
      { new: true } 
    );

    if (!category) {
      return res.status(404).json({ message: "Category not found" });
    }

    return res.status(200).json({ category });
  } catch (err) {
    console.error("Error updating category:", err);
    return res.status(500).json({ message: "Error updating category" });
  }
};

// Delete category
export const deleteCategory = async (req, res) => {
  const { id } = req.params;

  try {
    const category = await Category.findByIdAndDelete(id);

    if (!category) {
      return res.status(404).json({ message: "Category not found" });
    }

    return res.status(200).json({ message: "Category deleted successfully" });
  } catch (err) {
    console.error("Error deleting category:", err);
    return res.status(500).json({ message: "Error deleting category" });
  }
};
