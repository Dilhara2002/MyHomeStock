import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";

const Profile = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [profilePicture, setProfilePicture] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

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
        setError("Error fetching profile");
      }
    };

    fetchProfile();
  }, []);

  // Handle profile update
  const handleUpdate = async (e) => {
    e.preventDefault();

    try {
      const token = localStorage.getItem("token");
      const response = await axios.put(
        "http://localhost:5002/users/profile",
        { name, profilePicture },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      alert("Profile updated successfully");
      setProfilePicture(response.data.profilePicture || "");
    } catch (error) {
      setError("Error updating profile");
    }
  };

  // Handle account deletion
  const handleDeleteAccount = async () => {
    if (window.confirm("Are you sure you want to delete your account? This action cannot be undone.")) {
      try {
        const token = localStorage.getItem("token");
        await axios.delete("http://localhost:5002/users/profile", {
          headers: { Authorization: `Bearer ${token}` },
        });

        localStorage.removeItem("token");
        navigate("/login");
      } catch (error) {
        setError("Error deleting account: " + error.message);
      }
    }
  };

  // Handle sign out
  const handleSignOut = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };

  return (
    <div className="container mt-5">
      <div className="row justify-content-center">
        <div className="col-md-6">
          <div className="card">
            <div className="card-body">
              <h2 className="card-title text-center">Profile</h2>
              {error && <div className="alert alert-danger">{error}</div>}

              {/* Profile Picture */}
              <div className="text-center mb-4">
                {profilePicture ? (
                  <img
                    src={profilePicture}
                    alt="Profile"
                    className="rounded-circle"
                    style={{ width: "100px", height: "100px", objectFit: "cover" }}
                  />
                ) : (
                  <i className="fas fa-user-circle" style={{ fontSize: "100px", color: "#ccc" }}></i>
                )}
              </div>

              {/* Profile Form */}
              <form onSubmit={handleUpdate}>
                <div className="mb-3">
                  <label htmlFor="name" className="form-label">
                    Name
                  </label>
                  <input
                    type="text"
                    className="form-control"
                    id="name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                  />
                </div>
                <div className="mb-3">
                  <label htmlFor="email" className="form-label">
                    Email
                  </label>
                  <input
                    type="email"
                    className="form-control"
                    id="email"
                    value={email}
                    disabled
                  />
                </div>
                <div className="mb-3">
                  <label htmlFor="profilePicture" className="form-label">
                    Profile Picture URL
                  </label>
                  <input
                    type="text"
                    className="form-control"
                    id="profilePicture"
                    value={profilePicture}
                    onChange={(e) => setProfilePicture(e.target.value)}
                  />
                </div>
                <button type="submit" className="btn btn-primary w-100">
                  Update Profile
                </button>
              </form>

              {/* Delete Account and Sign Out Buttons */}
              <div className="mt-4">
                <button
                  onClick={handleDeleteAccount}
                  className="btn btn-danger w-100 mb-2"
                >
                  Delete Account
                </button>
                <button
                  onClick={handleSignOut}
                  className="btn btn-secondary w-100"
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