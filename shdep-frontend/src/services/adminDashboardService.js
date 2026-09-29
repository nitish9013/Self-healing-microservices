import apiClient from "../api/apiClient";

const getAdminAnalytics = async () => {
    const response =
        await apiClient.get("/admin/analytics");

    return response.data;
};

export async function getServiceHealth() {

    const response =
        await apiClient.get("/admin/services");

    return response.data;
}

export async function getCircuitBreakerStatus() {

    const response =
        await apiClient.get(
            "/admin/circuit-breaker"
        );

    return response.data;
}

export async function getRetryStatus() {

    const response =
        await apiClient.get(
            "/admin/retries"
        );

    return response.data;
}

export async function getServiceRuntime() {

    const response =
        await apiClient.get(
            "/admin/services/runtime"
        );

    return response.data;
}


/*
 * ============================================
 * CENTRALIZED LOGS
 * ============================================
 */

export async function getAdminLogs({
    service = "",
    level = "",
    search = "",
    limit = 100,
} = {}) {

    const params = {
        limit,
    };

    if (service) {
        params.service = service;
    }

    if (level) {
        params.level = level;
    }

    if (search) {
        params.search = search;
    }

    const response =
        await apiClient.get(
            "/admin/logs",
            {
                params,
            }
        );

    return response.data;
}


export async function getAdminAlerts({
    service = "",
    severity = "",
    type = "",
} = {}) {

    const params = {};

    if (service) {
        params.service = service;
    }

    if (severity) {
        params.severity = severity;
    }

    if (type) {
        params.type = type;
    }

    const response =
        await apiClient.get(
            "/admin/alerts",
            {
                params,
            }
        );

    return response.data;
}


export {
    getAdminAnalytics,
};