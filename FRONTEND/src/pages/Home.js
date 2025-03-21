import React from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { ShoppingCart, ListChecks, Bell, User, BarChart3, Settings, Info, MessageCircle } from "lucide-react";

// Import Bootstrap CSS (you'll need to install bootstrap: npm install bootstrap)
// Add this to your main index.js or App.js: import 'bootstrap/dist/css/bootstrap.min.css';

const Home = () => {
  return (
    <div style={{ 
      minHeight: '100vh', 
      background: 'linear-gradient(135deg, #D6EAF8 0%, #E8DAEF 100%)',
      paddingTop: '30px',
      paddingBottom: '50px'
    }}>
      <div className="container">
        <div className="row justify-content-center text-center">
          <div className="col-lg-8">
            <motion.div
              initial={{ opacity: 0, y: -30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
            >
              <h1 style={{ 
                fontSize: '3.5rem', 
                fontWeight: '800', 
                color: '#2c3e50',
                marginBottom: '20px',
                textShadow: '2px 2px 15px rgba(0,0,0,0.1)'
              }}>
                Welcome to <span style={{ color: '#3498db' }}>HomeStock</span>
              </h1>
              <p style={{ 
                fontSize: '1.2rem', 
                color: '#555', 
                marginBottom: '40px',
                maxWidth: '700px',
                margin: '0 auto 40px'
              }}>
                Your smart home inventory management system. Keep track of your groceries, household essentials, and get AI-powered expiry reminders effortlessly.
              </p>
            </motion.div>
          </div>
        </div>

        <div className="row g-4">
          {[
            { icon: <ShoppingCart size={50} />, title: 'Manage Inventory', desc: 'Add, edit, and organize your items efficiently.', link: '/inventory', bg: '#3498db', hover: '#2980b9' },
            { icon: <ListChecks size={50} />, title: 'Smart Shopping List', desc: 'Get AI-suggested shopping lists based on usage patterns.', link: '/shopping-list', bg: '#2ecc71', hover: '#27ae60' },
            { icon: <Bell size={50} />, title: 'Expiry Reminders', desc: 'Receive alerts before items expire.', link: '/reminders', bg: '#e74c3c', hover: '#c0392b' },
            { icon: <User size={50} />, title: 'User Management', desc: 'Manage account settings and team members.', link: '/profile', bg: '#9b59b6', hover: '#8e44ad' },
            { icon: <BarChart3 size={50} />, title: 'Analytics', desc: 'Track your consumption trends and inventory statistics.', link: '/analytics', bg: '#f1c40f', hover: '#f39c12' },
            { icon: <Settings size={50} />, title: 'Settings', desc: 'Customize your preferences and app settings.', link: '/settings', bg: '#7f8c8d', hover: '#95a5a6' },
            { icon: <Info size={50} />, title: 'About Us', desc: 'Learn more about HomeStock and its features.', link: '/about', bg: '#2980b9', hover: '#3498db' },
            { icon: <MessageCircle size={50} />, title: 'Support', desc: 'Need help? Contact our support team.', link: '/support', bg: '#16a085', hover: '#1abc9c' },
          ].map((item, index) => (
            <div className="col-sm-6 col-lg-3" key={index}>
              <motion.div 
                className="card h-100 border-0" 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1, duration: 0.5 }}
                whileHover={{ 
                  y: -10,
                  boxShadow: '0 15px 30px rgba(0,0,0,0.15)',
                  transition: { duration: 0.3 }
                }}
                style={{ 
                  borderRadius: '16px',
                  overflow: 'hidden',
                  boxShadow: '0 10px 20px rgba(0,0,0,0.1)'
                }}
              >
                <div className="card-body text-center">
                  <div style={{ 
                    background: item.bg,
                    color: 'white',
                    borderRadius: '50%',
                    width: '80px',
                    height: '80px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    margin: '0 auto 20px',
                    transition: 'all 0.3s ease'
                  }}>
                    {item.icon}
                  </div>
                  <h4 className="card-title fw-bold" style={{ fontSize: '1.3rem', color: '#2c3e50' }}>{item.title}</h4>
                  <p className="card-text" style={{ color: '#7f8c8d', marginBottom: '20px' }}>{item.desc}</p>
                  <Link 
                    to={item.link} 
                    className="btn text-white w-100"
                    style={{ 
                      backgroundColor: item.bg, 
                      padding: '10px 15px',
                      borderRadius: '8px',
                      fontWeight: '500',
                      transition: 'all 0.3s ease',
                      boxShadow: `0 4px 15px ${item.bg}80`
                    }}
                    onMouseOver={(e) => e.currentTarget.style.backgroundColor = item.hover}
                    onMouseOut={(e) => e.currentTarget.style.backgroundColor = item.bg}
                  >
                    Explore
                  </Link>
                </div>
              </motion.div>
            </div>
          ))}
        </div>

        <div className="row mt-5 justify-content-center">
          <div className="col-md-8 text-center">
            <div className="card border-0" style={{ 
              background: 'rgba(255,255,255,0.8)',
              borderRadius: '16px',
              backdropFilter: 'blur(10px)',
              padding: '30px',
              boxShadow: '0 10px 30px rgba(0,0,0,0.1)'
            }}>
              <h3 style={{ color: '#2c3e50', marginBottom: '20px' }}>Get Started Today</h3>
              <p style={{ color: '#7f8c8d', marginBottom: '25px' }}>
                Join thousands of households that use HomeStock to simplify their inventory management and reduce food waste.
              </p>
              <Link 
                to="/signup" 
                className="btn btn-lg"
                style={{ 
                  background: 'linear-gradient(to right, #3498db, #9b59b6)',
                  color: 'white',
                  borderRadius: '30px',
                  padding: '12px 35px',
                  fontWeight: '600',
                  boxShadow: '0 8px 20px rgba(52, 152, 219, 0.3)'
                }}
              >
                Sign Up for Free
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;