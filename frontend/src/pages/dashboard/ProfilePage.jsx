// import React, { useState } from "react";
// import { useAuth } from "../../context/AuthContext";
// import { useToast } from "../../context/ToastContext";
// import { User, Mail, Shield, Save, Camera } from "lucide-react";

// export const ProfilePage = () => {
//   const { user, updateUserProfile } = useAuth();
//   const toast = useToast();

//   const [name, setName] = useState(user?.name || "");
//   const [email, setEmail] = useState(user?.email || "");
//   const [avatar, setAvatar] = useState(user?.avatar || "");
//   const [loading, setLoading] = useState(false);

//   const handleUpdate = async (e) => {
//     e.preventDefault();
//     try {
//       setLoading(true);
//       await updateUserProfile({ name, email, avatar });
//       toast.success("Profile updated successfully!");
//     } catch (err) {
//       toast.error(err.formattedMessage || "Failed to update profile.");
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <div className="animate-fade-in responsive-page profile-page" style={{ maxWidth: "680px" }}>
//       <div style={{ marginBottom: "2rem" }}>
//         <h1 style={{ fontSize: "1.75rem", marginBottom: "0.5rem" }}>Profile Settings</h1>
//         <p style={{ color: "var(--text-muted)", fontSize: "0.95rem" }}>
//           Manage your account credentials, display name, and avatar settings.
//         </p>
//       </div>

//       <div className="card" style={{ padding: "2rem" }}>
//         {/* User Visual Card */}
//         <div style={{ display: "flex", alignItems: "center", gap: "1.25rem", paddingBottom: "1.75rem", marginBottom: "1.75rem", borderBottom: "1px solid var(--border-light)" }}>
//           <div
//             style={{
//               width: "72px",
//               height: "72px",
//               borderRadius: "50%",
//               background: "var(--primary)",
//               color: "#ffffff",
//               display: "flex",
//               alignItems: "center",
//               justifyContent: "center",
//               fontSize: "1.8rem",
//               fontWeight: 800,
//               overflow: "hidden",
//             }}
//           >
//             {avatar ? (
//               <img src={avatar} alt={user?.name} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
//             ) : (
//               user?.name?.charAt(0).toUpperCase() || "U"
//             )}
//           </div>
//           <div>
//             <h3 style={{ fontSize: "1.25rem" }}>{user?.name}</h3>
//             <div style={{ fontSize: "0.85rem", color: "var(--text-muted)", marginTop: "2px" }}>
//               {user?.email}
//             </div>
//             <div style={{ marginTop: "0.5rem" }}>
//               <span className={`badge ${user?.role === "admin" ? "badge-sub" : "badge-primary"}`}>
//                 Role: {user?.role?.toUpperCase()}
//               </span>
//             </div>
//           </div>
//         </div>

//         {/* Update Form */}
//         <form onSubmit={handleUpdate}>
//           <div className="form-group">
//             <label className="form-label">Display Name</label>
//             <div className="input-with-icon">
//               <User className="input-icon-left" size={18} />
//               <input
//                 type="text"
//                 required
//                 value={name}
//                 onChange={(e) => setName(e.target.value)}
//                 className="form-control"
//               />
//             </div>
//           </div>

//           <div className="form-group">
//             <label className="form-label">Email Address</label>
//             <div className="input-with-icon">
//               <Mail className="input-icon-left" size={18} />
//               <input
//                 type="email"
//                 required
//                 value={email}
//                 onChange={(e) => setEmail(e.target.value)}
//                 className="form-control"
//               />
//             </div>
//           </div>

//           <div className="form-group">
//             <label className="form-label">Avatar Image URL (Optional)</label>
//             <div className="input-with-icon">
//               <Camera className="input-icon-left" size={18} />
//               <input
//                 type="url"
//                 placeholder="https://images.unsplash.com/..."
//                 value={avatar}
//                 onChange={(e) => setAvatar(e.target.value)}
//                 className="form-control"
//               />
//             </div>
//           </div>

//           <div style={{ marginTop: "2rem" }}>
//             <button
//               type="submit"
//               disabled={loading}
//               className="btn btn-primary"
//               style={{ gap: "0.5rem" }}
//             >
//               <Save size={18} />
//               <span>{loading ? "Saving Changes..." : "Save Profile"}</span>
//             </button>
//           </div>
//         </form>
//       </div>
//     </div>
//   );
// };

// export default ProfilePage;


import React, { useState } from "react";
import { createPortal } from "react-dom";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { useToast } from "../../context/ToastContext";
import authService from "../../services/authService";
import {
  User,
  Mail,
  Shield,
  Save,
  Camera,
  Trash2,
  Lock,
  Eye,
  EyeOff,
  X,
  ShieldCheck,
  AlertTriangle,
} from "lucide-react";

const MIN_REASON = 10;
const MAX_REASON = 500;

/* Responsive tweaks for the Delete Account card and dialog */
const responsiveCss = `
  .profile-page .danger-zone-btn { white-space: nowrap; }

  @media (max-width: 768px) {
    .profile-page .danger-zone-card { padding: 1.25rem !important; }
  }

  @media (max-width: 600px) {
    .profile-page .danger-zone-inner { flex-direction: column; align-items: stretch !important; }
    .profile-page .danger-zone-btn { width: 100%; justify-content: center; }
  }

  @media (max-width: 600px) {
    .delete-account-dialog .card-footer {
      flex-direction: column-reverse;
    }
    .delete-account-dialog .card-footer .btn {
      width: 100%;
      justify-content: center;
    }
  }
`;

export const ProfilePage = () => {
  const { user, updateUserProfile, logout } = useAuth();
  const toast = useToast();
  const navigate = useNavigate();

  const [name, setName] = useState(user?.name || "");
  const [email, setEmail] = useState(user?.email || "");
  const [avatar, setAvatar] = useState(user?.avatar || "");
  const [loading, setLoading] = useState(false);

  // ----- Delete account flow -----
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [deleteStep, setDeleteStep] = useState(1); // 1 = password, 2 = reason
  const [deletePassword, setDeletePassword] = useState("");
  const [showDeletePassword, setShowDeletePassword] = useState(false);
  const [verificationToken, setVerificationToken] = useState("");
  const [deleteReason, setDeleteReason] = useState("");
  const [deleteError, setDeleteError] = useState("");
  const [deleteBusy, setDeleteBusy] = useState(false);

  const handleUpdate = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      await updateUserProfile({ name, email, avatar });
      toast.success("Profile updated successfully!");
    } catch (err) {
      toast.error(err.formattedMessage || "Failed to update profile.");
    } finally {
      setLoading(false);
    }
  };

  const openDeleteDialog = () => {
    setDeleteStep(1);
    setDeletePassword("");
    setShowDeletePassword(false);
    setVerificationToken("");
    setDeleteReason("");
    setDeleteError("");
    setDeleteOpen(true);
  };

  const closeDeleteDialog = () => {
    if (deleteBusy) return;
    setDeleteOpen(false);
    setDeletePassword("");
    setVerificationToken("");
    setDeleteReason("");
    setDeleteError("");
  };

  // Step 1: check the password
  const handleVerifyPassword = async (e) => {
    e.preventDefault();
    if (!deletePassword) {
      setDeleteError("Please enter your password.");
      return;
    }
    try {
      setDeleteBusy(true);
      setDeleteError("");
      const res = await authService.verifyDeletePassword(deletePassword);
      setVerificationToken(res.verificationToken);
      setDeletePassword(""); // don't keep the password in memory longer than needed
      setDeleteStep(2);
    } catch (err) {
      setDeleteError(err.formattedMessage || "Could not verify your password.");
    } finally {
      setDeleteBusy(false);
    }
  };

  // Step 2: send the request with the reason
  const handleSendRequest = async (e) => {
    e.preventDefault();
    const cleanReason = deleteReason.trim();
    if (cleanReason.length < MIN_REASON) {
      setDeleteError(`Please describe your reason in at least ${MIN_REASON} characters.`);
      return;
    }
    try {
      setDeleteBusy(true);
      setDeleteError("");
      await authService.requestAccountDeletion(verificationToken, cleanReason);

      // The account is now locked. Go to the login page with the "pending"
      // notice first, then clear the session.
      toast.info("Your delete request has been sent to the admin.");
      navigate("/login", { replace: true, state: { deletionPending: true } });
      await logout();
    } catch (err) {
      if (err.errorCode === "VERIFICATION_EXPIRED") {
        // Took too long - ask for the password again.
        setVerificationToken("");
        setDeleteStep(1);
      }
      setDeleteError(err.formattedMessage || "Could not send your request.");
    } finally {
      setDeleteBusy(false);
    }
  };

  return (
    <div className="animate-fade-in responsive-page profile-page" style={{ maxWidth: "680px" }}>
      <style>{responsiveCss}</style>

      <div style={{ marginBottom: "2rem" }}>
        <h1 style={{ fontSize: "1.75rem", marginBottom: "0.5rem" }}>Profile Settings</h1>
        <p style={{ color: "var(--text-muted)", fontSize: "0.95rem" }}>
          Manage your account credentials, display name, and avatar settings.
        </p>
      </div>

      <div className="card" style={{ padding: "2rem" }}>
        {/* User Visual Card */}
        <div style={{ display: "flex", alignItems: "center", gap: "1.25rem", paddingBottom: "1.75rem", marginBottom: "1.75rem", borderBottom: "1px solid var(--border-light)" }}>
          <div
            style={{
              width: "72px",
              height: "72px",
              borderRadius: "50%",
              background: "var(--primary)",
              color: "#ffffff",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: "1.8rem",
              fontWeight: 800,
              overflow: "hidden",
            }}
          >
            {avatar ? (
              <img src={avatar} alt={user?.name} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
            ) : (
              user?.name?.charAt(0).toUpperCase() || "U"
            )}
          </div>
          <div>
            <h3 style={{ fontSize: "1.25rem" }}>{user?.name}</h3>
            <div style={{ fontSize: "0.85rem", color: "var(--text-muted)", marginTop: "2px" }}>
              {user?.email}
            </div>
            <div style={{ marginTop: "0.5rem" }}>
              <span className={`badge ${user?.role === "admin" ? "badge-sub" : "badge-primary"}`}>
                Role: {user?.role?.toUpperCase()}
              </span>
            </div>
          </div>
        </div>

        {/* Update Form */}
        <form onSubmit={handleUpdate}>
          <div className="form-group">
            <label className="form-label">Display Name</label>
            <div className="input-with-icon">
              <User className="input-icon-left" size={18} />
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="form-control"
              />
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">Email Address</label>
            <div className="input-with-icon">
              <Mail className="input-icon-left" size={18} />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="form-control"
              />
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">Avatar Image URL (Optional)</label>
            <div className="input-with-icon">
              <Camera className="input-icon-left" size={18} />
              <input
                type="url"
                placeholder="https://images.unsplash.com/..."
                value={avatar}
                onChange={(e) => setAvatar(e.target.value)}
                className="form-control"
              />
            </div>
          </div>

          <div style={{ marginTop: "2rem" }}>
            <button
              type="submit"
              disabled={loading}
              className="btn btn-primary"
              style={{ gap: "0.5rem" }}
            >
              <Save size={18} />
              <span>{loading ? "Saving Changes..." : "Save Profile"}</span>
            </button>
          </div>
        </form>
      </div>

      {/* Delete Account (students only - admin accounts cannot be removed here) */}
      {user?.role !== "admin" && (
        <div
          className="card danger-zone-card"
          style={{ padding: "1.5rem 2rem", marginTop: "1.5rem", borderColor: "#fecaca" }}
        >
          <div
            className="danger-zone-inner"
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              gap: "1rem",
            }}
          >
            <div style={{ display: "flex", alignItems: "flex-start", gap: "0.85rem", flex: 1, minWidth: 0 }}>
              <div
                style={{
                  width: "40px",
                  height: "40px",
                  borderRadius: "var(--radius-full)",
                  background: "var(--danger-bg)",
                  color: "var(--danger)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  flexShrink: 0,
                }}
              >
                <Trash2 size={19} />
              </div>
              <div>
                <h3 style={{ fontSize: "1.05rem", marginBottom: "0.25rem" }}>Delete Account</h3>
                <p style={{ color: "var(--text-muted)", fontSize: "0.875rem", lineHeight: 1.6 }}>
                  Ask the admin to permanently delete your account and course progress. You will be
                  asked for your password first, and the request must be approved by an admin.
                </p>
              </div>
            </div>

            <button
              type="button"
              onClick={openDeleteDialog}
              className="btn btn-outline btn-sm danger-zone-btn"
              style={{ color: "var(--danger)", borderColor: "#fca5a5", gap: "0.4rem" }}
            >
              <Trash2 size={15} />
              <span>Delete My Account</span>
            </button>
          </div>
        </div>
      )}

      {/* Delete Account dialog: step 1 = password, step 2 = reason */}
      {deleteOpen &&
        createPortal(
          <div className="modal-backdrop" onClick={closeDeleteDialog}>
            <style>{responsiveCss}</style>
            <div
              className="modal-dialog animate-modal delete-account-dialog"
              role="dialog"
              aria-modal="true"
              aria-labelledby="delete-account-title"
              onClick={(e) => e.stopPropagation()}
              style={{ maxWidth: "480px" }}
            >
              <div className="card-header">
                <div style={{ display: "flex", alignItems: "center", gap: "0.65rem", minWidth: 0 }}>
                  <div
                    style={{
                      width: "36px",
                      height: "36px",
                      borderRadius: "var(--radius-full)",
                      background: "var(--danger-bg)",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      color: "var(--danger)",
                      flexShrink: 0,
                    }}
                  >
                    <AlertTriangle size={18} />
                  </div>
                  <div style={{ minWidth: 0 }}>
                    <h3 id="delete-account-title" style={{ fontSize: "1.15rem" }}>
                      Delete Account
                    </h3>
                    <div style={{ fontSize: "0.75rem", color: "var(--text-muted)" }}>
                      Step {deleteStep} of 2
                    </div>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={closeDeleteDialog}
                  aria-label="Close"
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

              {deleteStep === 1 ? (
                <form onSubmit={handleVerifyPassword}>
                  <div className="card-body">
                    <div
                      style={{
                        padding: "0.75rem 1rem",
                        borderRadius: "var(--radius-md)",
                        backgroundColor: "var(--danger-bg)",
                        color: "var(--danger)",
                        fontSize: "0.85rem",
                        lineHeight: 1.6,
                        border: "1px solid #fecaca",
                        marginBottom: "1.25rem",
                      }}
                    >
                      Once the admin approves, your account, enrollments and learning progress are
                      deleted permanently and cannot be recovered. Payment records are kept for
                      accounting.
                    </div>

                    <div className="form-group" style={{ marginBottom: 0 }}>
                      <label className="form-label">Enter your password to continue</label>
                      <div className="input-with-icon">
                        <Lock className="input-icon-left" size={18} />
                        <input
                          type={showDeletePassword ? "text" : "password"}
                          autoFocus
                          autoComplete="current-password"
                          placeholder="••••••••"
                          value={deletePassword}
                          onChange={(e) => setDeletePassword(e.target.value)}
                          className="form-control"
                        />
                        <button
                          type="button"
                          className="input-icon-right"
                          onClick={() => setShowDeletePassword(!showDeletePassword)}
                          aria-label="Toggle password visibility"
                        >
                          {showDeletePassword ? <EyeOff size={18} /> : <Eye size={18} />}
                        </button>
                      </div>
                    </div>

                    {deleteError && (
                      <div
                        role="alert"
                        style={{
                          padding: "0.75rem 1rem",
                          borderRadius: "var(--radius-md)",
                          backgroundColor: "var(--danger-bg)",
                          color: "var(--danger)",
                          fontSize: "0.875rem",
                          marginTop: "1rem",
                          border: "1px solid #fecaca",
                        }}
                      >
                        {deleteError}
                      </div>
                    )}
                  </div>

                  <div
                    className="card-footer"
                    style={{ display: "flex", justifyContent: "flex-end", gap: "0.75rem" }}
                  >
                    <button
                      type="button"
                      onClick={closeDeleteDialog}
                      disabled={deleteBusy}
                      className="btn btn-outline btn-sm"
                    >
                      Cancel
                    </button>
                    <button type="submit" disabled={deleteBusy} className="btn btn-primary btn-sm">
                      {deleteBusy ? "Verifying..." : "Verify & Continue"}
                    </button>
                  </div>
                </form>
              ) : (
                <form onSubmit={handleSendRequest}>
                  <div className="card-body">
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "0.45rem",
                        fontSize: "0.82rem",
                        fontWeight: 600,
                        color: "var(--success)",
                        marginBottom: "1rem",
                      }}
                    >
                      <ShieldCheck size={16} />
                      <span>Password verified</span>
                    </div>

                    <div className="form-group" style={{ marginBottom: 0 }}>
                      <label className="form-label">Why do you want to delete your account?</label>
                      <textarea
                        rows={4}
                        autoFocus
                        maxLength={MAX_REASON}
                        placeholder="Tell the admin the reason for your request..."
                        value={deleteReason}
                        onChange={(e) => setDeleteReason(e.target.value)}
                        className="form-control"
                        style={{ resize: "vertical", minHeight: "110px" }}
                      />
                      <div
                        className="form-helper"
                        style={{ display: "flex", justifyContent: "space-between", gap: "0.75rem" }}
                      >
                        <span>Minimum {MIN_REASON} characters</span>
                        <span>
                          {deleteReason.length}/{MAX_REASON}
                        </span>
                      </div>
                    </div>

                    <p style={{ color: "var(--text-muted)", fontSize: "0.82rem", lineHeight: 1.6, marginTop: "1rem" }}>
                      Your request goes to the admin. You will be signed out and cannot sign in
                      again until the admin reviews it.
                    </p>

                    {deleteError && (
                      <div
                        role="alert"
                        style={{
                          padding: "0.75rem 1rem",
                          borderRadius: "var(--radius-md)",
                          backgroundColor: "var(--danger-bg)",
                          color: "var(--danger)",
                          fontSize: "0.875rem",
                          marginTop: "1rem",
                          border: "1px solid #fecaca",
                        }}
                      >
                        {deleteError}
                      </div>
                    )}
                  </div>

                  <div
                    className="card-footer"
                    style={{ display: "flex", justifyContent: "flex-end", gap: "0.75rem" }}
                  >
                    <button
                      type="button"
                      onClick={closeDeleteDialog}
                      disabled={deleteBusy}
                      className="btn btn-outline btn-sm"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      disabled={deleteBusy || deleteReason.trim().length < MIN_REASON}
                      className="btn btn-danger btn-sm"
                    >
                      {deleteBusy ? "Sending..." : "Send Delete Request"}
                    </button>
                  </div>
                </form>
              )}
            </div>
          </div>,
          document.body
        )}
    </div>
  );
};

export default ProfilePage;
