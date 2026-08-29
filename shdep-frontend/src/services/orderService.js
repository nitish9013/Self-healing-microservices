const API_BASE = "orders/api/orders";

function getToken() {
    return localStorage.getItem("token");
}

async function handleResponse(response) {

    if (response.status === 401) {
        localStorage.removeItem("token");
        window.location.href = "/auth.html";
        throw new Error("Session expired. Please login again.");
    }

    if (response.status === 403) {
        throw new Error(
            "You do not have permission to perform this operation."
        );
    }

    if (!response.ok) {

        let message = "Something went wrong.";

        try {
            const error = await response.json();
            message = error.message || message;
        } catch {
            // Non-JSON response
        }

        throw new Error(message);
    }

    return response.json();
}


/*
 * Get orders of currently logged-in user
 */
export async function getOrders() {

    const response = await fetch(
        API_BASE,
        {
            method: "GET",
            headers: {
                "Authorization": `Bearer ${getToken()}`
            }
        }
    );

    return handleResponse(response);
}


/*
 * Create a new order
 *
 * Backend expects:
 * {
 *   productId: UUID,
 *   quantity: number
 * }
 */
export async function createOrder(
    productId,
    quantity
) {

    const response = await fetch(
        API_BASE,
        {
            method: "POST",

            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${getToken()}`
            },

            body: JSON.stringify({
                productId: productId,
                quantity: Number(quantity)
            })
        }
    );

    return handleResponse(response);
}