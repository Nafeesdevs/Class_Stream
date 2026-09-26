import React, { useState, useEffect } from "react";
import classService from "../../services/classService";
import { useToast } from "../../context/ToastContext";
import ConfirmModal from "../../components/common/ConfirmModal";
import { Plus, Edit2, Trash2, GraduationCap, X } from "lucide-react";

export const AdminClassesPage = () => {
  const toast = useToast();

  const [classes, setClasses] = useState([]);
  const [loading, setLoading] = useState(true);

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingClass, setEditingClass] = useState(null);
  const [className, setClassName] = useState("");
  const [isSaving, setIsSaving] = useState(false);

  // Delete State
  const [deleteId, setDeleteId] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const fetchClasses = async () => {
    try {
      setLoading(true);
      const res = await classService.getAllClasses();
      if (res?.classes) {
        setClasses(res.classes);
      }
    } catch (err) {
      toast.error("Failed to load classes.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchClasses();
  }, []);

  const openCreateModal = () => {
    setEditingClass(null);
    setClassName("");
    setIsModalOpen(true);
  };

  const openEditModal = (cls) => {
    setEditingClass(cls);
    setClassName(cls.className);
    setIsModalOpen(true);
  };

  const handleSave = async (e) => {
    e.preventDefault();
    if (!className.trim()) return;

    try {
      setIsSaving(true);
      if (editingClass) {
        await classService.updateClass(editingClass._id, className.trim());
        toast.success("Class updated successfully!");
      } else {
        await classService.createClass(className.trim());
        toast.success("Class created successfully!");
      }
      setIsModalOpen(false);
      fetchClasses();
    } catch (err) {
      toast.error(err.formattedMessage || "Failed to save class.");
    } finally {
      setIsSaving(false);
    }
  };

  const confirmDelete = async () => {
    if (!deleteId) return;
    try {
      setIsDeleting(true);
      await classService.deleteClass(deleteId);
      toast.success("Class deleted.");
      setDeleteId(null);
      fetchClasses();
    } catch (err) {
      toast.error(err.formattedMessage || "Failed to delete class.");
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <div className="animate-fade-in">
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "2rem" }}>
        <div>
          <h1 style={{ fontSize: "1.75rem", marginBottom: "0.4rem" }}>Class / Level Management</h1>
          <p style={{ color: "var(--text-muted)", fontSize: "0.95rem" }}>
            Maintain education levels, proficiency badges, and grade classes.
          </p>
        </div>

        <button onClick={openCreateModal} className="btn btn-primary btn-sm">
          <Plus size={16} /> Add Class Level
        </button>
      </div>

      {loading ? (
        <div className="skeleton" style={{ width: "100%", height: "200px", borderRadius: "var(--radius-lg)" }} />
      ) : classes.length > 0 ? (
        <div className="table-responsive">
          <table className="table">
            <thead>
              <tr>
                <th>Class / Level Name</th>
                <th>Created Timestamp</th>
                <th style={{ textAlign: "right" }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {classes.map((cls) => (
                <tr key={cls._id}>
                  <td style={{ fontWeight: 600 }}>
                    <div style={{ display: "flex", alignItems: "center", gap: "0.65rem" }}>
                      <GraduationCap size={18} color="var(--primary)" />
                      <span>{cls.className}</span>
                    </div>
                  </td>
                  <td style={{ color: "var(--text-muted)", fontSize: "0.85rem" }}>
                    {new Date(cls.createdAt).toLocaleDateString("en-IN")}
                  </td>
                  <td style={{ textAlign: "right" }}>
                    <div style={{ display: "inline-flex", gap: "0.5rem" }}>
                      <button
                        onClick={() => openEditModal(cls)}
                        className="btn btn-outline btn-icon"
                        style={{ width: "32px", height: "32px" }}
                        aria-label="Edit class"
                      >
                        <Edit2 size={14} />
                      </button>
                      <button
                        onClick={() => setDeleteId(cls._id)}
                        className="btn btn-outline btn-icon"
                        style={{ width: "32px", height: "32px", color: "var(--danger)", borderColor: "#fca5a5" }}
                        aria-label="Delete class"
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <div className="empty-state">
          <h4>No Classes Defined</h4>
          <p>Add class tiers like Beginner, Advanced, or Class 12.</p>
        </div>
      )}

      {/* Add / Edit Modal */}
      {isModalOpen && (
        <div className="modal-backdrop" onClick={() => setIsModalOpen(false)}>
          <div
            className="modal-dialog animate-modal"
            onClick={(e) => e.stopPropagation()}
            style={{ padding: "2rem", maxWidth: "440px" }}
          >
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1.5rem" }}>
              <h2 style={{ fontSize: "1.3rem" }}>
                {editingClass ? "Edit Class" : "Add New Class"}
              </h2>
              <button onClick={() => setIsModalOpen(false)} style={{ background: "none", border: "none", cursor: "pointer" }}>
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleSave}>
              <div className="form-group">
                <label className="form-label">Class Name</label>
                <input
                  type="text"
                  required
                  value={className}
                  onChange={(e) => setClassName(e.target.value)}
                  className="form-control"
                  placeholder="e.g. Masterclass, Intermediate, Class 10"
                />
              </div>

              <div style={{ display: "flex", justifyContent: "flex-end", gap: "0.75rem", marginTop: "1.5rem" }}>
                <button type="button" onClick={() => setIsModalOpen(false)} className="btn btn-outline">
                  Cancel
                </button>
                <button type="submit" disabled={isSaving} className="btn btn-primary">
                  {isSaving ? "Saving..." : editingClass ? "Save Changes" : "Create Class"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <ConfirmModal
        isOpen={!!deleteId}
        title="Delete Class"
        message="Are you sure you want to delete this class level?"
        isLoading={isDeleting}
        onConfirm={confirmDelete}
        onCancel={() => setDeleteId(null)}
      />
    </div>
  );
};

export default AdminClassesPage;
