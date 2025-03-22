import ShoppingList from "../Model/ShoppingListmodel.js";

// Fetch shopping list for a user
export const fetchShoppingList = async (req, res) => {
  const { userId } = req.params;
  try {
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

// Add an item to the shopping list
export const addToShoppingList = async (req, res) => {
  const { userId, itemName, quantity } = req.body;

  // Validate the request body
  if (!itemName || !quantity) {
    return res.status(400).json({ message: "Item name and quantity are required" });
  }

  try {
    let shoppingList = await ShoppingList.findOne({ userId });
    
    if (!shoppingList) {
      shoppingList = new ShoppingList({ userId, items: [] });
    }

    // Check if item already exists in the shopping list
    const existingItem = shoppingList.items.find(item => item.name === itemName);
    if (existingItem) {
      // If item exists, update the quantity
      existingItem.quantity += quantity;
    } else {
      // If item doesn't exist, add it
      shoppingList.items.push({ name: itemName, quantity });
    }

    await shoppingList.save();
    return res.status(201).json({ success: true, message: "Item added successfully", shoppingList });
  } catch (err) {
    console.error("Error adding item to shopping list:", err);
    return res.status(500).json({ message: "Error adding item to shopping list" });
  }
};

// Remove an item from the shopping list
export const removeFromShoppingList = async (req, res) => {
  const { userId, itemName } = req.params;
  
  try {
    const shoppingList = await ShoppingList.findOne({ userId });

    if (!shoppingList) {
      return res.status(404).json({ message: "Shopping list not found" });
    }

    // Remove item from the list
    shoppingList.items = shoppingList.items.filter((item) => item.name !== itemName);
    await shoppingList.save();

    return res.status(200).json({ success: true, message: "Item removed successfully" });
  } catch (err) {
    console.error("Error removing item:", err);
    return res.status(500).json({ message: "Error removing item" });
  }
};
