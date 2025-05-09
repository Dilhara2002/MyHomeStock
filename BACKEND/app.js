import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import dotenv from 'dotenv';  
import CategoryRoute from './Route/Categoryroute.js';  // Ensure correct import path for CategoryRoute
import InventoryRoute from "./Route/InventoryRoute.js"; // Import inventory routes
import UserRoute from "./Route/UserRoute.js"; 
import adminRoutes from "./Route/adminRoutes.js";
import shoppingListRoutes from "./Route/ShoppingListroute.js";
import Inventory from './Model/InventoryModel.js'; // Import Inventory Model for Webhook

// Load environment variables from .env file
dotenv.config();

const app = express();

// Middleware to handle cross-origin requests and parse JSON bodies
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// MongoDB connection using environment variables
const mongoURI = process.env.MONGODB_URI;

mongoose.connect(mongoURI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
  .then(() => console.log('MongoDB connected'))
  .catch((err) => console.error('MongoDB connection error:', err));

// Use the category routes
app.use('/', CategoryRoute);  // Ensure the route paths are handled correctly
app.use("/inventory", InventoryRoute); // Handling inventory routes
app.use("/users", UserRoute); 
app.use("/admin", adminRoutes);
app.use("/shopping-list", shoppingListRoutes);

// Dialogflow Webhook Route
// Webhook Route
app.post('/webhook', async (req, res) => {
  const intent = req.body.queryResult.intent.displayName;

  // Handle 'get_low_stock_items' intent
  if (intent === "get_low_stock_items") {
    try {
      const lowStockItems = await Inventory.find({
        $expr: { $lte: ["$quantity", "$threshold"] }
      });

      if (lowStockItems.length === 0) {
        return res.json({ fulfillmentText: "All items are sufficiently stocked." });
      }

      const itemNames = lowStockItems.map(item => item.name).join(", ");
      return res.json({ fulfillmentText: `These items are low in stock: ${itemNames}` });
    } catch (err) {
      console.error(err);
      return res.json({ fulfillmentText: "Error while checking inventory." });
    }
  }

  // Handle 'ExpiredItemCheck' intent
  if (intent === "ExpiredItemCheck") {
    try {
      // Get the current date
      const today = new Date();

      // Find items whose expiry date is before today (expired items)
      const expiredItems = await Inventory.find({ expiryDate: { $lt: today } });

      if (expiredItems.length === 0) {
        return res.json({ fulfillmentText: "No expired items found." });
      }

      // Join the names of expired items and return as response
      const expiredNames = expiredItems.map(item => item.name).join(", ");
      return res.json({ fulfillmentText: `These items have expired: ${expiredNames}` });
    } catch (err) {
      console.error(err);
      return res.json({ fulfillmentText: "Error while checking expiration dates." });
    }
  }

  // Default response if no intent matches
  return res.json({ fulfillmentText: "Sorry, I didn't understand that." });
});


// Start the server
const port = process.env.PORT || 5002;
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
