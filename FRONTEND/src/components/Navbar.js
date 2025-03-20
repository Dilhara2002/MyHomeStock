import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import axios from "axios";

const Navbar = () => {
  const [profilePicture, setProfilePicture] = useState("");
  const [showDropdown, setShowDropdown] = useState(false);
  const navigate = useNavigate();

  // Fetch user profile picture on component mount
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const token = localStorage.getItem("token");
        const response = await axios.get("http://localhost:5002/users/profile", {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (response.data.profilePicture) {
          setProfilePicture(response.data.profilePicture);
        }
      } catch (error) {
        console.error("Error fetching profile picture:", error);
      }
    };

    fetchProfile();
  }, []);

  // Handle logout
  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };

  return (
    <nav className="navbar navbar-expand-lg navbar-dark bg-dark">
      <div className="container-fluid">
        {/* Logo */}
        <Link to="/" className="navbar-brand">
          HomeStock
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
              <Link to="/dashboard" className="nav-link">
                Inventory
              </Link>
            </li>
            <li className="nav-item">
              <Link to="/shopping-list" className="nav-link">
                Shopping List
              </Link>
            </li>
            <li className="nav-item">
              <Link to="/profile" className="nav-link">
                Profile
              </Link>
            </li>
          </ul>

          {/* Profile Picture and Dropdown */}
          <div className="dropdown">
            <button
              className="btn btn-link dropdown-toggle"
              type="button"
              id="profileDropdown"
              onClick={() => setShowDropdown(!showDropdown)}
              style={{ padding: 0, border: "none" }}
            >
              {profilePicture ? (
                <img
                  src={profilePicture}
                  alt="Profile"
                  style={{ width: "40px", height: "40px", borderRadius: "50%" }}
                />
              ) : (
                <i className="fas fa-user-circle" style={{ fontSize: "24px", color: "#fff" }}></i>
              )}
            </button>

            {/* Dropdown Menu */}
            {showDropdown && (
              <div
                className="dropdown-menu dropdown-menu-end"
                aria-labelledby="profileDropdown"
                style={{ position: "absolute", right: 0 }}
              >
                <button className="dropdown-item" onClick={handleLogout}>
                  Sign Out
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;