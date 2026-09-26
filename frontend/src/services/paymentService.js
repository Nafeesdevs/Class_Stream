import api from "./api";

export const paymentService = {
  async createOrder(courseId) {
    const response = await api.post("/payment/create-order", { courseId });
    return response.data;
  },

  async verifyPayment(paymentData) {
    const response = await api.post("/payment/verify", paymentData);
    return response.data;
  },

  async getMyPayments() {
    const response = await api.get("/payment/my-payments");
    return response.data;
  },

  async getAdminPayments() {
    const response = await api.get("/admin/payments");
    return response.data;
  },

  async getAdminEnrollments() {
    const response = await api.get("/admin/enrollments");
    return response.data;
  },

  async getAdminStats() {
    const response = await api.get("/admin/stats");
    return response.data;
  },
};

export default paymentService;
