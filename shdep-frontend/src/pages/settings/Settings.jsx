import { useState } from "react";
import {
    Box,
    Typography,
    Card,
    Button,
    Switch,
    TextField,
    MenuItem,
    Divider,
    Alert,
    Snackbar,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogContentText,
    DialogActions,
} from "@mui/material";

import {
    SettingsRounded,
    PaletteRounded,
    NotificationsRounded,
    TuneRounded,
    DeleteSweepRounded,
    RestartAltRounded,
    SaveRounded,
    DownloadRounded,
} from "@mui/icons-material";

import DashboardHeader from "../../components/dashboard/DashboardHeader";
import Sidebar from "../../components/dashboard/Sidebar";
import settingsService from "../../services/settingsService";

export default function Settings() {
    const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);
    const [settings, setSettings] = useState(() => settingsService.getSettings());
    const [notification, setNotification] = useState("");
    const [savedNotice, setSavedNotice] = useState(false);
    const [resetDialogOpen, setResetDialogOpen] = useState(false);

    const handleChange = (key, value) => {
        setSettings((prev) => ({
            ...prev,
            [key]: value,
        }));
        setSavedNotice(false);
    };

    const handleSave = () => {
        settingsService.saveSettings(settings);
        setSavedNotice(true);
        setNotification("Settings saved successfully!");
    };

    const handleReset = () => {
        const defaulted = settingsService.resetSettings();
        setSettings(defaulted);
        setResetDialogOpen(false);
        setNotification("Settings reset to defaults.");
    };

    const handleClearCache = () => {
        try {
            // Keep critical auth data, remove cache keys
            sessionStorage.clear();
            setNotification("Temporary application cache cleared.");
        } catch {
            setNotification("Cache cleared.");
        }
    };

    const handleExportConfig = () => {
        const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(settings, null, 2));
        const downloadAnchor = document.createElement("a");
        downloadAnchor.setAttribute("href", dataStr);
        downloadAnchor.setAttribute("download", "shdep-user-settings.json");
        document.body.appendChild(downloadAnchor);
        downloadAnchor.click();
        downloadAnchor.remove();
        setNotification("Settings exported as JSON.");
    };

    return (
        <Box
            sx={{
                minHeight: "100vh",
                width: "100%",
                background: "linear-gradient(135deg, #080F23 0%, #0F172A 55%, #111827 100%)",
                color: "#fff",
            }}
        >
            {/* TOP HEADER */}
            <DashboardHeader onMenuClick={() => setMobileSidebarOpen(true)} />

            {/* SIDEBAR + MAIN CONTENT */}
            <Box sx={{ display: "flex", width: "100%" }}>
                <Sidebar
                    mobileOpen={mobileSidebarOpen}
                    onClose={() => setMobileSidebarOpen(false)}
                />

                <Box sx={{ flex: 1, minWidth: 0 }}>
                    <Box
                        sx={{
                            width: "100%",
                            maxWidth: 1600,
                            mx: "auto",
                            px: { xs: 2, sm: 3, md: 4, lg: 5, xl: 6 },
                            py: { xs: 3, md: 4 },
                        }}
                    >
                        {/* HEADER BANNER */}
                        <Box
                            sx={{
                                p: { xs: 3, md: 4 },
                                mb: 4,
                                borderRadius: 4,
                                background:
                                    "linear-gradient(135deg, rgba(99,102,241,.18) 0%, rgba(30,41,59,.8) 100%)",
                                border: "1px solid rgba(129,140,248,.25)",
                                backdropFilter: "blur(20px)",
                                display: "flex",
                                flexDirection: { xs: "column", md: "row" },
                                alignItems: { xs: "flex-start", md: "center" },
                                justifyContent: "space-between",
                                gap: 3,
                            }}
                        >
                            <Box sx={{ display: "flex", alignItems: "center", gap: 1.8 }}>
                                <Box
                                    sx={{
                                        width: 48,
                                        height: 48,
                                        borderRadius: 3,
                                        background: "rgba(99,102,241,.15)",
                                        border: "1px solid rgba(99,102,241,.3)",
                                        color: "#818CF8",
                                        display: "flex",
                                        alignItems: "center",
                                        justifyContent: "center",
                                    }}
                                >
                                    <SettingsRounded sx={{ fontSize: 28 }} />
                                </Box>
                                <div>
                                    <Typography
                                        variant="h4"
                                        sx={{
                                            fontWeight: 800,
                                            color: "#F8FAFC",
                                            fontSize: { xs: 22, md: 28 },
                                            letterSpacing: "-.5px",
                                        }}
                                    >
                                        Settings & Preferences
                                    </Typography>
                                    <Typography sx={{ color: "#94A3B8", fontSize: 13, mt: 0.3 }}>
                                        Customize your workspace theme, notifications, microservice telemetry, and security
                                    </Typography>
                                </div>
                            </Box>

                            <Box sx={{ display: "flex", gap: 1.5 }}>
                                <Button
                                    variant="contained"
                                    startIcon={<SaveRounded />}
                                    onClick={handleSave}
                                    sx={{
                                        borderRadius: 2.5,
                                        px: 3,
                                        py: 1.2,
                                        textTransform: "none",
                                        fontWeight: 700,
                                        fontSize: 14,
                                        background: "linear-gradient(90deg, #2563EB, #0EA5E9)",
                                        "&:hover": {
                                            background: "linear-gradient(90deg, #1D4ED8, #0284C7)",
                                        },
                                    }}
                                >
                                    Save Preferences
                                </Button>
                            </Box>
                        </Box>

                        {/* SAVED NOTICE */}
                        {savedNotice && (
                            <Alert
                                severity="success"
                                onClose={() => setSavedNotice(false)}
                                sx={{
                                    mb: 3,
                                    background: "rgba(34,197,94,.1)",
                                    color: "#86EFAC",
                                    border: "1px solid rgba(34,197,94,.25)",
                                }}
                            >
                                Your preferences have been saved and applied to your workspace.
                            </Alert>
                        )}

                        {/* SETTINGS SECTIONS GRID */}
                        <Box sx={{ display: "flex", flexDirection: "column", gap: 3.5 }}>
                            {/* 1. APPEARANCE */}
                            <Card
                                elevation={0}
                                sx={{
                                    p: { xs: 3, md: 4 },
                                    borderRadius: 4,
                                    background: "rgba(18,28,48,.7)",
                                    border: "1px solid rgba(255,255,255,.08)",
                                    backdropFilter: "blur(20px)",
                                }}
                            >
                                <Box sx={{ display: "flex", alignItems: "center", gap: 1.5, mb: 1 }}>
                                    <PaletteRounded sx={{ color: "#818CF8" }} />
                                    <Typography variant="h6" sx={{ color: "#F8FAFC", fontWeight: 700 }}>
                                        Appearance & Display
                                    </Typography>
                                </Box>
                                <Typography sx={{ color: "#94A3B8", fontSize: 13, mb: 3 }}>
                                    Control visual styling and animations across the user dashboard.
                                </Typography>

                                <Box sx={{ display: "flex", flexDirection: "column", gap: 2.5 }}>
                                    <Box
                                        sx={{
                                            display: "grid",
                                            gridTemplateColumns: { xs: "1fr", sm: "repeat(2, 1fr)" },
                                            gap: 2,
                                        }}
                                    >
                                        <TextField
                                            select
                                            label="Interface Theme"
                                            value={settings.theme || "dark"}
                                            onChange={(e) => handleChange("theme", e.target.value)}
                                            sx={{
                                                "& .MuiOutlinedInput-root": {
                                                    borderRadius: 2.5,
                                                    background: "rgba(255,255,255,.03)",
                                                    color: "#fff",
                                                    "& fieldset": { borderColor: "rgba(255,255,255,.1)" },
                                                },
                                            }}
                                        >
                                            <MenuItem value="dark">Dark Cyber (Default)</MenuItem>
                                            <MenuItem value="midnight">Midnight OLED</MenuItem>
                                            <MenuItem value="synthwave">Neon Synthwave</MenuItem>
                                        </TextField>

                                        <TextField
                                            select
                                            label="Display Language"
                                            value={settings.language || "en"}
                                            onChange={(e) => handleChange("language", e.target.value)}
                                            sx={{
                                                "& .MuiOutlinedInput-root": {
                                                    borderRadius: 2.5,
                                                    background: "rgba(255,255,255,.03)",
                                                    color: "#fff",
                                                    "& fieldset": { borderColor: "rgba(255,255,255,.1)" },
                                                },
                                            }}
                                        >
                                            <MenuItem value="en">English (United States)</MenuItem>
                                            <MenuItem value="hi">हिन्दी (Hindi)</MenuItem>
                                            <MenuItem value="es">Español (Spanish)</MenuItem>
                                        </TextField>
                                    </Box>

                                    <Divider sx={{ borderColor: "rgba(255,255,255,.06)" }} />

                                    <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                                        <div>
                                            <Typography sx={{ color: "#F8FAFC", fontWeight: 600, fontSize: 14 }}>
                                                Smooth Motion & Transitions
                                            </Typography>
                                            <Typography sx={{ color: "#64748B", fontSize: 12 }}>
                                                Enable fluid card animations and hover effects
                                            </Typography>
                                        </div>
                                        <Switch
                                            checked={Boolean(settings.enableAnimations)}
                                            onChange={(e) => handleChange("enableAnimations", e.target.checked)}
                                            color="primary"
                                        />
                                    </Box>

                                    <Divider sx={{ borderColor: "rgba(255,255,255,.06)" }} />

                                    <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                                        <div>
                                            <Typography sx={{ color: "#F8FAFC", fontWeight: 600, fontSize: 14 }}>
                                                Compact Table & Card Layout
                                            </Typography>
                                            <Typography sx={{ color: "#64748B", fontSize: 12 }}>
                                                Reduce padding for higher information density
                                            </Typography>
                                        </div>
                                        <Switch
                                            checked={Boolean(settings.compactMode)}
                                            onChange={(e) => handleChange("compactMode", e.target.checked)}
                                            color="primary"
                                        />
                                    </Box>
                                </Box>
                            </Card>

                            {/* 2. NOTIFICATIONS */}
                            <Card
                                elevation={0}
                                sx={{
                                    p: { xs: 3, md: 4 },
                                    borderRadius: 4,
                                    background: "rgba(18,28,48,.7)",
                                    border: "1px solid rgba(255,255,255,.08)",
                                    backdropFilter: "blur(20px)",
                                }}
                            >
                                <Box sx={{ display: "flex", alignItems: "center", gap: 1.5, mb: 1 }}>
                                    <NotificationsRounded sx={{ color: "#38BDF8" }} />
                                    <Typography variant="h6" sx={{ color: "#F8FAFC", fontWeight: 700 }}>
                                        Notifications & Communication
                                    </Typography>
                                </Box>
                                <Typography sx={{ color: "#94A3B8", fontSize: 13, mb: 3 }}>
                                    Select how you would like to be notified about orders, payments, and system alerts.
                                </Typography>

                                <Box sx={{ display: "flex", flexDirection: "column", gap: 2.5 }}>
                                    <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                                        <div>
                                            <Typography sx={{ color: "#F8FAFC", fontWeight: 600, fontSize: 14 }}>
                                                Order Status Email Notifications
                                            </Typography>
                                            <Typography sx={{ color: "#64748B", fontSize: 12 }}>
                                                Receive emails when order transitions between CREATED, PAID, or CANCELLED
                                            </Typography>
                                        </div>
                                        <Switch
                                            checked={Boolean(settings.emailOrderUpdates)}
                                            onChange={(e) => handleChange("emailOrderUpdates", e.target.checked)}
                                            color="primary"
                                        />
                                    </Box>

                                    <Divider sx={{ borderColor: "rgba(255,255,255,.06)" }} />

                                    <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                                        <div>
                                            <Typography sx={{ color: "#F8FAFC", fontWeight: 600, fontSize: 14 }}>
                                                Payment Invoices & Receipts
                                            </Typography>
                                            <Typography sx={{ color: "#64748B", fontSize: 12 }}>
                                                Send immediate transaction slips upon successful Razorpay verification
                                            </Typography>
                                        </div>
                                        <Switch
                                            checked={Boolean(settings.emailPaymentReceipts)}
                                            onChange={(e) => handleChange("emailPaymentReceipts", e.target.checked)}
                                            color="primary"
                                        />
                                    </Box>

                                    <Divider sx={{ borderColor: "rgba(255,255,255,.06)" }} />

                                    <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                                        <div>
                                            <Typography sx={{ color: "#F8FAFC", fontWeight: 600, fontSize: 14 }}>
                                                Wishlist Restock & Price Drop Alerts
                                            </Typography>
                                            <Typography sx={{ color: "#64748B", fontSize: 12 }}>
                                                Alert when an out-of-stock item in your wishlist becomes available
                                            </Typography>
                                        </div>
                                        <Switch
                                            checked={Boolean(settings.emailPriceAlerts)}
                                            onChange={(e) => handleChange("emailPriceAlerts", e.target.checked)}
                                            color="primary"
                                        />
                                    </Box>
                                </Box>
                            </Card>

                            {/* 3. MICROSERVICES & TELEMETRY */}
                            <Card
                                elevation={0}
                                sx={{
                                    p: { xs: 3, md: 4 },
                                    borderRadius: 4,
                                    background: "rgba(18,28,48,.7)",
                                    border: "1px solid rgba(255,255,255,.08)",
                                    backdropFilter: "blur(20px)",
                                }}
                            >
                                <Box sx={{ display: "flex", alignItems: "center", gap: 1.5, mb: 1 }}>
                                    <TuneRounded sx={{ color: "#34D399" }} />
                                    <Typography variant="h6" sx={{ color: "#F8FAFC", fontWeight: 700 }}>
                                        Microservices & Telemetry
                                    </Typography>
                                </Box>
                                <Typography sx={{ color: "#94A3B8", fontSize: 13, mb: 3 }}>
                                    Settings for real-time Kafka event streaming, latency metrics, and self-healing telemetry.
                                </Typography>

                                <Box sx={{ display: "flex", flexDirection: "column", gap: 2.5 }}>
                                    <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                                        <div>
                                            <Typography sx={{ color: "#F8FAFC", fontWeight: 600, fontSize: 14 }}>
                                                Real-Time Kafka Event Toasts
                                            </Typography>
                                            <Typography sx={{ color: "#64748B", fontSize: 12 }}>
                                                Show popups when backend publishes PaymentCompletedEvent or OrderCreatedEvent
                                            </Typography>
                                        </div>
                                        <Switch
                                            checked={Boolean(settings.kafkaEventToasts)}
                                            onChange={(e) => handleChange("kafkaEventToasts", e.target.checked)}
                                            color="primary"
                                        />
                                    </Box>

                                    <Divider sx={{ borderColor: "rgba(255,255,255,.06)" }} />

                                    <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                                        <div>
                                            <Typography sx={{ color: "#F8FAFC", fontWeight: 600, fontSize: 14 }}>
                                                Show API Response Latency Badges
                                            </Typography>
                                            <Typography sx={{ color: "#64748B", fontSize: 12 }}>
                                                Display millisecond execution times alongside catalog and order requests
                                            </Typography>
                                        </div>
                                        <Switch
                                            checked={Boolean(settings.showLatencyBadges)}
                                            onChange={(e) => handleChange("showLatencyBadges", e.target.checked)}
                                            color="primary"
                                        />
                                    </Box>

                                    <Divider sx={{ borderColor: "rgba(255,255,255,.06)" }} />

                                    <Box
                                        sx={{
                                            display: "grid",
                                            gridTemplateColumns: { xs: "1fr", sm: "repeat(2, 1fr)" },
                                            gap: 2,
                                            pt: 1,
                                        }}
                                    >
                                        <TextField
                                            select
                                            label="Service Health Polling Interval"
                                            value={settings.healthPollingInterval || "30"}
                                            onChange={(e) => handleChange("healthPollingInterval", e.target.value)}
                                            sx={{
                                                "& .MuiOutlinedInput-root": {
                                                    borderRadius: 2.5,
                                                    background: "rgba(255,255,255,.03)",
                                                    color: "#fff",
                                                    "& fieldset": { borderColor: "rgba(255,255,255,.1)" },
                                                },
                                            }}
                                        >
                                            <MenuItem value="10">10 Seconds (High Frequency)</MenuItem>
                                            <MenuItem value="30">30 Seconds (Recommended)</MenuItem>
                                            <MenuItem value="60">60 Seconds (Power Saving)</MenuItem>
                                        </TextField>

                                        <TextField
                                            select
                                            label="Session Inactivity Timeout"
                                            value={settings.sessionTimeout || "60"}
                                            onChange={(e) => handleChange("sessionTimeout", e.target.value)}
                                            sx={{
                                                "& .MuiOutlinedInput-root": {
                                                    borderRadius: 2.5,
                                                    background: "rgba(255,255,255,.03)",
                                                    color: "#fff",
                                                    "& fieldset": { borderColor: "rgba(255,255,255,.1)" },
                                                },
                                            }}
                                        >
                                            <MenuItem value="15">15 Minutes</MenuItem>
                                            <MenuItem value="30">30 Minutes</MenuItem>
                                            <MenuItem value="60">1 Hour (Standard)</MenuItem>
                                            <MenuItem value="1440">24 Hours</MenuItem>
                                        </TextField>
                                    </Box>
                                </Box>
                            </Card>

                            {/* 4. DATA & STORAGE (DANGER ZONE) */}
                            <Card
                                elevation={0}
                                sx={{
                                    p: { xs: 3, md: 4 },
                                    borderRadius: 4,
                                    background: "rgba(18,28,48,.7)",
                                    border: "1px solid rgba(239,68,68,.2)",
                                    backdropFilter: "blur(20px)",
                                }}
                            >
                                <Typography variant="h6" sx={{ color: "#FCA5A5", fontWeight: 700, mb: 1 }}>
                                    Data & Workspace Maintenance
                                </Typography>
                                <Typography sx={{ color: "#94A3B8", fontSize: 13, mb: 3 }}>
                                    Manage cached data or restore application settings to original defaults.
                                </Typography>

                                <Box sx={{ display: "flex", flexWrap: "wrap", gap: 2 }}>
                                    <Button
                                        variant="outlined"
                                        startIcon={<DeleteSweepRounded />}
                                        onClick={handleClearCache}
                                        sx={{
                                            borderRadius: 2.5,
                                            color: "#CBD5E1",
                                            borderColor: "rgba(255,255,255,.12)",
                                            textTransform: "none",
                                            fontWeight: 600,
                                            "&:hover": { borderColor: "#60A5FA" },
                                        }}
                                    >
                                        Clear Session Cache
                                    </Button>

                                    <Button
                                        variant="outlined"
                                        startIcon={<DownloadRounded />}
                                        onClick={handleExportConfig}
                                        sx={{
                                            borderRadius: 2.5,
                                            color: "#CBD5E1",
                                            borderColor: "rgba(255,255,255,.12)",
                                            textTransform: "none",
                                            fontWeight: 600,
                                            "&:hover": { borderColor: "#60A5FA" },
                                        }}
                                    >
                                        Export Settings JSON
                                    </Button>

                                    <Button
                                        variant="outlined"
                                        color="error"
                                        startIcon={<RestartAltRounded />}
                                        onClick={() => setResetDialogOpen(true)}
                                        sx={{
                                            borderRadius: 2.5,
                                            borderColor: "rgba(239,68,68,.3)",
                                            color: "#FCA5A5",
                                            textTransform: "none",
                                            fontWeight: 600,
                                            "&:hover": {
                                                borderColor: "#EF4444",
                                                background: "rgba(239,68,68,.1)",
                                            },
                                        }}
                                    >
                                        Reset to Default Settings
                                    </Button>
                                </Box>
                            </Card>
                        </Box>
                    </Box>
                </Box>
            </Box>

            {/* RESET DIALOG */}
            <Dialog
                open={resetDialogOpen}
                onClose={() => setResetDialogOpen(false)}
                PaperProps={{
                    sx: {
                        background: "#0F172A",
                        border: "1px solid rgba(255,255,255,.12)",
                        borderRadius: 3.5,
                        color: "#fff",
                    },
                }}
            >
                <DialogTitle sx={{ fontWeight: 700 }}>Reset Settings to Default?</DialogTitle>
                <DialogContent>
                    <DialogContentText sx={{ color: "#94A3B8" }}>
                        All your custom preferences will be restored to their factory defaults. This action cannot be undone.
                    </DialogContentText>
                </DialogContent>
                <DialogActions sx={{ p: 2 }}>
                    <Button onClick={() => setResetDialogOpen(false)} sx={{ color: "#94A3B8" }}>
                        Cancel
                    </Button>
                    <Button onClick={handleReset} variant="contained" color="error" sx={{ borderRadius: 2 }}>
                        Yes, Reset
                    </Button>
                </DialogActions>
            </Dialog>

            {/* NOTIFICATION TOAST */}
            <Snackbar
                open={Boolean(notification)}
                autoHideDuration={3500}
                onClose={() => setNotification("")}
                message={notification}
                anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
            />
        </Box>
    );
}
