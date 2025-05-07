import { useState, useEffect, useRef } from 'react';
import axios from 'axios';

function ChatBot() {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const chatBoxRef = useRef(null);

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    if (chatBoxRef.current) {
      chatBoxRef.current.scrollTop = chatBoxRef.current.scrollHeight;
    }
  }, [messages]);

  const sendMessage = async () => {
    if (!input.trim()) return;
    
    const userMessage = { sender: 'user', text: input };
    setMessages((prev) => [...prev, userMessage]);
    setInput('');
    setIsTyping(true);
    
    try {
      const res = await axios.post('http://localhost:5002/chatbot/chat', { message: input });
      setTimeout(() => {
        const botMessage = { sender: 'bot', text: res.data.reply };
        setMessages((prev) => [...prev, botMessage]);
        setIsTyping(false);
      }, 700);
    } catch (err) {
      console.error('Error:', err);
      setTimeout(() => {
        const errorMessage = { 
          sender: 'bot', 
          text: 'Sorry, I encountered an error. Please try again later.',
          isError: true
        };
        setMessages((prev) => [...prev, errorMessage]);
        setIsTyping(false);
      }, 700);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      sendMessage();
    }
  };

  const styles = {
    // Main container - now with full screen styling
    container: {
      width: '100%',
      height: '100vh',
      display: 'flex',
      flexDirection: 'column',
      background: 'linear-gradient(145deg, #f6f6f6, #e6e9ef)',
      fontFamily: 'Arial, sans-serif',
      border: '1px solid rgba(255, 255, 255, 0.3)',
      position: 'relative',
      overflow: 'hidden'
    },
    
    // Inner frame styling
    frame: {
      position: 'absolute',
      top: '20px',
      left: '20px',
      right: '20px',
      bottom: '20px',
      backgroundColor: 'white',
      borderRadius: '12px',
      boxShadow: '0 10px 30px rgba(0, 0, 0, 0.1)',
      display: 'flex',
      flexDirection: 'column',
      overflow: 'hidden'
    },
    
    // Header styling
    header: {
      display: 'flex',
      alignItems: 'center',
      padding: '15px 20px',
      borderBottom: '1px solid #e0e0e0',
      backgroundColor: '#fff',
      zIndex: 1
    },
    
    botAvatar: {
      width: '38px',
      height: '38px',
      backgroundColor: '#4CAF50',
      borderRadius: '50%',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      marginRight: '10px',
      color: 'white',
      fontWeight: 'bold',
      fontSize: '16px'
    },
    
    headerTitle: {
      flex: 1,
      margin: 0,
      fontSize: '18px',
      fontWeight: '600',
      color: '#333'
    },
    
    statusIndicator: {
      height: '10px',
      width: '10px',
      backgroundColor: '#4CAF50',
      borderRadius: '50%',
      display: 'inline-block',
      marginRight: '5px'
    },
    
    headerStatus: {
      fontSize: '12px',
      color: '#666'
    },
    
    // Chat container - now taking most of the space
    chatBox: {
      flex: 1,
      overflowY: 'auto',
      padding: '20px',
      background: '#fff',
      scrollBehavior: 'smooth'
    },
    
    // Message bubbles styling
    messageRow: {
      display: 'flex',
      flexDirection: 'row',
      marginBottom: '10px',
      clear: 'both',
      width: '100%'
    },
    
    messageBubble: {
      margin: '4px 0',
      padding: '12px 16px',
      borderRadius: '18px',
      maxWidth: '70%',
      wordWrap: 'break-word',
      position: 'relative',
      boxShadow: '0 1px 2px rgba(0, 0, 0, 0.1)'
    },
    
    userRow: {
      justifyContent: 'flex-end'
    },
    
    botRow: {
      justifyContent: 'flex-start'
    },
    
    user: {
      textAlign: 'right',
      color: '#fff',
      backgroundColor: '#2979FF',
      borderBottomRightRadius: '5px',
      marginLeft: 'auto'
    },
    
    bot: {
      textAlign: 'left',
      color: '#333',
      backgroundColor: '#E8E8E8',
      borderBottomLeftRadius: '5px',
      marginRight: 'auto'
    },
    
    botError: {
      backgroundColor: '#ffebee',
      color: '#c62828'
    },
    
    messageTime: {
      fontSize: '10px',
      color: '#999',
      marginTop: '5px',
      textAlign: 'right'
    },
    
    // Typing indicator
    typingIndicator: {
      display: 'flex',
      padding: '12px 15px',
      backgroundColor: '#E8E8E8',
      width: 'fit-content',
      borderRadius: '18px',
      marginBottom: '10px',
      alignItems: 'center'
    },
    
    typingDot: {
      width: '8px',
      height: '8px',
      backgroundColor: '#777',
      borderRadius: '50%',
      margin: '0 2px',
      display: 'inline-block',
      animation: 'typingAnimation 1.4s infinite ease-in-out'
    },
    
    typingDot1: {
      animationDelay: '0s'
    },
    
    typingDot2: {
      animationDelay: '0.2s'
    },
    
    typingDot3: {
      animationDelay: '0.4s'
    },
    
    // Input area styling
    inputContainer: {
      display: 'flex',
      alignItems: 'center',
      padding: '15px 20px',
      backgroundColor: '#fff',
      borderTop: '1px solid #e0e0e0',
      zIndex: 1
    },
    
    input: {
      flex: 1,
      padding: '12px 15px',
      borderRadius: '20px',
      border: '1px solid #e0e0e0',
      outline: 'none',
      fontSize: '14px',
      transition: 'border 0.3s ease',
      marginRight: '10px'
    },
    
    inputFocus: {
      border: '1px solid #2979FF',
      boxShadow: '0 0 0 2px rgba(41, 121, 255, 0.2)'
    },
    
    button: {
      padding: '10px 20px',
      borderRadius: '20px',
      border: 'none',
      backgroundColor: '#2979FF',
      color: '#fff',
      cursor: 'pointer',
      fontWeight: '600',
      transition: 'all 0.2s ease',
      outline: 'none'
    },
    
    buttonHover: {
      backgroundColor: '#1565C0',
      transform: 'translateY(-2px)',
      boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)'
    },
    
    buttonActive: {
      transform: 'translateY(0)',
      boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)'
    },
    
    // Empty state
    emptyState: {
      textAlign: 'center',
      padding: '40px 20px',
      color: '#999',
      height: '100%',
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'center',
      alignItems: 'center'
    },
    
    emptyStateIcon: {
      fontSize: '40px',
      marginBottom: '15px',
      color: '#ddd'
    },
    
    emptyStateText: {
      fontSize: '16px',
      marginBottom: '10px'
    },
    
    emptyStateSubtext: {
      fontSize: '14px'
    }
  };

  // For keyframes animation in the typing indicator
  const typingKeyframes = `
    @keyframes typingAnimation {
      0%, 60%, 100% { transform: translateY(0); }
      30% { transform: translateY(-5px); }
    }
  `;

  return (
    <div style={pageStyles.pageWrapper}>
    {/* content */}
  </div>
      
      {/* Header */}
      <div style={styles.header}>
        <div style={styles.botAvatar}>AI</div>
        <h3 style={styles.headerTitle}>ChatBot Assistant</h3>
        <div>
          <span style={styles.statusIndicator}></span>
          <span style={styles.headerStatus}>Online</span>
        </div>
      </div>
      
      {/* Chat Messages */}
      <div style={styles.chatBox} ref={chatBoxRef}>
        {messages.length === 0 ? (
          <div style={styles.emptyState}>
            <div style={styles.emptyStateIcon}>💬</div>
            <p style={styles.emptyStateText}>No messages yet</p>
            <p style={styles.emptyStateSubtext}>Send a message to start chatting</p>
          </div>
        ) : (
          messages.map((msg, index) => (
            <div 
              key={index} 
              style={{
                ...styles.messageRow,
                ...(msg.sender === 'user' ? styles.userRow : styles.botRow)
              }}
            >
              <div
                style={{
                  ...styles.messageBubble,
                  ...(msg.sender === 'user' ? styles.user : styles.bot),
                  ...(msg.isError ? styles.botError : {})
                }}
              >
                {msg.text}
                <div style={styles.messageTime}>
                  {new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </div>
              </div>
            </div>
          ))
        )}
        
        {/* Typing indicator */}
        {isTyping && (
          <div style={styles.messageRow}>
            <div style={styles.typingIndicator}>
              <div style={{...styles.typingDot, ...styles.typingDot1}}></div>
              <div style={{...styles.typingDot, ...styles.typingDot2}}></div>
              <div style={{...styles.typingDot, ...styles.typingDot3}}></div>
            </div>
          </div>
        )}
      </div>
      
      {/* Input Area */}
      <div style={styles.inputContainer}>
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyPress={handleKeyPress}
          placeholder="Type your message..."
          style={styles.input}
          onFocus={(e) => e.target.style.border = styles.inputFocus.border}
          onBlur={(e) => e.target.style.border = styles.input.border}
        />
        <button 
          onClick={sendMessage} 
          style={styles.button}
          onMouseOver={(e) => {
            e.target.style.backgroundColor = styles.buttonHover.backgroundColor;
            e.target.style.transform = styles.buttonHover.transform;
            e.target.style.boxShadow = styles.buttonHover.boxShadow;
          }}
          onMouseOut={(e) => {
            e.target.style.backgroundColor = styles.button.backgroundColor;
            e.target.style.transform = 'translateY(0)';
            e.target.style.boxShadow = 'none';
          }}
          onMouseDown={(e) => {
            e.target.style.transform = styles.buttonActive.transform;
            e.target.style.boxShadow = styles.buttonActive.boxShadow;
          }}
          onMouseUp={(e) => {
            e.target.style.transform = styles.buttonHover.transform;
            e.target.style.boxShadow = styles.buttonHover.boxShadow;
          }}
        >
          Send
        </button>
      </div>
      </div>
    </div>
  );
}

export default ChatBot;