import React from "react";
import { Link } from "react-router-dom";
import { GraduationCap, Mail, Phone, MapPin, Heart, ArrowUpRight } from "lucide-react";


export const Footer = () => {
  return (
    <footer
      style={{
        backgroundColor: "#0b1329",
        color: "#94a3b8",
        paddingTop: "5rem",
        paddingBottom: "2.5rem",
        marginTop: "auto",
        borderTop: "1px solid rgba(255, 255, 255, 0.08)",
      }}
    >
      <div className="container">
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
            gap: "3rem",
            marginBottom: "4rem",
          }}
        >
          {/* Brand Col */}
          <div>
            <div style={{ display: "flex", alignItems: "center", gap: "0.65rem", marginBottom: "1.25rem" }}>
              <div
                style={{
                  width: "40px",
                  height: "40px",
                  borderRadius: "var(--radius-md)",
                  background: "var(--primary-gradient)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  color: "#ffffff",
                }}
              >
                <GraduationCap size={22} />
              </div>
              <span
                style={{
                  fontFamily: "var(--font-heading)",
                  fontSize: "1.35rem",
                  fontWeight: 800,
                  color: "#ffffff",
                  letterSpacing: "-0.03em",
                }}
              >
                Class<span style={{ color: "#38bdf8" }}>Stream</span>
              </span>
            </div>
            <p style={{ color: "#94a3b8", fontSize: "0.9375rem", lineHeight: 1.7, marginBottom: "1.5rem" }}>
              A high-definition educational video streaming platform built for curious minds, aspiring engineers, and ambitious leaders.
            </p>
            <div style={{ display: "flex", gap: "0.75rem" }}>
              {["Twitter", "GitHub", "LinkedIn", "YouTube"].map((network) => (
                <span
                  key={network}
                  style={{
                    padding: "0.35rem 0.65rem",
                    borderRadius: "var(--radius-sm)",
                    background: "rgba(255, 255, 255, 0.06)",
                    fontSize: "0.75rem",
                    fontWeight: 600,
                    color: "#cbd5e1",
                    cursor: "pointer",
                  }}
                >
                  {network}
                </span>
              ))}
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 style={{ color: "#ffffff", fontSize: "1.05rem", marginBottom: "1.25rem" }}>Quick Links</h4>
            <ul style={{ listStyle: "none", display: "flex", flexDirection: "column", gap: "0.75rem" }}>
              <li>
                <Link to="/" style={{ color: "#94a3b8" }}>Home</Link>
              </li>
              <li>
                <Link to="/courses" style={{ color: "#94a3b8" }}>Explore All Courses</Link>
              </li>
              <li>
                <a href="/#categories" style={{ color: "#94a3b8" }}>Course Categories</a>
              </li>
              <li>
                <a href="/#why-us" style={{ color: "#94a3b8" }}>Why Class Stream</a>
              </li>
              <li>
                <Link to="/register" style={{ color: "#94a3b8" }}>Student Sign Up</Link>
              </li>
            </ul>
          </div>

          {/* Course Tracks */}
          <div>
            <h4 style={{ color: "#ffffff", fontSize: "1.05rem", marginBottom: "1.25rem" }}>Learning Tracks</h4>
            <ul style={{ listStyle: "none", display: "flex", flexDirection: "column", gap: "0.75rem" }}>
              <li>
                <Link to="/courses?category=Web%20Development" style={{ color: "#94a3b8" }}>Full-Stack Web Dev</Link>
              </li>
              <li>
                <Link to="/courses?category=Data%20Science%20%26%20AI" style={{ color: "#94a3b8" }}>Artificial Intelligence</Link>
              </li>
              <li>
                <Link to="/courses?category=Computer%20Science" style={{ color: "#94a3b8" }}>Computer Science Core</Link>
              </li>
              <li>
                <Link to="/courses?category=UI%2FUX%20%26%20Product%20Design" style={{ color: "#94a3b8" }}>UI/UX & Product Design</Link>
              </li>
              <li>
                <Link to="/courses?category=Cloud%20%26%20DevOps" style={{ color: "#94a3b8" }}>Cloud & DevOps</Link>
              </li>
            </ul>
          </div>

          {/* Support & Contact */}
          <div>
            <h4 style={{ color: "#ffffff", fontSize: "1.05rem", marginBottom: "1.25rem" }}>Support & Contact</h4>
            <div style={{ display: "flex", flexDirection: "column", gap: "0.85rem", fontSize: "0.9rem" }}>
              <div style={{ display: "flex", alignItems: "center", gap: "0.65rem" }}>
                <Mail size={16} color="#38bdf8" />
                <span>support@classstream.edu</span>
              </div>
              <div style={{ display: "flex", alignItems: "center", gap: "0.65rem" }}>
                <Phone size={16} color="#38bdf8" />
                <span>+91 (800) 425-7890</span>
              </div>
              <div style={{ display: "flex", alignItems: "center", gap: "0.65rem" }}>
                <MapPin size={16} color="#38bdf8" />
                <span>Tech Knowledge Park, Bengaluru, IN</span>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div
          style={{
            paddingTop: "2rem",
            borderTop: "1px solid rgba(255, 255, 255, 0.08)",
            display: "flex",
            flexWrap: "wrap",
            justifyContent: "space-between",
            alignItems: "center",
            gap: "1rem",
            fontSize: "0.875rem",
          }}
        >
          <div>
            &copy; {new Date().getFullYear()} Class Stream Education Inc. All rights reserved.
          </div>
          <div style={{ display: "flex", gap: "1.5rem" }}>

            <Link to="/privacy" style={{ cursor: "pointer" }}>
  Privacy Policy
</Link>
         <Link to="/terms" style={{ cursor: "pointer" }}>
  Terms of Service
</Link>
            {/* <span style={{ cursor: "pointer" }}>Cookie Preferences</span> */}
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
