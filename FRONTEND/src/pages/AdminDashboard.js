import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Shield, 
  Trash2, 
  LogOut, 
  Search, 
  User, 
  CheckCircle, 
  AlertCircle, 
  X,
  Mail,
  MoreVertical
} from "lucide-react";

const AdminDashboard = () => {
  // --- State ---
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  
  // UI State
  const [notification, setNotification] = useState(null); // { message, type }
  const [deleteId, setDeleteId] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  
  const navigate = useNavigate();

  // --- Effects ---
  useEffect(() => {
    fetchUsers();
  }, [navigate]);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem("token");
      if (!token) {
        navigate("/login");
        return;
      }
      const response = await axios.get("http://localhost:5002/admin/users", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setUsers(response.data);
    } catch (error) {
      if (error.response?.status === 401) {
        navigate("/login");
      } else {
        showNotification("Error fetching users", "error");
      }
    } finally {
      setLoading(false);
    }
  };

  // --- Handlers ---
  const showNotification = (message, type) => {
    setNotification({ message, type });
    setTimeout(() => setNotification(null), 3000);
  };

  const handleDeleteUser = async () => {
    try {
      const token = localStorage.getItem("token");
      await axios.delete(`http://localhost:5002/admin/users/${deleteId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setUsers(users.filter((user) => user._id !== deleteId));
      showNotification("User deleted successfully", "success");
    } catch (error) {
      showNotification("Failed to delete user", "error");
    } finally {
      setDeleteId(null);
    }
  };

  const handleUpdateRole = async (userId, newRole) => {
    try {
      const token = localStorage.getItem("token");
      // Optimistic update
      setUsers(users.map((user) => user._id === userId ? { ...user, role: newRole } : user));
      
      await axios.put(
        `http://localhost:5002/admin/users/${userId}/role`,
        { role: newRole },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      showNotification(`Role updated to ${newRole}`, "success");
    } catch (error) {
      showNotification("Failed to update role", "error");
      fetchUsers(); // Revert on error
    }
  };

  const handleSignOut = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };

  // Filter users based on search
  const filteredUsers = users.filter(user => 
    user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // --- Render Helpers ---
  const Notification = ({ message, type, onClose }) => (
    <motion.div
      initial={{ opacity: 0, y: -50, x: '-50%' }}
      animate={{ opacity: 1, y: 0, x: '-50%' }}
      exit={{ opacity: 0, y: -50, x: '-50%' }}
      style={{
        position: 'fixed', top: '20px', left: '50%', zIndex: 1050,
        backgroundColor: type === 'success' ? 'rgba(16, 185, 129, 0.9)' : 'rgba(239, 68, 68, 0.9)',
        color: 'white', padding: '12px 24px', borderRadius: '50px',
        backdropFilter: 'blur(10px)', display: 'flex', alignItems: 'center', gap: '12px',
        boxShadow: '0 10px 30px rgba(0,0,0,0.2)'
      }}
    >
      {type === 'success' ? <CheckCircle size={20} /> : <AlertCircle size={20} />}
      <span style={{ fontWeight: 500 }}>{message}</span>
      <button onClick={onClose} style={{ background: 'none', border: 'none', color: 'white', cursor: 'pointer' }}><X size={18} /></button>
    </motion.div>
  );

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
        position: 'absolute', top: 0, left: 0, width: '100%', height: '400px',
        background: 'radial-gradient(circle at 50% -20%, rgba(6, 182, 212, 0.15), transparent 70%)',
        zIndex: 0, pointerEvents: 'none'
      }} />

      {/* Toast Notification */}
      <AnimatePresence>
        {notification && <Notification {...notification} onClose={() => setNotification(null)} />}
      </AnimatePresence>

      {/* Delete Confirmation Modal */}
      <AnimatePresence>
        {deleteId && (
          <div style={{
            position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
            background: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(5px)',
            display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 1100
          }}>
            <motion.div 
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              style={{
                background: '#1e293b', padding: '30px', borderRadius: '20px',
                border: '1px solid rgba(255,255,255,0.1)', maxWidth: '400px', width: '90%'
              }}
            >
              <div className="d-flex justify-content-center mb-4">
                <div style={{ width: '60px', height: '60px', borderRadius: '50%', background: 'rgba(239, 68, 68, 0.2)', color: '#ef4444', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <Trash2 size={30} />
                </div>
              </div>
              <h4 className="fw-bold text-center mb-2">Delete User?</h4>
              <p className="text-muted text-center mb-4">Are you sure you want to remove this user? This action cannot be undone.</p>
              <div className="d-flex gap-3">
                <button onClick={() => setDeleteId(null)} className="btn flex-grow-1 text-white" style={{ background: 'rgba(255,255,255,0.1)', borderRadius: '10px' }}>Cancel</button>
                <button onClick={handleDeleteUser} className="btn flex-grow-1 text-white" style={{ background: '#ef4444', borderRadius: '10px' }}>Delete</button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      <div className="container" style={{ position: 'relative', zIndex: 1 }}>
        
        {/* --- Header --- */}
        <div className="d-flex flex-column flex-md-row justify-content-between align-items-center mb-5 pb-3" style={{ borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
          <div className="mb-3 mb-md-0">
            <h1 className="fw-bold m-0 display-6 d-flex align-items-center">
              <Shield size={32} className="me-3" style={{ color: '#06b6d4' }} />
              Admin <span style={{ color: '#06b6d4' }}>Dashboard</span>
            </h1>
            <p className="text-muted mt-2 mb-0">Manage system users and access roles.</p>
          </div>
          
          <button 
            onClick={handleSignOut}
            className="btn d-flex align-items-center"
            style={{ 
              backgroundColor: 'rgba(239, 68, 68, 0.1)', 
              color: '#f87171', 
              border: '1px solid rgba(239, 68, 68, 0.2)',
              borderRadius: '50px',
              padding: '10px 24px',
              fontWeight: '600'
            }}
          >
            <LogOut size={18} className="me-2" /> Sign Out
          </button>
        </div>

        {/* --- Table Card --- */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="card border-0"
          style={{
            backgroundColor: 'rgba(30, 41, 59, 0.7)',
            backdropFilter: 'blur(12px)',
            borderRadius: '20px',
            border: '1px solid rgba(255, 255, 255, 0.08)',
            overflow: 'hidden'
          }}
        >
          {/* Toolbar */}
          <div className="card-header border-0 p-4" style={{ backgroundColor: 'transparent' }}>
            <div className="d-flex justify-content-between align-items-center">
              <h5 className="fw-bold m-0 text-white">All Users</h5>
              <div style={{ position: 'relative', width: '250px' }}>
                <Search size={18} style={{ position: 'absolute', left: '12px', top: '10px', color: '#94a3b8' }} />
                <input 
                  type="text" 
                  placeholder="Search users..." 
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  style={{
                    width: '100%', padding: '8px 15px 8px 40px', borderRadius: '10px',
                    border: '1px solid rgba(255, 255, 255, 0.1)', backgroundColor: 'rgba(15, 23, 42, 0.6)',
                    color: '#e2e8f0', outline: 'none'
                  }}
                />
              </div>
            </div>
          </div>

          <div className="card-body p-0">
            {loading ? (
              <div className="text-center py-5">
                <div className="spinner-border text-info" role="status"></div>
                <p className="text-muted mt-2">Loading data...</p>
              </div>
            ) : (
              <div className="table-responsive">
                <table className="table mb-0" style={{ color: '#e2e8f0' }}>
                  <thead style={{ backgroundColor: 'rgba(15, 23, 42, 0.5)' }}>
                    <tr>
                      <th className="px-4 py-3 text-muted fw-light" style={{ border: 'none' }}>USER</th>
                      <th className="px-4 py-3 text-muted fw-light" style={{ border: 'none' }}>EMAIL</th>
                      <th className="px-4 py-3 text-muted fw-light" style={{ border: 'none' }}>ROLE</th>
                      <th className="px-4 py-3 text-muted fw-light text-end" style={{ border: 'none' }}>ACTIONS</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredUsers.length === 0 ? (
                      <tr>
                        <td colSpan="4" className="text-center py-5 text-muted">No users found matching your search.</td>
                      </tr>
                    ) : (
                      filteredUsers.map((user) => (
                        <motion.tr 
                          key={user._id}
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          whileHover={{ backgroundColor: 'rgba(255,255,255,0.02)' }}
                          style={{ borderBottom: '1px solid rgba(255,255,255,0.05)' }}
                        >
                          <td className="px-4 py-3 align-middle">
                            <div className="d-flex align-items-center">
                              <div style={{ width: '40px', height: '40px', borderRadius: '50%', background: '#334155', display: 'flex', alignItems: 'center', justifyContent: 'center', marginRight: '15px' }}>
                                <User size={20} color="#cbd5e1" />
                              </div>
                              <span className="fw-bold">{user.name}</span>
                            </div>
                          </td>
                          <td className="px-4 py-3 align-middle text-muted">
                            <div className="d-flex align-items-center">
                              <Mail size={16} className="me-2 opacity-50" />
                              {user.email}
                            </div>
                          </td>
                          <td className="px-4 py-3 align-middle">
                            <select
                              value={user.role}
                              onChange={(e) => handleUpdateRole(user._id, e.target.value)}
                              style={{
                                padding: '6px 12px',
                                borderRadius: '8px',
                                border: '1px solid rgba(255,255,255,0.1)',
                                backgroundColor: user.role === 'admin' ? 'rgba(6, 182, 212, 0.15)' : 'rgba(59, 130, 246, 0.15)',
                                color: user.role === 'admin' ? '#22d3ee' : '#60a5fa',
                                fontWeight: '600',
                                fontSize: '0.85rem',
                                outline: 'none',
                                cursor: 'pointer'
                              }}
                            >
                              <option value="user" style={{ background: '#1e293b', color: '#94a3b8' }}>User</option>
                              <option value="admin" style={{ background: '#1e293b', color: '#22d3ee' }}>Admin</option>
                            </select>
                          </td>
                          <td className="px-4 py-3 align-middle text-end">
                            <button
                              onClick={() => setDeleteId(user._id)}
                              className="btn btn-sm"
                              style={{
                                color: '#ef4444',
                                background: 'rgba(239, 68, 68, 0.1)',
                                border: 'none',
                                padding: '8px',
                                borderRadius: '8px',
                                transition: 'all 0.2s'
                              }}
                            >
                              <Trash2 size={18} />
                            </button>
                          </td>
                        </motion.tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </motion.div>

      </div>
    </div>
  );
};

export default AdminDashboard;