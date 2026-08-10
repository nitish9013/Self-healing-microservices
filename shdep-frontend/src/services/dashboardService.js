import apiClient from "../api/apiClient";

const dashboardService = {

    getUserDashboard: async (userId) => {

        const response = await apiClient.get(
            `/api/dashboard/home/${userId}`
        );

        return response.data;
    },

};

export default dashboardService;