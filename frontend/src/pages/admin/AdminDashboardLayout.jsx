import React from "react";
import { Outlet, NavLink, Link } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import {
  BarChart3,
  BookOpen,
  FolderTree,
  GraduationCap,
  Users,
  CreditCard,
  UserCheck,
  ArrowLeft,
  ShieldAlert,
} from "lucide-react";

export const AdminDashboardLayout = () => {
  const { user } = useAuth();

  const navItemStyle = ({ isActive }) => ({
    display: "flex",
    alignItems: "center",
    gap: "0.75rem",
    padding: "0.75rem 1rem",
    borderRadius: "var(--radius-md)",
    fontSize: "0.9rem",
    fontWeight: isActive ? 700 : 500,
    color: isActive ? "var(--secondary)" : "var(--text-muted)",
    backgroundColor: isActive ? "var(--secondary-light)" : "transparent",
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
        {/* Admin Sidebar */}
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
          {/* Admin Header */}
          <div
            style={{
              paddingBottom: "1.25rem",
              marginBottom: "1.25rem",
              borderBottom: "1px solid var(--border-light)",
            }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", color: "var(--secondary)", fontWeight: 800, fontSize: "0.85rem", textTransform: "uppercase", letterSpacing: "0.05em" }}>
              <ShieldAlert size={16} />
              <span>Admin Console</span>
            </div>
            <div style={{ fontWeight: 700, fontSize: "1.05rem", marginTop: "0.25rem" }}>
              Platform Operations
            </div>
          </div>

          {/* Nav Items */}
          <nav style={{ display: "flex", flexDirection: "column", gap: "0.4rem" }}>
            <NavLink to="/admin" end style={navItemStyle}>
              <BarChart3 size={18} />
              <span>Overview & Stats</span>
            </NavLink>

            <NavLink to="/admin/courses" style={navItemStyle}>
              <BookOpen size={18} />
              <span>Manage Courses</span>
            </NavLink>

            <NavLink to="/admin/categories" style={navItemStyle}>
              <FolderTree size={18} />
              <span>Categories</span>
            </NavLink>

            <NavLink to="/admin/classes" style={navItemStyle}>
              <GraduationCap size={18} />
              <span>Class Levels</span>
            </NavLink>

            <NavLink to="/admin/users" style={navItemStyle}>
              <Users size={18} />
              <span>User Accounts</span>
            </NavLink>

            <NavLink to="/admin/payments" style={navItemStyle}>
              <CreditCard size={18} />
              <span>Platform Payments</span>
            </NavLink>

            <NavLink to="/admin/enrollments" style={navItemStyle}>
              <UserCheck size={18} />
              <span>Enrollments</span>
            </NavLink>

            <div style={{ height: "1px", background: "var(--border-light)", margin: "0.75rem 0" }} />

            <Link
              to="/"
              style={{
                display: "flex",
                alignItems: "center",
                gap: "0.75rem",
                padding: "0.75rem 1rem",
                borderRadius: "var(--radius-md)",
                fontSize: "0.9rem",
                color: "var(--text-muted)",
                textDecoration: "none",
              }}
            >
              <ArrowLeft size={16} />
              <span>Return to Site</span>
            </Link>
          </nav>
        </aside>

        {/* Dynamic Nested Admin Views */}
        <main style={{ flex: 1, minWidth: 0 }}>
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default AdminDashboardLayout;
