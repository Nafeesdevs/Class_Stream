import React, { createContext, useContext, useState, useCallback } from "react";
import { CheckCircle2, AlertCircle, Info, AlertTriangle, X } from "lucide-react";

const ToastContext = createContext(null);

export const ToastProvider = ({ children }) => {
  const [toasts, setToasts] = useState([]);

  const removeToast = useCallback((id) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const addToast = useCallback((message, type = "info", duration = 4000) => {
    const id = Date.now() + Math.random().toString(36).substring(2, 6);
    setToasts((prev) => [...prev, { id, message, type }]);

    if (duration > 0) {
      setTimeout(() => {
        removeToast(id);
      }, duration);
    }
  }, [removeToast]);

  const toast = {
    success: (msg, dur) => addToast(msg, "success", dur),
    error: (msg, dur) => addToast(msg, "error", dur),
    info: (msg, dur) => addToast(msg, "info", dur),
    warning: (msg, dur) => addToast(msg, "warning", dur),
  };

  return (
    <ToastContext.Provider value={toast}>
      {children}
      <div className="toast-container" aria-live="polite">
        {toasts.map((item) => (
          <div key={item.id} className={`toast-item ${item.type} animate-toast`}>
            <div style={{ flexShrink: 0, marginTop: "2px" }}>
              {item.type === "success" && <CheckCircle2 size={18} color="var(--success)" />}
              {item.type === "error" && <AlertCircle size={18} color="var(--danger)" />}
              {item.type === "warning" && <AlertTriangle size={18} color="var(--warning)" />}
              {item.type === "info" && <Info size={18} color="var(--info)" />}
            </div>
            <div style={{ flex: 1, color: "var(--text-main)", fontWeight: 500 }}>
              {item.message}
            </div>
            <button
              onClick={() => removeToast(item.id)}
              style={{
                background: "none",
                border: "none",
                cursor: "pointer",
                color: "var(--text-light)",
                display: "flex",
                alignItems: "center",
                padding: "2px",
              }}
              aria-label="Dismiss toast"
            >
              <X size={16} />
            </button>
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
};

export const useToast = () => {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error("useToast must be used within a ToastProvider");
  }
  return context;
};
