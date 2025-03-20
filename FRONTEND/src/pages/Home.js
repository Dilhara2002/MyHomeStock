import React from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { ShoppingCart, ListChecks, Bell, User, BarChart3, Settings, Info, MessageCircle } from "lucide-react";

// Custom Button Component
const Button = ({ children, style, ...props }) => (
  <button
    style={{
      ...style,
      padding: "10px 20px",
      borderRadius: "10px",
      cursor: "pointer",
      fontSize: "1rem",
      fontWeight: "bold",
      transition: "background 0.3s ease",
      border: "none",
    }}
    {...props}
  >
    {children}
  </button>
);

// Custom Card Components
const Card = ({ children }) => (
  <div
    style={{
      boxShadow: "5px 5px 15px rgba(0,0,0,0.1)",
      borderRadius: "15px",
      backgroundColor: "#fff",
      padding: "20px",
      textAlign: "center",
    }}
  >
    {children}
  </div>
);

const CardContent = ({ children }) => <div>{children}</div>;

const Home = () => {
  const features = [
    { icon: <ShoppingCart size={50} color="#3498db" />, title: "Manage Inventory", desc: "Add, edit, and organize your items efficiently.", link: "/inventory", bg: "#3498db" },
    { icon: <ListChecks size={50} color="#2ecc71" />, title: "Smart Shopping List", desc: "Get AI-suggested shopping lists based on usage patterns.", link: "/shopping-list", bg: "#2ecc71" },
    { icon: <Bell size={50} color="#e74c3c" />, title: "Expiry Reminders", desc: "Receive alerts before items expire.", link: "/reminders", bg: "#e74c3c" },
    { icon: <User size={50} color="#9b59b6" />, title: "User Management", desc: "Manage account settings and team members.", link: "/profile", bg: "#9b59b6" },
    { icon: <BarChart3 size={50} color="#f1c40f" />, title: "Analytics", desc: "Track your consumption trends and inventory statistics.", link: "/analytics", bg: "#f1c40f" },
    { icon: <Settings size={50} color="#7f8c8d" />, title: "Settings", desc: "Customize your preferences and app settings.", link: "/settings", bg: "#7f8c8d" },
    { icon: <Info size={50} color="#2980b9" />, title: "About Us", desc: "Learn more about HomeStock and its features.", link: "/about", bg: "#2980b9" },
    { icon: <MessageCircle size={50} color="#16a085" />, title: "Support", desc: "Need help? Contact our support team.", link: "/support", bg: "#16a085" },
  ];

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "linear-gradient(to right, #D6EAF8, #E8DAEF)",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        padding: "20px",
      }}
    >
      <motion.h1
        style={{
          fontSize: "3rem",
          fontWeight: "bold",
          marginTop: "40px",
          color: "#333",
          textShadow: "2px 2px 10px rgba(0,0,0,0.1)",
        }}
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        Welcome to HomeStock
      </motion.h1>
      <p
        style={{
          color: "#555",
          marginTop: "10px",
          fontSize: "1.2rem",
          textAlign: "center",
          maxWidth: "600px",
        }}
      >
        Your smart home inventory management system. Keep track of your groceries, household essentials, and get AI-powered expiry reminders effortlessly.
      </p>

      {/* Feature Grid */}
      <div
        style={{
          marginTop: "40px",
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))",
          gap: "20px",
          maxWidth: "1200px",
          width: "100%",
        }}
      >
        {features.map((item, index) => (
          <Card key={index}>
            <CardContent>
              {item.icon}
              <h2 style={{ fontSize: "1.5rem", fontWeight: "bold", marginTop: "15px", color: "#333" }}>
                {item.title}
              </h2>
              <p style={{ color: "#777", textAlign: "center", marginTop: "5px" }}>{item.desc}</p>
              <Button
                style={{
                  marginTop: "15px",
                  backgroundColor: item.bg,
                  color: "white",
                  padding: "10px 20px",
                  borderRadius: "10px",
                  fontSize: "1rem",
                }}
              >
                <Link to={item.link} style={{ textDecoration: "none", color: "white" }}>Explore</Link>
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default Home;
