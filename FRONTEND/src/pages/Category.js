import React, { useState, useEffect } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Plus, Edit2, Trash2, CheckCircle, AlertCircle, 
  X, Search, Layers, ArrowLeft, Save 
} from "lucide-react";

// Constants
const API_BASE_URL = "http://localhost:5002/api/categories";

// --- Components ---

const Input = ({ icon: Icon, ...props }) => (
  <div className="position-relative mb-3">
    {Icon && (
      <div className="position-absolute" style={{ top: '12px', left: '15px', color: '#94a3b8' }}>
        <Icon size={18} />
      </div>
    )}
    <input
      {...props}
      style={{
        width: '100%',
        padding: '12px 15px',
        paddingLeft: Icon ? '45px' : '15px',
        borderRadius: '12px',
        border: '1px solid rgba(255, 255, 255, 0.1)',
        backgroundColor: 'rgba(15, 23, 42, 0.6)',
        color: '#e2e8f0',
        outline: 'none',
        fontSize: '0.95rem'
      }}
    />
  </div>
);

const Notification = ({ message, type, onClose }) => {
  const isSuccess = type === "success";
  return (
    <motion.div
      initial={{ opacity: 0, y: -50, x: '-50%' }}
      animate={{ opacity: 1, y: 0, x: '-50%' }}
      exit={{ opacity: 0, y: -50, x: '-50%' }}
      style={{
        position: 'fixed',
        top: '20px',
        left: '50%',
        zIndex: 1050,
        backgroundColor: isSuccess ? 'rgba(16, 185, 129, 0.9)' : 'rgba(239, 68, 68, 0.9)',
        color: 'white',
        padding: '12px 24px',
        borderRadius: '50px',
        backdropFilter: 'blur(10px)',
        boxShadow: '0 10px 30px rgba(0,0,0,0.2)',
        display: 'flex',
        alignItems: 'center',
        gap: '12px'
      }}
    >
      {isSuccess ? <CheckCircle size={20} /> : <AlertCircle size={20} />}
      <span style={{ fontWeight: 500 }}>{message}</span>
      <button onClick={onClose} style={{ background: 'none', border: 'none', color: 'white', cursor: 'pointer' }}>
        <X size={18} />
      </button>
    </motion.div>
  );
};

export default function CategoryPage() {
  // --- State ---
  const [categories, setCategories] = useState([]);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [editingCategory, setEditingCategory] = useState(null);
  
  // UI State
  const [isLoading, setIsLoading] = useState(true);
  const [notification, setNotification] = useState(null);
  const [deleteId, setDeleteId] = useState(null); // For delete confirmation modal

  // --- Effects ---
  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      setIsLoading(true);
      const response = await axios.get(API_BASE_URL);
      setCategories(response.data.categories || []); // Ensure array
    } catch (err) {
      showNotification("Failed to load categories.", "error");
    } finally {
      setIsLoading(false);
    }
  };

  // --- Handlers ---
  const showNotification = (message, type) => {
    setNotification({ message, type });
    setTimeout(() => setNotification(null), 3000);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!name.trim()) return showNotification("Category name is required", "error");

    try {
      if (editingCategory) {
        await axios.put(`${API_BASE_URL}/${editingCategory._id}`, { name, description });
        showNotification("Category updated successfully!", "success");
      } else {
        await axios.post(API_BASE_URL, { name, description });
        showNotification("New category added!", "success");
      }
      resetForm();
      fetchCategories();
    } catch (err) {
      showNotification("Failed to save category.", "error");
    }
  };

  const resetForm = () => {
    setName("");
    setDescription("");
    setEditingCategory(null);
  };

  const handleEdit = (cat) => {
    setEditingCategory(cat);
    setName(cat.name);
    setDescription(cat.description);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const confirmDelete = async () => {
    try {
      await axios.delete(`${API_BASE_URL}/${deleteId}`);
      setCategories(prev => prev.filter(c => c._id !== deleteId));
      showNotification("Category deleted.", "success");
    } catch (err) {
      showNotification("Failed to delete.", "error");
    } finally {
      setDeleteId(null);
    }
  };

  // --- Render ---
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
        position: 'absolute',
        top: 0,
        left: 0,
        width: '100%',
        height: '400px',
        background: 'radial-gradient(circle at 50% -20%, rgba(56, 189, 248, 0.15), transparent 70%)',
        zIndex: 0,
        pointerEvents: 'none'
      }} />

      {/* Notifications */}
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
              <h4 className="fw-bold mb-3">Delete Category?</h4>
              <p className="text-muted mb-4">Are you sure you want to remove this category? This action cannot be undone.</p>
              <div className="d-flex gap-3">
                <button onClick={() => setDeleteId(null)} className="btn btn-secondary flex-grow-1" style={{ borderRadius: '10px' }}>Cancel</button>
                <button onClick={confirmDelete} className="btn btn-danger flex-grow-1" style={{ borderRadius: '10px' }}>Delete</button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      <div className="container" style={{ position: 'relative', zIndex: 1 }}>
        
        {/* --- Header --- */}
        <div className="d-flex align-items-center mb-5 pb-3" style={{ borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
          <Link to="/" className="text-decoration-none me-4">
            <motion.div 
              whileHover={{ scale: 1.1, backgroundColor: 'rgba(56, 189, 248, 0.2)', borderColor: '#38bdf8' }}
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
              Categories <span style={{ color: '#fbbf24' }}>& Tags</span>
            </h1>
          </div>
        </div>

        <div className="row g-5">
          
          {/* --- Left Column: Form --- */}
          <div className="col-lg-4">
            <div style={{ position: 'sticky', top: '20px' }}>
              <motion.div 
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                className="card border-0"
                style={{
                  backgroundColor: 'rgba(30, 41, 59, 0.7)',
                  backdropFilter: 'blur(12px)',
                  borderRadius: '20px',
                  border: '1px solid rgba(255, 255, 255, 0.08)'
                }}
              >
                <div className="card-body p-4">
                  <h4 className="fw-bold mb-4 d-flex align-items-center">
                    {editingCategory ? <Edit2 size={20} className="me-2 text-warning"/> : <Plus size={20} className="me-2 text-primary"/>}
                    {editingCategory ? "Edit Category" : "Add New Category"}
                  </h4>
                  
                  <form onSubmit={handleSubmit}>
                    <label className="small text-muted mb-1">Name</label>
                    <Input 
                      icon={Layers}
                      value={name} 
                      onChange={(e) => setName(e.target.value)} 
                      placeholder="e.g. Electronics" 
                    />
                    
                    <label className="small text-muted mb-1">Description</label>
                    <textarea 
                      className="form-control mb-4"
                      rows="4"
                      value={description}
                      onChange={(e) => setDescription(e.target.value)}
                      placeholder="Brief description..."
                      style={{
                        backgroundColor: 'rgba(15, 23, 42, 0.6)',
                        border: '1px solid rgba(255, 255, 255, 0.1)',
                        color: '#e2e8f0',
                        borderRadius: '12px',
                        resize: 'none'
                      }}
                    />

                    <button 
                      type="submit" 
                      className="btn w-100 py-2 fw-bold text-white d-flex align-items-center justify-content-center"
                      style={{
                        background: editingCategory 
                          ? 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)' 
                          : 'linear-gradient(135deg, #38bdf8 0%, #3b82f6 100%)',
                        borderRadius: '12px',
                        border: 'none',
                        boxShadow: '0 4px 12px rgba(0,0,0,0.2)'
                      }}
                    >
                      {editingCategory ? <Save size={18} className="me-2"/> : <Plus size={18} className="me-2"/>}
                      {editingCategory ? "Update Category" : "Create Category"}
                    </button>

                    {editingCategory && (
                      <button 
                        type="button" 
                        onClick={resetForm}
                        className="btn w-100 mt-2 py-2 text-muted"
                      >
                        Cancel
                      </button>
                    )}
                  </form>
                </div>
              </motion.div>
            </div>
          </div>

          {/* --- Right Column: List --- */}
          <div className="col-lg-8">
            <div className="d-flex justify-content-between align-items-end mb-4">
              <h5 className="text-muted m-0">Total Categories: <span className="text-white">{categories.length}</span></h5>
            </div>

            {isLoading ? (
              <div className="text-center py-5">
                <div className="spinner-border text-primary" role="status"></div>
              </div>
            ) : (
              <motion.div 
                className="row g-3"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
              >
                <AnimatePresence>
                  {categories.length === 0 ? (
                     <div className="text-center py-5 text-muted">
                        <Layers size={48} className="mb-3 opacity-25" />
                        <p>No categories found. Create one to get started.</p>
                     </div>
                  ) : (
                    categories.map((cat) => (
                      <motion.div 
                        key={cat._id}
                        layout
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.9 }}
                        transition={{ duration: 0.2 }}
                        className="col-md-6"
                      >
                        <div className="card h-100 border-0" style={{
                          backgroundColor: 'rgba(30, 41, 59, 0.4)',
                          borderRadius: '16px',
                          border: '1px solid rgba(255, 255, 255, 0.05)',
                          transition: 'all 0.2s'
                        }}>
                          <div className="card-body p-4 d-flex flex-column">
                            <div className="d-flex justify-content-between align-items-start mb-2">
                              <h5 className="fw-bold text-white m-0">{cat.name}</h5>
                              <div className="d-flex gap-2">
                                <button 
                                  onClick={() => handleEdit(cat)}
                                  className="btn btn-sm btn-icon"
                                  style={{ color: '#94a3b8', padding: '5px' }}
                                >
                                  <Edit2 size={16} />
                                </button>
                                <button 
                                  onClick={() => setDeleteId(cat._id)}
                                  className="btn btn-sm btn-icon"
                                  style={{ color: '#ef4444', padding: '5px' }}
                                >
                                  <Trash2 size={16} />
                                </button>
                              </div>
                            </div>
                            <p className="small text-muted mb-0" style={{ lineHeight: '1.6', flex: 1 }}>
                              {cat.description || "No description provided."}
                            </p>
                          </div>
                        </div>
                      </motion.div>
                    ))
                  )}
                </AnimatePresence>
              </motion.div>
            )}
          </div>

        </div>
      </div>
    </div>
  );
}