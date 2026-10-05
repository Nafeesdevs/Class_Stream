// import React, { useState, useEffect } from "react";
// import paymentService from "../../services/paymentService";
// import AdminExcelToolbar from "../../components/common/AdminExcelToolbar";
// import { useToast } from "../../context/ToastContext";
// import { Search } from "lucide-react";

// export const AdminEnrollmentsPage = () => {
//   const toast = useToast();
//   const [enrollments, setEnrollments] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [searchQuery, setSearchQuery] = useState("");
//   const [statusFilter, setStatusFilter] = useState("all");

//   useEffect(() => {
//     const fetchEnrollments = async () => {
//       try {
//         setLoading(true);
//         const res = await paymentService.getAdminEnrollments();
//         if (res?.enrollments) {
//           setEnrollments(res.enrollments);
//         }
//       } catch (err) {
//         console.warn("Could not load enrollments:", err);
//       } finally {
//         setLoading(false);
//       }
//     };
//     fetchEnrollments();
//   }, []);

//   const filteredEnrollments = enrollments.filter((enrollment) => {
//     const matchesQuery = [enrollment.user?.name, enrollment.user?.email, enrollment.course?.courseName]
//       .some((value) => value?.toLowerCase().includes(searchQuery.trim().toLowerCase()));
//     return matchesQuery && (statusFilter === "all" || enrollment.status === statusFilter);
//   });

//   const reviewImportedEnrollments = async (rows) => {
//     const knownIds = new Set(enrollments.map((enrollment) => enrollment._id));
//     const knownPairs = new Set(enrollments.map((enrollment) => `${enrollment.user?.email?.toLowerCase()}|${enrollment.course?.courseName?.toLowerCase()}`));
//     let matched = 0;
//     let unknown = 0;
//     for (const row of rows) {
//       const id = String(row._id || row.enrollmentId || "").trim();
//       const pair = `${String(row.studentEmail || row.email || "").toLowerCase()}|${String(row.courseName || row.course || "").toLowerCase()}`;
//       if ((id && knownIds.has(id)) || knownPairs.has(pair)) matched += 1;
//       else unknown += 1;
//     }
//     return `Review only: ${matched} matched, ${unknown} unknown; enrollment records unchanged`;
//   };

//   const enrollmentStatuses = [...new Set(enrollments.map((enrollment) => enrollment.status).filter(Boolean))];

//   return (
//     <div className="animate-fade-in responsive-page admin-enrollments-page">
//       <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "1rem", marginBottom: "1.25rem" }}>
//         <h1 style={{ fontSize: "1.75rem", marginBottom: "0.4rem" }}>Active Student Enrollments</h1>
//         <p style={{ color: "var(--text-muted)", fontSize: "0.95rem" }}>
//           Track active learner licenses across free and subscription course catalogs. Excel imports compare rows with existing enrollments without creating licenses.
//         </p>
//         <AdminExcelToolbar
//           rows={enrollments.map((enrollment) => ({ _id: enrollment._id, studentName: enrollment.user?.name, studentEmail: enrollment.user?.email, courseName: enrollment.course?.courseName, enrolledAt: enrollment.enrolledAt, lessonsCompleted: enrollment.completedLessons?.length || 0, status: enrollment.status, paymentStatus: enrollment.payment?.status }))}
//           sheetName="Enrollments"
//           fileName="classstream-enrollments"
//           onImport={reviewImportedEnrollments}
//           onError={(error) => toast.error(error.formattedMessage || error.message || "Could not review enrollment workbook.")}
//         />
//       </div>

//       <div className="admin-list-toolbar">
//         <div className="input-with-icon" style={{ flex: "1 1 280px", minWidth: 0 }}>
//           <Search className="input-icon-left" size={17} />
//           <input className="form-control" type="search" aria-label="Search enrollments" placeholder="Search student or course..." value={searchQuery} onChange={(event) => setSearchQuery(event.target.value)} style={{ paddingLeft: "2.5rem" }} />
//         </div>
//         <select className="form-control" aria-label="Filter enrollments by status" value={statusFilter} onChange={(event) => setStatusFilter(event.target.value)} style={{ flex: "0 1 180px" }}>
//           <option value="all">All Statuses</option>
//           {enrollmentStatuses.map((status) => <option key={status} value={status}>{status}</option>)}
//         </select>
//       </div>

//       {loading ? (
//         <div className="skeleton" style={{ width: "100%", height: "260px", borderRadius: "var(--radius-lg)" }} />
//       ) : filteredEnrollments.length > 0 ? (
//         <div className="table-responsive">
//           <table className="table">
//             <thead>
//               <tr>
//                 <th>Student</th>
//                 <th>Course Name</th>
//                 <th>Enrolled Date</th>
//                 <th>Lessons Completed</th>
//                 <th>Status</th>
//               </tr>
//             </thead>
//             <tbody>
//               {filteredEnrollments.map((enr) => (
//                 <tr key={enr._id}>
//                   <td>
//                     <div style={{ fontWeight: 600 }}>{enr.user?.name || "Learner"}</div>
//                     <div style={{ fontSize: "0.75rem", color: "var(--text-muted)" }}>{enr.user?.email}</div>
//                   </td>
//                   <td style={{ fontWeight: 600 }}>{enr.course?.courseName || "Course Track"}</td>
//                   <td style={{ color: "var(--text-muted)", fontSize: "0.85rem" }}>
//                     {new Date(enr.enrolledAt).toLocaleString("en-IN", {
//                       day: "numeric",
//                       month: "short",
//                       year: "numeric",
//                       hour: "numeric",
//                       minute: "2-digit",
//                     })}
//                   </td>
//                   <td>
//                     <span className="badge badge-gray">
//                       {enr.completedLessons?.length || 0} lessons
//                     </span>
//                   </td>
//                   <td>
//                     <span className="badge badge-free">Active</span>
//                   </td>
//                 </tr>
//               ))}
//             </tbody>
//           </table>
//         </div>
//       ) : (
//         <div className="empty-state">
//           <h4>{enrollments.length ? "No Matching Enrollments" : "No Enrollments Recorded"}</h4>
//         </div>
//       )}
//     </div>
//   );
// };

// export default AdminEnrollmentsPage;

import React, { useState, useEffect } from "react";
import paymentService from "../../services/paymentService";
import AdminExcelToolbar from "../../components/common/AdminExcelToolbar";
import { useToast } from "../../context/ToastContext";
import { Search } from "lucide-react";

/* Responsive styles: table on desktop, cards on mobile (<= 768px) */
const responsiveCss = `
  .admin-enrollments-page .enrollment-cards { display: none; }

  @media (max-width: 768px) {
    .admin-enrollments-page .admin-enrollments-header {
      flex-direction: column !important;
      align-items: flex-start !important;
      gap: 0.75rem !important;
    }
    .admin-enrollments-page .admin-enrollments-header > div:last-child,
    .admin-enrollments-page .admin-enrollments-header .admin-excel-wrap {
      width: 100%;
    }

    .admin-enrollments-page .admin-list-toolbar { flex-wrap: wrap; }
    .admin-enrollments-page .admin-list-toolbar > * { flex: 1 1 100% !important; }

    /* Hide table, show cards */
    .admin-enrollments-page .enrollment-table-wrap { display: none !important; }
    .admin-enrollments-page .enrollment-cards {
      display: flex;
      flex-direction: column;
      gap: 0.85rem;
    }

    .enrollment-card {
      background: var(--surface, #fff);
      border: 1px solid var(--border);
      border-radius: var(--radius-lg);
      padding: 0.9rem;
      display: flex;
      flex-direction: column;
      gap: 0.8rem;
    }
    .enrollment-card-top {
      display: flex;
      justify-content: space-between;
      align-items: flex-start;
      gap: 0.75rem;
    }
    .enrollment-card-student { flex: 1; min-width: 0; }
    .enrollment-card-name {
      font-weight: 600;
      font-size: 1rem;
      line-height: 1.3;
      word-break: break-word;
    }
    .enrollment-card-email {
      font-size: 0.78rem;
      color: var(--text-muted);
      margin-top: 0.15rem;
      word-break: break-all;
    }
    .enrollment-card-meta {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 0.65rem 0.75rem;
      padding: 0.75rem;
      background: var(--bg-subtle);
      border-radius: var(--radius-md);
    }
    .enrollment-card-meta-full { grid-column: 1 / -1; }
    .enrollment-card-meta-label {
      font-size: 0.68rem;
      text-transform: uppercase;
      letter-spacing: 0.04em;
      color: var(--text-muted);
      margin-bottom: 0.2rem;
    }
    .enrollment-card-meta-value {
      font-size: 0.88rem;
      font-weight: 600;
      word-break: break-word;
    }
  }
`;

const formatEnrolled = (date) =>
  new Date(date).toLocaleString("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
    hour: "numeric",
    minute: "2-digit",
  });

export const AdminEnrollmentsPage = () => {
  const toast = useToast();
  const [enrollments, setEnrollments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");

  useEffect(() => {
    const fetchEnrollments = async () => {
      try {
        setLoading(true);
        const res = await paymentService.getAdminEnrollments();
        if (res?.enrollments) {
          setEnrollments(res.enrollments);
        }
      } catch (err) {
        console.warn("Could not load enrollments:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchEnrollments();
  }, []);

  const filteredEnrollments = enrollments.filter((enrollment) => {
    const matchesQuery = [
      enrollment.user?.name,
      enrollment.user?.email,
      enrollment.course?.courseName,
    ].some((value) => value?.toLowerCase().includes(searchQuery.trim().toLowerCase()));
    return matchesQuery && (statusFilter === "all" || enrollment.status === statusFilter);
  });

  const reviewImportedEnrollments = async (rows) => {
    const knownIds = new Set(enrollments.map((enrollment) => enrollment._id));
    const knownPairs = new Set(
      enrollments.map(
        (enrollment) =>
          `${enrollment.user?.email?.toLowerCase()}|${enrollment.course?.courseName?.toLowerCase()}`
      )
    );
    let matched = 0;
    let unknown = 0;
    for (const row of rows) {
      const id = String(row._id || row.enrollmentId || "").trim();
      const pair = `${String(row.studentEmail || row.email || "").toLowerCase()}|${String(
        row.courseName || row.course || ""
      ).toLowerCase()}`;
      if ((id && knownIds.has(id)) || knownPairs.has(pair)) matched += 1;
      else unknown += 1;
    }
    return `Review only: ${matched} matched, ${unknown} unknown; enrollment records unchanged`;
  };

  const enrollmentStatuses = [
    ...new Set(enrollments.map((enrollment) => enrollment.status).filter(Boolean)),
  ];

  return (
    <div className="animate-fade-in responsive-page admin-enrollments-page">
      <style>{responsiveCss}</style>

      <div
        className="admin-enrollments-header"
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          flexWrap: "wrap",
          gap: "1rem",
          marginBottom: "1.25rem",
        }}
      >
        <h1 style={{ fontSize: "1.75rem", marginBottom: "0.4rem" }}>Active Student Enrollments</h1>
        <p style={{ color: "var(--text-muted)", fontSize: "0.95rem" }}>
          Track active learner licenses across free and subscription course catalogs. Excel imports
          compare rows with existing enrollments without creating licenses.
        </p>
        <AdminExcelToolbar
          rows={enrollments.map((enrollment) => ({
            _id: enrollment._id,
            studentName: enrollment.user?.name,
            studentEmail: enrollment.user?.email,
            courseName: enrollment.course?.courseName,
            enrolledAt: enrollment.enrolledAt,
            lessonsCompleted: enrollment.completedLessons?.length || 0,
            status: enrollment.status,
            paymentStatus: enrollment.payment?.status,
          }))}
          sheetName="Enrollments"
          fileName="classstream-enrollments"
          onImport={reviewImportedEnrollments}
          onError={(error) =>
            toast.error(
              error.formattedMessage || error.message || "Could not review enrollment workbook."
            )
          }
        />
      </div>

      <div className="admin-list-toolbar">
        <div className="input-with-icon" style={{ flex: "1 1 280px", minWidth: 0 }}>
          <Search className="input-icon-left" size={17} />
          <input
            className="form-control"
            type="search"
            aria-label="Search enrollments"
            placeholder="Search student or course..."
            value={searchQuery}
            onChange={(event) => setSearchQuery(event.target.value)}
            style={{ paddingLeft: "2.5rem" }}
          />
        </div>
        <select
          className="form-control"
          aria-label="Filter enrollments by status"
          value={statusFilter}
          onChange={(event) => setStatusFilter(event.target.value)}
          style={{ flex: "0 1 180px" }}
        >
          <option value="all">All Statuses</option>
          {enrollmentStatuses.map((status) => (
            <option key={status} value={status}>
              {status}
            </option>
          ))}
        </select>
      </div>

      {loading ? (
        <div
          className="skeleton"
          style={{ width: "100%", height: "260px", borderRadius: "var(--radius-lg)" }}
        />
      ) : filteredEnrollments.length > 0 ? (
        <>
          {/* ===== Desktop: table ===== */}
          <div className="table-responsive enrollment-table-wrap">
            <table className="table">
              <thead>
                <tr>
                  <th>Student</th>
                  <th>Course Name</th>
                  <th>Enrolled Date</th>
                  <th>Lessons Completed</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {filteredEnrollments.map((enr) => (
                  <tr key={enr._id}>
                    <td>
                      <div style={{ fontWeight: 600 }}>{enr.user?.name || "Learner"}</div>
                      <div style={{ fontSize: "0.75rem", color: "var(--text-muted)" }}>
                        {enr.user?.email}
                      </div>
                    </td>
                    <td style={{ fontWeight: 600 }}>{enr.course?.courseName || "Course Track"}</td>
                    <td style={{ color: "var(--text-muted)", fontSize: "0.85rem" }}>
                      {formatEnrolled(enr.enrolledAt)}
                    </td>
                    <td>
                      <span className="badge badge-gray">
                        {enr.completedLessons?.length || 0} lessons
                      </span>
                    </td>
                    <td>
                      <span className="badge badge-free">Active</span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* ===== Mobile: cards ===== */}
          <div className="enrollment-cards">
            {filteredEnrollments.map((enr) => (
              <div className="enrollment-card" key={enr._id}>
                <div className="enrollment-card-top">
                  <div className="enrollment-card-student">
                    <div className="enrollment-card-name">{enr.user?.name || "Learner"}</div>
                    <div className="enrollment-card-email">{enr.user?.email}</div>
                  </div>
                  <span className="badge badge-free">Active</span>
                </div>

                <div className="enrollment-card-meta">
                  <div className="enrollment-card-meta-full">
                    <div className="enrollment-card-meta-label">Course Name</div>
                    <div className="enrollment-card-meta-value">
                      {enr.course?.courseName || "Course Track"}
                    </div>
                  </div>
                  <div>
                    <div className="enrollment-card-meta-label">Lessons Completed</div>
                    <div className="enrollment-card-meta-value">
                      <span className="badge badge-gray">
                        {enr.completedLessons?.length || 0} lessons
                      </span>
                    </div>
                  </div>
                  <div>
                    <div className="enrollment-card-meta-label">Enrolled</div>
                    <div className="enrollment-card-meta-value">
                      {formatEnrolled(enr.enrolledAt)}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </>
      ) : (
        <div className="empty-state">
          <h4>{enrollments.length ? "No Matching Enrollments" : "No Enrollments Recorded"}</h4>
        </div>
      )}
    </div>
  );
};

export default AdminEnrollmentsPage;