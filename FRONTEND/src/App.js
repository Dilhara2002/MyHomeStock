import React from "react";
import "./App.css"; // Import your styles (if applicable)
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css"; // Import Bootstrap CSS

// Import components
import Navbar from "./Components/Navbar";
import Login from "./Components/Login";
import Signup from "./Components/Signup";
import Profile from "./Components/Profile";
import InventoryList from "./Components/InventoryList";
import InventoryForm from "./Components/InventoryForm";
import HomePage from "./pages/Home";
import Settings from "./pages/Settings";
import AdminDashboard from "./pages/AdminDashboard"; 
 import CategoryPage from "./Components/AddCategory";
 import Shoppinglist from "./Components/ShoppingList";
 import Support from "./pages/Support";
 import Footer from "./pages/Footer";



const App = () => {
  const isAuthenticated = !!localStorage.getItem("token");

  return (
    <Router>
      <Navbar />
      <div >
        <Routes>
          {/* Redirect root path to login if not authenticated */}
          <Route path="/" element={isAuthenticated ? <HomePage /> : <Navigate to="/login" />} />

          {/* Public routes */}
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/Inventory" element={isAuthenticated ? <InventoryList /> : <Navigate to="/login" />} />
          <Route path="/profile" element={isAuthenticated ? <Profile /> : <Navigate to="/login" />} />
          <Route path="/inventory/:action/:id?" element={isAuthenticated ? <InventoryForm /> : <Navigate to="/login" />} />
          <Route path="/settings" element={isAuthenticated ? <Settings /> : <Navigate to="/login" />} />
          <Route path="/CategoryPage" element={isAuthenticated ? <CategoryPage /> : <Navigate to="/login" />} />
          <Route path="/Shoppinglist" element={isAuthenticated ? <Shoppinglist /> : <Navigate to="/login" />} />
          <Route path="/AdminDashboard" element={isAuthenticated ? <AdminDashboard /> : <Navigate to="/login" />} />
          <Route path="/Support" element={isAuthenticated ? <Support /> : <Navigate to="/login" />} />
          <Route path="/Footer" element={isAuthenticated ? <Footer /> : <Navigate to="/login" />} />
          
          

          {/* Admin-only route */}
          <Route
            path="/admin"
            element={isAuthenticated ? <AdminDashboard /> : <Navigate to="/login" />}
          />



          {/* Fallback route for invalid paths */}
          <Route path="*" element={<Navigate to="/" />} />
          
        </Routes>
      </div>

    </Router>
  );
};

export default App;
