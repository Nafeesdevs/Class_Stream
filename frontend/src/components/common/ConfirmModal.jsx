import React from "react";
import { AlertTriangle, X } from "lucide-react";

export const ConfirmModal = ({
  isOpen,
  title = "Confirm Action",
  message = "Are you sure you want to proceed? This action cannot be undone.",
  confirmText = "Delete",
  cancelText = "Cancel",
  isDanger = true,
  isLoading = false,
  onConfirm,
  onCancel,
}) => {
  if (!isOpen) return null;

  return (
    <div className="modal-backdrop" onClick={onCancel}>
      <div
        className="modal-dialog animate-modal"
        onClick={(e) => e.stopPropagation()}
        style={{ maxWidth: "460px" }}
      >
        <div className="card-header">
          <div style={{ display: "flex", alignItems: "center", gap: "0.65rem" }}>
            <div
              style={{
                width: "36px",
                height: "36px",
                borderRadius: "var(--radius-full)",
                background: isDanger ? "var(--danger-bg)" : "var(--primary-light)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                color: isDanger ? "var(--danger)" : "var(--primary)",
              }}
            >
              <AlertTriangle size={18} />
            </div>
            <h3 style={{ fontSize: "1.15rem" }}>{title}</h3>
          </div>
          <button
            onClick={onCancel}
            style={{
              background: "none",
              border: "none",
              cursor: "pointer",
              color: "var(--text-light)",
            }}
          >
            <X size={20} />
          </button>
        </div>

        <div className="card-body">
          <p style={{ color: "var(--text-muted)", fontSize: "0.95rem" }}>{message}</p>
        </div>

        <div
          className="card-footer"
          style={{ display: "flex", justifyContent: "flex-end", gap: "0.75rem" }}
        >
          <button
            onClick={onCancel}
            disabled={isLoading}
            className="btn btn-outline btn-sm"
          >
            {cancelText}
          </button>
          <button
            onClick={onConfirm}
            disabled={isLoading}
            className={`btn btn-sm ${isDanger ? "btn-danger" : "btn-primary"}`}
          >
            {isLoading ? "Processing..." : confirmText}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmModal;
