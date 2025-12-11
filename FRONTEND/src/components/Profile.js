import React, { useState, useEffect, useCallback } from "react";
import axios from "axios";
import { useNavigate, Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { 
  User, Mail, Camera, Save, LogOut, 
  ArrowLeft, CheckCircle, AlertCircle, X, Shield, Calendar 
} from "lucide-react";

// --- Notification Component ---
const Notification = ({ message, type, onClose }) => {
  const isSuccess = type === "success";
  return (
    <motion.div
      initial={{ opacity: 0, y: -50, x: '-50%' }}
      animate={{ opacity: 1, y: 0, x: '-50%' }}
      exit={{ opacity: 0, y: -50, x: '-50%' }}
      style={{
        position: 'fixed', top: '20px', left: '50%', zIndex: 1100,
        backgroundColor: isSuccess ? 'rgba(6, 182, 212, 0.9)' : 'rgba(239, 68, 68, 0.9)',
        color: 'white', padding: '12px 24px', borderRadius: '50px',
        backdropFilter: 'blur(10px)', display: 'flex', alignItems: 'center', gap: '12px',
        boxShadow: '0 10px 30px rgba(0,0,0,0.3)', border: '1px solid rgba(255,255,255,0.1)'
      }}
    >
      {isSuccess ? <CheckCircle size={20} /> : <AlertCircle size={20} />}
      <span style={{ fontWeight: 500 }}>{message}</span>
      <button onClick={onClose} style={{ background: 'none', border: 'none', color: 'white', cursor: 'pointer', opacity: 0.8 }}>
        <X size={18} />
      </button>
    </motion.div>
  );
};

const Profile = () => {
  // --- State ---
  const [profileData, setProfileData] = useState({ name: "", email: "", role: "User", joined: new Date().toLocaleDateString() });
  const [imagePreview, setImagePreview] = useState(null);
  const [selectedFile, setSelectedFile] = useState(null);
  const [notification, setNotification] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const navigate = useNavigate();

  // --- Styles ---
  const cardStyle = {
    backgroundColor: '#1e293b', // Slate 800
    borderRadius: '20px',
    border: '1px solid rgba(255, 255, 255, 0.05)',
    boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)',
    overflow: 'hidden'
  };

  const inputStyle = {
    background: '#0f172a', // Darker background for inputs
    border: '1px solid rgba(255,255,255,0.1)',
    color: 'white',
    borderRadius: '12px',
    padding: '12px 15px',
    width: '100%',
    outline: 'none',
    transition: 'all 0.2s',
    height: '50px'
  };

  const labelStyle = {
    color: '#cbd5e1', // Light Gray
    fontSize: '0.85rem',
    fontWeight: '600',
    marginBottom: '8px',
    display: 'block'
  };

  // --- Logic ---
  const fetchProfile = useCallback(async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) return navigate("/login");

      const response = await axios.get("http://localhost:5002/users/profile", {
        headers: { Authorization: `Bearer ${token}` },
      });

      setProfileData({
        name: response.data.name,
        email: response.data.email,
        role: response.data.role || "User",
        joined: new Date().toLocaleDateString() 
      });

      const imageRes = await fetch("http://localhost:5002/users/profile/image", {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (imageRes.ok) {
        const blob = await imageRes.blob();
        setImagePreview(URL.createObjectURL(blob));
      }
    } catch (error) {
      showNotification("Failed to load profile", "error");
    }
  }, [navigate]);

  useEffect(() => {
    fetchProfile();
  }, [fetchProfile]);

  const showNotification = (message, type) => {
    setNotification({ message, type });
    setTimeout(() => setNotification(null), 3000);
  };

  const handleFileSelect = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (file.size > 2 * 1024 * 1024) {
      showNotification("File too large (Max 2MB)", "error");
      return;
    }
    if (!file.type.match(/image\/(jpeg|png|webp)/)) {
      showNotification("Only JPG, PNG, or WebP allowed", "error");
      return;
    }

    setSelectedFile(file);
    const reader = new FileReader();
    reader.onloadend = () => setImagePreview(reader.result);
    reader.readAsDataURL(file);
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const token = localStorage.getItem("token");
      const formData = new FormData();
      formData.append("name", profileData.name);
      if (selectedFile) formData.append("profilePicture", selectedFile);

      await axios.put("http://localhost:5002/users/profile/image", formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data",
        },
      });

      showNotification("Profile updated successfully!", "success");
      setTimeout(() => window.location.reload(), 1000);
    } catch (error) {
      showNotification(error.response?.data?.message || "Update failed", "error");
    } finally {
      setIsLoading(false);
    }
  };

  const handleSignOut = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/login");
  };

  return (
    <div style={{
      minHeight: '100vh',
      backgroundColor: '#0f172a',
      color: '#f8fafc',
      paddingTop: '40px',
      paddingBottom: '80px',
      fontFamily: '"Inter", sans-serif',
      position: 'relative'
    }}>
      
      {/* Background Glow */}
      <div style={{
        position: 'absolute', top: 0, left: 0, width: '100%', height: '500px',
        background: 'radial-gradient(circle at 50% -20%, rgba(6, 182, 212, 0.15), transparent 70%)',
        zIndex: 0, pointerEvents: 'none'
      }} />

      <style>{`
        input:focus { border-color: #06b6d4 !important; box-shadow: 0 0 0 4px rgba(6, 182, 212, 0.1) !important; }
        input:disabled { opacity: 0.6; cursor: not-allowed; background: rgba(15, 23, 42, 0.4) !important; }
      `}</style>

      {/* Notifications */}
      <AnimatePresence>
        {notification && <Notification {...notification} onClose={() => setNotification(null)} />}
      </AnimatePresence>

      <div className="container" style={{ position: 'relative', zIndex: 1, maxWidth: '1000px' }}>
        
        {/* Header */}
        <div className="d-flex align-items-center mb-5">
          <Link to="/" className="text-decoration-none me-4">
            <motion.div 
              whileHover={{ scale: 1.1, backgroundColor: 'rgba(6, 182, 212, 0.2)', borderColor: '#06b6d4' }}
              whileTap={{ scale: 0.9 }}
              style={{
                width: '50px', height: '50px', borderRadius: '50%',
                backgroundColor: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)',
                display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#e2e8f0'
              }}
            >
              <ArrowLeft size={24} />
            </motion.div>
          </Link>
          <div>
            <h1 className="fw-bold m-0 display-6">
              User <span style={{ color: '#06b6d4' }}>Profile</span>
            </h1>
            <p className="m-0" style={{ color: '#94a3b8' }}>Manage your account settings and preferences.</p>
          </div>
        </div>

        <div className="row g-4">
          
          {/* --- Left Column: Identity --- */}
          <div className="col-lg-4">
            <motion.div 
              initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }}
              style={cardStyle}
              className="h-100 p-4 d-flex flex-column align-items-center text-center"
            >
              {/* Avatar */}
              <div className="position-relative mb-4">
                <div style={{
                  width: '150px', height: '150px', borderRadius: '50%',
                  border: '4px solid #0f172a',
                  overflow: 'hidden', background: '#334155',
                  boxShadow: '0 0 0 4px rgba(6, 182, 212, 0.2)'
                }}>
                  {imagePreview ? (
                    <img src={imagePreview} alt="Profile" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                  ) : (
                    <div className="w-100 h-100 d-flex align-items-center justify-content-center">
                      <User size={60} color="#94a3b8" />
                    </div>
                  )}
                </div>
                
                <label htmlFor="file-upload" 
                  style={{
                    position: 'absolute', bottom: '5px', right: '5px',
                    width: '40px', height: '40px', borderRadius: '50%',
                    background: '#06b6d4', color: 'white',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    cursor: 'pointer', border: '3px solid #1e293b',
                    boxShadow: '0 4px 6px rgba(0,0,0,0.2)'
                  }}
                >
                  <Camera size={20} />
                </label>
                <input id="file-upload" type="file" style={{ display: 'none' }} accept="image/*" onChange={handleFileSelect} />
              </div>

              <h3 className="fw-bold text-white mb-1">{profileData.name || "User"}</h3>
              <span className="badge mb-4" style={{ backgroundColor: 'rgba(6, 182, 212, 0.1)', color: '#06b6d4', padding: '8px 16px', borderRadius: '20px' }}>
                {profileData.role}
              </span>

              {/* Identity Footer */}
              <div className="w-100 pt-4 mt-auto border-top border-secondary border-opacity-25">
                <div className="d-flex justify-content-between mb-3 text-start">
                  <span className="small fw-semibold" style={{ color: '#cbd5e1' }}>
                    <Calendar size={14} className="me-2" style={{ color: '#06b6d4' }}/>Joined
                  </span>
                  <span className="text-white small fw-bold">{profileData.joined}</span>
                </div>
                <div className="d-flex justify-content-between text-start">
                  <span className="small fw-semibold" style={{ color: '#cbd5e1' }}>
                    <Shield size={14} className="me-2" style={{ color: '#06b6d4' }}/>Status
                  </span>
                  <span className="text-success small fw-bold">Active</span>
                </div>
              </div>
            </motion.div>
          </div>

          {/* --- Right Column: Details Form --- */}
          <div className="col-lg-8">
            <motion.div 
              initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }}
              style={cardStyle}
              className="h-100 p-4 p-md-5"
            >
              <h4 className="fw-bold text-white mb-4">Account Details</h4>
              
              <form onSubmit={handleUpdate}>
                <div className="row g-4">
                  
                  <div className="col-md-6">
                    <label style={labelStyle}>FULL NAME</label>
                    <div className="position-relative">
                      <User size={18} style={{ position: 'absolute', left: '15px', top: '16px', color: '#64748b' }} />
                      <input
                        type="text"
                        value={profileData.name}
                        onChange={(e) => setProfileData(prev => ({ ...prev, name: e.target.value }))}
                        required
                        style={{ ...inputStyle, paddingLeft: '45px' }}
                      />
                    </div>
                  </div>

                  <div className="col-md-6">
                    <label style={labelStyle}>EMAIL ADDRESS</label>
                    <div className="position-relative">
                      <Mail size={18} style={{ position: 'absolute', left: '15px', top: '16px', color: '#64748b' }} />
                      <input
                        type="email"
                        value={profileData.email}
                        disabled
                        style={{ ...inputStyle, paddingLeft: '45px', background: 'rgba(15, 23, 42, 0.4)', cursor: 'not-allowed' }}
                      />
                    </div>
                  </div>

                  <div className="col-12">
                    <label style={labelStyle}>BIO (OPTIONAL)</label>
                    <textarea 
                      className="form-control" 
                      rows="4" 
                      placeholder="Tell us about yourself..."
                      style={{ 
                        ...inputStyle, 
                        height: 'auto', 
                        resize: 'none',
                        border: '1px solid rgba(255,255,255,0.1)'
                      }}
                    ></textarea>
                  </div>

                </div>

                <div className="d-flex justify-content-between align-items-center mt-5 pt-4 border-top border-secondary border-opacity-25">
                  <button
                    type="button"
                    onClick={handleSignOut}
                    className="btn d-flex align-items-center text-danger fw-bold px-0"
                    style={{ background: 'transparent', border: 'none' }}
                  >
                    <LogOut size={20} className="me-2"/> Sign Out
                  </button>

                  <motion.button
                    whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.95 }}
                    type="submit"
                    disabled={isLoading}
                    className="btn fw-bold text-white px-5 py-2 d-flex align-items-center"
                    style={{
                      background: 'linear-gradient(135deg, #06b6d4 0%, #3b82f6 100%)',
                      borderRadius: '12px', border: 'none',
                      boxShadow: '0 4px 15px rgba(6, 182, 212, 0.3)'
                    }}
                  >
                    {isLoading ? <span className="spinner-border spinner-border-sm me-2"/> : <Save size={18} className="me-2"/>}
                    Save Changes
                  </motion.button>
                </div>

              </form>
            </motion.div>
          </div>

        </div>
      </div>
    </div>
  );
};

export default Profile;