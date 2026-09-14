
import bisLogo from "../assets/bis-logo.png";
import { useApp } from "../context/AppContext";

function Navbar() {
  const {
    theme,
    toggleTheme,
    sidebarOpen,
    toggleSidebar,
  } = useApp();

  return (
    <header className="navbar">
      <div className="navbar-left">
        {!sidebarOpen && (
          <button
            className="icon-button"
            onClick={toggleSidebar}
            title="Open sidebar"
            aria-label="Open sidebar"
          >
            ☰
          </button>
        )}

        <div className="mobile-brand">
          <img
  src={bisLogo}
  alt="BIS Logo"
  className="bis-logo-image"
/>

          <span>BIS Sahayak AI</span>
        </div>
      </div>

      <div className="navbar-right">
        <span className="navbar-label">
          {theme === "light" ? "Light" : "Dark"}
        </span>

        <button
          className="theme-button"
          onClick={toggleTheme}
          title="Toggle theme"
          aria-label="Toggle light and dark theme"
        >
          {theme === "light" ? "☾" : "☀"}
        </button>
      </div>
    </header>
  );
}

export default Navbar;