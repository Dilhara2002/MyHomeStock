import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap-icons/font/bootstrap-icons.css";

const ShoppingList = () => {
  const [inventoryItems, setInventoryItems] = useState([]);
  const [shoppingList, setShoppingList] = useState([]);
  const [selectedItem, setSelectedItem] = useState("");
  const [quantity, setQuantity] = useState(1);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  // Fetch inventory items
  useEffect(() => {
    const fetchInventoryItems = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          navigate("/login");
          return;
        }
        const response = await axios.get("http://localhost:5002/inventory", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setInventoryItems(response.data);
      } catch (error) {
        setError("Error fetching inventory items");
      }
    };
    fetchInventoryItems();
  }, [navigate]);

  // Fetch shopping list
  useEffect(() => {
    const fetchShoppingList = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          navigate("/login");
          return;
        }
        const response = await axios.get("http://localhost:5002/shopping-list", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setShoppingList(response.data.items);
      } catch (error) {
        setError("Error fetching shopping list");
      }
    };
    fetchShoppingList();
  }, [navigate]);

  // Handle adding items to the shopping list
  const handleAddToShoppingList = async () => {
    if (selectedItem && quantity > 0) {
      try {
        const token = localStorage.getItem("token");
        const user = localStorage.getItem("user");
        if (!token) {
          navigate("/login");
          return;
        }

        const newItem = { userId:user, itemName: selectedItem, quantity };

        const response = await axios.post("http://localhost:5002/shopping-list/add", newItem, {
          headers: { Authorization: `Bearer ${token}` },
        });

        setShoppingList([...shoppingList, response.data.shoppingList.items[response.data.shoppingList.items.length - 1]]);
        setSelectedItem("");
        setQuantity(1);
      } catch (error) {
        setError("Error adding item to shopping list");
      }
    } else {
      setError("Please select an item and specify quantity.");
    }
  };

  // Handle deleting items from the shopping list
  const handleDeleteFromShoppingList = async (itemName) => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        navigate("/login");
        return;
      }

      await axios.delete(`http://localhost:5002/shopping-list/remove/${itemName}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      setShoppingList(shoppingList.filter((item) => item.name !== itemName));
    } catch (error) {
      setError("Error deleting item from shopping list");
    }
  };

  return (
    <div className="container mt-5" style={{ maxWidth: "1200px" }}>
      <h2 className="text-center mb-4 text-primary fw-bold">🛒 Shopping List</h2>
      {error && <div className="alert alert-danger">{error}</div>}

      {/* Add to Shopping List Section */}
      <div className="mb-4">
        <h5 className="fw-bold">Add Item to Shopping List</h5>
        <div className="row">
          <div className="col-md-6">
            <label htmlFor="itemDropdown" className="form-label">Select Item</label>
            <select
              id="itemDropdown"
              className="form-select"
              value={selectedItem}
              onChange={(e) => setSelectedItem(e.target.value)}
            >
              <option value="">Select an Item</option>
              {inventoryItems.map((item) => (
                <option key={item._id} value={item.name}>{item.name}</option>
              ))}
            </select>
          </div>
          <div className="col-md-3">
            <label htmlFor="quantity" className="form-label">Quantity</label>
            <input
              type="number"
              id="quantity"
              className="form-control"
              value={quantity}
              onChange={(e) => setQuantity(e.target.value)}
              min="1"
            />
          </div>
          <div className="col-md-3 d-flex align-items-end">
            <button onClick={handleAddToShoppingList} className="btn btn-success">
              ➕ Add to Shopping List
            </button>
          </div>
        </div>
      </div>

      {/* Shopping List */}
      <h5 className="fw-bold mb-3">Your Shopping List</h5>
      <table className="table table-hover table-bordered shadow-sm rounded" style={{ borderRadius: "10px", overflow: "hidden" }}>
        <thead className="bg-primary text-white">
          <tr>
            <th>Name</th>
            <th>Quantity</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {shoppingList.map((item, index) => (
            <tr key={index} className="align-middle">
              <td>{item.name}</td>
              <td>{item.quantity}</td>
              <td>
                <button onClick={() => handleDeleteFromShoppingList(item.name)} className="btn btn-danger btn-sm">
                  <i className="bi bi-trash"></i> Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default ShoppingList;
