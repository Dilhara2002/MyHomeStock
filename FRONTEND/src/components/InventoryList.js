import React, { useState, useEffect } from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap-icons/font/bootstrap-icons.css";

const InventoryList = () => {
  const [items, setItems] = useState([]);
  const [error, setError] = useState("");
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [itemToDelete, setItemToDelete] = useState(null);
  const [itemToEdit, setItemToEdit] = useState(null);
  const [name, setName] = useState("");
  const [quantity, setQuantity] = useState("");
  const [unit, setUnit] = useState("pieces");
  const [expiryDate, setExpiryDate] = useState("");
  const [category, setCategory] = useState("");
  const [categories, setCategories] = useState([]);
  const navigate = useNavigate();

  // Fetch inventory items
  useEffect(() => {
    const fetchItems = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          navigate("/login");
          return;
        }
        const response = await axios.get("http://localhost:5002/inventory", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setItems(response.data);
      } catch (error) {
        setError("Error fetching inventory");
      }
    };
    fetchItems();
  }, [navigate]);

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

  // Handle delete confirmation
  const handleDelete = (id) => {
    setItemToDelete(id);
    setShowDeleteModal(true);
  };

  // Confirm delete
  const confirmDelete = async () => {
    try {
      const token = localStorage.getItem("token");
      await axios.delete(`http://localhost:5002/inventory/${itemToDelete}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setItems(items.filter((item) => item._id !== itemToDelete));
      setShowDeleteModal(false);
    } catch (error) {
      setError("Error deleting item");
    }
  };

  // Handle edit click
  const handleEdit = (item) => {
    setItemToEdit(item);
    setName(item.name);
    setQuantity(item.quantity);
    setUnit(item.unit);
    setExpiryDate(item.expiryDate ? item.expiryDate.slice(0, 10) : "");
    setCategory(item.category || "");
    setShowEditModal(true);
  };

  // Handle edit form submission
  const handleEditSubmit = async (e) => {
    e.preventDefault();

    const updatedItem = { name, quantity, unit, expiryDate, category };

    try {
      const token = localStorage.getItem("token");
      await axios.put(`http://localhost:5002/inventory/${itemToEdit._id}`, updatedItem, {
        headers: { Authorization: `Bearer ${token}` },
      });

      // Update the item in the list
      setItems(
        items.map((item) =>
          item._id === itemToEdit._id ? { ...item, ...updatedItem } : item
        )
      );

      setShowEditModal(false);
    } catch (error) {
      setError("Error updating item");
    }
  };

  return (
    <div className="container mt-5" style={{ maxWidth: "1200px" }}>
      <h2 className="text-center mb-4 text-primary fw-bold">📦 Inventory List</h2>
      {error && <div className="alert alert-danger">{error}</div>}
      <Link to="/inventory/add" className="btn btn-success mb-3 fw-bold shadow">
        ➕ Add New Item
      </Link>
      <table className="table table-hover table-bordered shadow-sm rounded" style={{ borderRadius: "10px", overflow: "hidden" }}>
        <thead className="bg-primary text-white">
          <tr>
            <th>Name</th>
            <th>Quantity</th>
            <th>Expiry Date</th>
            <th>Category</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {items.map((item) => (
            <tr key={item._id} className="align-middle">
              <td>{item.name}</td>
              <td>{item.quantity} {item.unit}</td>
              <td>{item.expiryDate ? new Date(item.expiryDate).toLocaleDateString() : "N/A"}</td>
              <td>{item.category || "N/A"}</td>
              <td>
                <button onClick={() => handleEdit(item)} className="btn btn-warning btn-sm me-2">
                  <i className="bi bi-pencil-square"></i> Edit
                </button>
                <button onClick={() => handleDelete(item._id)} className="btn btn-danger btn-sm">
                  <i className="bi bi-trash"></i> Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Delete Confirmation Modal */}
      {showDeleteModal && (
        <div className="modal fade show d-block" tabIndex="-1" style={{ backgroundColor: "rgba(0, 0, 0, 0.5)" }}>
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content">
              <div className="modal-header bg-danger text-white">
                <h5 className="modal-title">Confirm Delete</h5>
                <button type="button" className="btn-close" onClick={() => setShowDeleteModal(false)}></button>
              </div>
              <div className="modal-body">Are you sure you want to delete this item?</div>
              <div className="modal-footer">
                <button type="button" className="btn btn-secondary" onClick={() => setShowDeleteModal(false)}>Cancel</button>
                <button type="button" className="btn btn-danger" onClick={confirmDelete}>Delete</button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Edit Modal */}
      {showEditModal && (
        <div className="modal fade show d-block" tabIndex="-1" style={{ backgroundColor: "rgba(0, 0, 0, 0.5)" }}>
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content">
              <div className="modal-header bg-primary text-white">
                <h5 className="modal-title">Edit Item</h5>
                <button type="button" className="btn-close" onClick={() => setShowEditModal(false)}></button>
              </div>
              <div className="modal-body">
                <form onSubmit={handleEditSubmit}>
                  <div className="mb-3">
                    <label htmlFor="name" className="form-label">Name</label>
                    <input
                      type="text"
                      className="form-control"
                      id="name"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      required
                    />
                  </div>
                  <div className="mb-3">
                    <label htmlFor="quantity" className="form-label">Quantity</label>
                    <input
                      type="number"
                      className="form-control"
                      id="quantity"
                      value={quantity}
                      onChange={(e) => setQuantity(e.target.value)}
                      required
                    />
                    <select
                      className="form-select mt-2"
                      value={unit}
                      onChange={(e) => setUnit(e.target.value)}
                    >
                      <option value="kg">kg</option>
                      <option value="liters">liters</option>
                      <option value="pieces">pieces</option>
                    </select>
                  </div>
                  <div className="mb-3">
                    <label htmlFor="expiryDate" className="form-label">Expiry Date</label>
                    <input
                      type="date"
                      className="form-control"
                      id="expiryDate"
                      value={expiryDate}
                      onChange={(e) => setExpiryDate(e.target.value)}
                    />
                  </div>
                  <div className="mb-3">
                    <label htmlFor="category" className="form-label">Category</label>
                    <select
                      className="form-select"
                      value={category}
                      onChange={(e) => setCategory(e.target.value)}
                    >
                      <option value="">Select a category</option>
                      {categories.map((cat) => (
                        <option key={cat._id} value={cat.name}>
                          {cat.name}
                        </option>
                      ))}
                    </select>
                  </div>
                  <button type="submit" className="btn btn-primary">Update</button>
                </form>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default InventoryList;