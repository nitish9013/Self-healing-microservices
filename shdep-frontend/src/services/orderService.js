const API_BASE = "/orders/api/orders";

function getToken() {
    return localStorage.getItem("token");
}

async function handleResponse(response) {

    // =========================
    // Unauthorized
    // =========================
    if (response.status === 401) {
        localStorage.removeItem("token");

        window.location.href = "/login";

        throw new Error(
            "Session expired. Please login again."
        );
    }

    // =========================
    // Forbidden
    // =========================
    if (response.status === 403) {
        throw new Error(
            "You do not have permission to perform this operation."
        );
    }

    // =========================
    // Service unavailable
    // =========================
    if (response.status === 503) {
        throw new Error(
            "Order service is temporarily unavailable. Please try again later."
        );
    }

    // =========================
    // Not Found
    // =========================
    if (response.status === 404) {
        throw new Error(
            "The requested resource was not found."
        );
    }

    // =========================
    // Too Many Requests
    // =========================
    if (response.status === 429) {
        throw new Error(
            "Too many requests. Please try again later."
        );
    }

    // =========================
    // Other server errors
    // =========================
    if (!response.ok) {

        let message = "Something went wrong.";

        try {

            const contentType =
                response.headers.get("content-type");

            if (
                contentType &&
                contentType.includes("application/json")
            ) {
                const error = await response.json();

                message =
                    error.message ||
                    error.error ||
                    message;

            } else {

                const text =
                    await response.text();

                if (text.trim()) {
                    message = text;
                }
            }

        } catch {
            // Keep default message
        }

        throw new Error(message);
    }

    // =========================
    // Successful response
    // =========================
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