// import React, { useState, useEffect } from "react";
// import paymentService from "../../services/paymentService";
// import AdminExcelToolbar from "../../components/common/AdminExcelToolbar";
// import { useToast } from "../../context/ToastContext";
// import { Search } from "lucide-react";

// export const AdminPaymentsPage = () => {
//   const toast = useToast();
//   const [payments, setPayments] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [searchQuery, setSearchQuery] = useState("");
//   const [statusFilter, setStatusFilter] = useState("all");

//   useEffect(() => {
//     const fetchAllPayments = async () => {
//       try {
//         setLoading(true);
//         const res = await paymentService.getAdminPayments();
//         if (res?.payments) {
//           setPayments(res.payments);
//         }
//       } catch (err) {
//         console.warn("Could not load admin payments:", err);
//       } finally {
//         setLoading(false);
//       }
//     };
//     fetchAllPayments();
//   }, []);

//   const filteredPayments = payments.filter((payment) => {
//     const matchesQuery = [payment.razorpayOrderId, payment.razorpayPaymentId, payment.user?.name, payment.user?.email, payment.course?.courseName]
//       .some((value) => value?.toLowerCase().includes(searchQuery.trim().toLowerCase()));
//     return matchesQuery && (statusFilter === "all" || payment.status === statusFilter);
//   });

//   const reviewImportedPayments = async (rows) => {
//     const knownOrders = new Map(payments.map((payment) => [payment.razorpayOrderId, payment]));
//     let matched = 0;
//     let unknown = 0;
//     let mismatched = 0;
//     for (const row of rows) {
//       const orderId = String(row.razorpayOrderId || row["Order ID"] || "").trim();
//       const existing = knownOrders.get(orderId);
//       if (!existing) {
//         unknown += 1;
//         continue;
//       }
//       matched += 1;
//       const amount = Number(row.amount ?? row.Amount);
//       if ((Number.isFinite(amount) && amount !== Number(existing.amount)) || (row.status && String(row.status).toLowerCase() !== existing.status)) mismatched += 1;
//     }
//     return `Review only: ${matched} matched, ${unknown} unknown, ${mismatched} mismatches; verified records unchanged`;
//   };

//   const paymentStatuses = [...new Set(payments.map((payment) => payment.status).filter(Boolean))];

//   return (
//     <div className="animate-fade-in responsive-page admin-payments-page">
//       <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "1rem", marginBottom: "1.25rem" }}>
//         <h1 style={{ fontSize: "1.75rem", marginBottom: "0.4rem" }}>Platform Payments & Receipts</h1>
//         <p style={{ color: "var(--text-muted)", fontSize: "0.95rem" }}>
//           Razorpay payment transactions verified by server HMAC cryptograms. Excel imports are reconciliation previews and do not change verified records.
//         </p>
//         <AdminExcelToolbar
//           rows={payments.map((payment) => ({ _id: payment._id, razorpayOrderId: payment.razorpayOrderId, razorpayPaymentId: payment.razorpayPaymentId, studentName: payment.user?.name, studentEmail: payment.user?.email, courseName: payment.course?.courseName, amount: payment.amount, currency: payment.currency, status: payment.status, createdAt: payment.createdAt }))}
//           sheetName="Payments"
//           fileName="classstream-payments"
//           onImport={reviewImportedPayments}
//           onError={(error) => toast.error(error.formattedMessage || error.message || "Could not review payment workbook.")}
//         />
//       </div>

//       <div className="admin-list-toolbar">
//         <div className="input-with-icon" style={{ flex: "1 1 280px", minWidth: 0 }}>
//           <Search className="input-icon-left" size={17} />
//           <input className="form-control" type="search" aria-label="Search payments" placeholder="Search order, payment, student, or course..." value={searchQuery} onChange={(event) => setSearchQuery(event.target.value)} style={{ paddingLeft: "2.5rem" }} />
//         </div>
//         <select className="form-control" aria-label="Filter payments by status" value={statusFilter} onChange={(event) => setStatusFilter(event.target.value)} style={{ flex: "0 1 180px" }}>
//           <option value="all">All Statuses</option>
//           {paymentStatuses.map((status) => <option key={status} value={status}>{status}</option>)}
//         </select>
//       </div>

//       {loading ? (
//         <div className="skeleton" style={{ width: "100%", height: "260px", borderRadius: "var(--radius-lg)" }} />
//       ) : filteredPayments.length > 0 ? (
//         <div className="table-responsive">
//           <table className="table">
//             <thead>
//               <tr>
//                 <th>Order ID</th>
//                 <th>Payment ID</th>
//                 <th>Student</th>
//                 <th>Course Track</th>
//                 <th>Amount</th>
//                 <th>Timestamp</th>
//                 <th>Status</th>
//               </tr>
//             </thead>
//             <tbody>
//               {filteredPayments.map((p) => (
//                 <tr key={p._id}>
//                   <td style={{ fontFamily: "monospace", fontSize: "0.85rem" }}>{p.razorpayOrderId}</td>
//                   <td style={{ fontFamily: "monospace", fontSize: "0.85rem" }}>{p.razorpayPaymentId || "—"}</td>
//                   <td>
//                     <div style={{ fontWeight: 600 }}>{p.user?.name || "Student"}</div>
//                     <div style={{ fontSize: "0.75rem", color: "var(--text-muted)" }}>{p.user?.email}</div>
//                   </td>
//                   <td>{p.course?.courseName || "Course Track"}</td>
//                   <td style={{ fontWeight: 700 }}>₹{p.amount} {p.currency}</td>
//                   <td style={{ color: "var(--text-muted)", fontSize: "0.85rem" }}>
//                     {new Date(p.createdAt).toLocaleString("en-IN")}
//                   </td>
//                   <td>
//                     <span className="badge badge-free">{p.status}</span>
//                   </td>
//                 </tr>
//               ))}
//             </tbody>
//           </table>
//         </div>
//       ) : (
//         <div className="empty-state">
//           <h4>{payments.length ? "No Matching Payments" : "No Transactions Recorded"}</h4>
//           <p>{payments.length ? "Change the search or status filter." : "Verified student transactions will appear here automatically."}</p>
//         </div>
//       )}
//     </div>
//   );
// };

// export default AdminPaymentsPage;

import React, { useState, useEffect } from "react";
import paymentService from "../../services/paymentService";
import AdminExcelToolbar from "../../components/common/AdminExcelToolbar";
import { useToast } from "../../context/ToastContext";
import { Search } from "lucide-react";

/* Responsive styles: table on desktop, cards on mobile (<= 768px) */
const responsiveCss = `
  .admin-payments-page .payment-cards { display: none; }

  @media (max-width: 768px) {
    .admin-payments-page .admin-payments-header {
      flex-direction: column !important;
      align-items: flex-start !important;
      gap: 0.75rem !important;
    }
    .admin-payments-page .admin-payments-header > div:last-child,
    .admin-payments-page .admin-payments-header .admin-excel-wrap {
      width: 100%;
    }

    .admin-payments-page .admin-list-toolbar { flex-wrap: wrap; }
    .admin-payments-page .admin-list-toolbar > * { flex: 1 1 100% !important; }

    /* Hide table, show cards */
    .admin-payments-page .payment-table-wrap { display: none !important; }
    .admin-payments-page .payment-cards {
      display: flex;
      flex-direction: column;
      gap: 0.85rem;
    }

    .payment-card {
      background: var(--surface, #fff);
      border: 1px solid var(--border);
      border-radius: var(--radius-lg);
      padding: 0.9rem;
      display: flex;
      flex-direction: column;
      gap: 0.8rem;
    }
    .payment-card-top {
      display: flex;
      justify-content: space-between;
      align-items: flex-start;
      gap: 0.75rem;
    }
    .payment-card-student { flex: 1; min-width: 0; }
    .payment-card-name {
      font-weight: 600;
      font-size: 1rem;
      line-height: 1.3;
      word-break: break-word;
    }
    .payment-card-email {
      font-size: 0.78rem;
      color: var(--text-muted);
      margin-top: 0.15rem;
      word-break: break-all;
    }
    .payment-card-amount {
      font-weight: 700;
      font-size: 1.15rem;
    }
    .payment-card-amount-wrap {
      display: flex;
      flex-direction: column;
      align-items: flex-end;
      gap: 0.35rem;
      flex-shrink: 0;
    }
    .payment-card-meta {
      display: grid;
      grid-template-columns: 1fr;
      gap: 0.65rem;
      padding: 0.75rem;
      background: var(--bg-subtle);
      border-radius: var(--radius-md);
    }
    .payment-card-meta-label {
      font-size: 0.68rem;
      text-transform: uppercase;
      letter-spacing: 0.04em;
      color: var(--text-muted);
      margin-bottom: 0.2rem;
    }
    .payment-card-meta-value {
      font-size: 0.88rem;
      font-weight: 600;
      word-break: break-word;
    }
    .payment-card-meta-value.mono {
      font-family: monospace;
      font-size: 0.8rem;
      font-weight: 500;
      word-break: break-all;
    }
  }
`;

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
    const matchesQuery = [
      payment.razorpayOrderId,
      payment.razorpayPaymentId,
      payment.user?.name,
      payment.user?.email,
      payment.course?.courseName,
    ].some((value) => value?.toLowerCase().includes(searchQuery.trim().toLowerCase()));
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
      if (
        (Number.isFinite(amount) && amount !== Number(existing.amount)) ||
        (row.status && String(row.status).toLowerCase() !== existing.status)
      )
        mismatched += 1;
    }
    return `Review only: ${matched} matched, ${unknown} unknown, ${mismatched} mismatches; verified records unchanged`;
  };

  const paymentStatuses = [...new Set(payments.map((payment) => payment.status).filter(Boolean))];

  return (
    <div className="animate-fade-in responsive-page admin-payments-page">
      <style>{responsiveCss}</style>

      <div
        className="admin-payments-header"
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          flexWrap: "wrap",
          gap: "1rem",
          marginBottom: "1.25rem",
        }}
      >
        <h1 style={{ fontSize: "1.75rem", marginBottom: "0.4rem" }}>Platform Payments & Receipts</h1>
        <p style={{ color: "var(--text-muted)", fontSize: "0.95rem" }}>
          Razorpay payment transactions verified by server HMAC cryptograms. Excel imports are
          reconciliation previews and do not change verified records.
        </p>
        <AdminExcelToolbar
          rows={payments.map((payment) => ({
            _id: payment._id,
            razorpayOrderId: payment.razorpayOrderId,
            razorpayPaymentId: payment.razorpayPaymentId,
            studentName: payment.user?.name,
            studentEmail: payment.user?.email,
            courseName: payment.course?.courseName,
            amount: payment.amount,
            currency: payment.currency,
            status: payment.status,
            createdAt: payment.createdAt,
          }))}
          sheetName="Payments"
          fileName="classstream-payments"
          onImport={reviewImportedPayments}
          onError={(error) =>
            toast.error(
              error.formattedMessage || error.message || "Could not review payment workbook."
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
            aria-label="Search payments"
            placeholder="Search order, payment, student, or course..."
            value={searchQuery}
            onChange={(event) => setSearchQuery(event.target.value)}
            style={{ paddingLeft: "2.5rem" }}
          />
        </div>
        <select
          className="form-control"
          aria-label="Filter payments by status"
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

      {loading ? (
        <div
          className="skeleton"
          style={{ width: "100%", height: "260px", borderRadius: "var(--radius-lg)" }}
        />
      ) : filteredPayments.length > 0 ? (
        <>
          {/* ===== Desktop: table ===== */}
          <div className="table-responsive payment-table-wrap">
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
                    <td style={{ fontFamily: "monospace", fontSize: "0.85rem" }}>
                      {p.razorpayOrderId}
                    </td>
                    <td style={{ fontFamily: "monospace", fontSize: "0.85rem" }}>
                      {p.razorpayPaymentId || "—"}
                    </td>
                    <td>
                      <div style={{ fontWeight: 600 }}>{p.user?.name || "Student"}</div>
                      <div style={{ fontSize: "0.75rem", color: "var(--text-muted)" }}>
                        {p.user?.email}
                      </div>
                    </td>
                    <td>{p.course?.courseName || "Course Track"}</td>
                    <td style={{ fontWeight: 700 }}>
                      ₹{p.amount} {p.currency}
                    </td>
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

          {/* ===== Mobile: cards ===== */}
          <div className="payment-cards">
            {filteredPayments.map((p) => (
              <div className="payment-card" key={p._id}>
                <div className="payment-card-top">
                  <div className="payment-card-student">
                    <div className="payment-card-name">{p.user?.name || "Student"}</div>
                    <div className="payment-card-email">{p.user?.email}</div>
                  </div>
                  <div className="payment-card-amount-wrap">
                    <div className="payment-card-amount">
                      ₹{p.amount} {p.currency}
                    </div>
                    <span className="badge badge-free">{p.status}</span>
                  </div>
                </div>

                <div className="payment-card-meta">
                  <div>
                    <div className="payment-card-meta-label">Course Track</div>
                    <div className="payment-card-meta-value">
                      {p.course?.courseName || "Course Track"}
                    </div>
                  </div>
                  <div>
                    <div className="payment-card-meta-label">Order ID</div>
                    <div className="payment-card-meta-value mono">{p.razorpayOrderId}</div>
                  </div>
                  <div>
                    <div className="payment-card-meta-label">Payment ID</div>
                    <div className="payment-card-meta-value mono">
                      {p.razorpayPaymentId || "—"}
                    </div>
                  </div>
                  <div>
                    <div className="payment-card-meta-label">Timestamp</div>
                    <div className="payment-card-meta-value">
                      {new Date(p.createdAt).toLocaleString("en-IN")}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </>
      ) : (
        <div className="empty-state">
          <h4>{payments.length ? "No Matching Payments" : "No Transactions Recorded"}</h4>
          <p>
            {payments.length
              ? "Change the search or status filter."
              : "Verified student transactions will appear here automatically."}
          </p>
        </div>
      )}
    </div>
  );
};

export default AdminPaymentsPage;