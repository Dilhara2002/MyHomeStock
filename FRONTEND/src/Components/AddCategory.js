import React, { useState, useEffect } from "react";
import axios from "axios";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCheckCircle, faTrashAlt, faEdit } from '@fortawesome/free-solid-svg-icons';

// Constants
const API_BASE_URL = "http://localhost:5002/api/categories";

// Reusable Components
const Input = ({ ...props }) => (
  <input
    {...props}
    style={{
      border: "1px solid #ccc",
      padding: "12px",
      borderRadius: "8px",
      width: "100%",
      boxSizing: "border-box",
      marginBottom: "15px",
      fontSize: "14px",
      transition: "border-color 0.3s ease-in-out",
    }}
  />
);

const Textarea = ({ ...props }) => (
  <textarea
    {...props}
    style={{
      border: "1px solid #ccc",
      padding: "12px",
      borderRadius: "8px",
      width: "100%",
      boxSizing: "border-box",
      marginBottom: "15px",
      fontSize: "14px",
      transition: "border-color 0.3s ease-in-out",
    }}
  />
);

const Button = ({ children, ...props }) => (
  <button
    {...props}
    style={{
      backgroundColor: "#007bff",
      color: "white",
      padding: "12px",
      borderRadius: "8px",
      width: "100%",
      border: "none",
      cursor: "pointer",
      fontSize: "16px",
      fontWeight: "bold",
      transition: "background-color 0.3s ease-in-out",
      ...props.style,
    }}
  >
    {children}
  </button>
);

const Popup = ({ message, type, onClose }) => {
  const colors = {
    error: {
      background: "#ffebee",
      text: "#c62828",
    },
    success: {
      background: "#e8f5e9",
      text: "#2e7d32",
    }
  };

  return (
    <div
      style={{
        position: "fixed",
        top: "20px",
        left: "50%",
        transform: "translateX(-50%)",
        backgroundColor: colors[type].background,
        color: colors[type].text,
        padding: "15px 20px",
        borderRadius: "8px",
        fontSize: "16px",
        zIndex: 999,
        boxShadow: "0 4px 8px rgba(0, 0, 0, 0.2)",
        display: "flex",
        alignItems: "center",
        gap: "10px",
      }}
    >
      <FontAwesomeIcon
        icon={type === 'error' ? faTrashAlt : faCheckCircle}
        size="lg"
        style={{ fontSize: "18px", color: colors[type].text }}
      />
      <span>{message}</span>
      <button
        onClick={onClose}
        style={{
          backgroundColor: "transparent",
          border: "none",
          color: colors[type].text,
          marginLeft: "15px",
          cursor: "pointer",
          fontWeight: "bold",
        }}
      >
        X
      </button>
    </div>
  );
};

const ConfirmationModal = ({ message, onConfirm, onCancel }) => (
  <div
    style={{
      position: "fixed",
      top: 0,
      left: 0,
      width: "100%",
      height: "100%",
      backgroundColor: "rgba(0, 0, 0, 0.5)",
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      zIndex: 1000,
    }}
  >
    <div
      style={{
        backgroundColor: "white",
        padding: "20px",
        borderRadius: "8px",
        width: "300px",
        textAlign: "center",
        boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
      }}
    >
      <h3>Are you sure?</h3>
      <p>{message}</p>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          marginTop: "15px",
        }}
      >
        <Button
          onClick={onConfirm}
          style={{ backgroundColor: "#28a745", width: "45%" }}
        >
          Yes
        </Button>
        <Button
          onClick={onCancel}
          style={{ backgroundColor: "#dc3545", width: "45%" }}
        >
          No
        </Button>
      </div>
    </div>
  </div>
);

const CategoryItem = ({ category, onEdit, onDelete }) => (
  <li
    style={{
      display: "flex",
      justifyContent: "space-between",
      padding: "10px",
      borderBottom: "1px solid #ddd",
    }}
  >
    <div>
      <strong>{category.name}</strong>
      <p style={{ color: "gray" }}>{category.description}</p>
    </div>
    <div style={{ display: "flex", gap: "10px" }}>
      <button
        onClick={() => onEdit(category)}
        style={{
          color: "black",
          border: "none",
          background: "transparent",
          cursor: "pointer",
        }}
      >
        <FontAwesomeIcon icon={faEdit} />
      </button>
      <button
        onClick={() => onDelete(category._id)}
        style={{
          color: "black",
          border: "none",
          background: "transparent",
          cursor: "pointer",
        }}
      >
        <FontAwesomeIcon icon={faTrashAlt} />
      </button>
    </div>
  </li>
);

const CategoryForm = ({ 
  onSubmit, 
  name, 
  setName, 
  description, 
  setDescription, 
  editingCategory, 
  onCancelEdit 
}) => (
  <div
    style={{
      backgroundColor: "white",
      padding: "20px",
      borderRadius: "8px",
      boxShadow: "0 4px 6px rgba(197, 40, 40, 0.1)",
    }}
  >
    <h2>{editingCategory ? "Edit Category" : "Add Category"}</h2>
    <form onSubmit={onSubmit}>
      <Input
        type="text"
        value={name}
        onChange={(e) => setName(e.target.value)}
        placeholder="Enter category name"
      />
      <Textarea
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        placeholder="Enter category description"
      />
      <div style={{ display: "flex", gap: "10px" }}>
        <Button type="submit">
          {editingCategory ? "Update" : "Add"} Category
        </Button>
        {editingCategory && (
          <Button 
            type="button" 
            onClick={onCancelEdit}
            style={{ backgroundColor: "#6c757d" }}
          >
            Cancel
          </Button>
        )}
      </div>
    </form>
  </div>
);

const CategoryList = ({ categories, onEdit, onDelete }) => (
  <div
    style={{
      marginTop: "20px",
      backgroundColor: "white",
      padding: "20px",
      borderRadius: "8px",
      boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
    }}
  >
    <h2>Category List</h2>
    {categories.length === 0 ? (
      <p>No categories found.</p>
    ) : (
      <ul style={{ listStyle: "none", padding: 0 }}>
        {categories.map((category) => (
          <CategoryItem
            key={category._id}
            category={category}
            onEdit={onEdit}
            onDelete={onDelete}
          />
        ))}
      </ul>
    )}
  </div>
);

export default function CategoryPage() {
  const [categories, setCategories] = useState([]);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [modal, setModal] = useState({ message: '', type: '' });
  const [confirmationModalVisible, setConfirmationModalVisible] = useState(false);
  const [categoryToDelete, setCategoryToDelete] = useState(null);
  const [editingCategory, setEditingCategory] = useState(null);

  // Fetch categories on mount
  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      const response = await axios.get(API_BASE_URL);
      setCategories(response.data.categories);
    } catch (err) {
      showModal("Failed to fetch categories. Please try again.", "error");
    }
  };

  const showModal = (message, type) => {
    setModal({ message, type });
    setTimeout(() => setModal({ message: '', type: '' }), 3000);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!name || !description) {
      showModal("Name and description are required", "error");
      return;
    }

    try {
      if (editingCategory) {
        await axios.put(`${API_BASE_URL}/${editingCategory._id}`, { name, description });
        showModal("Category updated successfully!", "success");
      } else {
        await axios.post(API_BASE_URL, { name, description });
        showModal("Category added successfully!", "success");
      }

      resetForm();
      fetchCategories();
    } catch (err) {
      showModal("Failed to save category. Please try again.", "error");
    }
  };

  const resetForm = () => {
    setName("");
    setDescription("");
    setEditingCategory(null);
  };

  const handleEdit = (category) => {
    setEditingCategory(category);
    setName(category.name);
    setDescription(category.description);
  };

  const handleDelete = (categoryId) => {
    setCategoryToDelete(categoryId);
    setConfirmationModalVisible(true);
  };

  const confirmDelete = async () => {
    try {
      await axios.delete(`${API_BASE_URL}/${categoryToDelete}`);
      setCategories(categories.filter((category) => category._id !== categoryToDelete));
      showModal("Category deleted successfully!", "success");
    } catch (err) {
      showModal("Failed to delete category. Please try again.", "error");
    } finally {
      setConfirmationModalVisible(false);
    }
  };

  const cancelDelete = () => {
    setConfirmationModalVisible(false);
  };

  return (
    <div style={{ padding: "20px", backgroundColor: "#f9f9f9" }}>
      {/* Modal Popup */}
      {modal.message && (
        <Popup 
          message={modal.message} 
          type={modal.type} 
          onClose={() => setModal({ message: '', type: '' })} 
        />
      )}

      {/* Confirmation Modal */}
      {confirmationModalVisible && (
        <ConfirmationModal
          message="This action will permanently delete the category. Are you sure?"
          onConfirm={confirmDelete}
          onCancel={cancelDelete}
        />
      )}

      <CategoryForm
        onSubmit={handleSubmit}
        name={name}
        setName={setName}
        description={description}
        setDescription={setDescription}
        editingCategory={editingCategory}
        onCancelEdit={resetForm}
      />

      <CategoryList
        categories={categories}
        onEdit={handleEdit}
        onDelete={handleDelete}
      />
    </div>
  );
}