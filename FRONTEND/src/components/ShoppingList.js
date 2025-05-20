import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap-icons/font/bootstrap-icons.css";
import jsPDF from "jspdf";
import "jspdf-autotable";
import {
  FaCartPlus,
  FaTrashAlt,
  FaEdit,
  FaExclamationTriangle,
  FaShoppingCart,
  FaCheckCircle,
  FaTimesCircle,
  FaPlusCircle,
  FaSearch,
  FaFileExport,
} from "react-icons/fa";

const ShoppingList = () => {
  const [inventoryItems, setInventoryItems] = useState([]);
  const [shoppingList, setShoppingList] = useState({ items: [] });
  const [autoAddedItems, setAutoAddedItems] = useState([]);
  const [selectedItem, setSelectedItem] = useState("");
  const [quantity, setQuantity] = useState(1);
  const [loading, setLoading] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  const [editQuantity, setEditQuantity] = useState(1);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showMessageModal, setShowMessageModal] = useState(false);
  const [isSuccessMessage, setIsSuccessMessage] = useState(false);
  const [itemToDelete, setItemToDelete] = useState(null);
  const [message, setMessage] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const navigate = useNavigate();

  const showError = (errorMessage) => {
    setMessage(errorMessage);
    setIsSuccessMessage(false);
    setShowMessageModal(true);
    setTimeout(() => setShowMessageModal(false), 5000);
  };

  const showSuccess = (successMessage) => {
    setMessage(successMessage);
    setIsSuccessMessage(true);
    setShowMessageModal(true);
    setTimeout(() => setShowMessageModal(false), 5000);
  };

  useEffect(() => {
    const fetchData = async () => {
      const token = localStorage.getItem("token");
      if (!token) {
        navigate("/login");
        return;
      }

      try {
        setLoading(true);
        const inventoryResponse = await axios.get("http://localhost:5002/inventory", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setInventoryItems(inventoryResponse.data);

        const shoppingListResponse = await axios.get("http://localhost:5002/shopping-list", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setShoppingList(shoppingListResponse.data);

        const autoAddedResponse = await axios.get("http://localhost:5002/shopping-list/auto-added", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setAutoAddedItems(Array.isArray(autoAddedResponse.data) ? autoAddedResponse.data : []);
      } catch (error) {
        if (error.response?.status === 401) {
          localStorage.removeItem("token");
          navigate("/login");
        } else {
          console.error("Error fetching data:", error);
          showError(error.response?.data?.message || "Error loading data");
        }
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [navigate]);

  const handleAddToShoppingList = async () => {
    if (!selectedItem || quantity <= 0) {
      showError("Please select an item and specify a valid quantity.");
      return;
    }

    try {
      const token = localStorage.getItem("token");
      if (!token) {
        navigate("/login");
        return;
      }

      const response = await axios.post(
        "http://localhost:5002/shopping-list/add",
        { itemName: selectedItem, quantity },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setShoppingList(response.data.shoppingList);
      setSelectedItem("");
      setQuantity(1);
      showSuccess("Item added to shopping list successfully!");
    } catch (error) {
      if (error.response?.status === 401) {
        localStorage.removeItem("token");
        navigate("/login");
      } else {
        console.error("Error adding item:", error);
        showError(error.response?.data?.message || "Error adding item to shopping list");
      }
    }
  };

  const handleAutoAddItems = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        navigate("/login");
        return;
      }

      const response = await axios.post(
        "http://localhost:5002/shopping-list/auto-add",
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );

      const shoppingListResponse = await axios.get("http://localhost:5002/shopping-list", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setShoppingList(shoppingListResponse.data);

      const autoAddedResponse = await axios.get("http://localhost:5002/shopping-list/auto-added", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setAutoAddedItems(Array.isArray(autoAddedResponse.data) ? autoAddedResponse.data : []);

      showSuccess(response.data.message || "Low stock items added successfully!");
    } catch (error) {
      console.error("Error auto-adding items:", error);
      showError(error.response?.data?.message || "Error adding low stock items");
    }
  };

  const startEditing = (item) => {
    setEditingItem(item);
    setEditQuantity(item.quantity);
  };

  const cancelEditing = () => {
    setEditingItem(null);
    setEditQuantity(1);
  };

  const handleUpdateItem = async () => {
    if (!editingItem || editQuantity <= 0) {
      showError("Please specify a valid quantity.");
      return;
    }

    try {
      const token = localStorage.getItem("token");
      if (!token) {
        navigate("/login");
        return;
      }

      await axios.put(
        `http://localhost:5002/shopping-list/update/${editingItem.name}`,
        { quantity: editQuantity },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      setShoppingList((prev) => ({
        ...prev,
        items: prev.items.map((item) =>
          item.name === editingItem.name ? { ...item, quantity: editQuantity } : item
        ),
      }));

      cancelEditing();
      showSuccess("Item quantity updated successfully!");
    } catch (error) {
      console.error("Update error:", error);
      if (error.response?.status === 401) {
        localStorage.removeItem("token");
        navigate("/login");
      } else {
        showError(error.response?.data?.message || "Error updating item quantity");
      }
    }
  };

  const confirmDelete = (itemName) => {
    setItemToDelete(itemName);
    setShowDeleteModal(true);
  };

  const handleDeleteFromShoppingList = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        navigate("/login");
        return;
      }

      const response = await axios.delete(`http://localhost:5002/shopping-list/remove/${itemToDelete}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      setShoppingList(response.data.shoppingList);
      setShowDeleteModal(false);
      showSuccess("Item removed from shopping list successfully!");
    } catch (error) {
      if (error.response?.status === 401) {
        localStorage.removeItem("token");
        navigate("/login");
      } else {
        console.error("Error deleting item:", error);
        showError(error.response?.data?.message || "Error deleting item from shopping list");
      }
    }
  };

  const filteredItems = Array.isArray(shoppingList.items)
    ? shoppingList.items.filter((item) => item.name.toLowerCase().includes(searchTerm.toLowerCase()))
    : [];

  const filteredAutoAddedItems = Array.isArray(autoAddedItems)
    ? autoAddedItems.filter((item) => item.name.toLowerCase().includes(searchTerm.toLowerCase()))
    : [];

  const generateReport = () => {
    const doc = new jsPDF();
    doc.setFontSize(20);
    doc.setTextColor(0, 188, 212);
    doc.text("Shopping List Report", 105, 20, { align: "center" });

    doc.setFontSize(12);
    doc.setTextColor(100);
    doc.text(`Generated on: ${new Date().toLocaleDateString()}`, 105, 30, { align: "center" });

    let finalY = 40;

    if (filteredAutoAddedItems.length > 0) {
      doc.setFontSize(14);
      doc.setTextColor(0);
      doc.text("Auto-Added Low Stock Items", 14, 45);

      const autoAddedData = filteredAutoAddedItems.map((item) => [item.name, item.quantity]);

      doc.autoTable({
        startY: 50,
        head: [["Item Name", "Quantity"]],
        body: autoAddedData,
        theme: "grid",
        headStyles: {
          fillColor: [0, 188, 212],
          textColor: 255,
        },
      });

      finalY = doc.lastAutoTable.finalY + 15;
    }

    if (filteredItems.length > 0) {
      doc.setFontSize(14);
      doc.setTextColor(0);
      doc.text("Manual Shopping List Items", 14, finalY);

      const manualItemsData = filteredItems.map((item) => [item.name, item.quantity]);

      doc.autoTable({
        startY: finalY + 5,
        head: [["Item Name", "Quantity"]],
        body: manualItemsData,
        theme: "grid",
        headStyles: {
          fillColor: [76, 175, 80],
          textColor: 255,
        },
      });
    }

    doc.save(`shopping-list-report-${new Date().toISOString().slice(0, 10)}.pdf`);
    // showSuccess("Report generated successfully!");
  };

  if (loading) {
    return (
      <div className="container mt-5 text-center">
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
      </div>
    );
  }

  return (
    <div
      className="container mt-5"
      style={{
        maxWidth: "1200px",
        margin: "0 auto",
        fontFamily: "'Poppins', sans-serif",
        animation: "fadeIn 0.5s ease-in-out",
      }}
    >
      <div
        className="card shadow-lg"
        style={{
          borderRadius: "15px",
          border: "none",
          overflow: "hidden",
        }}
      >
        <div
          className="card-header"
          style={{
            background: "linear-gradient(135deg, #00BCD4 0%, #00838F 100%)",
            color: "white",
            border: "none",
            padding: "25px 30px",
            position: "relative",
          }}
        >
          <div className="d-flex justify-content-between align-items-center">
            <h2
              className="m-0"
              style={{
                fontWeight: "600",
                fontSize: "28px",
                letterSpacing: "0.5px",
              }}
            >
              <FaShoppingCart className="me-3" />
              Shopping List
            </h2>
            <div>
              <button
                onClick={handleAutoAddItems}
                className="btn me-3"
                style={{
                  borderRadius: "8px",
                  padding: "10px 20px",
                  fontSize: "14px",
                  fontWeight: "500",
                  background: "linear-gradient(135deg,rgb(255, 255, 255) 0%,rgb(255, 255, 255) 100%)",
                  border: "none",
                  color: "black",
                  boxShadow: "0 4px 8px rgba(0,0,0,0.1)",
                }}
              >
                <FaPlusCircle className="me-2" />
                Auto-Add Low Stock
              </button>
              <button
                onClick={generateReport}
                className="btn"
                style={{
                  borderRadius: "8px",
                  padding: "10px 20px",
                  fontSize: "14px",
                  fontWeight: "500",
                  background: "linear-gradient(135deg,rgb(255, 255, 255) 0%,rgb(255, 255, 255) 100%)",
                  border: "none",
                  color: "black",
                  boxShadow: "0 4px 8px rgba(0,0,0,0.1)",
                }}
              >
                <FaFileExport className="me-2" />
                Export Report
              </button>
            </div>
          </div>
        </div>

        <div className="card-body p-4">
          {/* Search Bar */}
          <div
            className="card mb-4"
            style={{
              borderRadius: "10px",
              border: "none",
              boxShadow: "0 4px 10px rgba(0,0,0,0.05)",
            }}
          >
            <div className="card-body">
              <div className="input-group">
                <span
                  className="input-group-text"
                  style={{
                    background: "white",
                    borderRight: "none",
                    border: "2px solid #e0e0e0",
                    borderTopLeftRadius: "8px",
                    borderBottomLeftRadius: "8px",
                  }}
                >
                  <FaSearch />
                </span>
                <input
                  type="text"
                  className="form-control"
                  placeholder="Search items..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  style={{
                    borderLeft: "none",
                    borderRadius: "0 8px 8px 0",
                    border: "2px solid #e0e0e0",
                    padding: "12px 15px",
                    fontSize: "15px",
                  }}
                />
              </div>
            </div>
          </div>

          {/* Add Item Form */}
          <div
            className="card mb-4"
            style={{
              borderRadius: "10px",
              border: "none",
              boxShadow: "0 4px 10px rgba(0,0,0,0.05)",
            }}
          >
            <div className="card-body">
              <h5 className="mb-4" style={{ fontWeight: "600" }}>
                Add Item to Shopping List
              </h5>
              <div className="row g-3">
                <div className="col-md-6">
                  <label className="form-label" style={{ fontWeight: "600" }}>
                    Select Item
                  </label>
                  <select
                    className="form-select"
                    value={selectedItem}
                    onChange={(e) => setSelectedItem(e.target.value)}
                    style={{
                      borderRadius: "8px",
                      border: "2px solid #e0e0e0",
                      padding: "10px 15px",
                      fontSize: "15px",
                    }}
                  >
                    <option value="">Select an Item</option>
                    {inventoryItems.map((item) => (
                      <option key={item._id} value={item.name}>
                        {item.name}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="col-md-3">
                  <label className="form-label" style={{ fontWeight: "600" }}>
                    Quantity
                  </label>
                  <input
                    type="number"
                    className="form-control"
                    value={quantity}
                    onChange={(e) => setQuantity(Number(e.target.value))}
                    min="1"
                    style={{
                      maxWidth: "100%",
                      borderRadius: "8px",
                      border: "2px solid #e0e0e0",
                      padding: "10px 15px",
                      fontSize: "15px",
                    }}
                  />
                </div>
                <div className="col-md-3 d-flex align-items-end">
                  <button
                    onClick={handleAddToShoppingList}
                    className="btn w-100"
                    disabled={!selectedItem}
                    style={{
                      borderRadius: "8px",
                      padding: "12px",
                      fontSize: "16px",
                      fontWeight: "600",
                      background: "linear-gradient(135deg, #00BCD4 0%, #00838F 100%)",
                      border: "none",
                      boxShadow: "0 4px 10px rgba(0, 188, 212, 0.3)",
                      color: "white",
                    }}
                  >
                    <FaCartPlus className="me-2" />
                    Add to List
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Auto-Added Items Section */}
          {filteredAutoAddedItems.length > 0 && (
            <div
              className="card mb-4"
              style={{
                borderRadius: "10px",
                border: "none",
                boxShadow: "0 4px 10px rgba(0,0,0,0.05)",
              }}
            >
              <div className="card-body">
                <h5 className="mb-3" style={{ fontWeight: "600" }}>
                  <FaPlusCircle className="me-2" />
                  Auto-Added Low Stock Items
                </h5>
                <div className="table-responsive">
                  <table className="table table-hover mb-0">
                    <thead>
                      <tr
                        style={{
                          backgroundColor: "#f8f9fa",
                          borderBottom: "2px solid #e9ecef",
                        }}
                      >
                        <th
                          scope="col"
                          style={{
                            padding: "15px 20px",
                            fontSize: "15px",
                            fontWeight: "600",
                            color: "#495057",
                          }}
                        >
                          Name
                        </th>
                        <th
                          scope="col"
                          style={{
                            padding: "15px 20px",
                            fontSize: "15px",
                            fontWeight: "600",
                            color: "#495057",
                          }}
                        >
                          Quantity
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredAutoAddedItems.map((item, index) => (
                        <tr
                          key={`auto-${index}`}
                          style={{
                            transition: "background-color 0.2s",
                            borderBottom: "1px solid #e9ecef",
                          }}
                        >
                          <td
                            style={{
                              padding: "15px 20px",
                              fontSize: "15px",
                              fontWeight: "500",
                              verticalAlign: "middle",
                            }}
                          >
                            {item.name}
                          </td>
                          <td
                            style={{
                              padding: "15px 20px",
                              fontSize: "15px",
                              verticalAlign: "middle",
                            }}
                          >
                            {item.quantity}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* Shopping List Items */}
          <h5 className="fw-bold mb-3" style={{ fontSize: "20px" }}>
            Your Shopping List
          </h5>
          {filteredItems.length === 0 ? (
            <div
              className="alert alert-info"
              style={{
                borderRadius: "10px",
                border: "none",
                backgroundColor: "#e3f2fd",
                color: "#0d47a1",
                padding: "15px",
                textAlign: "center",
              }}
            >
              <FaShoppingCart size={24} className="me-2" />
              {searchTerm ? "No matching items found" : "Your shopping list is empty"}
            </div>
          ) : (
            <div
              className="table-responsive"
              style={{
                borderRadius: "10px",
                overflow: "hidden",
                boxShadow: "0 4px 10px rgba(0,0,0,0.05)",
              }}
            >
              <table className="table table-hover mb-0">
                <thead>
                  <tr
                    style={{
                      backgroundColor: "#f8f9fa",
                      borderBottom: "2px solid #e9ecef",
                    }}
                  >
                    <th
                      scope="col"
                      style={{
                        padding: "15px 20px",
                        fontSize: "15px",
                        fontWeight: "600",
                        color: "#495057",
                      }}
                    >
                      Name
                    </th>
                    <th
                      scope="col"
                      style={{
                        padding: "15px 20px",
                        fontSize: "15px",
                        fontWeight: "600",
                        color: "#495057",
                      }}
                    >
                      Quantity
                    </th>
                    <th
                      scope="col"
                      style={{
                        padding: "15px 20px",
                        fontSize: "15px",
                        fontWeight: "600",
                        color: "#495057",
                        textAlign: "center",
                      }}
                    >
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {filteredItems.map((item, index) => (
                    <tr
                      key={index}
                      style={{
                        transition: "background-color 0.2s",
                        borderBottom: "1px solid #e9ecef",
                      }}
                    >
                      <td
                        style={{
                          padding: "15px 20px",
                          fontSize: "15px",
                          fontWeight: "500",
                          verticalAlign: "middle",
                        }}
                      >
                        {item.name}
                      </td>
                      <td
                        style={{
                          padding: "15px 20px",
                          fontSize: "15px",
                          verticalAlign: "middle",
                        }}
                      >
                        {item.quantity}
                      </td>
                      <td
                        style={{
                          padding: "15px 20px",
                          fontSize: "15px",
                          verticalAlign: "middle",
                          textAlign: "center",
                        }}
                      >
                        <button
                          onClick={() => startEditing(item)}
                          className="btn btn-sm me-2"
                          style={{
                            backgroundColor: "#00BCD4",
                            color: "white",
                            padding: "7px 15px",
                            borderRadius: "6px",
                            fontSize: "14px",
                            fontWeight: "500",
                            border: "none",
                            transition: "all 0.2s ease",
                          }}
                        >
                          <FaEdit className="me-1" /> Edit
                        </button>
                        <button
                          onClick={() => confirmDelete(item.name)}
                          className="btn btn-sm"
                          style={{
                            backgroundColor: "#E91E63",
                            color: "white",
                            padding: "7px 15px",
                            borderRadius: "6px",
                            fontSize: "14px",
                            fontWeight: "500",
                            border: "none",
                            transition: "all 0.2s ease",
                          }}
                        >
                          <FaTrashAlt className="me-1" /> Delete
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>

      {/* Edit Item Modal */}
      {editingItem && (
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
            <div
              className="modal-content"
              style={{
                borderRadius: "15px",
                border: "none",
                overflow: "hidden",
              }}
            >
              <div
                className="modal-header"
                style={{
                  background: "linear-gradient(135deg, #00BCD4 0%, #00838F 100%)",
                  borderBottom: "none",
                  padding: "20px 25px",
                }}
              >
                <h5
                  className="modal-title"
                  style={{
                    color: "white",
                    fontWeight: "600",
                    fontSize: "20px",
                  }}
                >
                  <FaEdit className="me-2" />
                  Edit Item Quantity
                </h5>
                <button
                  type="button"
                  className="btn-close"
                  style={{ filter: "brightness(0) invert(1)" }}
                  onClick={cancelEditing}
                ></button>
              </div>
              <div className="modal-body p-4">
                <div className="mb-3">
                  <label className="form-label" style={{ fontWeight: "600" }}>
                    Item: {editingItem.name}
                  </label>
                  <input
                    type="number"
                    className="form-control"
                    value={editQuantity}
                    onChange={(e) => setEditQuantity(Number(e.target.value))}
                    min="1"
                    style={{
                      borderRadius: "8px",
                      border: "2px solid #e0e0e0",
                      padding: "10px 15px",
                      fontSize: "15px",
                    }}
                  />
                </div>
              </div>
              <div
                className="modal-footer"
                style={{
                  borderTop: "1px solid #f0f0f0",
                  padding: "15px",
                }}
              >
                <button
                  type="button"
                  className="btn btn-outline-secondary"
                  onClick={cancelEditing}
                  style={{
                    borderRadius: "8px",
                    padding: "10px 18px",
                    fontSize: "14px",
                    fontWeight: "500",
                  }}
                >
                  Cancel
                </button>
                <button
                  type="button"
                  className="btn btn-primary"
                  onClick={handleUpdateItem}
                  style={{
                    borderRadius: "8px",
                    padding: "10px 18px",
                    fontSize: "14px",
                    fontWeight: "500",
                    background: "linear-gradient(135deg, #00BCD4 0%, #00838F 100%)",
                    border: "none",
                  }}
                >
                  Save Changes
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

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
            <div
              className="modal-content"
              style={{
                borderRadius: "15px",
                border: "none",
                overflow: "hidden",
              }}
            >
              <div
                className="modal-header"
                style={{
                  background: "linear-gradient(135deg, #E91E63 0%, #C2185B 100%)",
                  borderBottom: "none",
                  padding: "20px 25px",
                }}
              >
                <h5
                  className="modal-title"
                  style={{
                    color: "white",
                    fontWeight: "600",
                    fontSize: "20px",
                  }}
                >
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
                  <div
                    style={{
                      width: "70px",
                      height: "70px",
                      margin: "10px auto 20px",
                      background: "rgba(233, 30, 99, 0.1)",
                      borderRadius: "50%",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                  >
                    <FaTrashAlt size={30} style={{ color: "#E91E63" }} />
                  </div>
                  <p className="mb-0">Are you sure you want to delete this item?</p>
                  <p className="text-muted" style={{ fontSize: "14px" }}>
                    This action cannot be undone.
                  </p>
                </div>
              </div>
              <div
                className="modal-footer"
                style={{
                  borderTop: "1px solid #f0f0f0",
                  padding: "15px",
                }}
              >
                <button
                  type="button"
                  className="btn btn-outline-secondary"
                  onClick={() => setShowDeleteModal(false)}
                  style={{
                    borderRadius: "8px",
                    padding: "10px 18px",
                    fontSize: "14px",
                    fontWeight: "500",
                  }}
                >
                  Cancel
                </button>
                <button
                  type="button"
                  className="btn btn-danger"
                  onClick={handleDeleteFromShoppingList}
                  style={{
                    borderRadius: "8px",
                    padding: "10px 18px",
                    fontSize: "14px",
                    fontWeight: "500",
                    background: "linear-gradient(135deg, #E91E63 0%, #C2185B 100%)",
                    border: "none",
                  }}
                >
                  Delete Item
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Message Modal (Success/Error) */}
      {showMessageModal && (
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
            <div
              className="modal-content"
              style={{
                borderRadius: "15px",
                border: "none",
                overflow: "hidden",
              }}
            >
              <div
                className="modal-header"
                style={{
                  background: isSuccessMessage
                    ? "linear-gradient(135deg, #4CAF50 0%, #2E7D32 100%)"
                    : "linear-gradient(135deg, #F44336 0%, #C62828 100%)",
                  borderBottom: "none",
                  padding: "20px 25px",
                }}
              >
                <h5
                  className="modal-title"
                  style={{
                    color: "white",
                    fontWeight: "600",
                    fontSize: "20px",
                  }}
                >
                  {isSuccessMessage ? (
                    <FaCheckCircle className="me-2" />
                  ) : (
                    <FaTimesCircle className="me-2" />
                  )}
                  {isSuccessMessage ? "Success" : "Error"}
                </h5>
                <button
                  type="button"
                  className="btn-close"
                  style={{ filter: "brightness(0) invert(1)" }}
                  onClick={() => setShowMessageModal(false)}
                ></button>
              </div>
              <div className="modal-body p-4 text-center" style={{ fontSize: "16px" }}>
                <div
                  style={{
                    width: "70px",
                    height: "70px",
                    margin: "10px auto 20px",
                    background: isSuccessMessage
                      ? "rgba(76, 175, 80, 0.1)"
                      : "rgba(244, 67, 54, 0.1)",
                    borderRadius: "50%",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  {isSuccessMessage ? (
                    <FaCheckCircle size={30} style={{ color: "#4CAF50" }} />
                  ) : (
                    <FaTimesCircle size={30} style={{ color: "#F44336" }} />
                  )}
                </div>
                <p className="mb-0" style={{ fontWeight: "500" }}>
                  {message}
                </p>
              </div>
              <div
                className="modal-footer"
                style={{
                  borderTop: "1px solid #f0f0f0",
                  padding: "15px",
                  justifyContent: "center",
                }}
              >
                <button
                  type="button"
                  className="btn"
                  onClick={() => setShowMessageModal(false)}
                  style={{
                    borderRadius: "8px",
                    padding: "10px 25px",
                    fontSize: "14px",
                    fontWeight: "500",
                    background: isSuccessMessage
                      ? "linear-gradient(135deg, #4CAF50 0%, #2E7D32 100%)"
                      : "linear-gradient(135deg, #F44336 0%, #C62828 100%)",
                    color: "white",
                    border: "none",
                  }}
                >
                  OK
                </button>
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
            border-color: #00BCD4 !important;
            box-shadow: 0 0 0 0.25rem rgba(0, 188, 212, 0.25) !important;
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

export default ShoppingList;