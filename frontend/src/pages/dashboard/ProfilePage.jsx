import React, { useState } from "react";
import { useAuth } from "../../context/AuthContext";
import { useToast } from "../../context/ToastContext";
import { User, Mail, Shield, Save, Camera } from "lucide-react";

export const ProfilePage = () => {
  const { user, updateUserProfile } = useAuth();
  const toast = useToast();

  const [name, setName] = useState(user?.name || "");
  const [email, setEmail] = useState(user?.email || "");
  const [avatar, setAvatar] = useState(user?.avatar || "");
  const [loading, setLoading] = useState(false);

  const handleUpdate = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      await updateUserProfile({ name, email, avatar });
      toast.success("Profile updated successfully!");
    } catch (err) {
      toast.error(err.formattedMessage || "Failed to update profile.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="animate-fade-in" style={{ maxWidth: "680px" }}>
      <div style={{ marginBottom: "2rem" }}>
        <h1 style={{ fontSize: "1.75rem", marginBottom: "0.5rem" }}>Profile Settings</h1>
        <p style={{ color: "var(--text-muted)", fontSize: "0.95rem" }}>
          Manage your account credentials, display name, and avatar settings.
        </p>
      </div>

      <div className="card" style={{ padding: "2rem" }}>
        {/* User Visual Card */}
        <div style={{ display: "flex", alignItems: "center", gap: "1.25rem", paddingBottom: "1.75rem", marginBottom: "1.75rem", borderBottom: "1px solid var(--border-light)" }}>
          <div
            style={{
              width: "72px",
              height: "72px",
              borderRadius: "50%",
              background: "var(--primary)",
              color: "#ffffff",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: "1.8rem",
              fontWeight: 800,
              overflow: "hidden",
            }}
          >
            {avatar ? (
              <img src={avatar} alt={user?.name} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
            ) : (
              user?.name?.charAt(0).toUpperCase() || "U"
            )}
          </div>
          <div>
            <h3 style={{ fontSize: "1.25rem" }}>{user?.name}</h3>
            <div style={{ fontSize: "0.85rem", color: "var(--text-muted)", marginTop: "2px" }}>
              {user?.email}
            </div>
            <div style={{ marginTop: "0.5rem" }}>
              <span className={`badge ${user?.role === "admin" ? "badge-sub" : "badge-primary"}`}>
                Role: {user?.role?.toUpperCase()}
              </span>
            </div>
          </div>
        </div>

        {/* Update Form */}
        <form onSubmit={handleUpdate}>
          <div className="form-group">
            <label className="form-label">Display Name</label>
            <div className="input-with-icon">
              <User className="input-icon-left" size={18} />
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="form-control"
              />
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">Email Address</label>
            <div className="input-with-icon">
              <Mail className="input-icon-left" size={18} />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="form-control"
              />
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">Avatar Image URL (Optional)</label>
            <div className="input-with-icon">
              <Camera className="input-icon-left" size={18} />
              <input
                type="url"
                placeholder="https://images.unsplash.com/..."
                value={avatar}
                onChange={(e) => setAvatar(e.target.value)}
                className="form-control"
              />
            </div>
          </div>

          <div style={{ marginTop: "2rem" }}>
            <button
              type="submit"
              disabled={loading}
              className="btn btn-primary"
              style={{ gap: "0.5rem" }}
            >
              <Save size={18} />
              <span>{loading ? "Saving Changes..." : "Save Profile"}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ProfilePage;
