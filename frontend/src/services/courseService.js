import api from "./api";

export const courseService = {
  async getAllCourses(params = {}) {
    const response = await api.get("/course", { params });
    return response.data;
  },

  async getCourseById(id) {
    const response = await api.get(`/course/${id}`);
    return response.data;
  },

  async createCourse(formData) {
    const response = await api.post("/course", formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
    return response.data;
  },

  async updateCourse(id, formData) {
    const response = await api.put(`/course/${id}`, formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
    return response.data;
  },

  async deleteCourse(id) {
    const response = await api.delete(`/course/${id}`);
    return response.data;
  },

  async enrollFree(id) {
    const response = await api.post(`/course/${id}/enroll`);
    return response.data;
  },

  async getMyCourses() {
    const response = await api.get("/my-courses");
    return response.data;
  },

  async checkVideoAccess(courseId, videoIndex) {
    const response = await api.get(`/course/${courseId}/video-access/${videoIndex}`);
    return response.data;
  },

  async updateProgress(courseId, lessonIndex, completed) {
    const response = await api.post(`/course/${courseId}/progress`, {
      lessonIndex,
      completed,
    });
    return response.data;
  },
};

export default courseService;
