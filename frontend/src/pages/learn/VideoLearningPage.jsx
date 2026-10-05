// import React, { useState, useEffect, useRef } from "react";
// import { useParams, useSearchParams, Link, useNavigate } from "react-router-dom";
// import courseService from "../../services/courseService";
// import { useAuth } from "../../context/AuthContext";
// import { useToast } from "../../context/ToastContext";
// import {
//   Play,
//   PlayCircle,
//   CheckCircle,
//   Lock,
//   Unlock,
//   ChevronLeft,
//   ChevronRight,
//   Menu,
//   X,
//   Clock,
//   BookOpen,
//   ArrowLeft,
//   ShieldAlert,
// } from "lucide-react";

// export const VideoLearningPage = () => {
//   const { id } = useParams();
//   const [searchParams, setSearchParams] = useSearchParams();
//   const lessonQuery = searchParams.get("lesson");
//   const lessonParam = lessonQuery === null ? null : Number.parseInt(lessonQuery, 10);

//   const navigate = useNavigate();
//   const { user, isAuthenticated } = useAuth();
//   const toast = useToast();

//   const [course, setCourse] = useState(null);
//   const [currentLessonIndex, setCurrentLessonIndex] = useState(lessonParam);
//   const [loading, setLoading] = useState(true);
//   const [accessDeniedModal, setAccessDeniedModal] = useState(false);
//   const [completedLessons, setCompletedLessons] = useState([]);
//   const [sidebarOpen, setSidebarOpen] = useState(true);

//   const videoRef = useRef(null);

//   // Fetch course & user progress
//   useEffect(() => {
//     const loadCourse = async () => {
//       try {
//         setLoading(true);
//         const data = await courseService.getCourseById(id);
//         if (data?.course) {
//           setCourse(data.course);

//           const enrollment = user?.enrolledCourses?.find(
//             (item) => String(item.course?._id || item.course || item) === String(id)
//           );
//           const savedLessons = data.userProgress?.completedLessons ?? enrollment?.completedLessons ?? [];
//           const normalizedCompletedLessons = savedLessons.map(Number).filter(Number.isInteger);
//           setCompletedLessons(normalizedCompletedLessons);

//           const requestedLesson = new URLSearchParams(window.location.search).get("lesson");
//           const requestedIndex = Number.parseInt(requestedLesson, 10);
//           const hasValidRequestedLesson = requestedLesson !== null &&
//             Number.isInteger(requestedIndex) &&
//             requestedIndex >= 0 &&
//             requestedIndex < data.course.courseVideo.length;
//           const completedIndexes = new Set(normalizedCompletedLessons);
//           const firstUncompletedIndex = data.course.courseVideo.findIndex((_, index) => !completedIndexes.has(index));
//           const initialLessonIndex = hasValidRequestedLesson
//             ? requestedIndex
//             : firstUncompletedIndex < 0
//               ? Math.max(data.course.courseVideo.length - 1, 0)
//               : firstUncompletedIndex;

//           setCurrentLessonIndex(initialLessonIndex);
//           if (!hasValidRequestedLesson) {
//             setSearchParams({ lesson: initialLessonIndex.toString() }, { replace: true });
//           }
//         }
//       } catch (err) {
//         toast.error("Could not load course curriculum.");
//       } finally {
//         setLoading(false);
//       }
//     };
//     loadCourse();
//   }, [id, user]);

//   // Synchronize active lesson when searchParams change
//   useEffect(() => {
//     if (Number.isInteger(lessonParam) && lessonParam >= 0 && course?.courseVideo && lessonParam < course.courseVideo.length) {
//       handleSelectLesson(lessonParam);
//     }
//   }, [lessonParam, course]);

//   // Check access whenever lesson changes
//   const handleSelectLesson = async (index) => {
//     if (!course?.courseVideo?.[index]) return;

//     const lesson = course.courseVideo[index];
//     const isEnrolled = user?.enrolledCourses?.some(
//       (c) => (c.course?._id || c.course || c) === id
//     );

//     // If lesson is free or trial, allow without backend call
//     if (lesson.accessType === "free" || lesson.accessType === "trial" || isEnrolled) {
//       setCurrentLessonIndex(index);
//       setSearchParams({ lesson: index.toString() });
//       setAccessDeniedModal(false);
//       return;
//     }

//     // Verify with backend
//     try {
//       const res = await courseService.checkVideoAccess(id, index);
//       if (res?.allowed) {
//         setCurrentLessonIndex(index);
//         setSearchParams({ lesson: index.toString() });
//         setAccessDeniedModal(false);
//       } else {
//         setAccessDeniedModal(true);
//       }
//     } catch (err) {
//       setAccessDeniedModal(true);
//     }
//   };

//   const handleVideoEnded = async () => {
//     const lessonIndex = currentLessonIndex;
//     if (completedLessons.includes(lessonIndex)) return;

//     const isEnrolled = user?.enrolledCourses?.some(
//       (enrollment) => (enrollment.course?._id || enrollment.course || enrollment) === id
//     );

//     if (isAuthenticated && isEnrolled) {
//       try {
//         const response = await courseService.updateProgress(id, lessonIndex, true);
//         setCompletedLessons(response.progress?.completedLessons || [
//           ...completedLessons,
//           lessonIndex,
//         ]);
//         toast.success("Lesson completed!");
//       } catch (err) {
//         toast.error(err.formattedMessage || "Could not save lesson completion.");
//         return;
//       }
//     } else {
//       setCompletedLessons((current) => current.includes(lessonIndex)
//         ? current
//         : [...current, lessonIndex]);
//     }
//   };

//   if (loading) {
//     return (
//       <div style={{ minHeight: "80vh", display: "flex", alignItems: "center", justifyContent: "center" }}>
//         <div style={{ textAlign: "center" }}>
//           <div className="skeleton" style={{ width: "60px", height: "60px", borderRadius: "50%", margin: "0 auto 1rem" }} />
//           <p>Preparing stream player...</p>
//         </div>
//       </div>
//     );
//   }

//   if (!course || !course.courseVideo || course.courseVideo.length === 0) {
//     return (
//       <div className="container" style={{ padding: "5rem 1.5rem", textAlign: "center" }}>
//         <h2>No video lessons available</h2>
//         <p style={{ marginTop: "1rem" }}>This course does not have published video lessons yet.</p>
//         <Link to={`/courses/${id}`} className="btn btn-primary" style={{ marginTop: "1.5rem" }}>
//           Back to Course Details
//         </Link>
//       </div>
//     );
//   }

//   const currentLesson = course.courseVideo[currentLessonIndex] || course.courseVideo[0];
//   const isLastLesson = currentLessonIndex === course.courseVideo.length - 1;
//   const isFirstLesson = currentLessonIndex === 0;

//   const progressPercentage = Math.round((completedLessons.length / course.courseVideo.length) * 100);

//   return (
//     <div className="video-learning-page" style={{ background: "#070a13", minHeight: "100vh", display: "flex", flexDirection: "column" }}>
//       {/* Mini top progress indicator line */}
//       <div style={{ width: "100%", height: "3px", background: "rgba(255, 255, 255, 0.08)", position: "relative" }}>
//         <div
//           style={{
//             height: "100%",
//             width: `${progressPercentage}%`,
//             background: "linear-gradient(90deg, var(--primary) 0%, var(--accent-teal) 100%)",
//             transition: "width 0.4s ease",
//           }}
//         />
//       </div>

//       {/* Top Learning Header */}
//       <div
//         style={{
//           background: "#0a0f1d",
//           borderBottom: "1px solid rgba(255, 255, 255, 0.08)",
//           padding: "0.85rem 1.5rem",
//           display: "flex",
//           alignItems: "center",
//           justifyContent: "space-between",
//           color: "#ffffff",
//         }}
//       >
//         <div style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
//           <Link
//             to={`/courses/${id}`}
//             style={{
//               color: "#94a3b8",
//               display: "flex",
//               alignItems: "center",
//               gap: "0.4rem",
//               textDecoration: "none",
//               fontSize: "0.875rem",
//               fontWeight: 500,
//             }}
//           >
//             <ArrowLeft size={16} />
//             <span>Course Details</span>
//           </Link>
//           <span style={{ color: "rgba(255, 255, 255, 0.15)" }}>|</span>
//           <h2 style={{ fontSize: "1.05rem", color: "#ffffff", fontWeight: 700, letterSpacing: "-0.01em" }}>
//             {course.courseName}
//           </h2>
//         </div>

//         <div style={{ display: "flex", alignItems: "center", gap: "1.25rem" }}>
//           <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
//             <span style={{ fontSize: "0.85rem", color: "#94a3b8", fontWeight: 500 }}>
//               Progress: <strong style={{ color: "#38bdf8" }}>{progressPercentage}%</strong>
//             </span>
//             <span style={{ fontSize: "0.8rem", color: "rgba(255, 255, 255, 0.4)" }}>
//               ({completedLessons.length}/{course.courseVideo.length})
//             </span>
//           </div>

//           <button
//             onClick={() => setSidebarOpen(!sidebarOpen)}
//             className="btn btn-sm"
//             style={{
//               background: "rgba(255, 255, 255, 0.08)",
//               color: "#ffffff",
//               border: "1px solid rgba(255, 255, 255, 0.12)",
//               borderRadius: "var(--radius-md)",
//               display: "flex",
//               alignItems: "center",
//               gap: "0.4rem",
//               fontSize: "0.825rem",
//             }}
//           >
//             {sidebarOpen ? <X size={15} /> : <Menu size={15} />}
//             <span>{sidebarOpen ? "Hide Playlist" : "Show Playlist"}</span>
//           </button>
//         </div>
//       </div>

//       {/* Main Video & Playlist Layout */}
//       <div
//         className="video-learning-container"
//         style={{
//           display: "flex",
//           flex: 1,
//           overflow: "hidden",
//         }}
//       >
//         {/* Left Video Area */}
//         <div
//           style={{
//             flex: 1,
//             display: "flex",
//             flexDirection: "column",
//             overflowY: "auto",
//             backgroundColor: "#060a14",
//           }}
//         >
//           {/* Video Player */}
//           <div
//             style={{
//               position: "relative",
//               width: "100%",
//               backgroundColor: "#000000",
//               aspectRatio: "16 / 9",
//               maxHeight: "70vh",
//             }}
//           >
//             <video
//               ref={videoRef}
//               key={currentLesson.url}
//               src={currentLesson.url}
//               controls
//               controlsList="nodownload"
//               autoPlay
//               playsInline
//               onEnded={handleVideoEnded}
//               style={{
//                 width: "100%",
//                 height: "100%",
//                 objectFit: "contain",
//               }}
//             />
//           </div>

//           {/* Player Bottom Control Bar & Metadata */}
//           <div style={{ padding: "2rem", color: "#ffffff" }}>
//             <div
//               style={{
//                 display: "flex",
//                 flexWrap: "wrap",
//                 alignItems: "center",
//                 justifyContent: "space-between",
//                 gap: "1rem",
//                 paddingBottom: "1.5rem",
//                 borderBottom: "1px solid rgba(255, 255, 255, 0.1)",
//                 marginBottom: "1.5rem",
//               }}
//             >
//               <div>
//                 <div style={{ display: "flex", alignItems: "center", gap: "0.65rem", marginBottom: "0.5rem" }}>
//                   <span className="badge badge-primary">
//                     Lesson {currentLessonIndex + 1} of {course.courseVideo.length}
//                   </span>
//                   <span
//                     className={`badge ${
//                       currentLesson.accessType === "free"
//                         ? "badge-free"
//                         : currentLesson.accessType === "trial"
//                         ? "badge-trial"
//                         : "badge-sub"
//                     }`}
//                   >
//                     {currentLesson.accessType}
//                   </span>
//                 </div>
//                 <h1 style={{ fontSize: "1.6rem", color: "#ffffff" }}>
//                   {currentLesson.title || `Lesson ${currentLessonIndex + 1}`}
//                 </h1>
//               </div>

//               {/* Navigation and Completion Buttons */}
//               <div style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
//                 <span
//                   role="status"
//                   aria-live="polite"
//                   style={{
//                     background: completedLessons.includes(currentLessonIndex)
//                       ? "var(--success)"
//                       : "rgba(255, 255, 255, 0.1)",
//                     color: "#ffffff",
//                     borderRadius: "var(--radius-md)",
//                     display: "inline-flex",
//                     alignItems: "center",
//                     gap: "0.4rem",
//                     padding: "0.625rem 1.25rem",
//                     fontWeight: 600,
//                     lineHeight: 1.25,
//                   }}
//                 >
//                   <CheckCircle size={16} />
//                   {completedLessons.includes(currentLessonIndex) ? "Completed" : "In Progress"}
//                 </span>

//                 <button
//                   disabled={isFirstLesson}
//                   onClick={() => handleSelectLesson(currentLessonIndex - 1)}
//                   className="btn btn-outline btn-sm video-lesson-prev"
//                 >
//                   <ChevronLeft size={16} /> Prev
//                 </button>

//                 <button
//                   disabled={isLastLesson}
//                   onClick={() => handleSelectLesson(currentLessonIndex + 1)}
//                   className="btn btn-primary btn-sm"
//                   style={{ opacity: 1 }}
//                 >
//                   Next <ChevronRight size={16} />
//                 </button>
//               </div>
//             </div>

//             {/* Lesson Details */}
//             <div style={{ maxWidth: "800px" }}>
//               <h3 style={{ fontSize: "1.15rem", color: "#ffffff", marginBottom: "0.75rem" }}>
//                 Lesson Overview & Key Takeaways
//               </h3>
//               <p style={{ color: "#94a3b8", lineHeight: 1.7, fontSize: "0.95rem" }}>
//                 {currentLesson.description ||
//                   "In this lesson, we explore modern software patterns, practical workflows, and real-world considerations for scaling applications in production environments."}
//               </p>
//             </div>
//           </div>
//         </div>

//         {/* Right Playlist Sidebar */}
//         {sidebarOpen && (
//           <aside
//             style={{
//               width: "360px",
//               background: "#090f20",
//               borderLeft: "1px solid rgba(255, 255, 255, 0.1)",
//               display: "flex",
//               flexDirection: "column",
//               overflowY: "auto",
//             }}
//           >
//             <div
//               style={{
//                 padding: "1.25rem 1.5rem",
//                 borderBottom: "1px solid rgba(255, 255, 255, 0.1)",
//                 color: "#ffffff",
//               }}
//             >
//               <h3 style={{ fontSize: "1.1rem", color: "#ffffff" }}>Course Syllabus</h3>
//               <p style={{ fontSize: "0.8rem", color: "#94a3b8", marginTop: "2px" }}>
//                 Click any lesson to start streaming
//               </p>
//             </div>

//             <div style={{ display: "flex", flexDirection: "column" }}>
//               {course.courseVideo.map((vid, idx) => {
//                 const isActive = idx === currentLessonIndex;
//                 const isCompleted = completedLessons.includes(idx);
//                 const isFreeOrTrial = vid.accessType === "free" || vid.accessType === "trial";
//                 const isEnrolled = user?.enrolledCourses?.some(
//                   (c) => (c.course?._id || c.course || c) === id
//                 );
//                 const isLocked = !isEnrolled && !isFreeOrTrial;

//                 return (
//                   <div
//                     key={idx}
//                     onClick={() => handleSelectLesson(idx)}
//                     style={{
//                       padding: "1rem 1.25rem",
//                       borderBottom: "1px solid rgba(255, 255, 255, 0.06)",
//                       cursor: "pointer",
//                       backgroundColor: isActive ? "rgba(37, 99, 235, 0.25)" : "transparent",
//                       borderLeft: isActive ? "4px solid var(--primary)" : "4px solid transparent",
//                       display: "flex",
//                       alignItems: "flex-start",
//                       gap: "0.85rem",
//                       transition: "background var(--transition-fast)",
//                     }}
//                   >
//                     <div style={{ marginTop: "2px", color: isCompleted ? "var(--success)" : "#94a3b8" }}>
//                       {isCompleted ? (
//                         <CheckCircle size={18} color="var(--success)" />
//                       ) : isLocked ? (
//                         <Lock size={16} color="#64748b" />
//                       ) : (
//                         <PlayCircle size={18} color={isActive ? "var(--primary)" : "#94a3b8"} />
//                       )}
//                     </div>

//                     <div style={{ flex: 1 }}>
//                       <div
//                         style={{
//                           fontSize: "0.9rem",
//                           fontWeight: isActive ? 700 : 500,
//                           color: isActive ? "#ffffff" : "#cbd5e1",
//                           lineHeight: 1.4,
//                           marginBottom: "0.25rem",
//                         }}
//                       >
//                         {vid.title || `Lesson ${idx + 1}`}
//                       </div>
//                       <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", fontSize: "0.75rem", color: "#94a3b8" }}>
//                         <span>{vid.duration || "15:00"}</span>
//                         <span>•</span>
//                         <span
//                           style={{
//                             color:
//                               vid.accessType === "free"
//                                 ? "var(--success)"
//                                 : vid.accessType === "trial"
//                                 ? "var(--warning)"
//                                 : "#a855f7",
//                             fontWeight: 600,
//                             textTransform: "uppercase",
//                           }}
//                         >
//                           {vid.accessType}
//                         </span>
//                       </div>
//                     </div>
//                   </div>
//                 );
//               })}
//             </div>
//           </aside>
//         )}
//       </div>

//       {/* Locked Video Modal */}
//       {accessDeniedModal && (
//         <div className="modal-backdrop" onClick={() => setAccessDeniedModal(false)}>
//           <div
//             className="modal-dialog animate-modal"
//             onClick={(e) => e.stopPropagation()}
//             style={{ maxWidth: "480px", textAlign: "center", padding: "2.5rem 2rem" }}
//           >
//             <div
//               style={{
//                 width: "64px",
//                 height: "64px",
//                 borderRadius: "50%",
//                 background: "rgba(124, 58, 237, 0.12)",
//                 color: "var(--secondary)",
//                 display: "flex",
//                 alignItems: "center",
//                 justifyContent: "center",
//                 margin: "0 auto 1.5rem auto",
//               }}
//             >
//               <Lock size={32} />
//             </div>

//             <h3 style={{ fontSize: "1.4rem", marginBottom: "0.75rem" }}>
//               Subscription Lesson Locked
//             </h3>
//             <p style={{ color: "var(--text-muted)", fontSize: "0.95rem", lineHeight: 1.6, marginBottom: "2rem" }}>
//               This lecture is part of the full curriculum. Enroll in <strong>{course.courseName}</strong> to
//               unlock all advanced lessons, source blueprints, and certificate issuance.
//             </p>

//             <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>
//               <Link
//                 to={`/courses/${course._id}`}
//                 className="btn btn-primary btn-lg"
//                 style={{ width: "100%" }}
//               >
//                 Enroll in Course Now
//               </Link>
//               <button
//                 onClick={() => setAccessDeniedModal(false)}
//                 className="btn btn-outline"
//                 style={{ width: "100%" }}
//               >
//                 Continue Watching Free Preview
//               </button>
//             </div>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// };

// export default VideoLearningPage;

import React, { useState, useEffect, useRef } from "react";
import { useParams, useSearchParams, Link, useNavigate } from "react-router-dom";
import courseService from "../../services/courseService";
import { useAuth } from "../../context/AuthContext";
import { useToast } from "../../context/ToastContext";
import {
  Play,
  PlayCircle,
  CheckCircle,
  Lock,
  Unlock,
  ChevronLeft,
  ChevronRight,
  Menu,
  X,
  Clock,
  BookOpen,
  ArrowLeft,
  ShieldAlert,
} from "lucide-react";

// Blocks the browser's right-click menu (Save video as, Copy video address, Inspect, etc.)
const blockContextMenu = (e) => e.preventDefault();

export const VideoLearningPage = () => {
  const { id } = useParams();
  const [searchParams, setSearchParams] = useSearchParams();
  const lessonQuery = searchParams.get("lesson");
  const lessonParam = lessonQuery === null ? null : Number.parseInt(lessonQuery, 10);

  const navigate = useNavigate();
  const { user, isAuthenticated } = useAuth();
  const toast = useToast();

  const [course, setCourse] = useState(null);
  const [currentLessonIndex, setCurrentLessonIndex] = useState(lessonParam);
  const [loading, setLoading] = useState(true);
  const [accessDeniedModal, setAccessDeniedModal] = useState(false);
  const [completedLessons, setCompletedLessons] = useState([]);
  const [sidebarOpen, setSidebarOpen] = useState(true);

  const videoRef = useRef(null);

  // Fetch course & user progress
  useEffect(() => {
    const loadCourse = async () => {
      try {
        setLoading(true);
        const data = await courseService.getCourseById(id);
        if (data?.course) {
          setCourse(data.course);

          const enrollment = user?.enrolledCourses?.find(
            (item) => String(item.course?._id || item.course || item) === String(id)
          );
          const savedLessons = data.userProgress?.completedLessons ?? enrollment?.completedLessons ?? [];
          const normalizedCompletedLessons = savedLessons.map(Number).filter(Number.isInteger);
          setCompletedLessons(normalizedCompletedLessons);

          const requestedLesson = new URLSearchParams(window.location.search).get("lesson");
          const requestedIndex = Number.parseInt(requestedLesson, 10);
          const hasValidRequestedLesson = requestedLesson !== null &&
            Number.isInteger(requestedIndex) &&
            requestedIndex >= 0 &&
            requestedIndex < data.course.courseVideo.length;
          const completedIndexes = new Set(normalizedCompletedLessons);
          const firstUncompletedIndex = data.course.courseVideo.findIndex((_, index) => !completedIndexes.has(index));
          const initialLessonIndex = hasValidRequestedLesson
            ? requestedIndex
            : firstUncompletedIndex < 0
              ? Math.max(data.course.courseVideo.length - 1, 0)
              : firstUncompletedIndex;

          setCurrentLessonIndex(initialLessonIndex);
          if (!hasValidRequestedLesson) {
            setSearchParams({ lesson: initialLessonIndex.toString() }, { replace: true });
          }
        }
      } catch (err) {
        toast.error("Could not load course curriculum.");
      } finally {
        setLoading(false);
      }
    };
    loadCourse();
  }, [id, user]);

  // Synchronize active lesson when searchParams change
  useEffect(() => {
    if (Number.isInteger(lessonParam) && lessonParam >= 0 && course?.courseVideo && lessonParam < course.courseVideo.length) {
      handleSelectLesson(lessonParam);
    }
  }, [lessonParam, course]);

  // Check access whenever lesson changes
  const handleSelectLesson = async (index) => {
    if (!course?.courseVideo?.[index]) return;

    const lesson = course.courseVideo[index];
    const isEnrolled = user?.enrolledCourses?.some(
      (c) => (c.course?._id || c.course || c) === id
    );

    // If lesson is free or trial, allow without backend call
    if (lesson.accessType === "free" || lesson.accessType === "trial" || isEnrolled) {
      setCurrentLessonIndex(index);
      setSearchParams({ lesson: index.toString() });
      setAccessDeniedModal(false);
      return;
    }

    // Verify with backend
    try {
      const res = await courseService.checkVideoAccess(id, index);
      if (res?.allowed) {
        setCurrentLessonIndex(index);
        setSearchParams({ lesson: index.toString() });
        setAccessDeniedModal(false);
      } else {
        setAccessDeniedModal(true);
      }
    } catch (err) {
      setAccessDeniedModal(true);
    }
  };

  const handleVideoEnded = async () => {
    const lessonIndex = currentLessonIndex;
    if (completedLessons.includes(lessonIndex)) return;

    const isEnrolled = user?.enrolledCourses?.some(
      (enrollment) => (enrollment.course?._id || enrollment.course || enrollment) === id
    );

    if (isAuthenticated && isEnrolled) {
      try {
        const response = await courseService.updateProgress(id, lessonIndex, true);
        setCompletedLessons(response.progress?.completedLessons || [
          ...completedLessons,
          lessonIndex,
        ]);
        toast.success("Lesson completed!");
      } catch (err) {
        toast.error(err.formattedMessage || "Could not save lesson completion.");
        return;
      }
    } else {
      setCompletedLessons((current) => current.includes(lessonIndex)
        ? current
        : [...current, lessonIndex]);
    }
  };

  if (loading) {
    return (
      <div style={{ minHeight: "80vh", display: "flex", alignItems: "center", justifyContent: "center" }}>
        <div style={{ textAlign: "center" }}>
          <div className="skeleton" style={{ width: "60px", height: "60px", borderRadius: "50%", margin: "0 auto 1rem" }} />
          <p>Preparing stream player...</p>
        </div>
      </div>
    );
  }

  if (!course || !course.courseVideo || course.courseVideo.length === 0) {
    return (
      <div className="container" style={{ padding: "5rem 1.5rem", textAlign: "center" }}>
        <h2>No video lessons available</h2>
        <p style={{ marginTop: "1rem" }}>This course does not have published video lessons yet.</p>
        <Link to={`/courses/${id}`} className="btn btn-primary" style={{ marginTop: "1.5rem" }}>
          Back to Course Details
        </Link>
      </div>
    );
  }

  const currentLesson = course.courseVideo[currentLessonIndex] || course.courseVideo[0];
  const isLastLesson = currentLessonIndex === course.courseVideo.length - 1;
  const isFirstLesson = currentLessonIndex === 0;

  const progressPercentage = Math.round((completedLessons.length / course.courseVideo.length) * 100);

  return (
    <div className="video-learning-page" style={{ background: "#070a13", minHeight: "100vh", display: "flex", flexDirection: "column" }}>
      {/* Mini top progress indicator line */}
      <div style={{ width: "100%", height: "3px", background: "rgba(255, 255, 255, 0.08)", position: "relative" }}>
        <div
          style={{
            height: "100%",
            width: `${progressPercentage}%`,
            background: "linear-gradient(90deg, var(--primary) 0%, var(--accent-teal) 100%)",
            transition: "width 0.4s ease",
          }}
        />
      </div>

      {/* Top Learning Header */}
      <div
        style={{
          background: "#0a0f1d",
          borderBottom: "1px solid rgba(255, 255, 255, 0.08)",
          padding: "0.85rem 1.5rem",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          color: "#ffffff",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
          <Link
            to={`/courses/${id}`}
            style={{
              color: "#94a3b8",
              display: "flex",
              alignItems: "center",
              gap: "0.4rem",
              textDecoration: "none",
              fontSize: "0.875rem",
              fontWeight: 500,
            }}
          >
            <ArrowLeft size={16} />
            <span>Course Details</span>
          </Link>
          <span style={{ color: "rgba(255, 255, 255, 0.15)" }}>|</span>
          <h2 style={{ fontSize: "1.05rem", color: "#ffffff", fontWeight: 700, letterSpacing: "-0.01em" }}>
            {course.courseName}
          </h2>
        </div>

        <div style={{ display: "flex", alignItems: "center", gap: "1.25rem" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
            <span style={{ fontSize: "0.85rem", color: "#94a3b8", fontWeight: 500 }}>
              Progress: <strong style={{ color: "#38bdf8" }}>{progressPercentage}%</strong>
            </span>
            <span style={{ fontSize: "0.8rem", color: "rgba(255, 255, 255, 0.4)" }}>
              ({completedLessons.length}/{course.courseVideo.length})
            </span>
          </div>

          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="btn btn-sm"
            style={{
              background: "rgba(255, 255, 255, 0.08)",
              color: "#ffffff",
              border: "1px solid rgba(255, 255, 255, 0.12)",
              borderRadius: "var(--radius-md)",
              display: "flex",
              alignItems: "center",
              gap: "0.4rem",
              fontSize: "0.825rem",
            }}
          >
            {sidebarOpen ? <X size={15} /> : <Menu size={15} />}
            <span>{sidebarOpen ? "Hide Playlist" : "Show Playlist"}</span>
          </button>
        </div>
      </div>

      {/* Main Video & Playlist Layout */}
      <div
        className="video-learning-container"
        style={{
          display: "flex",
          flex: 1,
          overflow: "hidden",
        }}
      >
        {/* Left Video Area */}
        <div
          style={{
            flex: 1,
            display: "flex",
            flexDirection: "column",
            overflowY: "auto",
            backgroundColor: "#060a14",
          }}
        >
          {/* Video Player */}
          <div
            onContextMenu={blockContextMenu}
            style={{
              position: "relative",
              width: "100%",
              backgroundColor: "#000000",
              aspectRatio: "16 / 9",
              maxHeight: "70vh",
            }}
          >
            <video
              ref={videoRef}
              key={currentLesson.url}
              src={currentLesson.url}
              controls
              controlsList="nodownload noremoteplayback"
              disablePictureInPicture
              disableRemotePlayback
              onContextMenu={blockContextMenu}
              autoPlay
              playsInline
              onEnded={handleVideoEnded}
              style={{
                width: "100%",
                height: "100%",
                objectFit: "contain",
              }}
            />
          </div>

          {/* Player Bottom Control Bar & Metadata */}
          <div style={{ padding: "2rem", color: "#ffffff" }}>
            <div
              style={{
                display: "flex",
                flexWrap: "wrap",
                alignItems: "center",
                justifyContent: "space-between",
                gap: "1rem",
                paddingBottom: "1.5rem",
                borderBottom: "1px solid rgba(255, 255, 255, 0.1)",
                marginBottom: "1.5rem",
              }}
            >
              <div>
                <div style={{ display: "flex", alignItems: "center", gap: "0.65rem", marginBottom: "0.5rem" }}>
                  <span className="badge badge-primary">
                    Lesson {currentLessonIndex + 1} of {course.courseVideo.length}
                  </span>
                  <span
                    className={`badge ${
                      currentLesson.accessType === "free"
                        ? "badge-free"
                        : currentLesson.accessType === "trial"
                        ? "badge-trial"
                        : "badge-sub"
                    }`}
                  >
                    {currentLesson.accessType}
                  </span>
                </div>
                <h1 style={{ fontSize: "1.6rem", color: "#ffffff" }}>
                  {currentLesson.title || `Lesson ${currentLessonIndex + 1}`}
                </h1>
              </div>

              {/* Navigation and Completion Buttons */}
              <div style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
                <span
                  role="status"
                  aria-live="polite"
                  style={{
                    background: completedLessons.includes(currentLessonIndex)
                      ? "var(--success)"
                      : "rgba(255, 255, 255, 0.1)",
                    color: "#ffffff",
                    borderRadius: "var(--radius-md)",
                    display: "inline-flex",
                    alignItems: "center",
                    gap: "0.4rem",
                    padding: "0.625rem 1.25rem",
                    fontWeight: 600,
                    lineHeight: 1.25,
                  }}
                >
                  <CheckCircle size={16} />
                  {completedLessons.includes(currentLessonIndex) ? "Completed" : "In Progress"}
                </span>

                <button
                  disabled={isFirstLesson}
                  onClick={() => handleSelectLesson(currentLessonIndex - 1)}
                  className="btn btn-outline btn-sm video-lesson-prev"
                >
                  <ChevronLeft size={16} /> Prev
                </button>

                <button
                  disabled={isLastLesson}
                  onClick={() => handleSelectLesson(currentLessonIndex + 1)}
                  className="btn btn-primary btn-sm"
                  style={{ opacity: 1 }}
                >
                  Next <ChevronRight size={16} />
                </button>
              </div>
            </div>

            {/* Lesson Details */}
            <div style={{ maxWidth: "800px" }}>
              <h3 style={{ fontSize: "1.15rem", color: "#ffffff", marginBottom: "0.75rem" }}>
                Lesson Overview & Key Takeaways
              </h3>
              <p style={{ color: "#94a3b8", lineHeight: 1.7, fontSize: "0.95rem" }}>
                {currentLesson.description ||
                  "In this lesson, we explore modern software patterns, practical workflows, and real-world considerations for scaling applications in production environments."}
              </p>
            </div>
          </div>
        </div>

        {/* Right Playlist Sidebar */}
        {sidebarOpen && (
          <aside
            style={{
              width: "360px",
              background: "#090f20",
              borderLeft: "1px solid rgba(255, 255, 255, 0.1)",
              display: "flex",
              flexDirection: "column",
              overflowY: "auto",
            }}
          >
            <div
              style={{
                padding: "1.25rem 1.5rem",
                borderBottom: "1px solid rgba(255, 255, 255, 0.1)",
                color: "#ffffff",
              }}
            >
              <h3 style={{ fontSize: "1.1rem", color: "#ffffff" }}>Course Syllabus</h3>
              <p style={{ fontSize: "0.8rem", color: "#94a3b8", marginTop: "2px" }}>
                Click any lesson to start streaming
              </p>
            </div>

            <div style={{ display: "flex", flexDirection: "column" }}>
              {course.courseVideo.map((vid, idx) => {
                const isActive = idx === currentLessonIndex;
                const isCompleted = completedLessons.includes(idx);
                const isFreeOrTrial = vid.accessType === "free" || vid.accessType === "trial";
                const isEnrolled = user?.enrolledCourses?.some(
                  (c) => (c.course?._id || c.course || c) === id
                );
                const isLocked = !isEnrolled && !isFreeOrTrial;

                return (
                  <div
                    key={idx}
                    onClick={() => handleSelectLesson(idx)}
                    style={{
                      padding: "1rem 1.25rem",
                      borderBottom: "1px solid rgba(255, 255, 255, 0.06)",
                      cursor: "pointer",
                      backgroundColor: isActive ? "rgba(37, 99, 235, 0.25)" : "transparent",
                      borderLeft: isActive ? "4px solid var(--primary)" : "4px solid transparent",
                      display: "flex",
                      alignItems: "flex-start",
                      gap: "0.85rem",
                      transition: "background var(--transition-fast)",
                    }}
                  >
                    <div style={{ marginTop: "2px", color: isCompleted ? "var(--success)" : "#94a3b8" }}>
                      {isCompleted ? (
                        <CheckCircle size={18} color="var(--success)" />
                      ) : isLocked ? (
                        <Lock size={16} color="#64748b" />
                      ) : (
                        <PlayCircle size={18} color={isActive ? "var(--primary)" : "#94a3b8"} />
                      )}
                    </div>

                    <div style={{ flex: 1 }}>
                      <div
                        style={{
                          fontSize: "0.9rem",
                          fontWeight: isActive ? 700 : 500,
                          color: isActive ? "#ffffff" : "#cbd5e1",
                          lineHeight: 1.4,
                          marginBottom: "0.25rem",
                        }}
                      >
                        {vid.title || `Lesson ${idx + 1}`}
                      </div>
                      <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", fontSize: "0.75rem", color: "#94a3b8" }}>
                        <span>{vid.duration || "15:00"}</span>
                        <span>•</span>
                        <span
                          style={{
                            color:
                              vid.accessType === "free"
                                ? "var(--success)"
                                : vid.accessType === "trial"
                                ? "var(--warning)"
                                : "#a855f7",
                            fontWeight: 600,
                            textTransform: "uppercase",
                          }}
                        >
                          {vid.accessType}
                        </span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </aside>
        )}
      </div>

      {/* Locked Video Modal */}
      {accessDeniedModal && (
        <div className="modal-backdrop" onClick={() => setAccessDeniedModal(false)}>
          <div
            className="modal-dialog animate-modal"
            onClick={(e) => e.stopPropagation()}
            style={{ maxWidth: "480px", textAlign: "center", padding: "2.5rem 2rem" }}
          >
            <div
              style={{
                width: "64px",
                height: "64px",
                borderRadius: "50%",
                background: "rgba(124, 58, 237, 0.12)",
                color: "var(--secondary)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                margin: "0 auto 1.5rem auto",
              }}
            >
              <Lock size={32} />
            </div>

            <h3 style={{ fontSize: "1.4rem", marginBottom: "0.75rem" }}>
              Subscription Lesson Locked
            </h3>
            <p style={{ color: "var(--text-muted)", fontSize: "0.95rem", lineHeight: 1.6, marginBottom: "2rem" }}>
              This lecture is part of the full curriculum. Enroll in <strong>{course.courseName}</strong> to
              unlock all advanced lessons, source blueprints, and certificate issuance.
            </p>

            <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>
              <Link
                to={`/courses/${course._id}`}
                className="btn btn-primary btn-lg"
                style={{ width: "100%" }}
              >
                Enroll in Course Now
              </Link>
              <button
                onClick={() => setAccessDeniedModal(false)}
                className="btn btn-outline"
                style={{ width: "100%" }}
              >
                Continue Watching Free Preview
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default VideoLearningPage;