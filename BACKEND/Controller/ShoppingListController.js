const ShoppingList = require('../models/ShoppingList'); // Assuming you have a ShoppingList model
const Inventory = require('../models/Inventory'); // Assuming you have an Inventory model

// Auto-Add Low-Stock Items to the Shopping List
const autoAddLowStockItems = async (req, res) => {
  try {
    const lowStockThreshold = 5;
    const inventoryItems = await Inventory.find();

    const lowStockItems = inventoryItems.filter(item => item.quantity < lowStockThreshold);

    const shoppingListItems = await ShoppingList.find();

    // Add low-stock items to the shopping list if they are not already in the list
    const itemsToAdd = lowStockItems.filter(item => {
      return !shoppingListItems.some(shoppingItem => shoppingItem.itemId.toString() === item._id.toString());
    });

    const itemsToAddPromises = itemsToAdd.map(item => {
      return ShoppingList.create({
        itemId: item._id,
        name: item.name,
        quantity: 1,  // Default quantity
      });
    });

    await Promise.all(itemsToAddPromises);

    res.status(200).json({ message: 'Low-stock items added to shopping list successfully' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to auto-add low-stock items' });
  }
};

// Add Item to the Shopping List
const addItem = async (req, res) => {
  try {
    const { itemId, quantity } = req.body;
    const inventoryItem = await Inventory.findById(itemId);

    if (!inventoryItem) {
      return res.status(400).json({ error: 'Item not found in inventory' });
    }

    // Check if the item is already in the shopping list
    const existingItem = await ShoppingList.findOne({ itemId });

    if (existingItem) {
      return res.status(400).json({ error: 'Item already exists in the shopping list' });
    }

    // Add the item to the shopping list
    const newItem = await ShoppingList.create({
      itemId,
      name: inventoryItem.name,
      quantity,
    });

    res.status(201).json({ message: 'Item added to shopping list', item: newItem });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to add item to shopping list' });
  }
};

// Remove Item from the Shopping List
const removeItem = async (req, res) => {
  try {
    const { itemId } = req.params;
    const item = await ShoppingList.findOneAndDelete({ itemId });

    if (!item) {
      return res.status(404).json({ error: 'Item not found in shopping list' });
    }

    res.status(200).json({ message: 'Item removed from shopping list' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to remove item from shopping list' });
  }
};

// Fetch Shopping List Items
const getShoppingList = async (req, res) => {
  try {
    const shoppingList = await ShoppingList.find().populate('itemId'); // Populate item details from inventory
    res.status(200).json({ shoppingList });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to fetch shopping list' });
  }
};

// Fetch Frequently Purchased Items
const getFrequentlyPurchasedItems = async (req, res) => {
  try {
    const shoppingListItems = await ShoppingList.find();

    const purchaseFrequency = {};

    // Count how many times each item is added to the shopping list
    shoppingListItems.forEach(item => {
      if (purchaseFrequency[item.itemId]) {
        purchaseFrequency[item.itemId] += item.quantity;
      } else {
        purchaseFrequency[item.itemId] = item.quantity;
      }
    });

    // Sort items by frequency
    const frequentItems = Object.entries(purchaseFrequency)
      .sort((a, b) => b[1] - a[1])  // Sort by frequency in descending order
      .map(([itemId, frequency]) => ({ itemId, frequency }));

    res.status(200).json({ frequentItems });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to fetch frequently purchased items' });
  }
};

module.exports = {
  autoAddLowStockItems,
  addItem,
  removeItem,
  getShoppingList,
  getFrequentlyPurchasedItems,
};
