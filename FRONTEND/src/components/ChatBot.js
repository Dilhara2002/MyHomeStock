import React, { useState, useEffect } from 'react';
import axios from 'axios';

const InventoryAssistant = () => {
  const [messages, setMessages] = useState([
    { text: "Hello! I'm your inventory assistant. How can I help you today?", sender: 'bot' }
  ]);
  const [userInput, setUserInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  
  // Generate a unique session ID
  const sessionId = `session-${Math.random().toString(36).substr(2, 9)}`;

  const handleSendMessage = async () => {
    if (!userInput.trim() || isLoading) return;

    // Add user message to chat
    const userMessage = { text: userInput, sender: 'user' };
    setMessages(prev => [...prev, userMessage]);
    setUserInput('');
    setIsLoading(true);

    try {
      // Send message to your backend
      const response = await axios.post(
        'https://fb43-2402-d000-8120-db9-e99b-bcec-3e23-bd35.ngrok-free.app/webhook', 
        {
          queryResult: {
            queryText: userInput,
            intent: { displayName: 'detect-intent' },
            session: sessionId
          }
        },
        {
          headers: {
            'Content-Type': 'application/json',
            'ngrok-skip-browser-warning': 'true' // Bypass ngrok warning
          }
        }
      );

      // Add bot response to chat
      const botMessage = { 
        text: response.data.fulfillmentText || "I didn't understand that.", 
        sender: 'bot' 
      };
      setMessages(prev => [...prev, botMessage]);
    } catch (error) {
      console.error('Error:', error);
      const errorMessage = { 
        text: "Sorry, I'm having trouble connecting to the server.", 
        sender: 'bot' 
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleQuickAction = async (intent) => {
    setIsLoading(true);
    try {
      const response = await axios.post(
        'https://fb43-2402-d000-8120-db9-e99b-bcec-3e23-bd35.ngrok-free.app/webhook', 
        {
          queryResult: {
            intent: { displayName: intent },
            session: sessionId
          }
        },
        {
          headers: {
            'Content-Type': 'application/json',
            'ngrok-skip-browser-warning': 'true'
          }
        }
      );
      
      const botMessage = { 
        text: response.data.fulfillmentText, 
        sender: 'bot' 
      };
      setMessages(prev => [...prev, botMessage]);
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div style={{
      maxWidth: '500px',
      margin: '20px auto',
      padding: '20px',
      borderRadius: '12px',
      boxShadow: '0 2px 10px rgba(0,0,0,0.1)',
      backgroundColor: '#f9f9f9',
      fontFamily: 'Arial, sans-serif'
    }}>
      <h2 style={{
        textAlign: 'center',
        color: '#4285f4',
        marginBottom: '20px'
      }}>Inventory Assistant</h2>
      
      {/* Quick Action Buttons */}
      <div style={{
        display: 'flex',
        gap: '10px',
        marginBottom: '15px',
        justifyContent: 'center',
        flexWrap: 'wrap'
      }}>
        <button 
          onClick={() => handleQuickAction('get_low_stock_items')}
          disabled={isLoading}
          style={{
            padding: '8px 12px',
            backgroundColor: '#ff6b6b',
            color: 'white',
            border: 'none',
            borderRadius: '20px',
            cursor: 'pointer',
            fontSize: '14px',
            opacity: isLoading ? 0.7 : 1
          }}
        >
          Check Low Stock
        </button>
        <button 
          onClick={() => handleQuickAction('ExpiredItemCheck')}
          disabled={isLoading}
          style={{
            padding: '8px 12px',
            backgroundColor: '#ff9e4f',
            color: 'white',
            border: 'none',
            borderRadius: '20px',
            cursor: 'pointer',
            fontSize: '14px',
            opacity: isLoading ? 0.7 : 1
          }}
        >
          Check Expired Items
        </button>
      </div>
      
      {/* Chat Messages */}
      <div style={{
        height: '300px',
        overflowY: 'auto',
        marginBottom: '15px',
        padding: '15px',
        backgroundColor: 'white',
        borderRadius: '8px',
        border: '1px solid #e0e0e0'
      }}>
        {messages.map((msg, index) => (
          <div 
            key={index} 
            style={{
              marginBottom: '12px',
              padding: '10px 15px',
              borderRadius: '18px',
              maxWidth: '80%',
              wordWrap: 'break-word',
              backgroundColor: msg.sender === 'user' ? '#e3f2fd' : '#f1f1f1',
              marginLeft: msg.sender === 'user' ? 'auto' : '0',
              marginRight: msg.sender === 'bot' ? 'auto' : '0',
              borderBottomRightRadius: msg.sender === 'user' ? '4px' : '18px',
              borderBottomLeftRadius: msg.sender === 'bot' ? '4px' : '18px'
            }}
          >
            {msg.text}
          </div>
        ))}
        {isLoading && (
          <div style={{
            marginBottom: '12px',
            padding: '10px 15px',
            borderRadius: '18px',
            maxWidth: '80%',
            backgroundColor: '#f1f1f1',
            marginRight: 'auto',
            borderBottomLeftRadius: '4px'
          }}>
            <div style={{ display: 'flex', gap: '5px' }}>
              <div style={{
                width: '8px',
                height: '8px',
                borderRadius: '50%',
                backgroundColor: '#666',
                animation: 'bounce 1s infinite ease-in-out'
              }}></div>
              <div style={{
                width: '8px',
                height: '8px',
                borderRadius: '50%',
                backgroundColor: '#666',
                animation: 'bounce 1s infinite ease-in-out 0.2s'
              }}></div>
              <div style={{
                width: '8px',
                height: '8px',
                borderRadius: '50%',
                backgroundColor: '#666',
                animation: 'bounce 1s infinite ease-in-out 0.4s'
              }}></div>
            </div>
          </div>
        )}
      </div>
      
      {/* Chat Input */}
      <div style={{ display: 'flex', gap: '10px' }}>
        <input
          type="text"
          value={userInput}
          onChange={(e) => setUserInput(e.target.value)}
          placeholder="Ask about your inventory..."
          onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
          disabled={isLoading}
          style={{
            flex: 1,
            padding: '12px',
            border: '1px solid #ddd',
            borderRadius: '20px',
            outline: 'none',
            fontSize: '16px'
          }}
        />
        <button 
          onClick={handleSendMessage}
          disabled={isLoading || !userInput.trim()}
          style={{
            padding: '12px 20px',
            backgroundColor: '#34a853',
            color: 'white',
            border: 'none',
            borderRadius: '20px',
            cursor: 'pointer',
            fontSize: '16px',
            opacity: isLoading || !userInput.trim() ? 0.7 : 1
          }}
        >
          Send
        </button>
      </div>

      <style>{`
        @keyframes bounce {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-5px); }
        }
      `}</style>
    </div>
  );
};

export default InventoryAssistant;