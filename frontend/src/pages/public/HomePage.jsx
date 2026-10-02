import React, { useState, useEffect, useRef } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import courseService from "../../services/courseService";
import categoryService from "../../services/categoryService";
import growthHighlightService from "../../services/growthHighlightService";
import CourseCard from "../../components/common/CourseCard";
import { CourseSkeletonCard } from "../../components/common/LoadingSkeleton";
import {
  Search,
  Sparkles,
  ArrowRight,
  Play,
  ShieldCheck,
  Video,
  Award,
  Zap,
  CheckCircle,
  Users,
  BookOpen,
  Layers,
  Clock,
  Star,
  Check,
  Code,
  Flame,
  Cpu,
} from "lucide-react";

const defaultGrowthStats = [
  { value: 14000, suffix: "+", label: "Active Enrolled Students", sub: "Global engineering cohort" },
  { value: 150, suffix: "+", label: "HD Masterclass Tracks", sub: "Zero-buffering video lessons" },
  { value: 25, suffix: "+", label: "Specialized Curriculums", sub: "Frontend, AI, Cloud & Systems" },
  { value: 98.6, suffix: "%", label: "Course Satisfaction", sub: "Verified post-completion rating" },
];

const AnimatedStatValue = ({ value, suffix, isVisible }) => {
  const [count, setCount] = useState(0);
  const precision = String(value).split(".")[1]?.length || 0;

  useEffect(() => {
    if (!isVisible) {
      setCount(0);
      return undefined;
    }

    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduceMotion) {
      setCount(value);
      return undefined;
    }

    let frameId;
    let startTime;
    const duration = 1300;

    const animate = (time) => {
      if (startTime === undefined) startTime = time;
      const progress = Math.min((time - startTime) / duration, 1);
      const easedProgress = 1 - Math.pow(1 - progress, 3);
      setCount(value * easedProgress);
      if (progress < 1) frameId = requestAnimationFrame(animate);
    };

    frameId = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(frameId);
  }, [isVisible, value]);

  const formattedCount = new Intl.NumberFormat("en-US", {
    minimumFractionDigits: precision,
    maximumFractionDigits: precision,
  }).format(count);

  return <>{formattedCount}<span style={{ color: "var(--primary)" }}>{suffix}</span></>;
};

export const HomePage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [courses, setCourses] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [growthStats, setGrowthStats] = useState(defaultGrowthStats);
  const [statsVisible, setStatsVisible] = useState(false);
  const statsSectionRef = useRef(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [courseRes, catRes] = await Promise.all([
          courseService.getAllCourses(),
          categoryService.getAllCategories(),
        ]);

        if (courseRes?.courses) {
          setCourses(courseRes.courses.slice(0, 6));
        }
        if (catRes?.category) {
          setCategories(catRes.category);
        }
      } catch (err) {
        console.warn("Home page data load warning:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  useEffect(() => {
    growthHighlightService.getGrowthHighlights()
      .then((response) => {
        const savedStats = response?.growthHighlights?.stats;
        if (Array.isArray(savedStats) && savedStats.length === 4) {
          setGrowthStats(savedStats);
        }
      })
      .catch((err) => console.warn("Growth highlights load warning:", err));
  }, []);

  useEffect(() => {
    const section = statsSectionRef.current;
    if (!section) return undefined;

    const observer = new IntersectionObserver(
      ([entry]) => setStatsVisible(entry.isIntersecting),
      { rootMargin: "0px 0px -8% 0px", threshold: 0.15 }
    );
    observer.observe(section);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (!location.hash) return;

    const sectionId = decodeURIComponent(location.hash.slice(1));
    const frame = requestAnimationFrame(() => {
      document.getElementById(sectionId)?.scrollIntoView({ behavior: "smooth" });
    });

    return () => cancelAnimationFrame(frame);
  }, [location.hash]);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/courses?keyword=${encodeURIComponent(searchQuery.trim())}`);
    } else {
      navigate("/courses");
    }
  };

  return (
    <div className="animate-fade-in responsive-page home-page">
      {/* 1. HERO SECTION */}
      <section
        style={{
          background: "radial-gradient(ellipse at 50% -20%, rgba(37, 99, 235, 0.12) 0%, rgba(248, 250, 252, 0.6) 50%, #ffffff 100%)",
          padding: "5rem 0 4.5rem",
          position: "relative",
          overflow: "hidden",
          borderBottom: "1px solid var(--border)",
        }}
      >
        {/* Subtle decorative background grid */}
        <div
          style={{
            position: "absolute",
            inset: 0,
            backgroundImage: "radial-gradient(rgba(15, 23, 42, 0.08) 1px, transparent 1px)",
            backgroundSize: "32px 32px",
            opacity: 0.5,
            pointerEvents: "none",
          }}
        />

        {/* Ambient Hero Spotlight Glow */}
        <div
          className="animate-aurora"
          style={{
            position: "absolute",
            top: "-100px",
            right: "10%",
            width: "500px",
            height: "500px",
            borderRadius: "50%",
            background: "radial-gradient(circle, rgba(37, 99, 235, 0.15) 0%, rgba(6, 182, 212, 0.1) 45%, transparent 70%)",
            filter: "blur(60px)",
            pointerEvents: "none",
            zIndex: 1,
          }}
        />

        <div className="container" style={{ position: "relative", zIndex: 2 }}>
          <div
            className="hero-section-wrapper"
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              gap: "3.5rem",
            }}
          >
            {/* Left Content */}
            <div className="hero-content" style={{ flex: 1.1, maxWidth: "620px" }}>
              {/* Premium Pill with Pulsing Live Beacon */}
              <div
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: "0.6rem",
                  padding: "0.4rem 0.95rem",
                  background: "#ffffff",
                  border: "1px solid rgba(37, 99, 235, 0.2)",
                  boxShadow: "0 2px 8px rgba(37, 99, 235, 0.08)",
                  borderRadius: "var(--radius-full)",
                  color: "var(--primary-dark)",
                  fontSize: "0.82rem",
                  fontWeight: 700,
                  letterSpacing: "0.01em",
                  marginBottom: "1.35rem",
                }}
              >
                <span
                  className="ping-indicator"
                  style={{
                    width: "8px",
                    height: "8px",
                    borderRadius: "50%",
                    background: "#10b981",
                    display: "inline-block",
                  }}
                />
                <Sparkles size={14} color="var(--primary)" />
                <span>Next-Gen Video Learning Platform</span>
              </div>

              <h1
                style={{
                  fontSize: "clamp(2.5rem, 4.5vw, 3.75rem)",
                  lineHeight: 1.1,
                  marginBottom: "1.35rem",
                  color: "var(--text-main)",
                  fontFamily: "var(--font-heading)",
                  fontWeight: 800,
                  letterSpacing: "-0.035em",
                }}
              >
                Master modern tech with studio-grade{" "}
                <span className="gradient-text-hero">
                  course streaming
                </span>
              </h1>

              <p
                style={{
                  fontSize: "1.125rem",
                  color: "var(--text-body)",
                  lineHeight: 1.65,
                  marginBottom: "2rem",
                  maxWidth: "540px",
                }}
              >
                Experience zero-buffering high definition learning tracks in Full-Stack, AI, System Design, and Modern Cloud. Watch free trial lectures with verified syllabi before enrolling.
              </p>

              {/* Course Search Bar with Next-Gen Focus & Glow */}
              <form
                onSubmit={handleSearchSubmit}
                style={{
                  display: "flex",
                  alignItems: "center",
                  background: "#ffffff",
                  padding: "0.35rem 0.4rem 0.35rem 1.15rem",
                  borderRadius: "var(--radius-full)",
                  border: "1.5px solid var(--border)",
                  boxShadow: "0 6px 20px rgba(15, 23, 42, 0.06)",
                  marginBottom: "1.25rem",
                  maxWidth: "520px",
                  transition: "all 0.25s ease",
                }}
                onFocus={(e) => {
                  e.currentTarget.style.borderColor = "var(--primary)";
                  e.currentTarget.style.boxShadow = "0 0 0 3px rgba(37, 99, 235, 0.15)";
                }}
                onBlur={(e) => {
                  e.currentTarget.style.borderColor = "var(--border)";
                  e.currentTarget.style.boxShadow = "0 6px 20px rgba(15, 23, 42, 0.06)";
                }}
              >
                <Search size={18} color="var(--text-muted)" style={{ marginRight: "0.65rem", flexShrink: 0 }} />
                <input
                  type="text"
                  placeholder="Search full stack, python, UI/UX, cloud..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  style={{
                    border: "none",
                    outline: "none",
                    width: "100%",
                    fontSize: "0.92rem",
                    color: "var(--text-main)",
                    fontFamily: "var(--font-family)",
                    background: "transparent",
                  }}
                />
                <button
                  type="submit"
                  className="btn btn-primary btn-sm"
                  style={{
                    borderRadius: "var(--radius-full)",
                    padding: "0.55rem 1.35rem",
                    boxShadow: "0 4px 12px rgba(37, 99, 235, 0.25)",
                  }}
                >
                  Search
                </button>
              </form>

              {/* Quick tags */}
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "0.5rem",
                  flexWrap: "wrap",
                  marginBottom: "2.25rem",
                  fontSize: "0.8rem",
                  color: "var(--text-muted)",
                }}
              >
                <span style={{ fontWeight: 600, color: "var(--text-body)" }}>Popular:</span>
                {["Full Stack", "Python & AI", "System Design", "DevOps"].map((tag) => (
                  <button
                    key={tag}
                    type="button"
                    onClick={() => {
                      setSearchQuery(tag);
                      navigate(`/courses?search=${encodeURIComponent(tag)}`);
                    }}
                    style={{
                      background: "rgba(15, 23, 42, 0.03)",
                      border: "1px solid var(--border)",
                      padding: "0.22rem 0.65rem",
                      borderRadius: "var(--radius-full)",
                      fontSize: "0.75rem",
                      fontWeight: 600,
                      color: "var(--text-body)",
                      cursor: "pointer",
                      transition: "all var(--transition-fast)",
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.borderColor = "var(--primary)";
                      e.currentTarget.style.color = "var(--primary)";
                      e.currentTarget.style.background = "var(--primary-light)";
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.borderColor = "var(--border)";
                      e.currentTarget.style.color = "var(--text-body)";
                      e.currentTarget.style.background = "rgba(15, 23, 42, 0.03)";
                    }}
                  >
                    {tag}
                  </button>
                ))}
              </div>

              {/* Action Buttons */}
              <div className="hero-buttons" style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
                <Link
                  to="/courses"
                  className="btn btn-primary btn-lg hover-elevate"
                  style={{
                    boxShadow: "0 8px 20px rgba(37, 99, 235, 0.25)",
                    gap: "0.5rem",
                  }}
                >
                  Explore Catalog <ArrowRight size={18} />
                </Link>
                <Link
                  to="/register"
                  className="btn btn-outline btn-lg hover-elevate"
                  style={{
                    backgroundColor: "#ffffff",
                    borderColor: "var(--border)",
                  }}
                >
                  Get Started Free
                </Link>
              </div>
            </div>

            {/* Right Graphic / Live Interactive Player Mockup */}
            <div
              style={{
                flex: 0.9,
                position: "relative",
                display: "flex",
                justifyContent: "center",
              }}
            >
              <div
                className="hover-elevate"
                style={{
                  position: "relative",
                  width: "100%",
                  maxWidth: "500px",
                  borderRadius: "var(--radius-xl)",
                  overflow: "hidden",
                  boxShadow: "var(--shadow-xl)",
                  backgroundColor: "#070c18",
                  border: "1px solid rgba(255, 255, 255, 0.12)",
                }}
              >
                {/* Mock Player Window Header */}
                <div
                  style={{
                    padding: "0.85rem 1.15rem",
                    background: "rgba(15, 23, 42, 0.95)",
                    borderBottom: "1px solid rgba(255, 255, 255, 0.08)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                  }}
                >
                  <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
                    <div style={{ width: "10px", height: "10px", borderRadius: "50%", background: "#ef4444" }} />
                    <div style={{ width: "10px", height: "10px", borderRadius: "50%", background: "#f59e0b" }} />
                    <div style={{ width: "10px", height: "10px", borderRadius: "50%", background: "#10b981" }} />
                  </div>
                  <div style={{ fontSize: "0.75rem", color: "#94a3b8", display: "flex", alignItems: "center", gap: "0.4rem" }}>
                    <span className="ping-indicator" style={{ width: "6px", height: "6px", borderRadius: "50%", background: "#10b981", display: "inline-block" }} />
                    <span style={{ fontWeight: 600, color: "#cbd5e1" }}>4K UHD • 60fps Stream</span>
                  </div>
                </div>

                {/* Video Image Container with Interactive Play Glow */}
                <div style={{ position: "relative", width: "100%", height: "300px", overflow: "hidden" }}>
                  <img
                    src="https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=900&auto=format&fit=crop&q=80"
                    alt="Students streaming lessons on Class Stream"
                    style={{ width: "100%", height: "100%", objectFit: "cover", filter: "brightness(0.88)" }}
                  />

                  {/* Overlaid Center Play Button with Neon Pulse Glow */}
                  <Link
                    to="/courses"
                    style={{
                      position: "absolute",
                      top: "50%",
                      left: "50%",
                      transform: "translate(-50%, -50%)",
                      width: "66px",
                      height: "66px",
                      borderRadius: "50%",
                      background: "linear-gradient(135deg, #1e40af 0%, #2563eb 100%)",
                      backdropFilter: "blur(10px)",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      color: "#ffffff",
                      boxShadow: "0 0 35px rgba(37, 99, 235, 0.75), 0 0 0 6px rgba(255, 255, 255, 0.15)",
                      cursor: "pointer",
                      textDecoration: "none",
                      transition: "transform 0.25s cubic-bezier(0.16, 1, 0.3, 1)",
                    }}
                    onMouseEnter={(e) => (e.currentTarget.style.transform = "translate(-50%, -50%) scale(1.1)")}
                    onMouseLeave={(e) => (e.currentTarget.style.transform = "translate(-50%, -50%) scale(1)")}
                  >
                    <Play size={26} fill="#ffffff" style={{ marginLeft: "3px" }} />
                  </Link>

                  {/* Bottom bar preview with scrubber */}
                  <div
                    style={{
                      position: "absolute",
                      bottom: 0,
                      left: 0,
                      right: 0,
                      padding: "0.85rem 1.15rem",
                      background: "linear-gradient(to top, rgba(7, 12, 24, 0.96) 0%, rgba(7, 12, 24, 0.6) 70%, transparent 100%)",
                      display: "flex",
                      flexDirection: "column",
                      gap: "0.45rem",
                      color: "#ffffff",
                    }}
                  >
                    {/* Simulated Scrubber Bar */}
                    <div style={{ width: "100%", height: "3px", background: "rgba(255, 255, 255, 0.2)", borderRadius: "2px", position: "relative", overflow: "hidden" }}>
                      <div style={{ width: "42%", height: "100%", background: "var(--primary)" }} />
                    </div>

                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                      <div>
                        <div style={{ fontSize: "0.88rem", fontWeight: 700, color: "#ffffff" }}>
                          Lesson 01: Full-Stack Cloud Architecture
                        </div>
                        <div style={{ fontSize: "0.72rem", color: "#94a3b8" }}>
                          Free Preview Lecture • 24:15 / 45:00
                        </div>
                      </div>
                      <span
                        className="badge badge-free"
                        style={{
                          fontSize: "0.7rem",
                          fontWeight: 700,
                          backdropFilter: "blur(6px)",
                        }}
                      >
                        Trial Access
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Floating Stat Badge 1 - Verified (Bottom Left) */}
              <div
                className="animate-float"
                style={{
                  position: "absolute",
                  bottom: "-18px",
                  left: "-20px",
                  background: "#ffffff",
                  padding: "0.85rem 1.25rem",
                  borderRadius: "var(--radius-lg)",
                  boxShadow: "var(--shadow-xl)",
                  border: "1px solid var(--border)",
                  display: "flex",
                  alignItems: "center",
                  gap: "0.85rem",
                  zIndex: 3,
                }}
              >
                <div
                  style={{
                    width: "40px",
                    height: "40px",
                    borderRadius: "var(--radius-md)",
                    background: "var(--success-bg)",
                    color: "var(--success)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    border: "1px solid var(--success-border)",
                  }}
                >
                  <CheckCircle size={22} />
                </div>
                <div>
                  <div style={{ fontWeight: 800, fontSize: "0.95rem", color: "var(--text-main)" }}>
                    100% Industry Ready
                  </div>
                  <div style={{ fontSize: "0.75rem", color: "var(--text-muted)", fontWeight: 500 }}>
                    Production-Grade Projects
                  </div>
                </div>
              </div>

              {/* Floating Stat Badge 2 - Active Learners (Top Right) */}
              <div
                className="animate-float-reverse"
                style={{
                  position: "absolute",
                  top: "-18px",
                  right: "-20px",
                  background: "#ffffff",
                  padding: "0.85rem 1.25rem",
                  borderRadius: "var(--radius-lg)",
                  boxShadow: "var(--shadow-xl)",
                  border: "1px solid var(--border)",
                  display: "flex",
                  alignItems: "center",
                  gap: "0.85rem",
                  zIndex: 3,
                }}
              >
                <div
                  style={{
                    width: "40px",
                    height: "40px",
                    borderRadius: "var(--radius-md)",
                    background: "var(--primary-light)",
                    color: "var(--primary)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    border: "1px solid rgba(37, 99, 235, 0.2)",
                  }}
                >
                  <Users size={20} />
                </div>
                <div>
                  <div style={{ fontWeight: 800, fontSize: "0.95rem", color: "var(--text-main)" }}>
                    14,200+
                  </div>
                  <div style={{ fontSize: "0.75rem", color: "var(--text-muted)", fontWeight: 500 }}>
                    Active Learners Streaming
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 2. NEXT-LEVEL ANIMATED TECH & SKILLS MARQUEE TICKER */}
      <section
        style={{
          borderBottom: "1px solid var(--border)",
          background: "#ffffff",
          padding: "1.25rem 0",
          overflow: "hidden",
          position: "relative",
        }}
      >
        <div style={{ textAlign: "center", marginBottom: "0.75rem" }}>
          <span
            style={{
              fontSize: "0.72rem",
              fontWeight: 700,
              textTransform: "uppercase",
              letterSpacing: "0.12em",
              color: "var(--text-light)",
            }}
          >
            Curriculum Architected With Industry-Standard Stacks
          </span>
        </div>

        {/* Marquee Track with Fade Gradient Masks */}
        <div
          style={{
            position: "relative",
            width: "100%",
            overflow: "hidden",
            maskImage: "linear-gradient(to right, transparent, black 10%, black 90%, transparent)",
            WebkitMaskImage: "linear-gradient(to right, transparent, black 10%, black 90%, transparent)",
          }}
        >
          <div className="marquee-content">
            {[
              { name: "React 19 & Next.js", icon: Code },
              { name: "TypeScript 5.x", icon: Sparkles },
              { name: "Node.js & Express", icon: Cpu },
              { name: "Python & AI Models", icon: Flame },
              { name: "Docker & Containers", icon: Layers },
              { name: "AWS Cloud Infrastructure", icon: Zap },
              { name: "PostgreSQL & Prisma", icon: ShieldCheck },
              { name: "Tailwind CSS & Design Systems", icon: Award },
              { name: "Kubernetes & CI/CD", icon: Users },
              { name: "GraphQL & REST APIs", icon: BookOpen },
              // Duplicate set for smooth infinite loop
              { name: "React 19 & Next.js", icon: Code },
              { name: "TypeScript 5.x", icon: Sparkles },
              { name: "Node.js & Express", icon: Cpu },
              { name: "Python & AI Models", icon: Flame },
              { name: "Docker & Containers", icon: Layers },
              { name: "AWS Cloud Infrastructure", icon: Zap },
              { name: "PostgreSQL & Prisma", icon: ShieldCheck },
              { name: "Tailwind CSS & Design Systems", icon: Award },
              { name: "Kubernetes & CI/CD", icon: Users },
              { name: "GraphQL & REST APIs", icon: BookOpen },
            ].map((tech, idx) => {
              const IconComp = tech.icon;
              return (
                <div
                  key={idx}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "0.5rem",
                    padding: "0.4rem 0.95rem",
                    borderRadius: "var(--radius-full)",
                    background: "var(--surface-sunken)",
                    border: "1px solid var(--border)",
                    fontSize: "0.82rem",
                    fontWeight: 700,
                    color: "var(--text-body)",
                    whiteSpace: "nowrap",
                  }}
                >
                  <IconComp size={15} color="var(--primary)" />
                  <span>{tech.name}</span>
                </div>
              );
            })}
          </div>

           <div className="marquee-content2">
            {[
              { name: "Cloud Deployment & DevOps", icon: Code },
              { name: "JavaScript & TypeScript", icon: Sparkles },
              { name: "Java & Spring Boot", icon: Cpu },
              { name: "Machine Learning", icon: Flame },
              { name: "MongoDB & Mongooses", icon: Layers },
              { name: "MySQL & SQL", icon: Zap },
              { name: "REST APIs & JWT Auth", icon: ShieldCheck },
              { name: "Vercel & Render", icon: Award },
              { name: "Docker & DevOps", icon: Users },
              { name: "Authentication & Security", icon: BookOpen },
              // Duplicate set for smooth infinite loop
             { name: "Cloud Deployment & DevOps", icon: Code },
              { name: "JavaScript & TypeScript", icon: Sparkles },
              { name: "Java & Spring Boot", icon: Cpu },
              { name: "Machine Learning", icon: Flame },
              { name: "MongoDB & Mongooses", icon: Layers },
              { name: "MySQL & SQL", icon: Zap },
              { name: "REST APIs & JWT Auth", icon: ShieldCheck },
              { name: "Vercel & Render", icon: Award },
              { name: "Docker & DevOps", icon: Users },
              { name: "Authentication & Security", icon: BookOpen },
            ].map((tech, idx) => {
              const IconComp = tech.icon;
              return (
                <div
                  key={idx}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "0.5rem",
                    padding: "0.4rem 0.95rem",
                    borderRadius: "var(--radius-full)",
                    background: "var(--surface-sunken)",
                    border: "1px solid var(--border)",
                    fontSize: "0.82rem",
                    fontWeight: 700,
                    color: "var(--text-body)",
                    whiteSpace: "nowrap",
                    marginTop: "20px",
                  }}
                >
                  <IconComp size={15} color="var(--primary)" />
                  <span>{tech.name}</span>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* 3. METRICS & STATISTICS ROW */}
      <section
        ref={statsSectionRef}
        style={{
          borderBottom: "1px solid var(--border)",
          background: "var(--surface)",
          padding: "2.75rem 0",
        }}
      >
        <div className="container">
          <div
            className="hero-stats-row"
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(4, 1fr)",
              gap: "1.5rem",
              textAlign: "center",
            }}
          >
            {growthStats.map((stat, i) => (
              <div
                key={i}
                className="hover-elevate"
                style={{
                  padding: "1.25rem 1rem",
                  borderRadius: "var(--radius-lg)",
                  background: "#ffffff",
                  border: "1px solid var(--border)",
                  boxShadow: "var(--shadow-xs)",
                }}
              >
                <div
                  style={{
                    fontSize: "2.5rem",
                    fontWeight: 800,
                    color: "var(--text-main)",
                    fontFamily: "var(--font-heading)",
                    letterSpacing: "-0.035em",
                    lineHeight: 1.1,
                  }}
                >
                  <AnimatedStatValue value={Number(stat.value)} suffix={stat.suffix} isVisible={statsVisible} />
                </div>
                <div style={{ fontSize: "0.9rem", color: "var(--text-main)", fontWeight: 700, marginTop: "0.4rem" }}>
                  {stat.label}
                </div>
                <div style={{ fontSize: "0.75rem", color: "var(--text-muted)", marginTop: "0.2rem" }}>
                  {stat.sub}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 3. POPULAR CATEGORIES */}
      <section id="categories" className="section" style={{ backgroundColor: "#f8fafc", scrollMarginTop: "88px" }}>
        <div className="container">
          <div className="section-header">
            <span className="section-tag">Explore Domains</span>
            <h2 className="section-title">Specialized Career Tracks</h2>
            <p className="section-subtitle">
              Engineered curriculums aligned directly with modern software, AI, and design leadership expectations.
            </p>
          </div>

          <div
            className="platform-feature-grid"
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))",
              gap: "1.25rem",
            }}
          >
            {categories.map((cat) => {
              const img =
                cat.categoryImage?.[0]?.imageUrl ||
                "https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=600&auto=format&fit=crop&q=80";

              return (
                <Link
                  key={cat._id}
                  to={`/courses?category=${encodeURIComponent(cat.categoryName)}`}
                  className="card card-hover"
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    textDecoration: "none",
                    position: "relative",
                    borderRadius: "var(--radius-lg)",
                    overflow: "hidden",
                    border: "1px solid var(--border)",
                    backgroundColor: "var(--surface)",
                  }}
                >
                  <div style={{ height: "140px", overflow: "hidden", position: "relative" }}>
                    <img
                      src={img}
                      alt={cat.categoryName}
                      style={{ width: "100%", height: "100%", objectFit: "cover", transition: "transform 0.4s ease" }}
                      onMouseEnter={(e) => (e.currentTarget.style.transform = "scale(1.06)")}
                      onMouseLeave={(e) => (e.currentTarget.style.transform = "scale(1)")}
                    />
                    <div
                      style={{
                        position: "absolute",
                        inset: 0,
                        background: "linear-gradient(to top, rgba(15, 23, 42, 0.8) 0%, rgba(15, 23, 42, 0.1) 60%, transparent 100%)",
                      }}
                    />
                    <div
                      style={{
                        position: "absolute",
                        bottom: "0.85rem",
                        left: "1rem",
                        right: "1rem",
                        color: "#ffffff",
                        fontWeight: 700,
                        fontSize: "1.05rem",
                        letterSpacing: "-0.01em",
                      }}
                    >
                      {cat.categoryName}
                    </div>
                  </div>
                  <div
                    style={{
                      padding: "0.85rem 1rem",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "space-between",
                      fontSize: "0.85rem",
                      fontWeight: 600,
                      color: "var(--text-muted)",
                      backgroundColor: "var(--surface)",
                    }}
                  >
                    <span>Explore Track</span>
                    <ArrowRight size={14} color="var(--primary)" />
                  </div>
                </Link>
              );
            })}
          </div>
        </div>
      </section>

      {/* 4. FEATURED COURSES */}
      <section className="section" style={{ backgroundColor: "#f1f5f9" }}>
        <div className="container">
          <div className="section-header">
            <span className="section-tag">Curated Catalog</span>
            <h2 className="section-title">Featured Learning Tracks</h2>
            <p className="section-subtitle">
              High-definition courses designed to elevate your theoretical insight and practical development capability.
            </p>
          </div>

          <div className="grid-3" style={{ marginBottom: "3rem" }}>
            {loading ? (
              <>
                <CourseSkeletonCard />
                <CourseSkeletonCard />
                <CourseSkeletonCard />
              </>
            ) : courses.length > 0 ? (
              courses.map((course) => (
                <CourseCard key={course._id} course={course} />
              ))
            ) : (
              <div style={{ gridColumn: "1 / -1", textAlign: "center", padding: "3rem" }}>
                <p>No featured courses found at the moment.</p>
              </div>
            )}
          </div>

          <div style={{ textAlign: "center" }}>
            <Link to="/courses" className="btn btn-primary btn-lg">
              View All Courses in Catalog <ArrowRight size={18} />
            </Link>
          </div>
        </div>
      </section>

      {/* 5. WHY CHOOSE CLASS STREAM - INTERACTIVE BENTO GRID */}
      <section id="why-us" className="section" style={{ backgroundColor: "#ffffff", scrollMarginTop: "88px" }}>
        <div className="container">
          <div className="section-header">
            <span className="section-tag">Platform Advantages</span>
            <h2 className="section-title">Engineered For True Mastery</h2>
            <p className="section-subtitle">
              Experience learning without friction. Everything you need to absorb complex engineering and product design smoothly.
            </p>
          </div>

          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(12, 1fr)",
              gap: "1.5rem",
            }}
          >
            {/* Bento Card 1 (Span 7 Columns): Studio-Grade Adaptive Streaming */}
            <div
              className="card hover-elevate platform-feature-card platform-feature-card--streaming"
              style={{
                gridColumn: "span 7",
                padding: "2.5rem",
                borderRadius: "var(--radius-xl)",
                border: "1px solid var(--border)",
                background: "linear-gradient(135deg, #ffffff 0%, #f8fafc 100%)",
                display: "flex",
                flexDirection: "column",
                justifyContent: "space-between",
                position: "relative",
                overflow: "hidden",
              }}
            >
              {/* Background ambient decorative highlight */}
              <div
                style={{
                  position: "absolute",
                  top: "-50px",
                  right: "-50px",
                  width: "200px",
                  height: "200px",
                  borderRadius: "50%",
                  background: "radial-gradient(circle, rgba(37, 99, 235, 0.08) 0%, transparent 70%)",
                  pointerEvents: "none",
                }}
              />

              <div>
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    marginBottom: "1.5rem",
                  }}
                >
                  <div
                    style={{
                      width: "56px",
                      height: "56px",
                      borderRadius: "var(--radius-lg)",
                      background: "var(--primary-light)",
                      color: "var(--primary)",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      boxShadow: "0 4px 14px rgba(37, 99, 235, 0.15)",
                    }}
                  >
                    <Video size={28} />
                  </div>
                  <span
                    style={{
                      fontSize: "0.75rem",
                      fontWeight: 700,
                      padding: "0.35rem 0.75rem",
                      borderRadius: "var(--radius-full)",
                      background: "#070c18",
                      color: "#93c5fd",
                      display: "flex",
                      alignItems: "center",
                      gap: "0.4rem",
                    }}
                  >
                    <span className="ping-indicator" style={{ width: "6px", height: "6px", borderRadius: "50%", background: "#10b981", display: "inline-block" }} />
                    Zero-Buffering AV1 Core
                  </span>
                </div>

                <h3 style={{ fontSize: "1.45rem", fontWeight: 800, marginBottom: "0.75rem", color: "var(--text-main)", letterSpacing: "-0.02em" }}>
                  Studio-Grade Adaptive Video Player
                </h3>
                <p style={{ fontSize: "1rem", color: "var(--text-body)", lineHeight: 1.65, maxWidth: "520px" }}>
                  Inspect code details with 4K UHD 60FPS high-fidelity bitrate streaming, automated bandwidth tuning, synchronized timestamp bookmarks, and multi-speed playback.
                </p>
              </div>

              {/* Interactive Audio/Video Feature Indicators */}
              <div
                style={{
                  marginTop: "2rem",
                  padding: "1rem 1.25rem",
                  borderRadius: "var(--radius-lg)",
                  background: "#ffffff",
                  border: "1px solid var(--border)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  flexWrap: "wrap",
                  gap: "0.75rem",
                }}
              >
                <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", fontSize: "0.85rem", fontWeight: 600, color: "var(--text-main)" }}>
                  <Check size={16} color="var(--success)" /> Instant Resume
                </div>
                <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", fontSize: "0.85rem", fontWeight: 600, color: "var(--text-main)" }}>
                  <Check size={16} color="var(--success)" /> Code Sync Timestamps
                </div>
                <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", fontSize: "0.85rem", fontWeight: 600, color: "var(--text-main)" }}>
                  <Check size={16} color="var(--success)" /> Picture-in-Picture Mode
                </div>
              </div>
            </div>

            {/* Bento Card 2 (Span 5 Columns): Free Trial & Multi-Tier Access */}
            <div
              className="card hover-elevate platform-feature-card"
              style={{
                gridColumn: "span 5",
                padding: "2.5rem",
                borderRadius: "var(--radius-xl)",
                border: "1px solid var(--border)",
                background: "linear-gradient(135deg, #ffffff 0%, #eff6ff 100%)",
                display: "flex",
                flexDirection: "column",
                justifyContent: "space-between",
              }}
            >
              <div>
                <div
                  style={{
                    width: "56px",
                    height: "56px",
                    borderRadius: "var(--radius-lg)",
                    background: "#dbeafe",
                    color: "var(--primary-dark)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    marginBottom: "1.5rem",
                  }}
                >
                  <BookOpen size={28} />
                </div>
                <h3 style={{ fontSize: "1.35rem", fontWeight: 800, marginBottom: "0.75rem", color: "var(--text-main)", letterSpacing: "-0.02em" }}>
                  Free Trial & Multi-Tier Previews
                </h3>
                <p style={{ fontSize: "0.95rem", color: "var(--text-body)", lineHeight: 1.6 }}>
                  Inspect curriculum depth before committing. Stream comprehensive overview lectures and test interactive coding exercises without entering payment details.
                </p>
              </div>

              <div style={{ marginTop: "1.5rem" }}>
                <span className="badge badge-free" style={{ padding: "0.4rem 0.8rem", fontSize: "0.8rem" }}>
                  ✓ 100% Free Trial Lectures Included
                </span>
              </div>
            </div>

            {/* Bento Card 3 (Span 5 Columns): Verified Razorpay Test Sandbox */}
            <div
              className="card hover-elevate platform-feature-card"
              style={{
                gridColumn: "span 5",
                padding: "2.5rem",
                borderRadius: "var(--radius-xl)",
                border: "1px solid var(--border)",
                background: "linear-gradient(135deg, #ffffff 0%, #fdf4ff 100%)",
                display: "flex",
                flexDirection: "column",
                justifyContent: "space-between",
              }}
            >
              <div>
                <div
                  style={{
                    width: "56px",
                    height: "56px",
                    borderRadius: "var(--radius-lg)",
                    background: "#fae8ff",
                    color: "#9333ea",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    marginBottom: "1.5rem",
                  }}
                >
                  <ShieldCheck size={28} />
                </div>
                <h3 style={{ fontSize: "1.35rem", fontWeight: 800, marginBottom: "0.75rem", color: "var(--text-main)", letterSpacing: "-0.02em" }}>
                  Cryptographic HMAC Security
                </h3>
                <p style={{ fontSize: "0.95rem", color: "var(--text-body)", lineHeight: 1.6 }}>
                  Built on Razorpay Test Mode with backend cryptographic SHA-256 signature verification. Experience true checkout flows safely without real card charges.
                </p>
              </div>

              <div style={{ marginTop: "1.5rem", display: "flex", alignItems: "center", gap: "0.5rem", fontSize: "0.85rem", color: "var(--text-muted)", fontWeight: 600 }}>
                <ShieldCheck size={16} color="var(--success)" /> Instant Automated Enrollment
              </div>
            </div>

            {/* Bento Card 4 (Span 7 Columns): Real-Time Cloud Progress Synchronization */}
            <div
              className="card hover-elevate platform-feature-card"
              style={{
                gridColumn: "span 7",
                padding: "2.5rem",
                borderRadius: "var(--radius-xl)",
                border: "1px solid var(--border)",
                background: "linear-gradient(135deg, #ffffff 0%, #f0fdf4 100%)",
                display: "flex",
                flexDirection: "column",
                justifyContent: "space-between",
              }}
            >
              <div>
                <div
                  style={{
                    width: "56px",
                    height: "56px",
                    borderRadius: "var(--radius-lg)",
                    background: "var(--success-bg)",
                    color: "var(--success)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    marginBottom: "1.5rem",
                  }}
                >
                  <Zap size={28} />
                </div>
                <h3 style={{ fontSize: "1.35rem", fontWeight: 800, marginBottom: "0.75rem", color: "var(--text-main)", letterSpacing: "-0.02em" }}>
                  Real-Time Multi-Device Synchronization
                </h3>
                <p style={{ fontSize: "0.95rem", color: "var(--text-body)", lineHeight: 1.6, maxWidth: "520px" }}>
                  Move between your laptop, tablet, and workstation seamlessly. Your watched seconds, lesson completions, and milestone certificates sync instantly in real time.
                </p>
              </div>

              <div style={{ marginTop: "1.5rem", display: "flex", gap: "1rem", flexWrap: "wrap" }}>
                <div style={{ display: "flex", alignItems: "center", gap: "0.4rem", fontSize: "0.85rem", fontWeight: 600, color: "var(--text-main)" }}>
                  <Award size={16} color="var(--accent-amber)" /> Verifiable Digital Certificates
                </div>
                <div style={{ display: "flex", alignItems: "center", gap: "0.4rem", fontSize: "0.85rem", fontWeight: 600, color: "var(--text-main)" }}>
                  <Clock size={16} color="var(--primary)" /> 1-Click Milestone Resumes
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 6. HOW IT WORKS */}
      <section className="section" style={{ backgroundColor: "#f8fafc" }}>
        <div className="container">
          <div className="section-header">
            <span className="section-tag">Simple Journey</span>
            <h2 className="section-title">How Class Stream Operates</h2>
            <p className="section-subtitle">
              Follow four straightforward steps to start building career-defining competence.
            </p>
          </div>

          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))",
              gap: "2rem",
            }}
          >
            {[
              {
                step: "01",
                title: "Create Free Account",
                desc: "Register in 30 seconds with email and securely set up your personal learning profile.",
              },
              {
                step: "02",
                title: "Select Course Track",
                desc: "Filter through computer science, design, or web engineering with free lesson previews.",
              },
              {
                step: "03",
                title: "Stream & Learn",
                desc: "Watch high-definition videos, complete real-world exercises, and track your milestone progress.",
              },
              {
                step: "04",
                title: "Grow & Succeed",
                desc: "Apply your newly acquired skills in industry projects and accelerate your professional career.",
              },
            ].map((item) => (
              <div
                key={item.step}
                className="card hover-elevate"
                style={{
                  padding: "2rem",
                  borderRadius: "var(--radius-lg)",
                  position: "relative",
                  background: "#ffffff",
                  border: "1px solid var(--border)",
                }}
              >
                <div
                  style={{
                    fontSize: "2rem",
                    fontWeight: 800,
                    fontFamily: "var(--font-heading)",
                    color: "var(--primary)",
                    marginBottom: "1rem",
                    opacity: 0.85,
                  }}
                >
                  {item.step}
                </div>
                <h4 style={{ fontSize: "1.15rem", marginBottom: "0.5rem", color: "var(--text-main)", fontWeight: 700 }}>{item.title}</h4>
                <p style={{ fontSize: "0.9rem", color: "var(--text-body)", lineHeight: 1.6 }}>
                  {item.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 7. STUDENT TESTIMONIALS */}
      <section className="section" style={{ backgroundColor: "#ffffff" }}>
        <div className="container">
          <div className="section-header">
            <span className="section-tag">Student Voices</span>
            <h2 className="section-title">Loved By Engineers & Designers</h2>
            <p className="section-subtitle">
              Discover how ambitious learners transitioned into high-growth software and product engineering roles.
            </p>
          </div>

          <div className="grid-3">
            {[
              {
                name: "Ananya Sharma",
                role: "Full-Stack Engineer at TechCorp",
                text: "The Full-Stack Web Development track bridged the exact gap between tutorial code and enterprise-grade microservice architecture.",
                rating: 5,
              },
              {
                name: "Karthik Raja",
                role: "Machine Learning Associate",
                text: "The trial lessons let me evaluate the depth before enrolling. The math explanation and transformer implementation were crystal clear.",
                rating: 5,
              },
              {
                name: "Rohan Mehta",
                role: "Product Designer",
                text: "Having dedicated lesson notes, crystal clear HD video streaming, and zero playback stuttering made learning after work a delight.",
                rating: 5,
              },
            ].map((testi, idx) => (
              <div
                key={idx}
                className="card hover-elevate"
                style={{
                  padding: "2rem",
                  borderRadius: "var(--radius-lg)",
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "space-between",
                  background: "#ffffff",
                  border: "1px solid var(--border)",
                }}
              >
                <div>
                  <div style={{ display: "flex", gap: "0.25rem", color: "#f59e0b", marginBottom: "1rem" }}>
                    {[...Array(testi.rating)].map((_, i) => (
                      <Star key={i} size={16} fill="#f59e0b" />
                    ))}
                  </div>
                  <p style={{ fontStyle: "italic", color: "var(--text-body)", marginBottom: "1.5rem", lineHeight: 1.65, fontSize: "0.95rem" }}>
                    "{testi.text}"
                  </p>
                </div>
                <div style={{ borderTop: "1px solid var(--border-light)", paddingTop: "1rem", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                  <div>
                    <div style={{ fontWeight: 800, fontSize: "0.95rem", color: "var(--text-main)" }}>{testi.name}</div>
                    <div style={{ fontSize: "0.8rem", color: "var(--text-muted)" }}>{testi.role}</div>
                  </div>
                  <span style={{ fontSize: "0.7rem", color: "var(--success)", fontWeight: 700, background: "var(--success-bg)", padding: "0.2rem 0.5rem", borderRadius: "var(--radius-full)" }}>
                    ✓ Verified
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 8. NEXT-LEVEL PREMIUM CALL TO ACTION BANNER */}
      <section
        style={{
          background: "linear-gradient(135deg, #050811 0%, #0b132b 50%, #1e3a8a 100%)",
          color: "#ffffff",
          padding: "6rem 0",
          textAlign: "center",
          position: "relative",
          overflow: "hidden",
        }}
      >
        {/* Animated Aurora Ambient Glow */}
        <div
          className="animate-aurora"
          style={{
            position: "absolute",
            top: "-50px",
            left: "50%",
            transform: "translateX(-50%)",
            width: "700px",
            height: "400px",
            background: "radial-gradient(circle, rgba(37, 99, 235, 0.35) 0%, rgba(6, 182, 212, 0.2) 45%, transparent 70%)",
            filter: "blur(60px)",
            pointerEvents: "none",
          }}
        />

        <div className="container" style={{ position: "relative", zIndex: 2 }}>
          <div style={{ maxWidth: "720px", margin: "0 auto" }}>
            <div
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: "0.5rem",
                padding: "0.35rem 0.95rem",
                borderRadius: "var(--radius-full)",
                background: "rgba(255, 255, 255, 0.12)",
                border: "1px solid rgba(255, 255, 255, 0.2)",
                backdropFilter: "blur(10px)",
                fontSize: "0.82rem",
                fontWeight: 700,
                color: "#93c5fd",
                marginBottom: "1.5rem",
              }}
            >
              <Sparkles size={15} />
              <span>Unlock Complete Curriculum Access</span>
            </div>

            <h2
              style={{
                color: "#ffffff",
                fontSize: "clamp(2.2rem, 3.8vw, 3rem)",
                marginBottom: "1.35rem",
                lineHeight: 1.15,
                fontFamily: "var(--font-heading)",
                fontWeight: 800,
                letterSpacing: "-0.035em",
              }}
            >
              Start Streaming Career-Defining Tech Mastery
            </h2>
            <p
              style={{
                color: "rgba(255, 255, 255, 0.85)",
                fontSize: "1.125rem",
                marginBottom: "2.5rem",
                lineHeight: 1.7,
              }}
            >
              Join 14,000+ ambitious software developers and engineers accelerating their careers through high-impact, video-first curriculums.
            </p>
            <div style={{ display: "flex", justifyContent: "center", gap: "1rem", flexWrap: "wrap", marginBottom: "2.25rem" }}>
              <Link
                to="/register"
                className="btn btn-lg hover-elevate"
                style={{
                  background: "#ffffff",
                  color: "#070c18",
                  fontWeight: 800,
                  boxShadow: "0 10px 30px rgba(0,0,0,0.35)",
                  padding: "0.85rem 2rem",
                }}
              >
                Create Free Account
              </Link>
              <Link
                to="/courses"
                className="btn btn-lg hover-elevate"
                style={{
                  background: "rgba(255, 255, 255, 0.12)",
                  borderColor: "rgba(255, 255, 255, 0.25)",
                  color: "#ffffff",
                  fontWeight: 700,
                  padding: "0.85rem 2rem",
                  backdropFilter: "blur(8px)",
                }}
              >
                Browse Catalog <ArrowRight size={18} />
              </Link>
            </div>

            <div
              style={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                gap: "1.75rem",
                fontSize: "0.85rem",
                color: "rgba(255, 255, 255, 0.75)",
                flexWrap: "wrap",
                fontWeight: 500,
              }}
            >
              <span style={{ display: "flex", alignItems: "center", gap: "0.4rem" }}>
                <Check size={16} color="#34d399" /> Instant Streaming Access
              </span>
              <span style={{ display: "flex", alignItems: "center", gap: "0.4rem" }}>
                <Check size={16} color="#34d399" /> Free Trial Lectures
              </span>
              <span style={{ display: "flex", alignItems: "center", gap: "0.4rem" }}>
                <Check size={16} color="#34d399" /> Verified Razorpay Test Sandbox
              </span>
              <span style={{ display: "flex", alignItems: "center", gap: "0.4rem" }}>
                <Check size={16} color="#34d399" /> No Hidden Fees
              </span>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default HomePage;
