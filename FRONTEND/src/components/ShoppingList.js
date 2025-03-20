import React, { useState, useEffect } from 'react';
import { Box, Typography, TextField, Button, List, ListItem, ListItemText, IconButton, Paper, Grid, Divider, Badge } from '@mui/material';
import { Delete, Add, ShoppingCart, Edit } from '@mui/icons-material';

const ShoppingList = () => {
  const [shoppingList, setShoppingList] = useState([]);
  const [itemName, setItemName] = useState('');
  const [quantity, setQuantity] = useState(1);
  const [isEditing, setIsEditing] = useState(false);
  const [editItemName, setEditItemName] = useState('');
  const [editQuantity, setEditQuantity] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  // Fetch shopping list for the user
  useEffect(() => {
    const userId = 'someUserId'; // Replace with actual userId
    const fetchShoppingList = async () => {
      try {
        const response = await fetch(`/api/shopping-list/${userId}`);
        if (response.ok) {
          const data = await response.json();
          setShoppingList(data.shoppingList.items);
        } else {
          console.error('Failed to fetch shopping list');
        }
      } catch (error) {
        console.error('Error fetching shopping list:', error);
      }
    };

    fetchShoppingList();
  }, []);

  // Add item to shopping list
  const addItem = async () => {
    if (itemName.trim() && quantity > 0) {
      const userId = 'someUserId'; // Replace with actual userId
      const newItem = { userId, itemName, quantity };
      try {
        const response = await fetch('/api/shopping-list/add', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(newItem)
        });
        if (response.ok) {
          const data = await response.json();
          setShoppingList(data.shoppingList.items); // Update shopping list
          setItemName('');
          setQuantity(1);
        } else {
          setError('Failed to add item');
        }
      } catch (error) {
        setError('Failed to add item');
      }
    } else {
      setError('Please provide a valid item name and quantity');
    }
  };

  // Remove item from shopping list
  const removeItem = async (itemName) => {
    const userId = 'someUserId'; // Replace with actual userId
    try {
      const response = await fetch(`/api/shopping-list/remove/${userId}/${itemName}`, {
        method: 'DELETE'
      });
      if (response.ok) {
        const data = await response.json();
        setShoppingList(data.shoppingList.items); // Update shopping list
      } else {
        setError('Failed to remove item');
      }
    } catch (error) {
      setError('Failed to remove item');
    }
  };

  // Edit item in shopping list
  const startEdit = (itemName, quantity) => {
    setIsEditing(true);
    setEditItemName(itemName);
    setEditQuantity(quantity);
  };

  const saveEdit = async () => {
    const userId = 'someUserId'; // Replace with actual userId
    const updatedItem = { userId, itemName: editItemName, quantity: editQuantity };
    try {
      const response = await fetch('/api/shopping-list/update', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(updatedItem)
      });
      if (response.ok) {
        const data = await response.json();
        setShoppingList(data.shoppingList.items); // Update shopping list
        setIsEditing(false);
        setEditItemName('');
        setEditQuantity(1);
      } else {
        setError('Failed to update item');
      }
    } catch (error) {
      setError('Failed to update item');
    }
  };

  return (
    <Paper elevation={3} sx={{ maxWidth: 600, mx: 'auto', mt: 4, p: 3 }}>
      <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
        <ShoppingCart sx={{ mr: 2, color: '#3b82f6' }} />
        <Typography variant="h5" fontWeight="bold">
          Your Shopping List
        </Typography>
        <Badge badgeContent={shoppingList.length} color="primary" sx={{ ml: 2 }} />
      </Box>
      <Divider sx={{ mb: 3 }} />

      {/* Error Message */}
      {error && <Typography color="error">{error}</Typography>}

      {/* Add Item Section */}
      {!isEditing ? (
        <Box sx={{ mb: 3 }}>
          <TextField
            label="Item Name"
            fullWidth
            value={itemName}
            onChange={(e) => setItemName(e.target.value)}
            sx={{ mb: 2 }}
          />
          <TextField
            label="Quantity"
            type="number"
            fullWidth
            value={quantity}
            onChange={(e) => setQuantity(e.target.value)}
            sx={{ mb: 2 }}
          />
          <Button variant="contained" color="primary" fullWidth onClick={addItem}>
            Add Item
          </Button>
        </Box>
      ) : (
        <Box sx={{ mb: 3 }}>
          <TextField
            label="Edit Item Name"
            fullWidth
            value={editItemName}
            onChange={(e) => setEditItemName(e.target.value)}
            sx={{ mb: 2 }}
          />
          <TextField
            label="Edit Quantity"
            type="number"
            fullWidth
            value={editQuantity}
            onChange={(e) => setEditQuantity(e.target.value)}
            sx={{ mb: 2 }}
          />
          <Button variant="contained" color="primary" fullWidth onClick={saveEdit}>
            Save Changes
          </Button>
        </Box>
      )}

      {/* Shopping List */}
      <List>
        {shoppingList.map((item, index) => (
          <ListItem key={index} sx={{ display: 'flex', justifyContent: 'space-between' }}>
            <ListItemText primary={item.name} secondary={`Quantity: ${item.quantity}`} />
            <Box>
              <IconButton color="primary" onClick={() => startEdit(item.name, item.quantity)}>
                <Edit />
              </IconButton>
              <IconButton color="secondary" onClick={() => removeItem(item.name)}>
                <Delete />
              </IconButton>
            </Box>
          </ListItem>
        ))}
      </List>
    </Paper>
  );
};

export default ShoppingList;
