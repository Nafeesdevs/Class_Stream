import React from "react";

export const CourseSkeletonCard = () => (
  <div
    style={{
      height: "100%",
      minHeight: "470px",
      padding: "8px",
      display: "flex",
      flexDirection: "column",
      background: "var(--surface)",
      border: "1px solid var(--border-subtle)",
      borderRadius: "24px",
      boxShadow: "var(--shadow-sm)",
    }}
  >
    <div className="skeleton" style={{ width: "100%", aspectRatio: "16 / 10", borderRadius: "17px" }} />
    <div style={{ padding: "16px 12px 12px", display: "flex", flexDirection: "column", gap: "14px", flex: 1 }}>
      <div className="skeleton" style={{ width: "40%", height: "14px" }} />
      <div className="skeleton" style={{ width: "88%", height: "22px" }} />
      <div className="skeleton" style={{ width: "100%", height: "13px" }} />
      <div className="skeleton" style={{ width: "100%", height: "6px", borderRadius: "999px" }} />
      <div style={{ marginTop: "auto", display: "flex", justifyContent: "space-between", alignItems: "flex-end" }}>
        <div className="skeleton" style={{ width: "96px", height: "34px" }} />
        <div className="skeleton" style={{ width: "48px", height: "48px", borderRadius: "999px" }} />
      </div>
    </div>
  </div>
);

export const DashboardSkeleton = () => (
  <div style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}>
    <div className="skeleton" style={{ width: "100%", height: "140px", borderRadius: "var(--radius-lg)" }} />
    <div className="grid-4">
      {[1, 2, 3, 4].map((n) => (
        <div key={n} className="skeleton" style={{ height: "110px", borderRadius: "var(--radius-md)" }} />
      ))}
    </div>
    <div className="skeleton" style={{ width: "100%", height: "300px", borderRadius: "var(--radius-lg)" }} />
  </div>
);