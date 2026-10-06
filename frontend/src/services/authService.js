// import api from "./api";

// export const authService = {
//   async register(name, email, password) {
//     const response = await api.post("/register", { name, email, password });
//     return response.data;
//   },

//   async login(email, password) {
//     const response = await api.post("/login", { email, password });
//     return response.data;
//   },

//   async logout() {
//     const response = await api.get("/logout");
//     return response.data;
//   },

//   async getCurrentUser() {
//     const response = await api.get("/me");
//     return response.data;
//   },

//   async updateProfile(data) {
//     const response = await api.put("/me/update", data);
//     return response.data;
//   },

//   async getAllUsers() {
//     const response = await api.get("/users");
//     return response.data;
//   },

//   async createAdminUser(userData) {
//     const response = await api.post("/admin/users", userData);
//     return response.data;
//   },

//   async updateUser(id, data) {
//     const response = await api.put(`/user/${id}`, data);
//     return response.data;
//   },

//   async deleteUser(id) {
//     const response = await api.delete(`/user/${id}`);
//     return response.data;
//   },
// };

// export default authService;

import api from "./api";

export const authService = {
  async register(name, email, password) {
    const response = await api.post("/register", { name, email, password });
    return response.data;
  },

  async login(email, password) {
    const response = await api.post("/login", { email, password });
    return response.data;
  },

  async logout() {
    const response = await api.get("/logout");
    return response.data;
  },

  async getCurrentUser() {
    const response = await api.get("/me");
    return response.data;
  },

  async updateProfile(data) {
    const response = await api.put("/me/update", data);
    return response.data;
  },

  async getAllUsers() {
    const response = await api.get("/users");
    return response.data;
  },

  async createAdminUser(userData) {
    const response = await api.post("/admin/users", userData);
    return response.data;
  },

  async updateUser(id, data) {
    const response = await api.put(`/user/${id}`, data);
    return response.data;
  },

  async deleteUser(id) {
    const response = await api.delete(`/user/${id}`);
    return response.data;
  },

  // ----- Delete my account (user) -----
  // Step 1: check the password, get a short-lived verification token
  async verifyDeletePassword(password) {
    const response = await api.post("/me/delete-account/verify", { password });
    return response.data;
  },

  // Step 2: send the deletion request with the reason
  async requestAccountDeletion(verificationToken, reason) {
    const response = await api.post("/me/delete-account/request", { verificationToken, reason });
    return response.data;
  },

  // ----- Account deletion requests (admin) -----
  async getDeletionRequests() {
    const response = await api.get("/admin/deletion-requests");
    return response.data;
  },

  async approveDeletionRequest(id) {
    const response = await api.put(`/admin/deletion-requests/${id}/approve`);
    return response.data;
  },

  async rejectDeletionRequest(id) {
    const response = await api.put(`/admin/deletion-requests/${id}/reject`);
    return response.data;
  },
};

export default authService;
