import React from "react";
import { Link } from "react-router-dom";
import { PlayCircle, Clock, Star, ArrowRight, ShieldCheck } from "lucide-react";

export const CourseCard = ({ course }) => {
  if (!course) return null;

  const thumbnail =
    course.courseImage?.[0]?.url ||
    "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=800&auto=format&fit=crop&q=80";

  const videoCount = course.courseVideo?.length || 0;
  const isFree = !course.isPaid || course.price === 0;
  const discountPercent =
    course.originalPrice > course.price
      ? Math.round(((course.originalPrice - course.price) / course.originalPrice) * 100)
      : 0;

  return (
    <div
      className="card card-hover hover-elevate"
      style={{
        display: "flex",
        flexDirection: "column",
        height: "100%",
        borderRadius: "var(--radius-lg)",
        backgroundColor: "var(--surface)",
        border: "1px solid var(--border)",
        boxShadow: "var(--shadow-sm)",
        transition: "all var(--transition-normal)",
        overflow: "hidden",
      }}
    >
      {/* Thumbnail Container with Zoom on Hover */}
      <Link
        to={`/courses/${course._id}`}
        style={{
          position: "relative",
          width: "100%",
          paddingTop: "56.25%", // 16:9 aspect ratio
          overflow: "hidden",
          backgroundColor: "#070c18",
          display: "block",
        }}
      >
        <img
          src={thumbnail}
          alt={course.courseName}
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            width: "100%",
            height: "100%",
            objectFit: "cover",
            transition: "transform 0.5s cubic-bezier(0.16, 1, 0.3, 1)",
          }}
          onMouseEnter={(e) => (e.currentTarget.style.transform = "scale(1.06)")}
          onMouseLeave={(e) => (e.currentTarget.style.transform = "scale(1)")}
        />

        {/* Top Vignette Gradient Overlay */}
        <div
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            height: "45%",
            background: "linear-gradient(180deg, rgba(7, 12, 24, 0.65) 0%, transparent 100%)",
            pointerEvents: "none",
          }}
        />

        {/* Hover Center Play Button Hint */}
        <div
          style={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            width: "44px",
            height: "44px",
            borderRadius: "50%",
            background: "rgba(15, 23, 42, 0.75)",
            backdropFilter: "blur(6px)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            color: "#ffffff",
            border: "1px solid rgba(255, 255, 255, 0.2)",
            boxShadow: "0 4px 16px rgba(0, 0, 0, 0.3)",
            opacity: 0.85,
            pointerEvents: "none",
            transition: "all 0.3s ease",
          }}
        >
          <PlayCircle size={22} fill="rgba(255, 255, 255, 0.2)" />
        </div>

        {/* Top Badges */}
        <div
          style={{
            position: "absolute",
            top: "0.75rem",
            left: "0.75rem",
            right: "0.75rem",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            pointerEvents: "none",
          }}
        >
          <span
            className="badge"
            style={{
              backdropFilter: "blur(8px)",
              WebkitBackdropFilter: "blur(8px)",
              background: "rgba(15, 23, 42, 0.75)",
              color: "#ffffff",
              border: "1px solid rgba(255, 255, 255, 0.2)",
              fontSize: "0.7rem",
              fontWeight: 600,
            }}
          >
            {course.courseCategory}
          </span>
          <span
            className={`badge ${isFree ? "badge-free" : "badge-sub"}`}
            style={{
              backdropFilter: "blur(8px)",
              WebkitBackdropFilter: "blur(8px)",
              boxShadow: "0 2px 6px rgba(0,0,0,0.15)",
            }}
          >
            {isFree ? "Free Track" : "Certified Track"}
          </span>
        </div>

        {/* Video count floating pill */}
        <div
          style={{
            position: "absolute",
            bottom: "0.75rem",
            right: "0.75rem",
            background: "rgba(9, 13, 22, 0.85)",
            color: "#ffffff",
            padding: "0.25rem 0.55rem",
            borderRadius: "var(--radius-sm)",
            fontSize: "0.75rem",
            fontWeight: 600,
            display: "flex",
            alignItems: "center",
            gap: "0.35rem",
            backdropFilter: "blur(6px)",
            border: "1px solid rgba(255, 255, 255, 0.15)",
          }}
        >
          <PlayCircle size={13} />
          <span>{videoCount} {videoCount === 1 ? "Lesson" : "Lessons"}</span>
        </div>
      </Link>

      {/* Card Content */}
      <div
        className="card-body"
        style={{
          display: "flex",
          flexDirection: "column",
          flex: 1,
          padding: "1.25rem",
        }}
      >
        {/* Class level indicator & duration */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            fontSize: "0.8rem",
            color: "var(--text-muted)",
            marginBottom: "0.5rem",
          }}
        >
          <span style={{ fontWeight: 600, color: "var(--primary)" }}>{course.courseClass}</span>
          <span style={{ display: "flex", alignItems: "center", gap: "0.25rem" }}>
            <Clock size={13} /> {course.duration || "8h 30m"}
          </span>
        </div>

        {/* Course Title */}
        <h3
          style={{
            fontSize: "1.1rem",
            lineHeight: 1.4,
            marginBottom: "0.5rem",
            color: "var(--text-main)",
            fontWeight: 700,
          }}
        >
          <Link
            to={`/courses/${course._id}`}
            style={{
              color: "inherit",
              textDecoration: "none",
              display: "-webkit-box",
              WebkitLineClamp: 2,
              WebkitBoxOrient: "vertical",
              overflow: "hidden",
            }}
          >
            {course.courseName}
          </Link>
        </h3>

        {/* Description Preview */}
        <p
          style={{
            fontSize: "0.875rem",
            color: "var(--text-muted)",
            marginBottom: "1rem",
            display: "-webkit-box",
            WebkitLineClamp: 2,
            WebkitBoxOrient: "vertical",
            overflow: "hidden",
            lineHeight: 1.55,
          }}
        >
          {course.courseDescription}
        </p>

        {/* Rating & Instructor */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            fontSize: "0.85rem",
            marginBottom: "1rem",
            color: "var(--text-muted)",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: "0.3rem", color: "var(--accent-amber)", fontWeight: 700 }}>
            <Star size={14} fill="currentColor" />
            <span>{course.rating || "4.8"}</span>
            <span style={{ color: "var(--text-light)", fontWeight: 500 }}>
              ({course.reviewsCount || 128})
            </span>
          </div>
          <div style={{ fontSize: "0.8rem", display: "flex", alignItems: "center", gap: "0.4rem" }}>
            <div
              style={{
                width: "18px",
                height: "18px",
                borderRadius: "50%",
                background: "var(--primary-light)",
                color: "var(--primary)",
                fontSize: "0.65rem",
                fontWeight: 700,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              {(course.instructor || "I").charAt(0)}
            </div>
            <span>{course.instructor?.split(" ")?.[0] || "Instructor"}</span>
          </div>
        </div>

        {/* Footer: Pricing & Action Button */}
        <div
          style={{
            marginTop: "auto",
            paddingTop: "0.85rem",
            borderTop: "1px solid var(--border-light)",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <div>
            {isFree ? (
              <span
                style={{
                  fontSize: "1.2rem",
                  fontWeight: 800,
                  color: "var(--success)",
                  fontFamily: "var(--font-heading)",
                }}
              >
                Free Access
              </span>
            ) : (
              <div style={{ display: "flex", alignItems: "baseline", gap: "0.4rem" }}>
                <span
                  style={{
                    fontSize: "1.3rem",
                    fontWeight: 800,
                    color: "var(--text-main)",
                    fontFamily: "var(--font-heading)",
                    letterSpacing: "-0.02em",
                  }}
                >
                  ₹{course.price}
                </span>
                {course.originalPrice > course.price && (
                  <span
                    style={{
                      fontSize: "0.8rem",
                      color: "var(--text-light)",
                      textDecoration: "line-through",
                    }}
                  >
                    ₹{course.originalPrice}
                  </span>
                )}
                {discountPercent > 0 && (
                  <span
                    style={{
                      fontSize: "0.7rem",
                      fontWeight: 700,
                      color: "var(--success)",
                      background: "var(--success-bg)",
                      padding: "0.15rem 0.35rem",
                      borderRadius: "var(--radius-xs)",
                    }}
                  >
                    {discountPercent}% OFF
                  </span>
                )}
              </div>
            )}
          </div>

          <Link
            to={`/courses/${course._id}`}
            className="btn btn-outline-primary btn-sm"
            style={{ gap: "0.3rem" }}
          >
            <span>Details</span>
            <ArrowRight size={13} />
          </Link>
        </div>
      </div>
    </div>
  );
};

export default CourseCard;
