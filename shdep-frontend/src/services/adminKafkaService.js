import apiClient from "../api/apiClient";

export async function getKafkaStatus() {

    const response =
        await apiClient.get("/admin/kafka");

    return response.data;
}