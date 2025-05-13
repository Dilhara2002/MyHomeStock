import React from 'react';
import { FaFacebook, FaTwitter, FaInstagram, FaLinkedin } from 'react-icons/fa';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  const sectionStyle = {
    flex: '1',
    minWidth: '200px',
    marginBottom: '20px',
  };

  const linkStyle = {
    color: 'white',
    textDecoration: 'none',
    marginBottom: '10px',
    display: 'inline-block',
  };

  const socialIconStyle = {
    color: 'white',
    marginRight: '15px',
    transition: 'color 0.3s',
  };

  return (
    <footer
      style={{
        background: '#1C2526',
        color: 'white',
        padding: '40px 20px 20px',
        fontFamily: "'Poppins', sans-serif",
      }}
    >
      <div
        style={{
          maxWidth: '1200px',
          margin: '0 auto',
          display: 'flex',
          flexWrap: 'wrap',
          justifyContent: 'space-between',
        }}
      >
        {/* Branding Section */}
        <div style={sectionStyle}>
          <h3 style={{ fontWeight: '600', marginBottom: '20px' }}>HomeStock</h3>
          <p style={{ marginBottom: '20px' }}>
            Your complete home inventory management solution.
          </p>
          <div style={{ display: 'flex', gap: '15px' }}>
            <a
              href="https://facebook.com"
              style={socialIconStyle}
              aria-label="Facebook"
            >
              <FaFacebook size={20} />
            </a>
            <a
              href="https://twitter.com"
              style={socialIconStyle}
              aria-label="Twitter"
            >
              <FaTwitter size={20} />
            </a>
            <a
              href="https://instagram.com"
              style={socialIconStyle}
              aria-label="Instagram"
            >
              <FaInstagram size={20} />
            </a>
            <a
              href="https://linkedin.com"
              style={socialIconStyle}
              aria-label="LinkedIn"
            >
              <FaLinkedin size={20} />
            </a>
          </div>
        </div>

        {/* Quick Links */}
        <nav style={sectionStyle} aria-label="Quick Links">
          <h5 style={{ fontWeight: '600', marginBottom: '20px' }}>Quick Links</h5>
          <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
            <li>
              <a href="/" style={linkStyle}>Home</a>
            </li>
            <li>
              <a href="/inventory" style={linkStyle}>Inventory</a>
            </li>
            <li>
              <a href="/shopping-list" style={linkStyle}>Shopping List</a>
            </li>
            <li>
              <a href="/support" style={linkStyle}>Support</a>
            </li>
          </ul>
        </nav>

        {/* Legal Links */}
        <nav style={sectionStyle} aria-label="Legal">
          <h5 style={{ fontWeight: '600', marginBottom: '20px' }}>Legal</h5>
          <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
            <li>
              <a href="/privacy-policy" style={linkStyle}>Privacy Policy</a>
            </li>
            <li>
              <a href="/terms-of-service" style={linkStyle}>Terms of Service</a>
            </li>
            <li>
              <a href="/about" style={linkStyle}>About Us</a>
            </li>
          </ul>
        </nav>
      </div>

      {/* Footer Bottom */}
      <div
        style={{
          borderTop: '1px solid rgba(255,255,255,0.1)',
          marginTop: '30px',
          paddingTop: '20px',
          textAlign: 'center',
          fontSize: '14px',
          color: '#D3D3D3',
        }}
      >
        <p style={{ margin: 0 }}>
          &copy; {currentYear} HomeStock. All rights reserved.
        </p>
      </div>
    </footer>
  );
};

export default Footer;
