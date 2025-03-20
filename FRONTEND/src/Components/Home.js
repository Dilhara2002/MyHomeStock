import React from "react";

const Button = ({ children, ...props }) => (
    <button
        {...props}
        style={{
            backgroundColor: "#007bff",
            color: "white",
            padding: "12px 30px",
            borderRadius: "8px",
            width: "200px",
            border: "none",
            cursor: "pointer",
            fontSize: "16px",
            fontWeight: "bold",
            transition: "background-color 0.3s ease-in-out",
        }}
    >
        {children}
    </button>
);

export default function HomePage() {
    return (
        <div
            style={{
                padding: "40px",
                backgroundColor: "#f9f9f9",
                textAlign: "center",
                fontFamily: "Arial, sans-serif",
            }}
        >
            <h1>Welcome to HomeStock</h1>
            <p>Your ultimate solution for tracking home inventory, groceries, and household essentials.</p>

            <div style={{ marginTop: "20px" }}>
                <Button onClick={() => alert("Start Managing Inventory")}>
                    Start Managing Inventory
                </Button>
            </div>

            <div style={{ marginTop: "20px" }}>
                <Button onClick={() => alert("Browse Recipes")}>
                    Browse Recipes
                </Button>
            </div>

            <div style={{ marginTop: "20px" }}>
                <Button onClick={() => alert("Contact Support")}>
                    Contact Support
                </Button>
            </div>

            <footer
                style={{
                    marginTop: "40px",
                    padding: "20px",
                    backgroundColor: "#333",
                    color: "#fff",
                    fontSize: "14px",
                }}
            >
                <p>&copy; 2025 HomeStock. All rights reserved.</p>
            </footer>
        </div>
    );
}
