import apiClient from "../api/apiClient";

export async function getAdminUsers() {
    const response = await apiClient.get("/auth/users");
    return response.data;
}