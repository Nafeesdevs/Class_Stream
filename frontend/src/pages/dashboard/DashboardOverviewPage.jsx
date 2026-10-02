import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import courseService from "../../services/courseService";
import {
  BookOpen,
  Award,
  Clock,
  PlayCircle,
  ArrowRight,
  Sparkles,
  Flame,
} from "lucide-react";

const AnimatedMetric = ({ value, suffix = "", precision = 0 }) => {
  const [count, setCount] = useState(0);

  useEffect(() => {
    const target = Number(value) || 0;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      setCount(target);
      return undefined;
    }

    let frameId;
    let startTime;
    const duration = 1100;
    const animate = (time) => {
      if (startTime === undefined) startTime = time;
      const progress = Math.min((time - startTime) / duration, 1);
      const easedProgress = 1 - Math.pow(1 - progress, 3);
      setCount(target * easedProgress);
      if (progress < 1) frameId = requestAnimationFrame(animate);
    };

    frameId = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(frameId);
  }, [value]);

  return <>{count.toFixed(precision)}{suffix}</>;
};

export const DashboardOverviewPage = () => {
  const { user } = useAuth();
  const [enrolledCourses, setEnrolledCourses] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchEnrolled = async () => {
      try {
        setLoading(true);
        const res = await courseService.getMyCourses();
        if (res?.courses) {
          setEnrolledCourses(res.courses);
        }
      } catch (err) {
        console.warn("Could not load student courses:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchEnrolled();
  }, []);

  const totalEnrolled = enrolledCourses.length;
  const recentEnrollment = enrolledCourses[0];
  const recentCourse = recentEnrollment?.course || recentEnrollment;
  const recentTotalLessons = recentCourse?.courseVideo?.length || 1;
  const recentCompletedLessons = recentEnrollment?.completedLessons?.length || 0;
  const recentProgress = Math.min(100, Math.round((recentCompletedLessons / recentTotalLessons) * 100));

  return (
    <div className="animate-fade-in responsive-page dashboard-overview-page">
      {/* Welcome Banner */}
      <div
        style={{
          background: "var(--primary-gradient)",
          color: "#ffffff",
          padding: "2.25rem",
          borderRadius: "var(--radius-xl)",
          marginBottom: "2rem",
          boxShadow: "var(--shadow-md)",
          position: "relative",
          overflow: "hidden",
        }}
      >
        <div style={{ maxWidth: "560px", position: "relative", zIndex: 2 }}>
          <div
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: "0.35rem",
              padding: "0.25rem 0.65rem",
              borderRadius: "var(--radius-full)",
              background: "rgba(255, 255, 255, 0.2)",
              fontSize: "0.75rem",
              fontWeight: 700,
              textTransform: "uppercase",
              marginBottom: "0.85rem",
            }}
          >
            <Sparkles size={13} />
            <span>Active Student Portal</span>
          </div>

          <h1 style={{ color: "#ffffff", fontSize: "1.85rem", marginBottom: "0.5rem" }}>
            Welcome back, {user?.name}!
          </h1>
          <p style={{ color: "rgba(255, 255, 255, 0.9)", fontSize: "0.95rem", lineHeight: 1.6 }}>
            Ready to continue where you left off? Keep up the momentum and expand your software expertise today.
          </p>
        </div>
      </div>

      {/* Quick Statistics Grid */}
      <div className="grid-4" style={{ marginBottom: "2.5rem" }}>
        <div className="card" style={{ padding: "1.25rem" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "0.75rem", marginBottom: "0.75rem" }}>
            <div
              style={{
                width: "38px",
                height: "38px",
                borderRadius: "var(--radius-md)",
                background: "var(--primary-light)",
                color: "var(--primary)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <BookOpen size={20} />
            </div>
            <span style={{ fontSize: "0.85rem", color: "var(--text-muted)", fontWeight: 600 }}>
              Enrolled Courses
            </span>
          </div>
          <div style={{ fontSize: "1.75rem", fontWeight: 800, fontFamily: "var(--font-heading)" }}>
            <AnimatedMetric value={totalEnrolled} />
          </div>
        </div>

        <div className="card" style={{ padding: "1.25rem" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "0.75rem", marginBottom: "0.75rem" }}>
            <div
              style={{
                width: "38px",
                height: "38px",
                borderRadius: "var(--radius-md)",
                background: "var(--success-bg)",
                color: "var(--success)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <PlayCircle size={20} />
            </div>
            <span style={{ fontSize: "0.85rem", color: "var(--text-muted)", fontWeight: 600 }}>
              Lessons Completed
            </span>
          </div>
          <div style={{ fontSize: "1.75rem", fontWeight: 800, fontFamily: "var(--font-heading)" }}>
            <AnimatedMetric value={user?.enrolledCourses?.reduce((acc, c) => acc + (c.completedLessons?.length || 0), 0) || 0} />
          </div>
        </div>

        <div className="card" style={{ padding: "1.25rem" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "0.75rem", marginBottom: "0.75rem" }}>
            <div
              style={{
                width: "38px",
                height: "38px",
                borderRadius: "var(--radius-md)",
                background: "var(--warning-bg)",
                color: "var(--warning)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <Clock size={20} />
            </div>
            <span style={{ fontSize: "0.85rem", color: "var(--text-muted)", fontWeight: 600 }}>
              Hours Streamed
            </span>
          </div>
          <div style={{ fontSize: "1.75rem", fontWeight: 800, fontFamily: "var(--font-heading)" }}>
            <AnimatedMetric value={14.5} suffix=" hrs" precision={1} />
          </div>
        </div>

        <div className="card" style={{ padding: "1.25rem" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "0.75rem", marginBottom: "0.75rem" }}>
            <div
              style={{
                width: "38px",
                height: "38px",
                borderRadius: "var(--radius-md)",
                background: "var(--secondary-light)",
                color: "var(--secondary)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <Award size={20} />
            </div>
            <span style={{ fontSize: "0.85rem", color: "var(--text-muted)", fontWeight: 600 }}>
              Certificates
            </span>
          </div>
          <div style={{ fontSize: "1.75rem", fontWeight: 800, fontFamily: "var(--font-heading)" }}>
            <AnimatedMetric value={totalEnrolled > 0 ? 1 : 0} />
          </div>
        </div>
      </div>

      {/* Continue Learning Section */}
      <div style={{ marginBottom: "2.5rem" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", marginBottom: "1.25rem" }}>
          <h2 style={{ fontSize: "1.35rem" }}>Continue Learning</h2>
          <Link to="/dashboard/my-learning" style={{ fontSize: "0.875rem", fontWeight: 600 }}>
            View All Enrolled ({totalEnrolled})
          </Link>
        </div>

        {recentCourse ? (
          <div
            className="card"
            style={{
              padding: "1.75rem",
              display: "flex",
              flexWrap: "wrap",
              alignItems: "center",
              gap: "1.75rem",
              background: "var(--surface)",
            }}
          >
            <img
              src={
                recentCourse.courseImage?.[0]?.url ||
                "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=400&auto=format&fit=crop&q=80"
              }
              alt={recentCourse.courseName}
              style={{
                width: "140px",
                height: "90px",
                borderRadius: "var(--radius-md)",
                objectFit: "cover",
              }}
            />

            <div style={{ flex: 1, minWidth: "240px" }}>
              <span className="badge badge-primary" style={{ marginBottom: "0.4rem" }}>
                {recentCourse.courseCategory}
              </span>
              <h3 style={{ fontSize: "1.2rem", marginBottom: "0.45rem" }}>
                {recentCourse.courseName}
              </h3>

              {/* Progress Bar */}
              <div style={{ marginTop: "0.75rem" }}>
                <div style={{ display: "flex", justifyContent: "space-between", fontSize: "0.78rem", color: "var(--text-muted)", marginBottom: "0.25rem" }}>
                  <span>Lesson Progress</span>
                  <span>{recentProgress}% Completed</span>
                </div>
                <div style={{ width: "100%", height: "6px", background: "var(--border)", borderRadius: "var(--radius-full)", overflow: "hidden" }}>
                  <div style={{ width: `${recentProgress}%`, height: "100%", background: "var(--primary-gradient)" }} />
                </div>
              </div>
            </div>

            <Link
              to={`/learn/${recentCourse._id}`}
              className="btn btn-primary"
              style={{ flexShrink: 0 }}
            >
              Resume Stream <ArrowRight size={16} />
            </Link>
          </div>
        ) : (
          <div
            className="card"
            style={{
              padding: "2.5rem 1.5rem",
              textAlign: "center",
              background: "var(--surface)",
            }}
          >
            <BookOpen size={36} color="var(--text-light)" style={{ margin: "0 auto 1rem auto" }} />
            <h4 style={{ fontSize: "1.1rem", marginBottom: "0.5rem" }}>No enrolled courses yet</h4>
            <p style={{ color: "var(--text-muted)", fontSize: "0.9rem", marginBottom: "1.25rem" }}>
              Explore our curated technical curriculum and start learning for free today.
            </p>
            <Link to="/courses" className="btn btn-outline-primary btn-sm">
              Explore Course Catalog
            </Link>
          </div>
        )}
      </div>
    </div>
  );
};

export default DashboardOverviewPage;
