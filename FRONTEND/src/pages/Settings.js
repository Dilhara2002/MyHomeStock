import { useState } from "react";
import { FiUser, FiLock, FiBell, FiMoon, FiSun, FiChevronRight } from "react-icons/fi";

export default function SettingsPage() {
  const [activeTab, setActiveTab] = useState("profile");
  const [darkMode, setDarkMode] = useState(false);

  const tabs = [
    { id: "profile", icon: <FiUser />, label: "Profile" },
    { id: "security", icon: <FiLock />, label: "Security" },
    { id: "notifications", icon: <FiBell />, label: "Notifications" },
    { id: "appearance", icon: darkMode ? <FiMoon /> : <FiSun />, label: "Appearance" },
  ];

  return (
    <div className={`flex h-screen ${darkMode ? "bg-gray-900 text-white" : "bg-gray-50 text-gray-900"}`}>
      {/* Sidebar Navigation */}
      <div className={`w-64 p-4 border-r ${darkMode ? "border-gray-700" : "border-gray-200"}`}>
        <h2 className="text-xl font-bold mb-6">Settings</h2>
        <nav>
          <ul className="space-y-2">
            {tabs.map((tab) => (
              <li key={tab.id}>
                <button
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center justify-between w-full p-3 rounded-lg transition-colors ${
                    activeTab === tab.id
                      ? darkMode
                        ? "bg-blue-600 text-white"
                        : "bg-blue-100 text-blue-700"
                      : darkMode
                      ? "hover:bg-gray-800"
                      : "hover:bg-gray-100"
                  }`}
                >
                  <div className="flex items-center">
                    <span className="mr-3">{tab.icon}</span>
                    <span>{tab.label}</span>
                  </div>
                  <FiChevronRight />
                </button>
              </li>
            ))}
          </ul>
        </nav>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 p-8 overflow-auto">
        {activeTab === "profile" && (
          <ProfileSection darkMode={darkMode} />
        )}

        {activeTab === "security" && (
          <SecuritySection darkMode={darkMode} />
        )}

        {activeTab === "notifications" && (
          <NotificationSection darkMode={darkMode} />
        )}

        {activeTab === "appearance" && (
          <AppearanceSection 
            darkMode={darkMode} 
            setDarkMode={setDarkMode} 
          />
        )}
      </div>
    </div>
  );
}

// Profile Section Component
function ProfileSection({ darkMode }) {
  const [formData, setFormData] = useState({
    name: "John Doe",
    email: "john@example.com",
    bio: "Product designer and developer",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  return (
    <div>
      <h3 className="text-2xl font-bold mb-6">Profile Settings</h3>
      
      <div className="max-w-lg space-y-6">
        <div>
          <label className={`block mb-2 ${darkMode ? "text-gray-300" : "text-gray-600"}`}>Name</label>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            className={`w-full p-3 rounded-lg border ${
              darkMode
                ? "bg-gray-800 border-gray-700 focus:border-blue-500"
                : "bg-white border-gray-300 focus:border-blue-400"
            }`}
          />
        </div>

        <div>
          <label className={`block mb-2 ${darkMode ? "text-gray-300" : "text-gray-600"}`}>Email</label>
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            className={`w-full p-3 rounded-lg border ${
              darkMode
                ? "bg-gray-800 border-gray-700 focus:border-blue-500"
                : "bg-white border-gray-300 focus:border-blue-400"
            }`}
          />
        </div>

        <div>
          <label className={`block mb-2 ${darkMode ? "text-gray-300" : "text-gray-600"}`}>Bio</label>
          <textarea
            name="bio"
            value={formData.bio}
            onChange={handleChange}
            rows="4"
            className={`w-full p-3 rounded-lg border ${
              darkMode
                ? "bg-gray-800 border-gray-700 focus:border-blue-500"
                : "bg-white border-gray-300 focus:border-blue-400"
            }`}
          />
        </div>

        <button
          className={`px-6 py-3 rounded-lg font-medium ${
            darkMode
              ? "bg-blue-600 hover:bg-blue-700"
              : "bg-blue-500 hover:bg-blue-600 text-white"
          }`}
        >
          Save Changes
        </button>
      </div>
    </div>
  );
}

// Security Section Component
function SecuritySection({ darkMode }) {
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  return (
    <div>
      <h3 className="text-2xl font-bold mb-6">Security Settings</h3>
      
      <div className="max-w-lg space-y-6">
        <div>
          <h4 className="text-lg font-semibold mb-4">Change Password</h4>
          
          <div className="space-y-4">
            <div>
              <label className={`block mb-2 ${darkMode ? "text-gray-300" : "text-gray-600"}`}>Current Password</label>
              <input
                type="password"
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
                className={`w-full p-3 rounded-lg border ${
                  darkMode
                    ? "bg-gray-800 border-gray-700 focus:border-blue-500"
                    : "bg-white border-gray-300 focus:border-blue-400"
                }`}
              />
            </div>

            <div>
              <label className={`block mb-2 ${darkMode ? "text-gray-300" : "text-gray-600"}`}>New Password</label>
              <input
                type="password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                className={`w-full p-3 rounded-lg border ${
                  darkMode
                    ? "bg-gray-800 border-gray-700 focus:border-blue-500"
                    : "bg-white border-gray-300 focus:border-blue-400"
                }`}
              />
            </div>

            <div>
              <label className={`block mb-2 ${darkMode ? "text-gray-300" : "text-gray-600"}`}>Confirm New Password</label>
              <input
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className={`w-full p-3 rounded-lg border ${
                  darkMode
                    ? "bg-gray-800 border-gray-700 focus:border-blue-500"
                    : "bg-white border-gray-300 focus:border-blue-400"
                }`}
              />
            </div>
          </div>
        </div>

        <button
          className={`px-6 py-3 rounded-lg font-medium ${
            darkMode
              ? "bg-blue-600 hover:bg-blue-700"
              : "bg-blue-500 hover:bg-blue-600 text-white"
          }`}
        >
          Update Password
        </button>
      </div>
    </div>
  );
}

// Notification Section Component
function NotificationSection({ darkMode }) {
  const [notifications, setNotifications] = useState({
    email: true,
    push: false,
    newsletter: true,
  });

  const toggleNotification = (type) => {
    setNotifications(prev => ({ ...prev, [type]: !prev[type] }));
  };

  return (
    <div>
      <h3 className="text-2xl font-bold mb-6">Notification Settings</h3>
      
      <div className="max-w-lg space-y-6">
        <div className={`p-4 rounded-lg ${
          darkMode ? "bg-gray-800" : "bg-white border border-gray-200"
        }`}>
          <h4 className="font-semibold mb-4">Notification Preferences</h4>
          
          <div className="space-y-3">
            {Object.entries(notifications).map(([key, value]) => (
              <div key={key} className="flex items-center justify-between">
                <span className="capitalize">{key} notifications</span>
                <button
                  onClick={() => toggleNotification(key)}
                  className={`w-12 h-6 rounded-full p-1 transition-colors ${
                    value
                      ? darkMode
                        ? "bg-blue-600"
                        : "bg-blue-500"
                      : darkMode
                      ? "bg-gray-700"
                      : "bg-gray-300"
                  }`}
                >
                  <span
                    className={`block w-4 h-4 rounded-full bg-white transform transition-transform ${
                      value ? "translate-x-6" : "translate-x-0"
                    }`}
                  />
                </button>
              </div>
            ))}
          </div>
        </div>

        <button
          className={`px-6 py-3 rounded-lg font-medium ${
            darkMode
              ? "bg-blue-600 hover:bg-blue-700"
              : "bg-blue-500 hover:bg-blue-600 text-white"
          }`}
        >
          Save Preferences
        </button>
      </div>
    </div>
  );
}

// Appearance Section Component
function AppearanceSection({ darkMode, setDarkMode }) {
  const themes = [
    { id: "light", name: "Light", bg: "bg-white", text: "text-gray-900" },
    { id: "dark", name: "Dark", bg: "bg-gray-900", text: "text-white" },
    { id: "system", name: "System", bg: "bg-gray-100", text: "text-gray-900" },
  ];

  return (
    <div>
      <h3 className="text-2xl font-bold mb-6">Appearance Settings</h3>
      
      <div className="max-w-lg space-y-6">
        <div>
          <h4 className="text-lg font-semibold mb-4">Theme</h4>
          
          <div className="grid grid-cols-3 gap-4">
            {themes.map((theme) => (
              <button
                key={theme.id}
                onClick={() => {
                  if (theme.id === "dark") setDarkMode(true);
                  else setDarkMode(false);
                }}
                className={`p-4 rounded-lg border-2 ${
                  (darkMode && theme.id === "dark") || (!darkMode && theme.id === "light")
                    ? "border-blue-500"
                    : darkMode
                    ? "border-gray-700"
                    : "border-gray-200"
                }`}
              >
                <div className={`${theme.bg} ${theme.text} p-8 rounded`}>
                  <span>{theme.name}</span>
                </div>
              </button>
            ))}
          </div>
        </div>

        <div className={`p-4 rounded-lg ${
          darkMode ? "bg-gray-800" : "bg-white border border-gray-200"
        }`}>
          <h4 className="font-semibold mb-4">Dark Mode</h4>
          
          <div className="flex items-center justify-between">
            <span>Toggle dark mode</span>
            <button
              onClick={() => setDarkMode(!darkMode)}
              className={`w-12 h-6 rounded-full p-1 transition-colors ${
                darkMode
                  ? "bg-blue-600"
                  : "bg-gray-300"
              }`}
            >
              <span
                className={`block w-4 h-4 rounded-full bg-white transform transition-transform ${
                  darkMode ? "translate-x-6" : "translate-x-0"
                }`}
              />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}