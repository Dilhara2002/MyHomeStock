import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { 
  User, Bell, Moon, Database, HelpCircle, 
  LogOut, Save, Download, Upload, Trash2, 
  ArrowLeft, ChevronRight, Shield
} from 'lucide-react';

const Settings = () => {
  // --- State Management ---
  const [userData, setUserData] = useState({
    username: 'current_user',
    email: 'user@example.com',
    password: ''
  });

  const [notificationPrefs, setNotificationPrefs] = useState({
    expiryAlerts: true,
    lowStock: true,
    weeklySummary: false,
    notificationTime: 'Afternoon (1:00 PM)'
  });

  const [displayPrefs, setDisplayPrefs] = useState({
    theme: 'Dark',
    itemsPerPage: '25',
    compactView: false
  });

  // --- Handlers ---
  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Settings Saved');
  };

  const handleUserDataChange = (e) => {
    const { name, value } = e.target;
    setUserData(prev => ({ ...prev, [name]: value }));
  };

  const handleNotificationChange = (e) => {
    const { name, checked } = e.target;
    setNotificationPrefs(prev => ({ ...prev, [name]: checked }));
  };

  const handleDisplayChange = (e) => {
    const { name, value, type, checked } = e.target;
    setDisplayPrefs(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  // --- Variants ---
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.1 } }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: { y: 0, opacity: 1 }
  };

  // --- Components ---
  const SectionHeader = ({ icon: Icon, title, color }) => (
    <div className="d-flex align-items-center mb-4 pb-3" style={{ borderBottom: '1px solid rgba(255,255,255,0.08)' }}>
      <div style={{
        padding: '10px',
        borderRadius: '10px',
        background: `${color}20`,
        color: color,
        marginRight: '15px'
      }}>
        <Icon size={20} />
      </div>
      <h4 className="m-0 fw-bold" style={{ color: '#f8fafc', fontSize: '1.2rem' }}>{title}</h4>
    </div>
  );

  const inputStyle = {
    width: '100%',
    padding: '12px 15px',
    borderRadius: '12px',
    border: '1px solid rgba(255, 255, 255, 0.1)',
    backgroundColor: 'rgba(15, 23, 42, 0.6)', 
    color: '#e2e8f0',
    fontSize: '0.95rem',
    outline: 'none',
    transition: 'border-color 0.3s'
  };

  return (
    <div style={{
      minHeight: '100vh',
      backgroundColor: '#0f172a',
      color: '#f8fafc',
      paddingTop: '40px',
      paddingBottom: '80px',
      fontFamily: '"Inter", sans-serif',
      position: 'relative',
      overflowX: 'hidden'
    }}>
      
      {/* Background Glow */}
      <div style={{
        position: 'absolute',
        top: '-10%',
        right: '-10%',
        width: '600px',
        height: '600px',
        background: 'radial-gradient(circle, rgba(129, 140, 248, 0.1) 0%, rgba(15, 23, 42, 0) 70%)',
        zIndex: 0,
        pointerEvents: 'none'
      }} />

      <div className="container" style={{ position: 'relative', zIndex: 1 }}>
        
        {/* --- COMPACT HEADER --- */}
        <div className="d-flex align-items-center mb-5 pb-3" style={{ borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
          
          {/* Circular Back Arrow */}
          <Link to="/" className="text-decoration-none me-4">
            <motion.div 
              whileHover={{ scale: 1.1, backgroundColor: 'rgba(56, 189, 248, 0.2)', borderColor: '#38bdf8' }}
              whileTap={{ scale: 0.9 }}
              style={{
                width: '50px',
                height: '50px',
                borderRadius: '50%',
                backgroundColor: 'rgba(255,255,255,0.05)',
                border: '1px solid rgba(255,255,255,0.1)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#e2e8f0',
                transition: 'all 0.2s ease'
              }}
            >
              <ArrowLeft size={24} />
            </motion.div>
          </Link>

          {/* Title Text */}
          <div>
            <motion.h1 
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              className="fw-bold m-0 display-6"
            >
              Settings <span style={{ color: '#38bdf8' }}>& Preferences</span>
            </motion.h1>
          </div>
        </div>

        {/* --- Form Container --- */}
        <motion.form 
          onSubmit={handleSubmit}
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="row g-4 justify-content-center"
        >
          
          {/* --- Column 1 --- */}
          <div className="col-lg-5">
            
            {/* Account Card */}
            <motion.div variants={itemVariants} className="card border-0 mb-4" style={{
               backgroundColor: 'rgba(30, 41, 59, 0.7)',
               backdropFilter: 'blur(12px)',
               borderRadius: '20px',
               border: '1px solid rgba(255, 255, 255, 0.08)',
               overflow: 'hidden'
            }}>
              <div className="card-body p-4">
                <SectionHeader icon={User} title="Account Settings" color="#38bdf8" />
                <div className="mb-3">
                  <label className="form-label small text-muted">Username</label>
                  <input type="text" name="username" value={userData.username} onChange={handleUserDataChange} style={inputStyle} />
                </div>
                <div className="mb-3">
                  <label className="form-label small text-muted">Email Address</label>
                  <input type="email" name="email" value={userData.email} onChange={handleUserDataChange} style={inputStyle} />
                </div>
                <div className="mb-4">
                  <label className="form-label small text-muted">New Password</label>
                  <input type="password" name="password" placeholder="••••••••" value={userData.password} onChange={handleUserDataChange} style={inputStyle} />
                </div>
                <button className="btn w-100 border-0 py-2 d-flex align-items-center justify-content-center" style={{
                  background: 'linear-gradient(135deg, #38bdf8 0%, #3b82f6 100%)', color: 'white', borderRadius: '10px', fontWeight: '600'
                }}><Save size={18} className="me-2" /> Update Profile</button>
              </div>
            </motion.div>

            {/* Notification Card */}
            <motion.div variants={itemVariants} className="card border-0" style={{
               backgroundColor: 'rgba(30, 41, 59, 0.7)', backdropFilter: 'blur(12px)', borderRadius: '20px', border: '1px solid rgba(255, 255, 255, 0.08)'
            }}>
              <div className="card-body p-4">
                <SectionHeader icon={Bell} title="Notifications" color="#f472b6" />
                {['expiryAlerts', 'lowStock', 'weeklySummary'].map((key) => (
                  <div className="d-flex align-items-center justify-content-between mb-3" key={key}>
                    <label className="m-0 text-light" style={{ textTransform: 'capitalize' }}>{key.replace(/([A-Z])/g, ' $1').trim()}</label>
                    <div className="form-check form-switch">
                      <input className="form-check-input" type="checkbox" name={key} checked={notificationPrefs[key]} onChange={handleNotificationChange} 
                        style={{ transform: 'scale(1.2)', cursor: 'pointer', backgroundColor: notificationPrefs[key] ? '#f472b6' : '#475569', border: 'none' }} />
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
          </div>

          {/* --- Column 2 --- */}
          <div className="col-lg-5">
            
            {/* Display Settings */}
            <motion.div variants={itemVariants} className="card border-0 mb-4" style={{
               backgroundColor: 'rgba(30, 41, 59, 0.7)', backdropFilter: 'blur(12px)', borderRadius: '20px', border: '1px solid rgba(255, 255, 255, 0.08)'
            }}>
              <div className="card-body p-4">
                <SectionHeader icon={Moon} title="Display & Appearance" color="#818cf8" />
                <div className="row g-3">
                  <div className="col-6">
                    <label className="form-label small text-muted">Theme</label>
                    <select name="theme" value={displayPrefs.theme} onChange={handleDisplayChange} style={inputStyle}>
                      <option>Dark Premium</option><option>Light</option>
                    </select>
                  </div>
                  <div className="col-6">
                    <label className="form-label small text-muted">Items / Page</label>
                    <select name="itemsPerPage" value={displayPrefs.itemsPerPage} onChange={handleDisplayChange} style={inputStyle}>
                      <option>10</option><option>25</option><option>50</option>
                    </select>
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Data Management */}
            <motion.div variants={itemVariants} className="card border-0 mb-4" style={{
               backgroundColor: 'rgba(30, 41, 59, 0.7)', backdropFilter: 'blur(12px)', borderRadius: '20px', border: '1px solid rgba(255, 255, 255, 0.08)'
            }}>
              <div className="card-body p-4">
                <SectionHeader icon={Database} title="Data Management" color="#4ade80" />
                <div className="d-grid gap-2">
                  <button className="btn text-white d-flex align-items-center justify-content-center" style={{ background: 'rgba(255, 255, 255, 0.05)', border: '1px solid rgba(255,255,255,0.1)', padding: '10px', borderRadius: '10px' }}>
                    <Download size={16} className="me-2" /> Export to CSV
                  </button>
                  <button className="btn text-danger d-flex align-items-center justify-content-center mt-2" style={{ background: 'rgba(239, 68, 68, 0.1)', border: 'none', padding: '10px', borderRadius: '10px' }}>
                    <Trash2 size={16} className="me-2" /> Reset All Inventory
                  </button>
                </div>
              </div>
            </motion.div>

            {/* Support */}
            <motion.div variants={itemVariants} className="card border-0" style={{
               backgroundColor: 'rgba(30, 41, 59, 0.7)', backdropFilter: 'blur(12px)', borderRadius: '20px', border: '1px solid rgba(255, 255, 255, 0.08)'
            }}>
               <div className="card-body p-4">
                  <button className="btn w-100 d-flex align-items-center justify-content-center" style={{ background: 'rgba(244, 114, 182, 0.1)', color: '#f472b6', border: 'none', padding: '12px', borderRadius: '10px', fontWeight: '600' }}>
                    <LogOut size={18} className="me-2" /> Log Out
                  </button>
               </div>
            </motion.div>
          </div>
        </motion.form>
      </div>
    </div>
  );
};

export default Settings;