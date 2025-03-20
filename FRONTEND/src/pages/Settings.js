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
