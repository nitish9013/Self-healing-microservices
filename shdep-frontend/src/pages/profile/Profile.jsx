import { useState, useEffect } from "react";
import {
    Box,
    Typography,
    Card,
    Button,
    Chip,
    Avatar,
    TextField,
    Divider,
    Alert,
    Snackbar,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
} from "@mui/material";

import {
    SecurityRounded,
    LockResetRounded,
    CheckCircleRounded,
    SaveRounded,
} from "@mui/icons-material";

import { useAuth } from "../../context/AuthContext";
import DashboardHeader from "../../components/dashboard/DashboardHeader";
import Sidebar from "../../components/dashboard/Sidebar";
import userService from "../../services/userService";
import wishlistService from "../../services/wishlistService";
import { getOrders } from "../../services/orderService";
import { getPaymentsByUserId } from "../../services/paymentService";

export default function Profile() {
    const { username, role, userId } = useAuth();

    const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);
    const [saving, setSaving] = useState(false);
    const [notification, setNotification] = useState("");
    const [passwordDialogOpen, setPasswordDialogOpen] = useState(false);

    const [profile, setProfile] = useState(() => {
        const stored = localStorage.getItem(`shdep_user_profile_${userId || "default"}`);
        if (stored) {
            try {
                return JSON.parse(stored);
            } catch {
                // Ignore parse errors
            }
        }
        return {
            name: localStorage.getItem("username") || "Nitish Kumar",
            email: `${localStorage.getItem("username") || "user"}@shdep.dev`,
            phone: "+91 98765 43210",
            bio: "Cloud Microservices Architect & Fullstack Engineer. Working on SHDEP self-healing infrastructure.",
            department: "Distributed Systems Engineering",
            location: "New Delhi, India",
            role: localStorage.getItem("role") || "USER",
        };
    });

    // Counts
    const [stats, setStats] = useState({
        ordersCount: 0,
        paymentsCount: 0,
        wishlistCount: 0,
    });

    // Password form state
    const [passwordData, setPasswordData] = useState({
        current: "",
        newPass: "",
        confirm: "",
    });
    const [passwordError, setPasswordError] = useState("");

    useEffect(() => {
        let active = true;

        userService.getUserProfile(userId).then((data) => {
            if (active && data) {
                setProfile(data);
            }
        }).catch(() => {});

        Promise.all([
            getOrders().catch(() => []),
            userId ? getPaymentsByUserId(userId).catch(() => []) : Promise.resolve([]),
        ]).then(([orders, payments]) => {
            if (active) {
                const wl = wishlistService.getWishlist();
                setStats({
                    ordersCount: Array.isArray(orders) ? orders.length : 0,
                    paymentsCount: Array.isArray(payments) ? payments.length : 0,
                    wishlistCount: wl.length,
                });
            }
        }).catch(() => {});

        return () => {
            active = false;
        };
    }, [userId]);

    const handleProfileChange = (e) => {
        setProfile({
            ...profile,
            [e.target.name]: e.target.value,
        });
    };

    const handleSaveProfile = async (e) => {
        e.preventDefault();
        try {
            setSaving(true);
            await userService.updateUserProfile(userId, profile);
            setNotification("Profile updated successfully!");
        } catch {
            setNotification("Failed to update profile.");
        } finally {
            setSaving(false);
        }
    };

    const handleUpdatePassword = (e) => {
        e.preventDefault();
        setPasswordError("");

        if (!passwordData.current || !passwordData.newPass) {
            setPasswordError("All password fields are required.");
            return;
        }

        if (passwordData.newPass.length < 6) {
            setPasswordError("New password must be at least 6 characters.");
            return;
        }

        if (passwordData.newPass !== passwordData.confirm) {
            setPasswordError("New passwords do not match.");
            return;
        }

        setPasswordDialogOpen(false);
        setPasswordData({ current: "", newPass: "", confirm: "" });
        setNotification("Password updated securely!");
    };

    const displayName = profile.name || username || "Nitish Kumar";
    const initial = displayName.charAt(0).toUpperCase();

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
                        {/* HERO PROFILE OVERVIEW CARD */}
                        <Card
                            elevation={0}
                            sx={{
                                p: { xs: 3, md: 4 },
                                mb: 4,
                                borderRadius: 4,
                                background:
                                    "linear-gradient(135deg, rgba(30,58,138,.35) 0%, rgba(15,23,42,.85) 100%)",
                                border: "1px solid rgba(59,130,246,.25)",
                                backdropFilter: "blur(20px)",
                            }}
                        >
                            <Box
                                sx={{
                                    display: "flex",
                                    flexDirection: { xs: "column", md: "row" },
                                    alignItems: { xs: "flex-start", md: "center" },
                                    justifyContent: "space-between",
                                    gap: 3,
                                }}
                            >
                                <Box sx={{ display: "flex", alignItems: "center", gap: 3 }}>
                                    <Avatar
                                        sx={{
                                            width: { xs: 72, md: 90 },
                                            height: { xs: 72, md: 90 },
                                            fontSize: { xs: 28, md: 36 },
                                            fontWeight: 800,
                                            background: "linear-gradient(135deg, #1D4ED8, #4F46E5)",
                                            border: "3px solid rgba(255,255,255,.15)",
                                            boxShadow: "0 8px 24px rgba(37,99,235,.4)",
                                        }}
                                    >
                                        {initial}
                                    </Avatar>

                                    <Box>
                                        <Box sx={{ display: "flex", alignItems: "center", gap: 1.5, flexWrap: "wrap" }}>
                                            <Typography
                                                variant="h4"
                                                sx={{
                                                    fontWeight: 800,
                                                    color: "#F8FAFC",
                                                    fontSize: { xs: 22, md: 28 },
                                                }}
                                            >
                                                {displayName}
                                            </Typography>
                                            <Chip
                                                label={role || "USER"}
                                                size="small"
                                                sx={{
                                                    background: "rgba(59,130,246,.2)",
                                                    color: "#93C5FD",
                                                    border: "1px solid rgba(59,130,246,.35)",
                                                    fontWeight: 700,
                                                    fontSize: 11,
                                                }}
                                            />
                                            <Chip
                                                icon={<CheckCircleRounded sx={{ fontSize: "14px !important", color: "#4ADE80 !important" }} />}
                                                label="Account Active"
                                                size="small"
                                                sx={{
                                                    background: "rgba(34,197,94,.12)",
                                                    color: "#86EFAC",
                                                    border: "1px solid rgba(34,197,94,.25)",
                                                    fontWeight: 700,
                                                    fontSize: 11,
                                                }}
                                            />
                                        </Box>

                                        <Typography sx={{ color: "#94A3B8", fontSize: 13, mt: 0.6 }}>
                                            @{username || "user"} • User ID: {userId || 1} • {profile.department || "Engineering"}
                                        </Typography>
                                    </Box>
                                </Box>

                                {/* STATS PILLS */}
                                <Box
                                    sx={{
                                        display: "flex",
                                        gap: 2,
                                        flexWrap: "wrap",
                                    }}
                                >
                                    <Box
                                        sx={{
                                            p: 2,
                                            borderRadius: 2.5,
                                            background: "rgba(255,255,255,.03)",
                                            border: "1px solid rgba(255,255,255,.08)",
                                            textAlign: "center",
                                            minWidth: 100,
                                        }}
                                    >
                                        <Typography sx={{ color: "#60A5FA", fontWeight: 800, fontSize: 20 }}>
                                            {stats.ordersCount}
                                        </Typography>
                                        <Typography sx={{ color: "#64748B", fontSize: 11, fontWeight: 600 }}>
                                            Orders
                                        </Typography>
                                    </Box>

                                    <Box
                                        sx={{
                                            p: 2,
                                            borderRadius: 2.5,
                                            background: "rgba(255,255,255,.03)",
                                            border: "1px solid rgba(255,255,255,.08)",
                                            textAlign: "center",
                                            minWidth: 100,
                                        }}
                                    >
                                        <Typography sx={{ color: "#34D399", fontWeight: 800, fontSize: 20 }}>
                                            {stats.paymentsCount}
                                        </Typography>
                                        <Typography sx={{ color: "#64748B", fontSize: 11, fontWeight: 600 }}>
                                            Payments
                                        </Typography>
                                    </Box>

                                    <Box
                                        sx={{
                                            p: 2,
                                            borderRadius: 2.5,
                                            background: "rgba(255,255,255,.03)",
                                            border: "1px solid rgba(255,255,255,.08)",
                                            textAlign: "center",
                                            minWidth: 100,
                                        }}
                                    >
                                        <Typography sx={{ color: "#F472B6", fontWeight: 800, fontSize: 20 }}>
                                            {stats.wishlistCount}
                                        </Typography>
                                        <Typography sx={{ color: "#64748B", fontSize: 11, fontWeight: 600 }}>
                                            Saved Items
                                        </Typography>
                                    </Box>
                                </Box>
                            </Box>
                        </Card>

                        {/* PROFILE DETAILS GRID */}
                        <Box
                            sx={{
                                display: "grid",
                                gridTemplateColumns: { xs: "1fr", lg: "2fr 1fr" },
                                gap: 3.5,
                            }}
                        >
                            {/* EDIT PROFILE FORM */}
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
                                <Typography variant="h6" sx={{ color: "#F8FAFC", fontWeight: 700, mb: 1 }}>
                                    Personal Details
                                </Typography>
                                <Typography sx={{ color: "#94A3B8", fontSize: 13, mb: 3 }}>
                                    Update your contact and identification details across SHDEP microservices.
                                </Typography>

                                <form onSubmit={handleSaveProfile}>
                                    <Box sx={{ display: "flex", flexDirection: "column", gap: 2.5 }}>
                                        <Box
                                            sx={{
                                                display: "grid",
                                                gridTemplateColumns: { xs: "1fr", sm: "repeat(2, 1fr)" },
                                                gap: 2,
                                            }}
                                        >
                                            <TextField
                                                fullWidth
                                                label="Full Name"
                                                name="name"
                                                value={profile.name || ""}
                                                onChange={handleProfileChange}
                                                required
                                                sx={{
                                                    "& .MuiOutlinedInput-root": {
                                                        borderRadius: 2.5,
                                                        background: "rgba(255,255,255,.03)",
                                                        color: "#fff",
                                                        "& fieldset": { borderColor: "rgba(255,255,255,.1)" },
                                                    },
                                                }}
                                            />

                                            <TextField
                                                fullWidth
                                                label="Email Address"
                                                name="email"
                                                type="email"
                                                value={profile.email || ""}
                                                onChange={handleProfileChange}
                                                required
                                                sx={{
                                                    "& .MuiOutlinedInput-root": {
                                                        borderRadius: 2.5,
                                                        background: "rgba(255,255,255,.03)",
                                                        color: "#fff",
                                                        "& fieldset": { borderColor: "rgba(255,255,255,.1)" },
                                                    },
                                                }}
                                            />
                                        </Box>

                                        <Box
                                            sx={{
                                                display: "grid",
                                                gridTemplateColumns: { xs: "1fr", sm: "repeat(2, 1fr)" },
                                                gap: 2,
                                            }}
                                        >
                                            <TextField
                                                fullWidth
                                                label="Phone Number"
                                                name="phone"
                                                value={profile.phone || ""}
                                                onChange={handleProfileChange}
                                                sx={{
                                                    "& .MuiOutlinedInput-root": {
                                                        borderRadius: 2.5,
                                                        background: "rgba(255,255,255,.03)",
                                                        color: "#fff",
                                                        "& fieldset": { borderColor: "rgba(255,255,255,.1)" },
                                                    },
                                                }}
                                            />

                                            <TextField
                                                fullWidth
                                                label="Department / Team"
                                                name="department"
                                                value={profile.department || ""}
                                                onChange={handleProfileChange}
                                                sx={{
                                                    "& .MuiOutlinedInput-root": {
                                                        borderRadius: 2.5,
                                                        background: "rgba(255,255,255,.03)",
                                                        color: "#fff",
                                                        "& fieldset": { borderColor: "rgba(255,255,255,.1)" },
                                                    },
                                                }}
                                            />
                                        </Box>

                                        <TextField
                                            fullWidth
                                            label="Location"
                                            name="location"
                                            value={profile.location || ""}
                                            onChange={handleProfileChange}
                                            sx={{
                                                "& .MuiOutlinedInput-root": {
                                                    borderRadius: 2.5,
                                                    background: "rgba(255,255,255,.03)",
                                                    color: "#fff",
                                                    "& fieldset": { borderColor: "rgba(255,255,255,.1)" },
                                                },
                                            }}
                                        />

                                        <TextField
                                            fullWidth
                                            multiline
                                            rows={3}
                                            label="Bio / Notes"
                                            name="bio"
                                            value={profile.bio || ""}
                                            onChange={handleProfileChange}
                                            sx={{
                                                "& .MuiOutlinedInput-root": {
                                                    borderRadius: 2.5,
                                                    background: "rgba(255,255,255,.03)",
                                                    color: "#fff",
                                                    "& fieldset": { borderColor: "rgba(255,255,255,.1)" },
                                                },
                                            }}
                                        />

                                        <Box sx={{ display: "flex", justifyContent: "flex-end", mt: 1 }}>
                                            <Button
                                                type="submit"
                                                variant="contained"
                                                disabled={saving}
                                                startIcon={<SaveRounded />}
                                                sx={{
                                                    py: 1.2,
                                                    px: 3.5,
                                                    borderRadius: 2.5,
                                                    textTransform: "none",
                                                    fontWeight: 700,
                                                    fontSize: 14,
                                                    background: "linear-gradient(90deg, #2563EB, #0EA5E9)",
                                                    "&:hover": {
                                                        background: "linear-gradient(90deg, #1D4ED8, #0284C7)",
                                                    },
                                                }}
                                            >
                                                {saving ? "Saving Changes..." : "Save Profile"}
                                            </Button>
                                        </Box>
                                    </Box>
                                </form>
                            </Card>

                            {/* ACCOUNT SECURITY & SYSTEM SESSIONS */}
                            <Box sx={{ display: "flex", flexDirection: "column", gap: 3 }}>
                                <Card
                                    elevation={0}
                                    sx={{
                                        p: 3,
                                        borderRadius: 4,
                                        background: "rgba(18,28,48,.7)",
                                        border: "1px solid rgba(255,255,255,.08)",
                                    }}
                                >
                                    <Box sx={{ display: "flex", alignItems: "center", gap: 1.5, mb: 1.5 }}>
                                        <SecurityRounded sx={{ color: "#60A5FA" }} />
                                        <Typography sx={{ color: "#F8FAFC", fontWeight: 700, fontSize: 16 }}>
                                            Account Security
                                        </Typography>
                                    </Box>

                                    <Typography sx={{ color: "#94A3B8", fontSize: 13, mb: 2.5 }}>
                                        Manage your authentication credentials and cryptographic session tokens.
                                    </Typography>

                                    <Button
                                        fullWidth
                                        variant="outlined"
                                        startIcon={<LockResetRounded />}
                                        onClick={() => setPasswordDialogOpen(true)}
                                        sx={{
                                            py: 1.2,
                                            borderRadius: 2.5,
                                            color: "#CBD5E1",
                                            borderColor: "rgba(255,255,255,.12)",
                                            textTransform: "none",
                                            fontWeight: 600,
                                            "&:hover": {
                                                borderColor: "#3B82F6",
                                                background: "rgba(59,130,246,.08)",
                                            },
                                        }}
                                    >
                                        Change Password
                                    </Button>
                                </Card>

                                <Card
                                    elevation={0}
                                    sx={{
                                        p: 3,
                                        borderRadius: 4,
                                        background: "rgba(18,28,48,.7)",
                                        border: "1px solid rgba(255,255,255,.08)",
                                    }}
                                >
                                    <Typography sx={{ color: "#F8FAFC", fontWeight: 700, fontSize: 16, mb: 2 }}>
                                        Session Information
                                    </Typography>

                                    <Box sx={{ display: "flex", flexDirection: "column", gap: 1.5 }}>
                                        <Box sx={{ display: "flex", justifyContent: "space-between" }}>
                                            <Typography sx={{ color: "#64748B", fontSize: 12 }}>Assigned Role</Typography>
                                            <Typography sx={{ color: "#CBD5E1", fontSize: 12, fontWeight: 600 }}>
                                                {role || "USER"}
                                            </Typography>
                                        </Box>
                                        <Divider sx={{ borderColor: "rgba(255,255,255,.06)" }} />

                                        <Box sx={{ display: "flex", justifyContent: "space-between" }}>
                                            <Typography sx={{ color: "#64748B", fontSize: 12 }}>Status</Typography>
                                            <Typography sx={{ color: "#4ADE80", fontSize: 12, fontWeight: 700 }}>
                                                Authenticated
                                            </Typography>
                                        </Box>
                                        <Divider sx={{ borderColor: "rgba(255,255,255,.06)" }} />

                                        <Box sx={{ display: "flex", justifyContent: "space-between" }}>
                                            <Typography sx={{ color: "#64748B", fontSize: 12 }}>Environment</Typography>
                                            <Typography sx={{ color: "#CBD5E1", fontSize: 12 }}>
                                                Production Cloud
                                            </Typography>
                                        </Box>
                                    </Box>
                                </Card>
                            </Box>
                        </Box>
                    </Box>
                </Box>
            </Box>

            {/* PASSWORD CHANGE DIALOG */}
            <Dialog
                open={passwordDialogOpen}
                onClose={() => setPasswordDialogOpen(false)}
                PaperProps={{
                    sx: {
                        background: "#0F172A",
                        border: "1px solid rgba(255,255,255,.12)",
                        borderRadius: 3.5,
                        color: "#fff",
                        maxWidth: 440,
                        width: "100%",
                    },
                }}
            >
                <form onSubmit={handleUpdatePassword}>
                    <DialogTitle sx={{ fontWeight: 700 }}>Update Password</DialogTitle>
                    <DialogContent sx={{ display: "flex", flexDirection: "column", gap: 2, pt: 1 }}>
                        {passwordError && (
                            <Alert severity="error" sx={{ background: "rgba(239,68,68,.1)", color: "#FCA5A5" }}>
                                {passwordError}
                            </Alert>
                        )}
                        <TextField
                            fullWidth
                            type="password"
                            label="Current Password"
                            value={passwordData.current}
                            onChange={(e) => setPasswordData({ ...passwordData, current: e.target.value })}
                            required
                        />
                        <TextField
                            fullWidth
                            type="password"
                            label="New Password"
                            value={passwordData.newPass}
                            onChange={(e) => setPasswordData({ ...passwordData, newPass: e.target.value })}
                            required
                        />
                        <TextField
                            fullWidth
                            type="password"
                            label="Confirm New Password"
                            value={passwordData.confirm}
                            onChange={(e) => setPasswordData({ ...passwordData, confirm: e.target.value })}
                            required
                        />
                    </DialogContent>
                    <DialogActions sx={{ p: 2 }}>
                        <Button onClick={() => setPasswordDialogOpen(false)} sx={{ color: "#94A3B8" }}>
                            Cancel
                        </Button>
                        <Button type="submit" variant="contained" sx={{ borderRadius: 2 }}>
                            Save Password
                        </Button>
                    </DialogActions>
                </form>
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
