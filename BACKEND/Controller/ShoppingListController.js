import Inventory from "../Model/InventoryModel.js";

// Get all shopping list items (auto-added + manual)
export const getShoppingList = async (req, res) => {
  try {
    // Get items marked for auto-replenishment (quantity <= threshold)
    const autoItems = await Inventory.find({
      quantity: { $lte: "$threshold" },
      isAutoAdded: true
    });

    // Get manually added items (you could add a separate model for these)
    // For now, we'll use a 'isManual' flag in Inventory (extend model if needed)
    const manualItems = await Inventory.find({ isManual: true });

    const shoppingList = [...autoItems, ...manualItems];
    res.status(200).json(shoppingList);
  } catch (error) {
    res.status(500).json({ 
      error: "Failed to fetch shopping list",
      details: error.message 
    });
  }
};

// Add item to shopping list (manual override)
export const addToShoppingList = async (req, res) => {
  try {
    const { itemId } = req.body;

    const item = await Inventory.findByIdAndUpdate(
      itemId,
      { $set: { isManual: true } }, // Mark as manually added
      { new: true }
    );

    if (!item) {
      return res.status(404).json({ error: "Inventory item not found" });
    }

    res.status(200).json({
      message: "Added to shopping list",
      item
    });
  } catch (error) {
    res.status(500).json({
      error: "Failed to add to shopping list",
      details: error.message
    });
  }
};

// Remove item from shopping list (when purchased)
export const purchaseItem = async (req, res) => {
  try {
    const { itemId, purchasedQuantity } = req.body;

    const item = await Inventory.findById(itemId);
    if (!item) {
      return res.status(404).json({ error: "Item not found" });
    }

    // Update inventory
    const updatedItem = await Inventory.findByIdAndUpdate(
      itemId,
      {
        $inc: { quantity: purchasedQuantity }, // Restock
        $set: { 
          isManual: false, // Remove from manual list
          lastPurchased: new Date() 
        },
        $inc: { purchaseFrequency: 1 }
      },
      { new: true }
    );

    res.status(200).json({
      message: "Item purchased and inventory updated",
      item: updatedItem
    });
  } catch (error) {
    res.status(500).json({
      error: "Failed to process purchase",
      details: error.message
    });
  }
};

// Toggle auto-replenishment for an item
export const toggleAutoReplenish = async (req, res) => {
  try {
    const { itemId } = req.body;
    const item = await Inventory.findById(itemId);

    if (!item) {
      return res.status(404).json({ error: "Item not found" });
    }

    const updatedItem = await Inventory.findByIdAndUpdate(
      itemId,
      { $set: { isAutoAdded: !item.isAutoAdded } },
      { new: true }
    );

    res.status(200).json({
      message: `Auto-replenish ${updatedItem.isAutoAdded ? "enabled" : "disabled"}`,
      item: updatedItem
    });
  } catch (error) {
    res.status(500).json({
      error: "Failed to toggle auto-replenish",
      details: error.message
    });
  }
};