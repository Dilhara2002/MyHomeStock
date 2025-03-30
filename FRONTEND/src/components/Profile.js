import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUser, faEdit, faTrash, faSignOutAlt } from "@fortawesome/free-solid-svg-icons";

const Profile = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [profilePicture, setProfilePicture] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const navigate = useNavigate();

  // Custom styles (keeping all styles intact)
  const styles = {
    profileContainer: {
      backgroundColor: "#f8f9fa",
      minHeight: "100vh",
      padding: "40px 0",
      backgroundImage: "linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)",
    },
    card: {
      borderRadius: "15px",
      border: "none",
      boxShadow: "0 10px 20px rgba(0,0,0,0.1)",
      overflow: "hidden",
    },
    cardHeader: {
      background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
      color: "white",
      padding: "25px 0",
      borderRadius: "15px 15px 0 0",
    },
    cardBody: {
      padding: "30px",
    },
    profilePicContainer: {
      position: "relative",
      margin: "-65px auto 20px",
      width: "130px",
      height: "130px",
      borderRadius: "50%",
      overflow: "hidden",
      boxShadow: "0 5px 15px rgba(0,0,0,0.2)",
      border: "5px solid white",
      backgroundColor: "#e9ecef",
    },
    profilePic: {
      width: "100%",
      height: "100%",
      objectFit: "cover",
    },
    defaultProfileIcon: {
      fontSize: "60px",
      color: "#adb5bd",
      marginTop: "25px",
    },
    formLabel: {
      fontWeight: "600",
      color: "#495057",
      fontSize: "14px",
      marginBottom: "8px",
    },
    formControl: {
      borderRadius: "8px",
      padding: "12px 15px",
      border: "1px solid #ced4da",
      transition: "all 0.3s ease",
    },
    primaryBtn: {
      backgroundImage: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
      border: "none",
      borderRadius: "8px",
      padding: "12px 25px",
      fontWeight: "600",
      transition: "all 0.3s ease",
      boxShadow: "0 5px 15px rgba(102, 126, 234, 0.4)",
    },
    dangerBtn: {
      backgroundColor: "#ff6b6b",
      border: "none",
      borderRadius: "8px",
      padding: "12px 0",
      fontWeight: "600",
      transition: "all 0.3s ease",
      boxShadow: "0 5px 15px rgba(255, 107, 107, 0.4)",
    },
    secondaryBtn: {
      backgroundColor: "#6c757d",
      border: "none",
      borderRadius: "8px",
      padding: "12px 0",
      fontWeight: "600",
      transition: "all 0.3s ease",
    },
    divider: {
      margin: "30px 0",
      borderTop: "1px solid #dee2e6",
    }
  };

  // Fetch user profile data
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const token = localStorage.getItem("token");
        const response = await axios.get("http://localhost:5002/users/profile", {
          headers: { Authorization: `Bearer ${token}` },
        });

        const { name, email, profilePicture } = response.data;
        setName(name);
        setEmail(email);
        setProfilePicture(profilePicture || "");
      } catch (error) {
        setError("Failed to load profile information. Please try again later.");
      }
    };

    fetchProfile();
  }, []);

  // Handle profile update
  const handleUpdate = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    try {
      const token = localStorage.getItem("token");
      const response = await axios.put(
        "http://localhost:5002/users/profile",
        { name, profilePicture },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      setSuccess("Profile updated successfully!");
      setProfilePicture(response.data.profilePicture || "");
      
      // Clear success message after 3 seconds
      setTimeout(() => setSuccess(""), 3000);
    } catch (error) {
      setError("Failed to update profile. Please try again.");
    }
  };

  /* Commented out account deletion functionality but keeping the styles
  // Handle account deletion
  const handleDeleteAccount = async () => {
    if (window.confirm("Are you sure you want to delete your account? This action cannot be undone.")) {
      try {
        const token = localStorage.getItem("token");
        await axios.delete(`http://localhost:5002/users/${email}`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        localStorage.removeItem("token");
        navigate("/login");
      } catch (error) {
        setError("Error deleting account: " + error.message);
      }
    }
  };
  */

  // Handle sign out
  const handleSignOut = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };

  return (
    <div style={styles.profileContainer}>
      <div className="container">
        <div className="row justify-content-center">
          <div className="col-md-8 col-lg-6">
            <div className="card" style={styles.card}>
              <div className="text-center" style={styles.cardHeader}>
                <h1 className="mb-0">My Profile</h1>
              </div>
              
              <div className="card-body" style={styles.cardBody}>
                {/* Profile Picture */}
                <div className="text-center">
                  <div style={styles.profilePicContainer}>
                    {profilePicture ? (
                      <img
                        src={profilePicture}
                        alt="Profile"
                        style={styles.profilePic}
                      />
                    ) : (
                      <FontAwesomeIcon icon={faUser} style={styles.defaultProfileIcon} />
                    )}
                  </div>
                </div>
                
                {/* Alerts */}
                {error && (
                  <div className="alert alert-danger alert-dismissible fade show" role="alert">
                    {error}
                    <button type="button" className="btn-close" onClick={() => setError("")}></button>
                  </div>
                )}
                
                {success && (
                  <div className="alert alert-success alert-dismissible fade show" role="alert">
                    {success}
                    <button type="button" className="btn-close" onClick={() => setSuccess("")}></button>
                  </div>
                )}

                {/* Profile Form */}
                <form onSubmit={handleUpdate} className="mt-4">
                  <div className="mb-4">
                    <label htmlFor="name" style={styles.formLabel}>
                      Full Name
                    </label>
                    <input
                      type="text"
                      className="form-control"
                      id="name"
                      style={styles.formControl}
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      required
                      placeholder="Enter your full name"
                    />
                  </div>
                  
                  <div className="mb-4">
                    <label htmlFor="email" style={styles.formLabel}>
                      Email Address
                    </label>
                    <input
                      type="email"
                      className="form-control"
                      id="email"
                      style={{...styles.formControl, backgroundColor: "#f8f9fa"}}
                      value={email}
                      readOnly
                      disabled
                    />
                    <small className="text-muted">Email address cannot be changed</small>
                  </div>
                  
                  <div className="mb-4">
                    <label htmlFor="profilePicture" style={styles.formLabel}>
                      Profile Picture URL
                    </label>
                    <input
                      type="text"
                      className="form-control"
                      id="profilePicture"
                      style={styles.formControl}
                      value={profilePicture}
                      onChange={(e) => setProfilePicture(e.target.value)}
                      placeholder="https://example.com/profile-picture.jpg"
                    />
                    <small className="text-muted">Enter a valid image URL for your profile picture</small>
                  </div>
                  
                  <div className="d-grid">
                    <button 
                      type="submit" 
                      className="btn btn-primary" 
                      style={styles.primaryBtn}
                    >
                      <FontAwesomeIcon icon={faEdit} className="me-2" />
                      Update Profile
                    </button>
                  </div>
                </form>

                <hr style={styles.divider} />

                {/* Account Actions */}
                <div className="d-grid gap-3">
                  {/* Keeping the button structure but disabling it */}
                  <button 
                    className="btn btn-danger" 
                    style={styles.dangerBtn}
                    disabled
                    title="Account deletion is currently disabled"
                  >
                    <FontAwesomeIcon icon={faTrash} className="me-2" />
                    Delete Account (Disabled)
                  </button>
                  
                  <button 
                    onClick={handleSignOut} 
                    className="btn btn-secondary" 
                    style={styles.secondaryBtn}
                  >
                    <FontAwesomeIcon icon={faSignOutAlt} className="me-2" />
                    Sign Out
                  </button>
                </div>
              </div>
            </div>
            
            <div className="text-center mt-4 text-muted">
              <small>&copy; {new Date().getFullYear()} Your Application Name. All rights reserved.</small>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;