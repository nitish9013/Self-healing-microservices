import apiClient from "../api/apiClient";

const getStorageKey = (userId) => `shdep_user_profile_${userId || "default"}`;

export const userService = {
    getUserProfile: async (userId) => {
        const stored = localStorage.getItem(getStorageKey(userId));
        let localProfile = null;
        if (stored) {
            try {
                localProfile = JSON.parse(stored);
            } catch {
                // Ignore parse errors
            }
        }

        const fallback = {
            userId: userId || localStorage.getItem("userId") || 1,
            name: localProfile?.name || localStorage.getItem("username") || "Nitish Kumar",
            email: localProfile?.email || `${localStorage.getItem("username") || "user"}@shdep.dev`,
            phone: localProfile?.phone || "+91 98765 43210",
            bio: localProfile?.bio || "Cloud Microservices Architect & Fullstack Engineer. Working on SHDEP self-healing infrastructure.",
            role: localStorage.getItem("role") || "USER",
            department: localProfile?.department || "Distributed Systems Engineering",
            location: localProfile?.location || "New Delhi, India",
            avatarUrl: localProfile?.avatarUrl || "",
            createdAt: localProfile?.createdAt || "2024-01-15T10:00:00.000Z",
        };

        if (!userId) {
            return fallback;
        }

        try {
            // Attempt to fetch from backend User microservice via API Gateway
            const response = await apiClient.get(`/users/api/users/${userId}`);
            if (response.data) {
                const merged = {
                    ...fallback,
                    ...response.data,
                    phone: localProfile?.phone || fallback.phone,
                    department: localProfile?.department || fallback.department,
                    location: localProfile?.location || fallback.location,
                    avatarUrl: localProfile?.avatarUrl || fallback.avatarUrl,
                };
                localStorage.setItem(getStorageKey(userId), JSON.stringify(merged));
                return merged;
            }
        } catch (err) {
            console.warn("User microservice unavailable, using cached profile:", err?.message);
        }

        return fallback;
    },

    updateUserProfile: async (userId, profileData) => {
        const current = await userService.getUserProfile(userId);
        const updated = {
            ...current,
            ...profileData,
            userId: userId || current.userId,
        };

        // Save locally first for instant, guaranteed responsiveness
        localStorage.setItem(getStorageKey(userId), JSON.stringify(updated));

        // Attempt to sync with backend User microservice
        try {
            await apiClient.put(`/users/api/users/${userId}`, {
                userId: Number(userId),
                name: updated.name,
                email: updated.email,
                bio: updated.bio,
            });
        } catch (err) {
            console.warn("Could not sync profile to backend User service:", err?.message);
        }

        return updated;
    },
};

export default userService;
