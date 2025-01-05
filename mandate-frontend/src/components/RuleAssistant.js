// src/components/RuleAssistant.js
import React, { useContext, useRef, useEffect } from "react";
import axios from "axios";
import { ChatContext } from "../components/ChatContext"; // we import the context
import "../styles/styles.css";

function RuleAssistant() {
  // Instead of local states, we read/write from the ChatContext
  const {
    messages,
    setMessages,
    currentStep,
    setCurrentStep,
    isTyping,
    setIsTyping
  } = useContext(ChatContext);

  const [input, setInput] = React.useState("");
  const chatEndRef = useRef(null);

  // Keep chat scrolled down
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isTyping]);

  const simulateTyping = (responseText, callback) => {
    setIsTyping(true);
    const delay = responseText.length * 50; // 50ms/char
    setTimeout(() => {
      setMessages((prev) => [...prev, { role: "assistant", text: responseText }]);
      setIsTyping(false);
      callback();
    }, delay);
  };

  const sendMessage = async () => {
    if (!input) return;

    // user message
    setMessages((prev) => [...prev, { role: "user", text: input }]);
    const localInput = input; // copy since we clear it
    setInput("");

    switch (currentStep) {
      case "welcome":
        simulateTyping("Great! Please type your business rule in plain English.", () => {
          setCurrentStep("collecting-rule");
        });
        break;

      case "collecting-rule":
        try {
          const feelResponse = await axios.post("http://localhost:8000/generate-feel", {
            rule_text: localInput
          });
          const feelExpression = feelResponse.data.feel_expression;

          simulateTyping(
            `Here’s the FEEL expression:\n\n<pre>${feelExpression}</pre>\n\nDoes this look correct? 'yes'/'no'`,
            () => setCurrentStep("validating-feel")
          );
        } catch (error) {
          simulateTyping("Oops! Error generating FEEL. Try again.", () => {});
        }
        break;

      // ... other steps (validating-feel, saving-dmn, posting-rule, etc.) ...
      default:
        break;
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      sendMessage();
    }
  };

  return (
    <div style={styles.chatContainer}>
      <div style={styles.chatHeader}>
        <strong>Rule Assistant</strong>
      </div>

      <div style={styles.chatBody}>
        {messages.map((msg, idx) => (
          <div
            key={idx}
            style={{
              display: "flex",
              justifyContent: msg.role === "user" ? "flex-end" : "flex-start",
              marginBottom: "10px",
            }}
          >
            <div
              style={{
                ...styles.messageBubble,
                backgroundColor: msg.role === "user" ? "#d1e7dd" : "#f8d7da",
              }}
            >
              {msg.text.includes("<pre>") ? (
                <pre
                  style={styles.preCode}
                  dangerouslySetInnerHTML={{
                    __html: msg.text.replace(/<pre>/g, "").replace(/<\/pre>/g, ""),
                  }}
                />
              ) : (
                msg.text
              )}
            </div>
          </div>
        ))}
        {isTyping && (
          <div style={{ display: "flex", justifyContent: "flex-start", marginBottom: "10px" }}>
            <div style={{ ...styles.messageBubble, backgroundColor: "#f8d7da", fontStyle: "italic" }}>
              Assistant is typing...
            </div>
          </div>
        )}
        <div ref={chatEndRef} />
      </div>

      <div style={styles.chatFooter}>
        <input
          type="text"
          style={styles.chatInput}
          placeholder="Type your message..."
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
        />
        <button style={styles.sendButton} onClick={sendMessage}>
          Send
        </button>
      </div>
    </div>
  );
}

const styles = {
  chatContainer: {
    width: "400px",
    height: "600px",
    border: "1px solid #ccc",
    borderRadius: "8px",
    display: "flex",
    flexDirection: "column",
    overflow: "hidden",
    position: "fixed",
    right: "20px",
    bottom: "20px",
    backgroundColor: "#fff",
    boxShadow: "0 4px 8px rgba(0,0,0,0.2)",
    zIndex: 9999,
  },
  chatHeader: {
    backgroundColor: "#007bff",
    color: "#fff",
    padding: "10px",
    textAlign: "center",
  },
  chatBody: {
    flex: 1,
    padding: "10px",
    overflowY: "auto",
  },
  chatFooter: {
    display: "flex",
    borderTop: "1px solid #ccc",
    padding: "10px",
  },
  chatInput: {
    flex: 1,
    padding: "8px",
    borderRadius: "4px",
    border: "1px solid #ccc",
  },
  sendButton: {
    marginLeft: "10px",
    padding: "8px 14px",
    backgroundColor: "#007bff",
    color: "#fff",
    border: "none",
    borderRadius: "4px",
  },
  messageBubble: {
    padding: "10px",
    borderRadius: "8px",
    maxWidth: "70%",
    whiteSpace: "pre-wrap",
  },
  preCode: {
    backgroundColor: "#f1f1f1",
    padding: "10px",
    borderRadius: "5px",
    overflowX: "auto",
    whiteSpace: "pre-wrap",
    wordWrap: "break-word",
  },
};

export default RuleAssistant;
