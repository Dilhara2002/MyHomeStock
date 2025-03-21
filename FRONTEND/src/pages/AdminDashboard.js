import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";

const AdminDashboard = () => {
  const [users, setUsers] = useState([]);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  // Fetch all users
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        setLoading(true);
        const token = localStorage.getItem("token");
        const response = await axios.get("http://localhost:5002/admin/users", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setUsers(response.data);
        setLoading(false);
      } catch (error) {
        setError("Error fetching users");
        console.error("Error fetching users:", error);
        setLoading(false);
      }
    };

    fetchUsers();
  }, []);

  // Delete a user
  const handleDeleteUser = async (userId) => {
    if (window.confirm("Are you sure you want to delete this user?")) {
      try {
        setSuccess("");
        setError("");
        const token = localStorage.getItem("token");
        await axios.delete(`http://localhost:5002/admin/users/${userId}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setUsers(users.filter((user) => user._id !== userId));
        setSuccess("User deleted successfully");
      } catch (error) {
        setError("Error deleting user");
        console.error("Error deleting user:", error);
      }
    }
  };

  // Update a user's role
  const handleUpdateRole = async (userId, newRole) => {
    try {
      setSuccess("");
      setError("");
      const token = localStorage.getItem("token");
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
      setSuccess("Role updated successfully");
    } catch (error) {
      setError("Error updating role");
      console.error("Error updating role:", error);
    }
  };

  // Handle sign out
  const handleSignOut = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };

  return (
    <div className="container mt-5">
      <div className="card" style={{ boxShadow: "0 4px 8px rgba(0,0,0,0.1)", borderRadius: "8px" }}>
        <div className="card-body" style={{ padding: "2rem" }}>
          <div className="d-flex justify-content-between align-items-center mb-4">
            <h2 style={{ color: "#3a5a97", fontWeight: "600" }}>Admin Dashboard</h2>
            <button 
              onClick={handleSignOut} 
              className="btn"
              style={{ 
                padding: "0.5rem 1.2rem", 
                borderRadius: "6px",
                backgroundColor: "#f1f3f5",
                color: "#495057",
                fontWeight: "500" 
              }}
            >
              Sign Out
            </button>
          </div>

          {error && <div className="alert alert-danger">{error}</div>}
          {success && <div className="alert alert-success">{success}</div>}

          {loading ? (
            <div className="text-center my-5">
              <div className="spinner-border text-primary" role="status">
                <span className="visually-hidden">Loading...</span>
              </div>
              <p className="mt-2">Loading users...</p>
            </div>
          ) : (
            <div className="table-responsive">
              <table className="table" style={{ borderCollapse: "separate", borderSpacing: "0 5px" }}>
                <thead>
                  <tr style={{ backgroundColor: "#f8f9fa" }}>
                    <th scope="col" style={{ padding: "12px 16px", borderBottom: "2px solid #e9ecef" }}>Name</th>
                    <th scope="col" style={{ padding: "12px 16px", borderBottom: "2px solid #e9ecef" }}>Email</th>
                    <th scope="col" style={{ padding: "12px 16px", borderBottom: "2px solid #e9ecef" }}>Role</th>
                    <th scope="col" style={{ padding: "12px 16px", borderBottom: "2px solid #e9ecef" }}>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {users.length === 0 ? (
                    <tr>
                      <td colSpan="4" className="text-center py-4">No users found</td>
                    </tr>
                  ) : (
                    users.map((user) => (
                      <tr key={user._id} style={{ borderRadius: "6px", boxShadow: "0 1px 3px rgba(0,0,0,0.05)" }}>
                        <td style={{ padding: "12px 16px" }}>{user.name}</td>
                        <td style={{ padding: "12px 16px" }}>{user.email}</td>
                        <td style={{ padding: "12px 16px" }}>
                          <select
                            value={user.role}
                            onChange={(e) => handleUpdateRole(user._id, e.target.value)}
                            className="form-select"
                            style={{ borderRadius: "6px", padding: "0.4rem" }}
                          >
                            <option value="user">User</option>
                            <option value="admin">Admin</option>
                          </select>
                        </td>
                        <td style={{ padding: "12px 16px" }}>
                          <button
                            onClick={() => handleDeleteUser(user._id)}
                            className="btn btn-sm"
                            style={{ 
                              backgroundColor: "#fff0f0", 
                              color: "#dc3545", 
                              borderColor: "#ffcccc",
                              fontWeight: "500",
                              borderRadius: "6px"
                            }}
                          >
                            Delete
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
    </div>
  );
};

export default AdminDashboard;