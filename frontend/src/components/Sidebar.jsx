import bisLogo from "../assets/bis-logo.png";
import { useApp } from "../context/AppContext";

import {
  House,
  Settings,
  UserRound,
  Plus,
  ChevronLeft,
  ChevronRight,
  MessageSquare,
} from "lucide-react";

function Sidebar() {
  const {
    sidebarOpen,
    toggleSidebar,
    sendMessage,
    startNewChat,
    chatHistory,
    currentChatId,
  } = useApp();

  /* =====================================================
     NEW CHAT
  ===================================================== */

  function handleNewChat() {
    startNewChat();
  }

  /* =====================================================
     RECENT CHAT
  ===================================================== */

  function handleRecentChat(chat) {
    /*
      At the moment, your app does not store the complete
      messages of each chat.

      Therefore, this opens the chat using its title
      as a demo message.

      Later, when backend/chat storage is added,
      this function can load the complete conversation.
    */

    startNewChat();
    sendMessage(chat.title);
  }

  /* =====================================================
     HOME
  ===================================================== */

  function handleHome() {
    startNewChat();
  }

  /* =====================================================
     SETTINGS
  ===================================================== */

  function handleSettings() {
    alert("Settings section will be added soon.");
  }

  /* =====================================================
     PROFILE
  ===================================================== */

  function handleProfile() {
    alert("Profile section will be added soon.");
  }

  return (
    <aside
      className={`sidebar ${
        sidebarOpen ? "" : "sidebar-collapsed"
      }`}
    >
      {/* =================================================
          SIDEBAR HEADER
      ================================================= */}

      <div className="sidebar-header">
        <div className="sidebar-brand">
          <img
            src={bisLogo}
            alt="BIS Logo"
            className="sidebar-logo"
          />

          {sidebarOpen && (
            <div className="sidebar-brand-text">
              <h2>BIS Sahayak AI</h2>
              <p>Your AI Assistant</p>
            </div>
          )}
        </div>

        <button
          type="button"
          className="collapse-button"
          onClick={toggleSidebar}
          title={
            sidebarOpen
              ? "Collapse sidebar"
              : "Expand sidebar"
          }
          aria-label={
            sidebarOpen
              ? "Collapse sidebar"
              : "Expand sidebar"
          }
        >
          {sidebarOpen ? (
            <ChevronLeft size={18} />
          ) : (
            <ChevronRight size={18} />
          )}
        </button>
      </div>

      {/* =================================================
          NEW CHAT BUTTON
      ================================================= */}

      <button
        type="button"
        className="new-chat-button"
        onClick={handleNewChat}
        title="Start a new chat"
      >
        <Plus size={18} />

        {sidebarOpen && <span>New chat</span>}
      </button>

      {/* =================================================
          RECENT CHATS
      ================================================= */}

      {sidebarOpen && (
        <div className="recent-chats">
          <h4>RECENT CHATS</h4>

          {chatHistory.length > 0 ? (
            chatHistory.map((chat) => (
              <button
                type="button"
                key={chat.id}
                className={`recent-chat-item ${
                  currentChatId === chat.id ? "active" : ""
                }`}
                onClick={() => handleRecentChat(chat)}
                title={chat.title}
              >
                <MessageSquare size={14} />

                <span>{chat.title}</span>
              </button>
            ))
          ) : (
            <p className="no-recent-chats">
              No recent chats yet
            </p>
          )}
        </div>
      )}

      {/* =================================================
          BOTTOM MENU
      ================================================= */}

      <div className="sidebar-bottom">
        {/* HOME */}

        <button
          type="button"
          className="sidebar-menu-button"
          onClick={handleHome}
          title="Home"
        >
          <House size={17} />

          {sidebarOpen && <span>Home</span>}
        </button>

        {/* SETTINGS */}

        <button
          type="button"
          className="sidebar-menu-button"
          onClick={handleSettings}
          title="Settings"
        >
          <Settings size={17} />

          {sidebarOpen && <span>Settings</span>}
        </button>

        {/* PROFILE */}

        <button
          type="button"
          className="sidebar-menu-button"
          onClick={handleProfile}
          title="Profile"
        >
          <UserRound size={17} />

          {sidebarOpen && <span>Profile</span>}
        </button>

        {/* FOOTER */}

        {sidebarOpen && (
          <div className="sidebar-footer">
            <strong>BIS Sahayak AI</strong>
           
          </div>
        )}
      </div>
    </aside>
  );
}

export default Sidebar;