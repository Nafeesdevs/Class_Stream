import React from "react";
import { Outlet, NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { useToast } from "../../context/ToastContext";
import {
  LayoutDashboard,
  BookOpen,
  CreditCard,
  User,
  LogOut,
  Compass,
  GraduationCap,
} from "lucide-react";

export const UserDashboardLayout = () => {
  const { user, logout } = useAuth();
  const toast = useToast();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    toast.success("Successfully logged out");
    navigate("/");
  };

  const navItemStyle = ({ isActive }) => ({
    display: "flex",
    alignItems: "center",
    gap: "0.75rem",
    padding: "0.75rem 1rem",
    borderRadius: "var(--radius-md)",
    fontSize: "0.925rem",
    fontWeight: isActive ? 700 : 500,
    color: isActive ? "var(--primary)" : "var(--text-muted)",
    backgroundColor: isActive ? "var(--primary-light)" : "transparent",
    textDecoration: "none",
    transition: "all var(--transition-fast)",
  });

  return (
    <div className="container" style={{ paddingTop: "2rem", paddingBottom: "5rem" }}>
      <div
        className="dashboard-layout"
        style={{
          display: "flex",
          gap: "2rem",
          alignItems: "flex-start",
        }}
      >
        {/* User Sidebar */}
        <aside
          className="dashboard-sidebar"
          style={{
            width: "260px",
            flexShrink: 0,
            background: "var(--surface)",
            padding: "1.5rem",
            borderRadius: "var(--radius-lg)",
            border: "1px solid var(--border)",
            boxShadow: "var(--shadow-xs)",
          }}
        >
          {/* User Profile Summary */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "0.85rem",
              paddingBottom: "1.25rem",
              marginBottom: "1.25rem",
              borderBottom: "1px solid var(--border-light)",
            }}
          >
            <div
              style={{
                width: "44px",
                height: "44px",
                borderRadius: "50%",
                background: "var(--primary)",
                color: "#ffffff",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontWeight: 700,
                fontSize: "1.1rem",
              }}
            >
              {user?.name?.charAt(0).toUpperCase() || "U"}
            </div>
            <div style={{ overflow: "hidden" }}>
              <div
                style={{
                  fontWeight: 700,
                  fontSize: "0.95rem",
                  color: "var(--text-main)",
                  whiteSpace: "nowrap",
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                }}
              >
                {user?.name}
              </div>
              <div
                style={{
                  fontSize: "0.75rem",
                  color: "var(--text-muted)",
                  whiteSpace: "nowrap",
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                }}
              >
                {user?.email}
              </div>
            </div>
          </div>

          {/* Navigation Links */}
          <nav style={{ display: "flex", flexDirection: "column", gap: "0.4rem" }}>
            <NavLink to="/dashboard" end style={navItemStyle}>
              <LayoutDashboard size={18} />
              <span>Overview</span>
            </NavLink>

            <NavLink to="/dashboard/my-learning" style={navItemStyle}>
              <BookOpen size={18} />
              <span>My Learning</span>
            </NavLink>

            <NavLink to="/dashboard/payments" style={navItemStyle}>
              <CreditCard size={18} />
              <span>Payment History</span>
            </NavLink>

            <NavLink to="/dashboard/profile" style={navItemStyle}>
              <User size={18} />
              <span>Profile Settings</span>
            </NavLink>

            <div style={{ height: "1px", background: "var(--border-light)", margin: "0.75rem 0" }} />

            <NavLink to="/courses" style={navItemStyle}>
              <Compass size={18} />
              <span>Explore Courses</span>
            </NavLink>

            <button
              onClick={handleLogout}
              style={{
                display: "flex",
                alignItems: "center",
                gap: "0.75rem",
                padding: "0.75rem 1rem",
                borderRadius: "var(--radius-md)",
                fontSize: "0.925rem",
                fontWeight: 500,
                color: "var(--danger)",
                backgroundColor: "transparent",
                border: "none",
                cursor: "pointer",
                textAlign: "left",
                width: "100%",
                transition: "all var(--transition-fast)",
              }}
              onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = "var(--danger-bg)")}
              onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = "transparent")}
            >
              <LogOut size={18} />
              <span>Sign Out</span>
            </button>
          </nav>
        </aside>

        {/* Dynamic Nested Content */}
        <main style={{ flex: 1, minWidth: 0 }}>
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default UserDashboardLayout;
