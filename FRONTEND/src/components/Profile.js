import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";

const Profile = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [profilePicture, setProfilePicture] = useState(null); // store file object
  const [preview, setPreview] = useState(""); // for image preview
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const navigate = useNavigate();

  // Fetch user profile data when the component mounts
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

        // If profilePicture is available, set the preview URL
        setPreview(profilePicture || ""); 
      } catch (error) {
        setError("Error fetching profile");
      }
    };

    fetchProfile();
  }, []);

  // Handle profile update with image upload
  const handleUpdate = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    const formData = new FormData();
    formData.append("name", name);
    if (profilePicture) {
      formData.append("profilePicture", profilePicture); // Add the image file to the form data
    }

    try {
      const token = localStorage.getItem("token");
      const response = await axios.put(
        "http://localhost:5002/users/profile",
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "multipart/form-data", // Set content type for file upload
          },
        }
      );

      setSuccess("Profile updated successfully");
      setPreview(response.data.profilePicture);  // Get the image URL returned by the backend
    } catch (error) {
      setError("Error updating profile");
    }
  };

  // Handle sign out
  const handleSignOut = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };

  // Handle file input change for profile picture
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    setProfilePicture(file);

    // Preview the selected image
    const reader = new FileReader();
    reader.onloadend = () => {
      setPreview(reader.result); // Set the preview image from file
    };
    reader.readAsDataURL(file); // Read file as data URL for preview
  };

  return (
    <div className="container mt-5">
      <div className="row justify-content-center">
        <div className="col-md-6">
          <div className="card" style={{ boxShadow: "0 4px 8px rgba(0,0,0,0.1)", borderRadius: "8px" }}>
            <div className="card-body" style={{ padding: "2rem" }}>
              <h2 className="card-title text-center mb-4" style={{ color: "#3a5a97", fontWeight: "600" }}>My Profile</h2>
              
              {error && <div className="alert alert-danger">{error}</div>}
              {success && <div className="alert alert-success">{success}</div>}

              {/* Profile Picture */}
              <div className="text-center mb-4">
                <div style={{ position: "relative", display: "inline-block" }}>
                  {preview ? (
                    <img
                      src={preview}
                      alt="Profile"
                      className="rounded-circle"
                      style={{ 
                        width: "120px", 
                        height: "120px", 
                        objectFit: "cover",
                        border: "3px solid #4a6fdc",
                        boxShadow: "0 2px 10px rgba(0,0,0,0.1)"
                      }}
                    />
                  ) : (
                    <div 
                      className="rounded-circle d-flex align-items-center justify-content-center bg-light" 
                      style={{ 
                        width: "120px", 
                        height: "120px",
                        border: "3px solid #e1e1e1",
                        boxShadow: "0 2px 10px rgba(0,0,0,0.1)"
                      }}
                    >
                      <i className="fas fa-user" style={{ fontSize: "50px", color: "#adb5bd" }}></i>
                    </div>
                  )}
                </div>
              </div>

              {/* Profile Form */}
              <form onSubmit={handleUpdate}>
                <div className="mb-3">
                  <label htmlFor="name" className="form-label" style={{ fontWeight: "500" }}>
                    Name
                  </label>
                  <input
                    type="text"
                    className="form-control"
                    id="name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                    style={{ padding: "0.6rem", borderRadius: "6px" }}
                  />
                </div>
                <div className="mb-3">
                  <label htmlFor="email" className="form-label" style={{ fontWeight: "500" }}>
                    Email
                  </label>
                  <input
                    type="email"
                    className="form-control"
                    id="email"
                    value={email}
                    disabled
                    style={{ 
                      padding: "0.6rem", 
                      borderRadius: "6px",
                      backgroundColor: "#f8f9fa"
                    }}
                  />
                </div>
                <div className="mb-4">
                  <label htmlFor="profilePicture" className="form-label" style={{ fontWeight: "500" }}>
                    Profile Picture
                  </label>
                  <div className="input-group">
                    <input
                      type="file"
                      className="form-control"
                      id="profilePicture"
                      onChange={handleFileChange}
                      accept="image/*"
                      style={{ borderRadius: "6px" }}
                    />
                  </div>
                  <small className="form-text text-muted mt-1">
                    Upload a square image for best results
                  </small>
                </div>
                
                <button 
                  type="submit" 
                  className="btn btn-primary w-100"
                  style={{ 
                    padding: "0.7rem", 
                    borderRadius: "6px", 
                    backgroundColor: "#4a6fdc", 
                    borderColor: "#4a6fdc",
                    fontWeight: "500",
                    fontSize: "1.05rem" 
                  }}
                >
                  Update Profile
                </button>
              </form>

              {/* Sign Out Button */}
              <div className="mt-4 pt-3" style={{ borderTop: "1px solid #e9ecef" }}>
                <button
                  onClick={handleSignOut}
                  className="btn w-100"
                  style={{ 
                    padding: "0.7rem", 
                    borderRadius: "6px",
                    backgroundColor: "#f1f3f5",
                    color: "#495057",
                    fontWeight: "500" 
                  }}
                >
                  Sign Out
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;