import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate, useParams, Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Box, Calendar, Layers, Save, ArrowLeft, 
  CheckCircle, AlertCircle, X, Scale
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

const InventoryForm = () => {
  const [name, setName] = useState("");
  const [quantity, setQuantity] = useState("");
  const [unit, setUnit] = useState("pieces");
  const [expiryDate, setExpiryDate] = useState("");
  const [category, setCategory] = useState("");
  const [categories, setCategories] = useState([]);
  
  // UI State
  const [error, setError] = useState("");
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [validationErrors, setValidationErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  
  const navigate = useNavigate();
  const { id } = useParams();

  // --- Styles ---
  const inputStyle = {
    background: 'rgba(15, 23, 42, 0.6)',
    border: '1px solid rgba(255,255,255,0.1)',
    color: 'white',
    borderRadius: '12px',
    padding: '12px 15px',
    width: '100%',
    outline: 'none',
    transition: 'all 0.2s'
  };

  const labelStyle = {
    color: '#cbd5e1',
    fontSize: '0.85rem',
    fontWeight: '600',
    marginBottom: '8px',
    display: 'flex',
    alignItems: 'center',
    gap: '8px'
  };

  // --- Logic ---

  const validateForm = () => {
    const errors = {};
    let isValid = true;

    if (!name.trim()) { errors.name = "Item name is required"; isValid = false; }
    else if (name.length > 50) { errors.name = "Name too long (max 50 chars)"; isValid = false; }

    if (!quantity) { errors.quantity = "Quantity required"; isValid = false; }
    else if (isNaN(quantity) || parseFloat(quantity) <= 0) { errors.quantity = "Must be positive"; isValid = false; }
    else if (parseFloat(quantity) > 10000) { errors.quantity = "Max quantity 10,000"; isValid = false; }

    if (expiryDate) {
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      if (new Date(expiryDate) < today) { errors.expiryDate = "Date cannot be in past"; isValid = false; }
    }

    if (!category) { errors.category = "Category required"; isValid = false; }

    setValidationErrors(errors);
    return isValid;
  };

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const token = localStorage.getItem("token");
        const response = await axios.get("http://localhost:5002/api/categories", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setCategories(response.data.categories);
      } catch (error) { setError("Error fetching categories"); }
    };
    fetchCategories();
  }, []);

  useEffect(() => {
    if (id) {
      const fetchItem = async () => {
        try {
          const token = localStorage.getItem("token");
          const response = await axios.get(`http://localhost:5002/inventory/${id}`, {
            headers: { Authorization: `Bearer ${token}` },
          });
          const item = response.data;
          setName(item.name);
          setQuantity(item.quantity);
          setUnit(item.unit);
          setExpiryDate(item.expiryDate ? item.expiryDate.slice(0, 10) : "");
          setCategory(item.category || "");
        } catch (error) { setError("Error loading item details"); }
      };
      fetchItem();
    }
  }, [id]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    setIsLoading(true);
    const item = { name, quantity, unit, expiryDate, category };

    try {
      const token = localStorage.getItem("token");
      if (id) {
        await axios.put(`http://localhost:5002/inventory/${id}`, item, { headers: { Authorization: `Bearer ${token}` } });
      } else {
        await axios.post("http://localhost:5002/inventory", item, { headers: { Authorization: `Bearer ${token}` } });
      }
      setShowSuccessModal(true);
    } catch (error) {
      setError("Error saving item: " + (error.response?.data?.message || error.message));
    } finally {
      setIsLoading(false);
    }
  };

  // Helper to clear specific error on input
  const clearError = (field) => {
    if (validationErrors[field]) {
      setValidationErrors(prev => ({ ...prev, [field]: "" }));
    }
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
      
      {/* CSS for Focus Effects */}
      <style>{`
        input:focus, select:focus {
          border-color: #06b6d4 !important;
          box-shadow: 0 0 0 4px rgba(6, 182, 212, 0.1) !important;
        }
        /* Custom Date Picker Icon for Dark Mode */
        ::-webkit-calendar-picker-indicator {
          filter: invert(1);
          cursor: pointer;
        }
      `}</style>

      {/* Background Glow */}
      <div style={{
        position: 'absolute', top: 0, left: 0, width: '100%', height: '500px',
        background: 'radial-gradient(circle at 50% -20%, rgba(6, 182, 212, 0.15), transparent 70%)',
        zIndex: 0, pointerEvents: 'none'
      }} />

      {/* Error Notification Toast */}
      <AnimatePresence>
        {error && <Notification message={error} type="error" onClose={() => setError("")} />}
      </AnimatePresence>

      <div className="container" style={{ position: 'relative', zIndex: 1, maxWidth: '700px' }}>
        
        {/* Header */}
        <div className="d-flex align-items-center mb-5">
          <Link to="/Inventory" className="text-decoration-none me-4">
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
              {id ? "Edit" : "Add New"} <span style={{ color: '#06b6d4' }}>Item</span>
            </h1>
            <p className="m-0" style={{ color: '#cbd5e1' }}>Fill in the details below to update your inventory.</p>
          </div>
        </div>

        {/* Form Card */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
          className="card border-0 shadow-lg"
          style={{
            backgroundColor: 'rgba(30, 41, 59, 0.7)', backdropFilter: 'blur(12px)',
            borderRadius: '24px', border: '1px solid rgba(255, 255, 255, 0.08)'
          }}
        >
          <div className="card-body p-4 p-md-5">
            <form onSubmit={handleSubmit}>
              
              {/* Item Name */}
              <div className="mb-4">
                <label style={labelStyle}><Box size={16} className="text-info"/> ITEM NAME</label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => { setName(e.target.value); clearError("name"); }}
                  placeholder="e.g. Fresh Milk"
                  style={{ ...inputStyle, borderColor: validationErrors.name ? '#ef4444' : inputStyle.borderColor }}
                />
                {validationErrors.name && <div className="text-danger small mt-1">{validationErrors.name}</div>}
              </div>

              {/* Quantity & Unit Row */}
              <div className="row g-3 mb-4">
                <div className="col-8">
                  <label style={labelStyle}><Scale size={16} className="text-info"/> QUANTITY</label>
                  <input
                    type="number"
                    value={quantity}
                    onChange={(e) => { setQuantity(e.target.value); clearError("quantity"); }}
                    placeholder="0.00"
                    step="0.01"
                    style={{ 
                      ...inputStyle, 
                      borderRadius: '12px 0 0 12px',
                      borderColor: validationErrors.quantity ? '#ef4444' : inputStyle.borderColor 
                    }}
                  />
                </div>
                <div className="col-4">
                  <label style={{ ...labelStyle, visibility: 'hidden' }}>UNIT</label>
                  <select
                    value={unit}
                    onChange={(e) => setUnit(e.target.value)}
                    style={{ 
                      ...inputStyle, 
                      borderRadius: '0 12px 12px 0', 
                      borderLeft: 'none',
                      backgroundColor: 'rgba(15, 23, 42, 0.8)'
                    }}
                  >
                    <option value="pieces">Pieces</option>
                    <option value="kg">Kg</option>
                    <option value="liters">Liters</option>
                  </select>
                </div>
                {validationErrors.quantity && <div className="text-danger small mt-0">{validationErrors.quantity}</div>}
              </div>

              {/* Expiry Date */}
              <div className="mb-4">
                <label style={labelStyle}><Calendar size={16} className="text-info"/> EXPIRY DATE</label>
                <input
                  type="date"
                  value={expiryDate}
                  onChange={(e) => { setExpiryDate(e.target.value); clearError("expiryDate"); }}
                  min={new Date().toISOString().split('T')[0]}
                  style={{ ...inputStyle, borderColor: validationErrors.expiryDate ? '#ef4444' : inputStyle.borderColor }}
                />
                {validationErrors.expiryDate && <div className="text-danger small mt-1">{validationErrors.expiryDate}</div>}
              </div>

              {/* Category */}
              <div className="mb-5">
                <label style={labelStyle}><Layers size={16} className="text-info"/> CATEGORY</label>
                <select
                  value={category}
                  onChange={(e) => { setCategory(e.target.value); clearError("category"); }}
                  style={{ ...inputStyle, borderColor: validationErrors.category ? '#ef4444' : inputStyle.borderColor }}
                >
                  <option value="" style={{ color: '#94a3b8' }}>Select a category...</option>
                  {categories.map((cat) => (
                    <option key={cat._id} value={cat.name} style={{ background: '#0f172a' }}>
                      {cat.name}
                    </option>
                  ))}
                </select>
                {validationErrors.category && <div className="text-danger small mt-1">{validationErrors.category}</div>}
              </div>

              {/* Submit Button */}
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                type="submit"
                disabled={isLoading}
                className="btn w-100 py-3 fw-bold text-white d-flex align-items-center justify-content-center"
                style={{
                  background: 'linear-gradient(135deg, #06b6d4 0%, #3b82f6 100%)',
                  borderRadius: '12px', border: 'none',
                  boxShadow: '0 4px 15px rgba(6, 182, 212, 0.4)',
                  fontSize: '1.1rem'
                }}
              >
                {isLoading ? <span className="spinner-border spinner-border-sm me-2"/> : <Save size={20} className="me-2"/>}
                {id ? "Update Item" : "Save Item"}
              </motion.button>

            </form>
          </div>
        </motion.div>
      </div>

      {/* Success Modal */}
      <AnimatePresence>
        {showSuccessModal && (
          <div style={{
            position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
            background: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(8px)',
            display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 1200
          }}>
            <motion.div 
              initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.9, opacity: 0 }}
              style={{
                background: '#1e293b', padding: '40px', borderRadius: '24px',
                border: '1px solid rgba(255,255,255,0.1)', maxWidth: '400px', width: '90%',
                textAlign: 'center', boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.5)'
              }}
            >
              <div style={{ 
                width: '80px', height: '80px', borderRadius: '50%', background: 'rgba(16, 185, 129, 0.1)', 
                color: '#10b981', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 20px'
              }}>
                <CheckCircle size={40} />
              </div>
              <h3 className="fw-bold text-white mb-2">Success!</h3>
              <p className="text-muted mb-4">
                Item has been {id ? "updated" : "added"} to your inventory successfully.
              </p>
              <button 
                onClick={() => { setShowSuccessModal(false); navigate("/Inventory"); }}
                className="btn w-100 py-2 fw-bold text-white"
                style={{ background: '#10b981', borderRadius: '12px', border: 'none' }}
              >
                Go to Dashboard
              </button>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </div>
  );
};

export default InventoryForm;