// src/contexts/ChatContext.js
import React, { createContext, useState } from 'react';

// 1) Create the Context object
export const ChatContext = createContext(null);

// 2) Export a provider component
export function ChatProvider({ children }) {
  // Global chat states
  const [messages, setMessages] = useState([
    {
      role: "assistant",
      text: "Hello! I’m Rule Assistant, your smart helper for creating business rules...",
    },
  ]);
  const [currentStep, setCurrentStep] = useState("welcome");
  const [isTyping, setIsTyping] = useState(false);

  // Expose these states & setters so any component can read/write them
  const value = {
    messages,
    setMessages,
    currentStep,
    setCurrentStep,
    isTyping,
    setIsTyping
  };

  return (
    <ChatContext.Provider value={value}>
      {children}
    </ChatContext.Provider>
  );
}
