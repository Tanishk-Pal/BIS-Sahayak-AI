import { useEffect } from "react";
import { useApp } from "./context/AppContext";
import MainLayout from "./layouts/MainLayout";
import ChatPage from "./pages/ChatPage";

function App() {
  const { theme } = useApp();

  useEffect(() => {
    document.body.className = theme;
  }, [theme]);

  return (
    <MainLayout>
      <ChatPage />
    </MainLayout>
  );
}

export default App;