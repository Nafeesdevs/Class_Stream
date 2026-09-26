import React, { useState, useEffect } from "react";
import paymentService from "../../services/paymentService";
import { CreditCard, CheckCircle2, Clock, AlertCircle } from "lucide-react";
import EmptyState from "../../components/common/EmptyState";

export const PaymentHistoryPage = () => {
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPayments = async () => {
      try {
        setLoading(true);
        const res = await paymentService.getMyPayments();
        if (res?.payments) {
          setPayments(res.payments);
        }
      } catch (err) {
        console.warn("Could not load payments:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchPayments();
  }, []);

  return (
    <div className="animate-fade-in">
      <div style={{ marginBottom: "2rem" }}>
        <h1 style={{ fontSize: "1.75rem", marginBottom: "0.5rem" }}>Payment History & Receipts</h1>
        <p style={{ color: "var(--text-muted)", fontSize: "0.95rem" }}>
          Review all your verified course enrollment transactions processed via Razorpay.
        </p>
      </div>

      {loading ? (
        <div className="skeleton" style={{ width: "100%", height: "240px", borderRadius: "var(--radius-lg)" }} />
      ) : payments.length > 0 ? (
        <div className="table-responsive">
          <table className="table">
            <thead>
              <tr>
                <th>Order ID</th>
                <th>Course</th>
                <th>Payment ID</th>
                <th>Amount</th>
                <th>Date</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {payments.map((p) => (
                <tr key={p._id}>
                  <td style={{ fontFamily: "monospace", fontSize: "0.85rem", color: "var(--text-muted)" }}>
                    {p.razorpayOrderId}
                  </td>
                  <td style={{ fontWeight: 600 }}>
                    {p.course?.courseName || "Educational Track"}
                  </td>
                  <td style={{ fontFamily: "monospace", fontSize: "0.85rem", color: "var(--text-muted)" }}>
                    {p.razorpayPaymentId || "—"}
                  </td>
                  <td style={{ fontWeight: 700, color: "var(--text-main)" }}>
                    ₹{p.amount} {p.currency}
                  </td>
                  <td style={{ color: "var(--text-muted)", fontSize: "0.85rem" }}>
                    {new Date(p.createdAt).toLocaleDateString("en-IN", {
                      day: "numeric",
                      month: "short",
                      year: "numeric",
                    })}
                  </td>
                  <td>
                    <span
                      className={`badge ${
                        p.status === "captured" || p.status === "paid"
                          ? "badge-free"
                          : "badge-trial"
                      }`}
                    >
                      {p.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <EmptyState
          icon={CreditCard}
          title="No Payment Records Found"
          description="You have not made any purchases yet. Enrolled free courses will not appear in transaction receipts."
          actionText="Explore Premium Courses"
          onAction={() => (window.location.href = "/courses")}
        />
      )}
    </div>
  );
};

export default PaymentHistoryPage;
