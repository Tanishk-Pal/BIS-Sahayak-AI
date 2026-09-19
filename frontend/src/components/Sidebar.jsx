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
  LogOut,
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

  const navigate = useNavigate();

  const [profileOpen, setProfileOpen] = useState(false);
  const profileRef = useRef(null);

  const savedUser = JSON.parse(
    localStorage.getItem("bisUser") || "null"
  );

  const savedUserType =
    localStorage.getItem("userType") || "consumer";

  const userRole =
    savedUserType === "manufacturer"
      ? "Manufacturer"
      : "Consumer";

  useEffect(() => {
    function handleOutsideClick(event) {
      if (
        profileRef.current &&
        !profileRef.current.contains(event.target)
      ) {
        setProfileOpen(false);
      }
    }

    document.addEventListener("mousedown", handleOutsideClick);

    return () => {
      document.removeEventListener(
        "mousedown",
        handleOutsideClick
      );
    };
  }, []);

  function handleNewChat() {
    startNewChat();
  }

  function handleRecentChat(chat) {
    startNewChat();
    sendMessage(chat.title);
  }

  function handleHome() {
    startNewChat();
    navigate("/chat");
  }

  function handleSettings() {
    alert("Settings section will be added soon.");
  }

  function handleProfile() {
    alert("Profile section will be added soon.");
  }

  return (
    <aside
      className={`sidebar ${
        sidebarOpen ? "" : "sidebar-collapsed"
      }`}
    >
      {/* SIDEBAR HEADER */}

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

      {/* NEW CHAT */}

      <button
        type="button"
        className="new-chat-button"
        onClick={handleNewChat}
        title="Start a new chat"
      >
        <Plus size={18} />

        {sidebarOpen && <span>New chat</span>}
      </button>

      {/* RECENT CHATS */}

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

      {/* BOTTOM MENU */}

      <div className="sidebar-bottom">
        <button
          type="button"
          className="sidebar-menu-button"
          onClick={handleHome}
          title="Home"
        >
          <House size={17} />

          {sidebarOpen && <span>Home</span>}
        </button>

        <button
          type="button"
          className="sidebar-menu-button"
          onClick={handleSettings}
          title="Settings"
        >
          <Settings size={17} />

          {sidebarOpen && <span>Settings</span>}
        </button>

        {/* PROFILE SECTION */}

        <div
          className="profile-container"
          ref={profileRef}
        >
          <button
            type="button"
            className={`sidebar-menu-button ${
              profileOpen ? "profile-active" : ""
            }`}
            onClick={handleProfile}
            title="Profile"
          >
            <UserRound size={17} />

            {sidebarOpen && <span>Profile</span>}
          </button>

          {sidebarOpen && profileOpen && (
            <div className="sidebar-profile-menu">
              <div className="profile-info">
                <div className="profile-avatar">
                  <UserRound size={21} />
                </div>

                <div className="profile-details">
                  <strong>BIS User</strong>

                  <span>
                    {savedUser?.email || "User account"}
                  </span>

                  <small>{userRole}</small>
                </div>
              </div>

              <div className="profile-menu-divider"></div>

              <div className="profile-logout-row">
                <span>Logout</span>

                <button
                  type="button"
                  className="logout-icon-button"
                  onClick={handleLogout}
                  title="Logout"
                  aria-label="Logout"
                >
                  <LogOut size={19} />
                </button>
              </div>
            </div>
          )}
        </div>

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
