// // import React, { useState, useEffect } from "react";
// // import courseService from "../../services/courseService";
// // import categoryService from "../../services/categoryService";
// // import classService from "../../services/classService";
// // import { useToast } from "../../context/ToastContext";
// // import ConfirmModal from "../../components/common/ConfirmModal";
// // import {
// //   Plus,
// //   Edit2,
// //   Trash2,
// //   PlayCircle,
// //   Upload,
// //   X,
// //   Eye,
// //   CheckCircle,
// //   Video,
// // } from "lucide-react";

// // export const AdminCoursesPage = () => {
// //   const toast = useToast();

// //   const [courses, setCourses] = useState([]);
// //   const [categories, setCategories] = useState([]);
// //   const [classes, setClasses] = useState([]);
// //   const [loading, setLoading] = useState(true);

// //   // Modal State
// //   const [isModalOpen, setIsModalOpen] = useState(false);
// //   const [editingCourse, setEditingCourse] = useState(null);
// //   const [isSaving, setIsSaving] = useState(false);

// //   // Delete Modal State
// //   const [deleteCourseId, setDeleteCourseId] = useState(null);
// //   const [isDeleting, setIsDeleting] = useState(false);

// //   // Form State
// //   const [formData, setFormData] = useState({
// //     courseName: "",
// //     courseDescription: "",
// //     courseCategory: "",
// //     courseClass: "",
// //     price: 0,
// //     originalPrice: 0,
// //     isPaid: false,
// //     instructor: "Principal Faculty",
// //     instructorTitle: "Lead Architect",
// //     level: "Intermediate",
// //     duration: "15h 00m",
// //   });

// //   const [images, setImages] = useState([]);
// //   const [videos, setVideos] = useState([]);

// //   // Video item builder state for adding video entries
// //   const [videoList, setVideoList] = useState([
// //     {
// //       title: "01. Introduction and Architectural Overview",
// //       duration: "10:00",
// //       accessType: "free",
// //       url: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4",
// //     },
// //     {
// //       title: "02. Foundation Concepts and Hands-on Setup",
// //       duration: "15:00",
// //       accessType: "trial",
// //       url: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerEscapes.mp4",
// //     },
// //     {
// //       title: "03. Advanced Deep Dive & Production Optimization",
// //       duration: "22:00",
// //       accessType: "subscription",
// //       url: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerFun.mp4",
// //     },
// //   ]);

// //   const fetchCourses = async () => {
// //     try {
// //       setLoading(true);
// //       const [courseRes, catRes, classRes] = await Promise.all([
// //         courseService.getAllCourses(),
// //         categoryService.getAllCategories(),
// //         classService.getAllClasses(),
// //       ]);
// //       if (courseRes?.courses) setCourses(courseRes.courses);
// //       if (catRes?.category) setCategories(catRes.category);
// //       if (classRes?.classes) setClasses(classRes.classes);
// //     } catch (err) {
// //       toast.error("Failed to load courses or metadata.");
// //     } finally {
// //       setLoading(false);
// //     }
// //   };

// //   useEffect(() => {
// //     fetchCourses();
// //   }, []);

// //   const openCreateModal = () => {
// //     setEditingCourse(null);
// //     setFormData({
// //       courseName: "",
// //       courseDescription: "",
// //       courseCategory: categories[0]?.categoryName || "",
// //       courseClass: classes[0]?.className || "",
// //       price: 999,
// //       originalPrice: 1999,
// //       isPaid: true,
// //       instructor: "Prof. Lead Faculty",
// //       instructorTitle: "Senior Architect",
// //       level: "Intermediate",
// //       duration: "18h 30m",
// //     });
// //     setImages([]);
// //     setVideos([]);
// //     setIsModalOpen(true);
// //   };

// //   const openEditModal = (course) => {
// //     setEditingCourse(course);
// //     setFormData({
// //       courseName: course.courseName,
// //       courseDescription: course.courseDescription,
// //       courseCategory: course.courseCategory,
// //       courseClass: course.courseClass,
// //       price: course.price || 0,
// //       originalPrice: course.originalPrice || 0,
// //       isPaid: course.isPaid || false,
// //       instructor: course.instructor || "",
// //       instructorTitle: course.instructorTitle || "",
// //       level: course.level || "Intermediate",
// //       duration: course.duration || "",
// //     });
// //     if (course.courseVideo && course.courseVideo.length > 0) {
// //       setVideoList(course.courseVideo);
// //     }
// //     setImages([]);
// //     setVideos([]);
// //     setIsModalOpen(true);
// //   };

// //   const handleFormSubmit = async (e) => {
// //     e.preventDefault();
// //     try {
// //       setIsSaving(true);
// //       const data = new FormData();
// //       data.append("courseName", formData.courseName);
// //       data.append("courseDescription", formData.courseDescription);
// //       data.append("courseCategory", formData.courseCategory);
// //       data.append("courseClass", formData.courseClass);
// //       data.append("price", formData.price.toString());
// //       data.append("originalPrice", formData.originalPrice.toString());
// //       data.append("isPaid", formData.isPaid ? "true" : "false");
// //       data.append("instructor", formData.instructor);
// //       data.append("instructorTitle", formData.instructorTitle);
// //       data.append("level", formData.level);
// //       data.append("duration", formData.duration);
// //       data.append("courseVideo", JSON.stringify(videoList));

// //       // Append files
// //       if (images && images.length > 0) {
// //         for (let i = 0; i < images.length; i++) {
// //           data.append("courseImage", images[i]);
// //         }
// //       }

// //       if (videos && videos.length > 0) {
// //         for (let i = 0; i < videos.length; i++) {
// //           data.append("courseVideo", videos[i]);
// //         }
// //       }

// //       if (editingCourse) {
// //         await courseService.updateCourse(editingCourse._id, data);
// //         toast.success("Course updated successfully!");
// //       } else {
// //         await courseService.createCourse(data);
// //         toast.success("New course published successfully!");
// //       }

// //       setIsModalOpen(false);
// //       fetchCourses();
// //     } catch (err) {
// //       toast.error(err.formattedMessage || "Failed to save course.");
// //     } finally {
// //       setIsSaving(false);
// //     }
// //   };

// //   const confirmDelete = async () => {
// //     if (!deleteCourseId) return;
// //     try {
// //       setIsDeleting(true);
// //       await courseService.deleteCourse(deleteCourseId);
// //       toast.success("Course deleted successfully.");
// //       setDeleteCourseId(null);
// //       fetchCourses();
// //     } catch (err) {
// //       toast.error(err.formattedMessage || "Failed to delete course.");
// //     } finally {
// //       setIsDeleting(false);
// //     }
// //   };

// //   const handleAddVideoItem = () => {
// //     setVideoList([
// //       ...videoList,
// //       {
// //         title: `Lesson ${videoList.length + 1}: Technical Module`,
// //         duration: "12:00",
// //         accessType: "subscription",
// //         url: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4",
// //       },
// //     ]);
// //   };

// //   const handleRemoveVideoItem = (idx) => {
// //     setVideoList(videoList.filter((_, i) => i !== idx));
// //   };

// //   const handleVideoItemChange = (idx, field, value) => {
// //     const updated = [...videoList];
// //     updated[idx][field] = value;
// //     setVideoList(updated);
// //   };

// //   return (
// //     <div className="animate-fade-in">
// //       <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "2rem" }}>
// //         <div>
// //           <h1 style={{ fontSize: "1.75rem", marginBottom: "0.4rem" }}>Manage Courses</h1>
// //           <p style={{ color: "var(--text-muted)", fontSize: "0.95rem" }}>
// //             Create, update, inspect video access, and publish educational streams.
// //           </p>
// //         </div>

// //         <button onClick={openCreateModal} className="btn btn-primary btn-sm">
// //           <Plus size={16} /> Add New Course
// //         </button>
// //       </div>

// //       {/* Courses List Table */}
// //       {loading ? (
// //         <div className="skeleton" style={{ width: "100%", height: "300px", borderRadius: "var(--radius-lg)" }} />
// //       ) : courses.length > 0 ? (
// //         <div className="table-responsive">
// //           <table className="table">
// //             <thead>
// //               <tr>
// //                 <th>Thumbnail</th>
// //                 <th>Course Name</th>
// //                 <th>Category</th>
// //                 <th>Class</th>
// //                 <th>Price</th>
// //                 <th>Videos</th>
// //                 <th>Actions</th>
// //               </tr>
// //             </thead>
// //             <tbody>
// //               {courses.map((course) => {
// //                 const img =
// //                   course.courseImage?.[0]?.url ||
// //                   "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=200&auto=format&fit=crop&q=80";

// //                 return (
// //                   <tr key={course._id}>
// //                     <td>
// //                       <img
// //                         src={img}
// //                         alt={course.courseName}
// //                         style={{ width: "54px", height: "34px", borderRadius: "var(--radius-sm)", objectFit: "cover" }}
// //                       />
// //                     </td>
// //                     <td>
// //                       <div style={{ fontWeight: 600 }}>{course.courseName}</div>
// //                       <div style={{ fontSize: "0.75rem", color: "var(--text-muted)" }}>
// //                         By {course.instructor || "Lead Faculty"}
// //                       </div>
// //                     </td>
// //                     <td>
// //                       <span className="badge badge-primary">{course.courseCategory}</span>
// //                     </td>
// //                     <td>{course.courseClass}</td>
// //                     <td style={{ fontWeight: 700 }}>
// //                       {course.isPaid && course.price > 0 ? `₹${course.price}` : <span style={{ color: "var(--success)" }}>Free</span>}
// //                     </td>
// //                     <td>
// //                       <span className="badge badge-gray" style={{ display: "inline-flex", alignItems: "center", gap: "0.25rem" }}>
// //                         <PlayCircle size={12} /> {course.courseVideo?.length || 0}
// //                       </span>
// //                     </td>
// //                     <td>
// //                       <div style={{ display: "flex", gap: "0.5rem" }}>
// //                         <button
// //                           onClick={() => openEditModal(course)}
// //                           className="btn btn-outline btn-icon"
// //                           style={{ width: "32px", height: "32px" }}
// //                           aria-label="Edit course"
// //                         >
// //                           <Edit2 size={14} />
// //                         </button>
// //                         <button
// //                           onClick={() => setDeleteCourseId(course._id)}
// //                           className="btn btn-outline btn-icon"
// //                           style={{ width: "32px", height: "32px", color: "var(--danger)", borderColor: "#fca5a5" }}
// //                           aria-label="Delete course"
// //                         >
// //                           <Trash2 size={14} />
// //                         </button>
// //                       </div>
// //                     </td>
// //                   </tr>
// //                 );
// //               })}
// //             </tbody>
// //           </table>
// //         </div>
// //       ) : (
// //         <div className="empty-state">
// //           <h4>No Courses Published Yet</h4>
// //           <p style={{ marginTop: "0.5rem" }}>Click "Add New Course" to upload and publish your first educational track.</p>
// //         </div>
// //       )}

// //       {/* Create / Edit Course Modal */}
// //       {isModalOpen && (
// //         <div className="modal-backdrop" onClick={() => setIsModalOpen(false)}>
// //           <div
// //             className="modal-dialog modal-lg animate-modal"
// //             onClick={(e) => e.stopPropagation()}
// //             style={{ padding: "2rem" }}
// //           >
// //             <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1.5rem", paddingBottom: "1rem", borderBottom: "1px solid var(--border-light)" }}>
// //               <h2 style={{ fontSize: "1.4rem" }}>
// //                 {editingCourse ? "Edit Course" : "Publish New Course"}
// //               </h2>
// //               <button
// //                 onClick={() => setIsModalOpen(false)}
// //                 style={{ background: "none", border: "none", cursor: "pointer" }}
// //               >
// //                 <X size={20} />
// //               </button>
// //             </div>

// //             <form onSubmit={handleFormSubmit}>
// //               <div className="grid-2">
// //                 <div className="form-group" style={{ gridColumn: "1 / -1" }}>
// //                   <label className="form-label">Course Title</label>
// //                   <input
// //                     type="text"
// //                     required
// //                     value={formData.courseName}
// //                     onChange={(e) => setFormData({ ...formData, courseName: e.target.value })}
// //                     className="form-control"
// //                     placeholder="e.g. Full-Stack Web Development Masterclass"
// //                   />
// //                 </div>

// //                 <div className="form-group" style={{ gridColumn: "1 / -1" }}>
// //                   <label className="form-label">Course Description</label>
// //                   <textarea
// //                     rows={3}
// //                     required
// //                     value={formData.courseDescription}
// //                     onChange={(e) => setFormData({ ...formData, courseDescription: e.target.value })}
// //                     className="form-control"
// //                     placeholder="Detailed explanation of curriculum, outcomes, and prerequisites..."
// //                   />
// //                 </div>

// //                 <div className="form-group">
// //                   <label className="form-label">Category</label>
// //                   <select
// //                     value={formData.courseCategory}
// //                     onChange={(e) => setFormData({ ...formData, courseCategory: e.target.value })}
// //                     className="form-control"
// //                   >
// //                     {categories.map((c) => (
// //                       <option key={c._id} value={c.categoryName}>
// //                         {c.categoryName}
// //                       </option>
// //                     ))}
// //                   </select>
// //                 </div>

// //                 <div className="form-group">
// //                   <label className="form-label">Class Level</label>
// //                   <select
// //                     value={formData.courseClass}
// //                     onChange={(e) => setFormData({ ...formData, courseClass: e.target.value })}
// //                     className="form-control"
// //                   >
// //                     {classes.map((cls) => (
// //                       <option key={cls._id} value={cls.className}>
// //                         {cls.className}
// //                       </option>
// //                     ))}
// //                   </select>
// //                 </div>

// //                 <div className="form-group">
// //                   <label className="form-label">Price (INR ₹)</label>
// //                   <input
// //                     type="number"
// //                     value={formData.price}
// //                     onChange={(e) =>
// //                       setFormData({
// //                         ...formData,
// //                         price: Number(e.target.value),
// //                         isPaid: Number(e.target.value) > 0,
// //                       })
// //                     }
// //                     className="form-control"
// //                   />
// //                 </div>

// //                 <div className="form-group">
// //                   <label className="form-label">Original Price (INR ₹)</label>
// //                   <input
// //                     type="number"
// //                     value={formData.originalPrice}
// //                     onChange={(e) => setFormData({ ...formData, originalPrice: Number(e.target.value) })}
// //                     className="form-control"
// //                   />
// //                 </div>

// //                 <div className="form-group">
// //                   <label className="form-label">Instructor Name</label>
// //                   <input
// //                     type="text"
// //                     value={formData.instructor}
// //                     onChange={(e) => setFormData({ ...formData, instructor: e.target.value })}
// //                     className="form-control"
// //                   />
// //                 </div>

// //                 <div className="form-group">
// //                   <label className="form-label">Total Duration</label>
// //                   <input
// //                     type="text"
// //                     value={formData.duration}
// //                     onChange={(e) => setFormData({ ...formData, duration: e.target.value })}
// //                     className="form-control"
// //                     placeholder="e.g. 18h 30m"
// //                   />
// //                 </div>
// //               </div>

// //               {/* Upload New Media Images */}
// //               <div className="form-group" style={{ marginTop: "1rem" }}>
// //                 <label className="form-label">Course Thumbnail Images (Upload)</label>
// //                 <input
// //                   type="file"
// //                   multiple
// //                   accept="image/*"
// //                   onChange={(e) => setImages(e.target.files)}
// //                   className="form-control"
// //                 />
// //               </div>

// //               {/* Course Videos Management */}
// //               <div style={{ marginTop: "1.5rem", borderTop: "1px solid var(--border-light)", paddingTop: "1.5rem" }}>
// //                 <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1rem" }}>
// //                   <div>
// //                     <h4 style={{ fontSize: "1.1rem" }}>Syllabus Lessons & Video Access Levels</h4>
// //                     <p style={{ fontSize: "0.8rem", color: "var(--text-muted)" }}>
// //                       Configure access type for each lecture: Free, Trial, or Subscription only.
// //                     </p>
// //                   </div>
// //                   <button
// //                     type="button"
// //                     onClick={handleAddVideoItem}
// //                     className="btn btn-outline btn-sm"
// //                   >
// //                     <Plus size={14} /> Add Lesson
// //                   </button>
// //                 </div>

// //                 <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem", maxHeight: "240px", overflowY: "auto", paddingRight: "0.5rem" }}>
// //                   {videoList.map((vid, idx) => (
// //                     <div
// //                       key={idx}
// //                       style={{
// //                         display: "flex",
// //                         gap: "0.75rem",
// //                         alignItems: "center",
// //                         padding: "0.65rem",
// //                         background: "var(--bg-subtle)",
// //                         borderRadius: "var(--radius-md)",
// //                         border: "1px solid var(--border)",
// //                       }}
// //                     >
// //                       <input
// //                         type="text"
// //                         placeholder="Lesson title"
// //                         value={vid.title}
// //                         onChange={(e) => handleVideoItemChange(idx, "title", e.target.value)}
// //                         className="form-control"
// //                         style={{ flex: 2, padding: "0.4rem 0.65rem", fontSize: "0.85rem" }}
// //                       />
// //                       <input
// //                         type="text"
// //                         placeholder="Duration"
// //                         value={vid.duration}
// //                         onChange={(e) => handleVideoItemChange(idx, "duration", e.target.value)}
// //                         className="form-control"
// //                         style={{ width: "90px", padding: "0.4rem 0.65rem", fontSize: "0.85rem" }}
// //                       />
// //                       <select
// //                         value={vid.accessType}
// //                         onChange={(e) => handleVideoItemChange(idx, "accessType", e.target.value)}
// //                         className="form-control"
// //                         style={{ width: "130px", padding: "0.4rem 0.65rem", fontSize: "0.85rem" }}
// //                       >
// //                         <option value="free">Free</option>
// //                         <option value="trial">Trial</option>
// //                         <option value="subscription">Subscription</option>
// //                       </select>
// //                       <button
// //                         type="button"
// //                         onClick={() => handleRemoveVideoItem(idx)}
// //                         style={{ background: "none", border: "none", color: "var(--danger)", cursor: "pointer" }}
// //                       >
// //                         <X size={16} />
// //                       </button>
// //                     </div>
// //                   ))}
// //                 </div>
// //               </div>

// //               <div style={{ display: "flex", justifyContent: "flex-end", gap: "0.75rem", marginTop: "2rem", borderTop: "1px solid var(--border-light)", paddingTop: "1.25rem" }}>
// //                 <button
// //                   type="button"
// //                   onClick={() => setIsModalOpen(false)}
// //                   className="btn btn-outline"
// //                 >
// //                   Cancel
// //                 </button>
// //                 <button
// //                   type="submit"
// //                   disabled={isSaving}
// //                   className="btn btn-primary"
// //                 >
// //                   {isSaving ? "Saving Course..." : editingCourse ? "Update Course" : "Publish Course"}
// //                 </button>
// //               </div>
// //             </form>
// //           </div>
// //         </div>
// //       )}

// //       {/* Delete Confirmation Modal */}
// //       <ConfirmModal
// //         isOpen={!!deleteCourseId}
// //         title="Delete Course"
// //         message="Are you sure you want to delete this course? All associated lesson enrollments will be impacted."
// //         confirmText="Delete Course"
// //         isLoading={isDeleting}
// //         onConfirm={confirmDelete}
// //         onCancel={() => setDeleteCourseId(null)}
// //       />
// //     </div>
// //   );
// // };

// // export default AdminCoursesPage;



// import React, { useState, useEffect } from "react";
// import courseService from "../../services/courseService";
// import categoryService from "../../services/categoryService";
// import classService from "../../services/classService";
// import { useToast } from "../../context/ToastContext";
// import ConfirmModal from "../../components/common/ConfirmModal";
// import {
//   Plus,
//   Edit2,
//   Trash2,
//   PlayCircle,
//   Upload,
//   X,
//   Eye,
//   CheckCircle,
//   Video,
//   FileVideo,
//   Link as LinkIcon,
// } from "lucide-react";

// export const AdminCoursesPage = () => {
//   const toast = useToast();

//   const [courses, setCourses] = useState([]);
//   const [categories, setCategories] = useState([]);
//   const [classes, setClasses] = useState([]);
//   const [loading, setLoading] = useState(true);

//   // Modal State
//   const [isModalOpen, setIsModalOpen] = useState(false);
//   const [editingCourse, setEditingCourse] = useState(null);
//   const [isSaving, setIsSaving] = useState(false);

//   // Delete Modal State
//   const [deleteCourseId, setDeleteCourseId] = useState(null);
//   const [isDeleting, setIsDeleting] = useState(false);

//   // Form State
//   const [formData, setFormData] = useState({
//     courseName: "",
//     courseDescription: "",
//     courseCategory: "",
//     courseClass: "",
//     price: 0,
//     originalPrice: 0,
//     isPaid: false,
//     instructor: "Principal Faculty",
//     instructorTitle: "Lead Architect",
//     level: "Intermediate",
//     duration: "15h 00m",
//   });

//   const [images, setImages] = useState([]);

//   // Video item builder state for adding video entries.
//   // Each entry is EITHER an uploaded File (source: "upload") OR an external URL (source: "url").
//   const [videoList, setVideoList] = useState([
//     {
//       title: "01. Introduction and Architectural Overview",
//       duration: "10:00",
//       accessType: "free",
//       source: "url",
//       url: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4",
//       file: null,
//     },
//     {
//       title: "02. Foundation Concepts and Hands-on Setup",
//       duration: "15:00",
//       accessType: "trial",
//       source: "url",
//       url: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerEscapes.mp4",
//       file: null,
//     },
//     {
//       title: "03. Advanced Deep Dive & Production Optimization",
//       duration: "22:00",
//       accessType: "subscription",
//       source: "url",
//       url: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerFun.mp4",
//       file: null,
//     },
//   ]);

//   const fetchCourses = async () => {
//     try {
//       setLoading(true);
//       const [courseRes, catRes, classRes] = await Promise.all([
//         courseService.getAllCourses(),
//         categoryService.getAllCategories(),
//         classService.getAllClasses(),
//       ]);
//       if (courseRes?.courses) setCourses(courseRes.courses);
//       if (catRes?.category) setCategories(catRes.category);
//       if (classRes?.classes) setClasses(classRes.classes);
//     } catch (err) {
//       toast.error("Failed to load courses or metadata.");
//     } finally {
//       setLoading(false);
//     }
//   };

//   useEffect(() => {
//     fetchCourses();
//   }, []);

//   const openCreateModal = () => {
//     setEditingCourse(null);
//     setFormData({
//       courseName: "",
//       courseDescription: "",
//       courseCategory: categories[0]?.categoryName || "",
//       courseClass: classes[0]?.className || "",
//       price: 999,
//       originalPrice: 1999,
//       isPaid: true,
//       instructor: "Prof. Lead Faculty",
//       instructorTitle: "Senior Architect",
//       level: "Intermediate",
//       duration: "18h 30m",
//     });
//     setImages([]);
//     setVideoList([
//       {
//         title: "",
//         duration: "",
//         accessType: "free",
//         source: "upload",
//         url: "",
//         file: null,
//       },
//     ]);
//     setIsModalOpen(true);
//   };

//   const openEditModal = (course) => {
//     setEditingCourse(course);
//     setFormData({
//       courseName: course.courseName,
//       courseDescription: course.courseDescription,
//       courseCategory: course.courseCategory,
//       courseClass: course.courseClass,
//       price: course.price || 0,
//       originalPrice: course.originalPrice || 0,
//       isPaid: course.isPaid || false,
//       instructor: course.instructor || "",
//       instructorTitle: course.instructorTitle || "",
//       level: course.level || "Intermediate",
//       duration: course.duration || "",
//     });
//     if (course.courseVideo && course.courseVideo.length > 0) {
//       setVideoList(
//         course.courseVideo.map((v) => ({
//           title: v.title || "",
//           duration: v.duration || "",
//           accessType: v.accessType || "free",
//           source: "url",
//           url: v.url || "",
//           file: null,
//         }))
//       );
//     } else {
//       setVideoList([]);
//     }
//     setImages([]);
//     setIsModalOpen(true);
//   };

//   const handleFormSubmit = async (e) => {
//     e.preventDefault();
//     try {
//       setIsSaving(true);
//       const data = new FormData();
//       data.append("courseName", formData.courseName);
//       data.append("courseDescription", formData.courseDescription);
//       data.append("courseCategory", formData.courseCategory);
//       data.append("courseClass", formData.courseClass);
//       data.append("price", formData.price.toString());
//       data.append("originalPrice", formData.originalPrice.toString());
//       data.append("isPaid", formData.isPaid ? "true" : "false");
//       data.append("instructor", formData.instructor);
//       data.append("instructorTitle", formData.instructorTitle);
//       data.append("level", formData.level);
//       data.append("duration", formData.duration);

//       // Append thumbnail images
//       if (images && images.length > 0) {
//         for (let i = 0; i < images.length; i++) {
//           data.append("courseImage", images[i]);
//         }
//       }

//       // Split lesson entries into "needs upload" vs "external URL"
//       const fileEntries = videoList.filter((v) => v.source === "upload" && v.file);
//       const urlEntries = videoList.filter((v) => v.source === "url" && v.url && v.url.trim() !== "");

//       // IMPORTANT: file-placeholder metadata must come first, in the SAME order
//       // the files are appended below, because the backend matches uploaded
//       // courseVideo files to this array by index (both on create and update).
//       const courseVideoMeta = [
//         ...fileEntries.map((v) => ({
//           title: v.title,
//           duration: v.duration,
//           accessType: v.accessType,
//         })),
//         ...urlEntries.map((v) => ({
//           title: v.title,
//           duration: v.duration,
//           accessType: v.accessType,
//           url: v.url.trim(),
//         })),
//       ];

//       data.append("courseVideo", JSON.stringify(courseVideoMeta));

//       // Used by createCourse for clean title/accessType matching of uploaded files
//       data.append("videoTitles", JSON.stringify(fileEntries.map((v) => v.title)));
//       data.append("videoAccessTypes", JSON.stringify(fileEntries.map((v) => v.accessType)));

//       // Actual video files, appended in the same order as the placeholders above
//       fileEntries.forEach((v) => data.append("courseVideo", v.file));

//       if (editingCourse) {
//         await courseService.updateCourse(editingCourse._id, data);
//         toast.success("Course updated successfully!");
//       } else {
//         await courseService.createCourse(data);
//         toast.success("New course published successfully!");
//       }

//       setIsModalOpen(false);
//       fetchCourses();
//     } catch (err) {
//       toast.error(err.formattedMessage || "Failed to save course.");
//     } finally {
//       setIsSaving(false);
//     }
//   };

//   const confirmDelete = async () => {
//     if (!deleteCourseId) return;
//     try {
//       setIsDeleting(true);
//       await courseService.deleteCourse(deleteCourseId);
//       toast.success("Course deleted successfully.");
//       setDeleteCourseId(null);
//       fetchCourses();
//     } catch (err) {
//       toast.error(err.formattedMessage || "Failed to delete course.");
//     } finally {
//       setIsDeleting(false);
//     }
//   };

//   const handleAddVideoItem = () => {
//     setVideoList([
//       ...videoList,
//       {
//         title: `Lesson ${videoList.length + 1}: Technical Module`,
//         duration: "12:00",
//         accessType: "subscription",
//         source: "upload",
//         url: "",
//         file: null,
//       },
//     ]);
//   };

//   const handleRemoveVideoItem = (idx) => {
//     setVideoList(videoList.filter((_, i) => i !== idx));
//   };

//   const handleVideoItemChange = (idx, field, value) => {
//     const updated = [...videoList];
//     updated[idx][field] = value;
//     setVideoList(updated);
//   };

//   const handleVideoSourceToggle = (idx, source) => {
//     const updated = [...videoList];
//     updated[idx].source = source;
//     // Clear whichever input doesn't apply so we never submit stale data
//     if (source === "upload") {
//       updated[idx].url = "";
//     } else {
//       updated[idx].file = null;
//     }
//     setVideoList(updated);
//   };

//   const handleVideoFileChange = (idx, fileList) => {
//     const file = fileList && fileList.length > 0 ? fileList[0] : null;
//     const updated = [...videoList];
//     updated[idx].file = file;
//     if (file) {
//       updated[idx].source = "upload";
//       updated[idx].url = "";
//       // Auto-fill a title from the filename if the admin hasn't typed one yet
//       if (!updated[idx].title) {
//         updated[idx].title = file.name.replace(/\.[^/.]+$/, "");
//       }
//     }
//     setVideoList(updated);
//   };

//   return (
//     <div className="animate-fade-in">
//       <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "2rem" }}>
//         <div>
//           <h1 style={{ fontSize: "1.75rem", marginBottom: "0.4rem" }}>Manage Courses</h1>
//           <p style={{ color: "var(--text-muted)", fontSize: "0.95rem" }}>
//             Create, update, inspect video access, and publish educational streams.
//           </p>
//         </div>

//         <button onClick={openCreateModal} className="btn btn-primary btn-sm">
//           <Plus size={16} /> Add New Course
//         </button>
//       </div>

//       {/* Courses List Table */}
//       {loading ? (
//         <div className="skeleton" style={{ width: "100%", height: "300px", borderRadius: "var(--radius-lg)" }} />
//       ) : courses.length > 0 ? (
//         <div className="table-responsive">
//           <table className="table">
//             <thead>
//               <tr>
//                 <th>Thumbnail</th>
//                 <th>Course Name</th>
//                 <th>Category</th>
//                 <th>Class</th>
//                 <th>Price</th>
//                 <th>Videos</th>
//                 <th>Actions</th>
//               </tr>
//             </thead>
//             <tbody>
//               {courses.map((course) => {
//                 const img =
//                   course.courseImage?.[0]?.url ||
//                   "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=200&auto=format&fit=crop&q=80";

//                 return (
//                   <tr key={course._id}>
//                     <td>
//                       <img
//                         src={img}
//                         alt={course.courseName}
//                         style={{ width: "54px", height: "34px", borderRadius: "var(--radius-sm)", objectFit: "cover" }}
//                       />
//                     </td>
//                     <td>
//                       <div style={{ fontWeight: 600 }}>{course.courseName}</div>
//                       <div style={{ fontSize: "0.75rem", color: "var(--text-muted)" }}>
//                         By {course.instructor || "Lead Faculty"}
//                       </div>
//                     </td>
//                     <td>
//                       <span className="badge badge-primary">{course.courseCategory}</span>
//                     </td>
//                     <td>{course.courseClass}</td>
//                     <td style={{ fontWeight: 700 }}>
//                       {course.isPaid && course.price > 0 ? `₹${course.price}` : <span style={{ color: "var(--success)" }}>Free</span>}
//                     </td>
//                     <td>
//                       <span className="badge badge-gray" style={{ display: "inline-flex", alignItems: "center", gap: "0.25rem" }}>
//                         <PlayCircle size={12} /> {course.courseVideo?.length || 0}
//                       </span>
//                     </td>
//                     <td>
//                       <div style={{ display: "flex", gap: "0.5rem" }}>
//                         <button
//                           onClick={() => openEditModal(course)}
//                           className="btn btn-outline btn-icon"
//                           style={{ width: "32px", height: "32px" }}
//                           aria-label="Edit course"
//                         >
//                           <Edit2 size={14} />
//                         </button>
//                         <button
//                           onClick={() => setDeleteCourseId(course._id)}
//                           className="btn btn-outline btn-icon"
//                           style={{ width: "32px", height: "32px", color: "var(--danger)", borderColor: "#fca5a5" }}
//                           aria-label="Delete course"
//                         >
//                           <Trash2 size={14} />
//                         </button>
//                       </div>
//                     </td>
//                   </tr>
//                 );
//               })}
//             </tbody>
//           </table>
//         </div>
//       ) : (
//         <div className="empty-state">
//           <h4>No Courses Published Yet</h4>
//           <p style={{ marginTop: "0.5rem" }}>Click "Add New Course" to upload and publish your first educational track.</p>
//         </div>
//       )}

//       {/* Create / Edit Course Modal */}
//       {isModalOpen && (
//         <div className="modal-backdrop" onClick={() => setIsModalOpen(false)}>
//           <div
//             className="modal-dialog modal-lg animate-modal"
//             onClick={(e) => e.stopPropagation()}
//             style={{ padding: "2rem" }}
//           >
//             <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1.5rem", paddingBottom: "1rem", borderBottom: "1px solid var(--border-light)" }}>
//               <h2 style={{ fontSize: "1.4rem" }}>
//                 {editingCourse ? "Edit Course" : "Publish New Course"}
//               </h2>
//               <button
//                 onClick={() => setIsModalOpen(false)}
//                 style={{ background: "none", border: "none", cursor: "pointer" }}
//               >
//                 <X size={20} />
//               </button>
//             </div>

//             <form onSubmit={handleFormSubmit}>
//               <div className="grid-2">
//                 <div className="form-group" style={{ gridColumn: "1 / -1" }}>
//                   <label className="form-label">Course Title</label>
//                   <input
//                     type="text"
//                     required
//                     value={formData.courseName}
//                     onChange={(e) => setFormData({ ...formData, courseName: e.target.value })}
//                     className="form-control"
//                     placeholder="e.g. Full-Stack Web Development Masterclass"
//                   />
//                 </div>

//                 <div className="form-group" style={{ gridColumn: "1 / -1" }}>
//                   <label className="form-label">Course Description</label>
//                   <textarea
//                     rows={3}
//                     required
//                     value={formData.courseDescription}
//                     onChange={(e) => setFormData({ ...formData, courseDescription: e.target.value })}
//                     className="form-control"
//                     placeholder="Detailed explanation of curriculum, outcomes, and prerequisites..."
//                   />
//                 </div>

//                 <div className="form-group">
//                   <label className="form-label">Category</label>
//                   <select
//                     value={formData.courseCategory}
//                     onChange={(e) => setFormData({ ...formData, courseCategory: e.target.value })}
//                     className="form-control"
//                   >
//                     {categories.map((c) => (
//                       <option key={c._id} value={c.categoryName}>
//                         {c.categoryName}
//                       </option>
//                     ))}
//                   </select>
//                 </div>

//                 <div className="form-group">
//                   <label className="form-label">Class Level</label>
//                   <select
//                     value={formData.courseClass}
//                     onChange={(e) => setFormData({ ...formData, courseClass: e.target.value })}
//                     className="form-control"
//                   >
//                     {classes.map((cls) => (
//                       <option key={cls._id} value={cls.className}>
//                         {cls.className}
//                       </option>
//                     ))}
//                   </select>
//                 </div>

//                 <div className="form-group">
//                   <label className="form-label">Price (INR ₹)</label>
//                   <input
//                     type="number"
//                     value={formData.price}
//                     onChange={(e) =>
//                       setFormData({
//                         ...formData,
//                         price: Number(e.target.value),
//                         isPaid: Number(e.target.value) > 0,
//                       })
//                     }
//                     className="form-control"
//                   />
//                 </div>

//                 <div className="form-group">
//                   <label className="form-label">Original Price (INR ₹)</label>
//                   <input
//                     type="number"
//                     value={formData.originalPrice}
//                     onChange={(e) => setFormData({ ...formData, originalPrice: Number(e.target.value) })}
//                     className="form-control"
//                   />
//                 </div>

//                 <div className="form-group">
//                   <label className="form-label">Instructor Name</label>
//                   <input
//                     type="text"
//                     value={formData.instructor}
//                     onChange={(e) => setFormData({ ...formData, instructor: e.target.value })}
//                     className="form-control"
//                   />
//                 </div>

//                 <div className="form-group">
//                   <label className="form-label">Total Duration</label>
//                   <input
//                     type="text"
//                     value={formData.duration}
//                     onChange={(e) => setFormData({ ...formData, duration: e.target.value })}
//                     className="form-control"
//                     placeholder="e.g. 18h 30m"
//                   />
//                 </div>
//               </div>

//               {/* Upload New Media Images */}
//               <div className="form-group" style={{ marginTop: "1rem" }}>
//                 <label className="form-label">Course Thumbnail Images (Upload)</label>
//                 <input
//                   type="file"
//                   multiple
//                   accept="image/*"
//                   onChange={(e) => setImages(e.target.files)}
//                   className="form-control"
//                 />
//               </div>

//               {/* Course Videos Management */}
//               <div style={{ marginTop: "1.5rem", borderTop: "1px solid var(--border-light)", paddingTop: "1.5rem" }}>
//                 <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1rem" }}>
//                   <div>
//                     <h4 style={{ fontSize: "1.1rem" }}>Syllabus Lessons & Video Access Levels</h4>
//                     <p style={{ fontSize: "0.8rem", color: "var(--text-muted)" }}>
//                       Upload a video file or paste an external URL for each lecture, and set its access type.
//                     </p>
//                   </div>
//                   <button
//                     type="button"
//                     onClick={handleAddVideoItem}
//                     className="btn btn-outline btn-sm"
//                   >
//                     <Plus size={14} /> Add Lesson
//                   </button>
//                 </div>

//                 <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem", maxHeight: "420px", overflowY: "auto", paddingRight: "0.5rem" }}>
//                   {videoList.map((vid, idx) => (
//                     <div
//                       key={idx}
//                       style={{
//                         display: "flex",
//                         flexDirection: "column",
//                         gap: "0.5rem",
//                         padding: "0.75rem",
//                         background: "var(--bg-subtle)",
//                         borderRadius: "var(--radius-md)",
//                         border: "1px solid var(--border)",
//                       }}
//                     >
//                       <div style={{ display: "flex", gap: "0.75rem", alignItems: "center" }}>
//                         <input
//                           type="text"
//                           placeholder="Lesson title"
//                           value={vid.title}
//                           onChange={(e) => handleVideoItemChange(idx, "title", e.target.value)}
//                           className="form-control"
//                           style={{ flex: 2, padding: "0.4rem 0.65rem", fontSize: "0.85rem" }}
//                         />
//                         <input
//                           type="text"
//                           placeholder="Duration"
//                           value={vid.duration}
//                           onChange={(e) => handleVideoItemChange(idx, "duration", e.target.value)}
//                           className="form-control"
//                           style={{ width: "90px", padding: "0.4rem 0.65rem", fontSize: "0.85rem" }}
//                         />
//                         <select
//                           value={vid.accessType}
//                           onChange={(e) => handleVideoItemChange(idx, "accessType", e.target.value)}
//                           className="form-control"
//                           style={{ width: "130px", padding: "0.4rem 0.65rem", fontSize: "0.85rem" }}
//                         >
//                           <option value="free">Free</option>
//                           <option value="trial">Trial</option>
//                           <option value="subscription">Subscription</option>
//                         </select>
//                         <button
//                           type="button"
//                           onClick={() => handleRemoveVideoItem(idx)}
//                           style={{ background: "none", border: "none", color: "var(--danger)", cursor: "pointer" }}
//                           aria-label="Remove lesson"
//                         >
//                           <X size={16} />
//                         </button>
//                       </div>

//                       <div style={{ display: "flex", gap: "0.75rem", alignItems: "center" }}>
//                         <div style={{ display: "flex", gap: "0.25rem" }}>
//                           <button
//                             type="button"
//                             onClick={() => handleVideoSourceToggle(idx, "upload")}
//                             className={`btn btn-sm ${vid.source === "upload" ? "btn-primary" : "btn-outline"}`}
//                             style={{ padding: "0.3rem 0.6rem", fontSize: "0.75rem", display: "inline-flex", alignItems: "center", gap: "0.25rem" }}
//                           >
//                             <FileVideo size={12} /> Upload
//                           </button>
//                           <button
//                             type="button"
//                             onClick={() => handleVideoSourceToggle(idx, "url")}
//                             className={`btn btn-sm ${vid.source === "url" ? "btn-primary" : "btn-outline"}`}
//                             style={{ padding: "0.3rem 0.6rem", fontSize: "0.75rem", display: "inline-flex", alignItems: "center", gap: "0.25rem" }}
//                           >
//                             <LinkIcon size={12} /> URL
//                           </button>
//                         </div>

//                         {vid.source === "upload" ? (
//                           <div style={{ flex: 1, display: "flex", alignItems: "center", gap: "0.5rem" }}>
//                             <input
//                               type="file"
//                               accept="video/*"
//                               onChange={(e) => handleVideoFileChange(idx, e.target.files)}
//                               style={{ fontSize: "0.8rem", flex: 1 }}
//                             />
//                             {vid.file && (
//                               <span style={{ fontSize: "0.75rem", color: "var(--success)", display: "inline-flex", alignItems: "center", gap: "0.2rem" }}>
//                                 <CheckCircle size={12} /> {vid.file.name}
//                               </span>
//                             )}
//                             {!vid.file && vid.url && (
//                               <span style={{ fontSize: "0.75rem", color: "var(--text-muted)" }}>
//                                 Existing file kept unless replaced
//                               </span>
//                             )}
//                           </div>
//                         ) : (
//                           <input
//                             type="text"
//                             placeholder="https://... video URL"
//                             value={vid.url}
//                             onChange={(e) => handleVideoItemChange(idx, "url", e.target.value)}
//                             className="form-control"
//                             style={{ flex: 1, padding: "0.4rem 0.65rem", fontSize: "0.85rem" }}
//                           />
//                         )}
//                       </div>
//                     </div>
//                   ))}

//                   {videoList.length === 0 && (
//                     <p style={{ fontSize: "0.85rem", color: "var(--text-muted)" }}>
//                       No lessons yet. Click "Add Lesson" to upload a video or link one.
//                     </p>
//                   )}
//                 </div>
//               </div>

//               <div style={{ display: "flex", justifyContent: "flex-end", gap: "0.75rem", marginTop: "2rem", borderTop: "1px solid var(--border-light)", paddingTop: "1.25rem" }}>
//                 <button
//                   type="button"
//                   onClick={() => setIsModalOpen(false)}
//                   className="btn btn-outline"
//                 >
//                   Cancel
//                 </button>
//                 <button
//                   type="submit"
//                   disabled={isSaving}
//                   className="btn btn-primary"
//                 >
//                   {isSaving ? "Saving Course..." : editingCourse ? "Update Course" : "Publish Course"}
//                 </button>
//               </div>
//             </form>
//           </div>
//         </div>
//       )}

//       {/* Delete Confirmation Modal */}
//       <ConfirmModal
//         isOpen={!!deleteCourseId}
//         title="Delete Course"
//         message="Are you sure you want to delete this course? All associated lesson enrollments will be impacted."
//         confirmText="Delete Course"
//         isLoading={isDeleting}
//         onConfirm={confirmDelete}
//         onCancel={() => setDeleteCourseId(null)}
//       />
//     </div>
//   );
// };

// export default AdminCoursesPage;



import React, { useState, useEffect } from "react";
import courseService from "../../services/courseService";
import categoryService from "../../services/categoryService";
import classService from "../../services/classService";
import { useToast } from "../../context/ToastContext";
import ConfirmModal from "../../components/common/ConfirmModal";
import {
  Plus,
  Edit2,
  Trash2,
  PlayCircle,
  Upload,
  X,
  Eye,
  CheckCircle,
  Video,
  FileVideo,
  Link as LinkIcon,
} from "lucide-react";

export const AdminCoursesPage = () => {
  const toast = useToast();

  const [courses, setCourses] = useState([]);
  const [categories, setCategories] = useState([]);
  const [classes, setClasses] = useState([]);
  const [loading, setLoading] = useState(true);

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCourse, setEditingCourse] = useState(null);
  const [isSaving, setIsSaving] = useState(false);

  // Delete Modal State
  const [deleteCourseId, setDeleteCourseId] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);

  // Form State
  const [formData, setFormData] = useState({
    courseName: "",
    courseDescription: "",
    courseCategory: "",
    courseClass: "",
    price: 0,
    originalPrice: 0,
    isPaid: false,
    instructor: "Principal Faculty",
    instructorTitle: "Lead Architect",
    level: "Intermediate",
    duration: "15h 00m",
  });

  const [images, setImages] = useState([]);

  // Video item builder state for adding video entries.
  // Each entry is EITHER an uploaded File (source: "upload") OR an external URL (source: "url").
  const [videoList, setVideoList] = useState([
    {
      title: "01. Introduction and Architectural Overview",
      duration: "10:00",
      accessType: "free",
      source: "url",
      url: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4",
      file: null,
    },
    {
      title: "02. Foundation Concepts and Hands-on Setup",
      duration: "15:00",
      accessType: "trial",
      source: "url",
      url: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerEscapes.mp4",
      file: null,
    },
    {
      title: "03. Advanced Deep Dive & Production Optimization",
      duration: "22:00",
      accessType: "subscription",
      source: "url",
      url: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerFun.mp4",
      file: null,
    },
  ]);

  const fetchCourses = async () => {
    try {
      setLoading(true);
      const [courseRes, catRes, classRes] = await Promise.all([
        courseService.getAllCourses(),
        categoryService.getAllCategories(),
        classService.getAllClasses(),
      ]);
      if (courseRes?.courses) setCourses(courseRes.courses);
      if (catRes?.category) setCategories(catRes.category);
      if (classRes?.classes) setClasses(classRes.classes);
    } catch (err) {
      toast.error("Failed to load courses or metadata.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCourses();
  }, []);

  const openCreateModal = () => {
    setEditingCourse(null);
    setFormData({
      courseName: "",
      courseDescription: "",
      courseCategory: categories[0]?.categoryName || "",
      courseClass: classes[0]?.className || "",
      price: 999,
      originalPrice: 1999,
      isPaid: true,
      instructor: "Prof. Lead Faculty",
      instructorTitle: "Senior Architect",
      level: "Intermediate",
      duration: "18h 30m",
    });
    setImages([]);
    setVideoList([
      {
        title: "",
        duration: "",
        accessType: "free",
        source: "upload",
        url: "",
        file: null,
        public_id: null,
      },
    ]);
    setIsModalOpen(true);
  };

  const openEditModal = (course) => {
    setEditingCourse(course);
    setFormData({
      courseName: course.courseName,
      courseDescription: course.courseDescription,
      courseCategory: course.courseCategory,
      courseClass: course.courseClass,
      price: course.price || 0,
      originalPrice: course.originalPrice || 0,
      isPaid: course.isPaid || false,
      instructor: course.instructor || "",
      instructorTitle: course.instructorTitle || "",
      level: course.level || "Intermediate",
      duration: course.duration || "",
    });
    if (course.courseVideo && course.courseVideo.length > 0) {
      setVideoList(
        course.courseVideo.map((v) => ({
          title: v.title || "",
          duration: v.duration || "",
          accessType: v.accessType || "free",
          source: "url",
          url: v.url || "",
          file: null,
          public_id: v.public_id || null,
        }))
      );
    } else {
      setVideoList([]);
    }
    setImages([]);
    setIsModalOpen(true);
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    try {
      setIsSaving(true);
      const data = new FormData();
      data.append("courseName", formData.courseName);
      data.append("courseDescription", formData.courseDescription);
      data.append("courseCategory", formData.courseCategory);
      data.append("courseClass", formData.courseClass);
      data.append("price", formData.price.toString());
      data.append("originalPrice", formData.originalPrice.toString());
      data.append("isPaid", formData.isPaid ? "true" : "false");
      data.append("instructor", formData.instructor);
      data.append("instructorTitle", formData.instructorTitle);
      data.append("level", formData.level);
      data.append("duration", formData.duration);

      // Append thumbnail images
      if (images && images.length > 0) {
        for (let i = 0; i < images.length; i++) {
          data.append("courseImage", images[i]);
        }
      }

      // Split lesson entries into "needs upload" vs "external URL"
      const fileEntries = videoList.filter((v) => v.source === "upload" && v.file);
      const urlEntries = videoList.filter((v) => v.source === "url" && v.url && v.url.trim() !== "");

      // IMPORTANT: file-placeholder metadata must come first, in the SAME order
      // the files are appended below, because the backend matches uploaded
      // courseVideo files to this array by index (both on create and update).
      const courseVideoMeta = [
        ...fileEntries.map((v) => ({
          title: v.title,
          duration: v.duration,
          accessType: v.accessType,
        })),
        ...urlEntries.map((v, i) => ({
          title: v.title,
          duration: v.duration,
          accessType: v.accessType,
          url: v.url.trim(),
          // The courseVideo schema requires public_id on every entry.
          // Keep the existing one when editing; invent a stable one for
          // brand-new external-URL lessons that never had a Cloudinary upload.
          public_id: v.public_id || `external_${Date.now()}_${i}`,
        })),
      ];

      data.append("courseVideo", JSON.stringify(courseVideoMeta));

      // Used by createCourse for clean title/accessType matching of uploaded files
      data.append("videoTitles", JSON.stringify(fileEntries.map((v) => v.title)));
      data.append("videoAccessTypes", JSON.stringify(fileEntries.map((v) => v.accessType)));

      // Actual video files, appended in the same order as the placeholders above
      fileEntries.forEach((v) => data.append("courseVideo", v.file));

      if (editingCourse) {
        await courseService.updateCourse(editingCourse._id, data);
        toast.success("Course updated successfully!");
      } else {
        await courseService.createCourse(data);
        toast.success("New course published successfully!");
      }

      setIsModalOpen(false);
      fetchCourses();
    } catch (err) {
      toast.error(err.formattedMessage || "Failed to save course.");
    } finally {
      setIsSaving(false);
    }
  };

  const confirmDelete = async () => {
    if (!deleteCourseId) return;
    try {
      setIsDeleting(true);
      await courseService.deleteCourse(deleteCourseId);
      toast.success("Course deleted successfully.");
      setDeleteCourseId(null);
      fetchCourses();
    } catch (err) {
      toast.error(err.formattedMessage || "Failed to delete course.");
    } finally {
      setIsDeleting(false);
    }
  };

  const handleAddVideoItem = () => {
    setVideoList([
      ...videoList,
      {
        title: `Lesson ${videoList.length + 1}: Technical Module`,
        duration: "12:00",
        accessType: "subscription",
        source: "upload",
        url: "",
        file: null,
        public_id: null,
      },
    ]);
  };

  const handleRemoveVideoItem = (idx) => {
    setVideoList(videoList.filter((_, i) => i !== idx));
  };

  const handleVideoItemChange = (idx, field, value) => {
    const updated = [...videoList];
    updated[idx][field] = value;
    setVideoList(updated);
  };

  const handleVideoSourceToggle = (idx, source) => {
    const updated = [...videoList];
    updated[idx].source = source;
    // Clear whichever input doesn't apply so we never submit stale data
    if (source === "upload") {
      updated[idx].url = "";
    } else {
      updated[idx].file = null;
    }
    setVideoList(updated);
  };

  const handleVideoFileChange = (idx, fileList) => {
    const file = fileList && fileList.length > 0 ? fileList[0] : null;
    const updated = [...videoList];
    updated[idx].file = file;
    if (file) {
      updated[idx].source = "upload";
      updated[idx].url = "";
      // Auto-fill a title from the filename if the admin hasn't typed one yet
      if (!updated[idx].title) {
        updated[idx].title = file.name.replace(/\.[^/.]+$/, "");
      }
    }
    setVideoList(updated);
  };

  return (
    <div className="animate-fade-in">
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "2rem" }}>
        <div>
          <h1 style={{ fontSize: "1.75rem", marginBottom: "0.4rem" }}>Manage Courses</h1>
          <p style={{ color: "var(--text-muted)", fontSize: "0.95rem" }}>
            Create, update, inspect video access, and publish educational streams.
          </p>
        </div>

        <button onClick={openCreateModal} className="btn btn-primary btn-sm">
          <Plus size={16} /> Add New Course
        </button>
      </div>

      {/* Courses List Table */}
      {loading ? (
        <div className="skeleton" style={{ width: "100%", height: "300px", borderRadius: "var(--radius-lg)" }} />
      ) : courses.length > 0 ? (
        <div className="table-responsive">
          <table className="table">
            <thead>
              <tr>
                <th>Thumbnail</th>
                <th>Course Name</th>
                <th>Category</th>
                <th>Class</th>
                <th>Price</th>
                <th>Videos</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {courses.map((course) => {
                const img =
                  course.courseImage?.[0]?.url ||
                  "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=200&auto=format&fit=crop&q=80";

                return (
                  <tr key={course._id}>
                    <td>
                      <img
                        src={img}
                        alt={course.courseName}
                        style={{ width: "54px", height: "34px", borderRadius: "var(--radius-sm)", objectFit: "cover" }}
                      />
                    </td>
                    <td>
                      <div style={{ fontWeight: 600 }}>{course.courseName}</div>
                      <div style={{ fontSize: "0.75rem", color: "var(--text-muted)" }}>
                        By {course.instructor || "Lead Faculty"}
                      </div>
                    </td>
                    <td>
                      <span className="badge badge-primary">{course.courseCategory}</span>
                    </td>
                    <td>{course.courseClass}</td>
                    <td style={{ fontWeight: 700 }}>
                      {course.isPaid && course.price > 0 ? `₹${course.price}` : <span style={{ color: "var(--success)" }}>Free</span>}
                    </td>
                    <td>
                      <span className="badge badge-gray" style={{ display: "inline-flex", alignItems: "center", gap: "0.25rem" }}>
                        <PlayCircle size={12} /> {course.courseVideo?.length || 0}
                      </span>
                    </td>
                    <td>
                      <div style={{ display: "flex", gap: "0.5rem" }}>
                        <button
                          onClick={() => openEditModal(course)}
                          className="btn btn-outline btn-icon"
                          style={{ width: "32px", height: "32px" }}
                          aria-label="Edit course"
                        >
                          <Edit2 size={14} />
                        </button>
                        <button
                          onClick={() => setDeleteCourseId(course._id)}
                          className="btn btn-outline btn-icon"
                          style={{ width: "32px", height: "32px", color: "var(--danger)", borderColor: "#fca5a5" }}
                          aria-label="Delete course"
                        >
                          <Trash2 size={14} />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      ) : (
        <div className="empty-state">
          <h4>No Courses Published Yet</h4>
          <p style={{ marginTop: "0.5rem" }}>Click "Add New Course" to upload and publish your first educational track.</p>
        </div>
      )}

      {/* Create / Edit Course Modal */}
      {isModalOpen && (
        <div className="modal-backdrop" onClick={() => setIsModalOpen(false)}>
          <div
            className="modal-dialog modal-lg animate-modal"
            onClick={(e) => e.stopPropagation()}
            style={{ padding: "2rem" }}
          >
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1.5rem", paddingBottom: "1rem", borderBottom: "1px solid var(--border-light)" }}>
              <h2 style={{ fontSize: "1.4rem" }}>
                {editingCourse ? "Edit Course" : "Publish New Course"}
              </h2>
              <button
                onClick={() => setIsModalOpen(false)}
                style={{ background: "none", border: "none", cursor: "pointer" }}
              >
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleFormSubmit}>
              <div className="grid-2">
                <div className="form-group" style={{ gridColumn: "1 / -1" }}>
                  <label className="form-label">Course Title</label>
                  <input
                    type="text"
                    required
                    value={formData.courseName}
                    onChange={(e) => setFormData({ ...formData, courseName: e.target.value })}
                    className="form-control"
                    placeholder="e.g. Full-Stack Web Development Masterclass"
                  />
                </div>

                <div className="form-group" style={{ gridColumn: "1 / -1" }}>
                  <label className="form-label">Course Description</label>
                  <textarea
                    rows={3}
                    required
                    value={formData.courseDescription}
                    onChange={(e) => setFormData({ ...formData, courseDescription: e.target.value })}
                    className="form-control"
                    placeholder="Detailed explanation of curriculum, outcomes, and prerequisites..."
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Category</label>
                  <select
                    value={formData.courseCategory}
                    onChange={(e) => setFormData({ ...formData, courseCategory: e.target.value })}
                    className="form-control"
                  >
                    {categories.map((c) => (
                      <option key={c._id} value={c.categoryName}>
                        {c.categoryName}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="form-group">
                  <label className="form-label">Class Level</label>
                  <select
                    value={formData.courseClass}
                    onChange={(e) => setFormData({ ...formData, courseClass: e.target.value })}
                    className="form-control"
                  >
                    {classes.map((cls) => (
                      <option key={cls._id} value={cls.className}>
                        {cls.className}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="form-group">
                  <label className="form-label">Price (INR ₹)</label>
                  <input
                    type="number"
                    value={formData.price}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        price: Number(e.target.value),
                        isPaid: Number(e.target.value) > 0,
                      })
                    }
                    className="form-control"
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Original Price (INR ₹)</label>
                  <input
                    type="number"
                    value={formData.originalPrice}
                    onChange={(e) => setFormData({ ...formData, originalPrice: Number(e.target.value) })}
                    className="form-control"
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Instructor Name</label>
                  <input
                    type="text"
                    value={formData.instructor}
                    onChange={(e) => setFormData({ ...formData, instructor: e.target.value })}
                    className="form-control"
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Total Duration</label>
                  <input
                    type="text"
                    value={formData.duration}
                    onChange={(e) => setFormData({ ...formData, duration: e.target.value })}
                    className="form-control"
                    placeholder="e.g. 18h 30m"
                  />
                </div>
              </div>

              {/* Upload New Media Images */}
              <div className="form-group" style={{ marginTop: "1rem" }}>
                <label className="form-label">Course Thumbnail Images (Upload)</label>
                <input
                  type="file"
                  multiple
                  accept="image/*"
                  onChange={(e) => setImages(e.target.files)}
                  className="form-control"
                />
              </div>

              {/* Course Videos Management */}
              <div style={{ marginTop: "1.5rem", borderTop: "1px solid var(--border-light)", paddingTop: "1.5rem" }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1rem" }}>
                  <div>
                    <h4 style={{ fontSize: "1.1rem" }}>Syllabus Lessons & Video Access Levels</h4>
                    <p style={{ fontSize: "0.8rem", color: "var(--text-muted)" }}>
                      Upload a video file or paste an external URL for each lecture, and set its access type.
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={handleAddVideoItem}
                    className="btn btn-outline btn-sm"
                  >
                    <Plus size={14} /> Add Lesson
                  </button>
                </div>

                <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem", maxHeight: "420px", overflowY: "auto", paddingRight: "0.5rem" }}>
                  {videoList.map((vid, idx) => (
                    <div
                      key={idx}
                      style={{
                        display: "flex",
                        flexDirection: "column",
                        gap: "0.5rem",
                        padding: "0.75rem",
                        background: "var(--bg-subtle)",
                        borderRadius: "var(--radius-md)",
                        border: "1px solid var(--border)",
                      }}
                    >
                      <div style={{ display: "flex", gap: "0.75rem", alignItems: "center" }}>
                        <input
                          type="text"
                          placeholder="Lesson title"
                          value={vid.title}
                          onChange={(e) => handleVideoItemChange(idx, "title", e.target.value)}
                          className="form-control"
                          style={{ flex: 2, padding: "0.4rem 0.65rem", fontSize: "0.85rem" }}
                        />
                        <input
                          type="text"
                          placeholder="Duration"
                          value={vid.duration}
                          onChange={(e) => handleVideoItemChange(idx, "duration", e.target.value)}
                          className="form-control"
                          style={{ width: "90px", padding: "0.4rem 0.65rem", fontSize: "0.85rem" }}
                        />
                        <select
                          value={vid.accessType}
                          onChange={(e) => handleVideoItemChange(idx, "accessType", e.target.value)}
                          className="form-control"
                          style={{ width: "130px", padding: "0.4rem 0.65rem", fontSize: "0.85rem" }}
                        >
                          <option value="free">Free</option>
                          <option value="trial">Trial</option>
                          <option value="subscription">Subscription</option>
                        </select>
                        <button
                          type="button"
                          onClick={() => handleRemoveVideoItem(idx)}
                          style={{ background: "none", border: "none", color: "var(--danger)", cursor: "pointer" }}
                          aria-label="Remove lesson"
                        >
                          <X size={16} />
                        </button>
                      </div>

                      <div style={{ display: "flex", gap: "0.75rem", alignItems: "center" }}>
                        <div style={{ display: "flex", gap: "0.25rem" }}>
                          <button
                            type="button"
                            onClick={() => handleVideoSourceToggle(idx, "upload")}
                            className={`btn btn-sm ${vid.source === "upload" ? "btn-primary" : "btn-outline"}`}
                            style={{ padding: "0.3rem 0.6rem", fontSize: "0.75rem", display: "inline-flex", alignItems: "center", gap: "0.25rem" }}
                          >
                            <FileVideo size={12} /> Upload
                          </button>
                          <button
                            type="button"
                            onClick={() => handleVideoSourceToggle(idx, "url")}
                            className={`btn btn-sm ${vid.source === "url" ? "btn-primary" : "btn-outline"}`}
                            style={{ padding: "0.3rem 0.6rem", fontSize: "0.75rem", display: "inline-flex", alignItems: "center", gap: "0.25rem" }}
                          >
                            <LinkIcon size={12} /> URL
                          </button>
                        </div>

                        {vid.source === "upload" ? (
                          <div style={{ flex: 1, display: "flex", alignItems: "center", gap: "0.5rem" }}>
                            <input
                              type="file"
                              accept="video/*"
                              onChange={(e) => handleVideoFileChange(idx, e.target.files)}
                              style={{ fontSize: "0.8rem", flex: 1 }}
                            />
                            {vid.file && (
                              <span style={{ fontSize: "0.75rem", color: "var(--success)", display: "inline-flex", alignItems: "center", gap: "0.2rem" }}>
                                <CheckCircle size={12} /> {vid.file.name}
                              </span>
                            )}
                            {!vid.file && vid.url && (
                              <span style={{ fontSize: "0.75rem", color: "var(--text-muted)" }}>
                                Existing file kept unless replaced
                              </span>
                            )}
                          </div>
                        ) : (
                          <input
                            type="text"
                            placeholder="https://... video URL"
                            value={vid.url}
                            onChange={(e) => handleVideoItemChange(idx, "url", e.target.value)}
                            className="form-control"
                            style={{ flex: 1, padding: "0.4rem 0.65rem", fontSize: "0.85rem" }}
                          />
                        )}
                      </div>
                    </div>
                  ))}

                  {videoList.length === 0 && (
                    <p style={{ fontSize: "0.85rem", color: "var(--text-muted)" }}>
                      No lessons yet. Click "Add Lesson" to upload a video or link one.
                    </p>
                  )}
                </div>
              </div>

              <div style={{ display: "flex", justifyContent: "flex-end", gap: "0.75rem", marginTop: "2rem", borderTop: "1px solid var(--border-light)", paddingTop: "1.25rem" }}>
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="btn btn-outline"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSaving}
                  className="btn btn-primary"
                >
                  {isSaving ? "Saving Course..." : editingCourse ? "Update Course" : "Publish Course"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      <ConfirmModal
        isOpen={!!deleteCourseId}
        title="Delete Course"
        message="Are you sure you want to delete this course? All associated lesson enrollments will be impacted."
        confirmText="Delete Course"
        isLoading={isDeleting}
        onConfirm={confirmDelete}
        onCancel={() => setDeleteCourseId(null)}
      />
    </div>
  );
};

export default AdminCoursesPage;