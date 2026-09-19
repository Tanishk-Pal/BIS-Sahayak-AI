import {
  createContext,
  useContext,
  useState,
} from "react";
import api from "../services/api";

const AppContext = createContext(null);

export function AppProvider({ children }) {
  const [theme, setTheme] = useState("light");

  const [sidebarOpen, setSidebarOpen] = useState(true);

  const [messages, setMessages] = useState([]);
  const [isTyping, setIsTyping] = useState(false);

  const [currentChatId, setCurrentChatId] = useState(null);
  const [sessionId, setSessionId] = useState(null);

  /*
    Current user role.

    For now, this is set to "consumer".
    Later, we will connect it with the Login page.
  */
  const [userType, setUserType] = useState("consumer");

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
    {
      id: 4,
      title: "How to apply for BIS certification?",
    },
    {
      id: 5,
      title: "What is the BIS standard mark?",
    },
    {
      id: 6,
      title: "Explain product certification",
    },
    {
      id: 7,
      title: "What is an Indian Standard?",
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
    setCurrentChatId(null);
    setSessionId(null);
  }

  function getWelcomeMessage() {
    if (userType === "manufacturer") {
      return (
        "Hello! I am BIS Sahayak AI.\n\n"

      );
    }

    return (
      "Hello! I am BIS Sahayak AI.\n\n"

    );
  }

  async function sendMessage(text) {
    const cleanedText = text.trim();

    if (!cleanedText) {
      return;
    }

    if (currentChatId === null) {
      const newChatId = Date.now();

      const newChat = {
        id: newChatId,
        title:
          cleanedText.length > 40
            ? cleanedText.substring(0, 40) + "..."
            : cleanedText,
      };

      setCurrentChatId(newChatId);

      setChatHistory((previousChats) => [
        newChat,
        ...previousChats,
      ]);
    }

    const userMessage = {
      id: Date.now(),
      sender: "user",
      text: cleanedText,
    };

    setMessages((previousMessages) => [
      ...previousMessages,
      userMessage,
    ]);

    setIsTyping(true);

    try {
      const { data } = await api.post("/chat", {
        message: cleanedText,
        userType,
        sessionId,
      });

      if (data.sessionId) {
        setSessionId(data.sessionId);
      }

      const aiMessage = {
        id: Date.now() + 1,
        sender: "ai",
        text: data.reply,
        sources: data.sources ?? [],
      };

      setMessages((previousMessages) => [
        ...previousMessages,
        aiMessage,
      ]);
    } catch (error) {
      const errorMessage = {
        id: Date.now() + 1,
        sender: "ai",
        text:
          "Sorry, I couldn't reach the BIS Sahayak backend just now. " +
          (error?.message || "Please try again in a moment."),
      };

      setMessages((previousMessages) => [
        ...previousMessages,
        errorMessage,
      ]);
    } finally {
      setIsTyping(false);
    }
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
        isTyping,

        startNewChat,

        currentChatId,

        chatHistory,
        setChatHistory,

        userType,
        setUserType,

        getWelcomeMessage,
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
