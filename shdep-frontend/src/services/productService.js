const API_BASE = "catalog/api/products";

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
            "You do not have permission to access products."
        );
    }

    if (!response.ok) {
        let message = "Unable to fetch products.";

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

export async function getProducts() {

    const response = await fetch(
        `${API_BASE}/all`,
        {
            method: "GET",
            headers: {
                "Authorization": `Bearer ${getToken()}`
            }
        }
    );

    return handleResponse(response);
}

export async function getProductById(productId) {

    const response = await fetch(
        `${API_BASE}/${productId}`,
        {
            method: "GET",
            headers: {
                "Authorization": `Bearer ${getToken()}`
            }
        }
    );

    return handleResponse(response);
}