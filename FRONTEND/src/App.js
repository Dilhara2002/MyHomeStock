import React from 'react';
import './App.css'; // Import your styles (if applicable)
import AddCategory from './components/AddCategory.js';  // Import AddCategory component
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import Login from "./components/Login";
import Signup from "./components/Signup";
import Profile from "./components/Profile";
import InventoryList from "./components/InventoryList";
import InventoryForm from "./components/InventoryForm";
import Navbar from "./components/Navbar";
import HomePage from "./pages/Home";
import "bootstrap/dist/css/bootstrap.min.css"; // Import Bootstrap CSS


const App = () => {
  const isAuthenticated = !!localStorage.getItem("token");

  return (
    <Router>
      <Navbar />
      <div className="container mt-4">
        <Routes>
          {/* Redirect root path to login if not authenticated */}
          <Route
            path="/"
            element={isAuthenticated ? <HomePage /> : <Navigate to="/login" />}
          />

          {/* Public routes */}
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />

          {/* Protected routes */}
          <Route
            path="/dashboard"
            element={isAuthenticated ? <InventoryList /> : <Navigate to="/login" />}
          />
          <Route
            path="/profile"
            element={isAuthenticated ? <Profile /> : <Navigate to="/login" />}
          />
          <Route
            path="/inventory/:action/:id?"
            element={isAuthenticated ? <InventoryForm /> : <Navigate to="/login" />}
          />

          {/* Fallback route for invalid paths */}
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </div>
    </Router>
  );
};

export default App;