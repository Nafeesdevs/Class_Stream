import React, { useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { useToast } from "../../context/ToastContext";
import {
  GraduationCap,
  Mail,
  Lock,
  Eye,
  EyeOff,
  ArrowRight,
  Sparkles,
  ShieldCheck,
} from "lucide-react";

export const LoginPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { login } = useAuth();
  const toast = useToast();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  const redirectPath = location.state?.from?.pathname || "/dashboard";

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email || !password) {
      setErrorMsg("Please provide both email and password.");
      return;
    }

    try {
      setLoading(true);
      setErrorMsg("");
      const res = await login(email, password);
      toast.success(`Welcome back, ${res.user?.name || "Student"}!`);

      if (res.user?.role === "admin" && redirectPath === "/dashboard") {
        navigate("/admin");
      } else {
        navigate(redirectPath);
      }
    } catch (err) {
      setErrorMsg(err.formattedMessage || "Invalid email or password.");
      toast.error(err.formattedMessage || "Login failed.");
    } finally {
      setLoading(false);
    }
  };

  // Quick Demo Logins
  const handleQuickLogin = (demoEmail, demoPassword) => {
    setEmail(demoEmail);
    setPassword(demoPassword);
    setErrorMsg("");
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
            maxWidth: "440px",
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
            <h1 style={{ fontSize: "1.75rem", marginBottom: "0.5rem" }}>Welcome Back</h1>
            <p style={{ fontSize: "0.9rem", color: "var(--text-muted)" }}>
              Sign in to resume streaming your courses
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
              <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "0.45rem" }}>
                <label className="form-label" style={{ marginBottom: 0 }}>Password</label>
              </div>
              <div className="input-with-icon">
                <Lock className="input-icon-left" size={18} />
                <input
                  type={showPassword ? "text" : "password"}
                  required
                  placeholder="••••••••"
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
              {loading ? "Authenticating..." : "Sign In"}
            </button>
          </form>

          {/* Quick Demo Fill Buttons */}
          <div
            style={{
              padding: "1rem",
              borderRadius: "var(--radius-md)",
              backgroundColor: "var(--bg-subtle)",
              border: "1px dashed var(--border)",
              marginBottom: "1.5rem",
            }}
          >
            <div style={{ fontSize: "0.75rem", fontWeight: 700, textTransform: "uppercase", color: "var(--text-muted)", marginBottom: "0.5rem" }}>
              Quick Demo Accounts:
            </div>
            <div style={{ display: "flex", gap: "0.5rem" }}>
              <button
                type="button"
                onClick={() => handleQuickLogin("admin@classstream.com", "admin12345")}
                className="btn btn-outline btn-sm"
                style={{ flex: 1, fontSize: "0.78rem" }}
              >
                Admin Demo
              </button>
              <button
                type="button"
                onClick={() => handleQuickLogin("student@classstream.com", "student12345")}
                className="btn btn-outline btn-sm"
                style={{ flex: 1, fontSize: "0.78rem" }}
              >
                Student Demo
              </button>
            </div>
          </div>

          <div style={{ textAlign: "center", fontSize: "0.9rem", color: "var(--text-muted)" }}>
            Don't have an account?{" "}
            <Link to="/register" style={{ fontWeight: 600, color: "var(--primary)" }}>
              Sign up free
            </Link>
          </div>
        </div>
      </div>

      {/* Right Visual Side */}
      <div
        className="auth-banner-side"
        style={{
          flex: 1,
          background: "linear-gradient(135deg, #0f172a 0%, #1e3a8a 100%)",
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
            <span>High Definition Streaming</span>
          </div>

          <h2 style={{ color: "#ffffff", fontSize: "2.4rem", lineHeight: 1.25, marginBottom: "1.25rem" }}>
            Education Without Limits. Stream Everywhere.
          </h2>

          <p style={{ color: "rgba(255, 255, 255, 0.85)", fontSize: "1.05rem", lineHeight: 1.7, marginBottom: "2rem" }}>
            Resume watching lessons with automatic timestamp synchronization, interactive playlists, and verifiable credentials.
          </p>

          <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
            {[
              "Multi-device streaming compatibility",
              "Enterprise instructor curriculum",
              "Trial preview before full enrollment",
            ].map((text, idx) => (
              <div key={idx} style={{ display: "flex", alignItems: "center", gap: "0.65rem", fontSize: "0.95rem" }}>
                <ShieldCheck size={18} color="#38bdf8" />
                <span>{text}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
