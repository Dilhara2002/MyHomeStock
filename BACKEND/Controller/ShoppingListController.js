import ShoppingList from "../Model/ShoppingListmodel.js";

export const fetchShoppingList = async (req, res) => {
  try {
    const userId = req.user.id; // Get from authenticated token
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

export const addToShoppingList = async (req, res) => {
  try {
    const userId = req.user.id; // Get from authenticated token
    const { itemName, quantity } = req.body;

    if (!itemName || !quantity) {
      return res.status(400).json({ message: "Item name and quantity are required" });
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
    return res.status(201).json({ shoppingList });
  } catch (err) {
    console.error("Error adding item to shopping list:", err);
    return res.status(500).json({ message: "Error adding item to shopping list" });
  }
};

export const removeFromShoppingList = async (req, res) => {
  try {
    const userId = req.user.id; // Get from authenticated token
    const { itemName } = req.params;
    
    const shoppingList = await ShoppingList.findOne({ userId });

    if (!shoppingList) {
      return res.status(404).json({ message: "Shopping list not found" });
    }

    shoppingList.items = shoppingList.items.filter((item) => item.name !== itemName);
    await shoppingList.save();

    return res.status(200).json({ shoppingList });
  } catch (err) {
    console.error("Error removing item:", err);
    return res.status(500).json({ message: "Error removing item" });
  }
};