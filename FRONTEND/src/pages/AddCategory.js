import React, { useState, useEffect } from "react";
import axios from "axios";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCheckCircle, faTrashAlt } from '@fortawesome/free-solid-svg-icons'; // Changed to faTrashAlt for recycling bin icon
import { faPen } from '@fortawesome/free-solid-svg-icons';

const Input = (props) => (
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

const Textarea = (props) => (
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
        }}
    >
        {children}
    </button>
);

const Popup = ({ message, type, onClose }) => (
    <div
        className={`popup ${type === 'error' ? 'popup-error' : 'popup-success'}`}
        style={{
            position: "fixed",
            top: "20px",
            left: "50%",
            transform: "translateX(-50%)",
            backgroundColor: type === 'error' ? "#ffebee" : "#e8f5e9",
            color: type === 'error' ? "#c62828" : "#2e7d32",
            padding: "15px 20px",
            borderRadius: "8px",
            fontSize: "16px",
            zIndex: 999,
            boxShadow: "0 4px 8px rgba(0, 0, 0, 0.2)",
            display: "flex",
            alignItems: "center",
            gap: "10px",
            animation: "fadeIn 0.5s ease-in-out",
        }}
    >
        <FontAwesomeIcon
            icon={type === 'error' ? faTrashAlt : faCheckCircle} // Update to use appropriate icons
            className="popup-icon"
            size="lg"
            style={{ fontSize: "18px", color: type === 'error' ? "#c62828" : "#2e7d32" }}
        />
        <span>{message}</span>
        <button
            className="close-btn"
            onClick={onClose}
            style={{
                backgroundColor: "transparent",
                border: "none",
                color: type === 'error' ? "#c62828" : "#2e7d32",
                marginLeft: "15px",
                cursor: "pointer",
                fontWeight: "bold",
            }}
        >
            X
        </button>
    </div>
);

const ConfirmationModal = ({ message, onConfirm, onCancel }) => (
    <div
        className="confirmation-modal"
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
            className="confirmation-modal-content"
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
                className="confirmation-buttons"
                style={{
                    display: "flex",
                    justifyContent: "space-between",
                    marginTop: "15px",
                }}
            >
                <button
                    onClick={onConfirm}
                    className="confirm-btn"
                    style={{
                        padding: "8px 16px",
                        borderRadius: "5px",
                        border: "none",
                        cursor: "pointer",
                        fontSize: "16px",
                        width: "45%",
                        backgroundColor: "#28a745",
                        color: "white",
                    }}
                >
                    Yes
                </button>
                <button
                    onClick={onCancel}
                    className="cancel-btn"
                    style={{
                        padding: "8px 16px",
                        borderRadius: "5px",
                        border: "none",
                        cursor: "pointer",
                        fontSize: "16px",
                        width: "45%",
                        backgroundColor: "#dc3545",
                        color: "white",
                    }}
                >
                    No
                </button>
            </div>
        </div>
    </div>
);

export default function CategoryPage() {
    const [categories, setCategories] = useState([]);
    const [error, setError] = useState(null);
    const [success, setSuccess] = useState(null);
    const [name, setName] = useState("");
    const [description, setDescription] = useState("");
    const [editingCategoryId, setEditingCategoryId] = useState(null);
    const [modal, setModal] = useState({ message: '', type: '' });
    const [confirmationModalVisible, setConfirmationModalVisible] = useState(false);
    const [categoryToDelete, setCategoryToDelete] = useState(null);

    // Fetch categories on mount
    useEffect(() => {
        fetchCategories();
    }, []);

    const fetchCategories = async () => {
        try {
            const response = await axios.get("http://localhost:5002/api/categories");
            setCategories(response.data.categories);
        } catch (err) {
            setError("Failed to fetch categories. Please try again.");
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!name || !description) {
            setModal({ message: "Name and description are required", type: "error" });
            return;
        }

        try {
            if (editingCategoryId) {
                // Update existing category
                await axios.put(`http://localhost:5002/api/categories/${editingCategoryId}`, { name, description });
                setSuccess("Category updated successfully!");
            } else {
                // Add new category
                await axios.post("http://localhost:5002/api/categories", { name, description });
                setSuccess("Category added successfully!");
            }

            // Clear form fields
            setName("");
            setDescription("");
            setEditingCategoryId(null);

            // Fetch updated category list
            fetchCategories();  // This is important to reload the list after adding or updating
        } catch (err) {
            setError("Failed to save category. Please try again.");
        }
    };

    const handleDelete = async (categoryId) => {
        setCategoryToDelete(categoryId);
        setConfirmationModalVisible(true);
    };

    const confirmDelete = async () => {
        try {
            await axios.delete(`http://localhost:5002/api/categories/${categoryToDelete}`);
            setCategories(categories.filter((category) => category._id !== categoryToDelete));
            setConfirmationModalVisible(false);
        } catch (err) {
            setError("Failed to delete category. Please try again.");
            setConfirmationModalVisible(false);
        }
    };

    const cancelDelete = () => {
        setConfirmationModalVisible(false);
    };

    const handleEdit = (category) => {
        setName(category.name);
        setDescription(category.description);
        setEditingCategoryId(category._id);
    };

    return (
        <div
            style={{
                padding: "20px",
                backgroundColor: "#f9f9f9",
            }}
        >
            {/* Modal Popup */}
            {modal.message && <Popup message={modal.message} type={modal.type} onClose={() => setModal({ message: '', type: '' })} />}

            {/* Confirmation Modal */}
            {confirmationModalVisible && (
                <ConfirmationModal
                    message="This action will permanently delete the category. Are you sure?"
                    onConfirm={confirmDelete}
                    onCancel={cancelDelete}
                />
            )}

            <div
                style={{
                    backgroundColor: "white",
                    padding: "20px",
                    borderRadius: "8px",
                    boxShadow: "0 4px 6px rgba(197, 40, 40, 0.1)",
                }}
            >
                <h2>Add Category</h2>
                {error && <p style={{ color: "red" }}>{error}</p>}
                {success && <p style={{ color: "green" }}>{success}</p>}
                <form onSubmit={handleSubmit}>
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
                    <Button type="submit">
                        {editingCategoryId ? "Update Category" : "Add Category"}
                    </Button>
                </form>
            </div>

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
                            <li
                                key={category._id}
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
                                        onClick={() => handleEdit(category)}
                                        style={{
                                            color: "#007bff",
                                            border: "none",
                                            background: "transparent",
                                            cursor: "pointer",
                                        }}
                                    >
                                        <FontAwesomeIcon icon={faPen} /> {/* Pencil (Edit) Icon */}
                                    </button>

                                    <button
                                        onClick={() => handleDelete(category._id)}
                                        style={{
                                            color: "black", // Black color for delete icon
                                            border: "none",
                                            background: "transparent",
                                            cursor: "pointer",
                                        }}
                                    >
                                        <FontAwesomeIcon icon={faTrashAlt} /> {/* Recycling Bin (Trash) Icon */}
                                    </button>
                                </div>
                            </li>
                        ))}
                    </ul>
                )}
            </div>

            <style>
                {`
          @keyframes fadeIn {
            from {
              opacity: 0;
              transform: translateX(-50%) translateY(-20px);
            }
            to {
              opacity: 1;
              transform: translateX(-50%) translateY(0);
            }
          }
        `}
            </style>
        </div>
    );
}