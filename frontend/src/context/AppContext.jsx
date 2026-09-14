
import { createContext, useContext, useState } from "react";

const AppContext = createContext(null);

export function AppProvider({ children }) {
  const [theme, setTheme] = useState("light");

  const [sidebarOpen, setSidebarOpen] = useState(true);

  const [messages, setMessages] = useState([]);

  const [chatHistory, setChatHistory] = useState([
    {
      id: 1,
      title: "Welcome to BIS Sahayak AI",
    },
    {
      id: 2,
      title: "What is BIS certification?",
    },
    {
      id: 3,
      title: "Explain the ISI mark",
    },
  ]);

  function toggleTheme() {
    setTheme((currentTheme) =>
      currentTheme === "light" ? "dark" : "light"
    );
  }

  function toggleSidebar() {
    setSidebarOpen((currentState) => !currentState);
  }

  function startNewChat() {
    setMessages([]);
  }

  function sendMessage(text) {
    const userMessage = {
      id: Date.now(),
      sender: "user",
      text: text,
    };

    setMessages((previousMessages) => [
      ...previousMessages,
      userMessage,
    ]);

    const aiMessage = {
      id: Date.now() + 1,
      sender: "ai",
      text:
        "Hello! I am BIS Sahayak AI.\n\n" +
        "Your question has been received. " +
        "Real AI responses will be connected later " +
        "using a backend API.",
    };

    setTimeout(() => {
      setMessages((previousMessages) => [
        ...previousMessages,
        aiMessage,
      ]);
    }, 700);
  }

  return (
    <AppContext.Provider
      value={{
        theme,
        setTheme,
        sidebarOpen,
        toggleSidebar,
        toggleTheme,
        messages,
        sendMessage,
        startNewChat,
        chatHistory,
        setChatHistory,
      }}
    >
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const context = useContext(AppContext);

  if (!context) {
    throw new Error(
      "useApp must be used inside AppProvider"
    );
  }

  return context;
}