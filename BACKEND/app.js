import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import dotenv from 'dotenv';
import CategoryRoute from './Route/Categoryroute.js';
import InventoryRoute from "./Route/InventoryRoute.js";
import UserRoute from "./Route/UserRoute.js";
import adminRoutes from "./Route/adminRoutes.js";
import shoppingListRoutes from "./Route/ShoppingListroute.js";
import Inventory from './Model/InventoryModel.js';
import chatbotRoutes from './Route/chatbotRoutes.js';

dotenv.config();

const app = express();

// Middleware to handle cross-origin requests and parse JSON bodies
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
// app.use('/api/chatbot', chatbotRoutes);


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
app.use('/chatbot', chatbotRoutes);

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
        return res.json({ 
          fulfillmentText: "All items are sufficiently stocked in MYHOME STOCK." 
        });
      }

      // Modify output format
      const responseText = lowStockItems.map(item => {
        return `${item.name} - Only ${item.quantity} remaining. Consider buying more!`;
      }).join("\n");

      return res.json({
        fulfillmentText: `Low stock items detected in MYHOME STOCK:\n${responseText}`
      });
    } catch (err) {
      console.error(err);
      return res.json({ fulfillmentText: "Error while checking inventory in MYHOME STOCK." });
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
        return res.json({ fulfillmentText: "No expired items found in MYHOME STOCK." });
      }

      // Modify output format
      const expiredText = expiredItems.map(item => {
        return `${item.name} has expired. Please discard or replace it.`;
      }).join("\n");

      return res.json({
        fulfillmentText: `Expired items in MYHOME STOCK:\n${expiredText}`
      });
    } catch (err) {
      console.error(err);
      return res.json({ fulfillmentText: "Error while checking expiration dates in MYHOME STOCK." });
    }
  }

  // Default response if no intent matches
  return res.json({ fulfillmentText: "Sorry, I didn't understand that. Please try again." });
});


// Start the server
const port = process.env.PORT || 5002;
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
