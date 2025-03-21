import { useState } from "react";

export default function SettingsPage() {
  const [activeForm, setActiveForm] = useState(null);

  const openForm = (formName) => {
    setActiveForm(formName);
  };

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <h2 className="text-2xl font-bold text-center mb-4">Settings</h2>
      
      {/* Navigation */}
      <div className="flex justify-around bg-blue-500 text-white p-3 rounded-lg mb-6">
        <button onClick={() => openForm("category")} className="bg-white text-blue-500 px-4 py-2 rounded">
          Add Category
        </button>
        <button onClick={() => openForm("inventory")} className="bg-white text-blue-500 px-4 py-2 rounded">
          Add Inventory
        </button>
        <button onClick={() => openForm("user")} className="bg-white text-blue-500 px-4 py-2 rounded">
          Add User
        </button>
      </div>

      {/* Forms */}
      <div className="grid grid-cols-1 gap-6">
        {activeForm === "category" && (
          <div className="border rounded-lg p-4 shadow">
            <h3 className="text-lg font-semibold">Add Category</h3>
            <label className="block font-medium mb-1">Name</label>
            <input type="text" placeholder="Enter category name" className="border p-2 rounded w-full" />
            <button className="mt-4 bg-blue-500 text-white px-4 py-2 rounded">Save</button>
          </div>
        )}

        {activeForm === "inventory" && (
          <div className="border rounded-lg p-4 shadow">
            <h3 className="text-lg font-semibold">Add Inventory</h3>
            <label className="block font-medium mb-1">Item Name</label>
            <input type="text" placeholder="Enter item name" className="border p-2 rounded w-full" />
            <button className="mt-4 bg-blue-500 text-white px-4 py-2 rounded">Save</button>
          </div>
        )}

        {activeForm === "user" && (
          <div className="border rounded-lg p-4 shadow">
            <h3 className="text-lg font-semibold">Add User</h3>
            <label className="block font-medium mb-1">Email</label>
            <input type="email" placeholder="Enter user email" className="border p-2 rounded w-full" />
            <button className="mt-4 bg-blue-500 text-white px-4 py-2 rounded">Save</button>
          </div>
        )}
      </div>
    </div>
  );
}
