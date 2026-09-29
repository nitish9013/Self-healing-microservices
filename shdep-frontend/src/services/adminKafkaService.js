import apiClient from "../api/apiClient";

export async function getKafkaStatus() {

    const response =
        await apiClient.get("/admin/kafka");

    return response.data;
}
export async function getKafkaOverview() {

    const response =
        await apiClient.get(
            "/admin/kafka/overview"
        );

    return response.data;
}