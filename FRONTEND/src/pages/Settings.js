
import { useState } from "react";

export default function SettingsPage() {
  const [activeForm, setActiveForm] = useState(null);

  const openForm = (formName) => {
    setActiveForm(formName);
  };

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <h2 className="text-2xl font-bold text-center mb-4">Settings</h2>
      
      {/* Navigation */}
      <div className="flex justify-around bg-blue-500 text-white p-3 rounded-lg mb-6">
        <button onClick={() => openForm("category")} className="bg-white text-blue-500 px-4 py-2 rounded">
          Add Category
        </button>
        <button onClick={() => openForm("inventory")} className="bg-white text-blue-500 px-4 py-2 rounded">
          Add Inventory
        </button>
        <button onClick={() => openForm("user")} className="bg-white text-blue-500 px-4 py-2 rounded">
          Add User
        </button>
      </div>

      {/* Forms */}
      <div className="grid grid-cols-1 gap-6">
        {activeForm === "category" && (
          <div className="border rounded-lg p-4 shadow">
            <h3 className="text-lg font-semibold">Add Category</h3>
            <label className="block font-medium mb-1">Name</label>
            <input type="text" placeholder="Enter category name" className="border p-2 rounded w-full" />
            <button className="mt-4 bg-blue-500 text-white px-4 py-2 rounded">Save</button>
          </div>
        )}

        {activeForm === "inventory" && (
          <div className="border rounded-lg p-4 shadow">
            <h3 className="text-lg font-semibold">Add Inventory</h3>
            <label className="block font-medium mb-1">Item Name</label>
            <input type="text" placeholder="Enter item name" className="border p-2 rounded w-full" />
            <button className="mt-4 bg-blue-500 text-white px-4 py-2 rounded">Save</button>
          </div>
        )}

        {activeForm === "user" && (
          <div className="border rounded-lg p-4 shadow">
            <h3 className="text-lg font-semibold">Add User</h3>
            <label className="block font-medium mb-1">Email</label>
            <input type="email" placeholder="Enter user email" className="border p-2 rounded w-full" />
            <button className="mt-4 bg-blue-500 text-white px-4 py-2 rounded">Save</button>
          </div>
        )}
      </div>
    </div>

import React from 'react';
import { useNavigate } from "react-router-dom";
import { Button, Box, Typography } from "@mui/material";
import { AddCircleOutline } from "@mui/icons-material";

export default function SettingsPage() {
  const navigate = useNavigate(); // Hook for navigation

  // Button styling with sx prop
  const buttonStyle = {
    textTransform: 'none',
    fontWeight: 500,
    boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
    transition: 'all 0.3s ease',
    animation: 'fadeIn 0.5s ease-in-out',
    '&:hover': {
      transform: 'translateY(-2px)',
      boxShadow: '0 4px 8px rgba(0, 0, 0, 0.15)',
    },
    '& .MuiButton-startIcon': {
      marginRight: '8px',
    },
  };

  return (
    <Box 
      sx={{
        padding: { xs: '1rem', md: '1.5rem' },
        maxWidth: '56rem',
        marginLeft: 'auto',
        marginRight: 'auto',
      }}
    >
      <Typography 
        variant="h4"
        sx={{
          fontSize: '1.5rem',
          fontWeight: 700,
          textAlign: 'center',
          marginBottom: '1.5rem',
        }}
      >
        Settings
      </Typography>
      
      {/* Navigation Buttons */}
      <Box 
        sx={{
          display: 'flex',
          flexWrap: 'wrap',
          justifyContent: 'center',
          gap: { xs: '0.5rem', md: '1rem' },
          backgroundColor: '#3b82f6',
          color: 'white',
          padding: '1rem',
          borderRadius: '0.5rem',
          marginBottom: '1.5rem',
          '@keyframes fadeIn': {
            from: { opacity: 0 },
            to: { opacity: 1 },
          },
        }}
      >
        <Button 
          onClick={() => navigate("/add-category")} 
          variant="contained"
          startIcon={<AddCircleOutline />}
          color="primary"
          sx={buttonStyle}
        >
          Add Category
        </Button>
        
        <Button 
          onClick={() => navigate("/inventory/add")}
          variant="contained"
          startIcon={<AddCircleOutline />}
          color="primary"
          sx={buttonStyle}
        >
          Add Inventory
        </Button>
        
        <Button 
          onClick={() => navigate("/add-user")}
          variant="contained"
          startIcon={<AddCircleOutline />}
          color="primary"
          sx={buttonStyle}
        >
          Add User
        </Button>
      </Box>
    </Box>

  );
}
