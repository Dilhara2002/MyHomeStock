import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";
import { 
  Search, Plus, Edit2, Trash2, FileText, 
  CheckCircle, AlertCircle, X, ArrowLeft, 
  Layers, Save, Download 
} from "lucide-react";

// --- Components ---

const Notification = ({ message, type, onClose }) => {
  const isSuccess = type === "success";
  return (
    <motion.div
      initial={{ opacity: 0, y: -50, x: '-50%' }}
      animate={{ opacity: 1, y: 0, x: '-50%' }}
      exit={{ opacity: 0, y: -50, x: '-50%' }}
      style={{
        position: 'fixed', top: '20px', left: '50%', zIndex: 1050,
        backgroundColor: isSuccess ? 'rgba(16, 185, 129, 0.9)' : 'rgba(239, 68, 68, 0.9)',
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

const CategoryPage = () => {
  // --- State ---
  const [categories, setCategories] = useState([]);
  const [filteredCategories, setFilteredCategories] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  
  // Form State
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [editingCategory, setEditingCategory] = useState(null);

  // UI State
  const [notification, setNotification] = useState(null);
  const [deleteId, setDeleteId] = useState(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  const navigate = useNavigate();
  const reportRef = useRef(null);

  // --- Effects ---
  useEffect(() => {
    fetchCategories();
  }, [navigate]);

  useEffect(() => {
    if (searchTerm.trim() === "") {
      setFilteredCategories(categories);
    } else {
      const filtered = categories.filter(
        (cat) =>
          cat.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          (cat.description && cat.description.toLowerCase().includes(searchTerm.toLowerCase()))
      );
      setFilteredCategories(filtered);
    }
  }, [searchTerm, categories]);

  // --- Actions ---
  const fetchCategories = async () => {
    try {
      setIsLoading(true);
      const token = localStorage.getItem("token");
      if (!token) {
        navigate("/login");
        return;
      }
      const response = await axios.get("http://localhost:5002/api/categories", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setCategories(response.data.categories);
      setFilteredCategories(response.data.categories);
    } catch (error) {
      showNotification("Error fetching categories", "error");
    } finally {
      setIsLoading(false);
    }
  };

  const showNotification = (message, type) => {
    setNotification({ message, type });
    setTimeout(() => setNotification(null), 3000);
  };

  const validateCategoryName = (newName) => {
    const isDuplicate = categories.some(
      cat => cat.name.toLowerCase() === newName.toLowerCase() &&
        cat._id !== (editingCategory ? editingCategory._id : null)
    );

    if (isDuplicate) {
      showNotification("Category name already exists.", "error");
      return false;
    }
    if (newName.trim().length < 2) {
      showNotification("Name must be at least 2 characters.", "error");
      return false;
    }
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateCategoryName(name)) return;

    try {
      const token = localStorage.getItem("token");
      if (editingCategory) {
        await axios.put(`http://localhost:5002/api/categories/${editingCategory._id}`, { name, description }, {
          headers: { Authorization: `Bearer ${token}` },
        });
        showNotification("Category updated successfully.", "success");
      } else {
        await axios.post("http://localhost:5002/api/categories", { name, description }, {
          headers: { Authorization: `Bearer ${token}` },
        });
        showNotification("Category added successfully.", "success");
      }
      fetchCategories();
      resetForm();
    } catch (error) {
      showNotification("Operation failed. Try again.", "error");
    }
  };

  const handleDelete = async () => {
    try {
      const token = localStorage.getItem("token");
      await axios.delete(`http://localhost:5002/api/categories/${deleteId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      fetchCategories();
      showNotification("Category deleted.", "success");
      setDeleteId(null);
    } catch (error) {
      showNotification("Delete failed.", "error");
    }
  };

  const resetForm = () => {
    setName("");
    setDescription("");
    setEditingCategory(null);
  };

  const handleEditClick = (cat) => {
    setEditingCategory(cat);
    setName(cat.name);
    setDescription(cat.description);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const generatePDFReport = () => {
    setIsGenerating(true);
    const input = reportRef.current;
    
    html2canvas(input, { scale: 2 }).then((canvas) => {
      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF('p', 'mm', 'a4');
      const imgWidth = 210;
      const imgHeight = canvas.height * imgWidth / canvas.width;
      
      pdf.addImage(imgData, 'PNG', 0, 0, imgWidth, imgHeight);
      pdf.save(`Categories_Report_${new Date().toLocaleDateString()}.pdf`);
      setIsGenerating(false);
      showNotification("PDF Report Downloaded", "success");
    }).catch(err => {
      setIsGenerating(false);
      showNotification("PDF Generation Failed", "error");
    });
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
      
      {/* Custom Scrollbar Styles */}
      <style>{`
        ::-webkit-scrollbar { width: 8px; }
        ::-webkit-scrollbar-track { background: #0f172a; }
        ::-webkit-scrollbar-thumb { background: #334155; border-radius: 4px; }
        ::-webkit-scrollbar-thumb:hover { background: #475569; }
        .form-control:focus {
           border-color: #38bdf8 !important;
           box-shadow: 0 0 0 4px rgba(56, 189, 248, 0.1) !important;
        }
        .form-control::placeholder {
           color: #64748b;
        }
      `}</style>

      {/* Background Glow */}
      <div style={{
        position: 'absolute', top: 0, left: 0, width: '100%', height: '500px',
        background: 'radial-gradient(circle at 50% -20%, rgba(6, 182, 212, 0.15), transparent 70%)',
        zIndex: 0, pointerEvents: 'none'
      }} />

      {/* Notifications */}
      <AnimatePresence>
        {notification && <Notification {...notification} onClose={() => setNotification(null)} />}
      </AnimatePresence>

      {/* Delete Modal */}
      <AnimatePresence>
        {deleteId && (
          <div style={{
            position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
            background: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(8px)',
            display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 1100
          }}>
            <motion.div 
              initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.9, opacity: 0 }}
              style={{
                background: '#1e293b', padding: '30px', borderRadius: '24px',
                border: '1px solid rgba(255,255,255,0.1)', maxWidth: '400px', width: '90%',
                boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.5)'
              }}
            >
              <h4 className="fw-bold mb-3 text-center">Delete Category?</h4>
              <p className="text-muted text-center mb-4">Are you sure you want to remove this category? This cannot be undone.</p>
              <div className="d-flex gap-3">
                <button onClick={() => setDeleteId(null)} className="btn btn-secondary flex-grow-1 py-2" style={{ borderRadius: '12px', background: 'rgba(255,255,255,0.05)', border: 'none' }}>Cancel</button>
                <button onClick={handleDelete} className="btn btn-danger flex-grow-1 py-2" style={{ borderRadius: '12px', background: '#ef4444', border: 'none' }}>Delete</button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* HIDDEN REPORT CONTAINER */}
      <div style={{ position: "absolute", left: "-9999px", top: 0 }}>
        <div ref={reportRef} style={{ padding: "40px", fontFamily: "Arial", background: "white", width: "210mm", minHeight: "297mm", color: "black" }}>
          <h1 style={{ textAlign: "center", color: "#00838F", borderBottom: "2px solid #00838F", paddingBottom: "10px" }}>Category Inventory Report</h1>
          <p style={{ textAlign: "right", color: "#666", marginTop: "10px" }}>Generated: {new Date().toLocaleDateString()}</p>
          <table style={{ width: "100%", borderCollapse: "collapse", marginTop: "20px" }}>
            <thead>
              <tr style={{ backgroundColor: "#00BCD4", color: "white" }}>
                <th style={{ padding: "12px", border: "1px solid #ddd" }}>Name</th>
                <th style={{ padding: "12px", border: "1px solid #ddd" }}>Description</th>
              </tr>
            </thead>
            <tbody>
              {categories.map((cat, i) => (
                <tr key={i} style={{ backgroundColor: i % 2 === 0 ? "#f9f9f9" : "white" }}>
                  <td style={{ padding: "12px", border: "1px solid #ddd" }}>{cat.name}</td>
                  <td style={{ padding: "12px", border: "1px solid #ddd" }}>{cat.description}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div className="container" style={{ position: 'relative', zIndex: 1 }}>
        
        {/* --- Header --- */}
        <div className="d-flex flex-column flex-md-row justify-content-between align-items-center mb-5 pb-3" style={{ borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
          <div className="d-flex align-items-center mb-3 mb-md-0">
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
                Category <span style={{ 
                  background: 'linear-gradient(135deg, #06b6d4 0%, #3b82f6 100%)', 
                  WebkitBackgroundClip: 'text', 
                  WebkitTextFillColor: 'transparent' 
                }}>Management</span>
              </h1>
            </div>
          </div>
          
          <button 
            onClick={generatePDFReport} 
            disabled={isGenerating}
            className="btn d-flex align-items-center text-white"
            style={{ 
              background: 'rgba(255,255,255,0.05)', 
              border: '1px solid rgba(255,255,255,0.1)',
              padding: '10px 20px', borderRadius: '12px',
              transition: 'all 0.2s'
            }}
          >
            {isGenerating ? <span className="spinner-border spinner-border-sm me-2"/> : <Download size={18} className="me-2 text-info" />}
            {isGenerating ? "Exporting..." : "Export PDF Report"}
          </button>
        </div>

        <div className="row g-5">
          
          {/* --- Left Column: Sticky Form --- */}
          <div className="col-lg-4">
            <div style={{ position: 'sticky', top: '30px' }}>
              <motion.div 
                initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }}
                className="card border-0 shadow-lg"
                style={{
                  backgroundColor: 'rgba(30, 41, 59, 0.7)', backdropFilter: 'blur(12px)',
                  borderRadius: '24px', border: '1px solid rgba(255, 255, 255, 0.08)'
                }}
              >
                <div className="card-body p-4">
                  <h4 className="fw-bold mb-4 d-flex align-items-center text-white">
                    {editingCategory ? <Edit2 size={20} className="me-2 text-warning"/> : <Plus size={20} className="me-2 text-info"/>}
                    {editingCategory ? "Edit Category" : "Add New Category"}
                  </h4>
                  
                  <form onSubmit={handleSubmit}>
                    <label className="small mb-2 fw-semibold" style={{ color: '#cbd5e1' }}>CATEGORY NAME</label>
                    <input 
                      type="text" 
                      value={name} 
                      onChange={(e) => setName(e.target.value)}
                      className="form-control mb-3"
                      placeholder="e.g. Groceries"
                      style={{
                        background: 'rgba(15, 23, 42, 0.6)', border: '1px solid rgba(255,255,255,0.1)',
                        color: 'white', borderRadius: '12px', padding: '12px'
                      }}
                    />
                    
                    <label className="small mb-2 fw-semibold" style={{ color: '#cbd5e1' }}>DESCRIPTION</label>
                    <textarea 
                      value={description}
                      onChange={(e) => setDescription(e.target.value)}
                      className="form-control mb-4"
                      rows="4"
                      placeholder="Brief description..."
                      style={{
                        background: 'rgba(15, 23, 42, 0.6)', border: '1px solid rgba(255,255,255,0.1)',
                        color: 'white', borderRadius: '12px', resize: 'none'
                      }}
                    />

                    <button 
                      type="submit" 
                      className="btn w-100 py-2 fw-bold text-white d-flex align-items-center justify-content-center"
                      style={{
                        background: editingCategory 
                          ? 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)' 
                          : 'linear-gradient(135deg, #06b6d4 0%, #3b82f6 100%)',
                        borderRadius: '12px', border: 'none', boxShadow: '0 4px 15px rgba(0,0,0,0.2)',
                        padding: '12px'
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
                        Cancel Edit
                      </button>
                    )}
                  </form>
                </div>
              </motion.div>
            </div>
          </div>

          {/* --- Right Column: Grid List --- */}
          <div className="col-lg-8">
            
            {/* Search Bar */}
            <div className="mb-4 position-relative">
               <Search size={20} style={{ position: 'absolute', left: '18px', top: '14px', color: '#94a3b8' }} />
               <input 
                  type="text"
                  placeholder="Search categories..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="form-control"
                  style={{
                     width: '100%', padding: '12px 15px 12px 50px', borderRadius: '16px',
                     border: '1px solid rgba(255, 255, 255, 0.1)', backgroundColor: 'rgba(30, 41, 59, 0.4)',
                     color: '#e2e8f0', fontSize: '1rem'
                  }}
               />
               {searchTerm && (
                  <button onClick={() => setSearchTerm('')} style={{ position: 'absolute', right: '15px', top: '12px', background: 'none', border: 'none', color: '#94a3b8' }}>
                     <X size={18} />
                  </button>
               )}
            </div>

            {/* Content Area */}
            {isLoading ? (
               <div className="text-center py-5"><div className="spinner-border text-info"/></div>
            ) : (
              <div className="row g-3">
                <AnimatePresence>
                  {filteredCategories.length === 0 ? (
                     <div className="text-center py-5 text-muted col-12">
                        <Layers size={48} className="mb-3 opacity-25" />
                        <p>No categories found.</p>
                     </div>
                  ) : (
                    filteredCategories.map((cat) => (
                      <motion.div 
                        key={cat._id}
                        layout
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.9 }}
                        className="col-md-6"
                      >
                        <div className="card h-100 border-0" style={{
                          backgroundColor: 'rgba(30, 41, 59, 0.4)',
                          borderRadius: '20px',
                          border: '1px solid rgba(255, 255, 255, 0.05)',
                          transition: 'all 0.2s',
                          boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
                        }}>
                          <div className="card-body p-4 d-flex flex-column">
                            <div className="d-flex justify-content-between align-items-start mb-3">
                              <h5 className="fw-bold text-white m-0 text-truncate" style={{ fontSize: '1.1rem' }}>{cat.name}</h5>
                              <div className="d-flex gap-2">
                                <motion.button 
                                  whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}
                                  onClick={() => handleEditClick(cat)} 
                                  className="btn btn-sm d-flex align-items-center justify-content-center"
                                  style={{ width: '32px', height: '32px', borderRadius: '10px', background: 'rgba(6, 182, 212, 0.15)', color: '#06b6d4', border: 'none' }}>
                                  <Edit2 size={16} />
                                </motion.button>
                                <motion.button 
                                  whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}
                                  onClick={() => setDeleteId(cat._id)} 
                                  className="btn btn-sm d-flex align-items-center justify-content-center"
                                  style={{ width: '32px', height: '32px', borderRadius: '10px', background: 'rgba(239, 68, 68, 0.15)', color: '#ef4444', border: 'none' }}>
                                  <Trash2 size={16} />
                                </motion.button>
                              </div>
                            </div>
                            <p className="small mb-0" style={{ flex: 1, lineHeight: '1.6', color: '#e2e8f0' }}>
                              {cat.description || "No description provided."}
                            </p>
                          </div>
                        </div>
                      </motion.div>
                    ))
                  )}
                </AnimatePresence>
              </div>
            )}
          </div>

        </div>
      </div>
    </div>
  );
};

export default CategoryPage;