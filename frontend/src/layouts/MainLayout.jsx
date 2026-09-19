import Navbar from "../components/Navbar";
import Sidebar from "../components/Sidebar";

function MainLayout({ children }) {
  return (
    <div className="app-layout">
      <Navbar />

      <div className="main-content">
        <Sidebar />

        <main className="page-content">
          {children}
        </main>
      </div>
    </div>
  );
}

export default MainLayout;