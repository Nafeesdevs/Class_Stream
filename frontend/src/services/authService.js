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

  async updateUser(id, data) {
    const response = await api.put(`/user/${id}`, data);
    return response.data;
  },

  async deleteUser(id) {
    const response = await api.delete(`/user/${id}`);
    return response.data;
  },
};

export default authService;
