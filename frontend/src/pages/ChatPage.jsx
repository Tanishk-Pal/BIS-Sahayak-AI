
import bisLogo from "../assets/bis-logo.png";
import { useState } from "react";
import { useApp } from "../context/AppContext";

function ChatPage() {
  const {
    messages,
    sendMessage,
    startNewChat,
  } = useApp();

  const [input, setInput] = useState("");

  function handleSend() {
    const text = input.trim();

    if (!text) return;

    sendMessage(text);
    setInput("");
  }

  function handleKeyDown(event) {
    if (event.key === "Enter" && !event.shiftKey) {
      event.preventDefault();
      handleSend();
    }
  }

  function usePrompt(prompt) {
    sendMessage(prompt);
  }

  return (
    <div className="chat-page">
      <div className="chat-content">
        {messages.length === 0 ? (
          <div className="welcome-screen">
           <img
  src={bisLogo}
  alt="BIS Logo"
  className="bis-logo-image"
/>

            <h1>How can I help you today?</h1>

            <p className="welcome-description">
              Welcome to BIS Sahayak AI
            </p>

            <p className="welcome-subtitle">
              Your AI assistant for BIS standards,
              certification, and quality information.
            </p>

            <div className="suggestion-grid">
              <button
                className="suggestion-card"
                onClick={() =>
                  usePrompt(
                    "What is BIS certification?"
                  )
                }
              >
                <span className="suggestion-icon">
                  📋
                </span>

                <strong>
                  What is BIS certification?
                </strong>

                <span>
                  Learn about BIS standards
                </span>
              </button>

              <button
                className="suggestion-card"
                onClick={() =>
                  usePrompt("Explain the ISI mark")
                }
              >
                <span className="suggestion-icon">
                  🏷️
                </span>

                <strong>
                  Explain the ISI mark
                </strong>

                <span>
                  Understand product certification
                </span>
              </button>

              <button
                className="suggestion-card"
                onClick={() =>
                  usePrompt(
                    "What are Indian Standards?"
                  )
                }
              >
                <span className="suggestion-icon">
                  📚
                </span>

                <strong>
                  What are Indian Standards?
                </strong>

                <span>
                  Explore quality standards
                </span>
              </button>

              <button
                className="suggestion-card"
                onClick={() =>
                  usePrompt(
                    "How can I find BIS information?"
                  )
                }
              >
                <span className="suggestion-icon">
                  🔍
                </span>

                <strong>
                  Find BIS information
                </strong>

                <span>
                  Get help with BIS resources
                </span>
              </button>
            </div>
          </div>
        ) : (
          <div className="messages-container">
            {messages.map((message) => (
              <div
                className={`message-row ${
                  message.sender === "user"
                    ? "user-row"
                    : "ai-row"
                }`}
                key={message.id}
              >
                <div className="message-avatar">
                  {message.sender === "user"
                    ? "You"
                    : "BIS"}
                </div>

                <div className="message-body">
                  <strong>
                    {message.sender === "user"
                      ? "You"
                      : "BIS Sahayak AI"}
                  </strong>

                  <p>{message.text}</p>
                </div>
              </div>
            ))}

            <button
              className="new-conversation-button"
              onClick={startNewChat}
            >
              Start new conversation
            </button>
          </div>
        )}
      </div>

      <div className="chat-input-area">
        <div className="chat-input-wrapper">
          <textarea
            value={input}
            onChange={(event) =>
              setInput(event.target.value)
            }
            onKeyDown={handleKeyDown}
            placeholder="Message BIS Sahayak AI..."
            rows="1"
            aria-label="Message BIS Sahayak AI"
          />

          <button
            className="send-button"
            onClick={handleSend}
            disabled={!input.trim()}
            title="Send message"
            aria-label="Send message"
          >
            ↑
          </button>
        </div>

        <p className="input-disclaimer">
          BIS Sahayak AI can make mistakes.
          Verify important information with official BIS sources.
        </p>
      </div>
    </div>
  );
}

export default ChatPage;