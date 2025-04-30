import React, { useState, useEffect, useRef } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import axios from "axios";
import { ShoppingCart, User, LogOut, Settings, Bell } from "lucide-react";
import logo from './logo.png';

const Navbar = () => {

  const [userData, setUserData] = useState({
    profilePicture: "",
    username: "",
    role: "",
    notifications: 0
  });
  const [profileImageUrl, setProfileImageUrl] = useState("");


  const [profilePicture, setProfilePicture] = useState("");
  const [userId, setUserId] = useState(null);  // To store the userId

  const [showDropdown, setShowDropdown] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const dropdownRef = useRef(null);

  const fetchProfileImage = async (imagePath) => {
    const token = localStorage.getItem("token");
    try {
      const response = await fetch(`http://localhost:5002/users/profile/image`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      const blob = await response.blob();
      const imageUrl = URL.createObjectURL(blob);
      setProfileImageUrl(imageUrl);
    } catch (error) {
      console.error("Error loading profile image:", error);
    }
  };



  // Enhanced auth check with role verification
  const checkAuthAndFetchProfile = async () => {
    const token = localStorage.getItem("token");
    const authStatus = !!token;
    setIsAuthenticated(authStatus);

    if (!authStatus) {
      setUserData({
        profilePicture: "",
        username: "",
        role: "",
        notifications: 0
      });
      setProfileImageUrl("");
      return;
    }

    try {
      const response = await axios.get("http://localhost:5002/users/profile", {
        headers: { Authorization: `Bearer ${token}` },
      });

      const profilePicturePath = response.data.profilePicture || "";
      if (profilePicturePath) {
        fetchProfileImage(profilePicturePath);
      }

      setUserData({
        profilePicture: profilePicturePath,
        username: response.data.username || "",
        role: response.data.role || "user",
        notifications: response.data.notifications || 0
      });

      localStorage.setItem("userData", JSON.stringify({
        username: response.data.username,
        role: response.data.role,
        profilePicture: profilePicturePath
      }));
    } catch (error) {
      console.error("Error fetching profile:", error);
      if (error.response?.status === 401) {
        handleLogout();
      }
    }
  };

  // Initial setup with localStorage check

  // Fetch user profile picture and userId on component mount

  useEffect(() => {
    const storedUserData = localStorage.getItem("userData");
    if (storedUserData) {
      try {

        const parsedData = JSON.parse(storedUserData);
        setUserData(prev => ({
          ...prev,
          username: parsedData.username || "",
          role: parsedData.role || "user",
          profilePicture: parsedData.profilePicture || ""
        }));

        if (parsedData.profilePicture) {
          fetchProfileImage(parsedData.profilePicture);
        }
      } catch (e) {
        console.error("Error parsing stored user data:", e);

        const token = localStorage.getItem("token");
        const response = await axios.get("http://localhost:5002/users/profile", {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (response.data.profilePicture) {
          setProfilePicture(response.data.profilePicture);
        }
        
        if (response.data.userId) {
          setUserId(response.data.userId); // Set the userId from the profile API
        }
      } catch (error) {
        console.error("Error fetching profile picture:", error);

      }
    }

    checkAuthAndFetchProfile();

    const handleAuthChange = () => checkAuthAndFetchProfile();
    window.addEventListener("authChange", handleAuthChange);
    window.addEventListener("storage", handleAuthChange);

    return () => {
      window.removeEventListener("authChange", handleAuthChange);
      window.removeEventListener("storage", handleAuthChange);
    };
  }, []);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setShowDropdown(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("userData");
    setIsAuthenticated(false);
    setUserData({
      profilePicture: "",
      username: "",
      role: "",
      notifications: 0
    });
    setProfileImageUrl("");
    navigate("/login");
    window.dispatchEvent(new Event("authChange"));
  };

  const isActive = (path) => location.pathname === path;

  const renderAdminMenu = () => {
    if (userData.role === 'admin') {
      return (
        <li className="nav-item">
          <Link 
            to="/admin" 
            className={`nav-link ${isActive('/admin') ? 'active' : ''}`}
          >
            Admin Dashboard
          </Link>
        </li>
      );
    }
    return null;
  };

  return (
    <nav className="navbar navbar-expand-lg navbar-dark bg-dark sticky-top shadow-sm">
      <div className="container">
        <Link to="/" className="navbar-brand d-flex align-items-center">
          <img 
            src={logo} 
            alt="Logo" 
            className="me-2" 
            style={{ width: "30px", height: "30px" }}
            onError={(e) => e.target.src = "https://via.placeholder.com/30"} 
          />
          <span className="fw-bold">MyHomeStock</span>
        </Link>

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

        <div className="collapse navbar-collapse" id="navbarNav">

          {isAuthenticated && (
            <>
              <ul className="navbar-nav me-auto">
                <li className="nav-item">
                  <Link 
                    to="/dashboard" 
                    className={`nav-link ${isActive('/dashboard') ? 'active' : ''}`}
                  >
                    <i className="bi bi-grid me-1"></i> Dashboard
                  </Link>
                </li>
                <li className="nav-item">
                  <Link 
                    to="/inventory" 
                    className={`nav-link ${isActive('/inventory') ? 'active' : ''}`}
                  >
                    <i className="bi bi-box me-1"></i> Inventory
                  </Link>
                </li>
                <li className="nav-item">
                  <Link 
                    to="/Shoppinglist" 
                    className={`nav-link ${isActive('/Shoppinglist') ? 'active' : ''}`}
                  >
                    <ShoppingCart size={16} className="me-1" /> Shopping List
                  </Link>
                </li>
                {renderAdminMenu()}
              </ul>

              <div className="d-flex align-items-center">
                <div className="position-relative me-3">
                  <Link to="/notifications" className="text-light">
                    <Bell size={20} />
                    {userData.notifications > 0 && (
                      <span className="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger">
                        {userData.notifications}
                      </span>
                    )}
                  </Link>
                </div>

                <div className="position-relative" ref={dropdownRef}>
                  <button
                    className="btn btn-link d-flex align-items-center text-decoration-none p-0"
                    onClick={() => setShowDropdown(!showDropdown)}
                    aria-expanded={showDropdown}
                  >
                    {profileImageUrl ? (
                      <img
                        src={profileImageUrl}
                        alt="Profile"
                        className="rounded-circle me-2"
                        style={{ width: "32px", height: "32px", objectFit: "cover" }}
                        onError={(e) => {
                          e.target.onerror = null;
                          e.target.src = "https://via.placeholder.com/32";
                        }}
                      />
                    ) : (
                      <div className="bg-secondary rounded-circle d-flex align-items-center justify-content-center me-2"
                        style={{ width: "32px", height: "32px" }}>
                        <User size={20} className="text-light" />
                      </div>
                    )}
                    <span className="d-none d-md-inline text-light">
                      {userData.username || userData.role.charAt(0).toUpperCase() + userData.role.slice(1) || "User"}
                    </span>
                  </button>

                  {showDropdown && (
                    <div className="position-absolute end-0 mt-2 bg-white rounded shadow-lg z-3"
                          style={{ minWidth: "200px" }}>
                      <div className="p-3 border-bottom">
                        <small className="text-muted">Signed in as</small>
                        <p className="mb-0 fw-bold">{userData.username}</p>
                        <small className="text-muted">Role: {userData.role.charAt(0).toUpperCase() + userData.role.slice(1)}</small>
                      </div>
                      <Link 
                        to="/profile" 
                        className="d-block px-3 py-2 text-dark text-decoration-none hover-bg-light"
                        onClick={() => setShowDropdown(false)}
                      >
                        <User size={16} className="me-2" /> Profile
                      </Link>
                      <Link 
                        to="/settings" 
                        className="d-block px-3 py-2 text-dark text-decoration-none hover-bg-light"
                        onClick={() => setShowDropdown(false)}
                      >
                        <Settings size={16} className="me-2" /> Settings
                      </Link>
                      <div className="border-top my-1"></div>
                      <button 
                        className="d-block w-100 text-start px-3 py-2 text-danger bg-transparent border-0 hover-bg-light"
                        onClick={handleLogout}
                      >
                        <LogOut size={16} className="me-2" /> Sign Out
                      </button>
                    </div>
                  )}
                </div>

          <ul className="navbar-nav me-auto">
            <li className="nav-item">
              <Link to="/dashboard" className="nav-link">
                Inventory
              </Link>
            </li>

            {/* Shopping List link with userId as a parameter */}
            <li className="nav-item">
              <Link to={`/shopping-list/${userId}`} className="nav-link">
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
            </>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
