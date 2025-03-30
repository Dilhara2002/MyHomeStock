import React from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { ShoppingCart, ListChecks, Bell, User, Layers, Settings, Info, MessageCircle, BarChart3 } from "lucide-react";

const Home = () => {
  return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #f0f5ff 0%, #e8f8f5 100%)',
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
                marginBottom: '20px'
              }}>
                Welcome to <span style={{ color: '#3498db' }}>MyHomeStock</span>
              </h1>
              {/* <p style={{ fontSize: '1.2rem', color: '#555', marginBottom: '40px' }}>
                The ultimate home inventory manager. Track items, get AI-powered shopping suggestions, and manage your household with ease.
              </p> */}<br/><br/>
            </motion.div>
          </div>
        </div>

        <div className="row g-4">
          {[
            { icon: <ShoppingCart size={50} />, title: 'Inventory Management', desc: 'Track, update, and manage your home essentials.', link: '/inventory', bg: '#3498db' },
            { icon: <ListChecks size={50} />, title: 'Smart Shopping List', desc: 'Auto-suggested lists based on your usage.', link: '/Shoppinglist', bg: '#2ecc71' },
            { icon: <Layers size={50} />, title: 'Category Management', desc: 'Organize inventory by categories.', link: '/CategoryPage', bg: '#f1c40f' },
            { icon: <Bell size={50} />, title: 'Expiry Alerts', desc: 'Get reminders for expiring items.', link: '/reminders', bg: '#e74c3c' },
            { icon: <User size={50} />, title: 'User Profile', desc: 'Manage your account & preferences.', link: '/Profile', bg: '#9b59b6' },
            { icon: <BarChart3 size={50} />, title: 'Reports & Insights', desc: 'Analyze stock trends & usage.', link: '/reports', bg: '#16a085' },
            { icon: <Settings size={50} />, title: 'Settings', desc: 'Customize app preferences.', link: '/settings', bg: '#7f8c8d' },
            { icon: <MessageCircle size={50} />, title: 'Support', desc: 'Need help? Contact our team.', link: '/support', bg: '#2980b9' },
          ].map((item, index) => (
            <div className="col-sm-6 col-lg-3" key={index}>
              <motion.div
                className="card h-100 border-0 d-flex flex-column"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1, duration: 0.5 }}
                whileHover={{ y: -10, boxShadow: '0 15px 30px rgba(0,0,0,0.15)' }}
                style={{ borderRadius: '16px', overflow: 'hidden' }}
              >
                <div className="card-body text-center d-flex flex-column" style={{ flex: '1' }}>
                  <div style={{ background: item.bg, color: 'white', borderRadius: '50%', width: '80px', height: '80px', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 20px' }}>
                    {item.icon}
                  </div>
                  <h4 className="card-title fw-bold" style={{ fontSize: '1.3rem' }}>{item.title}</h4>
                  <p className="card-text" style={{ color: '#7f8c8d', marginBottom: '20px' }}>{item.desc}</p>
                  <div className="mt-auto">
                    <Link to={item.link} className="btn text-white w-100" style={{
                      backgroundColor: item.bg,
                      padding: '10px 15px',
                      borderRadius: '8px',
                      fontWeight: '500',
                      marginTop: 'auto'
                    }}>
                      Explore
                    </Link>
                  </div>                </div>
              </motion.div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Home;
