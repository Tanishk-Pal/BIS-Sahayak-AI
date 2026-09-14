
import Sidebar from "../components/Sidebar";
import Navbar from "../components/Navbar";
import { useApp } from "../context/AppContext";

function MainLayout({ children }) {
  const { sidebarOpen } = useApp();

  return (
    <div className="app-shell">
      <Sidebar />

      <div
        className={`main-section ${
          sidebarOpen
            ? "sidebar-expanded"
            : "sidebar-collapsed"
        }`}
      >
        <Navbar />

        <main className="page-content">
          {children}
        </main>
      </div>
    </div>
  );
}

export default MainLayout;