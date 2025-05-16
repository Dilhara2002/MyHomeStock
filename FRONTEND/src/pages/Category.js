import React, { useState, useEffect } from "react";
import axios from "axios";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCheckCircle, faTrashAlt, faEdit } from '@fortawesome/free-solid-svg-icons';

// Constants
const API_BASE_URL = "http://localhost:5002/api/categories";

// Reusable UI Components
const Input = ({ ...props }) => (
  <input
    {...props}
    className="form-input"
  />
);

const Textarea = ({ ...props }) => (
  <textarea
    {...props}
    className="form-textarea"
  />
);

const Button = ({ children, ...props }) => (
  <button
    {...props}
    className={`form-button ${props.className || ''}`}
  >
    {children}
  </button>
);

const IconButton = ({ icon, onClick, color = "black" }) => (
  <button
    onClick={onClick}
    className="icon-button"
    style={{ color }}
  >
    <FontAwesomeIcon icon={icon} />
  </button>
);

const Popup = ({ message, type, onClose }) => {
  const colors = {
    error: { bg: "#ffebee", text: "#c62828", icon: faTrashAlt },
    success: { bg: "#e8f5e9", text: "#2e7d32", icon: faCheckCircle }
  };

  return (
    <div className="popup" style={{ backgroundColor: colors[type].bg, color: colors[type].text }}>
      <FontAwesomeIcon icon={colors[type].icon} />
      <span>{message}</span>
      <button onClick={onClose} className="popup-close">
        X
      </button>
    </div>
  );
};

const ConfirmationModal = ({ message, onConfirm, onCancel }) => (
  <div className="modal-overlay">
    <div className="modal-content">
      <h3>Are you sure?</h3>
      <p>{message}</p>
      <div className="modal-actions">
        <Button onClick={onConfirm} className="confirm-button">
          Yes
        </Button>
        <Button onClick={onCancel} className="cancel-button">
          No
        </Button>
      </div>
    </div>
  </div>
);

const CategoryForm = ({ 
  onSubmit, 
  name, 
  setName, 
  description, 
  setDescription, 
  isEditing,
  onCancelEdit 
}) => (
  <div className="form-container">
    <h2>{isEditing ? 'Edit Category' : 'Add Category'}</h2>
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
      <div className="form-actions">
        <Button type="submit">
          {isEditing ? 'Update' : 'Add'} Category
        </Button>
        {isEditing && (
          <Button 
            type="button" 
            onClick={onCancelEdit}
            className="cancel-button"
          >
            Cancel
          </Button>
        )}
      </div>
    </form>
  </div>
);

const CategoryItem = ({ category, onEdit, onDelete }) => (
  <li className="category-item">
    <div>
      <strong>{category.name}</strong>
      <p className="category-description">{category.description}</p>
    </div>
    <div className="category-actions">
      <IconButton icon={faEdit} onClick={() => onEdit(category)} />
      <IconButton icon={faTrashAlt} onClick={() => onDelete(category._id)} />
    </div>
  </li>
);

const CategoryList = ({ categories, onEdit, onDelete }) => (
  <div className="list-container">
    <h2>Category List</h2>
    {categories.length === 0 ? (
      <p>No categories found.</p>
    ) : (
      <ul className="category-list">
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


const styles = `
  .form-input, .form-textarea {
    border: 1px solid #ccc;
    padding: 12px;
    border-radius: 8px;
    width: 100%;
    box-sizing: border-box;
    margin-bottom: 15px;
    font-size: 14px;
    transition: border-color 0.3s ease-in-out;
  }

  .form-button {
    background-color: #007bff;
    color: white;
    padding: 12px;
    border-radius: 8px;
    width: 100%;
    border: none;
    cursor: pointer;
    font-size: 16px;
    font-weight: bold;
    transition: background-color 0.3s ease-in-out;
  }

  .confirm-button {
    background-color: #28a745 !important;
    width: 45% !important;
  }

  .cancel-button {
    background-color: #dc3545 !important;
    width: 45% !important;
  }

  .icon-button {
    border: none;
    background: transparent;
    cursor: pointer;
    font-size: 16px;
  }

  .popup {
    position: fixed;
    top: 20px;
    left: 50%;
    transform: translateX(-50%);
    padding: 15px 20px;
    border-radius: 8px;
    font-size: 16px;
    z-index: 999;
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
    display: flex;
    align-items: center;
    gap: 10px;
  }

  .popup-close {
    background-color: transparent;
    border: none;
    margin-left: 15px;
    cursor: pointer;
    font-weight: bold;
  }

  .modal-overlay {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-color: rgba(0, 0, 0, 0.5);
    display: flex;
    justify-content: center;
    align-items: center;
    z-index: 1000;
  }

  .modal-content {
    background-color: white;
    padding: 20px;
    border-radius: 8px;
    width: 300px;
    text-align: center;
    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  }

  .modal-actions {
    display: flex;
    justify-content: space-between;
    margin-top: 15px;
  }

  .form-container {
    background-color: white;
    padding: 20px;
    border-radius: 8px;
    box-shadow: 0 4px 6px rgba(197, 40, 40, 0.1);
  }

  .form-actions {
    display: flex;
    gap: 10px;
  }

  .list-container {
    margin-top: 20px;
    background-color: white;
    padding: 20px;
    border-radius: 8px;
    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  }

  .category-list {
    list-style: none;
    padding: 0;
  }

  .category-item {
    display: flex;
    justify-content: space-between;
    padding: 10px;
    border-bottom: 1px solid #ddd;
  }

  .category-description {
    color: gray;
  }

  .category-actions {
    display: flex;
    gap: 10px;
  }
`;

// Inject styles
const styleElement = document.createElement('style');
styleElement.textContent = styles;
document.head.appendChild(styleElement);

export default function CategoryPage() {
  const [categories, setCategories] = useState([]);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [modal, setModal] = useState({ message: '', type: '' });
  const [confirmationModalVisible, setConfirmationModalVisible] = useState(false);
  const [categoryToDelete, setCategoryToDelete] = useState(null);
  const [editingCategory, setEditingCategory] = useState(null);

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

  const handleDelete = (categoryId) => {
    setCategoryToDelete(categoryId);
    setConfirmationModalVisible(true);
  };

  const confirmDelete = async () => {
    try {
      await axios.delete(`${API_BASE_URL}/${categoryToDelete}`);
      setCategories(categories.filter(c => c._id !== categoryToDelete));
      showModal("Category deleted successfully!", "success");
    } catch (err) {
      showModal("Failed to delete category. Please try again.", "error");
    } finally {
      setConfirmationModalVisible(false);
    }
  };

  const handleEdit = (category) => {
    setEditingCategory(category);
    setName(category.name);
    setDescription(category.description);
  };

  return (
    <div className="page-container">
      {modal.message && (
        <Popup 
          message={modal.message} 
          type={modal.type} 
          onClose={() => setModal({ message: '', type: '' })} 
        />
      )}

      {confirmationModalVisible && (
        <ConfirmationModal
          message="This action will permanently delete the category. Are you sure?"
          onConfirm={confirmDelete}
          onCancel={() => setConfirmationModalVisible(false)}
        />
      )}

      <CategoryForm
        onSubmit={handleSubmit}
        name={name}
        setName={setName}
        description={description}
        setDescription={setDescription}
        isEditing={!!editingCategory}
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