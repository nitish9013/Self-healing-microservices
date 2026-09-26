import apiClient from "../api/apiClient";

export async function getAdminOrders() {
    const response = await apiClient.get(
        "/orders/api/orders/admin/all"
    );

    return response.data;
}