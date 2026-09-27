import apiClient from "../api/apiClient";


export async function getAdminPayments() {

    const response = await apiClient.get(
        "/api/payments/admin/all"
    );

    return response.data;
}


export async function refundPayment(paymentId) {

    const response = await apiClient.post(
        "/api/payments/refund",
        {
            paymentId,
        }
    );

    return response.data;
}