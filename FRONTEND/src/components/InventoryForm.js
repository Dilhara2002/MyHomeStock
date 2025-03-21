import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import { FaCheckCircle, FaExclamationCircle, FaBoxOpen, FaCalendarAlt, FaListAlt, FaEdit, FaPlus } from "react-icons/fa";

const InventoryForm = () => {
  const [name, setName] = useState("");
  const [quantity, setQuantity] = useState("");
  const [unit, setUnit] = useState("pieces");
  const [expiryDate, setExpiryDate] = useState("");
  const [category, setCategory] = useState("");
  const [categories, setCategories] = useState([]);
  const [error, setError] = useState("");
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const navigate = useNavigate();
  const { id } = useParams();

  // Fetch categories
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const token = localStorage.getItem("token");
        const response = await axios.get("http://localhost:5002/api/categories", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setCategories(response.data.categories);
      } catch (error) {
        setError("Error fetching categories");
      }
    };

    fetchCategories();
  }, []);

  // Fetch item details if editing
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
        } catch (error) {
          setError("Error fetching item details");
        }
      };

      fetchItem();
    }
  }, [id]);

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    const item = { name, quantity, unit, expiryDate, category };

    try {
      const token = localStorage.getItem("token");
      if (id) {
        await axios.put(`http://localhost:5002/inventory/${id}`, item, {
          headers: { Authorization: `Bearer ${token}` },
        });
      } else {
        await axios.post("http://localhost:5002/inventory", item, {
          headers: { Authorization: `Bearer ${token}` },
        });
      }
      setShowSuccessModal(true);
    } catch (error) {
      setError("Error saving item");
    }
  };

  // Close success modal and redirect
  const handleCloseSuccessModal = () => {
    setShowSuccessModal(false);
    navigate("/dashboard");
  };

  return (
    <div className="container mt-5" style={{ 
      maxWidth: "800px", 
      margin: "0 auto",
      fontFamily: "'Poppins', sans-serif",
      animation: "fadeIn 0.5s ease-in-out",
    }}>
      <div className="card shadow-lg" style={{ 
        borderRadius: "15px", 
        backgroundColor: "#fff",
        border: "none",
        overflow: "hidden"
      }}>
        <div className="card-header" style={{
          background: "linear-gradient(135deg, #4CAF50 0%, #2E7D32 100%)",
          color: "white",
          border: "none",
          padding: "20px",
          textAlign: "center"
        }}>
          <h2 className="mb-0" style={{ 
            fontWeight: "600", 
            fontSize: "26px",
            letterSpacing: "0.5px"
          }}>
            {id ? <><FaEdit className="me-2" /> Edit Item</> : <><FaPlus className="me-2" /> Add New Item</>}
          </h2>
        </div>
        
        <div className="card-body p-4">
          {error && (
            <div className="alert alert-danger" style={{
              borderRadius: "10px",
              display: "flex",
              alignItems: "center",
              padding: "15px"
            }}>
              <FaExclamationCircle className="me-3" size={20} />
              <span style={{ fontWeight: "500" }}>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="mt-3">
            <div className="mb-4">
              <label className="form-label" style={{ 
                color: "#2c3e50", 
                fontWeight: "600",
                fontSize: "16px",
                marginBottom: "8px"
              }}>
                <FaBoxOpen className="me-2" style={{ color: "#4CAF50" }} />
                Item Name
              </label>
              <input
                type="text"
                className="form-control form-control-lg"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                placeholder="Enter item name"
                style={{ 
                  borderRadius: "10px", 
                  border: "2px solid #e0e0e0", 
                  padding: "12px 15px",
                  transition: "border-color 0.3s",
                  fontSize: "16px",
                  boxShadow: "none"
                }}
              />
            </div>

            <div className="mb-4">
              <label className="form-label" style={{ 
                color: "#2c3e50", 
                fontWeight: "600",
                fontSize: "16px",
                marginBottom: "8px"
              }}>
                <i className="fas fa-weight me-2" style={{ color: "#4CAF50" }}></i>
                Quantity
              </label>
              <div className="d-flex">
                <input
                  type="number"
                  className="form-control form-control-lg"
                  value={quantity}
                  onChange={(e) => setQuantity(e.target.value)}
                  required
                  placeholder="Enter quantity"
                  style={{ 
                    borderRadius: "10px 0 0 10px", 
                    border: "2px solid #e0e0e0", 
                    borderRight: "none",
                    padding: "12px 15px",
                    transition: "border-color 0.3s",
                    fontSize: "16px",
                    boxShadow: "none",
                    flex: "2"
                  }}
                />
                <select
                  className="form-select form-select-lg"
                  value={unit}
                  onChange={(e) => setUnit(e.target.value)}
                  style={{ 
                    borderRadius: "0 10px 10px 0", 
                    border: "2px solid #e0e0e0", 
                    borderLeft: "none",
                    padding: "12px 15px",
                    transition: "border-color 0.3s",
                    fontSize: "16px",
                    boxShadow: "none",
                    flex: "1",
                    backgroundColor: "#f8f9fa"
                  }}
                >
                  <option value="kg">kg</option>
                  <option value="liters">liters</option>
                  <option value="pieces">pieces</option>
                  <option value="boxes">boxes</option>
                  <option value="grams">grams</option>
                  <option value="units">units</option>
                </select>
              </div>
            </div>

            <div className="mb-4">
              <label className="form-label" style={{ 
                color: "#2c3e50", 
                fontWeight: "600",
                fontSize: "16px",
                marginBottom: "8px"
              }}>
                <FaCalendarAlt className="me-2" style={{ color: "#4CAF50" }} />
                Expiry Date
              </label>
              <input
                type="date"
                className="form-control form-control-lg"
                value={expiryDate}
                onChange={(e) => setExpiryDate(e.target.value)}
                style={{ 
                  borderRadius: "10px", 
                  border: "2px solid #e0e0e0", 
                  padding: "12px 15px",
                  transition: "border-color 0.3s",
                  fontSize: "16px",
                  boxShadow: "none"
                }}
              />
            </div>

            <div className="mb-4">
              <label className="form-label" style={{ 
                color: "#2c3e50", 
                fontWeight: "600",
                fontSize: "16px",
                marginBottom: "8px"
              }}>
                <FaListAlt className="me-2" style={{ color: "#4CAF50" }} />
                Category
              </label>
              <select
                className="form-select form-select-lg"
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                style={{ 
                  borderRadius: "10px", 
                  border: "2px solid #e0e0e0", 
                  padding: "12px 15px",
                  transition: "border-color 0.3s",
                  fontSize: "16px",
                  boxShadow: "none"
                }}
              >
                <option value="">Select a category</option>
                {categories.map((cat) => (
                  <option key={cat._id} value={cat.name}>
                    {cat.name}
                  </option>
                ))}
              </select>
            </div>

            <button
              type="submit"
              className="btn btn-success btn-lg w-100 mt-4"
              style={{ 
                padding: "14px", 
                fontSize: "18px", 
                borderRadius: "10px", 
                border: "none",
                fontWeight: "600",
                background: "linear-gradient(135deg, #4CAF50 0%, #2E7D32 100%)",
                boxShadow: "0 4px 15px rgba(76, 175, 80, 0.3)",
                transition: "all 0.3s ease"
              }}
            >
              {id ? "Update Item" : "Add Item"}
            </button>
          </form>
        </div>
      </div>

      {/* Success Modal */}
      {showSuccessModal && (
        <div
          className="modal fade show"
          style={{
            display: "block",
            backgroundColor: "rgba(0, 0, 0, 0.6)",
            position: "fixed",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            zIndex: 1050,
          }}
        >
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content" style={{ 
              borderRadius: "15px",
              border: "none",
              overflow: "hidden"
            }}>
              <div className="modal-header" style={{ 
                background: "linear-gradient(135deg, #4CAF50 0%, #2E7D32 100%)",
                borderBottom: "none",
                padding: "20px 25px"
              }}>
                <h5 className="modal-title" style={{ 
                  color: "white", 
                  fontWeight: "600",
                  fontSize: "22px"
                }}>Success</h5>
                <button 
                  type="button" 
                  className="btn-close"
                  style={{ filter: "brightness(0) invert(1)" }}
                  onClick={handleCloseSuccessModal}
                ></button>
              </div>
              <div className="modal-body text-center p-5">
                <div style={{
                  width: "80px",
                  height: "80px",
                  margin: "0 auto 20px",
                  background: "#E8F5E9",
                  borderRadius: "50%",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center"
                }}>
                  <FaCheckCircle size={45} style={{ color: "#4CAF50" }} />
                </div>
                <h4 style={{ 
                  fontWeight: "600", 
                  color: "#2c3e50",
                  marginBottom: "10px"
                }}>
                  Great Job!
                </h4>
                <p style={{ 
                  fontSize: "18px", 
                  color: "#7f8c8d",
                  marginBottom: "0"
                }}>
                  Item {id ? "updated" : "added"} successfully!
                </p>
              </div>
              <div className="modal-footer d-block p-3" style={{ 
                borderTop: "none", 
                textAlign: "center",
                background: "#f8f9fa"
              }}>
                <button
                  type="button"
                  className="btn btn-success btn-lg"
                  onClick={handleCloseSuccessModal}
                  style={{ 
                    borderRadius: "10px", 
                    border: "none", 
                    padding: "12px 30px",
                    background: "linear-gradient(135deg, #4CAF50 0%, #2E7D32 100%)",
                    boxShadow: "0 4px 15px rgba(76, 175, 80, 0.3)",
                    fontWeight: "600",
                    fontSize: "16px",
                    width: "90%",
                    margin: "0 auto"
                  }}
                >
                  Go to Dashboard
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Add custom CSS for animations */}
      <style>
        {`
          @keyframes fadeIn {
            from { opacity: 0; transform: translateY(20px); }
            to { opacity: 1; transform: translateY(0); }
          }
          
          .form-control:focus, .form-select:focus {
            border-color: #4CAF50 !important;
            box-shadow: 0 0 0 0.25rem rgba(76, 175, 80, 0.25) !important;
          }
          
          .btn-success:hover {
            transform: translateY(-2px);
            box-shadow: 0 6px 20px rgba(76, 175, 80, 0.4) !important;
          }
        `}
      </style>
    </div>
  );
};

export default InventoryForm;