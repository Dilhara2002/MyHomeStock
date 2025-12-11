import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";
import { 
  Search, Plus, Edit2, Trash2, FileText, 
  CheckCircle, AlertCircle, X, ArrowLeft, 
  Save, Download, AlertTriangle 
} from "lucide-react";

// --- Reusable Modal Component ---
const Modal = ({ isOpen, onClose, title, children, footer }) => {
  if (!isOpen) return null;
  return (
    <div style={{
      position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
      background: 'rgba(0,0,0,0.7)', backdropFilter: 'blur(5px)',
      display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 1100
    }}>
      <motion.div 
        initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.9, opacity: 0 }}
        style={{
          background: '#1e293b', width: '90%', maxWidth: '600px',
          borderRadius: '20px', border: '1px solid rgba(255,255,255,0.1)',
          boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.5)', maxHeight: '90vh', overflowY: 'auto'
        }}
      >
        <div className="d-flex justify-content-between align-items-center p-4 border-bottom border-secondary border-opacity-25">
          <h4 className="m-0 fw-bold text-white">{title}</h4>
          <button onClick={onClose} className="btn btn-sm text-muted hover-white"><X size={20}/></button>
        </div>
        <div className="p-4">
          {children}
        </div>
        {footer && (
          <div className="p-4 border-top border-secondary border-opacity-25 d-flex justify-content-end gap-2">
            {footer}
          </div>
        )}
      </motion.div>
    </div>
  );
};

// --- Notification Component ---
const Notification = ({ message, type, onClose }) => {
  const isSuccess = type === "success";
  return (
    <motion.div
      initial={{ opacity: 0, y: -50, x: '-50%' }}
      animate={{ opacity: 1, y: 0, x: '-50%' }}
      exit={{ opacity: 0, y: -50, x: '-50%' }}
      style={{
        position: 'fixed', top: '20px', left: '50%', zIndex: 1200,
        backgroundColor: isSuccess ? 'rgba(6, 182, 212, 0.9)' : 'rgba(239, 68, 68, 0.9)',
        color: 'white', padding: '12px 24px', borderRadius: '50px',
        backdropFilter: 'blur(10px)', display: 'flex', alignItems: 'center', gap: '12px',
        boxShadow: '0 10px 30px rgba(0,0,0,0.3)', border: '1px solid rgba(255,255,255,0.1)'
      }}
    >
      {isSuccess ? <CheckCircle size={20} /> : <AlertCircle size={20} />}
      <span style={{ fontWeight: 500 }}>{message}</span>
      <button onClick={onClose} style={{ background: 'none', border: 'none', color: 'white' }}><X size={18} /></button>
    </motion.div>
  );
};

const InventoryPage = () => {
  // --- State ---
  const [items, setItems] = useState([]);
  const [categories, setCategories] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterCategory, setFilterCategory] = useState("");

  // Modal State
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [deleteId, setDeleteId] = useState(null);

  // Form State
  const [formData, setFormData] = useState({
    id: null, name: "", quantity: "", unit: "pieces", expiryDate: "", category: ""
  });

  // UI State
  const [notification, setNotification] = useState(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  const navigate = useNavigate();
  const reportRef = useRef(null);

  // --- Styles ---
  const inputStyle = {
    background: 'rgba(15, 23, 42, 0.6)', border: '1px solid rgba(255,255,255,0.1)',
    color: 'white', borderRadius: '12px', padding: '12px'
  };
  const labelStyle = { color: '#cbd5e1', fontSize: '0.85rem', fontWeight: '600', marginBottom: '6px' };

  // --- Helpers ---
  const isExpired = (date) => date && new Date(date) < new Date();
  const isNearing = (date) => {
    if (!date) return false;
    const diff = Math.floor((new Date(date) - new Date()) / (1000 * 60 * 60 * 24));
    return diff >= 0 && diff <= 7;
  };

  // --- Effects ---
  useEffect(() => {
    fetchData();
  }, [navigate]);

  const fetchData = async () => {
    setIsLoading(true);
    try {
      const token = localStorage.getItem("token");
      if (!token) { navigate("/login"); return; }
      
      const [itemsRes, catsRes] = await Promise.all([
        axios.get("http://localhost:5002/inventory", { headers: { Authorization: `Bearer ${token}` } }),
        axios.get("http://localhost:5002/api/categories", { headers: { Authorization: `Bearer ${token}` } })
      ]);
      
      setItems(itemsRes.data);
      setCategories(catsRes.data.categories);
    } catch (e) { showNotification("Error fetching data", "error"); } 
    finally { setIsLoading(false); }
  };

  const showNotification = (message, type) => {
    setNotification({ message, type });
    setTimeout(() => setNotification(null), 3000);
  };

  // --- Handlers ---
  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const validate = () => {
    if (!formData.name.trim()) { showNotification("Name is required", "error"); return false; }
    if (!formData.quantity || formData.quantity <= 0) { showNotification("Invalid quantity", "error"); return false; }
    if (!formData.category) { showNotification("Category is required", "error"); return false; }
    return true;
  };

  const handleSave = async (isEdit = false) => {
    if (!validate()) return;
    try {
      const token = localStorage.getItem("token");
      const url = isEdit 
        ? `http://localhost:5002/inventory/${formData.id}` 
        : "http://localhost:5002/inventory";
      const method = isEdit ? axios.put : axios.post;

      await method(url, formData, { headers: { Authorization: `Bearer ${token}` } });
      
      showNotification(isEdit ? "Item updated!" : "Item added!", "success");
      fetchData();
      setShowAddModal(false);
      setShowEditModal(false);
      resetForm();
    } catch (e) { showNotification("Operation failed", "error"); }
  };

  const handleDelete = async () => {
    try {
      const token = localStorage.getItem("token");
      await axios.delete(`http://localhost:5002/inventory/${deleteId}`, { headers: { Authorization: `Bearer ${token}` } });
      showNotification("Item deleted", "success");
      fetchData();
      setDeleteId(null);
    } catch (e) { showNotification("Delete failed", "error"); }
  };

  const openEdit = (item) => {
    setFormData({
      id: item._id,
      name: item.name,
      quantity: item.quantity,
      unit: item.unit,
      expiryDate: item.expiryDate ? item.expiryDate.slice(0, 10) : "",
      category: item.category || ""
    });
    setShowEditModal(true);
  };

  const resetForm = () => {
    setFormData({ id: null, name: "", quantity: "", unit: "pieces", expiryDate: "", category: "" });
  };

  const generatePDF = () => {
    setIsGenerating(true);
    html2canvas(reportRef.current, { scale: 2 }).then((canvas) => {
      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF('p', 'mm', 'a4');
      pdf.addImage(imgData, 'PNG', 0, 0, 210, (canvas.height * 210 / canvas.width));
      pdf.save(`Inventory_Report_${new Date().toLocaleDateString()}.pdf`);
      setIsGenerating(false);
      showNotification("Report Downloaded", "success");
    });
  };

  // Filter Logic
  const filteredItems = items.filter(item => 
    item.name.toLowerCase().includes(searchTerm.toLowerCase()) &&
    (filterCategory === "" || item.category === filterCategory)
  );

  // Form JSX (Shared between Add/Edit)
  const FormContent = () => (
    <>
      <div className="mb-3">
        <label style={labelStyle}>ITEM NAME</label>
        <input type="text" name="name" value={formData.name} onChange={handleInputChange} className="form-control" placeholder="e.g. Milk" style={inputStyle} />
      </div>
      <div className="row g-2 mb-3">
        <div className="col-8">
          <label style={labelStyle}>QUANTITY</label>
          <input type="number" name="quantity" value={formData.quantity} onChange={handleInputChange} className="form-control" placeholder="0.00" style={inputStyle} />
        </div>
        <div className="col-4">
          <label style={labelStyle}>UNIT</label>
          <select name="unit" value={formData.unit} onChange={handleInputChange} className="form-select" style={{ ...inputStyle, backgroundColor: '#0f172a' }}>
            <option value="pieces">Pcs</option><option value="kg">Kg</option><option value="liters">L</option>
          </select>
        </div>
      </div>
      <div className="mb-3">
        <label style={labelStyle}>CATEGORY</label>
        <select name="category" value={formData.category} onChange={handleInputChange} className="form-select" style={{ ...inputStyle, backgroundColor: '#0f172a' }}>
          <option value="">Select...</option>
          {categories.map(c => <option key={c._id} value={c.name}>{c.name}</option>)}
        </select>
      </div>
      <div className="mb-3">
        <label style={labelStyle}>EXPIRY DATE</label>
        <input type="date" name="expiryDate" value={formData.expiryDate} onChange={handleInputChange} className="form-control" style={inputStyle} />
      </div>
    </>
  );

  return (
    <div style={{
      minHeight: '100vh', backgroundColor: '#0f172a', color: '#f8fafc',
      paddingTop: '40px', paddingBottom: '80px', fontFamily: '"Inter", sans-serif'
    }}>
      
      {/* Scrollbar Style & Table Overrides */}
      <style>{`
        ::-webkit-scrollbar { width: 8px; }
        ::-webkit-scrollbar-track { background: #0f172a; }
        ::-webkit-scrollbar-thumb { background: #334155; border-radius: 4px; }
        .form-control:focus, .form-select:focus { border-color: #06b6d4 !important; box-shadow: 0 0 0 4px rgba(6,182,212,0.1) !important; }
        
        /* Force Dark Table */
        .table { --bs-table-bg: transparent; color: #e2e8f0; }
        .table-hover > tbody > tr:hover > * { --bs-table-accent-bg: rgba(255,255,255,0.05); color: white; }
        .table td, .table th { border-bottom-color: rgba(255,255,255,0.05); }
        .table th { background-color: rgba(15, 23, 42, 0.8) !important; }
      `}</style>

      {/* Background Glow */}
      <div style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '500px', background: 'radial-gradient(circle at 50% -20%, rgba(6, 182, 212, 0.15), transparent 70%)', zIndex: 0, pointerEvents: 'none' }} />

      <AnimatePresence>
        {notification && <Notification {...notification} onClose={() => setNotification(null)} />}
      </AnimatePresence>

      {/* --- Add Modal --- */}
      <AnimatePresence>
        {showAddModal && (
          <Modal title="Add Inventory Item" isOpen={showAddModal} onClose={() => setShowAddModal(false)}
            footer={
              <>
                <button className="btn btn-outline-light border-0" onClick={() => setShowAddModal(false)}>Cancel</button>
                <button className="btn fw-bold text-white" onClick={() => handleSave(false)} style={{ background: '#06b6d4', padding: '8px 20px', borderRadius: '10px' }}>Save Item</button>
              </>
            }
          >
            {FormContent()}
          </Modal>
        )}
      </AnimatePresence>

      {/* --- Edit Modal --- */}
      <AnimatePresence>
        {showEditModal && (
          <Modal title="Edit Item" isOpen={showEditModal} onClose={() => setShowEditModal(false)}
            footer={
              <>
                <button className="btn btn-outline-light border-0" onClick={() => setShowEditModal(false)}>Cancel</button>
                <button className="btn fw-bold text-white" onClick={() => handleSave(true)} style={{ background: '#f59e0b', padding: '8px 20px', borderRadius: '10px' }}>Update Item</button>
              </>
            }
          >
            {FormContent()}
          </Modal>
        )}
      </AnimatePresence>

      {/* --- Delete Modal --- */}
      <AnimatePresence>
        {deleteId && (
           <Modal title="Confirm Delete" isOpen={!!deleteId} onClose={() => setDeleteId(null)}
             footer={
               <>
                 <button className="btn btn-outline-light border-0" onClick={() => setDeleteId(null)}>Cancel</button>
                 <button className="btn btn-danger fw-bold" onClick={handleDelete} style={{ padding: '8px 20px', borderRadius: '10px' }}>Delete Permanently</button>
               </>
             }
           >
             <div className="text-center">
                <AlertTriangle size={48} className="text-danger mb-3" />
                <p className="text-muted">Are you sure you want to delete this item? This action cannot be undone.</p>
             </div>
           </Modal>
        )}
      </AnimatePresence>

      {/* --- Hidden Report --- */}
      <div style={{ position: "absolute", left: "-9999px" }}>
        <div ref={reportRef} style={{ padding: "40px", fontFamily: "Arial", background: "white", width: "210mm", color: "black" }}>
          <h1 style={{ color: "#06b6d4", borderBottom: "2px solid #06b6d4", paddingBottom: "10px" }}>Inventory Report</h1>
          <p style={{ textAlign: "right", color: "#666" }}>Generated: {new Date().toLocaleDateString()}</p>
          <table style={{ width: "100%", borderCollapse: "collapse", marginTop: "20px" }}>
            <thead>
              <tr style={{ background: "#06b6d4", color: "white" }}>
                <th style={{ padding: "10px", textAlign: "left" }}>Name</th>
                <th style={{ padding: "10px", textAlign: "left" }}>Qty</th>
                <th style={{ padding: "10px", textAlign: "left" }}>Category</th>
                <th style={{ padding: "10px", textAlign: "left" }}>Status</th>
              </tr>
            </thead>
            <tbody>
              {items.map((item, i) => (
                <tr key={i} style={{ background: i % 2 === 0 ? "#f1f5f9" : "white" }}>
                  <td style={{ padding: "10px" }}>{item.name}</td>
                  <td style={{ padding: "10px" }}>{item.quantity} {item.unit}</td>
                  <td style={{ padding: "10px" }}>{item.category}</td>
                  <td style={{ padding: "10px" }}>{isExpired(item.expiryDate) ? "Expired" : "Good"}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div className="container" style={{ position: 'relative', zIndex: 1 }}>
        
        {/* Header */}
        <div className="d-flex flex-column flex-md-row justify-content-between align-items-center mb-5 pb-3" style={{ borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
          <div className="d-flex align-items-center mb-3 mb-md-0">
            <Link to="/" className="text-decoration-none me-3">
              <div className="btn btn-outline-light border-0 rounded-circle p-2" style={{ background: 'rgba(255,255,255,0.05)' }}>
                <ArrowLeft size={24} />
              </div>
            </Link>
            <h1 className="fw-bold m-0 display-6">Inventory <span style={{ color: '#06b6d4' }}>List</span></h1>
          </div>
          <button onClick={generatePDF} className="btn btn-outline-light d-flex align-items-center gap-2" disabled={isGenerating}>
            {isGenerating ? <span className="spinner-border spinner-border-sm"/> : <Download size={18} />} Export PDF
          </button>
        </div>

        {/* Toolbar */}
        <div className="card border-0 mb-4" style={{ background: '#1e293b', borderRadius: '16px' }}>
          <div className="card-body p-3 d-flex flex-column flex-md-row gap-3">
             <div className="position-relative flex-grow-1">
                <Search size={20} className="position-absolute text-muted" style={{ top: '12px', left: '15px' }} />
                <input type="text" className="form-control ps-5" placeholder="Search items..." 
                  value={searchTerm} onChange={e => setSearchTerm(e.target.value)}
                  style={{ background: '#0f172a', border: '1px solid #334155', color: 'white', borderRadius: '10px', height: '45px' }} />
             </div>
             <select 
                value={filterCategory} onChange={e => setFilterCategory(e.target.value)}
                className="form-select"
                style={{ background: '#0f172a', border: '1px solid #334155', color: 'white', borderRadius: '10px', height: '45px', width: '200px' }}
             >
                <option value="">All Categories</option>
                {categories.map(c => <option key={c._id} value={c.name}>{c.name}</option>)}
             </select>
             <button onClick={() => { resetForm(); setShowAddModal(true); }} 
               className="btn text-white fw-bold d-flex align-items-center gap-2 px-4" 
               style={{ background: 'linear-gradient(135deg, #06b6d4 0%, #3b82f6 100%)', borderRadius: '10px' }}>
               <Plus size={20} /> Add Item
             </button>
          </div>
        </div>

        {/* Table */}
        <div className="card border-0 shadow-lg" style={{ background: '#1e293b', borderRadius: '16px', overflow: 'hidden' }}>
          <div className="table-responsive">
             <table className="table table-hover mb-0">
                <thead style={{ background: 'rgba(15, 23, 42, 0.5)' }}>
                   <tr>
                      <th className="py-3 px-4 text-white fw-bold">ITEM NAME</th>
                      <th className="py-3 px-4 text-white fw-bold">QUANTITY</th>
                      <th className="py-3 px-4 text-white fw-bold">CATEGORY</th>
                      <th className="py-3 px-4 text-white fw-bold">STATUS</th>
                      <th className="py-3 px-4 text-white fw-bold text-end">ACTIONS</th>
                   </tr>
                </thead>
                <tbody>
                   {isLoading ? (
                      <tr><td colSpan="5" className="text-center py-5"><div className="spinner-border text-info"/></td></tr>
                   ) : filteredItems.length === 0 ? (
                      <tr><td colSpan="5" className="text-center py-5 text-muted">No items found.</td></tr>
                   ) : (
                      filteredItems.map(item => {
                        const expired = isExpired(item.expiryDate);
                        const nearing = isNearing(item.expiryDate);
                        return (
                          <tr key={item._id} style={{ borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                             <td className="py-3 px-4 align-middle fw-bold text-white" style={{ background: 'transparent' }}>{item.name}</td>
                             <td className="py-3 px-4 align-middle" style={{ background: 'transparent' }}>
                                <span className="badge fw-normal" style={{ background: 'rgba(255,255,255,0.1)', color: '#e2e8f0', padding: '6px 12px' }}>
                                  {item.quantity} {item.unit}
                                </span>
                             </td>
                             <td className="py-3 px-4 align-middle text-info" style={{ background: 'transparent' }}>{item.category || "-"}</td>
                             <td className="py-3 px-4 align-middle" style={{ background: 'transparent' }}>
                                {expired ? (
                                  <span className="badge fw-normal" style={{ background: 'rgba(239, 68, 68, 0.2)', color: '#ef4444' }}>Expired</span>
                                ) : nearing ? (
                                  <span className="badge fw-normal" style={{ background: 'rgba(245, 158, 11, 0.2)', color: '#f59e0b' }}>Expiring Soon</span>
                                ) : (
                                  <span className="badge fw-normal" style={{ background: 'rgba(16, 185, 129, 0.2)', color: '#10b981' }}>Good</span>
                                )}
                             </td>
                             <td className="py-3 px-4 align-middle text-end" style={{ background: 'transparent' }}>
                                <button onClick={() => openEdit(item)} className="btn btn-sm me-2" style={{ background: 'rgba(6, 182, 212, 0.1)', color: '#06b6d4', border: 'none' }}><Edit2 size={16}/></button>
                                <button onClick={() => { setDeleteId(item._id); deleteId && setShowAddModal(false); }} className="btn btn-sm" style={{ background: 'rgba(239, 68, 68, 0.1)', color: '#ef4444', border: 'none' }}><Trash2 size={16}/></button>
                             </td>
                          </tr>
                        );
                      })
                   )}
                </tbody>
             </table>
          </div>
        </div>

      </div>
    </div>
  );
};

export default InventoryPage;