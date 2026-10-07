// User Settings service managing application preferences

const getStorageKey = () => {
    const userId = localStorage.getItem("userId") || "default";
    return `shdep_user_settings_${userId}`;
};

export const DEFAULT_USER_SETTINGS = {
    // Appearance
    theme: "dark",
    compactMode: false,
    enableAnimations: true,
    language: "en",

    // Notifications
    emailOrderUpdates: true,
    emailPaymentReceipts: true,
    emailPriceAlerts: false,
    inAppNotifications: true,
    soundAlerts: false,

    // Security & Privacy
    twoFactorAuth: false,
    sessionTimeout: "60", // minutes
    rememberDevice: true,

    // Microservices / Developer
    showLatencyBadges: true,
    kafkaEventToasts: true,
    autoHealthCheck: true,
    healthPollingInterval: "30", // seconds
};

export const settingsService = {
    getSettings: () => {
        try {
            const raw = localStorage.getItem(getStorageKey());
            if (!raw) {
                localStorage.setItem(getStorageKey(), JSON.stringify(DEFAULT_USER_SETTINGS));
                return DEFAULT_USER_SETTINGS;
            }
            return {
                ...DEFAULT_USER_SETTINGS,
                ...JSON.parse(raw),
            };
        } catch (e) {
            console.error("Failed to load settings:", e);
            return DEFAULT_USER_SETTINGS;
        }
    },

    saveSettings: (settings) => {
        try {
            const updated = {
                ...DEFAULT_USER_SETTINGS,
                ...settings,
            };
            localStorage.setItem(getStorageKey(), JSON.stringify(updated));
            window.dispatchEvent(new CustomEvent("shdep_settings_updated", { detail: updated }));
            return true;
        } catch (e) {
            console.error("Failed to save settings:", e);
            return false;
        }
    },

    resetSettings: () => {
        try {
            localStorage.setItem(getStorageKey(), JSON.stringify(DEFAULT_USER_SETTINGS));
            window.dispatchEvent(new CustomEvent("shdep_settings_updated", { detail: DEFAULT_USER_SETTINGS }));
            return DEFAULT_USER_SETTINGS;
        } catch {
            return DEFAULT_USER_SETTINGS;
        }
    },
};

export default settingsService;
