import React, { useState, useEffect } from "react";
import categoryService from "../../services/categoryService";
import { useToast } from "../../context/ToastContext";
import ConfirmModal from "../../components/common/ConfirmModal";
import { Plus, Edit2, Trash2, FolderTree, X, Image as ImageIcon } from "lucide-react";

export const AdminCategoriesPage = () => {
  const toast = useToast();

  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState(null);
  const [categoryName, setCategoryName] = useState("");
  const [categoryImage, setCategoryImage] = useState(null);
  const [isSaving, setIsSaving] = useState(false);

  // Delete State
  const [deleteId, setDeleteId] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const fetchCategories = async () => {
    try {
      setLoading(true);
      const res = await categoryService.getAllCategories();
      if (res?.category) {
        setCategories(res.category);
      }
    } catch (err) {
      toast.error("Failed to load categories.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  const openCreateModal = () => {
    setEditingCategory(null);
    setCategoryName("");
    setCategoryImage(null);
    setIsModalOpen(true);
  };

  const openEditModal = (cat) => {
    setEditingCategory(cat);
    setCategoryName(cat.categoryName);
    setCategoryImage(null);
    setIsModalOpen(true);
  };

  const handleSave = async (e) => {
    e.preventDefault();
    if (!categoryName.trim()) {
      toast.warning("Category name is required.");
      return;
    }

    try {
      setIsSaving(true);
      const formData = new FormData();
      formData.append("categoryName", categoryName.trim());
      if (categoryImage) {
        formData.append("categoryImage", categoryImage);
      }

      if (editingCategory) {
        await categoryService.updateCategory(editingCategory._id, formData);
        toast.success("Category updated successfully!");
      } else {
        await categoryService.createCategory(formData);
        toast.success("Category created successfully!");
      }

      setIsModalOpen(false);
      fetchCategories();
    } catch (err) {
      toast.error(err.formattedMessage || "Failed to save category.");
    } finally {
      setIsSaving(false);
    }
  };

  const confirmDelete = async () => {
    if (!deleteId) return;
    try {
      setIsDeleting(true);
      await categoryService.deleteCategory(deleteId);
      toast.success("Category deleted.");
      setDeleteId(null);
      fetchCategories();
    } catch (err) {
      toast.error(err.formattedMessage || "Failed to delete category.");
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <div className="animate-fade-in">
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "2rem" }}>
        <div>
          <h1 style={{ fontSize: "1.75rem", marginBottom: "0.4rem" }}>Category Management</h1>
          <p style={{ color: "var(--text-muted)", fontSize: "0.95rem" }}>
            Organize courses into specialized disciplines and tracks.
          </p>
        </div>

        <button onClick={openCreateModal} className="btn btn-primary btn-sm">
          <Plus size={16} /> Add Category
        </button>
      </div>

      {loading ? (
        <div className="skeleton" style={{ width: "100%", height: "240px", borderRadius: "var(--radius-lg)" }} />
      ) : categories.length > 0 ? (
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))",
            gap: "1.5rem",
          }}
        >
          {categories.map((cat) => {
            const img =
              cat.categoryImage?.[0]?.imageUrl ||
              "https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=600&auto=format&fit=crop&q=80";

            return (
              <div key={cat._id} className="card" style={{ display: "flex", flexDirection: "column" }}>
                <div style={{ height: "140px", position: "relative", overflow: "hidden" }}>
                  <img src={img} alt={cat.categoryName} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                </div>
                <div style={{ padding: "1.25rem", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <h3 style={{ fontSize: "1.1rem" }}>{cat.categoryName}</h3>
                  <div style={{ display: "flex", gap: "0.5rem" }}>
                    <button
                      onClick={() => openEditModal(cat)}
                      className="btn btn-outline btn-icon"
                      style={{ width: "32px", height: "32px" }}
                      aria-label="Edit category"
                    >
                      <Edit2 size={14} />
                    </button>
                    <button
                      onClick={() => setDeleteId(cat._id)}
                      className="btn btn-outline btn-icon"
                      style={{ width: "32px", height: "32px", color: "var(--danger)", borderColor: "#fca5a5" }}
                      aria-label="Delete category"
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="empty-state">
          <h4>No Categories Created</h4>
          <p>Create your first curriculum category.</p>
        </div>
      )}

      {/* Add / Edit Category Modal */}
      {isModalOpen && (
        <div className="modal-backdrop" onClick={() => setIsModalOpen(false)}>
          <div
            className="modal-dialog animate-modal"
            onClick={(e) => e.stopPropagation()}
            style={{ padding: "2rem", maxWidth: "480px" }}
          >
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1.5rem" }}>
              <h2 style={{ fontSize: "1.3rem" }}>
                {editingCategory ? "Edit Category" : "Add New Category"}
              </h2>
              <button onClick={() => setIsModalOpen(false)} style={{ background: "none", border: "none", cursor: "pointer" }}>
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleSave}>
              <div className="form-group">
                <label className="form-label">Category Name</label>
                <input
                  type="text"
                  required
                  value={categoryName}
                  onChange={(e) => setCategoryName(e.target.value)}
                  className="form-control"
                  placeholder="e.g. Cloud & Distributed Systems"
                />
              </div>

              <div className="form-group">
                <label className="form-label">Category Image File</label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => setCategoryImage(e.target.files[0])}
                  className="form-control"
                />
              </div>

              <div style={{ display: "flex", justifyContent: "flex-end", gap: "0.75rem", marginTop: "1.5rem" }}>
                <button type="button" onClick={() => setIsModalOpen(false)} className="btn btn-outline">
                  Cancel
                </button>
                <button type="submit" disabled={isSaving} className="btn btn-primary">
                  {isSaving ? "Saving..." : editingCategory ? "Save Changes" : "Create Category"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <ConfirmModal
        isOpen={!!deleteId}
        title="Delete Category"
        message="Are you sure you want to delete this category? Associated courses will lose their category association."
        isLoading={isDeleting}
        onConfirm={confirmDelete}
        onCancel={() => setDeleteId(null)}
      />
    </div>
  );
};

export default AdminCategoriesPage;
