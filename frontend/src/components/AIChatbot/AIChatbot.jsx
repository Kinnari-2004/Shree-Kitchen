import React, { useState, useEffect, useRef, useContext } from 'react';
import './AIChatbot.css';
import { StoreContext } from '../../context/StoreContext';
import axios from 'axios';

const AIChatbot = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([]);
  const [inputMessage, setInputMessage] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef(null);
  const { url } = useContext(StoreContext);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    if (isOpen && messages.length === 0) {
      setMessages([{
        text: "Namaste! 🙏 Welcome to Shree Kitchen! I'm your AI assistant powered by Google Gemini. I can help you with:\n\n• Menu recommendations\n• Dietary preferences\n• Price comparisons\n• Order assistance\n\nWhat would you like to know?",
        sender: 'bot',
        timestamp: new Date()
      }]);
    }
  }, [isOpen]);

  const handleSendMessage = async () => {
    if (inputMessage.trim() === '') return;

    const userMessage = {
      text: inputMessage,
      sender: 'user',
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    const currentInput = inputMessage;
    setInputMessage('');
    setIsTyping(true);

    try {
      // Get conversation history for context
      const conversationHistory = messages.map(msg => ({
        role: msg.sender === 'user' ? 'user' : 'assistant',
        text: msg.text
      }));

      // Call real AI backend
      const response = await axios.post(`${url}/api/ai/chat`, {
        message: currentInput,
        conversationHistory: conversationHistory
      });

      if (response.data.success) {
        const botMessage = {
          text: response.data.message,
          sender: 'bot',
          timestamp: new Date(),
          isAI: true
        };
        setMessages(prev => [...prev, botMessage]);
      } else {
        throw new Error('AI response failed');
      }
    } catch (error) {
      console.error("AI Chat Error:", error);
      const errorMessage = {
        text: "I apologize, but I'm having trouble connecting right now. Please try again in a moment, or feel free to browse our menu directly! 😊",
        sender: 'bot',
        timestamp: new Date()
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsTyping(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const quickActions = [
    { text: "What's on the menu?", icon: "📋" },
    { text: "Recommend me something spicy", icon: "🌶️" },
    { text: "Show vegetarian options", icon: "🥬" },
    { text: "What's under ₹200?", icon: "💰" }
  ];

  const handleQuickAction = (action) => {
    setInputMessage(action);
    setTimeout(() => handleSendMessage(), 100);
  };

  return (
    <>
      {/* Chatbot Toggle Button */}
      <div className={`chatbot-toggle ${isOpen ? 'open' : ''}`} onClick={() => setIsOpen(!isOpen)}>
        {isOpen ? '✕' : '💬'}
        <span className="ai-badge">AI</span>
      </div>

      {/* Chatbot Window */}
      {isOpen && (
        <div className="chatbot-window">
          <div className="chatbot-header">
            <div className="chatbot-header-content">
              <span className="chatbot-icon">🤖</span>
              <div>
                <h3>Shree Kitchen AI</h3>
                <span className="chatbot-status">
                  <span className="gemini-badge"></span>
                </span>
              </div>
            </div>
            <button className="chatbot-close" onClick={() => setIsOpen(false)}>✕</button>
          </div>

          <div className="chatbot-messages">
            {messages.map((msg, index) => (
              <div key={index} className={`message ${msg.sender}`}>
                <div className="message-content">
                  {msg.isAI && <div className="ai-indicator">✨</div>}
                  <p>{msg.text}</p>
                  <span className="message-time">
                    {msg.timestamp.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })}
                  </span>
                </div>
              </div>
            ))}
            
            {isTyping && (
              <div className="message bot">
                <div className="message-content typing">
                  <div className="typing-indicator">
                    <span></span>
                    <span></span>
                    <span></span>
                  </div>
                  <span className="typing-text">AI is thinking...</span>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Quick Actions */}
          {messages.length <= 2 && (
            <div className="quick-actions">
              {quickActions.map((action, idx) => (
                <button 
                  key={idx} 
                  className="quick-action-btn"
                  onClick={() => handleQuickAction(action.text)}
                  disabled={isTyping}
                >
                  <span>{action.icon}</span> {action.text}
                </button>
              ))}
            </div>
          )}

          <div className="chatbot-input">
            <input
              type="text"
              value={inputMessage}
              onChange={(e) => setInputMessage(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Ask me anything about our menu..."
              disabled={isTyping}
            />
            <button 
              onClick={handleSendMessage} 
              disabled={!inputMessage.trim() || isTyping}
            >
              ➤
            </button>
          </div>
        </div>
      )}
    </>
  );
};

export default AIChatbot;