import React, { useState, useEffect } from "react";
import paymentService from "../../services/paymentService";
import { UserCheck, BookOpen } from "lucide-react";

export const AdminEnrollmentsPage = () => {
  const [enrollments, setEnrollments] = useState([]);
  const [loading, setLoading] = useState(true);

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

  return (
    <div className="animate-fade-in">
      <div style={{ marginBottom: "2rem" }}>
        <h1 style={{ fontSize: "1.75rem", marginBottom: "0.4rem" }}>Active Student Enrollments</h1>
        <p style={{ color: "var(--text-muted)", fontSize: "0.95rem" }}>
          Track active learner licenses across free and subscription course catalogs.
        </p>
      </div>

      {loading ? (
        <div className="skeleton" style={{ width: "100%", height: "260px", borderRadius: "var(--radius-lg)" }} />
      ) : enrollments.length > 0 ? (
        <div className="table-responsive">
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
              {enrollments.map((enr) => (
                <tr key={enr._id}>
                  <td>
                    <div style={{ fontWeight: 600 }}>{enr.user?.name || "Learner"}</div>
                    <div style={{ fontSize: "0.75rem", color: "var(--text-muted)" }}>{enr.user?.email}</div>
                  </td>
                  <td style={{ fontWeight: 600 }}>{enr.course?.courseName || "Course Track"}</td>
                  <td style={{ color: "var(--text-muted)", fontSize: "0.85rem" }}>
                    {new Date(enr.enrolledAt).toLocaleDateString("en-IN")}
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
      ) : (
        <div className="empty-state">
          <h4>No Enrollments Recorded</h4>
        </div>
      )}
    </div>
  );
};

export default AdminEnrollmentsPage;
