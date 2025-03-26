import React, { useState } from "react";
import axios from "axios";
import { useNavigate, Link } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";

const Signup = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.post("http://localhost:5002/users/signup", {
        name,
        email,
        password,
      });

      // Save token to localStorage
      localStorage.setItem("token", response.data.token);

      // Redirect to dashboard
      navigate("/login");
    } catch (error) {
      setError("Error creating account");
    }
  };

  return (
    <div className="container mt-5">
      <div className="row justify-content-center">
        <div className="col-md-6">
          <div className="card" style={{ boxShadow: "0 4px 8px rgba(0,0,0,0.1)", borderRadius: "8px" }}>
            <div className="card-body" style={{ padding: "2rem" }}>
              <h2 className="card-title text-center mb-4" style={{ color: "#3a5a97", fontWeight: "600" }}>Create Account</h2>
              
              {error && <div className="alert alert-danger">{error}</div>}
              
              <form onSubmit={handleSubmit}>
                <div className="mb-3">
                  <label htmlFor="name" className="form-label" style={{ fontWeight: "500" }}>
                    Full Name
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
                    Email Address
                  </label>
                  <input
                    type="email"
                    className="form-control"
                    id="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    style={{ padding: "0.6rem", borderRadius: "6px" }}
                  />
                </div>
                
                <div className="mb-3">
                  <label htmlFor="password" className="form-label" style={{ fontWeight: "500" }}>
                    Password
                  </label>
                  <input
                    type="password"
                    className="form-control"
                    id="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    style={{ padding: "0.6rem", borderRadius: "6px" }}
                  />
                </div>
                
                <button 
                  type="submit" 
                  className="btn btn-primary w-100 mt-4"
                  style={{ 
                    padding: "0.7rem", 
                    borderRadius: "6px", 
                    backgroundColor: "#4a6fdc", 
                    borderColor: "#4a6fdc",
                    fontWeight: "500",
                    fontSize: "1.05rem" 
                  }}
                >
                  Sign Up
                </button>
              </form>
              
              <p className="text-center mt-4" style={{ color: "#6c757d" }}>
                Already have an account? <Link to="/login" style={{ color: "#4a6fdc", textDecoration: "none", fontWeight: "500" }}>Login</Link>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Signup;