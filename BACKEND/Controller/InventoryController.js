import Inventory from "../Model/InventoryModel.js";

// Create a new inventory item
export const createItem = async (req, res) => {
  try {
    const { name, quantity, unit, expiryDate, category } = req.body;

    if (!name || !quantity || !unit) {
      return res.status(400).json({ error: "Name, quantity, and unit are required" });
    }

    const newItem = new Inventory({
      name,
      quantity,
      unit,
      expiryDate,
      category,
    });

    await newItem.save();
    res.status(201).json({ message: "Item added successfully", item: newItem });
  } catch (error) {
    res.status(500).json({ error: "Internal Server Error", details: error.message });
  }
};

// Get all inventory items
export const getItems = async (req, res) => {
  try {
    const items = await Inventory.find();
    res.status(200).json(items);
  } catch (error) {
    res.status(500).json({ error: "Internal Server Error", details: error.message });
  }
};

// Get a single inventory item by ID
export const getItemById = async (req, res) => {
  try {
    const item = await Inventory.findById(req.params.id);
    if (!item) {
      return res.status(404).json({ error: "Item not found" });
    }
    res.status(200).json(item);
  } catch (error) {
    res.status(500).json({ error: "Internal Server Error", details: error.message });
  }
};

// Update an inventory item
export const updateItem = async (req, res) => {
  try {
    const { name, quantity, unit, expiryDate, category } = req.body;
    const updatedItem = await Inventory.findByIdAndUpdate(
      req.params.id,
      { name, quantity, unit, expiryDate, category },
      { new: true }
    );

    if (!updatedItem) {
      return res.status(404).json({ error: "Item not found" });
    }

    res.status(200).json({ message: "Item updated successfully", item: updatedItem });
  } catch (error) {
    res.status(500).json({ error: "Internal Server Error", details: error.message });
  }
};

// Delete an inventory item
export const deleteItem = async (req, res) => {
  try {
    const deletedItem = await Inventory.findByIdAndDelete(req.params.id);
    if (!deletedItem) {
      return res.status(404).json({ error: "Item not found" });
    }
    res.status(200).json({ message: "Item deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: "Internal Server Error", details: error.message });
  }
};

// Check for expiring items
export const checkExpiringItems = async (req, res) => {
  try {
    const today = new Date();
    const expiringItems = await Inventory.find({ expiryDate: { $lte: today } });

    if (expiringItems.length === 0) {
      return res.status(200).json({ message: "No items expiring soon" });
    }

    res.status(200).json({ message: "Expiring items found", items: expiringItems });
  } catch (error) {
    res.status(500).json({ error: "Internal Server Error", details: error.message });
  }
};

