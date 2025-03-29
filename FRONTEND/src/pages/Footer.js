import React from 'react';
import { FaFacebook, FaTwitter, FaInstagram, FaLinkedin } from 'react-icons/fa';

const Footer = () => {
  return (
    <footer style={{
      background: "#00838F",
      color: "white",
      padding: "40px 0 20px",
      marginTop: "50px",
      fontFamily: "'Poppins', sans-serif"
    }}>
      <div className="container" style={{ maxWidth: "1200px", margin: "0 auto", padding: "0 15px" }}>
        <div className="row">
          <div className="col-md-6 mb-4">
            <h3 style={{ fontWeight: "600", marginBottom: "20px" }}>HomeStock</h3>
            <p style={{ marginBottom: "20px" }}>Your complete home inventory management solution.</p>
            <div className="social-icons" style={{ display: "flex", gap: "15px" }}>
              <a href="https://facebook.com" style={{ color: "white" }}><FaFacebook size={20} /></a>
              <a href="https://twitter.com" style={{ color: "white" }}><FaTwitter size={20} /></a>
              <a href="https://instagram.com" style={{ color: "white" }}><FaInstagram size={20} /></a>
              <a href="https://linkedin.com" style={{ color: "white" }}><FaLinkedin size={20} /></a>
            </div>
          </div>
          <div className="col-md-3 mb-4">
            <h5 style={{ fontWeight: "600", marginBottom: "20px" }}>Quick Links</h5>
            <ul style={{ listStyle: "none", padding: 0 }}>
              <li style={{ marginBottom: "10px" }}><a href="/" style={{ color: "white", textDecoration: "none" }}>Home</a></li>
              <li style={{ marginBottom: "10px" }}><a href="/inventory" style={{ color: "white", textDecoration: "none" }}>Inventory</a></li>
              <li style={{ marginBottom: "10px" }}><a href="/shopping-list" style={{ color: "white", textDecoration: "none" }}>Shopping List</a></li>
              <li style={{ marginBottom: "10px" }}><a href="/support" style={{ color: "white", textDecoration: "none" }}>Support</a></li>
            </ul>
          </div>
          <div className="col-md-3 mb-4">
            <h5 style={{ fontWeight: "600", marginBottom: "20px" }}>Legal</h5>
            <ul style={{ listStyle: "none", padding: 0 }}>
              <li style={{ marginBottom: "10px" }}><a href="/privacy-policy" style={{ color: "white", textDecoration: "none" }}>Privacy Policy</a></li>
              <li style={{ marginBottom: "10px" }}><a href="/terms-of-service" style={{ color: "white", textDecoration: "none" }}>Terms of Service</a></li>
              <li style={{ marginBottom: "10px" }}><a href="/about" style={{ color: "white", textDecoration: "none" }}>About Us</a></li>
            </ul>
          </div>
        </div>
        <div className="text-center mt-4 pt-3" style={{ borderTop: "1px solid rgba(255,255,255,0.1)" }}>
          <p style={{ margin: 0 }}>&copy; {new Date().getFullYear()} HomeStock. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;