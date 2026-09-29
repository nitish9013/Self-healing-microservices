import apiClient from "../api/apiClient";

export async function getSystemMetrics() {
    const response = await apiClient.get(
        "/admin/system/metrics"
    );

    return response.data;
}