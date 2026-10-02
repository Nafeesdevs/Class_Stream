import React, { useEffect, useState } from "react";
import { Save, TrendingUp } from "lucide-react";
import { useToast } from "../../context/ToastContext";
import growthHighlightService from "../../services/growthHighlightService";

const initialStats = [
  { value: 14000, suffix: "+", label: "Active Enrolled Students", sub: "Global engineering cohort" },
  { value: 150, suffix: "+", label: "HD Masterclass Tracks", sub: "Zero-buffering video lessons" },
  { value: 25, suffix: "+", label: "Specialized Curriculums", sub: "Frontend, AI, Cloud & Systems" },
  { value: 98.6, suffix: "%", label: "Course Satisfaction", sub: "Verified post-completion rating" },
];

export const AdminGrowthHighlightsPage = () => {
  const toast = useToast();
  const [stats, setStats] = useState(initialStats);
  const [loading, setLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    const fetchHighlights = async () => {
      try {
        const response = await growthHighlightService.getGrowthHighlights();
        if (response?.growthHighlights?.stats?.length === 4) {
          setStats(response.growthHighlights.stats.map((stat) => ({ ...stat })));
        }
      } catch (error) {
        toast.error(error.formattedMessage || "Failed to load growth highlights.");
      } finally {
        setLoading(false);
      }
    };

    fetchHighlights();
  }, []);

  const updateStat = (index, field, value) => {
    setStats((current) => current.map((stat, statIndex) =>
      statIndex === index ? { ...stat, [field]: value } : stat
    ));
  };

  const handleSave = async (event) => {
    event.preventDefault();
    if (stats.some((stat) => stat.value === "" || !Number.isFinite(Number(stat.value)) || Number(stat.value) < 0 || !stat.label.trim())) {
      toast.warning("Enter a non-negative number and a label for each highlight.");
      return;
    }

    try {
      setIsSaving(true);
      const cleanStats = stats.map((stat) => ({ ...stat, value: Number(stat.value) }));
      const response = await growthHighlightService.updateGrowthHighlights(cleanStats);
      if (response?.growthHighlights?.stats) {
        setStats(response.growthHighlights.stats.map((stat) => ({ ...stat })));
      }
      toast.success("Growth highlights updated on the homepage.");
    } catch (error) {
      toast.error(error.formattedMessage || "Failed to save growth highlights.");
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="animate-fade-in responsive-page admin-growth-page">
      <div style={{ display: "flex", alignItems: "center", gap: "0.85rem", marginBottom: "0.5rem" }}>
        <div style={{ width: "42px", height: "42px", display: "grid", placeItems: "center", borderRadius: "var(--radius-md)", color: "var(--primary)", background: "var(--primary-light)" }}>
          <TrendingUp size={21} />
        </div>
        <div>
          <h1 style={{ fontSize: "1.65rem", marginBottom: "0.15rem" }}>Growth Highlights</h1>
          <p style={{ color: "var(--text-muted)", fontSize: "0.9rem" }}>Manage the four metrics displayed on the homepage.</p>
        </div>
      </div>

      {loading ? (
        <div className="skeleton" style={{ height: "360px", borderRadius: "var(--radius-lg)", marginTop: "1.5rem" }} />
      ) : (
        <form onSubmit={handleSave} style={{ marginTop: "1.5rem" }}>
          <div style={{ display: "grid", gap: "1rem" }}>
            {stats.map((stat, index) => (
              <section key={index} className="card" style={{ padding: "1.25rem" }}>
                <h2 style={{ fontSize: "0.95rem", marginBottom: "1rem", color: "var(--text-muted)" }}>Highlight {index + 1}</h2>
                <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(130px, 1fr))", gap: "1rem" }}>
                  <div className="form-group" style={{ margin: 0 }}>
                    <label className="form-label" htmlFor={`growth-value-${index}`}>Number</label>
                    <input
                      id={`growth-value-${index}`}
                      type="number"
                      min="0"
                      step="any"
                      required
                      className="form-control"
                      value={stat.value}
                      onChange={(event) => updateStat(index, "value", event.target.value === "" ? "" : Number(event.target.value))}
                    />
                  </div>
                  <div className="form-group" style={{ margin: 0 }}>
                    <label className="form-label" htmlFor={`growth-suffix-${index}`}>Suffix</label>
                    <input
                      id={`growth-suffix-${index}`}
                      type="text"
                      maxLength="12"
                      className="form-control"
                      placeholder="+ or %"
                      value={stat.suffix || ""}
                      onChange={(event) => updateStat(index, "suffix", event.target.value)}
                    />
                  </div>
                  <div className="form-group" style={{ margin: 0 }}>
                    <label className="form-label" htmlFor={`growth-label-${index}`}>Title</label>
                    <input
                      id={`growth-label-${index}`}
                      type="text"
                      maxLength="80"
                      required
                      className="form-control"
                      value={stat.label}
                      onChange={(event) => updateStat(index, "label", event.target.value)}
                    />
                  </div>
                  <div className="form-group" style={{ margin: 0, gridColumn: "1 / -1" }}>
                    <label className="form-label" htmlFor={`growth-sub-${index}`}>Description</label>
                    <input
                      id={`growth-sub-${index}`}
                      type="text"
                      maxLength="120"
                      className="form-control"
                      value={stat.sub || ""}
                      onChange={(event) => updateStat(index, "sub", event.target.value)}
                    />
                  </div>
                </div>
              </section>
            ))}
          </div>

          <div style={{ display: "flex", justifyContent: "flex-end", marginTop: "1.25rem" }}>
            <button type="submit" disabled={isSaving} className="btn btn-primary">
              <Save size={16} /> {isSaving ? "Saving..." : "Save Highlights"}
            </button>
          </div>
        </form>
      )}
    </div>
  );
};

export default AdminGrowthHighlightsPage;