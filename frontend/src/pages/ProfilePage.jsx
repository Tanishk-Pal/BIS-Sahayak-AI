import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import MainLayout from "../layouts/MainLayout";

function ProfilePage() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  function handleLogout() {
    logout();
    navigate("/login");
  }

  const profileFields = Object.entries(user?.manufacturer_profile || {});

  return (
    <MainLayout>
      <div style={{ maxWidth: 520, margin: "40px auto", padding: "0 20px" }}>
        <h2 style={{ color: "var(--text-primary)", marginBottom: 24 }}>Profile</h2>

        <div
          style={{
            background: "var(--surface)",
            border: "1px solid var(--border)",
            borderRadius: 16,
            padding: 24,
            marginBottom: 16,
          }}
        >
          <div
            style={{
              width: 64,
              height: 64,
              borderRadius: "50%",
              background: "var(--brand)",
              color: "#fff",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: 24,
              fontWeight: 700,
              marginBottom: 16,
            }}
          >
            {user?.full_name?.charAt(0).toUpperCase() || "?"}
          </div>

          <Row label="Name" value={user?.full_name} />
          <Row label="Email" value={user?.email} />
          <Row
            label="Signed in with"
            value={user?.auth_provider === "google" ? "Google" : "Email & password"}
          />
          <Row
            label="Account type"
            value={
              user?.user_type
                ? user.user_type.charAt(0).toUpperCase() + user.user_type.slice(1)
                : "Not set"
            }
          />
          <Row
            label="Member since"
            value={user?.created_at ? new Date(user.created_at).toLocaleDateString() : "-"}
          />

          <button
            onClick={handleLogout}
            style={{
              marginTop: 20,
              width: "100%",
              padding: "11px 14px",
              borderRadius: 8,
              border: "1px solid #d64545",
              background: "transparent",
              color: "#d64545",
              fontWeight: 600,
              fontSize: 14,
              cursor: "pointer",
            }}
          >
            Log out
          </button>
        </div>

        {user?.user_type === "manufacturer" && (
          <div
            style={{
              background: "var(--surface)",
              border: "1px solid var(--border)",
              borderRadius: 16,
              padding: 24,
            }}
          >
            <h3 style={{ color: "var(--text-primary)", margin: "0 0 4px", fontSize: 16 }}>
              Your product profile
            </h3>
            <p style={{ color: "var(--text-secondary)", fontSize: 13, marginBottom: 16 }}>
              {user.onboarding_complete
                ? "Saved from your intake conversation - used to give you specific answers."
                : "Still being filled in - keep chatting and BIS Sahayak will complete this."}
            </p>

            {profileFields.length === 0 ? (
              <p style={{ color: "var(--text-secondary)", fontSize: 14 }}>
                Nothing saved yet - head to chat to get started.
              </p>
            ) : (
              profileFields.map(([key, value]) => (
                <Row key={key} label={formatLabel(key)} value={String(value)} />
              ))
            )}
          </div>
        )}
      </div>
    </MainLayout>
  );
}

function Row({ label, value }) {
  return (
    <div
      style={{
        display: "flex",
        justifyContent: "space-between",
        padding: "10px 0",
        borderBottom: "1px solid var(--border)",
        fontSize: 14,
        gap: 16,
      }}
    >
      <span style={{ color: "var(--text-secondary)", flexShrink: 0 }}>{label}</span>
      <span style={{ color: "var(--text-primary)", fontWeight: 500, textAlign: "right" }}>
        {value || "-"}
      </span>
    </div>
  );
}

function formatLabel(key) {
  return key
    .split("_")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
}

export default ProfilePage;
