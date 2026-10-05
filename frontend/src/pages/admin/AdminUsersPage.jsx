// import React, { useState, useEffect } from "react";
// import authService from "../../services/authService";
// import { useToast } from "../../context/ToastContext";
// import ConfirmModal from "../../components/common/ConfirmModal";
// import AdminExcelToolbar from "../../components/common/AdminExcelToolbar";
// import { Users, Trash2, Search } from "lucide-react";

// export const AdminUsersPage = () => {
//   const toast = useToast();
//   const [users, setUsers] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [searchQuery, setSearchQuery] = useState("");
//   const [statusFilter, setStatusFilter] = useState("all");
//   const [updatingStatusId, setUpdatingStatusId] = useState(null);

//   const [deleteUserId, setDeleteUserId] = useState(null);
//   const [isDeleting, setIsDeleting] = useState(false);

//   const fetchUsers = async () => {
//     try {
//       setLoading(true);
//       const res = await authService.getAllUsers();
//       if (res?.users) {
//         setUsers(res.users);
//       }
//     } catch (err) {
//       toast.error("Failed to load users list.");
//     } finally {
//       setLoading(false);
//     }
//   };

//   useEffect(() => {
//     fetchUsers();
//   }, []);

//   const filteredUsers = users.filter((user) => {
//     const matchesSearch = [user.name, user.email, user.role]
//       .some((value) => value?.toLowerCase().includes(searchQuery.trim().toLowerCase()));
//     const matchesStatus = statusFilter === "all" || (user.isActive !== false) === (statusFilter === "active");
//     return matchesSearch && matchesStatus;
//   });

//   const importUserUpdates = async (rows) => {
//     const byEmail = new Map(users.map((user) => [user.email.toLowerCase(), user]));
//     let updated = 0;
//     let skipped = 0;
//     for (const row of rows) {
//       const email = String(row.email || row.Email || "").trim().toLowerCase();
//       const name = String(row.name || row.Name || "").trim();
//       const existing = byEmail.get(email);
//       if (!name || !email) {
//         skipped += 1;
//         continue;
//       }
//       if (existing) {
//         await authService.updateUser(existing._id, { name, ...(row.role ? { role: row.role } : {}) });
//       } else {
//         const password = String(row.password || row.Password || "");
//         if (password.length < 6) {
//           skipped += 1;
//           continue;
//         }
//         await authService.createAdminUser({ name, email, password, role: "user" });
//         byEmail.set(email, { name, email, role: "user" });
//       }
//       updated += 1;
//     }
//     await fetchUsers();
//     toast.success(`Processed ${updated} users; skipped ${skipped} invalid rows.`);
//     return `Processed ${updated}; skipped ${skipped}`;
//   };

//   const confirmDelete = async () => {
//     if (!deleteUserId) return;
//     try {
//       setIsDeleting(true);
//       await authService.deleteUser(deleteUserId);
//       toast.success("User account deleted.");
//       setDeleteUserId(null);
//       fetchUsers();
//     } catch (err) {
//       toast.error(err.formattedMessage || "Failed to delete user.");
//     } finally {
//       setIsDeleting(false);
//     }
//   };

//   const toggleUserStatus = async (user) => {
//     try {
//       setUpdatingStatusId(user._id);
//       const nextIsActive = user.isActive === false;
//       const response = await authService.updateUser(user._id, { isActive: nextIsActive });
//       if (response.user?.isActive !== nextIsActive) {
//         throw new Error("The server did not confirm the user status change.");
//       }
//       setUsers((current) => current.map((item) => item._id === user._id ? response.user : item));
//       toast.success(`User set to ${response.user.isActive ? "active" : "inactive"}.`);
//     } catch (err) {
//       toast.error(err.formattedMessage || err.message || "Failed to update user status.");
//     } finally {
//       setUpdatingStatusId(null);
//     }
//   };

//   return (
//     <div className="animate-fade-in responsive-page admin-users-page">
//       <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "1rem", marginBottom: "1.25rem" }}>
//         <h1 style={{ fontSize: "1.75rem", marginBottom: "0.4rem" }}>User Accounts</h1>
//         <p style={{ color: "var(--text-muted)", fontSize: "0.95rem" }}>
//           Registered students, instructors, and system administrators.
//         </p>
//         <AdminExcelToolbar
//           rows={users.map((user) => ({ _id: user._id, name: user.name, email: user.email, role: user.role, enrolledCourses: user.enrolledCourses?.length || 0, createdAt: user.createdAt }))}
//           sheetName="Users"
//           fileName="classstream-users"
//           onImport={importUserUpdates}
//           onError={(error) => toast.error(error.formattedMessage || error.message || "Could not import user updates.")}
//         />
//       </div>

//       <div className="admin-list-toolbar">
//         <div className="input-with-icon" style={{ flex: "1 1 280px", minWidth: 0 }}>
//           <Search className="input-icon-left" size={17} />
//           <input className="form-control" type="search" aria-label="Search users" placeholder="Search name, email, or role..." value={searchQuery} onChange={(event) => setSearchQuery(event.target.value)} style={{ paddingLeft: "2.5rem" }} />
//         </div>
//         <select className="form-control" aria-label="Filter users by status" value={statusFilter} onChange={(event) => setStatusFilter(event.target.value)} style={{ flex: "0 1 200px" }}>
//           <option value="all">All Statuses</option>
//           <option value="active">Active</option>
//           <option value="inactive">Inactive</option>
//         </select>
//       </div>

//       {loading ? (
//         <div className="skeleton" style={{ width: "100%", height: "260px", borderRadius: "var(--radius-lg)" }} />
//       ) : filteredUsers.length > 0 ? (
//         <div className="table-responsive">
//           <table className="table">
//             <thead>
//               <tr>
//                 <th>User</th>
//                 <th>Email</th>
//                 <th>Role</th>
//                 <th>Enrolled Courses</th>
//                 <th>Joined</th>
//                 <th>Status</th>
//                 <th style={{ textAlign: "right" }}>Actions</th>
//               </tr>
//             </thead>
//             <tbody>
//               {filteredUsers.map((u) => (
//                 <tr key={u._id}>
//                   <td>
//                     <div style={{ display: "flex", alignItems: "center", gap: "0.65rem" }}>
//                       <div
//                         style={{
//                           width: "32px",
//                           height: "32px",
//                           borderRadius: "50%",
//                           background: u.role === "admin" ? "var(--secondary)" : "var(--primary)",
//                           color: "#ffffff",
//                           display: "flex",
//                           alignItems: "center",
//                           justifyContent: "center",
//                           fontWeight: 700,
//                           fontSize: "0.85rem",
//                         }}
//                       >
//                         {u.name?.charAt(0).toUpperCase() || "U"}
//                       </div>
//                       <span style={{ fontWeight: 600 }}>{u.name}</span>
//                     </div>
//                   </td>
//                   <td style={{ color: "var(--text-muted)" }}>{u.email}</td>
//                   <td>
//                     <span className={`badge ${u.role === "admin" ? "badge-sub" : "badge-primary"}`}>
//                       {u.role}
//                     </span>
//                   </td>
//                   <td>{u.enrolledCourses?.length || 0}</td>
//                   <td style={{ color: "var(--text-muted)", fontSize: "0.85rem" }}>
//                     {new Date(u.createdAt).toLocaleString("en-IN", {
//                       day: "numeric",
//                       month: "short",
//                       year: "numeric",
//                       hour: "numeric",
//                       minute: "2-digit",
//                     })}
//                   </td>
//                   <td>
//                     <button
//                       type="button"
//                       onClick={() => toggleUserStatus(u)}
//                       disabled={updatingStatusId === u._id}
//                       aria-label={`Set ${u.name} ${u.isActive === false ? "active" : "inactive"}`}
//                       aria-pressed={u.isActive !== false}
//                       className="btn btn-sm"
//                       style={{
//                         minWidth: "88px",
//                         background: u.isActive === false ? "var(--danger-bg)" : "var(--success-bg)",
//                         border: `1px solid ${u.isActive === false ? "#fecaca" : "var(--success-border)"}`,
//                         color: u.isActive === false ? "var(--danger)" : "var(--success)",
//                         fontWeight: 700,
//                       }}
//                     >
//                       {updatingStatusId === u._id ? "Saving..." : u.isActive === false ? "Inactive" : "Active"}
//                     </button>
//                   </td>
//                   <td style={{ textAlign: "right" }}>
//                     <button
//                       onClick={() => setDeleteUserId(u._id)}
//                       className="btn btn-outline btn-icon"
//                       style={{ width: "32px", height: "32px", color: "var(--danger)", borderColor: "#fca5a5" }}
//                       aria-label="Delete user"
//                     >
//                       <Trash2 size={14} />
//                     </button>
//                   </td>
//                 </tr>
//               ))}
//             </tbody>
//           </table>
//         </div>
//       ) : (
//         <div className="empty-state">
//           <h4>{users.length ? "No Matching Users" : "No Users Registered"}</h4>
//         </div>
//       )}

//       <ConfirmModal
//         isOpen={!!deleteUserId}
//         title="Delete User Account"
//         message="Are you sure you want to permanently delete this user account and revoke all their enrollments?"
//         isLoading={isDeleting}
//         onConfirm={confirmDelete}
//         onCancel={() => setDeleteUserId(null)}
//       />
//     </div>
//   );
// };

// export default AdminUsersPage;

import React, { useState, useEffect } from "react";
import authService from "../../services/authService";
import { useToast } from "../../context/ToastContext";
import ConfirmModal from "../../components/common/ConfirmModal";
import AdminExcelToolbar from "../../components/common/AdminExcelToolbar";
import { Users, Trash2, Search } from "lucide-react";

/* Responsive styles: table on desktop, cards on mobile (<= 768px) */
const responsiveCss = `
  .admin-users-page .user-cards { display: none; }

  @media (max-width: 768px) {
    .admin-users-page .admin-users-header {
      flex-direction: column !important;
      align-items: flex-start !important;
      gap: 0.75rem !important;
    }
    .admin-users-page .admin-users-header > div:last-child,
    .admin-users-page .admin-users-header .admin-excel-wrap {
      width: 100%;
    }

    .admin-users-page .admin-list-toolbar { flex-wrap: wrap; }
    .admin-users-page .admin-list-toolbar > * { flex: 1 1 100% !important; }

    /* Hide table, show cards */
    .admin-users-page .user-table-wrap { display: none !important; }
    .admin-users-page .user-cards {
      display: flex;
      flex-direction: column;
      gap: 0.85rem;
    }

    .user-card {
      background: var(--surface, #fff);
      border: 1px solid var(--border);
      border-radius: var(--radius-lg);
      padding: 0.9rem;
      display: flex;
      flex-direction: column;
      gap: 0.8rem;
    }
    .user-card-top {
      display: flex;
      align-items: center;
      gap: 0.75rem;
    }
    .user-card-avatar {
      width: 44px;
      height: 44px;
      border-radius: 50%;
      color: #ffffff;
      display: flex;
      align-items: center;
      justify-content: center;
      font-weight: 700;
      font-size: 1rem;
      flex-shrink: 0;
    }
    .user-card-id { flex: 1; min-width: 0; }
    .user-card-name {
      font-weight: 600;
      font-size: 1rem;
      line-height: 1.3;
      word-break: break-word;
    }
    .user-card-email {
      font-size: 0.78rem;
      color: var(--text-muted);
      margin-top: 0.15rem;
      word-break: break-all;
    }
    .user-card-meta {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 0.65rem 0.75rem;
      padding: 0.75rem;
      background: var(--bg-subtle);
      border-radius: var(--radius-md);
    }
    .user-card-meta-full { grid-column: 1 / -1; }
    .user-card-meta-label {
      font-size: 0.68rem;
      text-transform: uppercase;
      letter-spacing: 0.04em;
      color: var(--text-muted);
      margin-bottom: 0.2rem;
    }
    .user-card-meta-value {
      font-size: 0.88rem;
      font-weight: 600;
      word-break: break-word;
    }
    .user-card-actions {
      display: flex;
      gap: 0.6rem;
      align-items: center;
    }
    .user-card-actions .btn {
      flex: 1;
      display: inline-flex;
      align-items: center;
      justify-content: center;
      gap: 0.4rem;
    }
  }
`;

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
    const matchesSearch = [user.name, user.email, user.role].some((value) =>
      value?.toLowerCase().includes(searchQuery.trim().toLowerCase())
    );
    const matchesStatus =
      statusFilter === "all" || (user.isActive !== false) === (statusFilter === "active");
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
        await authService.updateUser(existing._id, {
          name,
          ...(row.role ? { role: row.role } : {}),
        });
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
      setUsers((current) =>
        current.map((item) => (item._id === user._id ? response.user : item))
      );
      toast.success(`User set to ${response.user.isActive ? "active" : "inactive"}.`);
    } catch (err) {
      toast.error(err.formattedMessage || err.message || "Failed to update user status.");
    } finally {
      setUpdatingStatusId(null);
    }
  };

  const formatJoined = (date) =>
    new Date(date).toLocaleString("en-IN", {
      day: "numeric",
      month: "short",
      year: "numeric",
      hour: "numeric",
      minute: "2-digit",
    });

  const renderStatusButton = (u, extraStyle = {}) => (
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
        ...extraStyle,
      }}
    >
      {updatingStatusId === u._id ? "Saving..." : u.isActive === false ? "Inactive" : "Active"}
    </button>
  );

  return (
    <div className="animate-fade-in responsive-page admin-users-page">
      <style>{responsiveCss}</style>

      <div
        className="admin-users-header"
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          flexWrap: "wrap",
          gap: "1rem",
          marginBottom: "1.25rem",
        }}
      >
        <h1 style={{ fontSize: "1.75rem", marginBottom: "0.4rem" }}>User Accounts</h1>
        <p style={{ color: "var(--text-muted)", fontSize: "0.95rem" }}>
          Registered students, instructors, and system administrators.
        </p>
        <AdminExcelToolbar
          rows={users.map((user) => ({
            _id: user._id,
            name: user.name,
            email: user.email,
            role: user.role,
            enrolledCourses: user.enrolledCourses?.length || 0,
            createdAt: user.createdAt,
          }))}
          sheetName="Users"
          fileName="classstream-users"
          onImport={importUserUpdates}
          onError={(error) =>
            toast.error(error.formattedMessage || error.message || "Could not import user updates.")
          }
        />
      </div>

      <div className="admin-list-toolbar">
        <div className="input-with-icon" style={{ flex: "1 1 280px", minWidth: 0 }}>
          <Search className="input-icon-left" size={17} />
          <input
            className="form-control"
            type="search"
            aria-label="Search users"
            placeholder="Search name, email, or role..."
            value={searchQuery}
            onChange={(event) => setSearchQuery(event.target.value)}
            style={{ paddingLeft: "2.5rem" }}
          />
        </div>
        <select
          className="form-control"
          aria-label="Filter users by status"
          value={statusFilter}
          onChange={(event) => setStatusFilter(event.target.value)}
          style={{ flex: "0 1 200px" }}
        >
          <option value="all">All Statuses</option>
          <option value="active">Active</option>
          <option value="inactive">Inactive</option>
        </select>
      </div>

      {loading ? (
        <div
          className="skeleton"
          style={{ width: "100%", height: "260px", borderRadius: "var(--radius-lg)" }}
        />
      ) : filteredUsers.length > 0 ? (
        <>
          {/* ===== Desktop: table ===== */}
          <div className="table-responsive user-table-wrap">
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
                      {formatJoined(u.createdAt)}
                    </td>
                    <td>{renderStatusButton(u)}</td>
                    <td style={{ textAlign: "right" }}>
                      <button
                        onClick={() => setDeleteUserId(u._id)}
                        className="btn btn-outline btn-icon"
                        style={{
                          width: "32px",
                          height: "32px",
                          color: "var(--danger)",
                          borderColor: "#fca5a5",
                        }}
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

          {/* ===== Mobile: cards ===== */}
          <div className="user-cards">
            {filteredUsers.map((u) => (
              <div className="user-card" key={u._id}>
                <div className="user-card-top">
                  <div
                    className="user-card-avatar"
                    style={{
                      background: u.role === "admin" ? "var(--secondary)" : "var(--primary)",
                    }}
                  >
                    {u.name?.charAt(0).toUpperCase() || "U"}
                  </div>
                  <div className="user-card-id">
                    <div className="user-card-name">{u.name}</div>
                    <div className="user-card-email">{u.email}</div>
                  </div>
                  <span className={`badge ${u.role === "admin" ? "badge-sub" : "badge-primary"}`}>
                    {u.role}
                  </span>
                </div>

                <div className="user-card-meta">
                  <div>
                    <div className="user-card-meta-label">Enrolled Courses</div>
                    <div className="user-card-meta-value">{u.enrolledCourses?.length || 0}</div>
                  </div>
                  <div>
                    <div className="user-card-meta-label">Status</div>
                    <div className="user-card-meta-value">
                      {u.isActive === false ? "Inactive" : "Active"}
                    </div>
                  </div>
                  <div className="user-card-meta-full">
                    <div className="user-card-meta-label">Joined</div>
                    <div className="user-card-meta-value">{formatJoined(u.createdAt)}</div>
                  </div>
                </div>

                <div className="user-card-actions">
                  {renderStatusButton(u, { flex: 1 })}
                  <button
                    onClick={() => setDeleteUserId(u._id)}
                    className="btn btn-outline btn-sm"
                    style={{ color: "var(--danger)", borderColor: "#fca5a5" }}
                    aria-label="Delete user"
                  >
                    <Trash2 size={14} /> Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        </>
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