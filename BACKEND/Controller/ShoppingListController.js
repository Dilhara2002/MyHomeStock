import ShoppingList from "../models/shoppingListModel.js";
import Inventory from "../models/inventoryModel.js";

// Get all shopping lists for a user
export const getAllShoppingLists = async (req, res) => {
  const { userId } = req.params;
  
  try {
    const shoppingList = await ShoppingList.findOne({ userId });

    if (!shoppingList) {
      return res.status(404).json({ message: "Shopping list not found" });
    }

    return res.status(200).json({ shoppingList });
  } catch (err) {
    console.error("Error fetching shopping list:", err);
    return res.status(500).json({ message: "Failed to fetch shopping list" });
  }
};

// Add an item to the shopping list
export const addItemToShoppingList = async (req, res) => {
  const { userId, itemName, quantity } = req.body;

  if (!itemName || !quantity) {
    return res.status(400).json({ message: "Item name and quantity are required" });
  }

  try {
    let shoppingList = await ShoppingList.findOne({ userId });

    if (!shoppingList) {
      shoppingList = new ShoppingList({ userId, items: [] });
    }

    const existingItem = shoppingList.items.find(item => item.name === itemName);

    if (existingItem) {
      return res.status(400).json({ message: "Item already in shopping list" });
    }

    shoppingList.items.push({ name: itemName, quantity, addedAutomatically: false });
    await shoppingList.save();

    return res.status(201).json({ shoppingList });
  } catch (err) {
    console.error("Error adding item to shopping list:", err);
    return res.status(500).json({ message: "Failed to add item" });
  }
};

// Remove an item from the shopping list
export const removeItemFromShoppingList = async (req, res) => {
  const { userId, itemName } = req.params;

  try {
    const shoppingList = await ShoppingList.findOne({ userId });

    if (!shoppingList) {
      return res.status(404).json({ message: "Shopping list not found" });
    }

    const itemIndex = shoppingList.items.findIndex(item => item.name === itemName);

    if (itemIndex === -1) {
      return res.status(404).json({ message: "Item not found in shopping list" });
    }

    shoppingList.items.splice(itemIndex, 1);
    await shoppingList.save();

    return res.status(200).json({ message: "Item removed successfully" });
  } catch (err) {
    console.error("Error removing item from shopping list:", err);
    return res.status(500).json({ message: "Failed to remove item" });
  }
};

// Auto-add low-stock items to the shopping list
export const autoAddLowStockItems = async (req, res) => {
  const { userId } = req.params;
  
  try {
    const shoppingList = await ShoppingList.findOne({ userId });
    const lowStockItems = await Inventory.find({ quantity: { $lt: 5 } });

    if (!shoppingList) {
      return res.status(404).json({ message: "Shopping list not found" });
    }

    lowStockItems.forEach(item => {
      const existingItem = shoppingList.items.find(i => i.name === item.name);

      if (!existingItem) {
        shoppingList.items.push({ name: item.name, quantity: 1, addedAutomatically: true });
      }
    });

    await shoppingList.save();

    return res.status(200).json({ shoppingList });
  } catch (err) {
    console.error("Error auto-adding low-stock items:", err);
    return res.status(500).json({ message: "Failed to auto-add items" });
  }
};
