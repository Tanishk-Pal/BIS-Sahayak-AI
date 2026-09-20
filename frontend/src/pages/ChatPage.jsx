import bisLogo from "../assets/bis-logo.png";
import { useState } from "react";
import { Copy, Check } from "lucide-react";
import { useApp } from "../context/AppContext";
import ChatInput from "../components/ChatInput";

function ChatPage() {
  const [copiedMessageId, setCopiedMessageId] = useState(null);

  const {
    messages,
    sendMessage,
    startNewChat,
    userType,
    getWelcomeMessage,
    isTyping,
  } = useApp();

  function usePrompt(prompt) {
    sendMessage(prompt);
  }

  // =====================================================
  // CONVERT URLs INTO CLICKABLE LINKS
  // =====================================================

  function renderMessageText(text) {
    if (!text) return null;

    // Detect http:// and https:// URLs
    const urlRegex = /(https?:\/\/[^\s<>"']+)/g;

    const lines = String(text).split("\n");

    return lines.map((line, lineIndex) => {
      const parts = line.split(urlRegex);

      return (
        <span key={lineIndex}>
          {parts.map((part, partIndex) => {
            // Check whether this part is a URL
            if (/^https?:\/\/[^\s<>"']+$/.test(part)) {
              // Remove common punctuation from the end of the URL
              const match = part.match(/^(.*?)([.,!?;:]*)$/);

              const url = match ? match[1] : part;
              const punctuation = match ? match[2] : "";

              return (
                <span key={partIndex}>
                  <a
                    href={url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="chat-link"
                  >
                    {url}
                  </a>
                  {punctuation}
                </span>
              );
            }

            return (
              <span key={partIndex}>
                {part}
              </span>
            );
          })}

          {lineIndex < lines.length - 1 && <br />}
        </span>
      );
    });
  }

  // =====================================================
  // COPY AI ANSWER
  // =====================================================

  async function handleCopy(text, messageId) {
    try {
      // Try modern clipboard API
      if (navigator.clipboard && window.isSecureContext) {
        await navigator.clipboard.writeText(text);
      } else {
        // Fallback for local network HTTP
        const textArea = document.createElement("textarea");

        textArea.value = text;

        textArea.style.position = "fixed";
        textArea.style.left = "-9999px";

        document.body.appendChild(textArea);

        textArea.focus();
        textArea.select();

        const successful = document.execCommand("copy");

        document.body.removeChild(textArea);

        if (!successful) {
          throw new Error("Copy command failed");
        }
      }

      // Show check only after successful copying
      setCopiedMessageId(messageId);

      setTimeout(() => {
        setCopiedMessageId(null);
      }, 1500);
    } catch (error) {
      console.error("Copy failed:", error);

      alert("Unable to copy the answer. Please try again.");
    }
  }

  // =====================================================
  // SEND CHAT MESSAGE
  // =====================================================

  function handleChatSend({ text, file }) {
    if (file) {
      console.log("Selected file:", file);

      // File upload will be connected with backend later
    }

    if (text) {
      sendMessage(text);
    }
  }

  return (
    <div className="chat-page">
      <div className="chat-content">

        {/* =====================================================
            WELCOME SCREEN
        ===================================================== */}

        {messages.length === 0 ? (
          <div className="welcome-screen">

            <img
              src={bisLogo}
              alt="BIS Logo"
              className="bis-logo-image"
            />

            <h1>
              {userType === "manufacturer"
                ? "How can I help you, Manufacturer?"
                : "How can I help you, Consumer?"}
            </h1>

            <p className="welcome-description">
              {userType === "manufacturer"
                ? "Your BIS assistant for product certification and Indian Standards"
                : "Your BIS assistant for product safety and certification information"}
            </p>

            <p className="welcome-subtitle">
              {getWelcomeMessage()}
            </p>

            {/* =====================================================
                SUGGESTION CARDS
            ===================================================== */}

            <div className="suggestion-grid">

              <button
                className="suggestion-card"
                onClick={() =>
                  usePrompt("What is BIS certification?")
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
                  usePrompt("What are Indian Standards?")
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
                  usePrompt("How can I find BIS information?")
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

          /* =====================================================
             CHAT MESSAGES
          ===================================================== */

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

                {/* =====================================================
                    MESSAGE AVATAR
                ===================================================== */}

                <div className="message-avatar">

                  {message.sender === "user" ? (
                    "You"
                  ) : (
                    <img
                      src={bisLogo}
                      alt="BIS Logo"
                      className="message-bis-logo"
                    />
                  )}

                </div>

                {/* =====================================================
                    MESSAGE BODY
                ===================================================== */}

                <div className="message-body">

                  <strong>
                    {message.sender === "user"
                      ? "You"
                      : "BIS Sahayak AI"}
                  </strong>

                  {/* =====================================================
                      MESSAGE TEXT WITH CLICKABLE LINKS
                  ===================================================== */}

                  <p className="message-text">
                    {renderMessageText(message.text)}
                  </p>

                  {/* =====================================================
                      COPY BUTTON
                  ===================================================== */}

                  {message.sender === "ai" && (

                    <button
                      className="copy-message-button"
                      onClick={() =>
                        handleCopy(message.text, message.id)
                      }
                      title="Copy message"
                      type="button"
                    >

                      {copiedMessageId === message.id ? (
                        <Check size={16} />
                      ) : (
                        <Copy size={16} />
                      )}

                    </button>

                  )}

                </div>

              </div>

            ))}

            {/* =====================================================
                TYPING INDICATOR
            ===================================================== */}

            {isTyping && (

              <div className="message-row ai-row typing-row">

                <div className="message-avatar">

                  <img
                    src={bisLogo}
                    alt="BIS Logo"
                    className="message-bis-logo"
                  />

                </div>

                <div className="message-body">

                  <strong>
                    BIS Sahayak AI
                  </strong>

                  <div className="typing-indicator">

                    <span></span>
                    <span></span>
                    <span></span>

                  </div>

                </div>

              </div>

            )}

            {/* =====================================================
                NEW CONVERSATION
            ===================================================== */}

            <button
              className="new-conversation-button"
              onClick={startNewChat}
              type="button"
            >
              Start new conversation
            </button>

          </div>
        )}

      </div>

      {/* =====================================================
          CHAT INPUT
      ===================================================== */}

      <ChatInput onSend={handleChatSend} />

    </div>
  );
}

export default ChatPage;