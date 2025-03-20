const express = require('express');
const router = express.Router();
const ShoppingListController = require('../controllers/ShoppingListController');

// Route to fetch all shopping list items
router.get('/', ShoppingListController.getAllItems);

// Route to add an item to the shopping list
router.post('/', ShoppingListController.addItem);

// Route to update the quantity of an item in the shopping list
router.put('/:id', ShoppingListController.updateItem);

// Route to delete an item from the shopping list
router.delete('/:id', ShoppingListController.deleteItem);

module.exports = router;

