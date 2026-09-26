import api from "./api";

export const categoryService = {
  async getAllCategories() {
    const response = await api.get("/category");
    return response.data;
  },

  async createCategory(formData) {
    const response = await api.post("/category", formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
    return response.data;
  },

  async updateCategory(id, formData) {
    const response = await api.put(`/category/${id}`, formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
    return response.data;
  },

  async deleteCategory(id) {
    const response = await api.delete(`/category/${id}`);
    return response.data;
  },
};

export default categoryService;
