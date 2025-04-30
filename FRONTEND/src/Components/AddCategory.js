import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap-icons/font/bootstrap-icons.css";
import {
  FaTag,
  FaPlus,
  FaTrashAlt,
  FaEdit,
  FaExclamationTriangle,
  FaList,
  FaCheckCircle,
  FaTimesCircle,
  FaSearch,
  FaFilePdf
} from "react-icons/fa";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";

const CategoryPage = () => {
  const [categories, setCategories] = useState([]);
  const [filteredCategories, setFilteredCategories] = useState([]);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showMessageModal, setShowMessageModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [isSuccessMessage, setIsSuccessMessage] = useState(false);
  const [categoryToDelete, setCategoryToDelete] = useState(null);
  const [categoryToEdit, setCategoryToEdit] = useState(null);
  const [isGeneratingReport, setIsGeneratingReport] = useState(false);
  const navigate = useNavigate();

  const formRef = useRef(null);
  const reportRef = useRef(null);

  // Fetch categories
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          navigate("/login");
          return;
        }
        const response = await axios.get("http://localhost:5002/api/categories", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setCategories(response.data.categories);
        setFilteredCategories(response.data.categories);
      } catch (error) {
        showError("Error fetching categories");
      }
    };
    fetchCategories();
  }, [navigate]);

  // Search 
  useEffect(() => {
    if (searchTerm.trim() === "") {
      setFilteredCategories(categories);
    } else {
      const filtered = categories.filter(
        (category) =>
          category.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          (category.description && 
           category.description.toLowerCase().includes(searchTerm.toLowerCase()))
      );
      setFilteredCategories(filtered);
    }
  }, [searchTerm, categories]);

  // Error handling helper
  const showError = (message) => {
    setError(message);
    setIsSuccessMessage(false);
    setShowMessageModal(true);
    setTimeout(() => setShowMessageModal(false), 5000);
  };

  // Success message helper
  const showSuccess = (message) => {
    setSuccess(message);
    setIsSuccessMessage(true);
    setShowMessageModal(true);
    setTimeout(() => setShowMessageModal(false), 5000);
  };

  // category name validate
  const validateCategoryName = (newName) => {
    const isDuplicate = categories.some(
      category => category.name.toLowerCase() === newName.toLowerCase() &&
        category._id !== (categoryToEdit ? categoryToEdit._id : null)
    );

    if (isDuplicate) {
      showError("A category with this name already exists.");
      return false;
    }

    if (newName.trim().length < 2) {
      showError("Category name must be at least 2 characters long.");
      return false;
    }

    return true;
  };

  // Handle delete confirmation
  const handleDelete = (id) => {
    setCategoryToDelete(id);
    setShowDeleteModal(true);
  };

  // Confirm delete
  const confirmDelete = async () => {
    try {
      const token = localStorage.getItem("token");
      await axios.delete(`http://localhost:5002/api/categories/${categoryToDelete}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      const updatedCategories = categories.filter((category) => category._id !== categoryToDelete);
      setCategories(updatedCategories);
      setFilteredCategories(updatedCategories);

      setShowDeleteModal(false);
      showSuccess("Category deleted successfully.");
    } catch (error) {
      showError("Error deleting category");
    }
  };

  // Handle edit click
  const handleEdit = (category) => {
    setCategoryToEdit(category);
    setName(category.name);
    setDescription(category.description);
    setShowEditModal(true);
  };

  // Handle edit validate
  const handleEditSubmit = async (e) => {
    e.preventDefault();

    if (!validateCategoryName(name)) return;

    const updatedCategory = { name, description };

    try {
      const token = localStorage.getItem("token");
      await axios.put(`http://localhost:5002/api/categories/${categoryToEdit._id}`, updatedCategory, {
        headers: { Authorization: `Bearer ${token}` },
      });

      //apply new category
      const updatedCategories = categories.map((category) =>
        category._id === categoryToEdit._id ? { ...category, ...updatedCategory } : category
      );
      
      setCategories(updatedCategories);
      setFilteredCategories(updatedCategories);

      setShowEditModal(false);
      setCategoryToEdit(null);
      showSuccess("Category updated successfully.");

      setName("");
      setDescription("");
    } catch (error) {
      showError("Error updating category");
    }
  };

  // Handle add validate
  const handleAddCategory = async (e) => {
    e.preventDefault();

    if (!validateCategoryName(name)) return;

    //create new
    const newCategory = { name, description };

    try {
      const token = localStorage.getItem("token");
      const response = await axios.post("http://localhost:5002/api/categories", newCategory, {
        headers: { Authorization: `Bearer ${token}` },
      });

      const updatedCategories = [...categories, response.data.category];
      setCategories(updatedCategories);
      setFilteredCategories(updatedCategories);

      showSuccess("Category added successfully.");
      setName("");
      setDescription("");
    } catch (error) {
      showError("Error adding category");
    }
  };

  // Generate PDF Report
  const generatePDFReport = () => {
    setIsGeneratingReport(true);
    
    const currentDate = new Date().toLocaleDateString();
    const reportElement = reportRef.current;
    
    const options = {
      scale: 2,
      useCORS: true,
      allowTaint: true,
      logging: true,
      letterRendering: true,
    };

    html2canvas(reportElement, options).then((canvas) => {
      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF('p', 'mm', 'a4');
      const imgWidth = 210;
      const pageHeight = 295;
      const imgHeight = canvas.height * imgWidth / canvas.width;
      let heightLeft = imgHeight;
      let position = 0;

      pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
      heightLeft -= pageHeight;

      while (heightLeft >= 0) {
        position = heightLeft - imgHeight;
        pdf.addPage();
        pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
        heightLeft -= pageHeight;
      }

      pdf.save(`Categories_Report_${currentDate}.pdf`);
      setIsGeneratingReport(false);
    }).catch((error) => {
      console.error("Error generating PDF:", error);
      showError("Failed to generate PDF report");
      setIsGeneratingReport(false);
    });
  };

  return (
    <div className="container mt-5" style={{
      maxWidth: "1200px",
      margin: "0 auto",
      fontFamily: "'Poppins', sans-serif",
      animation: "fadeIn 0.5s ease-in-out"
    }}>
      <br />
      <div className="card shadow-lg" style={{
        borderRadius: "15px",
        border: "none",
        overflow: "hidden"
      }}>
        <div className="card-header" style={{
          background: "linear-gradient(135deg, #00BCD4 0%, #00838F 100%)",
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
              <FaTag className="me-3" />
              Category Management
            </h2>
            <button
              onClick={generatePDFReport}
              disabled={isGeneratingReport}
              className="btn btn-light"
              style={{
                borderRadius: "8px",
                padding: "10px 15px",
                fontSize: "14px",
                fontWeight: "500",
                display: "flex",
                alignItems: "center",
                gap: "8px",
                boxShadow: "0 2px 5px rgba(0,0,0,0.1)"
              }}
            >
              <FaFilePdf />
              {isGeneratingReport ? "Generating..." : "Export PDF"}
            </button>
          </div>
        </div>

        {/* Hidden report content for PDF generation */}
        <div ref={reportRef} style={{ position: "absolute", left: "-9999px" }}>
          <div style={{ padding: "20px", fontFamily: "Arial" }}>
            <h1 style={{ textAlign: "center", color: "#00838F", marginBottom: "20px" }}>
              Categories Report
            </h1>
            <div style={{
              display: "flex",
              justifyContent: "space-between",
              marginBottom: "20px",
              fontSize: "14px",
              color: "#555"
            }}>
              <div>Generated on: {new Date().toLocaleDateString()}</div>
              <div>Total Categories: {categories.length}</div>
            </div>
            <table style={{
              width: "100%",
              borderCollapse: "collapse",
              marginBottom: "20px"
            }}>
              <thead>
                <tr style={{
                  backgroundColor: "#00BCD4",
                  color: "white",
                  textAlign: "left"
                }}>
                  <th style={{ padding: "10px", border: "1px solid #ddd" }}>No.</th>
                  <th style={{ padding: "10px", border: "1px solid #ddd" }}>Name</th>
                  <th style={{ padding: "10px", border: "1px solid #ddd" }}>Description</th>
                </tr>
              </thead>
              <tbody>
                {categories.map((category, index) => (
                  <tr key={category._id} style={{
                    borderBottom: "1px solid #ddd",
                    backgroundColor: index % 2 === 0 ? "#f9f9f9" : "white"
                  }}>
                    <td style={{ padding: "10px", border: "1px solid #ddd" }}>{index + 1}</td>
                    <td style={{ padding: "10px", border: "1px solid #ddd" }}>{category.name}</td>
                    <td style={{ padding: "10px", border: "1px solid #ddd" }}>{category.description}</td>
                  </tr>
                ))}
              </tbody>
            </table>
            <div style={{
              textAlign: "center",
              marginTop: "30px",
              fontSize: "12px",
              color: "#777"
            }}>
              This report was generated by the Category Management System
            </div>
          </div>
        </div>

        <div className="card-body p-4">
          {/* Search Bar */}
          <div className="mb-4">
            <div className="input-group" style={{
              borderRadius: "8px",
              overflow: "hidden",
              boxShadow: "0 4px 10px rgba(0,0,0,0.05)"
              
            }}>
              <span className="input-group-text" style={{
                backgroundColor: "white",
                borderRight: "none",
                padding: "12px 15px"
              }}>
                <FaSearch style={{ color: "#6c757d" }} />
              </span>
              <input
                type="text"
                className="form-control"
                placeholder="Search categories by name or description..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                style={{
                  borderLeft: "none",
                  padding: "12px 15px",
                  fontSize: "15px",
                  border: "2px solid #e0e0e0"
                }}
              />
              {searchTerm && (
                <button
                  className="btn btn-outline-secondary"
                  type="button"
                  onClick={() => setSearchTerm("")}
                  style={{
                    backgroundColor: "white",
                    borderLeft: "none",
                    border: "2px solid #e0e0e0",
                    height: "40px"
                  }}
                >
                  Clear
                </button>
              )}
            </div>
          </div>

          {/* Add Category Form */}
          <div
            className="card mb-4"
            style={{
              borderRadius: "10px",
              border: "none",
              boxShadow: "0 4px 10px rgba(0,0,0,0.05)"
            }}
          >
            <div className="card-body">
              <form onSubmit={handleAddCategory}>
                <div className="row g-3">
                  <div className="col-md-12 mb-3">
                    <label className="form-label" style={{ fontWeight: "600" }}>Category Name</label>
                    <input
                      type="text"
                      className="form-control"
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
                  <div className="col-md-12 mb-3">
                    <label className="form-label" style={{ fontWeight: "600" }}>Description</label>
                    <textarea
                      className="form-control"
                      value={description}
                      onChange={(e) => setDescription(e.target.value)}
                      required
                      style={{
                        borderRadius: "8px",
                        border: "2px solid #e0e0e0",
                        padding: "10px 15px",
                        fontSize: "15px",
                        minHeight: "100px"
                      }}
                    />
                  </div>
                  <div className="col-12">
                    <button
                      type="submit"
                      className="btn btn-success"
                      style={{
                        borderRadius: "8px",
                        padding: "12px",
                        fontSize: "16px",
                        fontWeight: "600",
                        background: "linear-gradient(135deg, #00BCD4 0%, #00838F 100%)",
                        border: "none",
                        boxShadow: "0 4px 10px rgba(0, 188, 212, 0.3)",
                      }}
                    >
                      Add Category
                    </button>
                  </div>
                </div>
              </form>
            </div>
          </div>

          {/* Category List */}
          <div className="table-responsive" style={{
            borderRadius: "10px",
            overflow: "hidden",
            boxShadow: "0 4px 10px rgba(0,0,0,0.05)"
          }}>
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
                  }}>Description</th>
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
                {filteredCategories.length > 0 ? (
                  filteredCategories.map((category) => (
                    <tr key={category._id} style={{
                      transition: "background-color 0.2s",
                      borderBottom: "1px solid #e9ecef"
                    }}>
                      <td style={{
                        padding: "15px 20px",
                        fontSize: "15px",
                        fontWeight: "500",
                        verticalAlign: "middle"
                      }}>{category.name}</td>
                      <td style={{
                        padding: "15px 20px",
                        fontSize: "15px",
                        verticalAlign: "middle"
                      }}>{category.description}</td>
                      <td style={{
                        padding: "15px 20px",
                        fontSize: "15px",
                        verticalAlign: "middle",
                        textAlign: "center"
                      }}>
                        <button
                          onClick={() => handleEdit(category)}
                          className="btn btn-sm me-2"
                          style={{
                            backgroundColor: "#00BCD4",
                            color: "white",
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
                          onClick={() => handleDelete(category._id)}
                          className="btn btn-sm"
                          style={{
                            backgroundColor: "#E91E63",
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
                    <td colSpan="3" className="text-center py-5" style={{ fontSize: "16px", color: "#6c757d" }}>
                      {searchTerm ? (
                        <>
                          <FaSearch size={40} className="d-block mx-auto mb-3 text-muted" />
                          No categories found matching your search.
                        </>
                      ) : (
                        <>
                          <FaList size={40} className="d-block mx-auto mb-3 text-muted" />
                          No categories found. Add a new category.
                        </>
                      )}
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
                background: "linear-gradient(135deg, #E91E63 0%, #C2185B 100%)",
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
                    background: "rgba(233, 30, 99, 0.1)",
                    borderRadius: "50%",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center"
                  }}>
                    <FaTrashAlt size={30} style={{ color: "#E91E63" }} />
                  </div>
                  <p className="mb-0">Are you sure you want to delete this category?</p>
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
                    background: "linear-gradient(135deg, #E91E63 0%, #C2185B 100%)",
                    border: "none"
                  }}
                >
                  Delete Category
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Edit Category Modal */}
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
                background: "linear-gradient(135deg, #00BCD4 0%, #00838F 100%)",
                borderBottom: "none",
                padding: "20px 25px"
              }}>
                <h5 className="modal-title" style={{
                  color: "white",
                  fontWeight: "600",
                  fontSize: "20px"
                }}>
                  <FaEdit className="me-2" />
                  Edit Category
                </h5>
                <button
                  type="button"
                  className="btn-close"
                  style={{ filter: "brightness(0) invert(1)" }}
                  onClick={() => {
                    setShowEditModal(false);
                    setCategoryToEdit(null);
                    setName("");
                    setDescription("");
                  }}
                ></button>
              </div>
              <div className="modal-body p-4">
                <form onSubmit={handleEditSubmit}>
                  <div className="row g-3">
                    <div className="col-md-12 mb-3">
                      <label className="form-label" style={{ fontWeight: "600" }}>Category Name</label>
                      <input
                        type="text"
                        className="form-control"
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
                    <div className="col-md-12 mb-3">
                      <label className="form-label" style={{ fontWeight: "600" }}>Description</label>
                      <textarea
                        className="form-control"
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        required
                        style={{
                          borderRadius: "8px",
                          border: "2px solid #e0e0e0",
                          padding: "10px 15px",
                          fontSize: "15px",
                          minHeight: "100px"
                        }}
                      />
                    </div>
                  </div>
                </form>
              </div>
              <div className="modal-footer" style={{
                borderTop: "1px solid #f0f0f0",
                padding: "15px"
              }}>
                <button
                  type="button"
                  className="btn btn-outline-secondary"
                  onClick={() => {
                    setShowEditModal(false);
                    setCategoryToEdit(null);
                    setName("");
                    setDescription("");
                  }}
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
                  className="btn btn-primary"
                  onClick={handleEditSubmit}
                  style={{
                    borderRadius: "8px",
                    padding: "10px 18px",
                    fontSize: "14px",
                    fontWeight: "500",
                    background: "linear-gradient(135deg, #00BCD4 0%, #00838F 100%)",
                    border: "none"
                  }}
                >
                  Update Category
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
            <div className="modal-content" style={{
              borderRadius: "15px",
              border: "none",
              overflow: "hidden"
            }}>
              <div className="modal-header" style={{
                background: isSuccessMessage
                  ? "linear-gradient(135deg,rgb(149, 196, 232) 0%,rgb(123, 190, 216) 100%)"
                  : "linear-gradient(135deg, #F44336 0%, #C62828 100%)",
                borderBottom: "none",
                padding: "20px 25px"
              }}>
                <h5 className="modal-title" style={{
                  color: "white",
                  fontWeight: "600",
                  fontSize: "20px"
                }}>
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
                <div style={{
                  width: "70px",
                  height: "70px",
                  margin: "10px auto 20px",
                  background: isSuccessMessage
                    ? "rgba(76, 175, 80, 0.1)"
                    : "rgba(244, 67, 54, 0.1)",
                  borderRadius: "50%",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center"
                }}>
                  {isSuccessMessage ? (
                    <FaCheckCircle size={30} style={{ color: "#4CAF50" }} />
                  ) : (
                    <FaTimesCircle size={30} style={{ color: "#F44336" }} />
                  )}
                </div>
                <p className="mb-0" style={{ fontWeight: "500" }}>
                  {isSuccessMessage ? success : error}
                </p>
              </div>
              <div className="modal-footer" style={{
                borderTop: "1px solid #f0f0f0",
                padding: "15px",
                justifyContent: "center"
              }}>
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
                      ? "linear-gradient(135deg,rgb(76, 175, 165) 0%,rgb(46, 83, 125) 100%)"
                      : "linear-gradient(135deg, #F44336 0%, #C62828 100%)",
                    color: "white",
                    border: "none"
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

export default CategoryPage;