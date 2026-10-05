// import React, { useState, useEffect } from "react";
// import { createPortal } from "react-dom";
// import classService from "../../services/classService";
// import courseService from "../../services/courseService";
// import { useToast } from "../../context/ToastContext";
// import ConfirmModal from "../../components/common/ConfirmModal";
// import AdminExcelToolbar from "../../components/common/AdminExcelToolbar";
// import { Plus, Edit2, Trash2, GraduationCap, X, Search } from "lucide-react";

// export const AdminClassesPage = () => {
//   const toast = useToast();

//   const [classes, setClasses] = useState([]);
//   const [classUsage, setClassUsage] = useState({});
//   const [searchQuery, setSearchQuery] = useState("");
//   const [usageFilter, setUsageFilter] = useState("all");
//   const [loading, setLoading] = useState(true);

//   // Modal State
//   const [isModalOpen, setIsModalOpen] = useState(false);
//   const [editingClass, setEditingClass] = useState(null);
//   const [className, setClassName] = useState("");
//   const [isSaving, setIsSaving] = useState(false);

//   // Delete State
//   const [deleteId, setDeleteId] = useState(null);
//   const [isDeleting, setIsDeleting] = useState(false);

//   const fetchClasses = async () => {
//     try {
//       setLoading(true);
//       const [res, courseRes] = await Promise.all([
//         classService.getAllClasses(),
//         courseService.getAllAdminCourses(),
//       ]);
//       if (res?.classes) setClasses(res.classes);
//       const usage = {};
//       (courseRes?.courses || []).forEach((course) => {
//         usage[course.courseClass] = (usage[course.courseClass] || 0) + 1;
//       });
//       setClassUsage(usage);
//     } catch (err) {
//       toast.error("Failed to load classes.");
//     } finally {
//       setLoading(false);
//     }
//   };

//   useEffect(() => {
//     fetchClasses();
//   }, []);

//   const filteredClasses = classes.filter((item) => {
//     const matchesName = item.className.toLowerCase().includes(searchQuery.trim().toLowerCase());
//     const count = classUsage[item.className] || 0;
//     return matchesName && (usageFilter === "all" || (usageFilter === "used" ? count > 0 : count === 0));
//   });

//   const importClasses = async (rows) => {
//     let imported = 0;
//     const existingNames = new Set(classes.map((item) => item.className.toLowerCase()));
//     for (const row of rows) {
//       const name = String(row.className || row.class || row["Class / Level Name"] || "").trim();
//       if (!name || existingNames.has(name.toLowerCase())) continue;
//       await classService.createClass(name);
//       existingNames.add(name.toLowerCase());
//       imported += 1;
//     }
//     await fetchClasses();
//     toast.success(`Imported ${imported} new class levels.`);
//     return `Imported ${imported} class levels`;
//   };

//   const openCreateModal = () => {
//     setEditingClass(null);
//     setClassName("");
//     setIsModalOpen(true);
//   };

//   const openEditModal = (cls) => {
//     setEditingClass(cls);
//     setClassName(cls.className);
//     setIsModalOpen(true);
//   };

//   const handleSave = async (e) => {
//     e.preventDefault();
//     if (!className.trim()) return;

//     try {
//       setIsSaving(true);
//       if (editingClass) {
//         await classService.updateClass(editingClass._id, className.trim());
//         toast.success("Class updated successfully!");
//       } else {
//         await classService.createClass(className.trim());
//         toast.success("Class created successfully!");
//       }
//       setIsModalOpen(false);
//       fetchClasses();
//     } catch (err) {
//       toast.error(err.formattedMessage || "Failed to save class.");
//     } finally {
//       setIsSaving(false);
//     }
//   };

//   const confirmDelete = async () => {
//     if (!deleteId) return;
//     try {
//       setIsDeleting(true);
//       await classService.deleteClass(deleteId);
//       toast.success("Class deleted.");
//       setDeleteId(null);
//       fetchClasses();
//     } catch (err) {
//       toast.error(err.formattedMessage || "Failed to delete class.");
//     } finally {
//       setIsDeleting(false);
//     }
//   };

//   return (
//     <div className="animate-fade-in responsive-page admin-classes-page">
//       <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: "1rem", flexWrap: "wrap", marginBottom: "1.25rem" }}>
//         <div>
//           <h1 style={{ fontSize: "1.75rem", marginBottom: "0.4rem" }}>Class / Level Management</h1>
//           <p style={{ color: "var(--text-muted)", fontSize: "0.95rem" }}>
//             Maintain education levels, proficiency badges, and grade classes.
//           </p>
//         </div>

//         <button onClick={openCreateModal} className="btn btn-primary btn-sm">
//           <Plus size={16} /> Add Class Level
//         </button>
//       </div>

//       <div className="admin-list-toolbar">
//         <div className="input-with-icon" style={{ flex: "1 1 240px", minWidth: 0 }}>
//           <Search className="input-icon-left" size={17} />
//           <input className="form-control" type="search" aria-label="Search class levels" placeholder="Search class levels..." value={searchQuery} onChange={(event) => setSearchQuery(event.target.value)} style={{ paddingLeft: "2.5rem" }} />
//         </div>
//         <select className="form-control" aria-label="Filter class levels by course usage" value={usageFilter} onChange={(event) => setUsageFilter(event.target.value)} style={{ flex: "0 1 190px" }}>
//           <option value="all">All Class Levels</option>
//           <option value="used">Used by Courses</option>
//           <option value="unused">Unused Class Levels</option>
//         </select>
//         <AdminExcelToolbar
//           rows={classes.map((item) => ({ className: item.className, courseCount: classUsage[item.className] || 0, createdAt: item.createdAt }))}
//           sheetName="Class Levels"
//           fileName="classstream-class-levels"
//           onImport={importClasses}
//           onError={(error) => toast.error(error.formattedMessage || error.message || "Could not import class levels.")}
//         />
//       </div>

//       {loading ? (
//         <div className="skeleton" style={{ width: "100%", height: "200px", borderRadius: "var(--radius-lg)" }} />
//       ) : filteredClasses.length > 0 ? (
//         <div className="table-responsive">
//           <table className="table">
//             <thead>
//               <tr>
//                 <th>Class / Level Name</th>
//                 <th>Created Timestamp</th>
//                 <th style={{ textAlign: "right" }}>Actions</th>
//               </tr>
//             </thead>
//             <tbody>
//               {filteredClasses.map((cls) => (
//                 <tr key={cls._id}>
//                   <td style={{ fontWeight: 600 }}>
//                     <div style={{ display: "flex", alignItems: "center", gap: "0.65rem" }}>
//                       <GraduationCap size={18} color="var(--primary)" />
//                       <span>{cls.className}</span>
//                     </div>
//                   </td>
//                   <td style={{ color: "var(--text-muted)", fontSize: "0.85rem" }}>
//                     {new Date(cls.createdAt).toLocaleDateString("en-IN")}
//                   </td>
//                   <td style={{ textAlign: "right" }}>
//                     <div style={{ display: "inline-flex", gap: "0.5rem" }}>
//                       <button
//                         onClick={() => openEditModal(cls)}
//                         className="btn btn-outline btn-icon"
//                         style={{ width: "32px", height: "32px" }}
//                         aria-label="Edit class"
//                       >
//                         <Edit2 size={14} />
//                       </button>
//                       <button
//                         onClick={() => setDeleteId(cls._id)}
//                         className="btn btn-outline btn-icon"
//                         style={{ width: "32px", height: "32px", color: "var(--danger)", borderColor: "#fca5a5" }}
//                         aria-label="Delete class"
//                       >
//                         <Trash2 size={14} />
//                       </button>
//                     </div>
//                   </td>
//                 </tr>
//               ))}
//             </tbody>
//           </table>
//         </div>
//       ) : (
//         <div className="empty-state">
//           <h4>{classes.length ? "No Matching Class Levels" : "No Classes Defined"}</h4>
//           <p>{classes.length ? "Change the search or usage filter." : "Add class tiers like Beginner, Advanced, or Class 12."}</p>
//         </div>
//       )}

//       {/* Add / Edit Modal */}
//       {isModalOpen && createPortal(
//         <div className="modal-backdrop" onClick={() => setIsModalOpen(false)}>
//           <div
//             className="modal-dialog animate-modal"
//             onClick={(e) => e.stopPropagation()}
//             style={{ padding: "2rem", maxWidth: "440px" }}
//           >
//             <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1.5rem" }}>
//               <h2 style={{ fontSize: "1.3rem" }}>
//                 {editingClass ? "Edit Class" : "Add New Class"}
//               </h2>
//               <button onClick={() => setIsModalOpen(false)} style={{ background: "none", border: "none", cursor: "pointer" }}>
//                 <X size={20} />
//               </button>
//             </div>

//             <form onSubmit={handleSave}>
//               <div className="form-group">
//                 <label className="form-label">Class Name</label>
//                 <input
//                   type="text"
//                   required
//                   value={className}
//                   onChange={(e) => setClassName(e.target.value)}
//                   className="form-control"
//                   placeholder="e.g. Masterclass, Intermediate, Class 10"
//                 />
//               </div>

//               <div style={{ display: "flex", justifyContent: "flex-end", gap: "0.75rem", marginTop: "1.5rem" }}>
//                 <button type="button" onClick={() => setIsModalOpen(false)} className="btn btn-outline">
//                   Cancel
//                 </button>
//                 <button type="submit" disabled={isSaving} className="btn btn-primary">
//                   {isSaving ? "Saving..." : editingClass ? "Save Changes" : "Create Class"}
//                 </button>
//               </div>
//             </form>
//           </div>
//         </div>,
//         document.body
//       )}

//       <ConfirmModal
//         isOpen={!!deleteId}
//         title="Delete Class"
//         message="Are you sure you want to delete this class level?"
//         isLoading={isDeleting}
//         onConfirm={confirmDelete}
//         onCancel={() => setDeleteId(null)}
//       />
//     </div>
//   );
// };

// export default AdminClassesPage;

import React, { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import classService from "../../services/classService";
import courseService from "../../services/courseService";
import { useToast } from "../../context/ToastContext";
import ConfirmModal from "../../components/common/ConfirmModal";
import AdminExcelToolbar from "../../components/common/AdminExcelToolbar";
import { Plus, Edit2, Trash2, GraduationCap, X, Search, PlayCircle } from "lucide-react";

/* Responsive styles: table on desktop, cards on mobile (<= 768px) */
const responsiveCss = `
  .admin-classes-page .class-cards { display: none; }

  @media (max-width: 768px) {
    .admin-classes-page .admin-classes-header {
      flex-direction: column !important;
      align-items: flex-start !important;
      gap: 1rem !important;
    }
    .admin-classes-page .admin-classes-header .btn {
      width: 100%;
      justify-content: center;
    }

    .admin-classes-page .admin-list-toolbar {
      flex-wrap: wrap;
    }
    .admin-classes-page .admin-list-toolbar > * {
      flex: 1 1 100% !important;
    }

    /* Hide table, show cards */
    .admin-classes-page .class-table-wrap { display: none !important; }
    .admin-classes-page .class-cards {
      display: flex;
      flex-direction: column;
      gap: 0.85rem;
    }

    .class-card {
      background: var(--surface, #fff);
      border: 1px solid var(--border);
      border-radius: var(--radius-lg);
      padding: 0.9rem;
      display: flex;
      flex-direction: column;
      gap: 0.8rem;
    }
    .class-card-top {
      display: flex;
      align-items: center;
      gap: 0.75rem;
    }
    .class-card-icon {
      width: 40px;
      height: 40px;
      border-radius: var(--radius-md);
      background: var(--bg-subtle);
      display: flex;
      align-items: center;
      justify-content: center;
      flex-shrink: 0;
    }
    .class-card-title {
      font-weight: 600;
      font-size: 1rem;
      line-height: 1.3;
      word-break: break-word;
      flex: 1;
      min-width: 0;
    }
    .class-card-meta {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 0.65rem 0.75rem;
      padding: 0.75rem;
      background: var(--bg-subtle);
      border-radius: var(--radius-md);
    }
    .class-card-meta-label {
      font-size: 0.68rem;
      text-transform: uppercase;
      letter-spacing: 0.04em;
      color: var(--text-muted);
      margin-bottom: 0.2rem;
    }
    .class-card-meta-value {
      font-size: 0.88rem;
      font-weight: 600;
    }
    .class-card-actions {
      display: flex;
      gap: 0.6rem;
    }
    .class-card-actions .btn {
      flex: 1;
      display: inline-flex;
      align-items: center;
      justify-content: center;
      gap: 0.4rem;
    }

    /* Modal */
    .class-modal { padding: 1.25rem !important; }
    .class-modal .class-modal-footer { flex-direction: column-reverse; }
    .class-modal .class-modal-footer .btn { width: 100%; }
  }
`;

export const AdminClassesPage = () => {
  const toast = useToast();

  const [classes, setClasses] = useState([]);
  const [classUsage, setClassUsage] = useState({});
  const [searchQuery, setSearchQuery] = useState("");
  const [usageFilter, setUsageFilter] = useState("all");
  const [loading, setLoading] = useState(true);

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingClass, setEditingClass] = useState(null);
  const [className, setClassName] = useState("");
  const [isSaving, setIsSaving] = useState(false);

  // Delete State
  const [deleteId, setDeleteId] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const fetchClasses = async () => {
    try {
      setLoading(true);
      const [res, courseRes] = await Promise.all([
        classService.getAllClasses(),
        courseService.getAllAdminCourses(),
      ]);
      if (res?.classes) setClasses(res.classes);
      const usage = {};
      (courseRes?.courses || []).forEach((course) => {
        usage[course.courseClass] = (usage[course.courseClass] || 0) + 1;
      });
      setClassUsage(usage);
    } catch (err) {
      toast.error("Failed to load classes.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchClasses();
  }, []);

  const filteredClasses = classes.filter((item) => {
    const matchesName = item.className.toLowerCase().includes(searchQuery.trim().toLowerCase());
    const count = classUsage[item.className] || 0;
    return matchesName && (usageFilter === "all" || (usageFilter === "used" ? count > 0 : count === 0));
  });

  const importClasses = async (rows) => {
    let imported = 0;
    const existingNames = new Set(classes.map((item) => item.className.toLowerCase()));
    for (const row of rows) {
      const name = String(row.className || row.class || row["Class / Level Name"] || "").trim();
      if (!name || existingNames.has(name.toLowerCase())) continue;
      await classService.createClass(name);
      existingNames.add(name.toLowerCase());
      imported += 1;
    }
    await fetchClasses();
    toast.success(`Imported ${imported} new class levels.`);
    return `Imported ${imported} class levels`;
  };

  const openCreateModal = () => {
    setEditingClass(null);
    setClassName("");
    setIsModalOpen(true);
  };

  const openEditModal = (cls) => {
    setEditingClass(cls);
    setClassName(cls.className);
    setIsModalOpen(true);
  };

  const handleSave = async (e) => {
    e.preventDefault();
    if (!className.trim()) return;

    try {
      setIsSaving(true);
      if (editingClass) {
        await classService.updateClass(editingClass._id, className.trim());
        toast.success("Class updated successfully!");
      } else {
        await classService.createClass(className.trim());
        toast.success("Class created successfully!");
      }
      setIsModalOpen(false);
      fetchClasses();
    } catch (err) {
      toast.error(err.formattedMessage || "Failed to save class.");
    } finally {
      setIsSaving(false);
    }
  };

  const confirmDelete = async () => {
    if (!deleteId) return;
    try {
      setIsDeleting(true);
      await classService.deleteClass(deleteId);
      toast.success("Class deleted.");
      setDeleteId(null);
      fetchClasses();
    } catch (err) {
      toast.error(err.formattedMessage || "Failed to delete class.");
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <div className="animate-fade-in responsive-page admin-classes-page">
      <style>{responsiveCss}</style>

      <div
        className="admin-classes-header"
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          gap: "1rem",
          flexWrap: "wrap",
          marginBottom: "1.25rem",
        }}
      >
        <div>
          <h1 style={{ fontSize: "1.75rem", marginBottom: "0.4rem" }}>Class / Level Management</h1>
          <p style={{ color: "var(--text-muted)", fontSize: "0.95rem" }}>
            Maintain education levels, proficiency badges, and grade classes.
          </p>
        </div>

        <button onClick={openCreateModal} className="btn btn-primary btn-sm">
          <Plus size={16} /> Add Class Level
        </button>
      </div>

      <div className="admin-list-toolbar">
        <div className="input-with-icon" style={{ flex: "1 1 240px", minWidth: 0 }}>
          <Search className="input-icon-left" size={17} />
          <input
            className="form-control"
            type="search"
            aria-label="Search class levels"
            placeholder="Search class levels..."
            value={searchQuery}
            onChange={(event) => setSearchQuery(event.target.value)}
            style={{ paddingLeft: "2.5rem" }}
          />
        </div>
        <select
          className="form-control"
          aria-label="Filter class levels by course usage"
          value={usageFilter}
          onChange={(event) => setUsageFilter(event.target.value)}
          style={{ flex: "0 1 190px" }}
        >
          <option value="all">All Class Levels</option>
          <option value="used">Used by Courses</option>
          <option value="unused">Unused Class Levels</option>
        </select>
        <AdminExcelToolbar
          rows={classes.map((item) => ({
            className: item.className,
            courseCount: classUsage[item.className] || 0,
            createdAt: item.createdAt,
          }))}
          sheetName="Class Levels"
          fileName="classstream-class-levels"
          onImport={importClasses}
          onError={(error) =>
            toast.error(error.formattedMessage || error.message || "Could not import class levels.")
          }
        />
      </div>

      {loading ? (
        <div
          className="skeleton"
          style={{ width: "100%", height: "200px", borderRadius: "var(--radius-lg)" }}
        />
      ) : filteredClasses.length > 0 ? (
        <>
          {/* ===== Desktop: table ===== */}
          <div className="table-responsive class-table-wrap">
            <table className="table">
              <thead>
                <tr>
                  <th>Class / Level Name</th>
                  <th>Created Timestamp</th>
                  <th style={{ textAlign: "right" }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredClasses.map((cls) => (
                  <tr key={cls._id}>
                    <td style={{ fontWeight: 600 }}>
                      <div style={{ display: "flex", alignItems: "center", gap: "0.65rem" }}>
                        <GraduationCap size={18} color="var(--primary)" />
                        <span>{cls.className}</span>
                      </div>
                    </td>
                    <td style={{ color: "var(--text-muted)", fontSize: "0.85rem" }}>
                      {new Date(cls.createdAt).toLocaleDateString("en-IN")}
                    </td>
                    <td style={{ textAlign: "right" }}>
                      <div style={{ display: "inline-flex", gap: "0.5rem" }}>
                        <button
                          onClick={() => openEditModal(cls)}
                          className="btn btn-outline btn-icon"
                          style={{ width: "32px", height: "32px" }}
                          aria-label="Edit class"
                        >
                          <Edit2 size={14} />
                        </button>
                        <button
                          onClick={() => setDeleteId(cls._id)}
                          className="btn btn-outline btn-icon"
                          style={{
                            width: "32px",
                            height: "32px",
                            color: "var(--danger)",
                            borderColor: "#fca5a5",
                          }}
                          aria-label="Delete class"
                        >
                          <Trash2 size={14} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* ===== Mobile: cards ===== */}
          <div className="class-cards">
            {filteredClasses.map((cls) => (
              <div className="class-card" key={cls._id}>
                <div className="class-card-top">
                  <div className="class-card-icon">
                    <GraduationCap size={20} color="var(--primary)" />
                  </div>
                  <div className="class-card-title">{cls.className}</div>
                </div>

                <div className="class-card-meta">
                  <div>
                    <div className="class-card-meta-label">Created</div>
                    <div className="class-card-meta-value">
                      {new Date(cls.createdAt).toLocaleDateString("en-IN")}
                    </div>
                  </div>
                  <div>
                    <div className="class-card-meta-label">Courses</div>
                    <div className="class-card-meta-value">
                      <span
                        className="badge badge-gray"
                        style={{ display: "inline-flex", alignItems: "center", gap: "0.25rem" }}
                      >
                        <PlayCircle size={12} /> {classUsage[cls.className] || 0}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="class-card-actions">
                  <button
                    onClick={() => openEditModal(cls)}
                    className="btn btn-outline btn-sm"
                    aria-label="Edit class"
                  >
                    <Edit2 size={14} /> Edit
                  </button>
                  <button
                    onClick={() => setDeleteId(cls._id)}
                    className="btn btn-outline btn-sm"
                    style={{ color: "var(--danger)", borderColor: "#fca5a5" }}
                    aria-label="Delete class"
                  >
                    <Trash2 size={14} /> Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        </>
      ) : (
        <div className="empty-state">
          <h4>{classes.length ? "No Matching Class Levels" : "No Classes Defined"}</h4>
          <p>
            {classes.length
              ? "Change the search or usage filter."
              : "Add class tiers like Beginner, Advanced, or Class 12."}
          </p>
        </div>
      )}

      {/* Add / Edit Modal */}
      {isModalOpen &&
        createPortal(
          <div className="modal-backdrop" onClick={() => setIsModalOpen(false)}>
            <style>{responsiveCss}</style>
            <div
              className="modal-dialog class-modal animate-modal"
              onClick={(e) => e.stopPropagation()}
              style={{ padding: "2rem", maxWidth: "440px" }}
            >
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  marginBottom: "1.5rem",
                }}
              >
                <h2 style={{ fontSize: "1.3rem" }}>
                  {editingClass ? "Edit Class" : "Add New Class"}
                </h2>
                <button
                  onClick={() => setIsModalOpen(false)}
                  style={{ background: "none", border: "none", cursor: "pointer" }}
                  aria-label="Close"
                >
                  <X size={20} />
                </button>
              </div>

              <form onSubmit={handleSave}>
                <div className="form-group">
                  <label className="form-label">Class Name</label>
                  <input
                    type="text"
                    required
                    value={className}
                    onChange={(e) => setClassName(e.target.value)}
                    className="form-control"
                    placeholder="e.g. Masterclass, Intermediate, Class 10"
                  />
                </div>

                <div
                  className="class-modal-footer"
                  style={{
                    display: "flex",
                    justifyContent: "flex-end",
                    gap: "0.75rem",
                    marginTop: "1.5rem",
                  }}
                >
                  <button
                    type="button"
                    onClick={() => setIsModalOpen(false)}
                    className="btn btn-outline"
                  >
                    Cancel
                  </button>
                  <button type="submit" disabled={isSaving} className="btn btn-primary">
                    {isSaving ? "Saving..." : editingClass ? "Save Changes" : "Create Class"}
                  </button>
                </div>
              </form>
            </div>
          </div>,
          document.body
        )}

      <ConfirmModal
        isOpen={!!deleteId}
        title="Delete Class"
        message="Are you sure you want to delete this class level?"
        isLoading={isDeleting}
        onConfirm={confirmDelete}
        onCancel={() => setDeleteId(null)}
      />
    </div>
  );
};

export default AdminClassesPage;