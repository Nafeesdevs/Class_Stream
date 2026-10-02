import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import courseService from "../../services/courseService";
import EmptyState from "../../components/common/EmptyState";
import { CourseSkeletonCard } from "../../components/common/LoadingSkeleton";
import { BookOpen, PlayCircle } from "lucide-react";

export const MyLearningPage = () => {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        setLoading(true);
        const res = await courseService.getMyCourses();
        if (res?.courses) {
          setCourses(res.courses);
        }
      } catch (err) {
        console.warn("Could not load my courses:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchCourses();
  }, []);

  return (
    <div className="animate-fade-in responsive-page my-learning-page">
      <div style={{ marginBottom: "2rem" }}>
        <h1 style={{ fontSize: "1.75rem", marginBottom: "0.5rem" }}>My Learning</h1>
        <p style={{ color: "var(--text-muted)", fontSize: "0.95rem" }}>
          Access your enrolled tracks, continue watching lectures, and track your milestone achievements.
        </p>
      </div>

      {loading ? (
        <div className="grid-3">
          <CourseSkeletonCard key="learning-skeleton-one" />
          <CourseSkeletonCard key="learning-skeleton-two" />
        </div>
      ) : courses.length > 0 ? (
        <div className="grid-3">
          {courses.map((enrollment) => {
            const course = enrollment.course || enrollment;
            const thumbnail =
              course.courseImage?.[0]?.url ||
              "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=600&auto=format&fit=crop&q=80";

            const totalLessons = course.courseVideo?.length || 1;
            const completedCount = enrollment?.completedLessons?.length || 0;
            const percent = Math.min(100, Math.round((completedCount / totalLessons) * 100));
            const completedIndexes = new Set((enrollment?.completedLessons || []).map(Number));
            const firstUncompletedIndex = course.courseVideo?.findIndex((_, index) => !completedIndexes.has(index)) ?? -1;
            const nextLessonIndex = firstUncompletedIndex < 0 ? totalLessons - 1 : firstUncompletedIndex;

            return (
              <div
                key={enrollment.enrollmentId || course._id}
                className="card card-hover"
                style={{ display: "flex", flexDirection: "column" }}
              >
                <div style={{ position: "relative", width: "100%", paddingTop: "56.25%", overflow: "hidden" }}>
                  <img
                    src={thumbnail}
                    alt={course.courseName}
                    style={{ position: "absolute", top: 0, left: 0, width: "100%", height: "100%", objectFit: "cover" }}
                  />
                  <div
                    style={{
                      position: "absolute",
                      bottom: "0.75rem",
                      right: "0.75rem",
                      background: "rgba(15, 23, 42, 0.8)",
                      color: "#ffffff",
                      padding: "0.2rem 0.5rem",
                      borderRadius: "var(--radius-sm)",
                      fontSize: "0.75rem",
                      fontWeight: 600,
                    }}
                  >
                    {totalLessons} Lessons
                  </div>
                </div>

                <div className="card-body" style={{ display: "flex", flexDirection: "column", flex: 1, padding: "1.25rem" }}>
                  <span className="badge badge-primary" style={{ marginBottom: "0.5rem", alignSelf: "flex-start" }}>
                    {course.courseCategory}
                  </span>

                  <h3 style={{ fontSize: "1.1rem", marginBottom: "0.75rem" }}>
                    {course.courseName}
                  </h3>

                  {/* Progress Indicator */}
                  <div style={{ marginTop: "auto", marginBottom: "1rem" }}>
                    <div style={{ display: "flex", justifyContent: "space-between", fontSize: "0.8rem", color: "var(--text-muted)", marginBottom: "0.35rem" }}>
                      <span>Progress</span>
                      <span>{percent}% Complete</span>
                    </div>
                    <div style={{ width: "100%", height: "6px", background: "var(--border)", borderRadius: "var(--radius-full)", overflow: "hidden" }}>
                      <div style={{ width: `${percent}%`, height: "100%", background: percent === 100 ? "var(--success)" : "var(--primary)" }} />
                    </div>
                  </div>

                  <Link
                    to={`/learn/${course._id}?lesson=${nextLessonIndex}`}
                    className="btn btn-primary btn-sm"
                    style={{ width: "100%", gap: "0.5rem" }}
                  >
                    <PlayCircle size={16} />
                    <span>{percent > 0 ? "Continue Streaming" : "Start Course"}</span>
                  </Link>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <EmptyState
          icon={BookOpen}
          title="No Enrolled Courses Found"
          description="You haven't enrolled in any educational tracks yet. Browse the catalog to start streaming."
          actionText="Browse All Courses"
          onAction={() => (window.location.href = "/courses")}
        />
      )}
    </div>
  );
};

export default MyLearningPage;
