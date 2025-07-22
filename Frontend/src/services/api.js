import axios from "axios";

const api = axios.create({
  baseURL: import.meta.env.VITE_BACKEND_URL
});

export const apiService = {
  resetChatState: async () => {
    try {
      const response = await api.post("/api/reset");
      return {
        success: true,
        status: response.status,
        data: response.data,
      };
    } catch (error) {
      console.error("Error resetting chat state:", error);
      return {
        success: false,
        status: error.response?.status || 500,
        error: error.message,
      };
    }
  },

  sendUserQuery: async (uniqueId, userQuery) => {
    console.log("Sending user query:", userQuery);
    console.log("Unique ID:", uniqueId);
    try {
      const response = await api.post("/api/userquery/", {
        unique_id: uniqueId,
        user_query: userQuery,
      });

      return {
        success: true,
        status: response.status,
        data: response.data,
      };
    } catch (error) {
      console.error("Error sending user query:", error);
      return {
        success: false,
        status: error.response?.status || 500,
        error: error.message,
        data: error.response?.data,
      };
    }
  },
};

export default api;
