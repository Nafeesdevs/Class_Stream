import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { useToast } from "../../context/ToastContext";
import {
  GraduationCap,
  Mail,
  Lock,
  User,
  Eye,
  EyeOff,
  Sparkles,
  CheckCircle2,
} from "lucide-react";

export const RegisterPage = () => {
  const navigate = useNavigate();
  const { register } = useAuth();
  const toast = useToast();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!name || !email || !password) {
      setErrorMsg("Please fill in all registration fields.");
      return;
    }

    if (password.length < 6) {
      setErrorMsg("Password must contain at least 6 characters.");
      return;
    }

    try {
      setLoading(true);
      setErrorMsg("");
      const res = await register(name, email, password);
      toast.success(`Account created! Welcome to Class Stream, ${name}.`);
      navigate("/dashboard");
    } catch (err) {
      setErrorMsg(err.formattedMessage || "Registration failed. Try a different email.");
      toast.error(err.formattedMessage || "Registration failed.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      style={{
        minHeight: "calc(100vh - 72px)",
        display: "flex",
        alignItems: "stretch",
        backgroundColor: "var(--bg-page)",
      }}
    >
      {/* Left Form Area */}
      <div
        style={{
          flex: 1,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          padding: "3rem 1.5rem",
        }}
      >
        <div
          className="animate-fade-in"
          style={{
            width: "100%",
            maxWidth: "460px",
            background: "var(--surface)",
            padding: "2.5rem",
            borderRadius: "var(--radius-xl)",
            border: "1px solid var(--border)",
            boxShadow: "var(--shadow-lg)",
          }}
        >
          <div style={{ textAlign: "center", marginBottom: "2rem" }}>
            <div
              style={{
                width: "48px",
                height: "48px",
                borderRadius: "var(--radius-md)",
                background: "var(--primary-gradient)",
                display: "inline-flex",
                alignItems: "center",
                justifyContent: "center",
                color: "#ffffff",
                marginBottom: "1rem",
              }}
            >
              <GraduationCap size={26} />
            </div>
            <h1 style={{ fontSize: "1.75rem", marginBottom: "0.5rem" }}>Create Free Account</h1>
            <p style={{ fontSize: "0.9rem", color: "var(--text-muted)" }}>
              Join Class Stream and start watching top-tier courses today
            </p>
          </div>

          {errorMsg && (
            <div
              style={{
                padding: "0.75rem 1rem",
                borderRadius: "var(--radius-md)",
                backgroundColor: "var(--danger-bg)",
                color: "var(--danger)",
                fontSize: "0.875rem",
                marginBottom: "1.5rem",
                border: "1px solid #fecaca",
              }}
            >
              {errorMsg}
            </div>
          )}

          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label className="form-label">Full Name</label>
              <div className="input-with-icon">
                <User className="input-icon-left" size={18} />
                <input
                  type="text"
                  required
                  placeholder="e.g. Alex Morgan"
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
                  placeholder="name@domain.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="form-control"
                />
              </div>
            </div>

            <div className="form-group">
              <label className="form-label">Password</label>
              <div className="input-with-icon">
                <Lock className="input-icon-left" size={18} />
                <input
                  type={showPassword ? "text" : "password"}
                  required
                  placeholder="Minimum 6 characters"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="form-control"
                />
                <button
                  type="button"
                  className="input-icon-right"
                  onClick={() => setShowPassword(!showPassword)}
                  aria-label="Toggle password visibility"
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="btn btn-primary btn-lg"
              style={{ width: "100%", marginTop: "1rem", marginBottom: "1.5rem" }}
            >
              {loading ? "Creating Account..." : "Create Account"}
            </button>
          </form>

          <div style={{ textAlign: "center", fontSize: "0.9rem", color: "var(--text-muted)" }}>
            Already have an account?{" "}
            <Link to="/login" style={{ fontWeight: 600, color: "var(--primary)" }}>
              Sign in
            </Link>
          </div>
        </div>
      </div>

      {/* Right Graphic Area */}
      <div
        className="auth-banner-side"
        style={{
          flex: 1,
          background: "linear-gradient(135deg, #1e3a8a 0%, #4f46e5 100%)",
          color: "#ffffff",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          padding: "4rem",
          position: "relative",
          overflow: "hidden",
        }}
      >
        <div style={{ maxWidth: "480px", position: "relative", zIndex: 2 }}>
          <div
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: "0.5rem",
              padding: "0.35rem 0.85rem",
              borderRadius: "var(--radius-full)",
              background: "rgba(255, 255, 255, 0.15)",
              fontSize: "0.85rem",
              fontWeight: 600,
              marginBottom: "1.5rem",
            }}
          >
            <Sparkles size={16} />
            <span>Lifelong Learning</span>
          </div>

          <h2 style={{ color: "#ffffff", fontSize: "2.4rem", lineHeight: 1.25, marginBottom: "1.25rem" }}>
            Invest In Skills That Transform Your Career
          </h2>

          <p style={{ color: "rgba(255, 255, 255, 0.85)", fontSize: "1.05rem", lineHeight: 1.7, marginBottom: "2rem" }}>
            Join 12,500+ professionals streaming high-impact courses in software architecture, design, and AI.
          </p>

          <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
            {[
              "Instant access to free courses & trial lessons",
              "Razorpay verified checkout for premium certifications",
              "Interactive video player with progress saves",
            ].map((benefit, idx) => (
              <div key={idx} style={{ display: "flex", alignItems: "center", gap: "0.65rem", fontSize: "0.95rem" }}>
                <CheckCircle2 size={18} color="#a5f3fc" />
                <span>{benefit}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default RegisterPage;
