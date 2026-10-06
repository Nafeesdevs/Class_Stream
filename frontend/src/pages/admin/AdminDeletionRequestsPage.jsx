import React, { useState, useEffect } from "react";
import authService from "../../services/authService";
import { useToast } from "../../context/ToastContext";
import ConfirmModal from "../../components/common/ConfirmModal";
import { Search, UserX, Check, X } from "lucide-react";

/* Responsive styles:
   - laptop / desktop (> 1024px): table
   - tablet (641px - 1024px): cards in 2 columns
   - mobile (<= 640px): cards in 1 column */
const responsiveCss = `
  .admin-deletion-page .deletion-cards { display: none; }

  @media (max-width: 1024px) {
    .admin-deletion-page .deletion-table-wrap { display: none !important; }
    .admin-deletion-page .deletion-cards {
      display: grid;
      grid-template-columns: repeat(2, minmax(0, 1fr));
      gap: 0.9rem;
      align-items: start;
    }
  }

  @media (max-width: 768px) {
    .admin-deletion-page .admin-deletion-header {
      flex-direction: column !important;
      align-items: flex-start !important;
      gap: 0.75rem !important;
    }
    .admin-deletion-page .admin-list-toolbar { flex-wrap: wrap; }
    .admin-deletion-page .admin-list-toolbar > * { flex: 1 1 100% !important; }
  }

  @media (max-width: 640px) {
    .admin-deletion-page .deletion-cards { grid-template-columns: minmax(0, 1fr); }
  }

  .deletion-card {
    background: var(--surface, #fff);
    border: 1px solid var(--border);
    border-radius: var(--radius-lg);
    padding: 0.95rem;
    display: flex;
    flex-direction: column;
    gap: 0.8rem;
    min-width: 0;
  }
  .deletion-card-top {
    display: flex;
    align-items: center;
    gap: 0.75rem;
  }
  .deletion-card-avatar {
    width: 42px;
    height: 42px;
    border-radius: 50%;
    background: var(--primary);
    color: #ffffff;
    display: flex;
    align-items: center;
    justify-content: center;
    font-weight: 700;
    flex-shrink: 0;
  }
  .deletion-card-id { flex: 1; min-width: 0; }
  .deletion-card-name {
    font-weight: 600;
    font-size: 1rem;
    line-height: 1.3;
    word-break: break-word;
  }
  .deletion-card-email {
    font-size: 0.78rem;
    color: var(--text-muted);
    margin-top: 0.15rem;
    word-break: break-all;
  }
  .deletion-card-meta {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 0.65rem 0.75rem;
    padding: 0.75rem;
    background: var(--bg-subtle);
    border-radius: var(--radius-md);
  }
  .deletion-card-meta-full { grid-column: 1 / -1; }
  .deletion-card-meta-label {
    font-size: 0.68rem;
    text-transform: uppercase;
    letter-spacing: 0.04em;
    color: var(--text-muted);
    margin-bottom: 0.2rem;
  }
  .deletion-card-meta-value {
    font-size: 0.88rem;
    font-weight: 600;
    word-break: break-word;
  }
  .deletion-card-meta-value.reason {
    font-weight: 500;
    line-height: 1.55;
    white-space: pre-wrap;
  }
  .deletion-card-actions {
    display: flex;
    gap: 0.6rem;
  }
  .deletion-card-actions .btn {
    flex: 1;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    gap: 0.4rem;
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

const statusBadge = (status) => {
  if (status === "pending") return { className: "badge badge-trial", style: {}, label: "Pending" };
  if (status === "approved")
    return {
      className: "badge",
      style: { background: "var(--danger-bg)", color: "var(--danger)", border: "1px solid #fecaca" },
      label: "Approved",
    };
  return { className: "badge badge-gray", style: {}, label: "Rejected" };
};

const StatusBadge = ({ status }) => {
  const badge = statusBadge(status);
  return (
    <span className={badge.className} style={badge.style}>
      {badge.label}
    </span>
  );
};

export const AdminDeletionRequestsPage = () => {
  const toast = useToast();
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");

  const [approveTarget, setApproveTarget] = useState(null);
  const [rejectTarget, setRejectTarget] = useState(null);
  const [isProcessing, setIsProcessing] = useState(false);

  const fetchRequests = async () => {
    try {
      setLoading(true);
      const res = await authService.getDeletionRequests();
      if (res?.requests) setRequests(res.requests);
    } catch (err) {
      toast.error(err.formattedMessage || "Failed to load deletion requests.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRequests();
  }, []);

  const pendingCount = requests.filter((item) => item.status === "pending").length;

  // Pending requests first, then newest first
  const visibleRequests = requests
    .filter((item) => {
      const query = searchQuery.trim().toLowerCase();
      const matchesSearch =
        !query ||
        [item.name, item.email, item.reason].some((value) => value?.toLowerCase().includes(query));
      return matchesSearch && (statusFilter === "all" || item.status === statusFilter);
    })
    .sort((a, b) => {
      if (a.status === "pending" && b.status !== "pending") return -1;
      if (a.status !== "pending" && b.status === "pending") return 1;
      return new Date(b.createdAt) - new Date(a.createdAt);
    });

  const applyReviewed = (reviewed, fallbackId, fallbackStatus) => {
    setRequests((current) =>
      current.map((item) =>
        item._id === fallbackId ? (reviewed ? { ...item, ...reviewed } : { ...item, status: fallbackStatus }) : item
      )
    );
  };

  const confirmApprove = async () => {
    if (!approveTarget) return;
    try {
      setIsProcessing(true);
      const res = await authService.approveDeletionRequest(approveTarget._id);
      applyReviewed(res.request, approveTarget._id, "approved");
      toast.success("Request approved. The account was permanently deleted.");
      setApproveTarget(null);
    } catch (err) {
      toast.error(err.formattedMessage || "Failed to approve the request.");
    } finally {
      setIsProcessing(false);
    }
  };

  const confirmReject = async () => {
    if (!rejectTarget) return;
    try {
      setIsProcessing(true);
      const res = await authService.rejectDeletionRequest(rejectTarget._id);
      applyReviewed(res.request, rejectTarget._id, "rejected");
      toast.success("Request rejected. The user can sign in again.");
      setRejectTarget(null);
    } catch (err) {
      toast.error(err.formattedMessage || "Failed to reject the request.");
    } finally {
      setIsProcessing(false);
    }
  };

  const reviewedLine = (item) =>
    item.reviewedAt
      ? `By ${item.reviewedByName || "Admin"} · ${formatDate(item.reviewedAt)}`
      : "";

  return (
    <div className="animate-fade-in responsive-page admin-deletion-page">
      <style>{responsiveCss}</style>

      <div
        className="admin-deletion-header"
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          flexWrap: "wrap",
          gap: "1rem",
          marginBottom: "1.25rem",
        }}
      >
        <div>
          <h1 style={{ fontSize: "1.75rem", marginBottom: "0.4rem" }}>Account Deletion Requests</h1>
          <p style={{ color: "var(--text-muted)", fontSize: "0.95rem" }}>
            Students who asked to delete their account. Approving removes the account permanently;
            rejecting lets the student sign in again.
          </p>
        </div>
        <span
          className={`badge ${pendingCount > 0 ? "badge-trial" : "badge-gray"}`}
          style={{ display: "inline-flex", alignItems: "center", gap: "0.35rem" }}
        >
          <UserX size={13} /> {pendingCount} pending
        </span>
      </div>

      <div className="admin-list-toolbar">
        <div className="input-with-icon" style={{ flex: "1 1 280px", minWidth: 0 }}>
          <Search className="input-icon-left" size={17} />
          <input
            className="form-control"
            type="search"
            aria-label="Search deletion requests"
            placeholder="Search name, email, or reason..."
            value={searchQuery}
            onChange={(event) => setSearchQuery(event.target.value)}
            style={{ paddingLeft: "2.5rem" }}
          />
        </div>
        <select
          className="form-control"
          aria-label="Filter deletion requests by status"
          value={statusFilter}
          onChange={(event) => setStatusFilter(event.target.value)}
          style={{ flex: "0 1 200px" }}
        >
          <option value="all">All Statuses</option>
          <option value="pending">Pending</option>
          <option value="approved">Approved</option>
          <option value="rejected">Rejected</option>
        </select>
      </div>

      {loading ? (
        <div
          className="skeleton"
          style={{ width: "100%", height: "260px", borderRadius: "var(--radius-lg)" }}
        />
      ) : visibleRequests.length > 0 ? (
        <>
          {/* ===== Laptop / desktop: table ===== */}
          <div className="table-responsive deletion-table-wrap">
            <table className="table">
              <thead>
                <tr>
                  <th>User</th>
                  <th>Reason</th>
                  <th>Requested</th>
                  <th>Status</th>
                  <th style={{ textAlign: "right" }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {visibleRequests.map((item) => (
                  <tr key={item._id}>
                    <td>
                      <div style={{ fontWeight: 600 }}>{item.name}</div>
                      <div style={{ fontSize: "0.75rem", color: "var(--text-muted)" }}>{item.email}</div>
                      <div style={{ fontSize: "0.75rem", color: "var(--text-muted)", marginTop: "2px" }}>
                        {item.enrollmentsCount || 0} enrolled course
                        {(item.enrollmentsCount || 0) === 1 ? "" : "s"}
                      </div>
                    </td>
                    <td
                      style={{
                        maxWidth: "340px",
                        whiteSpace: "pre-wrap",
                        wordBreak: "break-word",
                        lineHeight: 1.55,
                        fontSize: "0.9rem",
                      }}
                    >
                      {item.reason}
                    </td>
                    <td style={{ color: "var(--text-muted)", fontSize: "0.85rem", whiteSpace: "nowrap" }}>
                      {formatDate(item.createdAt)}
                    </td>
                    <td>
                      <StatusBadge status={item.status} />
                      {item.status !== "pending" && (
                        <div style={{ fontSize: "0.72rem", color: "var(--text-muted)", marginTop: "0.35rem" }}>
                          {reviewedLine(item)}
                        </div>
                      )}
                    </td>
                    <td style={{ textAlign: "right" }}>
                      {item.status === "pending" ? (
                        <div style={{ display: "inline-flex", gap: "0.5rem" }}>
                          <button
                            type="button"
                            onClick={() => setRejectTarget(item)}
                            className="btn btn-outline btn-sm"
                            aria-label={`Reject deletion request from ${item.name}`}
                          >
                            Reject
                          </button>
                          <button
                            type="button"
                            onClick={() => setApproveTarget(item)}
                            className="btn btn-danger btn-sm"
                            aria-label={`Approve deletion request from ${item.name}`}
                          >
                            Approve & Delete
                          </button>
                        </div>
                      ) : (
                        <span style={{ color: "var(--text-light)" }}>—</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* ===== Tablet & mobile: cards ===== */}
          <div className="deletion-cards">
            {visibleRequests.map((item) => (
              <div className="deletion-card" key={item._id}>
                <div className="deletion-card-top">
                  <div className="deletion-card-avatar">{item.name?.charAt(0).toUpperCase() || "U"}</div>
                  <div className="deletion-card-id">
                    <div className="deletion-card-name">{item.name}</div>
                    <div className="deletion-card-email">{item.email}</div>
                  </div>
                  <StatusBadge status={item.status} />
                </div>

                <div className="deletion-card-meta">
                  <div className="deletion-card-meta-full">
                    <div className="deletion-card-meta-label">Reason</div>
                    <div className="deletion-card-meta-value reason">{item.reason}</div>
                  </div>
                  <div>
                    <div className="deletion-card-meta-label">Requested</div>
                    <div className="deletion-card-meta-value">{formatDate(item.createdAt)}</div>
                  </div>
                  <div>
                    <div className="deletion-card-meta-label">Enrolled Courses</div>
                    <div className="deletion-card-meta-value">{item.enrollmentsCount || 0}</div>
                  </div>
                  {item.status !== "pending" && (
                    <div className="deletion-card-meta-full">
                      <div className="deletion-card-meta-label">Reviewed</div>
                      <div className="deletion-card-meta-value">{reviewedLine(item)}</div>
                    </div>
                  )}
                </div>

                {item.status === "pending" && (
                  <div className="deletion-card-actions">
                    <button
                      type="button"
                      onClick={() => setRejectTarget(item)}
                      className="btn btn-outline btn-sm"
                    >
                      <X size={14} /> Reject
                    </button>
                    <button
                      type="button"
                      onClick={() => setApproveTarget(item)}
                      className="btn btn-danger btn-sm"
                    >
                      <Check size={14} /> Approve
                    </button>
                  </div>
                )}
              </div>
            ))}
          </div>
        </>
      ) : (
        <div className="empty-state">
          <h4>{requests.length ? "No Matching Requests" : "No Deletion Requests"}</h4>
          <p>
            {requests.length
              ? "Change the search or status filter."
              : "When a student asks to delete their account, the request will appear here."}
          </p>
        </div>
      )}

      <ConfirmModal
        isOpen={!!approveTarget}
        title="Approve & Delete Account"
        message={
          approveTarget
            ? `This will permanently delete ${approveTarget.name} (${approveTarget.email}) together with their enrollments and progress. This cannot be undone.`
            : ""
        }
        confirmText="Approve & Delete"
        isLoading={isProcessing}
        onConfirm={confirmApprove}
        onCancel={() => !isProcessing && setApproveTarget(null)}
      />

      <ConfirmModal
        isOpen={!!rejectTarget}
        title="Reject Deletion Request"
        message={
          rejectTarget
            ? `${rejectTarget.name}'s account will be kept and they will be able to sign in again.`
            : ""
        }
        confirmText="Reject Request"
        isDanger={false}
        isLoading={isProcessing}
        onConfirm={confirmReject}
        onCancel={() => !isProcessing && setRejectTarget(null)}
      />
    </div>
  );
};

export default AdminDeletionRequestsPage;
