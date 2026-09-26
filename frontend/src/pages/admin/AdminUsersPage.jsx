import React, { useState, useEffect } from "react";
import authService from "../../services/authService";
import { useToast } from "../../context/ToastContext";
import ConfirmModal from "../../components/common/ConfirmModal";
import { Users, Trash2, Shield, User as UserIcon } from "lucide-react";

export const AdminUsersPage = () => {
  const toast = useToast();
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  const [deleteUserId, setDeleteUserId] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const res = await authService.getAllUsers();
      if (res?.users) {
        setUsers(res.users);
      }
    } catch (err) {
      toast.error("Failed to load users list.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const confirmDelete = async () => {
    if (!deleteUserId) return;
    try {
      setIsDeleting(true);
      await authService.deleteUser(deleteUserId);
      toast.success("User account deleted.");
      setDeleteUserId(null);
      fetchUsers();
    } catch (err) {
      toast.error(err.formattedMessage || "Failed to delete user.");
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <div className="animate-fade-in">
      <div style={{ marginBottom: "2rem" }}>
        <h1 style={{ fontSize: "1.75rem", marginBottom: "0.4rem" }}>User Accounts</h1>
        <p style={{ color: "var(--text-muted)", fontSize: "0.95rem" }}>
          Registered students, instructors, and system administrators.
        </p>
      </div>

      {loading ? (
        <div className="skeleton" style={{ width: "100%", height: "260px", borderRadius: "var(--radius-lg)" }} />
      ) : users.length > 0 ? (
        <div className="table-responsive">
          <table className="table">
            <thead>
              <tr>
                <th>User</th>
                <th>Email</th>
                <th>Role</th>
                <th>Enrolled Courses</th>
                <th>Joined</th>
                <th style={{ textAlign: "right" }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {users.map((u) => (
                <tr key={u._id}>
                  <td>
                    <div style={{ display: "flex", alignItems: "center", gap: "0.65rem" }}>
                      <div
                        style={{
                          width: "32px",
                          height: "32px",
                          borderRadius: "50%",
                          background: u.role === "admin" ? "var(--secondary)" : "var(--primary)",
                          color: "#ffffff",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          fontWeight: 700,
                          fontSize: "0.85rem",
                        }}
                      >
                        {u.name?.charAt(0).toUpperCase() || "U"}
                      </div>
                      <span style={{ fontWeight: 600 }}>{u.name}</span>
                    </div>
                  </td>
                  <td style={{ color: "var(--text-muted)" }}>{u.email}</td>
                  <td>
                    <span className={`badge ${u.role === "admin" ? "badge-sub" : "badge-primary"}`}>
                      {u.role}
                    </span>
                  </td>
                  <td>{u.enrolledCourses?.length || 0}</td>
                  <td style={{ color: "var(--text-muted)", fontSize: "0.85rem" }}>
                    {new Date(u.createdAt).toLocaleDateString("en-IN")}
                  </td>
                  <td style={{ textAlign: "right" }}>
                    <button
                      onClick={() => setDeleteUserId(u._id)}
                      className="btn btn-outline btn-icon"
                      style={{ width: "32px", height: "32px", color: "var(--danger)", borderColor: "#fca5a5" }}
                      aria-label="Delete user"
                    >
                      <Trash2 size={14} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <div className="empty-state">
          <h4>No Users Registered</h4>
        </div>
      )}

      <ConfirmModal
        isOpen={!!deleteUserId}
        title="Delete User Account"
        message="Are you sure you want to permanently delete this user account and revoke all their enrollments?"
        isLoading={isDeleting}
        onConfirm={confirmDelete}
        onCancel={() => setDeleteUserId(null)}
      />
    </div>
  );
};

export default AdminUsersPage;
