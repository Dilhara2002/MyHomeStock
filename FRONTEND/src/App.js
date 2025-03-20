import React from 'react';
import './App.css'; // Import your styles (if applicable)
import AddCategory from './Components/AddCategory.js';  // Import AddCategory component

function App() {
  return (
    <div className="App">
      <header>
        <h1>HomeStock Dashboard</h1>
        {/* You can have other links or sections here */}
      </header>
      <main>
        <AddCategory /> {/* Render AddCategory component here */}
      </main>
    </div>
  );
}

export default App;
