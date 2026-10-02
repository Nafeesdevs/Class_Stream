import React, { useState, useEffect } from "react";
import paymentService from "../../services/paymentService";
import { CreditCard, Search } from "lucide-react";
import EmptyState from "../../components/common/EmptyState";

export const PaymentHistoryPage = () => {
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");

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

  const filteredPayments = payments.filter((payment) => {
    const query = searchQuery.trim().toLowerCase();
    const matchesSearch = !query || [
      payment.razorpayOrderId,
      payment.razorpayPaymentId,
      payment.course?.courseName,
    ].some((value) => value?.toLowerCase().includes(query));
    return matchesSearch && (statusFilter === "all" || payment.status === statusFilter);
  });
  const paymentStatuses = [...new Set(payments.map((payment) => payment.status).filter(Boolean))];

  return (
    <div className="animate-fade-in responsive-page payment-history-page">
      <div style={{ marginBottom: "2rem" }}>
        <h1 style={{ fontSize: "1.75rem", marginBottom: "0.5rem" }}>Payment History & Receipts</h1>
        <p style={{ color: "var(--text-muted)", fontSize: "0.95rem" }}>
          Review all your verified course enrollment transactions processed via Razorpay.
        </p>
      </div>

      {!loading && payments.length > 0 && (
        <div className="admin-list-toolbar" style={{ marginBottom: "1.25rem" }}>
          <div className="input-with-icon" style={{ flex: "1 1 280px", minWidth: 0 }}>
            <Search className="input-icon-left" size={17} />
            <input
              className="form-control"
              type="search"
              aria-label="Search payment history"
              placeholder="Search order, payment, or course..."
              value={searchQuery}
              onChange={(event) => setSearchQuery(event.target.value)}
              style={{ paddingLeft: "2.5rem" }}
            />
          </div>
          <select
            className="form-control"
            aria-label="Filter payment history by status"
            value={statusFilter}
            onChange={(event) => setStatusFilter(event.target.value)}
            style={{ flex: "0 1 180px" }}
          >
            <option value="all">All Statuses</option>
            {paymentStatuses.map((status) => <option key={status} value={status}>{status}</option>)}
          </select>
        </div>
      )}

      {loading ? (
        <div className="skeleton" style={{ width: "100%", height: "240px", borderRadius: "var(--radius-lg)" }} />
      ) : filteredPayments.length > 0 ? (
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
              {filteredPayments.map((p) => (
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
                    {new Date(p.createdAt).toLocaleString("en-IN", {
                      day: "numeric",
                      month: "short",
                      year: "numeric",
                      hour: "numeric",
                      minute: "2-digit",
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
      ) : payments.length > 0 ? (
        <div className="empty-state">
          <h4>No Matching Payments</h4>
          <p>Try changing the search or status filter.</p>
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
