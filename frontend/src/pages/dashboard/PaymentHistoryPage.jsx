// import React, { useState, useEffect } from "react";
// import paymentService from "../../services/paymentService";
// import { CreditCard, Search } from "lucide-react";
// import EmptyState from "../../components/common/EmptyState";

// export const PaymentHistoryPage = () => {
//   const [payments, setPayments] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [searchQuery, setSearchQuery] = useState("");
//   const [statusFilter, setStatusFilter] = useState("all");

//   useEffect(() => {
//     const fetchPayments = async () => {
//       try {
//         setLoading(true);
//         const res = await paymentService.getMyPayments();
//         if (res?.payments) {
//           setPayments(res.payments);
//         }
//       } catch (err) {
//         console.warn("Could not load payments:", err);
//       } finally {
//         setLoading(false);
//       }
//     };
//     fetchPayments();
//   }, []);

//   const filteredPayments = payments.filter((payment) => {
//     const query = searchQuery.trim().toLowerCase();
//     const matchesSearch = !query || [
//       payment.razorpayOrderId,
//       payment.razorpayPaymentId,
//       payment.course?.courseName,
//     ].some((value) => value?.toLowerCase().includes(query));
//     return matchesSearch && (statusFilter === "all" || payment.status === statusFilter);
//   });
//   const paymentStatuses = [...new Set(payments.map((payment) => payment.status).filter(Boolean))];

//   return (
//     <div className="animate-fade-in responsive-page payment-history-page">
//       <div style={{ marginBottom: "2rem" }}>
//         <h1 style={{ fontSize: "1.75rem", marginBottom: "0.5rem" }}>Payment History & Receipts</h1>
//         <p style={{ color: "var(--text-muted)", fontSize: "0.95rem" }}>
//           Review all your verified course enrollment transactions processed via Razorpay.
//         </p>
//       </div>

//       {!loading && payments.length > 0 && (
//         <div className="admin-list-toolbar" style={{ marginBottom: "1.25rem" }}>
//           <div className="input-with-icon" style={{ flex: "1 1 280px", minWidth: 0 }}>
//             <Search className="input-icon-left" size={17} />
//             <input
//               className="form-control"
//               type="search"
//               aria-label="Search payment history"
//               placeholder="Search order, payment, or course..."
//               value={searchQuery}
//               onChange={(event) => setSearchQuery(event.target.value)}
//               style={{ paddingLeft: "2.5rem" }}
//             />
//           </div>
//           <select
//             className="form-control"
//             aria-label="Filter payment history by status"
//             value={statusFilter}
//             onChange={(event) => setStatusFilter(event.target.value)}
//             style={{ flex: "0 1 180px" }}
//           >
//             <option value="all">All Statuses</option>
//             {paymentStatuses.map((status) => <option key={status} value={status}>{status}</option>)}
//           </select>
//         </div>
//       )}

//       {loading ? (
//         <div className="skeleton" style={{ width: "100%", height: "240px", borderRadius: "var(--radius-lg)" }} />
//       ) : filteredPayments.length > 0 ? (
//         <div className="table-responsive">
//           <table className="table">
//             <thead>
//               <tr>
//                 <th>Order ID</th>
//                 <th>Course</th>
//                 <th>Payment ID</th>
//                 <th>Amount</th>
//                 <th>Date</th>
//                 <th>Status</th>
//               </tr>
//             </thead>
//             <tbody>
//               {filteredPayments.map((p) => (
//                 <tr key={p._id}>
//                   <td style={{ fontFamily: "monospace", fontSize: "0.85rem", color: "var(--text-muted)" }}>
//                     {p.razorpayOrderId}
//                   </td>
//                   <td style={{ fontWeight: 600 }}>
//                     {p.course?.courseName || "Educational Track"}
//                   </td>
//                   <td style={{ fontFamily: "monospace", fontSize: "0.85rem", color: "var(--text-muted)" }}>
//                     {p.razorpayPaymentId || "—"}
//                   </td>
//                   <td style={{ fontWeight: 700, color: "var(--text-main)" }}>
//                     ₹{p.amount} {p.currency}
//                   </td>
//                   <td style={{ color: "var(--text-muted)", fontSize: "0.85rem" }}>
//                     {new Date(p.createdAt).toLocaleString("en-IN", {
//                       day: "numeric",
//                       month: "short",
//                       year: "numeric",
//                       hour: "numeric",
//                       minute: "2-digit",
//                     })}
//                   </td>
//                   <td>
//                     <span
//                       className={`badge ${
//                         p.status === "captured" || p.status === "paid"
//                           ? "badge-free"
//                           : "badge-trial"
//                       }`}
//                     >
//                       {p.status}
//                     </span>
//                   </td>
//                 </tr>
//               ))}
//             </tbody>
//           </table>
//         </div>
//       ) : payments.length > 0 ? (
//         <div className="empty-state">
//           <h4>No Matching Payments</h4>
//           <p>Try changing the search or status filter.</p>
//         </div>
//       ) : (
//         <EmptyState
//           icon={CreditCard}
//           title="No Payment Records Found"
//           description="You have not made any purchases yet. Enrolled free courses will not appear in transaction receipts."
//           actionText="Explore Premium Courses"
//           onAction={() => (window.location.href = "/courses")}
//         />
//       )}
//     </div>
//   );
// };

// export default PaymentHistoryPage;

import React, { useState, useEffect } from "react";
import paymentService from "../../services/paymentService";
import { CreditCard, Search } from "lucide-react";
import EmptyState from "../../components/common/EmptyState";

/* Responsive styles: table on desktop, cards on mobile (<= 768px) */
const responsiveCss = `
  .payment-history-page .history-cards { display: none; }

  @media (max-width: 768px) {
    .payment-history-page .admin-list-toolbar { flex-wrap: wrap; }
    .payment-history-page .admin-list-toolbar > * { flex: 1 1 100% !important; }

    /* Hide table, show cards */
    .payment-history-page .history-table-wrap { display: none !important; }
    .payment-history-page .history-cards {
      display: flex;
      flex-direction: column;
      gap: 0.85rem;
    }

    .history-card {
      background: var(--surface, #fff);
      border: 1px solid var(--border);
      border-radius: var(--radius-lg);
      padding: 0.9rem;
      display: flex;
      flex-direction: column;
      gap: 0.8rem;
    }
    .history-card-top {
      display: flex;
      justify-content: space-between;
      align-items: flex-start;
      gap: 0.75rem;
    }
    .history-card-course {
      flex: 1;
      min-width: 0;
      font-weight: 600;
      font-size: 1rem;
      line-height: 1.3;
      word-break: break-word;
    }
    .history-card-amount-wrap {
      display: flex;
      flex-direction: column;
      align-items: flex-end;
      gap: 0.35rem;
      flex-shrink: 0;
    }
    .history-card-amount {
      font-weight: 700;
      font-size: 1.15rem;
      color: var(--text-main);
    }
    .history-card-meta {
      display: grid;
      grid-template-columns: 1fr;
      gap: 0.65rem;
      padding: 0.75rem;
      background: var(--bg-subtle);
      border-radius: var(--radius-md);
    }
    .history-card-meta-label {
      font-size: 0.68rem;
      text-transform: uppercase;
      letter-spacing: 0.04em;
      color: var(--text-muted);
      margin-bottom: 0.2rem;
    }
    .history-card-meta-value {
      font-size: 0.88rem;
      font-weight: 600;
      word-break: break-word;
    }
    .history-card-meta-value.mono {
      font-family: monospace;
      font-size: 0.8rem;
      font-weight: 500;
      color: var(--text-muted);
      word-break: break-all;
    }
  }
`;

const formatDate = (date) =>
  new Date(date).toLocaleString("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
    hour: "numeric",
    minute: "2-digit",
  });

const statusBadgeClass = (status) =>
  status === "captured" || status === "paid" ? "badge-free" : "badge-trial";

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
    const matchesSearch =
      !query ||
      [payment.razorpayOrderId, payment.razorpayPaymentId, payment.course?.courseName].some(
        (value) => value?.toLowerCase().includes(query)
      );
    return matchesSearch && (statusFilter === "all" || payment.status === statusFilter);
  });
  const paymentStatuses = [...new Set(payments.map((payment) => payment.status).filter(Boolean))];

  return (
    <div className="animate-fade-in responsive-page payment-history-page">
      <style>{responsiveCss}</style>

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
            {paymentStatuses.map((status) => (
              <option key={status} value={status}>
                {status}
              </option>
            ))}
          </select>
        </div>
      )}

      {loading ? (
        <div
          className="skeleton"
          style={{ width: "100%", height: "240px", borderRadius: "var(--radius-lg)" }}
        />
      ) : filteredPayments.length > 0 ? (
        <>
          {/* ===== Desktop: table ===== */}
          <div className="table-responsive history-table-wrap">
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
                    <td
                      style={{
                        fontFamily: "monospace",
                        fontSize: "0.85rem",
                        color: "var(--text-muted)",
                      }}
                    >
                      {p.razorpayOrderId}
                    </td>
                    <td style={{ fontWeight: 600 }}>
                      {p.course?.courseName || "Educational Track"}
                    </td>
                    <td
                      style={{
                        fontFamily: "monospace",
                        fontSize: "0.85rem",
                        color: "var(--text-muted)",
                      }}
                    >
                      {p.razorpayPaymentId || "—"}
                    </td>
                    <td style={{ fontWeight: 700, color: "var(--text-main)" }}>
                      ₹{p.amount} {p.currency}
                    </td>
                    <td style={{ color: "var(--text-muted)", fontSize: "0.85rem" }}>
                      {formatDate(p.createdAt)}
                    </td>
                    <td>
                      <span className={`badge ${statusBadgeClass(p.status)}`}>{p.status}</span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* ===== Mobile: cards ===== */}
          <div className="history-cards">
            {filteredPayments.map((p) => (
              <div className="history-card" key={p._id}>
                <div className="history-card-top">
                  <div className="history-card-course">
                    {p.course?.courseName || "Educational Track"}
                  </div>
                  <div className="history-card-amount-wrap">
                    <div className="history-card-amount">
                      ₹{p.amount} {p.currency}
                    </div>
                    <span className={`badge ${statusBadgeClass(p.status)}`}>{p.status}</span>
                  </div>
                </div>

                <div className="history-card-meta">
                  <div>
                    <div className="history-card-meta-label">Date</div>
                    <div className="history-card-meta-value">{formatDate(p.createdAt)}</div>
                  </div>
                  <div>
                    <div className="history-card-meta-label">Order ID</div>
                    <div className="history-card-meta-value mono">{p.razorpayOrderId}</div>
                  </div>
                  <div>
                    <div className="history-card-meta-label">Payment ID</div>
                    <div className="history-card-meta-value mono">
                      {p.razorpayPaymentId || "—"}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </>
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