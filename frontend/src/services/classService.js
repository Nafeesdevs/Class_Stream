import api from "./api";

export const classService = {
  async getAllClasses() {
    const response = await api.get("/class");
    return response.data;
  },

  async createClass(className) {
    const response = await api.post("/class", { className });
    return response.data;
  },

  async updateClass(id, className) {
    const response = await api.put(`/class/${id}`, { className });
    return response.data;
  },

  async deleteClass(id) {
    const response = await api.delete(`/class/${id}`);
    return response.data;
  },
};

export default classService;
