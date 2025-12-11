import React, { useState } from "react";
import axios from "axios";
import { useNavigate, Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { User, Mail, Lock, UserPlus, AlertCircle, ArrowRight } from "lucide-react";

const Signup = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    try {
      const response = await axios.post("http://localhost:5002/users/signup", {
        name,
        email,
        password,
      });

      // Save token if returned, or just redirect
      if (response.data.token) {
        localStorage.setItem("token", response.data.token);
      }

      // Redirect to login or dashboard
      navigate("/login");
    } catch (error) {
      setError(error.response?.data?.message || "Error creating account. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  // --- Styles ---
  const inputContainerStyle = {
    position: 'relative',
    marginBottom: '20px'
  };

  const iconStyle = {
    position: 'absolute',
    top: '50%',
    left: '15px',
    transform: 'translateY(-50%)',
    color: '#94a3b8',
    pointerEvents: 'none'
  };

  const inputStyle = {
    width: '100%',
    padding: '14px 15px 14px 45px', // Padding left for icon
    borderRadius: '12px',
    background: 'rgba(15, 23, 42, 0.6)',
    border: '1px solid rgba(255, 255, 255, 0.1)',
    color: 'white',
    fontSize: '1rem',
    outline: 'none',
    transition: 'all 0.3s ease'
  };

  return (
    <div style={{
      minHeight: '100vh',
      backgroundColor: '#0f172a',
      color: '#f8fafc',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      fontFamily: '"Inter", sans-serif',
      position: 'relative',
      overflow: 'hidden'
    }}>
      
      {/* CSS Overrides for Autofill & Focus */}
      <style>{`
        input:focus {
          border-color: #06b6d4 !important;
          box-shadow: 0 0 0 4px rgba(6, 182, 212, 0.15) !important;
        }
        /* Fix browser autofill background color */
        input:-webkit-autofill,
        input:-webkit-autofill:hover, 
        input:-webkit-autofill:focus, 
        input:-webkit-autofill:active{
            -webkit-box-shadow: 0 0 0 30px #0f172a inset !important;
            -webkit-text-fill-color: white !important;
            transition: background-color 5000s ease-in-out 0s;
        }
      `}</style>

      {/* Background Glows */}
      <div style={{ position: 'absolute', top: '-10%', right: '50%', transform: 'translateX(50%)', width: '600px', height: '600px', background: 'radial-gradient(circle, rgba(139, 92, 246, 0.15) 0%, rgba(15, 23, 42, 0) 70%)', zIndex: 0 }} />
      <div style={{ position: 'absolute', bottom: '-10%', left: '10%', width: '400px', height: '400px', background: 'radial-gradient(circle, rgba(6, 182, 212, 0.1) 0%, rgba(15, 23, 42, 0) 70%)', zIndex: 0 }} />

      <div className="container" style={{ position: 'relative', zIndex: 1 }}>
        <div className="row justify-content-center">
          <div className="col-md-6 col-lg-5 col-xl-4">
            
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="card border-0 shadow-lg"
              style={{
                backgroundColor: 'rgba(30, 41, 59, 0.7)',
                backdropFilter: 'blur(12px)',
                borderRadius: '24px',
                border: '1px solid rgba(255, 255, 255, 0.08)',
                padding: '10px'
              }}
            >
              <div className="card-body p-4">
                
                {/* Header */}
                <div className="text-center mb-5">
                  <div style={{ 
                    width: '60px', height: '60px', borderRadius: '16px', 
                    background: 'linear-gradient(135deg, #06b6d4 0%, #3b82f6 100%)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    margin: '0 auto 20px', boxShadow: '0 10px 25px rgba(6, 182, 212, 0.3)'
                  }}>
                    <UserPlus size={30} color="white" />
                  </div>
                  <h2 className="fw-bold mb-1" style={{ 
                    fontSize: '1.8rem',
                    background: 'linear-gradient(90deg, #38bdf8, #818cf8)',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent'
                  }}>Create Account</h2>
                  <p style={{ color: '#94a3b8' }}>Join us to manage your home inventory</p>
                </div>

                {/* Error Alert */}
                <AnimatePresence>
                  {error && (
                    <motion.div 
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }}
                      className="mb-4 rounded-3 d-flex align-items-center"
                      style={{ background: 'rgba(239, 68, 68, 0.1)', border: '1px solid rgba(239, 68, 68, 0.2)', padding: '12px', color: '#f87171' }}
                    >
                      <AlertCircle size={18} className="me-2 flex-shrink-0" />
                      <span className="small">{error}</span>
                    </motion.div>
                  )}
                </AnimatePresence>
                
                <form onSubmit={handleSubmit}>
                  
                  {/* Name */}
                  <div style={inputContainerStyle}>
                    <User size={18} style={iconStyle} />
                    <input
                      type="text"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="Full Name"
                      required
                      style={inputStyle}
                    />
                  </div>

                  {/* Email */}
                  <div style={inputContainerStyle}>
                    <Mail size={18} style={iconStyle} />
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="Email Address"
                      required
                      style={inputStyle}
                    />
                  </div>
                  
                  {/* Password */}
                  <div style={inputContainerStyle}>
                    <Lock size={18} style={iconStyle} />
                    <input
                      type="password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="Password"
                      required
                      style={inputStyle}
                    />
                  </div>
                  
                  {/* Submit Button */}
                  <motion.button 
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    type="submit" 
                    disabled={isLoading}
                    className="btn w-100 py-3 fw-bold text-white d-flex align-items-center justify-content-center mt-2"
                    style={{ 
                      borderRadius: '12px', 
                      background: 'linear-gradient(135deg, #06b6d4 0%, #3b82f6 100%)', 
                      border: 'none',
                      boxShadow: '0 4px 15px rgba(6, 182, 212, 0.4)',
                      fontSize: '1rem'
                    }}
                  >
                    {isLoading ? (
                      <>
                        <span className="spinner-border spinner-border-sm me-2" />
                        Creating Account...
                      </>
                    ) : (
                      <>
                        Sign Up <ArrowRight size={18} className="ms-2" />
                      </>
                    )}
                  </motion.button>
                </form>
                
                <div className="text-center mt-4 pt-3 border-top border-secondary border-opacity-25">
                  <p style={{ color: '#94a3b8', fontSize: '0.95rem' }}>
                    Already have an account?{" "}
                    <Link to="/login" style={{ color: '#06b6d4', textDecoration: 'none', fontWeight: '600' }}>
                      Sign In
                    </Link>
                  </p>
                </div>

              </div>
            </motion.div>

          </div>
        </div>
      </div>
    </div>
  );
};

export default Signup;