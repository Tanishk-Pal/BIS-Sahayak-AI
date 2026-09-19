import bisLogo from "../assets/bis-logo.png";

function WelcomeScreen({ onPromptClick }) {
  const suggestions = [
    {
      title: "Find Indian Standards",
      description: "Search for BIS standards and requirements.",
      prompt: "What are Indian Standards?",
    },
    {
      title: "BIS Certification",
      description: "Learn about BIS certification process.",
      prompt: "What is BIS certification?",
    },
    {
      title: "Product Standards",
      description: "Find standards for your products.",
      prompt: "How can I find product standards?",
    },
    {
      title: "Consumer Help",
      description: "Get help with BIS and ISI marks.",
      prompt: "What is the ISI mark?",
    },
  ];

  return (
    <div className="welcome-screen">

      {/* Small BIS Logo */}

      <div className="welcome-logo">
        <img
          src={bisLogo}
          alt="BIS Logo"
          width="32"
          height="32"
        />
      </div>

      {/* Welcome Heading */}

      <h1>How can I help you today?</h1>

      <p className="welcome-description">
        Welcome to BIS Sahayak AI
      </p>

      <p className="welcome-subtitle">
        Your AI assistant for Bureau of Indian Standards.
      </p>

      {/* Suggestion Cards */}

      <div className="suggestion-grid">

        {suggestions.map((suggestion, index) => (
          <button
            key={index}
            className="suggestion-card"
            onClick={() => onPromptClick(suggestion.prompt)}
          >
            <span className="suggestion-icon">✦</span>

            <strong>{suggestion.title}</strong>

            <span>{suggestion.description}</span>
          </button>
        ))}

      </div>

    </div>
  );
}

export default WelcomeScreen;