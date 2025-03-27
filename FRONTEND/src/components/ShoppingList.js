import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap-icons/font/bootstrap-icons.css";

const ShoppingList = () => {
  const [inventoryItems, setInventoryItems] = useState([]);
  const [shoppingList, setShoppingList] = useState({ items: [] });
  const [selectedItem, setSelectedItem] = useState("");
  const [quantity, setQuantity] = useState(1);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      const token = localStorage.getItem("token");
      if (!token) {
        navigate("/login");
        return;
      }

      try {
        setLoading(true);
        
        // Fetch inventory items
        const inventoryResponse = await axios.get("http://localhost:5002/inventory", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setInventoryItems(inventoryResponse.data);

        // Fetch shopping list
        const shoppingListResponse = await axios.get(
          "http://localhost:5002/shopping-list",
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        setShoppingList(shoppingListResponse.data);
        
      } catch (error) {
        if (error.response?.status === 401) {
          localStorage.removeItem("token");
          navigate("/login");
        } else {
          console.error("Error fetching data:", error);
          setError(error.response?.data?.message || "Error loading data");
        }
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [navigate]);

  const handleAddToShoppingList = async () => {
    if (!selectedItem || quantity <= 0) {
      setError("Please select an item and specify a valid quantity.");
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
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      setShoppingList(response.data.shoppingList);
      setSelectedItem("");
      setQuantity(1);
      setError("");
    } catch (error) {
      if (error.response?.status === 401) {
        localStorage.removeItem("token");
        navigate("/login");
      } else {
        console.error("Error adding item:", error);
        setError(error.response?.data?.message || "Error adding item to shopping list");
      }
    }
  };

  const handleDeleteFromShoppingList = async (itemName) => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        navigate("/login");
        return;
      }

      const response = await axios.delete(
        `http://localhost:5002/shopping-list/remove/${itemName}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      setShoppingList(response.data.shoppingList);
    } catch (error) {
      if (error.response?.status === 401) {
        localStorage.removeItem("token");
        navigate("/login");
      } else {
        console.error("Error deleting item:", error);
        setError(error.response?.data?.message || "Error deleting item from shopping list");
      }
    }
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
    <div className="container mt-5" style={{ maxWidth: "1200px" }}>
      <h2 className="text-center mb-4 text-primary fw-bold">🛒 Shopping List</h2>
      {error && (
        <div className="alert alert-danger alert-dismissible fade show">
          {error}
          <button
            type="button"
            className="btn-close"
            onClick={() => setError("")}
          ></button>
        </div>
      )}

      <div className="mb-4">
        <h5 className="fw-bold">Add Item to Shopping List</h5>
        <div className="row">
          <div className="col-md-6">
            <label htmlFor="itemDropdown" className="form-label">
              Select Item
            </label>
            <select
              id="itemDropdown"
              className="form-select"
              value={selectedItem}
              onChange={(e) => setSelectedItem(e.target.value)}
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
            <label htmlFor="quantity" className="form-label">
              Quantity
            </label>
            <input
              type="number"
              id="quantity"
              className="form-control"
              value={quantity}
              onChange={(e) => setQuantity(Number(e.target.value))}
              min="1"
            />
          </div>
          <div className="col-md-3 d-flex align-items-end">
            <button
              onClick={handleAddToShoppingList}
              className="btn btn-success w-100"
              disabled={!selectedItem}
            >
              <i className="bi bi-plus-circle me-2"></i>
              Add to List
            </button>
          </div>
        </div>
      </div>

      <h5 className="fw-bold mb-3">Your Shopping List</h5>
      {shoppingList.items?.length === 0 ? (
        <div className="alert alert-info">Your shopping list is empty</div>
      ) : (
        <div className="table-responsive">
          <table className="table table-hover table-bordered shadow-sm rounded">
            <thead className="bg-primary text-white">
              <tr>
                <th>Name</th>
                <th>Quantity</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {shoppingList.items?.map((item, index) => (
                <tr key={index} className="align-middle">
                  <td>{item.name}</td>
                  <td>{item.quantity}</td>
                  <td>
                    <button
                      onClick={() => handleDeleteFromShoppingList(item.name)}
                      className="btn btn-danger btn-sm"
                    >
                      <i className="bi bi-trash me-1"></i>
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default ShoppingList;