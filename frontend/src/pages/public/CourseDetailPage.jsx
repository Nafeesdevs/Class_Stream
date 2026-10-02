// import React, { useState, useEffect } from "react";
// import { useParams, Link, useNavigate, useLocation } from "react-router-dom";
// import courseService from "../../services/courseService";
// import paymentService from "../../services/paymentService";
// import { useAuth } from "../../context/AuthContext";
// import { useToast } from "../../context/ToastContext";
// import {
//   Star,
//   Clock,
//   PlayCircle,
//   Lock,
//   Unlock,
//   CheckCircle2,
//   Users,
//   ShieldCheck,
//   ChevronRight,
//   Sparkles,
//   HelpCircle,
//   FileText,
//   Award,
// } from "lucide-react";

// export const CourseDetailPage = () => {
//   const { id } = useParams();
//   const navigate = useNavigate();
//   const location = useLocation();
//   const { user, isAuthenticated, refreshUser } = useAuth();
//   const toast = useToast();

//   const [course, setCourse] = useState(null);
//   const [loading, setLoading] = useState(true);
//   const [isEnrolled, setIsEnrolled] = useState(false);
//   const [enrolling, setEnrolling] = useState(false);

//   useEffect(() => {
//     const fetchCourse = async () => {
//       try {
//         setLoading(true);
//         const data = await courseService.getCourseById(id);
//         if (data?.course) {
//           setCourse(data.course);
//           setIsEnrolled(Boolean(data.isEnrolled));
//         }
//       } catch (err) {
//         toast.error("Could not load course details.");
//       } finally {
//         setLoading(false);
//       }
//     };
//     fetchCourse();
//   }, [id, user]);

//   // Handle Enrollment / Checkout
//   const handleEnrollment = async () => {
//     if (!isAuthenticated) {
//       toast.info("Please sign in or create an account to enroll.");
//       navigate("/login", { state: { from: location } });
//       return;
//     }

//     if (isEnrolled) {
//       navigate(`/learn/${id}`);
//       return;
//     }

//     // Free Course Flow
//     if (!course.isPaid || course.price === 0) {
//       try {
//         setEnrolling(true);
//         await courseService.enrollFree(course._id);
//         toast.success("Successfully enrolled in " + course.courseName + "!");
//         setIsEnrolled(true);
//         await refreshUser();
//         navigate(`/learn/${id}`);
//       } catch (err) {
//         toast.error(err.formattedMessage || "Enrollment failed.");
//       } finally {
//         setEnrolling(false);
//       }
//       return;
//     }

//     // Paid Course Razorpay Flow
//     try {
//       setEnrolling(true);
//       const orderData = await paymentService.createOrder(course._id);

//       if (!orderData?.order) {
//         throw new Error("Could not initialize payment order.");
//       }

//       const { order, keyId } = orderData;

//       // Check if Razorpay script is loaded
//       const openRazorpayCheckout = () => {
//         const options = {
//           key: keyId || import.meta.env.VITE_RAZORPAY_KEY_ID || "rzp_test_mockKey",
//           amount: order.amount,
//           currency: order.currency || "INR",
//           name: "Class Stream",
//           description: `Enrollment: ${course.courseName}`,
//           image: "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=200&auto=format&fit=crop&q=80",
//           order_id: order.id,
//           prefill: {
//             name: user?.name,
//             email: user?.email,
//           },
//           theme: {
//             color: "#1e3a8a",
//           },
//           handler: async function (response) {
//             try {
//               toast.info("Verifying transaction with server...");
//               const verification = await paymentService.verifyPayment({
//                 razorpay_order_id: response.razorpay_order_id,
//                 razorpay_payment_id: response.razorpay_payment_id,
//                 razorpay_signature: response.razorpay_signature,
//                 courseId: course._id,
//               });

//               if (verification?.success) {
//                 toast.success("Payment verified! Welcome to the course.");
//                 setIsEnrolled(true);
//                 await refreshUser();
//                 navigate(`/learn/${id}`);
//               }
//             } catch (vErr) {
//               toast.error(vErr.formattedMessage || "Payment verification failed.");
//             }
//           },
//           modal: {
//             ondismiss: function () {
//               setEnrolling(false);
//               toast.info("Payment was cancelled.");
//             },
//           },
//         };

//         if (window.Razorpay) {
//           const rzp = new window.Razorpay(options);
//           rzp.open();
//         } else {
//           // Fallback test verification simulator if external Razorpay script is blocked in container
//           fallbackSimulator(order);
//         }
//       };

//       const fallbackSimulator = async (order) => {
//         toast.info("Initializing secure test sandbox checkout...");
//         setTimeout(async () => {
//           try {
//             const mockPaymentId = `pay_test_${Date.now()}`;
//             // If in test mode without signature requirements, server handles it
//             const verification = await paymentService.verifyPayment({
//               razorpay_order_id: order.id,
//               razorpay_payment_id: mockPaymentId,
//               razorpay_signature: "mock_signature_test_verified",
//               courseId: course._id,
//             });

//             if (verification?.success) {
//               toast.success("Payment verified in Test Mode! Access unlocked.");
//               setIsEnrolled(true);
//               await refreshUser();
//               navigate(`/learn/${id}`);
//             }
//           } catch (err) {
//             toast.error(err.formattedMessage || "Simulation failed.");
//           } finally {
//             setEnrolling(false);
//           }
//         }, 1200);
//       };

//       openRazorpayCheckout();
//     } catch (err) {
//       toast.error(err.formattedMessage || "Could not process order.");
//       setEnrolling(false);
//     }
//   };

//   if (loading) {
//     return (
//       <div className="container" style={{ padding: "4rem 1.5rem" }}>
//         <div className="skeleton" style={{ height: "40px", width: "300px", marginBottom: "2rem" }} />
//         <div className="skeleton" style={{ height: "300px", width: "100%", borderRadius: "var(--radius-lg)" }} />
//       </div>
//     );
//   }

//   if (!course) {
//     return (
//       <div className="container" style={{ padding: "5rem 1.5rem", textAlign: "center" }}>
//         <h2>Course not found</h2>
//         <p style={{ marginTop: "1rem" }}>The requested course could not be located.</p>
//         <Link to="/courses" className="btn btn-primary" style={{ marginTop: "1.5rem" }}>
//           Browse Catalog
//         </Link>
//       </div>
//     );
//   }

//   const thumbnail =
//     course.courseImage?.[0]?.url ||
//     "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=800&auto=format&fit=crop&q=80";

//   const isFree = !course.isPaid || course.price === 0;

//   return (
//     <div className="animate-fade-in responsive-page course-detail-page" style={{ paddingBottom: "5rem" }}>
//       {/* Course Hero Banner */}
//       <section
//         style={{
//           background: "linear-gradient(135deg, #070c18 0%, #0b1426 50%, #1e293b 100%)",
//           color: "#ffffff",
//           padding: "4rem 0 3.75rem",
//           borderBottom: "1px solid rgba(255, 255, 255, 0.08)",
//           position: "relative",
//           overflow: "hidden",
//         }}
//       >
//         {/* Ambient Hero Spotlight Glow */}
//         <div
//           className="animate-aurora"
//           style={{
//             position: "absolute",
//             top: "-50px",
//             right: "5%",
//             width: "550px",
//             height: "400px",
//             background: "radial-gradient(circle, rgba(37, 99, 235, 0.22) 0%, rgba(6, 182, 212, 0.12) 50%, transparent 70%)",
//             filter: "blur(50px)",
//             pointerEvents: "none",
//           }}
//         />

//         <div className="container" style={{ position: "relative", zIndex: 2 }}>
//           <div
//             style={{
//               display: "flex",
//               alignItems: "center",
//               gap: "0.5rem",
//               fontSize: "0.85rem",
//               color: "#94a3b8",
//               marginBottom: "1.25rem",
//             }}
//           >
//             <Link to="/" style={{ color: "#94a3b8", textDecoration: "none" }}>Home</Link>
//             <ChevronRight size={14} />
//             <Link to="/courses" style={{ color: "#94a3b8", textDecoration: "none" }}>Courses</Link>
//             <ChevronRight size={14} />
//             <span style={{ color: "#38bdf8", fontWeight: 600 }}>{course.courseCategory}</span>
//           </div>

//           <div style={{ maxWidth: "820px" }}>
//             <div style={{ display: "flex", gap: "0.6rem", marginBottom: "1.25rem", flexWrap: "wrap" }}>
//               <span className="badge badge-primary" style={{ background: "rgba(37, 99, 235, 0.25)", color: "#93c5fd", border: "1px solid rgba(147, 197, 253, 0.3)" }}>
//                 {course.courseCategory}
//               </span>
//               <span className="badge" style={{ color: "#ffffff", background: "rgba(255,255,255,0.12)", border: "1px solid rgba(255,255,255,0.15)" }}>
//                 {course.courseClass}
//               </span>
//               <span className="badge" style={{ color: "var(--accent-teal)", background: "rgba(13, 148, 136, 0.2)", border: "1px solid rgba(45, 212, 191, 0.3)" }}>
//                 Full HD Streaming
//               </span>
//             </div>

//             <h1
//               style={{
//                 color: "#ffffff",
//                 fontSize: "clamp(2rem, 3.8vw, 2.75rem)",
//                 lineHeight: 1.18,
//                 marginBottom: "1.25rem",
//                 letterSpacing: "-0.03em",
//                 fontWeight: 800,
//               }}
//             >
//               {course.courseName}
//             </h1>

//             <p style={{ color: "#cbd5e1", fontSize: "1.05rem", lineHeight: 1.65, marginBottom: "1.75rem" }}>
//               {course.courseDescription}
//             </p>

//             {/* Meta Row */}
//             <div
//               style={{
//                 display: "flex",
//                 flexWrap: "wrap",
//                 alignItems: "center",
//                 gap: "1.75rem",
//                 fontSize: "0.875rem",
//                 color: "#94a3b8",
//                 borderTop: "1px solid rgba(255, 255, 255, 0.08)",
//                 paddingTop: "1.25rem",
//               }}
//             >
//               <div style={{ display: "flex", alignItems: "center", gap: "0.4rem", color: "var(--accent-amber)", fontWeight: 700 }}>
//                 <Star size={16} fill="currentColor" />
//                 <span style={{ color: "#ffffff" }}>{course.rating || 4.9}</span>
//                 <span style={{ color: "#94a3b8", fontWeight: 500 }}>({course.reviewsCount || 150} reviews)</span>
//               </div>
//               <div style={{ display: "flex", alignItems: "center", gap: "0.4rem" }}>
//                 <Users size={16} color="#94a3b8" />
//                 <span>1,420 enrolled</span>
//               </div>
//               <div style={{ display: "flex", alignItems: "center", gap: "0.4rem" }}>
//                 <Clock size={16} color="#94a3b8" />
//                 <span>{course.duration || "18 hours total"}</span>
//               </div>
//               <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
//                 <div
//                   style={{
//                     width: "22px",
//                     height: "22px",
//                     borderRadius: "50%",
//                     background: "var(--primary)",
//                     color: "#ffffff",
//                     fontSize: "0.7rem",
//                     fontWeight: 700,
//                     display: "flex",
//                     alignItems: "center",
//                     justifyContent: "center",
//                   }}
//                 >
//                   {(course.instructor || "F").charAt(0)}
//                 </div>
//                 <span>Instructor: <strong style={{ color: "#ffffff" }}>{course.instructor || "Lead Faculty Member"}</strong></span>
//               </div>
//             </div>
//           </div>
//         </div>
//       </section>

//       {/* Main Grid: Details on left, Sticky enrollment on right */}
//       <div className="container" style={{ marginTop: "2.5rem" }}>
//         <div
//           className="course-detail-layout"
//           style={{
//             display: "grid",
//             gridTemplateColumns: "1fr 380px",
//             gap: "3rem",
//             alignItems: "flex-start",
//           }}
//         >
//           {/* Left Column: Syllabus, Instructor, FAQ */}
//           <div>
//             {/* What you'll learn card */}
//             <div
//               className="card"
//               style={{
//                 padding: "2rem",
//                 marginBottom: "2.5rem",
//                 background: "var(--surface)",
//               }}
//             >
//               <h3 style={{ fontSize: "1.35rem", marginBottom: "1.25rem" }}>What You Will Master</h3>
//               <div
//                 style={{
//                   display: "grid",
//                   gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
//                   gap: "1rem",
//                 }}
//               >
//                 {[
//                   "Architect and deploy modern cloud microservice architectures",
//                   "Understand low-level data structures, state orchestration, and performance tuning",
//                   "Secure real-time APIs with JWT authentication and role-based permissions",
//                   "Integrate test-driven development and enterprise CI/CD workflows",
//                   "Deliver production-ready user interfaces with high accessibility standards",
//                   "Receive an industry-recognized certificate of accomplishment",
//                 ].map((item, idx) => (
//                   <div key={idx} style={{ display: "flex", alignItems: "flex-start", gap: "0.75rem", fontSize: "0.95rem" }}>
//                     <CheckCircle2 size={18} color="var(--success)" style={{ flexShrink: 0, marginTop: "2px" }} />
//                     <span style={{ color: "var(--text-main)" }}>{item}</span>
//                   </div>
//                 ))}
//               </div>
//             </div>

//             {/* Course Content / Lessons Curriculum */}
//             <div style={{ marginBottom: "2.5rem" }}>
//               <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", marginBottom: "1.25rem" }}>
//                 <h3 style={{ fontSize: "1.35rem" }}>Course Curriculum</h3>
//                 <span style={{ fontSize: "0.9rem", color: "var(--text-muted)" }}>
//                   {course.courseVideo?.length || 0} Lessons • {course.duration || "Full series"}
//                 </span>
//               </div>

//               <div
//                 className="card"
//                 style={{
//                   borderRadius: "var(--radius-lg)",
//                   overflow: "hidden",
//                 }}
//               >
//                 {course.courseVideo && course.courseVideo.length > 0 ? (
//                   course.courseVideo.map((vid, idx) => {
//                     const isVidFree = vid.accessType === "free";
//                     const isVidTrial = vid.accessType === "trial";
//                     const canPlay = isEnrolled || isVidFree || isVidTrial;

//                     return (
//                       <div
//                         key={idx}
//                         style={{
//                           padding: "1.1rem 1.5rem",
//                           borderBottom: idx < course.courseVideo.length - 1 ? "1px solid var(--border-light)" : "none",
//                           display: "flex",
//                           alignItems: "center",
//                           justifyContent: "space-between",
//                           backgroundColor: idx % 2 === 0 ? "var(--surface)" : "#fafcff",
//                           transition: "background var(--transition-fast)",
//                         }}
//                       >
//                         <div style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
//                           <div
//                             style={{
//                               width: "36px",
//                               height: "36px",
//                               borderRadius: "var(--radius-full)",
//                               background: canPlay ? "var(--primary-light)" : "var(--bg-subtle)",
//                               color: canPlay ? "var(--primary)" : "var(--text-light)",
//                               display: "flex",
//                               alignItems: "center",
//                               justifyContent: "center",
//                             }}
//                           >
//                             {canPlay ? <PlayCircle size={18} /> : <Lock size={16} />}
//                           </div>
//                           <div>
//                             <div style={{ fontWeight: 600, fontSize: "0.95rem", color: "var(--text-main)" }}>
//                               {vid.title || `Lesson ${idx + 1}`}
//                             </div>
//                             <div style={{ fontSize: "0.8rem", color: "var(--text-muted)", marginTop: "2px" }}>
//                               {vid.duration || "12:00 mins"}
//                             </div>
//                           </div>
//                         </div>

//                         <div style={{ display: "flex", alignItems: "center", gap: "0.85rem" }}>
//                           {isVidFree && <span className="badge badge-free">Free Lesson</span>}
//                           {isVidTrial && <span className="badge badge-trial">Trial Preview</span>}
//                           {!isVidFree && !isVidTrial && !isEnrolled && (
//                             <span className="badge badge-sub">Enrolled Only</span>
//                           )}

//                           {canPlay && (
//                             <Link
//                               to={`/learn/${course._id}?lesson=${idx}`}
//                               className="btn btn-outline-primary btn-sm"
//                               style={{ padding: "0.3rem 0.65rem", fontSize: "0.75rem" }}
//                             >
//                               Watch
//                             </Link>
//                           )}
//                         </div>
//                       </div>
//                     );
//                   })
//                 ) : (
//                   <div style={{ padding: "2rem", textAlign: "center", color: "var(--text-muted)" }}>
//                     No video lessons published yet for this course.
//                   </div>
//                 )}
//               </div>
//             </div>

//             {/* Instructor Profile Card */}
//             {/* <div
//               className="card"
//               style={{
//                 padding: "2rem",
//                 marginBottom: "2.5rem",
//               }}
//             >
//               <h3 style={{ fontSize: "1.35rem", marginBottom: "1.25rem" }}>Instructor</h3>
//               <div style={{ display: "flex", alignItems: "center", gap: "1.25rem" }}>
//                 <img
//                   src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=300&auto=format&fit=crop&q=80"
//                   alt={course.instructor}
//                   style={{
//                     width: "80px",
//                     height: "80px",
//                     borderRadius: "50%",
//                     objectFit: "cover",
//                     border: "2px solid var(--primary)",
//                   }}
//                 />
//                 <div>
//                   <h4 style={{ fontSize: "1.2rem", marginBottom: "0.25rem" }}>
//                     {course.instructor || "Lead Faculty Member"}
//                   </h4>
//                   <p style={{ fontSize: "0.875rem", color: "var(--text-muted)", marginBottom: "0.5rem" }}>
//                     {course.instructorTitle || "Senior Engineering Architect & Educator"}
//                   </p>
//                   <div style={{ display: "flex", gap: "1.5rem", fontSize: "0.85rem", color: "var(--text-muted)" }}>
//                     <span>⭐ 4.9 Instructor Rating</span>
//                     <span>🎓 28,000+ Students</span>
//                     <span>📚 8 Courses</span>
//                   </div>
//                 </div>
//               </div>
//             </div> */}
//           </div>

//           {/* Right Column: Sticky Enrollment & Checkout Card */}
//           <div
//             className="course-detail-sidebar"
//             style={{
//               position: "sticky",
//               top: "92px",
//             }}
//           >
//             <div
//               className="card"
//               style={{
//                 boxShadow: "var(--shadow-xl)",
//                 borderRadius: "var(--radius-xl)",
//                 overflow: "hidden",
//                 border: "1px solid var(--border)",
//               }}
//             >
//               {/* Media Preview */}
//               <div style={{ position: "relative", width: "100%", paddingTop: "56.25%" }}>
//                 <img
//                   src={thumbnail}
//                   alt={course.courseName}
//                   style={{
//                     position: "absolute",
//                     top: 0,
//                     left: 0,
//                     width: "100%",
//                     height: "100%",
//                     objectFit: "cover",
//                   }}
//                 />
//                 <div
//                   style={{
//                     position: "absolute",
//                     inset: 0,
//                     background: "rgba(15, 23, 42, 0.35)",
//                     display: "flex",
//                     alignItems: "center",
//                     justifyContent: "center",
//                   }}
//                 >
//                   <div
//                     onClick={handleEnrollment}
//                     style={{
//                       width: "56px",
//                       height: "56px",
//                       borderRadius: "50%",
//                       background: "#ffffff",
//                       color: "var(--primary)",
//                       display: "flex",
//                       alignItems: "center",
//                       justifyContent: "center",
//                       cursor: "pointer",
//                       boxShadow: "0 4px 15px rgba(0,0,0,0.3)",
//                     }}
//                   >
//                     <PlayCircle size={32} />
//                   </div>
//                 </div>
//               </div>

//               {/* Card Body */}
//               <div style={{ padding: "1.75rem" }}>
//                 {/* Price Display */}
//                 <div style={{ marginBottom: "1.5rem" }}>
//                   {isFree ? (
//                     <div>
//                       <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
//                         <span style={{ fontSize: "2.25rem", fontWeight: 800, color: "var(--success)", fontFamily: "var(--font-heading)" }}>
//                           Free
//                         </span>
//                         <span className="badge badge-free">Open Access</span>
//                       </div>
//                       <p style={{ fontSize: "0.85rem", color: "var(--text-muted)", marginTop: "0.25rem" }}>
//                         Complimentary open-access curriculum with certificate.
//                       </p>
//                     </div>
//                   ) : (
//                     <div>
//                       <div style={{ display: "flex", alignItems: "baseline", gap: "0.75rem" }}>
//                         <span style={{ fontSize: "2.35rem", fontWeight: 800, color: "var(--text-main)", fontFamily: "var(--font-heading)", letterSpacing: "-0.03em" }}>
//                           ₹{course.price}
//                         </span>
//                         {course.originalPrice > course.price && (
//                           <span style={{ fontSize: "1.1rem", color: "var(--text-light)", textDecoration: "line-through" }}>
//                             ₹{course.originalPrice}
//                           </span>
//                         )}
//                         {course.originalPrice > course.price && (
//                           <span className="badge badge-free">
//                             {Math.round(((course.originalPrice - course.price) / course.originalPrice) * 100)}% OFF
//                           </span>
//                         )}
//                       </div>
//                       <p style={{ fontSize: "0.825rem", color: "var(--text-muted)", marginTop: "0.25rem" }}>
//                         Full lifetime access & verified digital credential.
//                       </p>
//                     </div>
//                   )}
//                 </div>

//                 {/* Main Action Button */}
//                 <button
//                   onClick={handleEnrollment}
//                   disabled={enrolling}
//                   className="btn btn-primary btn-lg hover-elevate"
//                   style={{
//                     width: "100%",
//                     marginBottom: "0.85rem",
//                     justifyContent: "center",
//                     boxShadow: "0 6px 20px rgba(37, 99, 235, 0.28)",
//                   }}
//                 >
//                   {enrolling
//                     ? "Processing Enrollment..."
//                     : isEnrolled
//                       ? "Continue Learning →"
//                       : isFree
//                         ? "Enroll For Free"
//                         : `Instant Access • ₹${course.price}`}
//                 </button>

//                 {!isFree && !isEnrolled && (
//                   <div
//                     style={{
//                       display: "flex",
//                       alignItems: "center",
//                       justifyContent: "center",
//                       gap: "0.4rem",
//                       fontSize: "0.75rem",
//                       color: "var(--text-muted)",
//                       marginBottom: "1rem",
//                     }}
//                   >
//                     <ShieldCheck size={14} color="var(--success)" />
//                     <span>Razorpay Secure Test Mode • Instant Activation</span>
//                   </div>
//                 )}

//                 {/* Direct link to first lesson if free preview */}
//                 {course.courseVideo && course.courseVideo.length > 0 && !isEnrolled && (
//                   <Link
//                     to={`/learn/${course._id}?lesson=0`}
//                     className="btn btn-outline hover-elevate"
//                     style={{
//                       width: "100%",
//                       marginBottom: "1.5rem",
//                       fontSize: "0.875rem",
//                       justifyContent: "center",
//                       backgroundColor: "#ffffff",
//                     }}
//                   >
//                     <PlayCircle size={16} /> Watch Free Preview Lesson
//                   </Link>
//                 )}

//                 {/* Features List */}
//                 <div style={{ borderTop: "1px solid var(--border)", paddingTop: "1.25rem" }}>
//                   <h4 style={{ fontSize: "0.9rem", fontWeight: 700, marginBottom: "0.85rem", color: "var(--text-main)" }}>
//                     This masterclass includes:
//                   </h4>
//                   <ul style={{ listStyle: "none", display: "flex", flexDirection: "column", gap: "0.65rem", fontSize: "0.85rem", color: "var(--text-muted)" }}>
//                     <li style={{ display: "flex", alignItems: "center", gap: "0.6rem" }}>
//                       <PlayCircle size={16} color="var(--primary)" />
//                       <span>{course.duration || "18 hours"} on-demand HD video</span>
//                     </li>
//                     <li style={{ display: "flex", alignItems: "center", gap: "0.6rem" }}>
//                       <Award size={16} color="var(--primary)" />
//                       <span>Verifiable Certificate of Completion</span>
//                     </li>
//                     <li style={{ display: "flex", alignItems: "center", gap: "0.6rem" }}>
//                       <FileText size={16} color="var(--primary)" />
//                       <span>Production source code & assets</span>
//                     </li>
//                     <li style={{ display: "flex", alignItems: "center", gap: "0.6rem" }}>
//                       <ShieldCheck size={16} color="var(--success)" />
//                       <span>30-Day Money-Back Guarantee</span>
//                     </li>
//                   </ul>
//                 </div>
//               </div>
//             </div>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default CourseDetailPage;




import React, { useState, useEffect } from "react";
import { useParams, Link, useNavigate, useLocation } from "react-router-dom";
import courseService from "../../services/courseService";
import paymentService from "../../services/paymentService";
import { useAuth } from "../../context/AuthContext";
import { useToast } from "../../context/ToastContext";
import {
  Star,
  Clock,
  PlayCircle,
  Lock,
  Unlock,
  CheckCircle2,
  Users,
  ShieldCheck,
  ChevronRight,
  Sparkles,
  HelpCircle,
  FileText,
  Award,
} from "lucide-react";

export const CourseDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const { user, isAuthenticated, refreshUser } = useAuth();
  const toast = useToast();

  const [course, setCourse] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isEnrolled, setIsEnrolled] = useState(false);
  const [enrolling, setEnrolling] = useState(false);

  useEffect(() => {
    const fetchCourse = async () => {
      try {
        setLoading(true);
        const data = await courseService.getCourseById(id);
        if (data?.course) {
          setCourse(data.course);
          setIsEnrolled(Boolean(data.isEnrolled));
        }
      } catch (err) {
        toast.error("Could not load course details.");
      } finally {
        setLoading(false);
      }
    };
    fetchCourse();
  }, [id, user]);

  // Handle Enrollment / Checkout
  const handleEnrollment = async () => {
    if (!isAuthenticated) {
      toast.info("Please sign in or create an account to enroll.");
      navigate("/login", { state: { from: location } });
      return;
    }

    if (isEnrolled) {
      navigate(`/learn/${id}`);
      return;
    }

    // Free Course Flow
    if (!course.isPaid || course.price === 0) {
      try {
        setEnrolling(true);
        await courseService.enrollFree(course._id);
        toast.success("Successfully enrolled in " + course.courseName + "!");
        setIsEnrolled(true);
        await refreshUser();
        navigate(`/learn/${id}`);
      } catch (err) {
        toast.error(err.formattedMessage || "Enrollment failed.");
      } finally {
        setEnrolling(false);
      }
      return;
    }

    // Paid Course Razorpay Flow
    try {
      setEnrolling(true);
      const orderData = await paymentService.createOrder(course._id);

      if (!orderData?.order) {
        throw new Error("Could not initialize payment order.");
      }

      const { order, keyId } = orderData;

      const fallbackSimulator = async (order) => {
        toast.info("Initializing secure test sandbox checkout...");
        setTimeout(async () => {
          try {
            const mockPaymentId = `pay_test_${Date.now()}`;
            // If in test mode without signature requirements, server handles it
            const verification = await paymentService.verifyPayment({
              razorpay_order_id: order.id,
              razorpay_payment_id: mockPaymentId,
              razorpay_signature: "mock_signature_test_verified",
              courseId: course._id,
            });

            if (verification?.success) {
              toast.success("Payment verified in Test Mode! Access unlocked.");
              setIsEnrolled(true);
              await refreshUser();
              navigate(`/learn/${id}`);
            }
          } catch (err) {
            toast.error(err.formattedMessage || "Simulation failed.");
          } finally {
            setEnrolling(false);
          }
        }, 1200);
      };

      // Check if Razorpay script is loaded
      const openRazorpayCheckout = () => {
        // The backend falls back to a locally-generated "order_test_..." id
        // whenever it couldn't create a genuine order with Razorpay (e.g. no
        // real API keys configured yet). The REAL Razorpay Checkout widget
        // will always reject an order id it doesn't recognize with a
        // "Payment Failed" error, so route those straight to the local
        // sandbox simulator instead of opening the real widget against them.
        const isSimulatedOrder =
          typeof order.id === "string" && order.id.startsWith("order_test_");

        if (!window.Razorpay || isSimulatedOrder) {
          fallbackSimulator(order);
          return;
        }

        const options = {
          key: keyId || import.meta.env.VITE_RAZORPAY_KEY_ID || "rzp_test_mockKey",
          amount: order.amount,
          currency: order.currency || "INR",
          name: "Class Stream",
          description: `Enrollment: ${course.courseName}`,
          image: "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=200&auto=format&fit=crop&q=80",
          order_id: order.id,
          prefill: {
            name: user?.name,
            email: user?.email,
          },
          theme: {
            color: "#1e3a8a",
          },
          handler: async function (response) {
            try {
              toast.info("Verifying transaction with server...");
              const verification = await paymentService.verifyPayment({
                razorpay_order_id: response.razorpay_order_id,
                razorpay_payment_id: response.razorpay_payment_id,
                razorpay_signature: response.razorpay_signature,
                courseId: course._id,
              });

              if (verification?.success) {
                toast.success("Payment verified! Welcome to the course.");
                setIsEnrolled(true);
                await refreshUser();
                navigate(`/learn/${id}`);
              }
            } catch (vErr) {
              toast.error(vErr.formattedMessage || "Payment verification failed.");
            } finally {
              setEnrolling(false);
            }
          },
          modal: {
            ondismiss: function () {
              setEnrolling(false);
              toast.info("Payment was cancelled.");
            },
          },
        };

        const rzp = new window.Razorpay(options);

        // Surface real gateway failures (declined card, invalid key, etc.)
        // instead of leaving the user staring at Razorpay's own generic
        // "Oops! Something went wrong" overlay with no way back into the app.
        rzp.on("payment.failed", function (response) {
          setEnrolling(false);
          const reason =
            response?.error?.description || "The payment could not be completed.";
          toast.error(reason);
        });

        rzp.open();
      };

      openRazorpayCheckout();
    } catch (err) {
      toast.error(err.formattedMessage || "Could not process order.");
      setEnrolling(false);
    }
  };

  if (loading) {
    return (
      <div className="container" style={{ padding: "4rem 1.5rem" }}>
        <div className="skeleton" style={{ height: "40px", width: "300px", marginBottom: "2rem" }} />
        <div className="skeleton" style={{ height: "300px", width: "100%", borderRadius: "var(--radius-lg)" }} />
      </div>
    );
  }

  if (!course) {
    return (
      <div className="container" style={{ padding: "5rem 1.5rem", textAlign: "center" }}>
        <h2>Course not found</h2>
        <p style={{ marginTop: "1rem" }}>The requested course could not be located.</p>
        <Link to="/courses" className="btn btn-primary" style={{ marginTop: "1.5rem" }}>
          Browse Catalog
        </Link>
      </div>
    );
  }

  const thumbnail =
    course.courseImage?.[0]?.url ||
    "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=800&auto=format&fit=crop&q=80";

  const isFree = !course.isPaid || course.price === 0;

  return (
    <div className="animate-fade-in responsive-page course-detail-page" style={{ paddingBottom: "5rem" }}>
      {/* Course Hero Banner */}
      <section
        style={{
          background: "linear-gradient(135deg, #070c18 0%, #0b1426 50%, #1e293b 100%)",
          color: "#ffffff",
          padding: "4rem 0 3.75rem",
          borderBottom: "1px solid rgba(255, 255, 255, 0.08)",
          position: "relative",
          overflow: "hidden",
        }}
      >
        {/* Ambient Hero Spotlight Glow */}
        <div
          className="animate-aurora"
          style={{
            position: "absolute",
            top: "-50px",
            right: "5%",
            width: "550px",
            height: "400px",
            background: "radial-gradient(circle, rgba(37, 99, 235, 0.22) 0%, rgba(6, 182, 212, 0.12) 50%, transparent 70%)",
            filter: "blur(50px)",
            pointerEvents: "none",
          }}
        />

        <div className="container" style={{ position: "relative", zIndex: 2 }}>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "0.5rem",
              fontSize: "0.85rem",
              color: "#94a3b8",
              marginBottom: "1.25rem",
            }}
          >
            <Link to="/" style={{ color: "#94a3b8", textDecoration: "none" }}>Home</Link>
            <ChevronRight size={14} />
            <Link to="/courses" style={{ color: "#94a3b8", textDecoration: "none" }}>Courses</Link>
            <ChevronRight size={14} />
            <span style={{ color: "#38bdf8", fontWeight: 600 }}>{course.courseCategory}</span>
          </div>

          <div style={{ maxWidth: "820px" }}>
            <div style={{ display: "flex", gap: "0.6rem", marginBottom: "1.25rem", flexWrap: "wrap" }}>
              <span className="badge badge-primary" style={{ background: "rgba(37, 99, 235, 0.25)", color: "#93c5fd", border: "1px solid rgba(147, 197, 253, 0.3)" }}>
                {course.courseCategory}
              </span>
              <span className="badge" style={{ color: "#ffffff", background: "rgba(255,255,255,0.12)", border: "1px solid rgba(255,255,255,0.15)" }}>
                {course.courseClass}
              </span>
              <span className="badge" style={{ color: "var(--accent-teal)", background: "rgba(13, 148, 136, 0.2)", border: "1px solid rgba(45, 212, 191, 0.3)" }}>
                Full HD Streaming
              </span>
            </div>

            <h1
              style={{
                color: "#ffffff",
                fontSize: "clamp(2rem, 3.8vw, 2.75rem)",
                lineHeight: 1.18,
                marginBottom: "1.25rem",
                letterSpacing: "-0.03em",
                fontWeight: 800,
              }}
            >
              {course.courseName}
            </h1>

            <p style={{ color: "#cbd5e1", fontSize: "1.05rem", lineHeight: 1.65, marginBottom: "1.75rem" }}>
              {course.courseDescription}
            </p>

            {/* Meta Row */}
            <div
              style={{
                display: "flex",
                flexWrap: "wrap",
                alignItems: "center",
                gap: "1.75rem",
                fontSize: "0.875rem",
                color: "#94a3b8",
                borderTop: "1px solid rgba(255, 255, 255, 0.08)",
                paddingTop: "1.25rem",
              }}
            >
              <div style={{ display: "flex", alignItems: "center", gap: "0.4rem", color: "var(--accent-amber)", fontWeight: 700 }}>
                <Star size={16} fill="currentColor" />
                <span style={{ color: "#ffffff" }}>{course.rating || 4.9}</span>
                <span style={{ color: "#94a3b8", fontWeight: 500 }}>({course.reviewsCount || 150} reviews)</span>
              </div>
              <div style={{ display: "flex", alignItems: "center", gap: "0.4rem" }}>
                <Users size={16} color="#94a3b8" />
                <span>1,420 enrolled</span>
              </div>
              <div style={{ display: "flex", alignItems: "center", gap: "0.4rem" }}>
                <Clock size={16} color="#94a3b8" />
                <span>{course.duration || "18 hours total"}</span>
              </div>
              <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
                <div
                  style={{
                    width: "22px",
                    height: "22px",
                    borderRadius: "50%",
                    background: "var(--primary)",
                    color: "#ffffff",
                    fontSize: "0.7rem",
                    fontWeight: 700,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  {(course.instructor || "F").charAt(0)}
                </div>
                <span>Instructor: <strong style={{ color: "#ffffff" }}>{course.instructor || "Lead Faculty Member"}</strong></span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Main Grid: Details on left, Sticky enrollment on right */}
      <div className="container" style={{ marginTop: "2.5rem" }}>
        <div
          className="course-detail-layout"
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 380px",
            gap: "3rem",
            alignItems: "flex-start",
          }}
        >
          {/* Left Column: Syllabus, Instructor, FAQ */}
          <div>
            {/* What you'll learn card */}
            <div
              className="card"
              style={{
                padding: "2rem",
                marginBottom: "2.5rem",
                background: "var(--surface)",
              }}
            >
              <h3 style={{ fontSize: "1.35rem", marginBottom: "1.25rem" }}>What You Will Master</h3>
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
                  gap: "1rem",
                }}
              >
                {[
                  "Architect and deploy modern cloud microservice architectures",
                  "Understand low-level data structures, state orchestration, and performance tuning",
                  "Secure real-time APIs with JWT authentication and role-based permissions",
                  "Integrate test-driven development and enterprise CI/CD workflows",
                  "Deliver production-ready user interfaces with high accessibility standards",
                  "Receive an industry-recognized certificate of accomplishment",
                ].map((item, idx) => (
                  <div key={idx} style={{ display: "flex", alignItems: "flex-start", gap: "0.75rem", fontSize: "0.95rem" }}>
                    <CheckCircle2 size={18} color="var(--success)" style={{ flexShrink: 0, marginTop: "2px" }} />
                    <span style={{ color: "var(--text-main)" }}>{item}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Course Content / Lessons Curriculum */}
            <div style={{ marginBottom: "2.5rem" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", marginBottom: "1.25rem" }}>
                <h3 style={{ fontSize: "1.35rem" }}>Course Curriculum</h3>
                <span style={{ fontSize: "0.9rem", color: "var(--text-muted)" }}>
                  {course.courseVideo?.length || 0} Lessons • {course.duration || "Full series"}
                </span>
              </div>

              <div
                className="card"
                style={{
                  borderRadius: "var(--radius-lg)",
                  overflow: "hidden",
                }}
              >
                {course.courseVideo && course.courseVideo.length > 0 ? (
                  course.courseVideo.map((vid, idx) => {
                    const isVidFree = vid.accessType === "free";
                    const isVidTrial = vid.accessType === "trial";
                    const canPlay = isEnrolled || isVidFree || isVidTrial;

                    return (
                      <div
                        key={idx}
                        style={{
                          padding: "1.1rem 1.5rem",
                          borderBottom: idx < course.courseVideo.length - 1 ? "1px solid var(--border-light)" : "none",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "space-between",
                          backgroundColor: idx % 2 === 0 ? "var(--surface)" : "#fafcff",
                          transition: "background var(--transition-fast)",
                        }}
                      >
                        <div style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
                          <div
                            style={{
                              width: "36px",
                              height: "36px",
                              borderRadius: "var(--radius-full)",
                              background: canPlay ? "var(--primary-light)" : "var(--bg-subtle)",
                              color: canPlay ? "var(--primary)" : "var(--text-light)",
                              display: "flex",
                              alignItems: "center",
                              justifyContent: "center",
                            }}
                          >
                            {canPlay ? <PlayCircle size={18} /> : <Lock size={16} />}
                          </div>
                          <div>
                            <div style={{ fontWeight: 600, fontSize: "0.95rem", color: "var(--text-main)" }}>
                              {vid.title || `Lesson ${idx + 1}`}
                            </div>
                            <div style={{ fontSize: "0.8rem", color: "var(--text-muted)", marginTop: "2px" }}>
                              {vid.duration || "12:00 mins"}
                            </div>
                          </div>
                        </div>

                        <div style={{ display: "flex", alignItems: "center", gap: "0.85rem" }}>
                          {isVidFree && <span className="badge badge-free">Free Lesson</span>}
                          {isVidTrial && <span className="badge badge-trial">Trial Preview</span>}
                          {!isVidFree && !isVidTrial && !isEnrolled && (
                            <span className="badge badge-sub">Enrolled Only</span>
                          )}

                          {canPlay && (
                            <Link
                              to={`/learn/${course._id}?lesson=${idx}`}
                              className="btn btn-outline-primary btn-sm"
                              style={{ padding: "0.3rem 0.65rem", fontSize: "0.75rem" }}
                            >
                              Watch
                            </Link>
                          )}
                        </div>
                      </div>
                    );
                  })
                ) : (
                  <div style={{ padding: "2rem", textAlign: "center", color: "var(--text-muted)" }}>
                    No video lessons published yet for this course.
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Right Column: Sticky Enrollment & Checkout Card */}
          <div
            className="course-detail-sidebar"
            style={{
              position: "sticky",
              top: "92px",
            }}
          >
            <div
              className="card"
              style={{
                boxShadow: "var(--shadow-xl)",
                borderRadius: "var(--radius-xl)",
                overflow: "hidden",
                border: "1px solid var(--border)",
              }}
            >
              {/* Media Preview */}
              <div style={{ position: "relative", width: "100%", paddingTop: "56.25%" }}>
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
                  }}
                />
                <div
                  style={{
                    position: "absolute",
                    inset: 0,
                    background: "rgba(15, 23, 42, 0.35)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <div
                    onClick={handleEnrollment}
                    style={{
                      width: "56px",
                      height: "56px",
                      borderRadius: "50%",
                      background: "#ffffff",
                      color: "var(--primary)",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      cursor: "pointer",
                      boxShadow: "0 4px 15px rgba(0,0,0,0.3)",
                    }}
                  >
                    <PlayCircle size={32} />
                  </div>
                </div>
              </div>

              {/* Card Body */}
              <div style={{ padding: "1.75rem" }}>
                {/* Price Display */}
                <div style={{ marginBottom: "1.5rem" }}>
                  {isFree ? (
                    <div>
                      <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
                        <span style={{ fontSize: "2.25rem", fontWeight: 800, color: "var(--success)", fontFamily: "var(--font-heading)" }}>
                          Free
                        </span>
                        <span className="badge badge-free">Open Access</span>
                      </div>
                      <p style={{ fontSize: "0.85rem", color: "var(--text-muted)", marginTop: "0.25rem" }}>
                        Complimentary open-access curriculum with certificate.
                      </p>
                    </div>
                  ) : (
                    <div>
                      <div style={{ display: "flex", alignItems: "baseline", gap: "0.75rem" }}>
                        <span style={{ fontSize: "2.35rem", fontWeight: 800, color: "var(--text-main)", fontFamily: "var(--font-heading)", letterSpacing: "-0.03em" }}>
                          ₹{course.price}
                        </span>
                        {course.originalPrice > course.price && (
                          <span style={{ fontSize: "1.1rem", color: "var(--text-light)", textDecoration: "line-through" }}>
                            ₹{course.originalPrice}
                          </span>
                        )}
                        {course.originalPrice > course.price && (
                          <span className="badge badge-free">
                            {Math.round(((course.originalPrice - course.price) / course.originalPrice) * 100)}% OFF
                          </span>
                        )}
                      </div>
                      <p style={{ fontSize: "0.825rem", color: "var(--text-muted)", marginTop: "0.25rem" }}>
                        Full lifetime access & verified digital credential.
                      </p>
                    </div>
                  )}
                </div>

                {/* Main Action Button */}
                <button
                  onClick={handleEnrollment}
                  disabled={enrolling}
                  className="btn btn-primary btn-lg hover-elevate"
                  style={{
                    width: "100%",
                    marginBottom: "0.85rem",
                    justifyContent: "center",
                    boxShadow: "0 6px 20px rgba(37, 99, 235, 0.28)",
                  }}
                >
                  {enrolling
                    ? "Processing Enrollment..."
                    : isEnrolled
                      ? "Continue Learning →"
                      : isFree
                        ? "Enroll For Free"
                        : `Instant Access • ₹${course.price}`}
                </button>

                {!isFree && !isEnrolled && (
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      gap: "0.4rem",
                      fontSize: "0.75rem",
                      color: "var(--text-muted)",
                      marginBottom: "1rem",
                    }}
                  >
                    <ShieldCheck size={14} color="var(--success)" />
                    <span>Razorpay Secure Test Mode • Instant Activation</span>
                  </div>
                )}

                {/* Direct link to first lesson if free preview */}
                {course.courseVideo && course.courseVideo.length > 0 && !isEnrolled && (
                  <Link
                    to={`/learn/${course._id}?lesson=0`}
                    className="btn btn-outline hover-elevate"
                    style={{
                      width: "100%",
                      marginBottom: "1.5rem",
                      fontSize: "0.875rem",
                      justifyContent: "center",
                      backgroundColor: "#ffffff",
                    }}
                  >
                    <PlayCircle size={16} /> Watch Free Preview Lesson
                  </Link>
                )}

                {/* Features List */}
                <div style={{ borderTop: "1px solid var(--border)", paddingTop: "1.25rem" }}>
                  <h4 style={{ fontSize: "0.9rem", fontWeight: 700, marginBottom: "0.85rem", color: "var(--text-main)" }}>
                    This masterclass includes:
                  </h4>
                  <ul style={{ listStyle: "none", display: "flex", flexDirection: "column", gap: "0.65rem", fontSize: "0.85rem", color: "var(--text-muted)" }}>
                    <li style={{ display: "flex", alignItems: "center", gap: "0.6rem" }}>
                      <PlayCircle size={16} color="var(--primary)" />
                      <span>{course.duration || "18 hours"} on-demand HD video</span>
                    </li>
                    <li style={{ display: "flex", alignItems: "center", gap: "0.6rem" }}>
                      <Award size={16} color="var(--primary)" />
                      <span>Verifiable Certificate of Completion</span>
                    </li>
                    <li style={{ display: "flex", alignItems: "center", gap: "0.6rem" }}>
                      <FileText size={16} color="var(--primary)" />
                      <span>Production source code & assets</span>
                    </li>
                    <li style={{ display: "flex", alignItems: "center", gap: "0.6rem" }}>
                      <ShieldCheck size={16} color="var(--success)" />
                      <span>30-Day Money-Back Guarantee</span>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CourseDetailPage;