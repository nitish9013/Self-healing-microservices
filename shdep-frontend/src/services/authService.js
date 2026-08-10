import apiClient from "../api/apiClient";
import { API } from "../config/apiConfig";

const authService = {

  register: async (userData) => {
    const response = await apiClient.post(
      API.AUTH.REGISTER,
      userData
    );

    return response.data;
  },

  login: async (credentials) => {
    const response = await apiClient.post(
      API.AUTH.LOGIN,
      credentials
    );

    return response.data;
  },

};

export default authService;