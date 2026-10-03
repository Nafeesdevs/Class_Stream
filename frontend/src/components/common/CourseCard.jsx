import React, { useRef } from "react";
import { Link } from "react-router-dom";
import { Play, Clock, Star, ArrowUpRight, Layers } from "lucide-react";

const FALLBACK_THUMB =
  "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=900&auto=format&fit=crop&q=80";

const MAX_SEGMENTS = 14;
const isPreview = (v) => v?.accessType === "free" || v?.accessType === "trial";

/**
 * Lesson Strip — the signature element of the card.
 * One segment per lesson (grouped if there are many). Free-preview lessons glow
 * green, so students can SEE how much they can try before paying.
 */
const LessonStrip = ({ videos = [] }) => {
  const total = videos.length;
  const previews = videos.filter(isPreview).length;
  const count = total === 0 ? 6 : Math.min(total, MAX_SEGMENTS);

  const segments = Array.from({ length: count }, (_, i) => {
    if (total === 0) return false;
    const start = Math.floor((i * total) / count);
    const end = Math.max(start + 1, Math.floor(((i + 1) * total) / count));
    return videos.slice(start, end).some(isPreview);
  });

  return (
    <div className="cc-strip">
      <div className="cc-strip-bar" aria-hidden="true">
        {segments.map((free, i) => (
          <i
            key={i}
            className={`cc-seg${free ? " is-free" : ""}${total === 0 ? " is-empty" : ""}`}
            style={{ "--i": i }}
          />
        ))}
      </div>
      <div className="cc-strip-label">
        <span>
          <Layers size={13} />
          {total === 0 ? "Lessons coming soon" : `${total} ${total === 1 ? "lesson" : "lessons"}`}
        </span>
        {previews > 0 && (
          <span className="cc-strip-free">
            <b />
            {previews} free {previews === 1 ? "preview" : "previews"}
          </span>
        )}
      </div>
    </div>
  );
};

export const CourseCard = ({ course }) => {
  const cardRef = useRef(null);
  const frame = useRef(0);

  if (!course) return null;

  const thumbnail = course.courseImage?.[0]?.url || FALLBACK_THUMB;
  const videos = course.courseVideo || [];
  const isFree = !course.isPaid || course.price === 0;
  const hasDiscount = !isFree && course.originalPrice > course.price;
  const discountPercent = hasDiscount
    ? Math.round(((course.originalPrice - course.price) / course.originalPrice) * 100)
    : 0;
  const link = `/courses/${course._id}`;
  const instructor = course.instructor || "Instructor";

  /* ---- 3D tilt + cursor spotlight (no React re-render, pure CSS vars) ---- */
  const handleMove = (e) => {
    if (e.pointerType && e.pointerType !== "mouse") return;
    const el = cardRef.current;
    if (!el) return;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const rect = el.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    cancelAnimationFrame(frame.current);
    frame.current = requestAnimationFrame(() => {
      el.classList.add("is-active");
      el.style.setProperty("--mx", `${x}px`);
      el.style.setProperty("--my", `${y}px`);
      if (!reduce) {
        el.style.setProperty("--ry", `${(x / rect.width - 0.5) * 9}deg`);
        el.style.setProperty("--rx", `${(0.5 - y / rect.height) * 7}deg`);
      }
    });
  };

  const handleLeave = () => {
    const el = cardRef.current;
    if (!el) return;
    cancelAnimationFrame(frame.current);
    el.classList.remove("is-active");
    el.style.setProperty("--rx", "0deg");
    el.style.setProperty("--ry", "0deg");
  };

  return (
    <article className="cc-wrap">
      <div
        ref={cardRef}
        className="cc-card"
        onPointerMove={handleMove}
        onPointerLeave={handleLeave}
      >
        {/* ---------- Media ---------- */}
        <Link to={link} className="cc-media" aria-label={course.courseName}>
          <img
            className="cc-media-img"
            src={thumbnail}
            alt=""
            loading="lazy"
            decoding="async"
          />
          <span className="cc-media-shade" />
          <span className="cc-chip cc-chip--glass">{course.courseCategory}</span>
          <span className={`cc-chip ${isFree ? "cc-chip--free" : "cc-chip--cert"}`}>
            {isFree ? "Free" : "Certified"}
          </span>
          <span className="cc-play" aria-hidden="true">
            <Play size={20} fill="currentColor" />
          </span>
        </Link>

        {/* ---------- Body ---------- */}
        <div className="cc-body">
          <div className="cc-meta">
            <span className="cc-class">{course.courseClass}</span>
            <span className="cc-duration">
              <Clock size={13} />
              {course.duration || "8h 30m"}
            </span>
          </div>

          <h3 className="cc-title">
            <Link to={link}>{course.courseName}</Link>
          </h3>

          <p className="cc-desc">{course.courseDescription}</p>

          <LessonStrip videos={videos} />

          <div className="cc-people">
            <span className="cc-rating">
              <Star size={14} fill="currentColor" />
              {course.rating || "4.8"}
              <em>({course.reviewsCount || 128})</em>
            </span>
            <span className="cc-instructor" title={instructor}>
              <i>{instructor.charAt(0).toUpperCase()}</i>
              <span>{instructor}</span>
            </span>
          </div>

          {/* ---------- Footer: price + action ---------- */}
          <div className="cc-foot">
            <div className="cc-price">
              {isFree ? (
                <>
                  <strong className="is-free">Free</strong>
                  <span className="cc-price-sub">Full access, no payment</span>
                </>
              ) : (
                <>
                  <strong>₹{course.price}</strong>
                  {hasDiscount && (
                    <span className="cc-price-sub">
                      <s>₹{course.originalPrice}</s>
                      <b className="cc-save">{discountPercent}% off</b>
                    </span>
                  )}
                </>
              )}
            </div>

            <Link to={link} className="cc-go" aria-label={`View ${course.courseName}`}>
              <span>View course</span>
              <ArrowUpRight size={18} />
            </Link>
          </div>
        </div>
      </div>
    </article>
  );
};

export default CourseCard;