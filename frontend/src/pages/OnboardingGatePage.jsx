import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useApp } from "../context/AppContext";
import { setUserType } from "../services/authService";
import bisLogo from "../assets/bis-logo.png";

function OnboardingGatePage() {
  const { user, setUser } = useAuth();
  const { sendMessage } = useApp();
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function choose(type) {
    setIsSubmitting(true);
    try {
      const updatedUser = await setUserType(type);
      setUser(updatedUser);

      if (type === "manufacturer") {
        // Kicks off the guided product-profiling conversation immediately,
        // so the user lands on /chat with the AI's first question already
        // waiting instead of an empty welcome screen. The backend sees this
        // is a manufacturer who hasn't completed onboarding and responds
        // with its first intake question rather than answering it literally.
        await sendMessage(
          "I manufacture products and would like help understanding BIS requirements."
        );
      }

      navigate("/chat");
    } catch (err) {
      alert(err.message || "Something went wrong. Please try again.");
      setIsSubmitting(false);
    }
  }

  return (
    <div
      style={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background: "var(--bg)",
        padding: 20,
      }}
    >
      <div style={{ width: "100%", maxWidth: 520, textAlign: "center" }}>
        <img src={bisLogo} alt="BIS Sahayak AI" style={{ width: 64, height: 64, marginBottom: 16 }} />
        <h2 style={{ color: "var(--text-primary)", marginBottom: 8 }}>
          Welcome, {user?.full_name?.split(" ")[0] || "there"}!
        </h2>
        <p style={{ color: "var(--text-secondary)", marginBottom: 32 }}>
          Tell us who you are so we can help you better.
        </p>

        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
          <button
            onClick={() => choose("consumer")}
            disabled={isSubmitting}
            style={choiceCardStyle}
          >
            <div style={{ fontSize: 15, fontWeight: 700, marginBottom: 6 }}>I'm a Consumer</div>
            <div style={{ fontSize: 13, color: "var(--text-secondary)" }}>
              Check ISI marks, verify a licence, or understand a standard.
            </div>
          </button>

          <button
            onClick={() => choose("manufacturer")}
            disabled={isSubmitting}
            style={choiceCardStyle}
          >
            <div style={{ fontSize: 15, fontWeight: 700, marginBottom: 6 }}>I'm a Manufacturer</div>
            <div style={{ fontSize: 13, color: "var(--text-secondary)" }}>
              Find which standards apply to your product and get a compliance roadmap.
            </div>
          </button>
        </div>

        {isSubmitting && (
          <p style={{ marginTop: 20, color: "var(--text-secondary)", fontSize: 13 }}>
            Setting things up...
          </p>
        )}
      </div>
    </div>
  );
}

const choiceCardStyle = {
  textAlign: "left",
  background: "var(--surface)",
  border: "1px solid var(--border)",
  borderRadius: 12,
  padding: 20,
  cursor: "pointer",
  color: "var(--text-primary)",
};

export default OnboardingGatePage;
