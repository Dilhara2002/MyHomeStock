import React, { useState, useEffect } from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom"; // Added Link here
import { motion, AnimatePresence } from "framer-motion";
import jsPDF from "jspdf";
import "jspdf-autotable";
import {
  ShoppingCart, Plus, Trash2, Edit2, AlertTriangle, 
  Search, FileText, CheckCircle, X, ArrowLeft, Zap
} from "lucide-react"; // Removed unused Save icon

// --- Reusable Modal ---
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
          background: '#1e293b', width: '90%', maxWidth: '500px',
          borderRadius: '24px', border: '1px solid rgba(255,255,255,0.1)',
          boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.5)'
        }}
      >
        <div className="d-flex justify-content-between align-items-center p-4 border-bottom border-secondary border-opacity-25">
          <h4 className="m-0 fw-bold text-white">{title}</h4>
          <button onClick={onClose} className="btn btn-sm text-muted hover-white"><X size={20}/></button>
        </div>
        <div className="p-4">{children}</div>
        {footer && <div className="p-4 border-top border-secondary border-opacity-25 d-flex justify-content-end gap-2">{footer}</div>}
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
      {isSuccess ? <CheckCircle size={20} /> : <AlertTriangle size={20} />}
      <span style={{ fontWeight: 500 }}>{message}</span>
      <button onClick={onClose} style={{ background: 'none', border: 'none', color: 'white' }}><X size={18} /></button>
    </motion.div>
  );
};

const ShoppingList = () => {
  // --- State ---
  const [inventoryItems, setInventoryItems] = useState([]);
  const [shoppingList, setShoppingList] = useState({ items: [] });
  const [autoAddedItems, setAutoAddedItems] = useState([]);
  const [selectedItem, setSelectedItem] = useState("");
  const [quantity, setQuantity] = useState(1);
  const [loading, setLoading] = useState(true); // Initialized to true
  const [editingItem, setEditingItem] = useState(null);
  const [editQuantity, setEditQuantity] = useState(1);
  
  // UI State
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [itemToDelete, setItemToDelete] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [notification, setNotification] = useState(null);

  const navigate = useNavigate();

  // --- Styles ---
  const inputStyle = {
    background: 'rgba(15, 23, 42, 0.6)', border: '1px solid rgba(255,255,255,0.1)',
    color: 'white', borderRadius: '12px', padding: '12px', width: '100%', outline: 'none'
  };

  const cardStyle = {
    backgroundColor: 'rgba(30, 41, 59, 0.4)', backdropFilter: 'blur(12px)',
    borderRadius: '20px', border: '1px solid rgba(255, 255, 255, 0.05)', overflow: 'hidden'
  };

  // --- Logic ---
  const showNotification = (msg, type = "success") => {
    setNotification({ message: msg, type });
    setTimeout(() => setNotification(null), 3000);
  };

  useEffect(() => {
    const fetchData = async () => {
      const token = localStorage.getItem("token");
      if (!token) { navigate("/login"); return; }

      try {
        setLoading(true);
        const [invRes, shopRes, autoRes] = await Promise.all([
          axios.get("http://localhost:5002/inventory", { headers: { Authorization: `Bearer ${token}` } }),
          axios.get("http://localhost:5002/shopping-list", { headers: { Authorization: `Bearer ${token}` } }),
          axios.get("http://localhost:5002/shopping-list/auto-added", { headers: { Authorization: `Bearer ${token}` } })
        ]);

        setInventoryItems(invRes.data);
        setShoppingList(shopRes.data);
        setAutoAddedItems(Array.isArray(autoRes.data) ? autoRes.data : []);
      } catch (error) {
        if (error.response?.status === 401) { localStorage.removeItem("token"); navigate("/login"); }
        else showNotification("Error loading data", "error");
      } finally { setLoading(false); }
    };
    fetchData();
  }, [navigate]);

  const handleAddToShoppingList = async () => {
    if (!selectedItem || quantity <= 0) return showNotification("Invalid item or quantity", "error");
    try {
      const token = localStorage.getItem("token");
      const res = await axios.post("http://localhost:5002/shopping-list/add", 
        { itemName: selectedItem, quantity }, { headers: { Authorization: `Bearer ${token}` } });
      setShoppingList(res.data.shoppingList);
      setSelectedItem(""); setQuantity(1);
      showNotification("Item added to list!");
    } catch (e) { showNotification("Failed to add item", "error"); }
  };

  const handleAutoAddItems = async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await axios.post("http://localhost:5002/shopping-list/auto-add", {}, { headers: { Authorization: `Bearer ${token}` } });
      
      // Refresh Lists
      const [shopRes, autoRes] = await Promise.all([
        axios.get("http://localhost:5002/shopping-list", { headers: { Authorization: `Bearer ${token}` } }),
        axios.get("http://localhost:5002/shopping-list/auto-added", { headers: { Authorization: `Bearer ${token}` } })
      ]);
      
      setShoppingList(shopRes.data);
      setAutoAddedItems(Array.isArray(autoRes.data) ? autoRes.data : []);
      showNotification(res.data.message || "Low stock items added!");
    } catch (e) { showNotification("Failed to auto-add items", "error"); }
  };

  const handleUpdateItem = async () => {
    if (!editingItem || editQuantity <= 0) return showNotification("Invalid quantity", "error");
    try {
      const token = localStorage.getItem("token");
      await axios.put(`http://localhost:5002/shopping-list/update/${editingItem.name}`, 
        { quantity: editQuantity }, { headers: { Authorization: `Bearer ${token}` } });

      setShoppingList(prev => ({ ...prev, items: prev.items.map(i => i.name === editingItem.name ? { ...i, quantity: editQuantity } : i) }));
      setEditingItem(null); setEditQuantity(1);
      showNotification("Quantity updated!");
    } catch (e) { showNotification("Update failed", "error"); }
  };

  const handleDeleteFromShoppingList = async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await axios.delete(`http://localhost:5002/shopping-list/remove/${itemToDelete}`, { headers: { Authorization: `Bearer ${token}` } });
      setShoppingList(res.data.shoppingList);
      setShowDeleteModal(false);
      showNotification("Item removed!");
    } catch (e) { showNotification("Delete failed", "error"); }
  };

  const generateReport = () => {
    const doc = new jsPDF();
    doc.setFontSize(20); doc.setTextColor(0, 188, 212);
    doc.text("Shopping List Report", 105, 20, { align: "center" });
    doc.setFontSize(10); doc.setTextColor(100);
    doc.text(`Generated: ${new Date().toLocaleDateString()}`, 105, 28, { align: "center" });

    let finalY = 40;
    
    if (filteredAutoAddedItems.length > 0) {
      doc.setFontSize(14); doc.setTextColor(0); doc.text("Auto-Added (Low Stock)", 14, 45);
      doc.autoTable({
        startY: 50, head: [["Item Name", "Qty"]],
        body: filteredAutoAddedItems.map(i => [i.name, i.quantity]),
        theme: "grid", headStyles: { fillColor: [0, 188, 212] }
      });
      finalY = doc.lastAutoTable.finalY + 15;
    }

    if (filteredItems.length > 0) {
      doc.setFontSize(14); doc.setTextColor(0); doc.text("Manual Items", 14, finalY);
      doc.autoTable({
        startY: finalY + 5, head: [["Item Name", "Qty"]],
        body: filteredItems.map(i => [i.name, i.quantity]),
        theme: "grid", headStyles: { fillColor: [50, 50, 50] }
      });
    }
    doc.save(`ShoppingList_${new Date().toLocaleDateString()}.pdf`);
  };

  const filteredItems = (shoppingList.items || []).filter(i => i.name.toLowerCase().includes(searchTerm.toLowerCase()));
  const filteredAutoAddedItems = (autoAddedItems || []).filter(i => i.name.toLowerCase().includes(searchTerm.toLowerCase()));

  return (
    <div style={{
      minHeight: '100vh', backgroundColor: '#0f172a', color: '#f8fafc',
      paddingTop: '40px', paddingBottom: '80px', fontFamily: '"Inter", sans-serif', position: 'relative'
    }}>
      
      {/* Background Glow */}
      <div style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '500px', background: 'radial-gradient(circle at 50% -20%, rgba(6, 182, 212, 0.15), transparent 70%)', zIndex: 0, pointerEvents: 'none' }} />

      <style>{`
        ::-webkit-scrollbar { width: 8px; }
        ::-webkit-scrollbar-track { background: #0f172a; }
        ::-webkit-scrollbar-thumb { background: #334155; border-radius: 4px; }
        .table { --bs-table-bg: transparent !important; --bs-table-color: #cbd5e1; }
        .table > :not(caption) > * > * { background-color: transparent !important; border-bottom-color: rgba(255,255,255,0.05); }
        .table td { color: #e2e8f0; }
        .form-select option { background-color: #0f172a; color: white; }
      `}</style>

      <AnimatePresence>
        {notification && <Notification {...notification} onClose={() => setNotification(null)} />}
      </AnimatePresence>

      <div className="container" style={{ position: 'relative', zIndex: 1 }}>
        
        {/* Header */}
        <div className="d-flex flex-column flex-md-row justify-content-between align-items-center mb-5 pb-3" style={{ borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
          <div className="d-flex align-items-center mb-3 mb-md-0">
            <Link to="/" className="text-decoration-none me-3">
              <div className="btn btn-outline-light border-0 rounded-circle p-2" style={{ background: 'rgba(255,255,255,0.05)' }}>
                <ArrowLeft size={24} />
              </div>
            </Link>
            <h1 className="fw-bold m-0 display-6">Shopping <span style={{ color: '#06b6d4' }}>List</span></h1>
          </div>
          <div className="d-flex gap-3">
            <button onClick={handleAutoAddItems} className="btn d-flex align-items-center text-white fw-bold" style={{ background: 'rgba(6, 182, 212, 0.2)', color: '#06b6d4', border: '1px solid rgba(6, 182, 212, 0.3)', borderRadius: '12px', padding: '10px 20px' }}>
              <Zap size={18} className="me-2"/> Auto-Add Low Stock
            </button>
            <button onClick={generateReport} className="btn btn-outline-light d-flex align-items-center" style={{ borderRadius: '12px', padding: '10px 20px' }}>
              <FileText size={18} className="me-2"/> Export PDF
            </button>
          </div>
        </div>

        {/* Loading Spinner */}
        {loading ? (
          <div className="text-center py-5"><div className="spinner-border text-info"/></div>
        ) : (
          <div className="row g-5">
            
            {/* --- Left Column: Controls --- */}
            <div className="col-lg-4">
              
              {/* Search */}
              <div className="mb-4 position-relative">
                 <Search size={20} className="text-muted position-absolute" style={{ top: '14px', left: '15px' }} />
                 <input type="text" placeholder="Search list..." value={searchTerm} onChange={e => setSearchTerm(e.target.value)}
                    style={{ ...inputStyle, paddingLeft: '45px', background: 'rgba(30, 41, 59, 0.4)' }} />
              </div>

              {/* Add Item Card */}
              <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} style={cardStyle}>
                <div className="p-4">
                  <h5 className="fw-bold text-white mb-4 d-flex align-items-center"><Plus size={20} className="me-2 text-info"/> Add to List</h5>
                  
                  <div className="mb-3">
                    <label className="small text-muted mb-1 fw-bold">SELECT ITEM</label>
                    <select value={selectedItem} onChange={e => setSelectedItem(e.target.value)} className="form-select border-0 text-white" style={inputStyle}>
                      <option value="">Select...</option>
                      {inventoryItems.map(i => <option key={i._id} value={i.name}>{i.name}</option>)}
                    </select>
                  </div>

                  <div className="mb-4">
                    <label className="small text-muted mb-1 fw-bold">QUANTITY</label>
                    <input type="number" value={quantity} onChange={e => setQuantity(Number(e.target.value))} min="1" className="form-control border-0 text-white" style={inputStyle} />
                  </div>

                  <button onClick={handleAddToShoppingList} className="btn w-100 fw-bold text-white py-2" style={{ background: 'linear-gradient(135deg, #06b6d4 0%, #3b82f6 100%)', borderRadius: '12px', border: 'none' }}>
                    Add to Shopping List
                  </button>
                </div>
              </motion.div>

            </div>

            {/* --- Right Column: Lists --- */}
            <div className="col-lg-8">
              
              {/* Auto-Added Table */}
              {filteredAutoAddedItems.length > 0 && (
                <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="mb-5">
                  <h5 className="fw-bold text-warning mb-3 d-flex align-items-center"><Zap size={18} className="me-2"/> Low Stock Alerts (Auto-Added)</h5>
                  <div style={cardStyle}>
                    <table className="table table-hover mb-0">
                      <thead style={{ background: 'rgba(245, 158, 11, 0.1)' }}>
                        <tr><th className="py-3 px-4 text-warning border-0">ITEM NAME</th><th className="py-3 px-4 text-warning border-0 text-end">QTY</th></tr>
                      </thead>
                      <tbody>
                        {filteredAutoAddedItems.map((item, i) => (
                          <tr key={i}>
                            <td className="py-3 px-4 align-middle fw-bold">{item.name}</td>
                            <td className="py-3 px-4 align-middle text-end"><span className="badge bg-warning text-dark">{item.quantity}</span></td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </motion.div>
              )}

              {/* Manual List Table */}
              <h5 className="fw-bold text-white mb-3 d-flex align-items-center"><ShoppingCart size={18} className="me-2 text-info"/> Your Shopping List</h5>
              
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} style={cardStyle}>
                {filteredItems.length === 0 ? (
                  <div className="text-center py-5 text-muted">
                    <ShoppingCart size={40} className="mb-3 opacity-25"/>
                    <p>Your list is empty.</p>
                  </div>
                ) : (
                  <div className="table-responsive">
                    <table className="table table-hover mb-0">
                      <thead style={{ background: 'rgba(15, 23, 42, 0.5)' }}>
                        <tr>
                          <th className="py-3 px-4 text-white">ITEM</th>
                          <th className="py-3 px-4 text-white text-center">QTY</th>
                          <th className="py-3 px-4 text-white text-end">ACTIONS</th>
                        </tr>
                      </thead>
                      <tbody>
                        {filteredItems.map((item, i) => (
                          <tr key={i}>
                            <td className="py-3 px-4 align-middle fw-bold">{item.name}</td>
                            <td className="py-3 px-4 align-middle text-center">
                              <span className="badge bg-secondary bg-opacity-25 text-white border border-secondary">{item.quantity}</span>
                            </td>
                            <td className="py-3 px-4 align-middle text-end">
                              <button onClick={() => { setEditingItem(item); setEditQuantity(item.quantity); }} className="btn btn-sm btn-icon me-2 text-info bg-info bg-opacity-10"><Edit2 size={16}/></button>
                              <button onClick={() => { setItemToDelete(item.name); setShowDeleteModal(true); }} className="btn btn-sm btn-icon text-danger bg-danger bg-opacity-10"><Trash2 size={16}/></button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </motion.div>

            </div>
          </div>
        )}
      </div>

      {/* --- Edit Modal --- */}
      <AnimatePresence>
        {editingItem && (
          <Modal title="Update Quantity" isOpen={!!editingItem} onClose={() => setEditingItem(null)}
            footer={
              <><button onClick={() => setEditingItem(null)} className="btn btn-outline-light border-0">Cancel</button>
              <button onClick={handleUpdateItem} className="btn fw-bold text-white" style={{ background: '#06b6d4', padding: '8px 20px', borderRadius: '10px' }}>Save</button></>
            }
          >
            <label className="small text-muted mb-1 fw-bold">ITEM NAME</label>
            <input type="text" value={editingItem.name} disabled className="form-control mb-3 text-muted" style={{ ...inputStyle, background: '#0f172a' }} />
            <label className="small text-muted mb-1 fw-bold">NEW QUANTITY</label>
            <input type="number" value={editQuantity} onChange={e => setEditQuantity(Number(e.target.value))} min="1" className="form-control text-white" style={inputStyle} />
          </Modal>
        )}
      </AnimatePresence>

      {/* --- Delete Modal --- */}
      <AnimatePresence>
        {showDeleteModal && (
          <Modal title="Remove Item" isOpen={showDeleteModal} onClose={() => setShowDeleteModal(false)}
            footer={
              <><button onClick={() => setShowDeleteModal(false)} className="btn btn-outline-light border-0">Cancel</button>
              <button onClick={handleDeleteFromShoppingList} className="btn fw-bold text-white bg-danger" style={{ padding: '8px 20px', borderRadius: '10px' }}>Remove</button></>
            }
          >
            <div className="text-center">
              <AlertTriangle size={40} className="text-danger mb-3"/>
              <p className="text-muted">Remove <b>{itemToDelete}</b> from your list?</p>
            </div>
          </Modal>
        )}
      </AnimatePresence>

    </div>
  );
};

export default ShoppingList;