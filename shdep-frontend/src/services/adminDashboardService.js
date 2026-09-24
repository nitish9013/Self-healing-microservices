import apiClient from "../api/apiClient";

const getAdminAnalytics = async () => {
    const response = await apiClient.get("/admin/analytics");
    return response.data;
};
export async function getServiceHealth() {
    const response = await apiClient.get("/admin/services");

    return response.data;
}

export async function getCircuitBreakerStatus() {
    const response = await apiClient.get("/admin/circuit-breaker");
    return response.data;
}

export { getAdminAnalytics };