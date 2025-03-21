import React, { useState, useEffect } from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap-icons/font/bootstrap-icons.css";
import { FaBoxOpen, FaPlus, FaTrashAlt, FaEdit, FaExclamationTriangle, FaCalendarAlt, FaTag, FaList } from "react-icons/fa";

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
  const [searchTerm, setSearchTerm] = useState("");
  const [filterCategory, setFilterCategory] = useState("");
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

  // Filter items based on search term and category
  const filteredItems = items.filter(
    (item) =>
      item.name.toLowerCase().includes(searchTerm.toLowerCase()) &&
      (filterCategory === "" || item.category === filterCategory)
  );

  // Get unique categories from items
  const uniqueCategories = [...new Set(items.map((item) => item.category).filter(Boolean))];

  // Check if an item is nearing expiry (within 7 days)
  const isNearingExpiry = (date) => {
    if (!date) return false;
    const expiryDate = new Date(date);
    const today = new Date();
    const differenceInDays = Math.floor((expiryDate - today) / (1000 * 60 * 60 * 24));
    return differenceInDays >= 0 && differenceInDays <= 7;
  };

  // Check if an item is expired
  const isExpired = (date) => {
    if (!date) return false;
    const expiryDate = new Date(date);
    const today = new Date();
    return expiryDate < today;
  };

  return (
    <div className="container mt-5" style={{ 
      maxWidth: "1200px", 
      margin: "0 auto",
      fontFamily: "'Poppins', sans-serif",
      animation: "fadeIn 0.5s ease-in-out"
    }}>
      <div className="card shadow-lg" style={{ 
        borderRadius: "15px", 
        border: "none",
        overflow: "hidden"
      }}>
        <div className="card-header" style={{
          background: "linear-gradient(135deg, #4CAF50 0%, #2E7D32 100%)",
          color: "white",
          border: "none",
          padding: "25px 30px",
          position: "relative"
        }}>
          <div className="d-flex justify-content-between align-items-center">
            <h2 className="m-0" style={{ 
              fontWeight: "600", 
              fontSize: "28px",
              letterSpacing: "0.5px"
            }}>
              <FaBoxOpen className="me-3" />
              Inventory Management
            </h2>
            <Link to="/inventory/add" className="btn btn-light" style={{
              borderRadius: "50px",
              padding: "12px 25px",
              fontWeight: "600",
              boxShadow: "0 4px 10px rgba(0, 0, 0, 0.1)",
              transition: "all 0.3s ease",
              display: "flex",
              alignItems: "center",
              gap: "8px"
            }}>
              <FaPlus /> Add New Item
            </Link>
          </div>
        </div>
        
        <div className="card-body p-4">
          {error && (
            <div className="alert alert-danger" style={{
              borderRadius: "10px",
              display: "flex",
              alignItems: "center",
              padding: "15px",
              marginBottom: "20px"
            }}>
              <FaExclamationTriangle className="me-3" size={20} />
              <span style={{ fontWeight: "500" }}>{error}</span>
            </div>
          )}

          {/* Search and Filter */}
          <div className="row mb-4 g-3">
            <div className="col-md-6">
              <div className="input-group" style={{ boxShadow: "0 2px 5px rgba(0,0,0,0.08)" }}>
                <span className="input-group-text bg-white" style={{ 
                  borderRadius: "10px 0 0 10px", 
                  border: "2px solid #e0e0e0",
                  borderRight: "none" 
                }}>
                  <i className="bi bi-search"></i>
                </span>
                <input
                  type="text"
                  className="form-control"
                  placeholder="Search items..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  style={{ 
                    borderRadius: "0 10px 10px 0", 
                    border: "2px solid #e0e0e0", 
                    borderLeft: "none",
                    padding: "12px 15px",
                    fontSize: "16px"
                  }}
                />
              </div>
            </div>
            <div className="col-md-6">
              <select
                className="form-select"
                value={filterCategory}
                onChange={(e) => setFilterCategory(e.target.value)}
                style={{ 
                  borderRadius: "10px", 
                  border: "2px solid #e0e0e0", 
                  padding: "12px 15px",
                  fontSize: "16px",
                  boxShadow: "0 2px 5px rgba(0,0,0,0.08)"
                }}
              >
                <option value="">All Categories</option>
                {uniqueCategories.map((cat, index) => (
                  <option key={index} value={cat}>
                    {cat}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Stats Cards */}
          <div className="row mb-4 g-3">
            <div className="col-md-4">
              <div className="card h-100" style={{ 
                borderRadius: "10px", 
                border: "none", 
                boxShadow: "0 4px 10px rgba(0,0,0,0.05)"
              }}>
                <div className="card-body d-flex align-items-center">
                  <div style={{ 
                    width: "60px",
                    height: "60px",
                    backgroundColor: "rgba(76, 175, 80, 0.1)",
                    borderRadius: "12px",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    marginRight: "15px"
                  }}>
                    <FaBoxOpen size={25} style={{ color: "#4CAF50" }} />
                  </div>
                  <div>
                    <h3 className="mb-0" style={{ fontSize: "24px", fontWeight: "700" }}>{items.length}</h3>
                    <p className="mb-0" style={{ color: "#6c757d" }}>Total Items</p>
                  </div>
                </div>
              </div>
            </div>
            <div className="col-md-4">
              <div className="card h-100" style={{ 
                borderRadius: "10px", 
                border: "none", 
                boxShadow: "0 4px 10px rgba(0,0,0,0.05)"
              }}>
                <div className="card-body d-flex align-items-center">
                  <div style={{ 
                    width: "60px",
                    height: "60px",
                    backgroundColor: "rgba(255, 193, 7, 0.1)",
                    borderRadius: "12px",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    marginRight: "15px"
                  }}>
                    <FaCalendarAlt size={25} style={{ color: "#FFC107" }} />
                  </div>
                  <div>
                    <h3 className="mb-0" style={{ fontSize: "24px", fontWeight: "700" }}>
                      {items.filter(item => isNearingExpiry(item.expiryDate)).length}
                    </h3>
                    <p className="mb-0" style={{ color: "#6c757d" }}>Nearing Expiry</p>
                  </div>
                </div>
              </div>
            </div>
            <div className="col-md-4">
              <div className="card h-100" style={{ 
                borderRadius: "10px", 
                border: "none", 
                boxShadow: "0 4px 10px rgba(0,0,0,0.05)"
              }}>
                <div className="card-body d-flex align-items-center">
                  <div style={{ 
                    width: "60px",
                    height: "60px",
                    backgroundColor: "rgba(244, 67, 54, 0.1)",
                    borderRadius: "12px",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    marginRight: "15px"
                  }}>
                    <FaTag size={25} style={{ color: "#F44336" }} />
                  </div>
                  <div>
                    <h3 className="mb-0" style={{ fontSize: "24px", fontWeight: "700" }}>
                      {uniqueCategories.length}
                    </h3>
                    <p className="mb-0" style={{ color: "#6c757d" }}>Categories</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="table-responsive" style={{ borderRadius: "10px", overflow: "hidden", boxShadow: "0 4px 10px rgba(0,0,0,0.05)" }}>
            <table className="table table-hover mb-0">
              <thead>
                <tr style={{ 
                  backgroundColor: "#f8f9fa", 
                  borderBottom: "2px solid #e9ecef" 
                }}>
                  <th scope="col" style={{ 
                    padding: "15px 20px", 
                    fontSize: "15px", 
                    fontWeight: "600", 
                    color: "#495057" 
                  }}>Name</th>
                  <th scope="col" style={{ 
                    padding: "15px 20px", 
                    fontSize: "15px", 
                    fontWeight: "600", 
                    color: "#495057" 
                  }}>Quantity</th>
                  <th scope="col" style={{ 
                    padding: "15px 20px", 
                    fontSize: "15px", 
                    fontWeight: "600", 
                    color: "#495057" 
                  }}>Expiry Date</th>
                  <th scope="col" style={{ 
                    padding: "15px 20px", 
                    fontSize: "15px", 
                    fontWeight: "600", 
                    color: "#495057" 
                  }}>Category</th>
                  <th scope="col" style={{ 
                    padding: "15px 20px", 
                    fontSize: "15px", 
                    fontWeight: "600", 
                    color: "#495057",
                    textAlign: "center"
                  }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredItems.length > 0 ? (
                  filteredItems.map((item) => (
                    <tr key={item._id} style={{ 
                      transition: "background-color 0.2s",
                      borderBottom: "1px solid #e9ecef"
                    }}>
                      <td style={{ 
                        padding: "15px 20px", 
                        fontSize: "15px", 
                        fontWeight: "500",
                        verticalAlign: "middle"
                      }}>{item.name}</td>
                      <td style={{ 
                        padding: "15px 20px", 
                        fontSize: "15px",
                        verticalAlign: "middle"
                      }}>
                        <span className="badge bg-light text-dark" style={{ 
                          fontSize: "14px", 
                          padding: "6px 12px", 
                          borderRadius: "6px",
                          fontWeight: "500"
                        }}>
                          {item.quantity} {item.unit}
                        </span>
                      </td>
                      <td style={{ 
                        padding: "15px 20px", 
                        fontSize: "15px",
                        verticalAlign: "middle"
                      }}>
                        {item.expiryDate ? (
                          <span 
                            className={`badge ${isExpired(item.expiryDate) ? 'bg-danger' : isNearingExpiry(item.expiryDate) ? 'bg-warning text-dark' : 'bg-success'}`}
                            style={{ 
                              fontSize: "14px", 
                              padding: "6px 12px", 
                              borderRadius: "6px" 
                            }}
                          >
                            {new Date(item.expiryDate).toLocaleDateString()}
                          </span>
                        ) : (
                          <span className="badge bg-secondary" style={{ 
                            fontSize: "14px", 
                            padding: "6px 12px", 
                            borderRadius: "6px" 
                          }}>N/A</span>
                        )}
                      </td>
                      <td style={{ 
                        padding: "15px 20px", 
                        fontSize: "15px",
                        verticalAlign: "middle"
                      }}>
                        {item.category ? (
                          <span className="badge bg-info text-dark" style={{ 
                            fontSize: "14px", 
                            padding: "6px 12px", 
                            borderRadius: "6px"
                          }}>
                            {item.category}
                          </span>
                        ) : (
                          <span className="badge bg-secondary" style={{ 
                            fontSize: "14px", 
                            padding: "6px 12px", 
                            borderRadius: "6px" 
                          }}>N/A</span>
                        )}
                      </td>
                      <td style={{ 
                        padding: "15px 20px", 
                        fontSize: "15px",
                        verticalAlign: "middle",
                        textAlign: "center"
                      }}>
                        <button 
                          onClick={() => handleEdit(item)} 
                          className="btn btn-sm me-2" 
                          style={{ 
                            backgroundColor: "#FFC107",
                            color: "#212529",
                            padding: "7px 15px",
                            borderRadius: "6px",
                            fontSize: "14px",
                            fontWeight: "500",
                            border: "none",
                            transition: "all 0.2s ease"
                          }}
                        >
                          <FaEdit className="me-1" /> Edit
                        </button>
                        <button 
                          onClick={() => handleDelete(item._id)} 
                          className="btn btn-sm" 
                          style={{ 
                            backgroundColor: "#F44336",
                            color: "white",
                            padding: "7px 15px",
                            borderRadius: "6px",
                            fontSize: "14px",
                            fontWeight: "500",
                            border: "none",
                            transition: "all 0.2s ease"
                          }}
                        >
                          <FaTrashAlt className="me-1" /> Delete
                        </button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="5" className="text-center py-5" style={{ fontSize: "16px", color: "#6c757d" }}>
                      <FaList size={40} className="d-block mx-auto mb-3 text-muted" />
                      No items found. Add some inventory or try a different search.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      {showDeleteModal && (
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
                background: "linear-gradient(135deg, #F44336 0%, #D32F2F 100%)",
                borderBottom: "none",
                padding: "20px 25px"
              }}>
                <h5 className="modal-title" style={{ 
                  color: "white", 
                  fontWeight: "600",
                  fontSize: "20px"
                }}>
                  <FaExclamationTriangle className="me-2" />
                  Confirm Delete
                </h5>
                <button 
                  type="button" 
                  className="btn-close" 
                  style={{ filter: "brightness(0) invert(1)" }}
                  onClick={() => setShowDeleteModal(false)}
                ></button>
              </div>
              <div className="modal-body p-4" style={{ fontSize: "16px" }}>
                <div className="text-center mb-3">
                  <div style={{
                    width: "70px",
                    height: "70px",
                    margin: "10px auto 20px",
                    background: "rgba(244, 67, 54, 0.1)",
                    borderRadius: "50%",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center"
                  }}>
                    <FaTrashAlt size={30} style={{ color: "#F44336" }} />
                  </div>
                  <p className="mb-0">Are you sure you want to delete this item?</p>
                  <p className="text-muted" style={{ fontSize: "14px" }}>This action cannot be undone.</p>
                </div>
              </div>
              <div className="modal-footer" style={{ 
                borderTop: "1px solid #f0f0f0", 
                padding: "15px"
              }}>
                <button 
                  type="button" 
                  className="btn btn-outline-secondary" 
                  onClick={() => setShowDeleteModal(false)}
                  style={{ 
                    borderRadius: "8px", 
                    padding: "10px 18px",
                    fontSize: "14px",
                    fontWeight: "500"
                  }}
                >
                  Cancel
                </button>
                <button 
                  type="button" 
                  className="btn btn-danger" 
                  onClick={confirmDelete}
                  style={{ 
                    borderRadius: "8px", 
                    padding: "10px 18px",
                    fontSize: "14px",
                    fontWeight: "500",
                    background: "linear-gradient(135deg, #F44336 0%, #D32F2F 100%)",
                    border: "none"
                  }}
                >
                  Delete Item
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Edit Modal */}
      {showEditModal && (
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
                  fontSize: "20px"
                }}>
                  <FaEdit className="me-2" />
                  Edit Item
                </h5>
                <button 
                  type="button" 
                  className="btn-close" 
                  style={{ filter: "brightness(0) invert(1)" }}
                  onClick={() => setShowEditModal(false)}
                ></button>
              </div>
              <div className="modal-body p-4">
                <form onSubmit={handleEditSubmit}>
                  <div className="mb-3">
                    <label htmlFor="name" className="form-label" style={{ 
                      fontWeight: "600", 
                      fontSize: "15px", 
                      color: "#2c3e50",
                      marginBottom: "8px"
                    }}>
                      Name
                    </label>
                    <input
                      type="text"
                      className="form-control"
                      id="name"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      required
                      style={{ 
                        borderRadius: "8px", 
                        border: "2px solid #e0e0e0", 
                        padding: "10px 15px",
                        fontSize: "15px"
                      }}
                    />
                  </div>
                  <div className="mb-3">
                    <label htmlFor="quantity" className="form-label" style={{ 
                      fontWeight: "600", 
                      fontSize: "15px", 
                      color: "#2c3e50",
                      marginBottom: "8px"
                    }}>
                      Quantity
                    </label>
                    <div className="d-flex">
                      <input
                        type="number"
                        className="form-control"
                        id="quantity"
                        value={quantity}
                        onChange={(e) => setQuantity(e.target.value)}
                        required
                        style={{ 
                          borderRadius: "8px 0 0 8px", 
                          border: "2px solid #e0e0e0", 
                          borderRight: "none",
                          padding: "10px 15px",
                          fontSize: "15px",
                          flex: "2"
                        }}
                      />
                      <select
                        className="form-select"
                        value={unit}
                        onChange={(e) => setUnit(e.target.value)}
                        style={{ 
                          borderRadius: "0 8px 8px 0", 
                          border: "2px solid #e0e0e0", 
                          borderLeft: "none",
                          padding: "10px 15px",
                          fontSize: "15px",
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
                  <div className="mb-3">
                    <label htmlFor="expiryDate" className="form-label" style={{ 
                      fontWeight: "600", 
                      fontSize: "15px", 
                      color: "#2c3e50",
                      marginBottom: "8px"
                    }}>
                      Expiry Date
                    </label>
                    <input
                      type="date"
                      className="form-control"
                      id="expiryDate"
                      value={expiryDate}
                      onChange={(e) => setExpiryDate(e.target.value)}
                      style={{ 
                        borderRadius: "8px", 
                        border: "2px solid #e0e0e0", 
                        padding: "10px 15px",
                        fontSize: "15px"
                      }}
                    />
                  </div>
                  <div className="mb-3">
                    <label htmlFor="category" className="form-label" style={{ 
                      fontWeight: "600", 
                      fontSize: "15px", 
                      color: "#2c3e50",
                      marginBottom: "8px"
                    }}>
                      Category
                    </label>
                    <select
                      className="form-select"
                      id="category"
                      value={category}
                      onChange={(e) => setCategory(e.target.value)}
                      style={{ 
                        borderRadius: "8px", 
                        border: "2px solid #e0e0e0", 
                        padding: "10px 15px",
                        fontSize: "15px"
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
                  <div className="d-grid mt-4">
                    <button 
                      type="submit" 
                      className="btn btn-success"
                      style={{ 
                        borderRadius: "8px", 
                        padding: "12px",
                        fontSize: "16px",
                        fontWeight: "600",
                        background: "linear-gradient(135deg, #4CAF50 0%, #2E7D32 100%)",
                        border: "none",
                        boxShadow: "0 4px 10px rgba(76, 175, 80, 0.3)",
                      }}
                    >
                      Update Item
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Custom CSS */}
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
          
          .btn:hover {
            transform: translateY(-2px);
            box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1) !important;
          }
          
          tr:hover {
            background-color: #f8f9fa;
          }
        `}
      </style>
    </div>
  );
};

export default InventoryList;