import React from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { 
  ShoppingCart, ListChecks, Bell, User, 
  Layers, Settings, MessageCircle, BarChart3, 
  ArrowRight 
} from "lucide-react";

const Home = () => {
  // Animation: Stagger children elements for a cascading effect
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.08 }
    }
  };

  // Animation: Card pop-up effect
  const cardVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { type: "spring", stiffness: 100, damping: 12 }
    }
  };

  const features = [
    { icon: <ShoppingCart size={24} />, title: 'Inventory', desc: 'Track & manage stock.', link: '/inventory', color: '#38bdf8' },
    { icon: <ListChecks size={24} />, title: 'Shopping List', desc: 'AI smart suggestions.', link: '/Shoppinglist', color: '#4ade80' },
    { icon: <Layers size={24} />, title: 'Categories', desc: 'Organize by type.', link: '/CategoryPage', color: '#fbbf24' },
    { icon: <Bell size={24} />, title: 'Expiry Alerts', desc: 'Expiration notifications.', link: '/reminders', color: '#f87171' },
    { icon: <BarChart3 size={24} />, title: 'Insights', desc: 'Usage reports & trends.', link: '/reports', color: '#c084fc' },
    { icon: <User size={24} />, title: 'Profile', desc: 'Account settings.', link: '/Profile', color: '#f472b6' },
    { icon: <Settings size={24} />, title: 'Settings', desc: 'App configuration.', link: '/settings', color: '#94a3b8' },
    { icon: <MessageCircle size={24} />, title: 'Support', desc: 'Get help & support.', link: '/support', color: '#60a5fa' },
  ];

  return (
    <div style={{
      minHeight: '100vh',
      backgroundColor: '#0f172a', // Deep Slate 900
      color: '#f8fafc',
      paddingTop: '60px',
      paddingBottom: '80px',
      position: 'relative',
      overflow: 'hidden',
      fontFamily: '"Inter", "Segoe UI", sans-serif'
    }}>
      
      {/* Background Ambient Glow (Decorative) */}
      <div style={{
        position: 'absolute',
        top: '-10%',
        left: '50%',
        transform: 'translateX(-50%)',
        width: '600px',
        height: '600px',
        background: 'radial-gradient(circle, rgba(56, 189, 248, 0.15) 0%, rgba(15, 23, 42, 0) 70%)',
        zIndex: 0,
        pointerEvents: 'none'
      }} />

      <div className="container" style={{ position: 'relative', zIndex: 1 }}>
        
        {/* --- Hero Section --- */}
        <div className="row justify-content-center text-center mb-5">
          <div className="col-lg-8">
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, ease: "easeOut" }}
            >
              <h1 className="fw-bold mb-3" style={{ fontSize: '3.5rem', letterSpacing: '-0.02em' }}>
                Welcome to <span style={{ 
                  background: 'linear-gradient(135deg, #38bdf8 0%, #818cf8 100%)', 
                  WebkitBackgroundClip: 'text', 
                  WebkitTextFillColor: 'transparent',
                  filter: 'drop-shadow(0px 0px 20px rgba(56,189,248,0.3))'
                }}>MyHomeStock</span>
              </h1>
              <p style={{ color: '#94a3b8', fontSize: '1.25rem', maxWidth: '600px', margin: '0 auto', lineHeight: '1.6' }}>
                Your intelligent home assistant. Manage inventory, track expiry dates, and analyze spending with ease.
              </p>
            </motion.div>
          </div>
        </div>

        {/* --- Grid Section --- */}
        <motion.div 
          className="row g-4"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          {features.map((item, index) => (
            <div className="col-12 col-md-6 col-lg-3" key={index}>
              <motion.div
                variants={cardVariants}
                whileHover={{ 
                  y: -8, 
                  boxShadow: `0px 15px 30px -10px ${item.color}40`, // Colored shadow based on icon color
                  borderColor: 'rgba(255,255,255,0.2)' 
                }}
                className="card h-100"
                style={{ 
                  backgroundColor: 'rgba(30, 41, 59, 0.7)', // Semi-transparent slate
                  backdropFilter: 'blur(12px)', // Glassmorphism effect
                  borderRadius: '20px', 
                  border: '1px solid rgba(255, 255, 255, 0.08)',
                  overflow: 'hidden',
                  cursor: 'pointer'
                }}
              >
                <Link to={item.link} style={{ textDecoration: 'none', color: 'inherit', height: '100%', display: 'flex', flexDirection: 'column' }}>
                  <div className="card-body p-4 d-flex flex-column">
                    
                    {/* Header: Icon & Title */}
                    <div className="d-flex align-items-center mb-3">
                      <div style={{ 
                        width: '45px', 
                        height: '45px', 
                        borderRadius: '12px', 
                        backgroundColor: `${item.color}20`, // 20% opacity of the theme color
                        color: item.color,
                        display: 'flex', 
                        alignItems: 'center', 
                        justifyContent: 'center',
                        marginRight: '15px'
                      }}>
                        {item.icon}
                      </div>
                      <h5 className="fw-bold m-0" style={{ fontSize: '1.1rem', color: '#f1f5f9' }}>{item.title}</h5>
                    </div>

                    <p style={{ color: '#94a3b8', fontSize: '0.95rem', lineHeight: '1.5', flex: 1 }}>
                      {item.desc}
                    </p>
                    
                    {/* Footer: Action */}
                    <div className="mt-4 pt-3 border-top d-flex justify-content-between align-items-center" style={{ borderColor: 'rgba(255,255,255,0.08)' }}>
                      <span style={{ fontSize: '0.85rem', fontWeight: '600', color: '#cbd5e1' }}>Open</span>
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

export default Home;