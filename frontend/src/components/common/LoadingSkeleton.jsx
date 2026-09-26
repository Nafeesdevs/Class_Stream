import React from "react";

export const CourseSkeletonCard = () => (
  <div className="card" style={{ height: "380px", display: "flex", flexDirection: "column" }}>
    <div className="skeleton" style={{ width: "100%", height: "180px" }} />
    <div style={{ padding: "1.25rem", display: "flex", flexDirection: "column", gap: "0.75rem", flex: 1 }}>
      <div className="skeleton" style={{ width: "35%", height: "18px" }} />
      <div className="skeleton" style={{ width: "85%", height: "24px" }} />
      <div className="skeleton" style={{ width: "100%", height: "14px" }} />
      <div className="skeleton" style={{ width: "70%", height: "14px" }} />
      <div style={{ marginTop: "auto", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <div className="skeleton" style={{ width: "50px", height: "24px" }} />
        <div className="skeleton" style={{ width: "80px", height: "32px", borderRadius: "var(--radius-sm)" }} />
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
