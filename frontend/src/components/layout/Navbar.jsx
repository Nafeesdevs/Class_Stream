import React, { useState, useEffect, useRef } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { useToast } from "../../context/ToastContext";
import {
  GraduationCap,
  Menu,
  X,
  User,
  BookOpen,
  LogOut,
  LayoutDashboard,
  ShieldAlert,
  ChevronDown,
} from "lucide-react";

export const Navbar = () => {
  const { user, isAuthenticated, isAdmin, logout } = useAuth();
  const toast = useToast();
  const navigate = useNavigate();
  const location = useLocation();

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [profileDropdownOpen, setProfileDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);

  // Close dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setProfileDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Close mobile menu on route change
  useEffect(() => {
    setMobileMenuOpen(false);
    setProfileDropdownOpen(false);
  }, [location.pathname]);

  const handleLogout = async () => {
    try {
      await logout();
      toast.success("You have been safely logged out");
      navigate("/");
    } catch (e) {
      toast.error("Logout failed. Please try again.");
    }
  };

  const isActive = (path) => {
    if (path === "/" && location.pathname === "/") return true;
    if (path !== "/" && location.pathname.startsWith(path)) return true;
    return false;
  };

  return (
    <header
      style={{
        position: "sticky",
        top: 0,
        zIndex: 100,
        backgroundColor: "rgba(255, 255, 255, 0.88)",
        backdropFilter: "blur(16px)",
        WebkitBackdropFilter: "blur(16px)",
        borderBottom: "1px solid var(--border)",
        boxShadow: "0 1px 2px 0 rgba(15, 23, 42, 0.03)",
        transition: "all var(--transition-normal)",
      }}
    >
      <div
        className="container"
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          height: "72px",
        }}
      >
        {/* Brand Logo */}
        <Link
          to="/"
          id="nav-brand-logo"
          style={{
            display: "flex",
            alignItems: "center",
            gap: "0.75rem",
            textDecoration: "none",
          }}
        >
          <div
            style={{
              width: "40px",
              height: "40px",
              borderRadius: "10px",
              background: "linear-gradient(135deg, #1e40af 0%, #2563eb 100%)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              color: "#ffffff",
              boxShadow: "0 4px 12px rgba(37, 99, 235, 0.25)",
              position: "relative",
            }}
          >
            <GraduationCap size={22} strokeWidth={2.2} />
            <span
              style={{
                position: "absolute",
                bottom: "-2px",
                right: "-2px",
                width: "9px",
                height: "9px",
                borderRadius: "50%",
                background: "var(--success)",
                border: "2px solid #ffffff",
              }}
            />
          </div>
          <div style={{ display: "flex", flexDirection: "column" }}>
            <span
              style={{
                fontFamily: "var(--font-heading)",
                fontSize: "1.35rem",
                fontWeight: 800,
                color: "var(--text-main)",
                lineHeight: 1.1,
                letterSpacing: "-0.03em",
              }}
            >
              Class<span style={{ color: "var(--primary)" }}>Stream</span>
            </span>
            <span
              style={{
                fontSize: "0.65rem",
                fontWeight: 700,
                textTransform: "uppercase",
                letterSpacing: "0.08em",
                color: "var(--text-muted)",
              }}
            >
              Masterclass Hub
            </span>
          </div>
        </Link>

        {/* Desktop Nav Links */}
        <nav
          className="desktop-nav"
          style={{
            display: "flex",
            alignItems: "center",
            gap: "0.5rem",
            background: "rgba(15, 23, 42, 0.03)",
            padding: "0.25rem 0.4rem",
            borderRadius: "var(--radius-full)",
            border: "1px solid rgba(15, 23, 42, 0.05)",
          }}
        >
          <Link
            to="/"
            style={{
              fontWeight: 600,
              fontSize: "0.875rem",
              padding: "0.4rem 0.95rem",
              borderRadius: "var(--radius-full)",
              color: isActive("/") ? "var(--primary)" : "var(--text-body)",
              backgroundColor: isActive("/") ? "#ffffff" : "transparent",
              boxShadow: isActive("/") ? "0 1px 3px rgba(15, 23, 42, 0.08)" : "none",
              transition: "all var(--transition-fast)",
            }}
          >
            Home
          </Link>
          <Link
            to="/courses"
            style={{
              fontWeight: 600,
              fontSize: "0.875rem",
              padding: "0.4rem 0.95rem",
              borderRadius: "var(--radius-full)",
              color: isActive("/courses") ? "var(--primary)" : "var(--text-body)",
              backgroundColor: isActive("/courses") ? "#ffffff" : "transparent",
              boxShadow: isActive("/courses") ? "0 1px 3px rgba(15, 23, 42, 0.08)" : "none",
              transition: "all var(--transition-fast)",
            }}
          >
            All Courses
          </Link>
          <a
            href="/#categories"
            style={{
              fontWeight: 600,
              fontSize: "0.875rem",
              padding: "0.4rem 0.95rem",
              borderRadius: "var(--radius-full)",
              color: "var(--text-body)",
              transition: "all var(--transition-fast)",
            }}
          >
            Categories
          </a>
          <a
            href="/#why-us"
            style={{
              fontWeight: 600,
              fontSize: "0.875rem",
              padding: "0.4rem 0.95rem",
              borderRadius: "var(--radius-full)",
              color: "var(--text-body)",
              transition: "all var(--transition-fast)",
            }}
          >
            Features
          </a>
        </nav>

        {/* Desktop Actions */}
        <div
          className="desktop-nav"
          style={{
            display: "flex",
            alignItems: "center",
            gap: "0.75rem",
          }}
        >
          {isAuthenticated ? (
            <div style={{ position: "relative" }} ref={dropdownRef}>
              <button
                onClick={() => setProfileDropdownOpen(!profileDropdownOpen)}
                id="user-profile-menu-btn"
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "0.65rem",
                  background: "#ffffff",
                  border: "1px solid var(--border)",
                  padding: "0.35rem 0.75rem 0.35rem 0.4rem",
                  borderRadius: "var(--radius-full)",
                  cursor: "pointer",
                  boxShadow: "var(--shadow-xs)",
                  transition: "all var(--transition-fast)",
                }}
              >
                <div
                  style={{
                    width: "32px",
                    height: "32px",
                    borderRadius: "50%",
                    background: "var(--primary)",
                    color: "#ffffff",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontSize: "0.85rem",
                    fontWeight: 700,
                  }}
                >
                  {user?.name ? user.name.charAt(0).toUpperCase() : "U"}
                </div>
                <div style={{ textAlign: "left" }}>
                  <div
                    style={{
                      fontSize: "0.85rem",
                      fontWeight: 600,
                      color: "var(--text-main)",
                      lineHeight: 1.2,
                    }}
                  >
                    {user?.name?.split(" ")[0]}
                  </div>
                  {isAdmin && (
                    <span
                      style={{
                        fontSize: "0.65rem",
                        color: "var(--secondary)",
                        fontWeight: 700,
                        textTransform: "uppercase",
                      }}
                    >
                      Admin
                    </span>
                  )}
                </div>
                <ChevronDown size={15} color="var(--text-muted)" />
              </button>

              {/* Profile Dropdown Menu */}
              {profileDropdownOpen && (
                <div
                  className="animate-dropdown"
                  style={{
                    position: "absolute",
                    right: 0,
                    top: "calc(100% + 8px)",
                    width: "250px",
                    background: "var(--surface)",
                    borderRadius: "var(--radius-lg)",
                    boxShadow: "var(--shadow-xl)",
                    border: "1px solid var(--border)",
                    padding: "0.5rem",
                    zIndex: 200,
                  }}
                >
                  <div
                    style={{
                      padding: "0.75rem 1rem",
                      borderBottom: "1px solid var(--border-light)",
                      marginBottom: "0.35rem",
                    }}
                  >
                    <div style={{ fontWeight: 700, fontSize: "0.9rem", color: "var(--text-main)" }}>
                      {user?.name}
                    </div>
                    <div style={{ fontSize: "0.75rem", color: "var(--text-muted)", wordBreak: "break-all" }}>
                      {user?.email}
                    </div>
                  </div>

                  {isAdmin && (
                    <Link
                      to="/admin"
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "0.75rem",
                        padding: "0.65rem 1rem",
                        borderRadius: "var(--radius-md)",
                        color: "var(--secondary)",
                        fontWeight: 600,
                        fontSize: "0.875rem",
                        textDecoration: "none",
                        transition: "background var(--transition-fast)",
                      }}
                      onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = "var(--secondary-light)")}
                      onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = "transparent")}
                    >
                      <ShieldAlert size={18} />
                      Admin Console
                    </Link>
                  )}

                  <Link
                    to="/dashboard"
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "0.75rem",
                      padding: "0.65rem 1rem",
                      borderRadius: "var(--radius-md)",
                      color: "var(--text-main)",
                      fontWeight: 500,
                      fontSize: "0.875rem",
                      textDecoration: "none",
                    }}
                    onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = "var(--bg-subtle)")}
                    onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = "transparent")}
                  >
                    <LayoutDashboard size={18} color="var(--text-muted)" />
                    Student Dashboard
                  </Link>

                  <Link
                    to="/dashboard/my-learning"
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "0.75rem",
                      padding: "0.65rem 1rem",
                      borderRadius: "var(--radius-md)",
                      color: "var(--text-main)",
                      fontWeight: 500,
                      fontSize: "0.875rem",
                      textDecoration: "none",
                    }}
                    onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = "var(--bg-subtle)")}
                    onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = "transparent")}
                  >
                    <BookOpen size={18} color="var(--text-muted)" />
                    Enrolled Tracks
                  </Link>

                  <Link
                    to="/dashboard/profile"
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "0.75rem",
                      padding: "0.65rem 1rem",
                      borderRadius: "var(--radius-md)",
                      color: "var(--text-main)",
                      fontWeight: 500,
                      fontSize: "0.875rem",
                      textDecoration: "none",
                    }}
                    onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = "var(--bg-subtle)")}
                    onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = "transparent")}
                  >
                    <User size={18} color="var(--text-muted)" />
                    Account Settings
                  </Link>

                  <div style={{ height: "1px", background: "var(--border-light)", margin: "0.35rem 0" }} />

                  <button
                    onClick={handleLogout}
                    style={{
                      width: "100%",
                      display: "flex",
                      alignItems: "center",
                      gap: "0.75rem",
                      padding: "0.65rem 1rem",
                      borderRadius: "var(--radius-md)",
                      color: "var(--danger)",
                      fontWeight: 500,
                      fontSize: "0.875rem",
                      background: "none",
                      border: "none",
                      cursor: "pointer",
                      textAlign: "left",
                    }}
                    onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = "var(--danger-bg)")}
                    onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = "transparent")}
                  >
                    <LogOut size={18} />
                    Sign Out
                  </button>
                </div>
              )}
            </div>
          ) : (
            <div style={{ display: "flex", alignItems: "center", gap: "0.65rem" }}>
              <Link to="/login" className="btn btn-outline btn-sm hover-elevate">
                Sign In
              </Link>
              <Link to="/register" className="btn btn-primary btn-sm hover-elevate" style={{ boxShadow: "0 4px 12px rgba(37, 99, 235, 0.2)" }}>
                Get Started Free
              </Link>
            </div>
          )}
        </div>

        {/* Mobile Hamburger Toggle */}
        <button
          className="mobile-menu-btn"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          style={{
            display: "none",
            background: "none",
            border: "none",
            padding: "0.5rem",
            cursor: "pointer",
            color: "var(--text-main)",
          }}
          aria-label="Toggle navigation menu"
        >
          {mobileMenuOpen ? <X size={26} /> : <Menu size={26} />}
        </button>
      </div>

      {/* Mobile Menu Drawer */}
      {mobileMenuOpen && (
        <div
          className="animate-fade-in"
          style={{
            background: "var(--surface)",
            borderBottom: "1px solid var(--border)",
            padding: "1.25rem 1.5rem",
            display: "flex",
            flexDirection: "column",
            gap: "1rem",
          }}
        >
          <Link
            to="/"
            style={{
              padding: "0.6rem 0",
              fontWeight: 600,
              fontSize: "1.05rem",
              color: isActive("/") ? "var(--primary)" : "var(--text-main)",
            }}
          >
            Home
          </Link>
          <Link
            to="/courses"
            style={{
              padding: "0.6rem 0",
              fontWeight: 600,
              fontSize: "1.05rem",
              color: isActive("/courses") ? "var(--primary)" : "var(--text-main)",
            }}
          >
            All Courses
          </Link>
          <a
            href="/#categories"
            style={{
              padding: "0.6rem 0",
              fontWeight: 600,
              fontSize: "1.05rem",
              color: "var(--text-main)",
            }}
          >
            Categories
          </a>

          {isAuthenticated ? (
            <div style={{ paddingTop: "0.75rem", borderTop: "1px solid var(--border)", display: "flex", flexDirection: "column", gap: "0.75rem" }}>
              <div style={{ fontWeight: 700, color: "var(--text-main)" }}>
                Signed in as {user?.name}
              </div>
              {isAdmin && (
                <Link to="/admin" className="btn btn-secondary btn-sm" style={{ justifyContent: "flex-start" }}>
                  <ShieldAlert size={16} /> Admin Dashboard
                </Link>
              )}
              <Link to="/dashboard" className="btn btn-outline btn-sm" style={{ justifyContent: "flex-start" }}>
                <LayoutDashboard size={16} /> Dashboard Overview
              </Link>
              <Link to="/dashboard/my-learning" className="btn btn-outline btn-sm" style={{ justifyContent: "flex-start" }}>
                <BookOpen size={16} /> My Learning
              </Link>
              <button onClick={handleLogout} className="btn btn-danger btn-sm" style={{ justifyContent: "flex-start" }}>
                <LogOut size={16} /> Logout
              </button>
            </div>
          ) : (
            <div style={{ paddingTop: "0.75rem", borderTop: "1px solid var(--border)", display: "flex", gap: "0.75rem" }}>
              <Link to="/login" className="btn btn-outline" style={{ flex: 1 }}>
                Login
              </Link>
              <Link to="/register" className="btn btn-primary" style={{ flex: 1 }}>
                Sign Up
              </Link>
            </div>
          )}
        </div>
      )}
    </header>
  );
};

export default Navbar;
