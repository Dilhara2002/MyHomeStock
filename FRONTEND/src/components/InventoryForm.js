import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import { FaCheckCircle, FaExclamationCircle } from "react-icons/fa"; // Added FontAwesome for icons

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
    <div className="container mt-5" style={{ maxWidth: "800px", margin: "0 auto" }}>
      <div className="card shadow p-4" style={{ borderRadius: "10px", backgroundColor: "#fff" }}>
        <h2 className="text-center mb-4" style={{ color: "#2c3e50", fontWeight: "bold", fontSize: "24px" }}>
          {id ? "✏️ Edit Item" : "➕ Add New Item"}
        </h2>
        {error && (
          <div className="alert alert-danger">
            <FaExclamationCircle className="me-2" />
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="mb-3">
            <label className="form-label fw-bold" style={{ color: "#34495e" }}>Name</label>
            <input
              type="text"
              className="form-control"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              style={{ borderRadius: "6px", border: "1px solid #ced4da", padding: "8px" }}
            />
          </div>

          <div className="mb-3">
            <label className="form-label fw-bold" style={{ color: "#34495e" }}>Quantity</label>
            <div className="d-flex">
              <input
                type="number"
                className="form-control"
                value={quantity}
                onChange={(e) => setQuantity(e.target.value)}
                required
                style={{ borderRadius: "6px", border: "1px solid #ced4da", padding: "8px", flex: "1" }}
              />
              <select
                className="form-select ms-2"
                value={unit}
                onChange={(e) => setUnit(e.target.value)}
                style={{ borderRadius: "6px", border: "1px solid #ced4da", padding: "8px", flex: "1" }}
              >
                <option value="kg">kg</option>
                <option value="liters">liters</option>
                <option value="pieces">pieces</option>
              </select>
            </div>
          </div>

          <div className="mb-3">
            <label className="form-label fw-bold" style={{ color: "#34495e" }}>Expiry Date</label>
            <input
              type="date"
              className="form-control"
              value={expiryDate}
              onChange={(e) => setExpiryDate(e.target.value)}
              style={{ borderRadius: "6px", border: "1px solid #ced4da", padding: "8px" }}
            />
          </div>

          <div className="mb-3">
            <label className="form-label fw-bold" style={{ color: "#34495e" }}>Category</label>
            <select
              className="form-select"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              style={{ borderRadius: "6px", border: "1px solid #ced4da", padding: "8px" }}
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
            className="btn btn-success w-100"
            style={{ padding: "10px", fontSize: "16px", borderRadius: "6px", border: "none" }}
          >
            {id ? "Update" : "Add"}
          </button>
        </form>
      </div>

      {/* Success Modal */}
      {showSuccessModal && (
        <div
          className="modal fade show"
          style={{
            display: "block",
            backgroundColor: "rgba(0, 0, 0, 0.5)",
            position: "fixed",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            zIndex: 1050,
          }}
        >
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content" style={{ borderRadius: "10px" }}>
              <div className="modal-header bg-success text-white" style={{ borderTopLeftRadius: "10px", borderTopRightRadius: "10px" }}>
                <h5 className="modal-title">Success</h5>
                <button type="button" className="btn-close" onClick={handleCloseSuccessModal}></button>
              </div>
              <div className="modal-body text-center">
                <FaCheckCircle className="mb-3" size={30} color="#28a745" />
                <p>Item {id ? "updated" : "added"} successfully!</p>
              </div>
              <div className="modal-footer">
                <button
                  type="button"
                  className="btn btn-success w-100"
                  onClick={handleCloseSuccessModal}
                  style={{ borderRadius: "6px", border: "none", padding: "10px" }}
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default InventoryForm;
