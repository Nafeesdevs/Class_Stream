import React, { useState, useEffect } from "react";
import paymentService from "../../services/paymentService";
import { CreditCard, CheckCircle2, Search } from "lucide-react";

export const AdminPaymentsPage = () => {
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAllPayments = async () => {
      try {
        setLoading(true);
        const res = await paymentService.getAdminPayments();
        if (res?.payments) {
          setPayments(res.payments);
        }
      } catch (err) {
        console.warn("Could not load admin payments:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchAllPayments();
  }, []);

  return (
    <div className="animate-fade-in">
      <div style={{ marginBottom: "2rem" }}>
        <h1 style={{ fontSize: "1.75rem", marginBottom: "0.4rem" }}>Platform Payments & Receipts</h1>
        <p style={{ color: "var(--text-muted)", fontSize: "0.95rem" }}>
          Razorpay payment transactions verified by server HMAC cryptograms.
        </p>
      </div>

      {loading ? (
        <div className="skeleton" style={{ width: "100%", height: "260px", borderRadius: "var(--radius-lg)" }} />
      ) : payments.length > 0 ? (
        <div className="table-responsive">
          <table className="table">
            <thead>
              <tr>
                <th>Order ID</th>
                <th>Payment ID</th>
                <th>Student</th>
                <th>Course Track</th>
                <th>Amount</th>
                <th>Timestamp</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {payments.map((p) => (
                <tr key={p._id}>
                  <td style={{ fontFamily: "monospace", fontSize: "0.85rem" }}>{p.razorpayOrderId}</td>
                  <td style={{ fontFamily: "monospace", fontSize: "0.85rem" }}>{p.razorpayPaymentId || "—"}</td>
                  <td>
                    <div style={{ fontWeight: 600 }}>{p.user?.name || "Student"}</div>
                    <div style={{ fontSize: "0.75rem", color: "var(--text-muted)" }}>{p.user?.email}</div>
                  </td>
                  <td>{p.course?.courseName || "Course Track"}</td>
                  <td style={{ fontWeight: 700 }}>₹{p.amount} {p.currency}</td>
                  <td style={{ color: "var(--text-muted)", fontSize: "0.85rem" }}>
                    {new Date(p.createdAt).toLocaleString("en-IN")}
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
        <div className="empty-state">
          <h4>No Transactions Recorded</h4>
          <p>Verified student transactions will appear here automatically.</p>
        </div>
      )}
    </div>
  );
};

export default AdminPaymentsPage;
