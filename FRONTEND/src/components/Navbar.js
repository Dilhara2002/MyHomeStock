import React, { useState, useEffect, useRef } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import axios from "axios";
import { ShoppingCart, User, LogOut, Settings, Bell } from "lucide-react";

const Navbar = () => {
  const [profilePicture, setProfilePicture] = useState("");
  const [username, setUsername] = useState("");
  const [showDropdown, setShowDropdown] = useState(false);
  const [notifications, setNotifications] = useState(0);
  const navigate = useNavigate();
  const location = useLocation();
  const dropdownRef = useRef(null);

  // Fetch user profile data on component mount
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) return;
        
        const response = await axios.get("http://localhost:5002/users/profile", {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (response.data.profilePicture) {
          setProfilePicture(response.data.profilePicture);
        }
        if (response.data.username) {
          setUsername(response.data.username);
        }
        
        // Mock notification count (replace with actual API call if available)
        setNotifications(3);
      } catch (error) {
        console.error("Error fetching profile data:", error);
        if (error.response && error.response.status === 401) {
          // Token expired or invalid
          handleLogout();
        }
      }
    };

    fetchProfile();
  }, []);
  
  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setShowDropdown(false);
      }
    };
    
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  // Handle logout
  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };
  
  // Check if route is active
  const isActive = (path) => {
    return location.pathname === path;
  };

  return (
    <nav className="navbar navbar-expand-lg navbar-dark bg-dark sticky-top shadow-sm">
      <div className="container">
        {/* Logo */}
        <Link to="/" className="navbar-brand d-flex align-items-center">
          <img 
            src="/api/placeholder/30/30" 
            alt="HomeStock Logo" 
            className="me-2" 
            style={{ width: "30px", height: "30px" }} 
          />
          <span className="fw-bold">HomeStock</span>
        </Link>

        {/* Navbar Toggler for Mobile */}
        <button
          className="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarNav"
          aria-controls="navbarNav"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon"></span>
        </button>

        {/* Navbar Links */}
        <div className="collapse navbar-collapse" id="navbarNav">
          <ul className="navbar-nav me-auto">
            <li className="nav-item">
              <Link 
                to="/dashboard" 
                className={`nav-link ${isActive('/dashboard') ? 'active' : ''}`}
              >
                <i className="bi bi-grid me-1"></i>
                Dashboard
              </Link>
            </li>
            <li className="nav-item">
              <Link 
                to="/inventory" 
                className={`nav-link ${isActive('/inventory') ? 'active' : ''}`}
              >
                <i className="bi bi-box me-1"></i>
                Inventory
              </Link>
            </li>
            <li className="nav-item">
              <Link 
                to="/shopping-list" 
                className={`nav-link ${isActive('/shopping-list') ? 'active' : ''}`}
              >
                <ShoppingCart size={16} className="me-1" />
                Shopping List
              </Link>
            </li>
            <li className="nav-item">
              <Link 
                to="/analytics" 
                className={`nav-link ${isActive('/analytics') ? 'active' : ''}`}
              >
                <i className="bi bi-graph-up me-1"></i>
                Analytics
              </Link>
            </li>
          </ul>

          {/* Right Side of Navbar */}
          <div className="d-flex align-items-center">
            {/* Notification Bell */}
            <div className="position-relative me-3">
              <Link to="/notifications" className="text-light">
                <Bell size={20} />
                {notifications > 0 && (
                  <span className="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger">
                    {notifications}
                    <span className="visually-hidden">unread notifications</span>
                  </span>
                )}
              </Link>
            </div>

            {/* Profile Dropdown */}
            <div className="dropdown" ref={dropdownRef}>
              <button
                className="btn btn-link dropdown-toggle d-flex align-items-center text-decoration-none"
                type="button"
                id="profileDropdown"
                onClick={() => setShowDropdown(!showDropdown)}
                aria-expanded={showDropdown}
              >
                {profilePicture ? (
                  <img
                    src={profilePicture}
                    alt="Profile"
                    className="rounded-circle me-2"
                    style={{ width: "32px", height: "32px", objectFit: "cover" }}
                  />
                ) : (
                  <User size={24} className="text-light me-2" />
                )}
                <span className="d-none d-md-inline text-light">{username || "User"}</span>
              </button>

              {/* Dropdown Menu */}
              {showDropdown && (
                <div
                  className="dropdown-menu dropdown-menu-end mt-2 shadow"
                >
                  <div className="dropdown-header py-2">
                    <small className="text-muted">Signed in as</small>
                    <p className="mb-0 fw-bold">{username || "User"}</p>
                  </div>
                  <div className="dropdown-divider"></div>
                  <Link to="/profile" className="dropdown-item">
                    <User size={16} className="me-2" />
                    Profile
                  </Link>
                  <Link to="/settings" className="dropdown-item">
                    <Settings size={16} className="me-2" />
                    Settings
                  </Link>
                  <div className="dropdown-divider"></div>
                  <button className="dropdown-item text-danger" onClick={handleLogout}>
                    <LogOut size={16} className="me-2" />
                    Sign Out
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;