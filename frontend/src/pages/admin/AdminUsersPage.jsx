import React, { useState, useEffect } from "react";
import authService from "../../services/authService";
import { useToast } from "../../context/ToastContext";
import ConfirmModal from "../../components/common/ConfirmModal";
import AdminExcelToolbar from "../../components/common/AdminExcelToolbar";
import { Users, Trash2, Search } from "lucide-react";

export const AdminUsersPage = () => {
  const toast = useToast();
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [updatingStatusId, setUpdatingStatusId] = useState(null);

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

  const filteredUsers = users.filter((user) => {
    const matchesSearch = [user.name, user.email, user.role]
      .some((value) => value?.toLowerCase().includes(searchQuery.trim().toLowerCase()));
    const matchesStatus = statusFilter === "all" || (user.isActive !== false) === (statusFilter === "active");
    return matchesSearch && matchesStatus;
  });

  const importUserUpdates = async (rows) => {
    const byEmail = new Map(users.map((user) => [user.email.toLowerCase(), user]));
    let updated = 0;
    let skipped = 0;
    for (const row of rows) {
      const email = String(row.email || row.Email || "").trim().toLowerCase();
      const name = String(row.name || row.Name || "").trim();
      const existing = byEmail.get(email);
      if (!name || !email) {
        skipped += 1;
        continue;
      }
      if (existing) {
        await authService.updateUser(existing._id, { name, ...(row.role ? { role: row.role } : {}) });
      } else {
        const password = String(row.password || row.Password || "");
        if (password.length < 6) {
          skipped += 1;
          continue;
        }
        await authService.createAdminUser({ name, email, password, role: "user" });
        byEmail.set(email, { name, email, role: "user" });
      }
      updated += 1;
    }
    await fetchUsers();
    toast.success(`Processed ${updated} users; skipped ${skipped} invalid rows.`);
    return `Processed ${updated}; skipped ${skipped}`;
  };

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

  const toggleUserStatus = async (user) => {
    try {
      setUpdatingStatusId(user._id);
      const nextIsActive = user.isActive === false;
      const response = await authService.updateUser(user._id, { isActive: nextIsActive });
      if (response.user?.isActive !== nextIsActive) {
        throw new Error("The server did not confirm the user status change.");
      }
      setUsers((current) => current.map((item) => item._id === user._id ? response.user : item));
      toast.success(`User set to ${response.user.isActive ? "active" : "inactive"}.`);
    } catch (err) {
      toast.error(err.formattedMessage || err.message || "Failed to update user status.");
    } finally {
      setUpdatingStatusId(null);
    }
  };

  return (
    <div className="animate-fade-in responsive-page admin-users-page">
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "1rem", marginBottom: "1.25rem" }}>
        <h1 style={{ fontSize: "1.75rem", marginBottom: "0.4rem" }}>User Accounts</h1>
        <p style={{ color: "var(--text-muted)", fontSize: "0.95rem" }}>
          Registered students, instructors, and system administrators.
        </p>
        <AdminExcelToolbar
          rows={users.map((user) => ({ _id: user._id, name: user.name, email: user.email, role: user.role, enrolledCourses: user.enrolledCourses?.length || 0, createdAt: user.createdAt }))}
          sheetName="Users"
          fileName="classstream-users"
          onImport={importUserUpdates}
          onError={(error) => toast.error(error.formattedMessage || error.message || "Could not import user updates.")}
        />
      </div>

      <div className="admin-list-toolbar">
        <div className="input-with-icon" style={{ flex: "1 1 280px", minWidth: 0 }}>
          <Search className="input-icon-left" size={17} />
          <input className="form-control" type="search" aria-label="Search users" placeholder="Search name, email, or role..." value={searchQuery} onChange={(event) => setSearchQuery(event.target.value)} style={{ paddingLeft: "2.5rem" }} />
        </div>
        <select className="form-control" aria-label="Filter users by status" value={statusFilter} onChange={(event) => setStatusFilter(event.target.value)} style={{ flex: "0 1 200px" }}>
          <option value="all">All Statuses</option>
          <option value="active">Active</option>
          <option value="inactive">Inactive</option>
        </select>
      </div>

      {loading ? (
        <div className="skeleton" style={{ width: "100%", height: "260px", borderRadius: "var(--radius-lg)" }} />
      ) : filteredUsers.length > 0 ? (
        <div className="table-responsive">
          <table className="table">
            <thead>
              <tr>
                <th>User</th>
                <th>Email</th>
                <th>Role</th>
                <th>Enrolled Courses</th>
                <th>Joined</th>
                <th>Status</th>
                <th style={{ textAlign: "right" }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredUsers.map((u) => (
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
                    {new Date(u.createdAt).toLocaleString("en-IN", {
                      day: "numeric",
                      month: "short",
                      year: "numeric",
                      hour: "numeric",
                      minute: "2-digit",
                    })}
                  </td>
                  <td>
                    <button
                      type="button"
                      onClick={() => toggleUserStatus(u)}
                      disabled={updatingStatusId === u._id}
                      aria-label={`Set ${u.name} ${u.isActive === false ? "active" : "inactive"}`}
                      aria-pressed={u.isActive !== false}
                      className="btn btn-sm"
                      style={{
                        minWidth: "88px",
                        background: u.isActive === false ? "var(--danger-bg)" : "var(--success-bg)",
                        border: `1px solid ${u.isActive === false ? "#fecaca" : "var(--success-border)"}`,
                        color: u.isActive === false ? "var(--danger)" : "var(--success)",
                        fontWeight: 700,
                      }}
                    >
                      {updatingStatusId === u._id ? "Saving..." : u.isActive === false ? "Inactive" : "Active"}
                    </button>
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
          <h4>{users.length ? "No Matching Users" : "No Users Registered"}</h4>
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
