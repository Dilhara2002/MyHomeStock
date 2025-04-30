import React, { useState, useEffect, useCallback } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUser, faEdit, faTrash, faSignOutAlt } from "@fortawesome/free-solid-svg-icons";

const Profile = () => {
  const [profileData, setProfileData] = useState({
    name: "",
    email: "",
  });
  const [imagePreview, setImagePreview] = useState(null);
  const [selectedFile, setSelectedFile] = useState(null);
  const [state, setState] = useState({
    error: "",
    success: "",
    isLoading: false,
  });

  const navigate = useNavigate();

  const fetchProfile = useCallback(async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) return navigate("/login");

      // Get name and email
      const response = await axios.get("http://localhost:5002/users/profile", {
        headers: { Authorization: `Bearer ${token}` },
      });

      setProfileData({
        name: response.data.name,
        email: response.data.email,
      });

      // Get profile picture
      const imageRes = await fetch("http://localhost:5002/users/profile/image", {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (imageRes.ok) {
        const blob = await imageRes.blob();
        setImagePreview(URL.createObjectURL(blob));
      }
    } catch (error) {
      setState((prev) => ({
        ...prev,
        error: "Failed to load profile. Please try again.",
      }));
    }
  }, [navigate]);

  useEffect(() => {
    fetchProfile();
  }, [fetchProfile]);

  const handleFileSelect = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (file.size > 2 * 1024 * 1024) {
      setState((prev) => ({ ...prev, error: "File must be less than 2MB" }));
      return;
    }

    if (!file.type.match(/image\/(jpeg|png|webp)/)) {
      setState((prev) => ({ ...prev, error: "Only JPG, PNG, or WebP allowed" }));
      return;
    }

    setSelectedFile(file);
    const reader = new FileReader();
    reader.onloadend = () => setImagePreview(reader.result);
    reader.readAsDataURL(file);
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    setState({ ...state, error: "", success: "", isLoading: true });

    try {
      const token = localStorage.getItem("token");
      const formData = new FormData();

      formData.append("name", profileData.name);
      if (selectedFile) formData.append("profilePicture", selectedFile);

      await axios.put("http://localhost:5002/users/profile/image", formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data",
        },
      });

      setState({ ...state, success: "Profile updated!", isLoading: false });
      setSelectedFile(null);
      fetchProfile(); // refresh image after update
    } catch (error) {
      setState({
        ...state,
        error: error.response?.data?.message || "Update failed",
        isLoading: false,
      });
    }
  };

  const handleSignOut = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };

  return (
    <div 
      className="container-fluid py-5" 
      style={{
        minHeight: "100vh",
        background: "linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)"
      }}
    >
      <div className="row justify-content-center">
        <div className="col-md-8 col-lg-6">
          <div 
            className="card shadow-lg border-0" 
            style={{
              borderRadius: "15px",
              overflow: "hidden"
            }}
          >
            <div 
              className="card-header py-4" 
              style={{
                background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
                color: "white"
              }}
            >
              <h2 className="mb-0 text-center">My Profile</h2>
            </div>

            <div className="card-body p-4 p-md-5">
              {/* Profile Picture */}
              <div className="text-center mb-4">
                <div 
                  style={{
                    width: "130px",
                    height: "130px",
                    borderRadius: "50%",
                    overflow: "hidden",
                    margin: "-75px auto 20px",
                    border: "5px solid white",
                    boxShadow: "0 5px 15px rgba(0,0,0,0.1)",
                    backgroundColor: "#e9ecef"
                  }}
                >
                  {imagePreview ? (
                    <img
                      src={imagePreview}
                      alt="Profile"
                      style={{
                        width: "100%",
                        height: "100%",
                        objectFit: "cover"
                      }}
                    />
                  ) : (
                    <FontAwesomeIcon 
                      icon={faUser} 
                      style={{
                        fontSize: "60px",
                        color: "#adb5bd",
                        marginTop: "30px"
                      }}
                    />
                  )}
                </div>
              </div>

              {/* Alerts */}
              {state.error && (
                <div className="alert alert-danger alert-dismissible fade show">
                  {state.error}
                  <button 
                    type="button" 
                    className="btn-close" 
                    onClick={() => setState(prev => ({ ...prev, error: "" }))}
                  />
                </div>
              )}
              {state.success && (
                <div className="alert alert-success alert-dismissible fade show">
                  {state.success}
                  <button 
                    type="button" 
                    className="btn-close" 
                    onClick={() => setState(prev => ({ ...prev, success: "" }))}
                  />
                </div>
              )}

              {/* Form */}
              <form onSubmit={handleUpdate}>
                <div className="mb-4">
                  <label className="form-label fw-semibold">Full Name</label>
                  <input
                    type="text"
                    className="form-control py-3"
                    value={profileData.name}
                    onChange={(e) =>
                      setProfileData((prev) => ({ ...prev, name: e.target.value }))
                    }
                    required
                    style={{
                      borderRadius: "8px",
                      border: "1px solid #ced4da"
                    }}
                  />
                </div>

                <div className="mb-4">
                  <label className="form-label fw-semibold">Email</label>
                  <input
                    type="email"
                    className="form-control py-3"
                    value={profileData.email}
                    disabled
                    style={{
                      borderRadius: "8px",
                      border: "1px solid #ced4da",
                      backgroundColor: "#f8f9fa"
                    }}
                  />
                  <small className="text-muted">Email address cannot be changed</small>
                </div>

                <div className="mb-4">
                  <label className="form-label fw-semibold">Profile Picture</label>
                  <input
                    type="file"
                    className="form-control py-2"
                    accept="image/*"
                    onChange={handleFileSelect}
                    style={{
                      borderRadius: "8px",
                      border: "1px solid #ced4da"
                    }}
                  />
                  <small className="text-muted">Max 2MB. JPG, PNG, WebP</small>
                </div>

                <button
                  type="submit"
                  className="btn btn-primary w-100 py-3 fw-semibold"
                  disabled={state.isLoading}
                  style={{
                    background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
                    border: "none",
                    borderRadius: "8px",
                    boxShadow: "0 5px 15px rgba(102, 126, 234, 0.4)",
                    marginBottom: "20px"
                  }}
                >
                  {state.isLoading ? (
                    <>
                      <span className="spinner-border spinner-border-sm me-2" />
                      Updating...
                    </>
                  ) : (
                    <>
                      <FontAwesomeIcon icon={faEdit} className="me-2" />
                      Update Profile
                    </>
                  )}
                </button>
              </form>

              <hr className="my-4" />

              {/* Sign Out */}
              <button 
                onClick={handleSignOut} 
                className="btn btn-secondary w-100 py-3 fw-semibold"
                style={{
                  borderRadius: "8px",
                  border: "none"
                }}
              >
                <FontAwesomeIcon icon={faSignOutAlt} className="me-2" />
                Sign Out
              </button>
            </div>
          </div>

          <div className="text-center mt-4 text-muted">
            <small>&copy; {new Date().getFullYear()} Your App Name</small>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;