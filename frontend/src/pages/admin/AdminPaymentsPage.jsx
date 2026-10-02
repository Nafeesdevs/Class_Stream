import React, { useState, useEffect } from "react";
import paymentService from "../../services/paymentService";
import AdminExcelToolbar from "../../components/common/AdminExcelToolbar";
import { useToast } from "../../context/ToastContext";
import { Search } from "lucide-react";

export const AdminPaymentsPage = () => {
  const toast = useToast();
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");

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

  const filteredPayments = payments.filter((payment) => {
    const matchesQuery = [payment.razorpayOrderId, payment.razorpayPaymentId, payment.user?.name, payment.user?.email, payment.course?.courseName]
      .some((value) => value?.toLowerCase().includes(searchQuery.trim().toLowerCase()));
    return matchesQuery && (statusFilter === "all" || payment.status === statusFilter);
  });

  const reviewImportedPayments = async (rows) => {
    const knownOrders = new Map(payments.map((payment) => [payment.razorpayOrderId, payment]));
    let matched = 0;
    let unknown = 0;
    let mismatched = 0;
    for (const row of rows) {
      const orderId = String(row.razorpayOrderId || row["Order ID"] || "").trim();
      const existing = knownOrders.get(orderId);
      if (!existing) {
        unknown += 1;
        continue;
      }
      matched += 1;
      const amount = Number(row.amount ?? row.Amount);
      if ((Number.isFinite(amount) && amount !== Number(existing.amount)) || (row.status && String(row.status).toLowerCase() !== existing.status)) mismatched += 1;
    }
    return `Review only: ${matched} matched, ${unknown} unknown, ${mismatched} mismatches; verified records unchanged`;
  };

  const paymentStatuses = [...new Set(payments.map((payment) => payment.status).filter(Boolean))];

  return (
    <div className="animate-fade-in responsive-page admin-payments-page">
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "1rem", marginBottom: "1.25rem" }}>
        <h1 style={{ fontSize: "1.75rem", marginBottom: "0.4rem" }}>Platform Payments & Receipts</h1>
        <p style={{ color: "var(--text-muted)", fontSize: "0.95rem" }}>
          Razorpay payment transactions verified by server HMAC cryptograms. Excel imports are reconciliation previews and do not change verified records.
        </p>
        <AdminExcelToolbar
          rows={payments.map((payment) => ({ _id: payment._id, razorpayOrderId: payment.razorpayOrderId, razorpayPaymentId: payment.razorpayPaymentId, studentName: payment.user?.name, studentEmail: payment.user?.email, courseName: payment.course?.courseName, amount: payment.amount, currency: payment.currency, status: payment.status, createdAt: payment.createdAt }))}
          sheetName="Payments"
          fileName="classstream-payments"
          onImport={reviewImportedPayments}
          onError={(error) => toast.error(error.formattedMessage || error.message || "Could not review payment workbook.")}
        />
      </div>

      <div className="admin-list-toolbar">
        <div className="input-with-icon" style={{ flex: "1 1 280px", minWidth: 0 }}>
          <Search className="input-icon-left" size={17} />
          <input className="form-control" type="search" aria-label="Search payments" placeholder="Search order, payment, student, or course..." value={searchQuery} onChange={(event) => setSearchQuery(event.target.value)} style={{ paddingLeft: "2.5rem" }} />
        </div>
        <select className="form-control" aria-label="Filter payments by status" value={statusFilter} onChange={(event) => setStatusFilter(event.target.value)} style={{ flex: "0 1 180px" }}>
          <option value="all">All Statuses</option>
          {paymentStatuses.map((status) => <option key={status} value={status}>{status}</option>)}
        </select>
      </div>

      {loading ? (
        <div className="skeleton" style={{ width: "100%", height: "260px", borderRadius: "var(--radius-lg)" }} />
      ) : filteredPayments.length > 0 ? (
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
              {filteredPayments.map((p) => (
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
          <h4>{payments.length ? "No Matching Payments" : "No Transactions Recorded"}</h4>
          <p>{payments.length ? "Change the search or status filter." : "Verified student transactions will appear here automatically."}</p>
        </div>
      )}
    </div>
  );
};

export default AdminPaymentsPage;
