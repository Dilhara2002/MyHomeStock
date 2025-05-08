import ShoppingList from "../Model/ShoppingListmodel.js";
import Inventory from "../Model/InventoryModel.js";

// Fetch Shopping List
export const fetchShoppingList = async (req, res) => {
  try {
    const userId = req.user.id;
    let shoppingList = await ShoppingList.findOne({ userId });

    if (!shoppingList) {
      shoppingList = new ShoppingList({ userId, items: [] });
      await shoppingList.save();
    }

    return res.status(200).json(shoppingList);
  } catch (err) {
    console.error("Error fetching shopping list:", err);
    return res.status(500).json({ message: "Error fetching shopping list" });
  }
};

// Add to Shopping List
export const addToShoppingList = async (req, res) => {
  try {
    const userId = req.user.id;
    const { itemName, quantity } = req.body;

    if (!itemName || !quantity) {
      return res.status(400).json({ message: "Item name and quantity are required" });
    }

    if (quantity <= 0) {
      return res.status(400).json({ message: "Quantity must be greater than 0" });
    }

    let shoppingList = await ShoppingList.findOne({ userId });

    if (!shoppingList) {
      shoppingList = new ShoppingList({ userId, items: [] });
    }

    const existingItem = shoppingList.items.find(item => item.name === itemName);
    if (existingItem) {
      existingItem.quantity += quantity;
    } else {
      shoppingList.items.push({ name: itemName, quantity });
    }

    await shoppingList.save();
    return res.status(201).json({ message: "Item added successfully", shoppingList });
  } catch (err) {
    console.error("Error adding item to shopping list:", err);
    return res.status(500).json({ message: "Error adding item to shopping list" });
  }
};

// Remove from Shopping List
export const removeFromShoppingList = async (req, res) => {
  try {
    const userId = req.user.id;
    const { itemName } = req.params;

    const shoppingList = await ShoppingList.findOne({ userId });

    if (!shoppingList) {
      return res.status(404).json({ message: "Shopping list not found" });
    }

    shoppingList.items = shoppingList.items.filter(item => item.name !== itemName);
    await shoppingList.save();

    return res.status(200).json({ message: "Item removed successfully", shoppingList });
  } catch (err) {
    console.error("Error removing item:", err);
    return res.status(500).json({ message: "Error removing item" });
  }
};

// Update Shopping List Item
export const updateShoppingListItem = async (req, res) => {
  try {
    const userId = req.user.id;
    const { itemName } = req.params;
    const { quantity } = req.body;

    // Validation
    if (typeof quantity !== 'number' || quantity <= 0) {
      return res.status(400).json({ 
        message: "Quantity must be a positive number",
        field: "quantity"
      });
    }

    const shoppingList = await ShoppingList.findOne({ userId });
    if (!shoppingList) {
      return res.status(404).json({ message: "Shopping list not found" });
    }

    const itemToUpdate = shoppingList.items.find(item => item.name === itemName);
    if (!itemToUpdate) {
      return res.status(404).json({ message: "Item not found in shopping list" });
    }

    // Update and save
    itemToUpdate.quantity = quantity;
    shoppingList.updatedAt = new Date();
    await shoppingList.save();

    return res.status(200).json({ 
      message: "Item updated successfully", 
      shoppingList, 
      updatedItem: itemToUpdate
    });

  } catch (err) {
    console.error("Error updating item:", err);
    return res.status(500).json({
      message: "Internal server error",
      error: process.env.NODE_ENV === 'development' ? err.message : undefined
    });
  }
};

// Auto-add Low Stock Items
export const autoAddLowStockItems = async (req, res) => {
  try {
    const userId = req.user.id;

    // Fetch low stock items from inventory
    const lowStockItems = await Inventory.find({
      quantity: { $lte: 5 }, // Low stock threshold is 5
      isAutoAdded: false
    });

    if (lowStockItems.length === 0) {
      return res.status(200).json({ message: "No low-stock items found" });
    }

    let shoppingList = await ShoppingList.findOne({ userId });
    if (!shoppingList) {
      shoppingList = new ShoppingList({ userId, items: [] });
    }

    for (const item of lowStockItems) {
      shoppingList.items.push({
        name: item.name,
        quantity: item.threshold - item.quantity > 0 ? item.threshold - item.quantity : 1,
      });

      item.isAutoAdded = true;
      await item.save();
    }

    await shoppingList.save();

    return res.status(200).json({
      message: `${lowStockItems.length} low-stock item(s) added to your shopping list.`,
      shoppingList
    });
  } catch (err) {
    console.error("Error auto-adding low-stock items:", err);
    return res.status(500).json({ message: "Failed to auto-add low-stock items", error: err.message });
  }
};

// Get Auto-added Shopping List Items
export const getAutoAddedShoppingListItems = async (req, res) => {
  try {
    const userId = req.user.id; 

    const shoppingList = await ShoppingList.findOne({ userId });

    if (!shoppingList || shoppingList.items.length === 0) {
      return res.status(200).json({ message: "Shopping list is empty" });
    }

    const autoAddedItems = shoppingList.items.filter(async (item) => {
      const inventoryItem = await Inventory.findOne({ name: item.name });
      return inventoryItem && inventoryItem.isAutoAdded;
    });

    if (autoAddedItems.length === 0) {
      return res.status(200).json({ message: "No auto-added items found in shopping list" });
    }

    return res.status(200).json({
      message: "Auto-added shopping list items retrieved successfully",
      items: autoAddedItems,
    });
  } catch (error) {
    console.error("Error getting auto-added shopping items:", error);
    return res.status(500).json({ message: "Failed to fetch auto-added shopping items", error: error.message });
  }
};
