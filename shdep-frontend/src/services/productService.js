import apiClient from "../api/apiClient";

export async function getProducts() {
    const response = await apiClient.get("/catalog/api/products/all");
    return response.data;
}

export async function getProductById(productId) {
    const response = await apiClient.get(`/catalog/api/products/${productId}`);
    return response.data;
}