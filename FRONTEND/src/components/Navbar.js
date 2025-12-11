import React, { useState, useEffect, useRef } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import axios from "axios";
import { 
  ShoppingCart, User, LogOut, Settings, Bell, 
  Menu, X, Home, Box, Shield, ChevronDown 
} from "lucide-react";
import logo from './logo.png'; // Make sure this path is correct

const Navbar = () => {
  // --- State ---
  const [userData, setUserData] = useState({
    profilePicture: "", username: "", role: "", notifications: 0
  });
  const [profileImageUrl, setProfileImageUrl] = useState("");
  const [showDropdown, setShowDropdown] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  
  const navigate = useNavigate();
  const location = useLocation();
  const dropdownRef = useRef(null);

  // --- Effects ---
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

  const checkAuthAndFetchProfile = async () => {
    const token = localStorage.getItem("token");
    const authStatus = !!token;
    setIsAuthenticated(authStatus);

    if (!authStatus) {
      setUserData({ profilePicture: "", username: "", role: "", notifications: 0 });
      setProfileImageUrl("");
      return;
    }

    try {
      const response = await axios.get("http://localhost:5002/users/profile", {
        headers: { Authorization: `Bearer ${token}` },
      });

      const profilePicturePath = response.data.profilePicture || "";
      if (profilePicturePath) fetchProfileImage(profilePicturePath);

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
      if (error.response?.status === 401) handleLogout();
    }
  };

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
        if (parsedData.profilePicture) fetchProfileImage(parsedData.profilePicture);
      } catch (e) { console.error(e); }
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

  // --- Handlers ---
  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("userData");
    setIsAuthenticated(false);
    setUserData({ profilePicture: "", username: "", role: "", notifications: 0 });
    setProfileImageUrl("");
    navigate("/login");
    window.dispatchEvent(new Event("authChange"));
  };

  const isActive = (path) => location.pathname === path;

  // --- Styles ---
  const navLinkStyle = (path) => ({
    color: isActive(path) ? '#38bdf8' : '#94a3b8',
    fontWeight: isActive(path) ? '600' : '400',
    textDecoration: 'none',
    display: 'flex',
    alignItems: 'center',
    padding: '8px 16px',
    borderRadius: '8px',
    background: isActive(path) ? 'rgba(56, 189, 248, 0.1)' : 'transparent',
    transition: 'all 0.2s ease',
    cursor: 'pointer'
  });

  return (
    <motion.nav 
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      style={{
        position: 'sticky', top: 0, zIndex: 1000,
        backgroundColor: 'rgba(15, 23, 42, 0.8)',
        backdropFilter: 'blur(12px)',
        borderBottom: '1px solid rgba(255, 255, 255, 0.05)',
        padding: '12px 0'
      }}
    >
      <div className="container d-flex justify-content-between align-items-center">
        
        {/* Logo */}
        <Link to="/" className="text-decoration-none d-flex align-items-center">
          <img 
            src={logo} alt="Logo" 
            style={{ width: "32px", height: "32px", marginRight: '10px' }}
            onError={(e) => e.target.src = "https://via.placeholder.com/32"} 
          />
          <span style={{ 
            fontSize: '1.25rem', fontWeight: 'bold', 
            background: 'linear-gradient(90deg, #38bdf8, #818cf8)',
            WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent'
          }}>
            MyHomeStock
          </span>
        </Link>

        {/* Mobile Menu Toggle */}
        {isAuthenticated && (
          <button 
            className="d-lg-none btn btn-link text-white p-0"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          >
            {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        )}

        {/* Desktop Menu */}
        {isAuthenticated && (
          <div className="d-none d-lg-flex align-items-center gap-4">
            
            {/* Links */}
            <div className="d-flex align-items-center gap-2">
              <Link to="/Home" style={navLinkStyle('/Home')}>
                <Home size={18} className="me-2"/> Home
              </Link>
              <Link to="/inventory" style={navLinkStyle('/inventory')}>
                <Box size={18} className="me-2"/> Inventory
              </Link>
              <Link to="/Shoppinglist" style={navLinkStyle('/Shoppinglist')}>
                <ShoppingCart size={18} className="me-2"/> Shopping List
              </Link>
              {userData.role === 'admin' && (
                <Link to="/admin" style={navLinkStyle('/admin')}>
                  <Shield size={18} className="me-2"/> Admin
                </Link>
              )}
            </div>

            {/* Separator */}
            <div style={{ width: '1px', height: '24px', backgroundColor: 'rgba(255,255,255,0.1)' }}></div>

            {/* User Controls */}
            <div className="d-flex align-items-center gap-3">
              
              {/* Notification Bell */}
              {/* <div className="position-relative cursor-pointer" style={{ color: '#94a3b8' }}>
                <Bell size={20} />
                {userData.notifications > 0 && (
                  <span className="position-absolute top-0 start-100 translate-middle p-1 bg-danger border border-light rounded-circle" style={{ width: '8px', height: '8px' }}></span>
                )}
              </div> */}

              {/* User Dropdown */}
              <div className="position-relative" ref={dropdownRef}>
                <button 
                  onClick={() => setShowDropdown(!showDropdown)}
                  className="btn d-flex align-items-center p-1 ps-2 pe-3 rounded-pill border-0"
                  style={{ background: 'rgba(255,255,255,0.05)', color: 'white' }}
                >
                  <div style={{ width: '32px', height: '32px', borderRadius: '50%', overflow: 'hidden', marginRight: '8px' }}>
                    {profileImageUrl ? (
                      <img src={profileImageUrl} alt="User" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                    ) : (
                      <div className="w-100 h-100 bg-secondary d-flex align-items-center justify-content-center">
                        <User size={16} />
                      </div>
                    )}
                  </div>
                  <span className="small fw-semibold me-2">{userData.username || "User"}</span>
                  <ChevronDown size={14} className="text-muted" />
                </button>

                {/* Dropdown Menu */}
                <AnimatePresence>
                  {showDropdown && (
                    <motion.div 
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 10 }}
                      style={{
                        position: 'absolute', top: '120%', right: 0, width: '220px',
                        background: '#1e293b', borderRadius: '16px',
                        border: '1px solid rgba(255,255,255,0.1)',
                        boxShadow: '0 10px 30px rgba(0,0,0,0.3)',
                        overflow: 'hidden', padding: '8px'
                      }}
                    >
                      <div className="px-3 py-2 mb-2 border-bottom border-secondary border-opacity-25">
                        <p className="m-0 text-white fw-bold">{userData.username}</p>
                        <p className="m-0 text-muted small text-capitalize">{userData.role}</p>
                      </div>
                      
                      <Link to="/Profile" className="d-flex align-items-center px-3 py-2 rounded text-decoration-none text-light hover-bg-light" style={{ transition: '0.2s', ':hover': { background: 'rgba(255,255,255,0.05)' } }} onClick={() => setShowDropdown(false)}>
                        <User size={16} className="me-2 text-info"/> Profile
                      </Link>
                      <Link to="/settings" className="d-flex align-items-center px-3 py-2 rounded text-decoration-none text-light" onClick={() => setShowDropdown(false)}>
                        <Settings size={16} className="me-2 text-warning"/> Settings
                      </Link>
                      
                      <div className="my-1 border-top border-secondary border-opacity-25"></div>
                      
                      <button onClick={handleLogout} className="d-flex align-items-center w-100 px-3 py-2 rounded border-0 bg-transparent text-danger">
                        <LogOut size={16} className="me-2"/> Sign Out
                      </button>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

            </div>
          </div>
        )}
      </div>

      {/* Mobile Menu (Collapsible) */}
      <AnimatePresence>
        {isMobileMenuOpen && isAuthenticated && (
          <motion.div 
            initial={{ height: 0 }}
            animate={{ height: 'auto' }}
            exit={{ height: 0 }}
            className="d-lg-none bg-dark border-top border-secondary border-opacity-25 overflow-hidden"
          >
            <div className="container py-3 d-flex flex-column gap-2">
              <Link to="/Home" className="text-decoration-none text-light p-2" onClick={() => setIsMobileMenuOpen(false)}>Home</Link>
              <Link to="/inventory" className="text-decoration-none text-light p-2" onClick={() => setIsMobileMenuOpen(false)}>Inventory</Link>
              <Link to="/Shoppinglist" className="text-decoration-none text-light p-2" onClick={() => setIsMobileMenuOpen(false)}>Shopping List</Link>
              <Link to="/Profile" className="text-decoration-none text-light p-2" onClick={() => setIsMobileMenuOpen(false)}>Profile</Link>
              <button onClick={handleLogout} className="btn text-danger text-start p-2">Sign Out</button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

    </motion.nav>
  );
};

export default Navbar;