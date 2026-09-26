import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import paymentService from "../../services/paymentService";
import {
  DollarSign,
  Users,
  BookOpen,
  FolderTree,
  UserCheck,
  Plus,
  ArrowRight,
  ShieldCheck,
} from "lucide-react";

export const AdminOverviewPage = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        setLoading(true);
        const res = await paymentService.getAdminStats();
        if (res?.stats) {
          setStats(res.stats);
        }
      } catch (err) {
        console.warn("Could not load admin stats:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, []);

  return (
    <div className="animate-fade-in">
      {/* Top Header */}
      <div style={{ display: "flex", flexWrap: "wrap", justifyContent: "space-between", alignItems: "center", gap: "1rem", marginBottom: "2rem" }}>
        <div>
          <h1 style={{ fontSize: "1.75rem", marginBottom: "0.4rem" }}>Executive Dashboard</h1>
          <p style={{ color: "var(--text-muted)", fontSize: "0.95rem" }}>
            Real-time platform metrics, enrollment health, and payment analytics.
          </p>
        </div>

        <div style={{ display: "flex", gap: "0.75rem" }}>
          <Link to="/admin/courses?action=new" className="btn btn-primary btn-sm">
            <Plus size={16} /> New Course
          </Link>
          <Link to="/admin/categories" className="btn btn-outline btn-sm">
            <Plus size={16} /> New Category
          </Link>
        </div>
      </div>

      {/* Metric Cards Grid */}
      <div className="grid-4" style={{ marginBottom: "2.5rem" }}>
        <div className="card" style={{ padding: "1.5rem" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "0.75rem", marginBottom: "0.75rem" }}>
            <div
              style={{
                width: "40px",
                height: "40px",
                borderRadius: "var(--radius-md)",
                background: "var(--success-bg)",
                color: "var(--success)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <DollarSign size={22} />
            </div>
            <span style={{ fontSize: "0.85rem", color: "var(--text-muted)", fontWeight: 600 }}>
              Total Revenue
            </span>
          </div>
          <div style={{ fontSize: "1.85rem", fontWeight: 800, fontFamily: "var(--font-heading)" }}>
            ₹{stats?.totalRevenue?.toLocaleString("en-IN") || 0}
          </div>
        </div>

        <div className="card" style={{ padding: "1.5rem" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "0.75rem", marginBottom: "0.75rem" }}>
            <div
              style={{
                width: "40px",
                height: "40px",
                borderRadius: "var(--radius-md)",
                background: "var(--primary-light)",
                color: "var(--primary)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <Users size={22} />
            </div>
            <span style={{ fontSize: "0.85rem", color: "var(--text-muted)", fontWeight: 600 }}>
              Total Registered
            </span>
          </div>
          <div style={{ fontSize: "1.85rem", fontWeight: 800, fontFamily: "var(--font-heading)" }}>
            {stats?.totalUsers || 0}
          </div>
        </div>

        <div className="card" style={{ padding: "1.5rem" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "0.75rem", marginBottom: "0.75rem" }}>
            <div
              style={{
                width: "40px",
                height: "40px",
                borderRadius: "var(--radius-md)",
                background: "var(--secondary-light)",
                color: "var(--secondary)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <BookOpen size={22} />
            </div>
            <span style={{ fontSize: "0.85rem", color: "var(--text-muted)", fontWeight: 600 }}>
              Published Courses
            </span>
          </div>
          <div style={{ fontSize: "1.85rem", fontWeight: 800, fontFamily: "var(--font-heading)" }}>
            {stats?.totalCourses || 0}
          </div>
        </div>

        <div className="card" style={{ padding: "1.5rem" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "0.75rem", marginBottom: "0.75rem" }}>
            <div
              style={{
                width: "40px",
                height: "40px",
                borderRadius: "var(--radius-md)",
                background: "var(--warning-bg)",
                color: "var(--warning)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <UserCheck size={22} />
            </div>
            <span style={{ fontSize: "0.85rem", color: "var(--text-muted)", fontWeight: 600 }}>
              Active Enrollments
            </span>
          </div>
          <div style={{ fontSize: "1.85rem", fontWeight: 800, fontFamily: "var(--font-heading)" }}>
            {stats?.totalEnrollments || 0}
          </div>
        </div>
      </div>

      {/* Recent Platform Payments */}
      <div className="card" style={{ padding: "1.5rem" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1.25rem" }}>
          <h3 style={{ fontSize: "1.2rem" }}>Recent Verified Transactions</h3>
          <Link to="/admin/payments" style={{ fontSize: "0.85rem", fontWeight: 600 }}>
            View All Payments
          </Link>
        </div>

        {stats?.recentPayments && stats.recentPayments.length > 0 ? (
          <div className="table-responsive">
            <table className="table">
              <thead>
                <tr>
                  <th>Order ID</th>
                  <th>Student</th>
                  <th>Course</th>
                  <th>Amount</th>
                  <th>Date</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {stats.recentPayments.map((p) => (
                  <tr key={p._id}>
                    <td style={{ fontFamily: "monospace", fontSize: "0.85rem" }}>{p.razorpayOrderId}</td>
                    <td>{p.user?.name || "Student"}</td>
                    <td style={{ fontWeight: 600 }}>{p.course?.courseName || "Course Track"}</td>
                    <td style={{ fontWeight: 700 }}>₹{p.amount}</td>
                    <td style={{ color: "var(--text-muted)", fontSize: "0.85rem" }}>
                      {new Date(p.createdAt).toLocaleDateString("en-IN")}
                    </td>
                    <td>
                      <span className="badge badge-free">{p.status}</span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div style={{ padding: "2rem", textAlign: "center", color: "var(--text-muted)" }}>
            No transaction records currently registered.
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminOverviewPage;
