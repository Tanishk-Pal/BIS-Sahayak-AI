import {
  createContext,
  useContext,
  useState,
} from "react";

const AppContext = createContext(null);

export function AppProvider({ children }) {
  const [theme, setTheme] = useState("light");

  const [sidebarOpen, setSidebarOpen] = useState(true);

  const [messages, setMessages] = useState([]);
  const [isTyping, setIsTyping] = useState(false);

  const [currentChatId, setCurrentChatId] = useState(null);

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

  function getDemoReply(text) {
    const question = text.toLowerCase();

    if (
      question.includes("certification") ||
      question.includes("certificate")
    ) {
      return (
        "BIS certification confirms that a product follows " +
        "the applicable Indian Standard.\n\n" +
        "The process generally includes:\n" +
        "1. Identify the applicable Indian Standard.\n" +
        "2. Apply through the appropriate BIS process.\n" +
        "3. Product testing and inspection, if required.\n" +
        "4. BIS evaluation and approval.\n\n" +
        "The exact process depends on the product category."
      );
    }

    if (
      question.includes("isi") ||
      question.includes("mark")
    ) {
      return (
        "The ISI mark indicates that a product conforms " +
        "to the relevant Indian Standard under the applicable " +
        "BIS certification scheme.\n\n" +
        "Always check the mark and licence details carefully " +
        "before purchasing a product."
      );
    }

    if (
      question.includes("indian standard") ||
      question.includes("standard")
    ) {
      return (
        "An Indian Standard is a document that specifies " +
        "requirements, guidelines, or specifications for " +
        "products, services, or processes.\n\n" +
        "These standards help improve quality, safety, " +
        "reliability, and consistency."
      );
    }

    if (
      question.includes("hello") ||
      question.includes("hi") ||
      question.includes("hey")
    ) {
      return getWelcomeMessage();
    }

    return (
      "Thank you for your question.\n\n" +
      "I am currently running in demo mode. I can provide " +
      "basic information about BIS certification, Indian " +
      "Standards, ISI marks, and product safety.\n\n" +
      "A complete AI response system will be connected " +
      "through the backend API later."
    );
  }

  function sendMessage(text) {
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

setTimeout(() => {
  const aiMessage = {
    id: Date.now() + 1,
    sender: "ai",
    text: getDemoReply(cleanedText),
  };

  setMessages((previousMessages) => [
    ...previousMessages,
    aiMessage,
  ]);

  setIsTyping(false);
}, 1200);
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