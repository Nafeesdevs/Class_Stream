import api from "./api";

const growthHighlightService = {
  getGrowthHighlights: async () => {
    const response = await api.get("/growth-highlights");
    return response.data;
  },
  updateGrowthHighlights: async (stats) => {
    const response = await api.put("/growth-highlights", { stats });
    return response.data;
  },
};

export default growthHighlightService;