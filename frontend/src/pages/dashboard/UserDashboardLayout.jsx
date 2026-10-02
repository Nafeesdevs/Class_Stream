import React, { useEffect, useLayoutEffect, useState } from "react";
import { Outlet, NavLink, Link, useNavigate, useLocation } from "react-router-dom";
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
  Menu,
  X,
} from "lucide-react";

export const UserDashboardLayout = () => {
  const { user, logout } = useAuth();
  const toast = useToast();
  const navigate = useNavigate();
  const location = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    setMobileMenuOpen(false);
  }, [location.pathname]);

  useLayoutEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: "instant" });
  }, [location.pathname]);

  const handleLogout = async () => {
    setMobileMenuOpen(false);
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
    <div className={`container user-dashboard-shell${mobileMenuOpen ? " admin-mobile-nav-open" : ""}`} style={{ paddingTop: "2rem", paddingBottom: "5rem" }}>
      <button
        className="mobile-menu-backdrop"
        type="button"
        aria-label="Close student menu"
        aria-hidden={!mobileMenuOpen}
        tabIndex={mobileMenuOpen ? 0 : -1}
        onClick={() => setMobileMenuOpen(false)}
      />
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
          <div className="admin-mobile-header">
            <Link to="/" className="admin-mobile-brand" aria-label="ClassStream Student Dashboard">
              <span className="admin-mobile-brand-icon"><GraduationCap size={21} /></span>
              <span className="admin-mobile-brand-copy">
                <strong>ClassStream</strong>
                <small>STUDENT DASHBOARD</small>
              </span>
            </Link>
            <button
              className="admin-mobile-menu-toggle"
              type="button"
              aria-expanded={mobileMenuOpen}
              aria-controls="student-mobile-navigation"
              aria-label={mobileMenuOpen ? "Close student menu" : "Open student menu"}
              onClick={() => setMobileMenuOpen((isOpen) => !isOpen)}
            >
              {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>

          {/* User Profile Summary */}
          <div
            className="student-sidebar-profile"
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
          <nav id="student-mobile-navigation" className="dashboard-sidebar-navigation" onClick={() => setMobileMenuOpen(false)} style={{ display: "flex", flexDirection: "column", gap: "0.4rem" }}>
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

            <NavLink to="/courses" style={navItemStyle}>
              <Compass size={18} />
              <span>Explore Courses</span>
            </NavLink>

            <div className="dashboard-sidebar-footer">
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
            </div>
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
