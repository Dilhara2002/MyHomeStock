import { useState, useEffect, useRef } from 'react';

function ChatBot() {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const chatBoxRef = useRef(null);
  const inputRef = useRef(null);

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    if (chatBoxRef.current) {
      chatBoxRef.current.scrollTop = chatBoxRef.current.scrollHeight;
    }
  }, [messages]);

  const sendMessage = async () => {
    if (!input.trim()) return;
  
    // Add user message to chat
    const userMessage = { text: input, sender: 'user' };
    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsTyping(true);
  
    try {
      const response = await fetch('http://localhost:5002/chatbot/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({ message: input })
      });
  
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
  
      const data = await response.json();
      const botMessage = { text: data.reply, sender: 'bot' };
      setMessages(prev => [...prev, botMessage]);
    } catch (error) {
      console.error('Error sending message:', error);
      const errorMessage = { 
        text: 'Sorry, there was an error processing your request.', 
        sender: 'bot',
        isError: true 
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsTyping(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      sendMessage();
    }
  };

  // Inline styles
  const styles = {
    container: {
      width: '800px',
      height: '600px',
      margin: '20px auto',
      background: 'linear-gradient(145deg, #f6f6f6, #e6e9ef)',
      fontFamily: 'Arial, sans-serif',
      borderRadius: '12px',
      boxShadow: '0 10px 30px rgba(0, 0, 0, 0.1)',
      border: '1px solid rgba(255, 255, 255, 0.3)',
      overflow: 'hidden',
      position: 'relative',
      display: 'flex',
      flexDirection: 'column'
    },
    header: {
      display: 'flex',
      alignItems: 'center',
      padding: '15px 20px',
      borderBottom: '1px solid #e0e0e0',
      backgroundColor: '#fff'
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
      fontWeight: 600,
      color: '#333'
    },
    statusWrapper: {
      display: 'flex',
      alignItems: 'center'
    },
    statusIndicator: {
      height: '10px',
      width: '10px',
      backgroundColor: '#4CAF50',
      borderRadius: '50%',
      display: 'inline-block',
      marginRight: '5px'
    },
    statusText: {
      fontSize: '12px',
      color: '#666'
    },
    chatBox: {
      flex: 1,
      overflowY: 'auto',
      padding: '20px',
      backgroundColor: '#fff'
    },
    emptyState: {
      height: '100%',
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'center',
      alignItems: 'center',
      textAlign: 'center',
      padding: '20px'
    },
    emptyIcon: {
      fontSize: '40px',
      color: '#ddd',
      marginBottom: '15px'
    },
    emptyTitle: {
      fontSize: '16px',
      color: '#999',
      marginBottom: '10px'
    },
    emptySubtitle: {
      fontSize: '14px',
      color: '#999'
    },
    messageRow: {
      display: 'flex',
      marginBottom: '10px',
      width: '100%'
    },
    userRow: {
      justifyContent: 'flex-end'
    },
    botRow: {
      justifyContent: 'flex-start'
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
    userMessage: {
      textAlign: 'right',
      color: '#fff',
      backgroundColor: '#2979FF',
      borderBottomRightRadius: '5px'
    },
    botMessage: {
      textAlign: 'left',
      color: '#333',
      backgroundColor: '#E8E8E8',
      borderBottomLeftRadius: '5px'
    },
    errorMessage: {
      backgroundColor: '#ffebee',
      color: '#c62828'
    },
    messageTime: {
      fontSize: '10px',
      color: '#999',
      marginTop: '5px',
      textAlign: 'right'
    },
    typingIndicator: {
      display: 'flex',
      padding: '12px 15px',
      backgroundColor: '#E8E8E8',
      width: 'fit-content',
      borderRadius: '18px',
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
    inputContainer: {
      display: 'flex',
      alignItems: 'center',
      padding: '12px 20px',
      backgroundColor: '#f8f9fa',
      borderTop: '1px solid #e0e0e0',
      gap: '10px'
    },
    chatInput: {
      flex: 1,
      padding: '12px 16px',
      borderRadius: '24px',
      border: '1px solid #ddd',
      outline: 'none',
      fontSize: '14px',
      transition: 'all 0.2s ease',
      backgroundColor: '#fff',
      boxShadow: 'inset 0 1px 3px rgba(0,0,0,0.1)'
    },
    chatInputFocus: {
      borderColor: '#2979FF',
      boxShadow: '0 0 0 2px rgba(41, 121, 255, 0.2)'
    },
    chatInputHasContent: {
      borderColor: '#2979FF'
    },
    sendButton: {
      padding: '12px 24px',
      borderRadius: '24px',
      border: 'none',
      backgroundColor: '#2979FF',
      color: '#fff',
      cursor: 'pointer',
      fontWeight: 600,
      fontSize: '14px',
      transition: 'all 0.2s ease',
      display: 'flex',
      alignItems: 'center'
    },
    sendButtonHover: {
      backgroundColor: '#1a68e5',
      transform: 'translateY(-1px)'
    },
    sendButtonActive: {
      transform: 'translateY(0)'
    },
    sendButtonDisabled: {
      backgroundColor: '#cccccc',
      cursor: 'not-allowed',
      transform: 'none'
    },
    sendArrow: {
      marginLeft: '6px'
    }
  };

  // Add animation styles to head
  useEffect(() => {
    const styleElement = document.createElement('style');
    styleElement.innerHTML = `
      @keyframes typingAnimation {
        0%, 60%, 100% { transform: translateY(0); }
        30% { transform: translateY(-5px); }
      }
    `;
    document.head.appendChild(styleElement);
    return () => document.head.removeChild(styleElement);
  }, []);

  // Handle focus style
  const [isInputFocused, setIsInputFocused] = useState(false);

  return (
    <div style={styles.container}>
      {/* Header */}
      <div style={styles.header}>
        <div style={styles.botAvatar}>AI</div>
        <h3 style={styles.headerTitle}>ChatBot Assistant</h3>
        <div style={styles.statusWrapper}>
          <span style={styles.statusIndicator}></span>
          <span style={styles.statusText}>Online</span>
        </div>
      </div>
      
      {/* Chat Messages */}
      <div style={styles.chatBox} ref={chatBoxRef}>
        {messages.length === 0 ? (
          <div style={styles.emptyState}>
            <div style={styles.emptyIcon}>💬</div>
            <p style={styles.emptyTitle}>No messages yet</p>
            <p style={styles.emptySubtitle}>Send a message to start chatting</p>
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
                  ...(msg.sender === 'user' 
                    ? styles.userMessage 
                    : msg.isError 
                      ? {...styles.botMessage, ...styles.errorMessage} 
                      : styles.botMessage)
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
          <div style={{...styles.messageRow, ...styles.botRow}}>
            <div style={styles.typingIndicator}>
              <div style={{...styles.typingDot, animationDelay: '0s'}}></div>
              <div style={{...styles.typingDot, animationDelay: '0.2s'}}></div>
              <div style={{...styles.typingDot, animationDelay: '0.4s'}}></div>
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
          onFocus={() => setIsInputFocused(true)}
          onBlur={() => setIsInputFocused(false)}
          placeholder="Ask me anything..."
          ref={inputRef}
          style={{
            ...styles.chatInput,
            ...(input ? styles.chatInputHasContent : {}),
            ...(isInputFocused ? styles.chatInputFocus : {})
          }}
        />
        <button 
          onClick={sendMessage} 
          disabled={!input.trim()}
          style={{
            ...styles.sendButton,
            ...(!input.trim() ? styles.sendButtonDisabled : {}),
          }}
          onMouseOver={(e) => {
            if (input.trim()) {
              e.currentTarget.style.backgroundColor = styles.sendButtonHover.backgroundColor;
              e.currentTarget.style.transform = styles.sendButtonHover.transform;
            }
          }}
          onMouseOut={(e) => {
            if (input.trim()) {
              e.currentTarget.style.backgroundColor = styles.sendButton.backgroundColor;
              e.currentTarget.style.transform = styles.sendButton.transform;
            }
          }}
          onMouseDown={(e) => {
            if (input.trim()) {
              e.currentTarget.style.transform = styles.sendButtonActive.transform;
            }
          }}
          onMouseUp={(e) => {
            if (input.trim()) {
              e.currentTarget.style.transform = styles.sendButtonHover.transform;
            }
          }}
        >
          <span>Send</span>
          <span style={styles.sendArrow}>→</span>
        </button>
      </div>
    </div>
  );
}

export default ChatBot;