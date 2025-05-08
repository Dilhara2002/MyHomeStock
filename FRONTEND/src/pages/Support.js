import React from "react";
import { 
  FaQuestionCircle,
  FaUser,
  FaList,
  FaExclamationTriangle
} from "react-icons/fa";
import { Link } from "react-router-dom";

const SupportHeader = () => {
  const supportCategories = [
    { title: "FAQs", icon: <FaQuestionCircle size={24} />, desc: "Common questions about HomeStock", path: "/ChatBot" },
    { title: "Contact Us", icon: <FaUser size={24} />, desc: "For direct inquiries", path: "/contact" },
    { title: "User Guide", icon: <FaList size={24} />, desc: "Step-by-step instructions", path: "/user-guide" },
    { title: "Report an Issue", icon: <FaExclamationTriangle size={24} />, desc: "Bug reporting form", path: "/report-issue" }
  ];

  const styles = {
    supportHeader: {
      background: "linear-gradient(to bottom, #f9fafb, #f3f4f6)",
      padding: "3rem 0"
    },
    container: {
      maxWidth: "72rem",
      marginLeft: "auto",
      marginRight: "auto",
      paddingLeft: "1rem",
      paddingRight: "1rem"
    },
    textCenter: {
      textAlign: "center",
      marginBottom: "3rem"
    },
    heading: {
      fontSize: "3rem",
      fontWeight: "700",
      marginBottom: "1.5rem",
      background: "linear-gradient(135deg, #2D7D9A 0%, #19B8B8 100%)",
      WebkitBackgroundClip: "text",
      WebkitTextFillColor: "transparent"
    },
    subHeading: {
      fontSize: "1.125rem",
      color: "#4b5563",
      maxWidth: "42rem",
      marginLeft: "auto",
      marginRight: "auto"
    },
    quickSupportSection: {
      marginBottom: "4rem"
    },
    sectionHeading: {
      color: "#0f766e",
      fontWeight: "700",
      fontSize: "1.5rem",
      marginBottom: "2rem",
      paddingBottom: "0.75rem",
      borderBottom: "2px solid #ccfbf1"
    },
    grid: {
      display: "grid",
      gridTemplateColumns: "repeat(1, 1fr)",
      gap: "1.5rem"
    },
    card: {
      backgroundColor: "#ffffff",
      borderRadius: "0.75rem",
      boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)",
      height: "100%",
      transition: "box-shadow 0.3s ease"
    },
    cardHover: {
      boxShadow: "0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)"
    },
    cardLink: {
      display: "block",
      height: "100%",
      padding: "1.5rem",
      textAlign: "center",
      textDecoration: "none"
    },
    iconContainer: {
      width: "4rem",
      height: "4rem",
      marginLeft: "auto",
      marginRight: "auto",
      marginBottom: "1rem",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      borderRadius: "9999px",
      color: "#0d9488",
      backgroundColor: "#f0fdfa"
    },
    cardTitle: {
      fontSize: "1.25rem",
      fontWeight: "600",
      color: "#0f766e",
      marginBottom: "0.5rem"
    },
    cardDescription: {
      color: "#4b5563",
      marginBottom: "1rem"
    },
    learnMore: {
      color: "#0d9488",
      fontWeight: "500",
      fontSize: "0.875rem"
    }
  };

  // Media query styles to be applied conditionally
  if (window.innerWidth >= 768) {
    styles.grid.gridTemplateColumns = "repeat(2, 1fr)";
  }
  
  if (window.innerWidth >= 1024) {
    styles.grid.gridTemplateColumns = "repeat(4, 1fr)";
  }

  return (
    <div style={styles.supportHeader}>
      <div style={styles.container}>
        {/* Page Header */}
        <div style={styles.textCenter}>
          <h1 style={styles.heading}>
            How Can We Help You?
          </h1>
          <p style={styles.subHeading}>
            Find answers, contact our team, or report issues. We're committed to making your HomeStock experience exceptional.
          </p>
        </div>
        
        {/* Quick Support Links Section */}
        <div style={styles.quickSupportSection}>
          <h2 style={styles.sectionHeading}>
            Quick Support Links
          </h2>
          <div style={styles.grid}>
            {supportCategories.map((item, index) => (
              <div 
                key={index} 
                style={styles.card}
                onMouseOver={(e) => e.currentTarget.style.boxShadow = styles.cardHover.boxShadow}
                onMouseOut={(e) => e.currentTarget.style.boxShadow = styles.card.boxShadow}
              >
                <Link to={item.path} style={styles.cardLink}>
                  <div style={styles.iconContainer}>
                    {item.icon}
                  </div>
                  <h3 style={styles.cardTitle}>{item.title}</h3>
                  <p style={styles.cardDescription}>{item.desc}</p>
                  <div style={styles.learnMore}>
                    Learn more →
                  </div>
                </Link>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default SupportHeader;