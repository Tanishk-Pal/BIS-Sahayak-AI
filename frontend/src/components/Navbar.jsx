import bisLogo from "../assets/bis-logo.png";
import { useApp } from "../context/AppContext";

function Navbar({ user }) {
  const {
    theme,
    toggleTheme,
    sidebarOpen,
    toggleSidebar,
  } = useApp();

  return (
    <header className="navbar">
      <div className="navbar-left">
        

        
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