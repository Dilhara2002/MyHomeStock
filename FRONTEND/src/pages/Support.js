import React from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { 
  HelpCircle, 
  Mail, 
  BookOpen, 
  AlertTriangle, 
  ArrowLeft, 
  ArrowRight 
} from "lucide-react";

const SupportHeader = () => {
  // --- Data & Config ---
  const supportCategories = [
    { 
      title: "FAQs", 
      icon: <HelpCircle size={28} />, 
      desc: "Common questions about HomeStock.", 
      path: "/ChatBot", 
      color: "#38bdf8" // Sky Blue
    },
    { 
      title: "Contact Us", 
      icon: <Mail size={28} />, 
      desc: "Reach out for direct inquiries.", 
      path: "/contact", 
      color: "#818cf8" // Indigo
    },
    { 
      title: "User Guide", 
      icon: <BookOpen size={28} />, 
      desc: "Step-by-step instructions.", 
      path: "/user-guide", 
      color: "#34d399" // Emerald
    },
    { 
      title: "Report an Issue", 
      icon: <AlertTriangle size={28} />, 
      desc: "Found a bug? Let us know.", 
      path: "/report-issue", 
      color: "#f87171" // Red
    }
  ];

  // --- Animation Variants ---
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.15 }
    }
  };

  const cardVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: { 
      y: 0, 
      opacity: 1,
      transition: { type: "spring", stiffness: 100 }
    }
  };

  return (
    <div style={{
      minHeight: '100vh',
      backgroundColor: '#0f172a', // Deep Slate 900
      color: '#f8fafc',
      paddingTop: '40px',
      paddingBottom: '80px',
      fontFamily: '"Inter", sans-serif',
      position: 'relative',
      overflowX: 'hidden'
    }}>
      
      {/* Background Ambient Glow */}
      <div style={{
        position: 'absolute',
        top: '-10%',
        left: '50%',
        transform: 'translateX(-50%)',
        width: '800px',
        height: '600px',
        background: 'radial-gradient(circle, rgba(56, 189, 248, 0.1) 0%, rgba(15, 23, 42, 0) 70%)',
        zIndex: 0,
        pointerEvents: 'none'
      }} />

      <div className="container" style={{ position: 'relative', zIndex: 1 }}>
        
        {/* --- Header Section (Matching Settings.js) --- */}
        <div className="d-flex align-items-center mb-5 pb-3" style={{ borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
          {/* Circular Back Arrow */}
          <Link to="/" className="text-decoration-none me-4">
            <motion.div 
              whileHover={{ scale: 1.1, backgroundColor: 'rgba(56, 189, 248, 0.2)', borderColor: '#38bdf8' }}
              whileTap={{ scale: 0.9 }}
              style={{
                width: '50px',
                height: '50px',
                borderRadius: '50%',
                backgroundColor: 'rgba(255,255,255,0.05)',
                border: '1px solid rgba(255,255,255,0.1)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#e2e8f0',
                transition: 'all 0.2s ease'
              }}
            >
              <ArrowLeft size={24} />
            </motion.div>
          </Link>

          {/* Title */}
          <div>
            <motion.h1 
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              className="fw-bold m-0 display-6"
            >
              Help <span style={{ color: '#38bdf8' }}>& Support</span>
            </motion.h1>
          </div>
        </div>

        {/* --- Hero Text --- */}
        <div className="row justify-content-center text-center mb-5">
          <div className="col-lg-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
            >
              <h2 className="fw-bold mb-3" style={{ fontSize: '2.5rem' }}>How can we help you?</h2>
              <p style={{ color: '#94a3b8', fontSize: '1.1rem' }}>
                Find answers, contact our team, or report issues. We're committed to making your experience exceptional.
              </p>
            </motion.div>
          </div>
        </div>
        
        {/* --- Cards Grid --- */}
        <motion.div 
          className="row g-4"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          {supportCategories.map((item, index) => (
            <div className="col-12 col-md-6 col-lg-3" key={index}>
              <motion.div
                variants={cardVariants}
                whileHover={{ 
                  y: -8, 
                  boxShadow: `0px 15px 30px -10px ${item.color}30`, // Colored glow
                  borderColor: 'rgba(255,255,255,0.2)' 
                }}
                className="card h-100"
                style={{
                  backgroundColor: 'rgba(30, 41, 59, 0.7)',
                  backdropFilter: 'blur(12px)',
                  borderRadius: '20px',
                  border: '1px solid rgba(255, 255, 255, 0.08)',
                  overflow: 'hidden',
                  cursor: 'pointer'
                }}
              >
                <Link to={item.path} style={{ textDecoration: 'none', color: 'inherit', height: '100%', display: 'flex', flexDirection: 'column' }}>
                  <div className="card-body p-4 d-flex flex-column align-items-center text-center">
                    
                    {/* Icon Bubble */}
                    <div className="mb-4" style={{
                      width: '70px',
                      height: '70px',
                      borderRadius: '50%',
                      background: `${item.color}20`, // Low opacity background
                      color: item.color,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      boxShadow: `0 0 15px ${item.color}20`
                    }}>
                      {item.icon}
                    </div>

                    <h5 className="fw-bold mb-2 text-white">{item.title}</h5>
                    <p className="small mb-4" style={{ color: '#94a3b8' }}>{item.desc}</p>
                    
                    {/* Learn More Link */}
                    <div className="mt-auto pt-3 w-100 d-flex justify-content-center align-items-center" 
                         style={{ borderTop: '1px solid rgba(255,255,255,0.05)' }}>
                      <span style={{ fontSize: '0.9rem', fontWeight: '600', color: item.color, marginRight: '8px' }}>
                        Open
                      </span>
                      <ArrowRight size={16} color={item.color} />
                    </div>
                  
                  </div>
                </Link>
              </motion.div>
            </div>
          ))}
        </motion.div>

      </div>
    </div>
  );
};

export default SupportHeader;