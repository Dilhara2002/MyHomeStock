import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap-icons/font/bootstrap-icons.css";
import {
  FaUserShield,
  FaSignOutAlt,
  FaTrashAlt,
  FaExclamationTriangle,
  FaCheckCircle,
  FaTimesCircle,
  FaSpinner
} from "react-icons/fa";

const AdminDashboard = () => {
  const [users, setUsers] = useState([]);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(true);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showMessageModal, setShowMessageModal] = useState(false);
  const [isSuccessMessage, setIsSuccessMessage] = useState(false);
  const [userToDelete, setUserToDelete] = useState(null);
  const navigate = useNavigate();

  // Message helpers
  const showError = (message) => {
    setError(message);
    setIsSuccessMessage(false);
    setShowMessageModal(true);
    setTimeout(() => setShowMessageModal(false), 5000);
  };

  const showSuccess = (message) => {
    setSuccess(message);
    setIsSuccessMessage(true);
    setShowMessageModal(true);
    setTimeout(() => setShowMessageModal(false), 5000);
  };

  // Fetch all users
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        setLoading(true);
        const token = localStorage.getItem("token");
        if (!token) {
          navigate("/login");
          return;
        }
        const response = await axios.get("http://localhost:5002/admin/users", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setUsers(response.data);
      } catch (error) {
        if (error.response?.status === 401) {
          navigate("/login");
        } else {
          showError("Error fetching users");
          console.error("Error fetching users:", error);
        }
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, [navigate]);

  // Delete a user
  const handleDeleteUser = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        navigate("/login");
        return;
      }
      await axios.delete(`http://localhost:5002/admin/users/${userToDelete}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setUsers(users.filter((user) => user._id !== userToDelete));
      setShowDeleteModal(false);
      showSuccess("User deleted successfully");
    } catch (error) {
      if (error.response?.status === 401) {
        navigate("/login");
      } else {
        showError("Error deleting user");
        console.error("Error deleting user:", error);
      }
    }
  };

  // Update a user's role
  const handleUpdateRole = async (userId, newRole) => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        navigate("/login");
        return;
      }
      await axios.put(
        `http://localhost:5002/admin/users/${userId}/role`,
        { role: newRole },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      // Update the user's role in the local state
      setUsers(
        users.map((user) =>
          user._id === userId ? { ...user, role: newRole } : user
        )
      );
      showSuccess("User role updated successfully");
    } catch (error) {
      if (error.response?.status === 401) {
        navigate("/login");
      } else {
        showError("Error updating user role");
        console.error("Error updating role:", error);
      }
    }
  };

  // Handle sign out
  const handleSignOut = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };

  // Confirm delete action
  const confirmDelete = (userId) => {
    setUserToDelete(userId);
    setShowDeleteModal(true);
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
              <FaUserShield className="me-3" />
              User Management
            </h2>
            <button 
              onClick={handleSignOut} 
              className="btn"
              style={{ 
                padding: "0.6rem 1.4rem",
                borderRadius: "8px",
                backgroundColor: "rgba(255,255,255,0.2)",
                color: "white",
                fontWeight: "500",
                border: "none",
                transition: "all 0.2s ease"
              }}
            >
              <FaSignOutAlt className="me-2" />
              Sign Out
            </button>
          </div>
        </div>

        <div className="card-body p-4">
          {loading ? (
            <div className="text-center my-5 py-5">
              <div className="spinner-border text-primary" role="status" style={{ width: "3rem", height: "3rem" }}>
                <span className="visually-hidden">Loading...</span>
              </div>
              <p className="mt-3" style={{ fontSize: "18px", color: "#6c757d" }}>Loading users...</p>
            </div>
          ) : (
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
                    }}>Email</th>
                    <th scope="col" style={{
                      padding: "15px 20px",
                      fontSize: "15px",
                      fontWeight: "600",
                      color: "#495057"
                    }}>Role</th>
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
                  {users.length === 0 ? (
                    <tr>
                      <td colSpan="4" className="text-center py-5" style={{ fontSize: "16px", color: "#6c757d" }}>
                        <FaUserShield size={40} className="d-block mx-auto mb-3 text-muted" />
                        No users found
                      </td>
                    </tr>
                  ) : (
                    users.map((user) => (
                      <tr key={user._id} style={{
                        transition: "background-color 0.2s",
                        borderBottom: "1px solid #e9ecef"
                      }}>
                        <td style={{
                          padding: "15px 20px",
                          fontSize: "15px",
                          fontWeight: "500",
                          verticalAlign: "middle"
                        }}>{user.name}</td>
                        <td style={{
                          padding: "15px 20px",
                          fontSize: "15px",
                          verticalAlign: "middle"
                        }}>{user.email}</td>
                        <td style={{
                          padding: "15px 20px",
                          fontSize: "15px",
                          verticalAlign: "middle"
                        }}>
                          <select
                            value={user.role}
                            onChange={(e) => handleUpdateRole(user._id, e.target.value)}
                            className="form-select"
                            style={{
                              borderRadius: "8px",
                              border: "2px solid #e0e0e0",
                              padding: "8px 12px",
                              fontSize: "14px",
                              maxWidth: "150px"
                            }}
                          >
                            <option value="user">User</option>
                            <option value="admin">Admin</option>
                          </select>
                        </td>
                        <td style={{
                          padding: "15px 20px",
                          fontSize: "15px",
                          verticalAlign: "middle",
                          textAlign: "center"
                        }}>
                          <button
                            onClick={() => confirmDelete(user._id)}
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
                  )}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      {showDeleteModal && (
        <div className="modal fade show" style={{
          display: "block",
          backgroundColor: "rgba(0, 0, 0, 0.6)",
          position: "fixed",
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          zIndex: 1050,
        }}>
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
                  <p className="mb-0">Are you sure you want to delete this user?</p>
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
                  onClick={handleDeleteUser}
                  style={{
                    borderRadius: "8px",
                    padding: "10px 18px",
                    fontSize: "14px",
                    fontWeight: "500",
                    background: "linear-gradient(135deg, #E91E63 0%, #C2185B 100%)",
                    border: "none"
                  }}
                >
                  Delete User
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Message Modal (Success/Error) */}
      {showMessageModal && (
        <div className="modal fade show" style={{
          display: "block",
          backgroundColor: "rgba(0, 0, 0, 0.6)",
          position: "fixed",
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          zIndex: 1050,
        }}>
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content" style={{
              borderRadius: "15px",
              border: "none",
              overflow: "hidden"
            }}>
              <div className="modal-header" style={{
                background: isSuccessMessage
                  ? "linear-gradient(135deg, #4CAF50 0%, #2E7D32 100%)"
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
                      ? "linear-gradient(135deg, #4CAF50 0%, #2E7D32 100%)"
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

export default AdminDashboard;