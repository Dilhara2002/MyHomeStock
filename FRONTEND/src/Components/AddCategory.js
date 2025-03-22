import React, { useState, useEffect } from "react";
import axios from "axios";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCheckCircle, faTrashAlt, faTimes, faExclamationTriangle, faInfoCircle } from '@fortawesome/free-solid-svg-icons';
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
            outline: "none",
            boxShadow: "0 2px 4px rgba(0, 0, 0, 0.05)",
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
            outline: "none",
            minHeight: "100px",
            boxShadow: "0 2px 4px rgba(0, 0, 0, 0.05)",
            resize: "vertical",
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
            transition: "all 0.3s ease-in-out",
            boxShadow: "0 2px 4px rgba(0, 0, 255, 0.2)",
            position: "relative",
            overflow: "hidden",
        }}
    >
        {children}
    </button>
);

const Alert = ({ message, type, onClose }) => {
    const getAlertStyles = () => {
        switch (type) {
            case 'error':
                return {
                    backgroundColor: "#fff2f0",
                    borderColor: "#ffccc7",
                    color: "#f5222d",
                    icon: faExclamationTriangle
                };
            case 'warning':
                return {
                    backgroundColor: "#fffbe6",
                    borderColor: "#ffe58f",
                    color: "#faad14",
                    icon: faExclamationTriangle
                };
            case 'info':
                return {
                    backgroundColor: "#e6f7ff",
                    borderColor: "#91d5ff",
                    color: "#1890ff",
                    icon: faInfoCircle
                };
            case 'success':
            default:
                return {
                    backgroundColor: "#f6ffed",
                    borderColor: "#b7eb8f",
                    color: "#52c41a",
                    icon: faCheckCircle
                };
        }
    };

    const styles = getAlertStyles();

    return (
        <div
            className={`alert alert-${type}`}
            style={{
                padding: "12px 16px",
                borderRadius: "8px",
                marginBottom: "20px",
                backgroundColor: styles.backgroundColor,
                border: `1px solid ${styles.borderColor}`,
                color: styles.color,
                display: "flex",
                alignItems: "center",
                animation: "fadeInAlert 0.5s ease-in-out",
                position: "relative",
            }}
        >
            <FontAwesomeIcon
                icon={styles.icon}
                style={{
                    marginRight: "10px",
                    fontSize: "16px",
                }}
            />
            <div style={{ flex: 1 }}>{message}</div>
            {onClose && (
                <button
                    onClick={onClose}
                    style={{
                        background: "transparent",
                        border: "none",
                        color: styles.color,
                        cursor: "pointer",
                        padding: "0",
                        marginLeft: "10px",
                        fontSize: "16px",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                    }}
                >
                    <FontAwesomeIcon icon={faTimes} />
                </button>
            )}
        </div>
    );
};

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
            backdropFilter: "blur(5px)",
            border: type === 'error' ? "1px solid #ffcdd2" : "1px solid #c8e6c9",
            minWidth: "300px",
            maxWidth: "500px",
        }}
    >
        <FontAwesomeIcon
            icon={type === 'error' ? faTrashAlt : faCheckCircle}
            className="popup-icon"
            size="lg"
            style={{ 
                fontSize: "20px", 
                color: type === 'error' ? "#c62828" : "#2e7d32",
                animation: type === 'success' ? "pulse 1.5s infinite" : "none",
            }}
        />
        <span>{message}</span>
        <button
            className="close-btn"
            onClick={onClose}
            style={{
                backgroundColor: "transparent",
                border: "none",
                color: type === 'error' ? "#c62828" : "#2e7d32",
                marginLeft: "auto",
                cursor: "pointer",
                fontWeight: "bold",
                width: "24px",
                height: "24px",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                borderRadius: "50%",
                transition: "background-color 0.2s ease",
            }}
        >
            <FontAwesomeIcon icon={faTimes} />
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
            backdropFilter: "blur(3px)",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            zIndex: 1000,
            animation: "fadeInModal 0.3s ease-out",
        }}
    >
        <div
            className="confirmation-modal-content"
            style={{
                backgroundColor: "white",
                padding: "30px",
                borderRadius: "12px",
                width: "350px",
                textAlign: "center",
                boxShadow: "0 10px 25px rgba(0, 0, 0, 0.2)",
                animation: "slideInModal 0.3s ease-out",
                transform: "translateY(0)",
                border: "1px solid rgba(0, 0, 0, 0.1)",
            }}
        >
            <h3 style={{ 
                margin: "0 0 15px 0", 
                color: "#333",
                fontSize: "20px",
            }}>
                Are you sure?
            </h3>
            <p style={{ 
                margin: "0 0 25px 0", 
                color: "#666",
                fontSize: "16px", 
                lineHeight: "1.5"
            }}>
                {message}
            </p>
            <div
                className="confirmation-buttons"
                style={{
                    display: "flex",
                    justifyContent: "space-between",
                    gap: "15px",
                }}
            >
                <button
                    onClick={onConfirm}
                    className="confirm-btn"
                    style={{
                        padding: "10px 16px",
                        borderRadius: "8px",
                        border: "none",
                        cursor: "pointer",
                        fontSize: "16px",
                        width: "45%",
                        backgroundColor: "#28a745",
                        color: "white",
                        fontWeight: "bold",
                        transition: "all 0.2s ease",
                        boxShadow: "0 2px 4px rgba(40, 167, 69, 0.2)",
                    }}
                >
                    Yes
                </button>
                <button
                    onClick={onCancel}
                    className="cancel-btn"
                    style={{
                        padding: "10px 16px",
                        borderRadius: "8px",
                        border: "none",
                        cursor: "pointer",
                        fontSize: "16px",
                        width: "45%",
                        backgroundColor: "#dc3545",
                        color: "white",
                        fontWeight: "bold",
                        transition: "all 0.2s ease",
                        boxShadow: "0 2px 4px rgba(220, 53, 69, 0.2)",
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
    const [loading, setLoading] = useState(true);
    const [formAlerts, setFormAlerts] = useState([]);
    const [nameValid, setNameValid] = useState(true);
    const [descriptionValid, setDescriptionValid] = useState(true);

    // Fetch categories on mount
    useEffect(() => {
        fetchCategories();
    }, []);

    // Generate a unique ID for alerts
    const generateAlertId = () => {
        return '_' + Math.random().toString(36).substr(2, 9);
    };

    // Add alert
    const addAlert = (message, type = 'info') => {
        const newAlert = {
            id: generateAlertId(),
            message,
            type
        };
        setFormAlerts(prev => [...prev, newAlert]);
        
        // Auto remove after 5 seconds
        if (type !== 'error') {
            setTimeout(() => {
                removeAlert(newAlert.id);
            }, 5000);
        }
    };

    // Remove alert
    const removeAlert = (id) => {
        setFormAlerts(prev => prev.filter(alert => alert.id !== id));
    };

    const fetchCategories = async () => {
        setLoading(true);
        try {
            const response = await axios.get("http://localhost:5002/api/categories");
            setCategories(response.data.categories);
            setLoading(false);
        } catch (err) {
            setModal({ message: "Failed to fetch categories. Please try again.", type: "error" });
            setLoading(false);
        }
    };

    const resetForm = () => {
        setName("");
        setDescription("");
        setEditingCategoryId(null);
        setNameValid(true);
        setDescriptionValid(true);
        setFormAlerts([]);
    };

    const validateForm = () => {
        let isValid = true;
        setFormAlerts([]);

        if (!name.trim()) {
            setNameValid(false);
            addAlert("Category name is required", "error");
            isValid = false;
        } else if (name.length < 3) {
            setNameValid(false);
            addAlert("Category name must be at least 3 characters long", "error");
            isValid = false;
        } else {
            setNameValid(true);
        }

        if (!description.trim()) {
            setDescriptionValid(false);
            addAlert("Category description is required", "error");
            isValid = false;
        } else if (description.length < 10) {
            setDescriptionValid(false);
            addAlert("Description must be at least 10 characters long", "error");
            isValid = false;
        } else {
            setDescriptionValid(true);
        }

        // Check if category name already exists (for new categories)
        if (!editingCategoryId && name.trim()) {
            const categoryExists = categories.some(
                cat => cat.name.toLowerCase() === name.toLowerCase()
            );
            
            if (categoryExists) {
                setNameValid(false);
                addAlert("A category with this name already exists", "error");
                isValid = false;
            }
        }

        return isValid;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!validateForm()) {
            return;
        }

        try {
            if (editingCategoryId) {
                // Update existing category
                await axios.put(`http://localhost:5002/api/categories/${editingCategoryId}`, { name, description });
                setModal({ message: "Category updated successfully!", type: "success" });
                addAlert("Category updated successfully!", "success");
            } else {
                // Add new category
                await axios.post("http://localhost:5002/api/categories", { name, description });
                setModal({ message: "Category added successfully!", type: "success" });
                addAlert("Category added successfully!", "success");
            }

            // Clear form fields
            resetForm();

            // Fetch updated category list
            fetchCategories();
        } catch (err) {
            const errorMessage = err.response?.data?.message || "Failed to save category. Please try again.";
            setModal({ message: errorMessage, type: "error" });
            addAlert(errorMessage, "error");
        }
    };

    const handleNameChange = (e) => {
        const value = e.target.value;
        setName(value);
        
        if (value.trim() === '') {
            setNameValid(false);
        } else if (value.length < 3) {
            setNameValid(false);
        } else {
            setNameValid(true);
            // Remove any name-related error alerts
            setFormAlerts(prev => prev.filter(alert => 
                !alert.message.includes("name") && !alert.message.includes("Name")
            ));
        }
    };

    const handleDescriptionChange = (e) => {
        const value = e.target.value;
        setDescription(value);
        
        if (value.trim() === '') {
            setDescriptionValid(false);
        } else if (value.length < 10) {
            setDescriptionValid(false);
        } else {
            setDescriptionValid(true);
            // Remove any description-related error alerts
            setFormAlerts(prev => prev.filter(alert => 
                !alert.message.includes("description") && !alert.message.includes("Description")
            ));
        }
    };

    const handleCancelEdit = () => {
        resetForm();
        addAlert("Edit cancelled", "info");
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
            setModal({ message: "Category deleted successfully!", type: "success" });
            addAlert("Category deleted successfully!", "success");
        } catch (err) {
            setModal({ message: "Failed to delete category. Please try again.", type: "error" });
            addAlert("Failed to delete category. Please try again.", "error");
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
        addAlert(`Editing category: ${category.name}`, "info");
    };

    return (
        <div
            style={{
                padding: "20px",
                backgroundColor: "#f5f7fa",
                minHeight: "100vh",
                fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
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
                    padding: "30px",
                    borderRadius: "12px",
                    boxShadow: "0 6px 15px rgba(0, 0, 0, 0.08)",
                    marginBottom: "25px",
                    border: "1px solid rgba(0, 0, 0, 0.05)",
                    transition: "box-shadow 0.3s ease",
                }}
            >
                <h2 style={{ 
                    marginTop: 0, 
                    marginBottom: "20px", 
                    color: "#333",
                    position: "relative",
                    display: "inline-block",
                }}>
                    {editingCategoryId ? "Update Category" : "Add Category"}
                    <span style={{
                        position: "absolute",
                        bottom: "-10px",
                        left: 0,
                        width: "50px",
                        height: "3px",
                        backgroundColor: "#007bff",
                        borderRadius: "3px",
                    }}></span>
                </h2>

                {/* Alert Messages */}
                <div className="alert-container" style={{ marginBottom: "15px" }}>
                    {formAlerts.map(alert => (
                        <Alert 
                            key={alert.id} 
                            message={alert.message} 
                            type={alert.type} 
                            onClose={() => removeAlert(alert.id)} 
                        />
                    ))}
                </div>

                <form onSubmit={handleSubmit}>
                    <div style={{ marginBottom: "15px" }}>
                        <label 
                            htmlFor="category-name" 
                            style={{ 
                                display: "block", 
                                marginBottom: "8px", 
                                fontWeight: "500", 
                                color: "#333" 
                            }}
                        >
                            Category Name <span style={{ color: "red" }}>*</span>
                        </label>
                        <Input
                            id="category-name"
                            type="text"
                            value={name}
                            onChange={handleNameChange}
                            placeholder="Enter category name"
                            style={{ 
                                marginBottom: "5px",
                                borderColor: !nameValid ? "#f5222d" : "#ccc",
                                backgroundColor: !nameValid ? "#fff1f0" : "white",
                            }}
                        />
                        {!nameValid && name.trim() === "" && (
                            <div style={{ color: "#f5222d", fontSize: "12px", marginBottom: "15px" }}>
                                Please enter a category name
                            </div>
                        )}
                        {!nameValid && name.trim() !== "" && name.length < 3 && (
                            <div style={{ color: "#f5222d", fontSize: "12px", marginBottom: "15px" }}>
                                Name must be at least 3 characters
                            </div>
                        )}
                    </div>

                    <div style={{ marginBottom: "15px" }}>
                        <label 
                            htmlFor="category-description" 
                            style={{ 
                                display: "block", 
                                marginBottom: "8px", 
                                fontWeight: "500", 
                                color: "#333" 
                            }}
                        >
                            Description <span style={{ color: "red" }}>*</span>
                        </label>
                        <Textarea
                            id="category-description"
                            value={description}
                            onChange={handleDescriptionChange}
                            placeholder="Enter category description"
                            style={{ 
                                marginBottom: "5px",
                                borderColor: !descriptionValid ? "#f5222d" : "#ccc",
                                backgroundColor: !descriptionValid ? "#fff1f0" : "white",
                            }}
                        />
                        {!descriptionValid && description.trim() === "" && (
                            <div style={{ color: "#f5222d", fontSize: "12px", marginBottom: "15px" }}>
                                Please enter a description
                            </div>
                        )}
                        {!descriptionValid && description.trim() !== "" && description.length < 10 && (
                            <div style={{ color: "#f5222d", fontSize: "12px", marginBottom: "15px" }}>
                                Description must be at least 10 characters
                            </div>
                        )}
                    </div>

                    <div style={{ 
                        display: "flex", 
                        gap: "15px",
                        marginTop: "20px" 
                    }}>
                        <Button 
                            type="submit"
                            style={{
                                backgroundColor: nameValid && descriptionValid ? "#007bff" : "#ccc",
                                cursor: nameValid && descriptionValid ? "pointer" : "not-allowed",
                            }}
                        >
                            {editingCategoryId ? "Update Category" : "Add Category"}
                        </Button>
                        
                        {editingCategoryId && (
                            <button
                                type="button"
                                onClick={handleCancelEdit}
                                style={{
                                    backgroundColor: "#6c757d",
                                    color: "white",
                                    padding: "12px",
                                    borderRadius: "8px",
                                    width: "100%",
                                    border: "none",
                                    cursor: "pointer",
                                    fontSize: "16px",
                                    fontWeight: "bold",
                                    transition: "all 0.3s ease-in-out",
                                    boxShadow: "0 2px 4px rgba(108, 117, 125, 0.2)",
                                }}
                            >
                                Cancel
                            </button>
                        )}
                    </div>
                </form>
            </div>

            <div
                style={{
                    backgroundColor: "white",
                    padding: "30px",
                    borderRadius: "12px",
                    boxShadow: "0 6px 15px rgba(0, 0, 0, 0.08)",
                    border: "1px solid rgba(0, 0, 0, 0.05)",
                    transition: "box-shadow 0.3s ease",
                }}
            >
                <h2 style={{ 
                    marginTop: 0, 
                    marginBottom: "20px", 
                    color: "#333",
                    position: "relative",
                    display: "inline-block",
                }}>
                    Category List
                    <span style={{
                        position: "absolute",
                        bottom: "-10px",
                        left: 0,
                        width: "50px",
                        height: "3px",
                        backgroundColor: "#007bff",
                        borderRadius: "3px",
                    }}></span>
                </h2>
                
                {loading ? (
                    <div style={{ textAlign: "center", padding: "30px 0" }}>
                        <div className="loading-spinner" style={{
                            border: "4px solid rgba(0, 0, 0, 0.1)",
                            borderLeft: "4px solid #007bff",
                            borderRadius: "50%",
                            width: "40px",
                            height: "40px",
                            animation: "spin 1s linear infinite",
                            margin: "0 auto",
                        }}></div>
                        <p style={{ marginTop: "15px", color: "#666" }}>Loading categories...</p>
                    </div>
                ) : categories.length === 0 ? (
                    <div style={{ 
                        padding: "40px 20px", 
                        textAlign: "center", 
                        backgroundColor: "#f8f9fa",
                        borderRadius: "8px",
                        border: "1px dashed #ddd",
                    }}>
                        <p style={{ 
                            color: "#6c757d", 
                            fontSize: "16px",
                            margin: 0,
                        }}>No categories found. Create your first category above.</p>
                    </div>
                ) : (
                    <ul style={{ 
                        listStyle: "none", 
                        padding: 0,
                        margin: 0,
                        borderRadius: "8px",
                        overflow: "hidden",
                        border: "1px solid #eaeaea",
                    }}>
                        {categories.map((category, index) => (
                            <li
                                key={category._id}
                                style={{
                                    display: "flex",
                                    justifyContent: "space-between",
                                    alignItems: "center",
                                    padding: "16px 20px",
                                    borderBottom: index < categories.length - 1 ? "1px solid #eaeaea" : "none",
                                    backgroundColor: "#fff",
                                    transition: "all 0.2s ease",
                                }}
                            >
                                <div style={{ flex: 1 }}>
                                    <h3 style={{ 
                                        fontSize: "18px",
                                        margin: "0 0 8px 0",
                                        color: "#333",
                                    }}>
                                        {category.name}
                                    </h3>
                                    <p style={{ 
                                        color: "#6c757d", 
                                        margin: 0,
                                        fontSize: "14px",
                                        lineHeight: "1.5",
                                    }}>
                                        {category.description}
                                    </p>
                                </div>
                                <div style={{ 
                                    display: "flex", 
                                    gap: "15px",
                                    marginLeft: "15px",
                                }}>
                                    <button
                                        onClick={() => handleEdit(category)}
                                        style={{
                                            color: "#007bff",
                                            border: "none",
                                            background: "transparent",
                                            cursor: "pointer",
                                            fontSize: "16px",
                                            width: "36px",
                                            height: "36px",
                                            display: "flex",
                                            alignItems: "center",
                                            justifyContent: "center",
                                            borderRadius: "50%",
                                            transition: "all 0.2s ease",
                                        }}
                                        title="Edit"
                                    >
                                        <FontAwesomeIcon icon={faPen} />
                                    </button>

                                    <button
                                        onClick={() => handleDelete(category._id)}
                                        style={{
                                            color: "#dc3545",
                                            border: "none",
                                            background: "transparent",
                                            cursor: "pointer",
                                            fontSize: "16px",
                                            width: "36px",
                                            height: "36px",
                                            display: "flex",
                                            alignItems: "center",
                                            justifyContent: "center",
                                            borderRadius: "50%",
                                            transition: "all 0.2s ease",
                                        }}
                                        title="Delete"
                                    >
                                        <FontAwesomeIcon icon={faTrashAlt} />
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
                    
                    @keyframes slideInModal {
                        from {
                            opacity: 0;
                            transform: translateY(-20px);
                        }
                        to {
                            opacity: 1;
                            transform: translateY(0);
                        }
                    }
                    
                    @keyframes fadeInModal {
                        from {
                            opacity: 0;
                        }
                        to {
                            opacity: 1;
                        }
                    }
                    
                    @keyframes fadeInAlert {
                        from {
                            opacity: 0;
                            transform: translateY(-10px);
                        }
                        to {
                            opacity: 1;
                            transform: translateY(0);
                        }
                    }
                    
                    @keyframes pulse {
                        0% {
                            transform: scale(1);
                        }
                        50% {
                            transform: scale(1.1);
                        }
                        100% {
                            transform: scale(1);
                        }
                    }
                    
                    @keyframes spin {
                        0% {
                            transform: rotate(0deg);
                        }
                        100% {
                            transform: rotate(360deg);
                        }
                    }
                    
                    input:focus, textarea:focus {
                        border-color: #007bff !important;
                        box-shadow: 0 0 0 3px rgba(0, 123, 255, 0.25) !important;
                    }
                    
                    input:hover, textarea:hover {
                        border-color: #b3b3b3 !important;
                    }
                `}
            </style>
        </div>
    );
}