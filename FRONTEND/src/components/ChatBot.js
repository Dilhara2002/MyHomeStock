import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';
import { 
  Send, Bot, User, ArrowLeft, Sparkles, 
  MessageSquare, AlertCircle 
} from 'lucide-react';

function ChatBot() {
  // --- State ---
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  
  // --- Refs ---
  const chatBoxRef = useRef(null);
  const inputRef = useRef(null);

  // --- Effects ---
  // Auto-scroll to bottom
  useEffect(() => {
    if (chatBoxRef.current) {
      chatBoxRef.current.scrollTo({
        top: chatBoxRef.current.scrollHeight,
        behavior: "smooth"
      });
    }
  }, [messages, isTyping]);

  // --- Handlers ---
  const sendMessage = async () => {
    if (!input.trim()) return;
  
    const userMessage = { text: input, sender: 'user', id: Date.now() };
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
        body: JSON.stringify({ message: userMessage.text })
      });
  
      if (!response.ok) throw new Error('Network response was not ok');
  
      const data = await response.json();
      const botMessage = { text: data.reply, sender: 'bot', id: Date.now() + 1 };
      setMessages(prev => [...prev, botMessage]);
    } catch (error) {
      const errorMessage = { 
        text: 'Sorry, I encountered an error connecting to the server.', 
        sender: 'bot', 
        isError: true,
        id: Date.now() + 1
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsTyping(false);
      // Focus input back after sending (optional)
      setTimeout(() => inputRef.current?.focus(), 100);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') sendMessage();
  };

  return (
    <div style={{
      minHeight: '100vh',
      backgroundColor: '#0f172a', // Deep Slate
      color: '#f8fafc',
      paddingTop: '30px',
      paddingBottom: '30px',
      fontFamily: '"Inter", sans-serif',
      position: 'relative',
      display: 'flex',
      flexDirection: 'column',
      overflow: 'hidden'
    }}>
      
      {/* CSS for custom scrollbar */}
      <style>
        {`
          .custom-scrollbar::-webkit-scrollbar { width: 6px; }
          .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
          .custom-scrollbar::-webkit-scrollbar-thumb { background: rgba(255, 255, 255, 0.1); border-radius: 10px; }
          .custom-scrollbar::-webkit-scrollbar-thumb:hover { background: rgba(255, 255, 255, 0.2); }
        `}
      </style>

      {/* Background Glow */}
      <div style={{
        position: 'absolute', top: '-20%', left: '50%', transform: 'translateX(-50%)',
        width: '800px', height: '800px',
        background: 'radial-gradient(circle, rgba(56, 189, 248, 0.15) 0%, rgba(15, 23, 42, 0) 70%)',
        zIndex: 0, pointerEvents: 'none'
      }} />

      <div className="container d-flex flex-column" style={{ position: 'relative', zIndex: 1, flex: 1, maxWidth: '900px' }}>
        
        {/* --- Header --- */}
        <div className="d-flex align-items-center mb-4 pb-3" style={{ borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
          <Link to="/" className="text-decoration-none me-4">
            <motion.div 
              whileHover={{ scale: 1.1, backgroundColor: 'rgba(56, 189, 248, 0.2)', borderColor: '#38bdf8' }}
              whileTap={{ scale: 0.9 }}
              style={{
                width: '45px', height: '45px', borderRadius: '50%',
                backgroundColor: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)',
                display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#e2e8f0'
              }}
            >
              <ArrowLeft size={22} />
            </motion.div>
          </Link>
          
          <div className="d-flex align-items-center">
            <div style={{ 
              width: '45px', height: '45px', borderRadius: '12px', 
              background: 'linear-gradient(135deg, #38bdf8 0%, #3b82f6 100%)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              boxShadow: '0 0 15px rgba(56, 189, 248, 0.4)',
              marginRight: '15px'
            }}>
               <Bot size={24} color="white" />
            </div>
            <div>
              <h4 className="fw-bold m-0 text-white">AI Assistant</h4>
              <div className="d-flex align-items-center">
                <span style={{ 
                  width: '8px', height: '8px', backgroundColor: '#4ade80', 
                  borderRadius: '50%', display: 'inline-block', marginRight: '6px',
                  boxShadow: '0 0 8px #4ade80'
                }}></span>
                <span className="small text-muted">Online & Ready</span>
              </div>
            </div>
          </div>
        </div>

        {/* --- Chat Area --- */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="card border-0 d-flex flex-column flex-grow-1 shadow-lg"
          style={{
            backgroundColor: 'rgba(30, 41, 59, 0.6)',
            backdropFilter: 'blur(20px)',
            borderRadius: '24px',
            border: '1px solid rgba(255, 255, 255, 0.08)',
            overflow: 'hidden',
            height: '600px' // Fixed height or flex-grow
          }}
        >
          {/* Messages Container */}
          <div 
            ref={chatBoxRef}
            className="card-body p-4 custom-scrollbar" 
            style={{ 
              overflowY: 'auto', 
              flex: 1,
              display: 'flex',
              flexDirection: 'column'
            }}
          >
            {messages.length === 0 ? (
              <div className="h-100 d-flex flex-column align-items-center justify-content-center text-center opacity-50">
                <div style={{ 
                  width: '80px', height: '80px', borderRadius: '50%', 
                  background: 'rgba(255,255,255,0.05)', display: 'flex', 
                  alignItems: 'center', justifyContent: 'center', marginBottom: '20px'
                }}>
                  <Sparkles size={40} color="#94a3b8" />
                </div>
                <h4 className="fw-light">How can I help you today?</h4>
                <p className="small text-muted">Ask about inventory, recipes, or settings.</p>
              </div>
            ) : (
              <AnimatePresence>
                {messages.map((msg, index) => (
                  <motion.div
                    key={msg.id || index}
                    initial={{ opacity: 0, y: 10, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    transition={{ duration: 0.3 }}
                    className={`d-flex mb-3 ${msg.sender === 'user' ? 'justify-content-end' : 'justify-content-start'}`}
                  >
                    {/* Bot Icon */}
                    {msg.sender === 'bot' && (
                      <div className="me-2 d-flex align-items-end">
                        <div style={{ width: '30px', height: '30px', borderRadius: '50%', background: 'rgba(56, 189, 248, 0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#38bdf8' }}>
                          <Bot size={16} />
                        </div>
                      </div>
                    )}

                    {/* Bubble */}
                    <div style={{
                      maxWidth: '75%',
                      padding: '14px 18px',
                      borderRadius: '18px',
                      borderTopLeftRadius: msg.sender === 'bot' ? '4px' : '18px',
                      borderTopRightRadius: msg.sender === 'user' ? '4px' : '18px',
                      backgroundColor: msg.sender === 'user' 
                        ? '#3b82f6' // Fallback
                        : msg.isError ? 'rgba(239, 68, 68, 0.1)' : 'rgba(15, 23, 42, 0.6)',
                      background: msg.sender === 'user' 
                        ? 'linear-gradient(135deg, #3b82f6 0%, #2563eb 100%)' 
                        : null,
                      border: msg.sender === 'bot' ? '1px solid rgba(255,255,255,0.05)' : 'none',
                      color: msg.isError ? '#f87171' : (msg.sender === 'user' ? 'white' : '#e2e8f0'),
                      boxShadow: msg.sender === 'user' ? '0 4px 15px rgba(37, 99, 235, 0.3)' : 'none',
                      position: 'relative'
                    }}>
                      {msg.isError && <AlertCircle size={16} className="me-2 mb-1" style={{ display: 'inline' }} />}
                      {msg.text}
                      
                      {/* Timestamp */}
                      <div className="text-end mt-1" style={{ 
                        fontSize: '0.7rem', 
                        opacity: 0.6,
                        color: msg.sender === 'user' ? 'rgba(255,255,255,0.8)' : '#94a3b8' 
                      }}>
                        {new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </div>
                    </div>

                    {/* User Icon */}
                    {msg.sender === 'user' && (
                      <div className="ms-2 d-flex align-items-end">
                         <div style={{ width: '30px', height: '30px', borderRadius: '50%', background: 'rgba(255,255,255,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#cbd5e1' }}>
                          <User size={16} />
                        </div>
                      </div>
                    )}
                  </motion.div>
                ))}
              </AnimatePresence>
            )}

            {/* Typing Indicator */}
            {isTyping && (
              <motion.div 
                initial={{ opacity: 0 }} 
                animate={{ opacity: 1 }}
                className="d-flex align-items-center text-muted ms-1"
              >
                <div style={{ width: '30px', height: '30px', marginRight: '8px' }}></div>
                <div className="p-3 rounded-4" style={{ backgroundColor: 'rgba(15, 23, 42, 0.6)', border: '1px solid rgba(255,255,255,0.05)' }}>
                  <div className="d-flex align-items-center">
                    <motion.span 
                      animate={{ opacity: [0.4, 1, 0.4] }} 
                      transition={{ duration: 1, repeat: Infinity, delay: 0 }}
                      style={{ width: '6px', height: '6px', background: '#94a3b8', borderRadius: '50%', margin: '0 2px' }} 
                    />
                    <motion.span 
                      animate={{ opacity: [0.4, 1, 0.4] }} 
                      transition={{ duration: 1, repeat: Infinity, delay: 0.2 }}
                      style={{ width: '6px', height: '6px', background: '#94a3b8', borderRadius: '50%', margin: '0 2px' }} 
                    />
                    <motion.span 
                      animate={{ opacity: [0.4, 1, 0.4] }} 
                      transition={{ duration: 1, repeat: Infinity, delay: 0.4 }}
                      style={{ width: '6px', height: '6px', background: '#94a3b8', borderRadius: '50%', margin: '0 2px' }} 
                    />
                  </div>
                </div>
              </motion.div>
            )}
          </div>

          {/* Input Area */}
          <div className="p-3" style={{ 
            backgroundColor: 'rgba(15, 23, 42, 0.8)', 
            borderTop: '1px solid rgba(255, 255, 255, 0.05)' 
          }}>
            <div className="d-flex align-items-center position-relative">
              <input
                ref={inputRef}
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Type your message..."
                style={{
                  width: '100%',
                  padding: '14px 20px',
                  paddingRight: '60px',
                  borderRadius: '16px',
                  border: '1px solid rgba(255, 255, 255, 0.1)',
                  backgroundColor: 'rgba(30, 41, 59, 0.5)',
                  color: '#fff',
                  outline: 'none',
                  fontSize: '0.95rem'
                }}
              />
              <motion.button 
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={sendMessage}
                disabled={!input.trim()}
                className="btn position-absolute"
                style={{
                  right: '8px',
                  top: '6px',
                  borderRadius: '12px',
                  background: input.trim() ? '#3b82f6' : 'rgba(255,255,255,0.1)',
                  color: input.trim() ? 'white' : 'rgba(255,255,255,0.3)',
                  border: 'none',
                  padding: '8px 12px',
                  cursor: input.trim() ? 'pointer' : 'default'
                }}
              >
                <Send size={18} />
              </motion.button>
            </div>
            <div className="text-center mt-2">
              <span style={{ fontSize: '0.7rem', color: '#64748b' }}>AI can make mistakes. Please verify important information.</span>
            </div>
          </div>

        </motion.div>
      </div>
    </div>
  );
}

export default ChatBot;