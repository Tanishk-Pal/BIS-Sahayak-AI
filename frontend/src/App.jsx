import { useEffect } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import { useApp } from "./context/AppContext";
import MainLayout from "./layouts/MainLayout";
import ChatPage from "./pages/ChatPage";
import LoginPage from "./pages/LoginPage";
import SignupPage from "./pages/SignupPage";
import ProfilePage from "./pages/ProfilePage";
import OnboardingGatePage from "./pages/OnboardingGatePage";
import ProtectedRoute from "./components/ProtectedRoute";
import RequireUserType from "./components/RequireUserType";

function App() {
  const { theme } = useApp();

  useEffect(() => {
    document.body.className = theme;
  }, [theme]);

  return (
    <Routes>
      <Route path="/login" element={<LoginPage />} />
      <Route path="/signup" element={<SignupPage />} />
      <Route
        path="/onboarding"
        element={
          <ProtectedRoute>
            <OnboardingGatePage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/chat"
        element={
          <ProtectedRoute>
            <RequireUserType>
              <MainLayout>
                <ChatPage />
              </MainLayout>
            </RequireUserType>
          </ProtectedRoute>
        }
      />
      <Route
        path="/profile"
        element={
          <ProtectedRoute>
            <ProfilePage />
          </ProtectedRoute>
        }
      />
      <Route path="*" element={<Navigate to="/chat" replace />} />
    </Routes>
  );
}

export default App;
