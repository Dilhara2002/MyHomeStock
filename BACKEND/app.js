import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import dotenv from 'dotenv';  
import CategoryRoute from './Route/CategoryRoute.js';  // Ensure correct import path for CategoryRoute
import InventoryRoute from "./Route/InventoryRoute.js"; // Import inventory routes
import UserRoute from "./Route/UserRoute.js"; 
import adminRoutes from "./Route/adminRoutes.js";
import shoppingListRoutes from "./Route/ShoppingListroute.js";
import chatbotRoutes from "./Route/chatbot.routes.js"; // ✅ Missing line added


// Load environment variables from .env file
dotenv.config();

const app = express();

// Middleware to handle cross-origin requests and parse JSON bodies
app.use(cors());
app.use(express.json());

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
app.use("/chatbot", chatbotRoutes); // ✅ Mount chatbot route here

app.use(cors({
  origin: 'http://localhost:3000', // Your frontend URL
  credentials: true,
  allowedHeaders: ['Content-Type', 'Authorization', 'multipart/form-data']
}));
app.use(express.json({ 
  limit: '5mb', // For JSON data
  type: 'application/json' 
}));

app.use(express.urlencoded({ 
  extended: true, 
  limit: '5mb', // For URL-encoded form data
  type: 'application/x-www-form-urlencoded' 
}));

// Start the server
const port = process.env.PORT || 5002;
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});