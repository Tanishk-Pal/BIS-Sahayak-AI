
import bisLogo from "../assets/bis-logo.png";
import { useApp } from "../context/AppContext";

function Sidebar() {
  const {
    sidebarOpen,
    toggleSidebar,
    startNewChat,
    chatHistory,
  } = useApp();

  return (
    <aside
      className={`sidebar ${
        sidebarOpen
          ? "sidebar-open"
          : "sidebar-closed"
      }`}
    >
      <div className="sidebar-top">
        <div className="brand">
          <img
  src={bisLogo}
  alt="BIS Logo"
  className="bis-logo-image"
/>

          {sidebarOpen && (
            <div className="brand-text">
              <strong>BIS Sahayak AI</strong>
              <span>Your AI Assistant</span>
            </div>
          )}
        </div>

        <button
          className="icon-button"
          onClick={toggleSidebar}
          title="Toggle sidebar"
          aria-label="Toggle sidebar"
        >
          {sidebarOpen ? "‹" : "›"}
        </button>
      </div>

      <button
        className="new-chat-button"
        onClick={startNewChat}
      >
        <span>＋</span>

        {sidebarOpen && (
          <span>New chat</span>
        )}
      </button>

      {sidebarOpen && (
        <div className="history-section">
          <p className="history-title">
            Recent chats
          </p>

          {chatHistory.map((chat) => (
            <button
              className="history-item"
              key={chat.id}
            >
              <span>💬</span>
              <span>{chat.title}</span>
            </button>
          ))}
        </div>
      )}

      <div className="sidebar-bottom">
        <button className="sidebar-item">
          <span>⌂</span>

          {sidebarOpen && (
            <span>Home</span>
          )}
        </button>

        <button className="sidebar-item">
          <span>⚙</span>

          {sidebarOpen && (
            <span>Settings</span>
          )}
        </button>

        <button className="sidebar-item">
          <span>♙</span>

          {sidebarOpen && (
            <span>Profile</span>
          )}
        </button>

        {sidebarOpen && (
          <div className="sidebar-footer">
            <strong>BIS Sahayak AI</strong>
            <span>Frontend Demo</span>
          </div>
        )}
      </div>
    </aside>
  );
}

export default Sidebar;