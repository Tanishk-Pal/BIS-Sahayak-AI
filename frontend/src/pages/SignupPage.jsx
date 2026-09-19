import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { signup } from "../services/authService";
import GoogleSignInButton from "../components/GoogleSignInButton";
import bisLogo from "../assets/bis-logo.png";

function SignupPage() {
  const { loginSuccess } = useAuth();
  const navigate = useNavigate();

  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    setError(null);
    setIsSubmitting(true);

    try {
      const data = await signup({ email, password, full_name: fullName });
      loginSuccess(data);
      navigate("/chat");
    } catch (err) {
      setError(err.message || "Could not create your account.");
    } finally {
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
      <div
        style={{
          width: "100%",
          maxWidth: 380,
          background: "var(--surface)",
          border: "1px solid var(--border)",
          borderRadius: 16,
          padding: 32,
        }}
      >
        <div style={{ textAlign: "center", marginBottom: 24 }}>
          <img src={bisLogo} alt="BIS Sahayak AI" style={{ width: 56, height: 56, marginBottom: 12 }} />
          <h2 style={{ margin: 0, color: "var(--text-primary)" }}>Create your account</h2>
          <p style={{ margin: "6px 0 0", color: "var(--text-secondary)", fontSize: 14 }}>
            Get started with BIS Sahayak AI
          </p>
        </div>

        <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: 12 }}>
          <input
            type="text"
            placeholder="Full name"
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
            required
            style={inputStyle}
          />
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            style={inputStyle}
          />
          <input
            type="password"
            placeholder="Password (min 8 characters)"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            minLength={8}
            style={inputStyle}
          />

          {error && (
            <div style={{ color: "#d64545", fontSize: 13, textAlign: "center" }}>{error}</div>
          )}

          <button type="submit" disabled={isSubmitting} style={primaryButtonStyle}>
            {isSubmitting ? "Creating account..." : "Sign up"}
          </button>
        </form>

        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 10,
            margin: "20px 0",
            color: "var(--text-secondary)",
            fontSize: 13,
          }}
        >
          <div style={{ flex: 1, height: 1, background: "var(--border)" }} />
          or
          <div style={{ flex: 1, height: 1, background: "var(--border)" }} />
        </div>

        <div style={{ display: "flex", justifyContent: "center" }}>
          <GoogleSignInButton />
        </div>

        <p style={{ textAlign: "center", marginTop: 24, fontSize: 14, color: "var(--text-secondary)" }}>
          Already have an account? <Link to="/login" style={{ color: "var(--brand)" }}>Log in</Link>
        </p>
      </div>
    </div>
  );
}

const inputStyle = {
  padding: "11px 14px",
  borderRadius: 8,
  border: "1px solid var(--border)",
  background: "var(--input-bg, var(--surface))",
  color: "var(--text-primary)",
  fontSize: 14,
};

const primaryButtonStyle = {
  padding: "11px 14px",
  borderRadius: 8,
  border: "none",
  background: "var(--brand)",
  color: "#fff",
  fontWeight: 600,
  fontSize: 14,
  cursor: "pointer",
};

export default SignupPage;
