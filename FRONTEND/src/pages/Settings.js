import React, { useState } from 'react';

const Settings = () => {
  // State for form fields
  const [userData, setUserData] = useState({
    username: 'current_user',
    email: 'user@example.com',
    password: ''
  });

  const [notificationPrefs, setNotificationPrefs] = useState({
    expiryAlerts: true,
    lowStock: true,
    weeklySummary: false,
    notificationTime: 'Afternoon (1:00 PM)'
  });

  const [displayPrefs, setDisplayPrefs] = useState({
    theme: 'Light',
    itemsPerPage: '25',
    compactView: false
  });

  // Handler functions
  const handleUserDataChange = (e) => {
    const { name, value } = e.target;
    setUserData(prev => ({ ...prev, [name]: value }));
  };

  const handleNotificationChange = (e) => {
    const { name, checked } = e.target;
    setNotificationPrefs(prev => ({ ...prev, [name]: checked }));
  };

  const handleDisplayChange = (e) => {
    const { name, value, type, checked } = e.target;
    setDisplayPrefs(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Handle form submission here
    console.log('Settings saved:', { userData, notificationPrefs, displayPrefs });
  };

  // Styles
  const styles = {
    container: {
      maxWidth: '1200px',
      margin: '0 auto',
      padding: '20px',
      fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
      backgroundColor: '#f5f7fa',
      color: '#333333'
    },
    header: {
      marginBottom: '30px'
    },
    title: {
      color: '#4a6fa5',
      marginBottom: '5px'
    },
    subtitle: {
      color: '#6b8cae',
      fontSize: '1.1rem',
      marginTop: '0'
    },
    grid: {
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
      gap: '20px'
    },
    card: {
      backgroundColor: '#ffffff',
      borderRadius: '8px',
      padding: '20px',
      boxShadow: '0 2px 10px rgba(0, 0, 0, 0.1)',
      transition: 'transform 0.2s'
    },
    cardHover: {
      transform: 'translateY(-5px)'
    },
    cardTitle: {
      color: '#4a6fa5',
      fontSize: '1.2rem',
      marginTop: '0',
      marginBottom: '15px',
      borderBottom: '1px solid #eee',
      paddingBottom: '10px'
    },
    formGroup: {
      marginBottom: '15px'
    },
    label: {
      display: 'block',
      marginBottom: '5px',
      fontWeight: '500'
    },
    input: {
      width: '100%',
      padding: '8px 12px',
      border: '1px solid #ddd',
      borderRadius: '8px',
      fontSize: '1rem'
    },
    checkboxGroup: {
      display: 'flex',
      alignItems: 'center',
      marginBottom: '10px'
    },
    checkbox: {
      width: 'auto',
      marginRight: '10px'
    },
    button: {
      backgroundColor: '#4a6fa5',
      color: 'white',
      border: 'none',
      padding: '10px 15px',
      borderRadius: '8px',
      cursor: 'pointer',
      fontSize: '1rem',
      transition: 'background-color 0.2s'
    },
    buttonHover: {
      backgroundColor: '#6b8cae'
    },
    fullWidthButton: {
      width: '100%',
      marginBottom: '10px'
    },
    dangerButton: {
      backgroundColor: '#e74c3c'
    },
    dangerButtonHover: {
      backgroundColor: '#c0392b'
    },
    logoutButton: {
      marginTop: '15px'
    },
    footer: {
      marginTop: '40px',
      textAlign: 'center',
      color: '#6b8cae',
      fontSize: '0.9rem'
    }
  };

  return (
    <div style={styles.container}>
      <header style={styles.header}>
        <h1 style={styles.title}>MyHomeStock Settings</h1>
        <p style={styles.subtitle}>Customize your inventory management experience</p>
      </header>
      
      <form onSubmit={handleSubmit} style={styles.grid}>
        {/* Account Settings */}
        <div style={styles.card}>
          <h2 style={styles.cardTitle}>Account Settings</h2>
          <div style={styles.formGroup}>
            <label style={styles.label} htmlFor="username">Username</label>
            <input 
              type="text" 
              id="username" 
              name="username"
              value={userData.username}
              onChange={handleUserDataChange}
              style={styles.input}
            />
          </div>
          <div style={styles.formGroup}>
            <label style={styles.label} htmlFor="email">Email Address</label>
            <input 
              type="email" 
              id="email" 
              name="email"
              value={userData.email}
              onChange={handleUserDataChange}
              style={styles.input}
            />
          </div>
          <div style={styles.formGroup}>
            <label style={styles.label} htmlFor="password">Change Password</label>
            <input 
              type="password" 
              id="password" 
              name="password"
              value={userData.password}
              onChange={handleUserDataChange}
              placeholder="Enter new password"
              style={styles.input}
            />
          </div>
          <button 
            type="button" 
            onClick={handleSubmit}
            style={styles.button}
          >
            Update Account
          </button>
        </div>
        
        {/* Notification Preferences */}
        <div style={styles.card}>
          <h2 style={styles.cardTitle}>Notification Preferences</h2>
          <div style={styles.checkboxGroup}>
            <input 
              type="checkbox" 
              id="expiry-alerts" 
              name="expiryAlerts"
              checked={notificationPrefs.expiryAlerts}
              onChange={handleNotificationChange}
              style={styles.checkbox}
            />
            <label style={styles.label} htmlFor="expiry-alerts">Expiry Alerts</label>
          </div>
          <div style={styles.checkboxGroup}>
            <input 
              type="checkbox" 
              id="low-stock" 
              name="lowStock"
              checked={notificationPrefs.lowStock}
              onChange={handleNotificationChange}
              style={styles.checkbox}
            />
            <label style={styles.label} htmlFor="low-stock">Low Stock Warnings</label>
          </div>
          <div style={styles.checkboxGroup}>
            <input 
              type="checkbox" 
              id="weekly-summary" 
              name="weeklySummary"
              checked={notificationPrefs.weeklySummary}
              onChange={handleNotificationChange}
              style={styles.checkbox}
            />
            <label style={styles.label} htmlFor="weekly-summary">Weekly Summary Report</label>
          </div>
          <div style={styles.formGroup}>
            <label style={styles.label} htmlFor="notification-time">Notification Time</label>
            <select 
              id="notification-time"
              name="notificationTime"
              value={notificationPrefs.notificationTime}
              onChange={(e) => setNotificationPrefs(prev => ({
                ...prev,
                notificationTime: e.target.value
              }))}
              style={styles.input}
            >
              <option>Morning (8:00 AM)</option>
              <option>Afternoon (1:00 PM)</option>
              <option>Evening (6:00 PM)</option>
            </select>
          </div>
          <button 
            type="button" 
            onClick={handleSubmit}
            style={styles.button}
          >
            Save Preferences
          </button>
        </div>
        
        {/* Display Preferences */}
        <div style={styles.card}>
          <h2 style={styles.cardTitle}>Display Preferences</h2>
          <div style={styles.formGroup}>
            <label style={styles.label} htmlFor="theme">Theme</label>
            <select 
              id="theme"
              name="theme"
              value={displayPrefs.theme}
              onChange={handleDisplayChange}
              style={styles.input}
            >
              <option>Light</option>
              <option>Dark</option>
              <option>System Default</option>
            </select>
          </div>
          <div style={styles.formGroup}>
            <label style={styles.label} htmlFor="items-per-page">Items Per Page</label>
            <select 
              id="items-per-page"
              name="itemsPerPage"
              value={displayPrefs.itemsPerPage}
              onChange={handleDisplayChange}
              style={styles.input}
            >
              <option>10</option>
              <option>25</option>
              <option>50</option>
              <option>100</option>
            </select>
          </div>
          <div style={styles.checkboxGroup}>
            <input 
              type="checkbox" 
              id="compact-view" 
              name="compactView"
              checked={displayPrefs.compactView}
              onChange={handleDisplayChange}
              style={styles.checkbox}
            />
            <label style={styles.label} htmlFor="compact-view">Compact Item View</label>
          </div>
          <button 
            type="button" 
            onClick={handleSubmit}
            style={styles.button}
          >
            Save Display Settings
          </button>
        </div>
        
        {/* Data Management */}
        <div style={styles.card}>
          <h2 style={styles.cardTitle}>Data Management</h2>
          <div style={styles.formGroup}>
            <label style={styles.label}>Export Data</label>
            <button 
              type="button" 
              style={{ ...styles.button, ...styles.fullWidthButton }}
            >
              Export to CSV
            </button>
          </div>
          <div style={styles.formGroup}>
            <label style={styles.label}>Import Data</label>
            <input type="file" id="import-file" style={styles.input} />
          </div>
          <div style={styles.formGroup}>
            <label style={styles.label}>Reset Data</label>
            <button 
              type="button" 
              style={{ 
                ...styles.button, 
                ...styles.fullWidthButton, 
                ...styles.dangerButton 
              }}
            >
              Reset All Inventory
            </button>
          </div>
        </div>
        
        {/* Support */}
        <div style={styles.card}>
          <h2 style={styles.cardTitle}>Support</h2>
          <p>Need help with MyHomeStock?</p>
          <button 
            type="button" 
            style={{ ...styles.button, ...styles.fullWidthButton }}
          >
            Contact Support
          </button>
          <button 
            type="button" 
            style={{ ...styles.button, ...styles.fullWidthButton }}
          >
            View Help Center
          </button>
          <button 
            type="button" 
            style={{ ...styles.button, ...styles.fullWidthButton }}
          >
            Check for Updates
          </button>
        </div>
        
        {/* About */}
        <div style={styles.card}>
          <h2 style={styles.cardTitle}>About MyHomeStock</h2>
          <p><strong>Version:</strong> 2.1.4</p>
          <p><strong>Last Updated:</strong> May 10, 2025</p>
          <p><strong>Terms of Service</strong></p>
          <p><strong>Privacy Policy</strong></p>
          <button 
            type="button" 
            style={{ ...styles.button, ...styles.fullWidthButton, ...styles.logoutButton }}
          >
            Log Out
          </button>
        </div>
      </form>
      
      <div style={styles.footer}>
        <p>© 2025 MyHomeStock. All rights reserved.</p>
      </div>
    </div>
  );
};

export default Settings;