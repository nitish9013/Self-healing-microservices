import React, { useEffect, useState } from "react";

import {
    Alert,
    Box,
    Button,
    Divider,
    FormControlLabel,
    MenuItem,
    Paper,
    Select,
    Stack,
    Switch,
    Typography,
} from "@mui/material";

import {
    AccountCircleRounded,
    ArrowBackRounded,
    NotificationsRounded,
    RefreshRounded,
    SecurityRounded,
    SettingsRounded,
    TuneRounded,
} from "@mui/icons-material";

import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";


const DEFAULT_SETTINGS = {
    autoRefresh: "30",
    compactMode: false,
    alertNotifications: true,
    criticalOnly: false,
};


export default function AdminSettings() {

    const navigate = useNavigate();

    const {
        username,
        role,
        logout,
    } = useAuth();


    const [settings, setSettings] =
        useState(DEFAULT_SETTINGS);

    const [saved, setSaved] =
        useState(false);


    useEffect(() => {

        try {

            const stored =
                localStorage.getItem(
                    "shdep_admin_settings"
                );

            if (stored) {

                setSettings({
                    ...DEFAULT_SETTINGS,
                    ...JSON.parse(stored),
                });

            }

        } catch (error) {

            console.error(
                "Unable to load admin settings:",
                error
            );

        }

    }, []);


    const updateSetting = (key, value) => {

        setSettings((current) => ({
            ...current,
            [key]: value,
        }));

        setSaved(false);
    };


    const handleSave = () => {

        localStorage.setItem(
            "shdep_admin_settings",
            JSON.stringify(settings)
        );

        setSaved(true);
    };


    const handleReset = () => {

        setSettings(DEFAULT_SETTINGS);

        localStorage.setItem(
            "shdep_admin_settings",
            JSON.stringify(DEFAULT_SETTINGS)
        );

        setSaved(true);
    };


    const handleLogout = () => {

        logout();

        navigate("/login");
    };


    const normalizedRole =
        String(role || "ADMIN")
            .replace("ROLE_", "")
            .toUpperCase();


    return (
        <Box
            sx={{
                minHeight: "100vh",
                background:
                    "linear-gradient(135deg, #060b1a 0%, #0a1024 45%, #101936 100%)",
                color: "#fff",
                p: {
                    xs: 2,
                    md: 4,
                },
            }}
        >

            {/* ================= HEADER ================= */}

            <Box
                sx={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: {
                        xs: "flex-start",
                        md: "center",
                    },
                    flexDirection: {
                        xs: "column",
                        md: "row",
                    },
                    gap: 2,
                    mb: 4,
                }}
            >

                <Box>

                    <Button
                        startIcon={
                            <ArrowBackRounded />
                        }
                        onClick={() =>
                            navigate("/admin")
                        }
                        sx={{
                            color:
                                "rgba(255,255,255,.55)",
                            mb: 1,
                            textTransform: "none",
                        }}
                    >
                        Back to Admin
                    </Button>


                    <Stack
                        direction="row"
                        spacing={1.5}
                        alignItems="center"
                    >

                        <Box
                            sx={{
                                width: 46,
                                height: 46,
                                borderRadius: 2.5,
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                                background:
                                    "rgba(139,92,246,.10)",
                                border:
                                    "1px solid rgba(139,92,246,.20)",
                            }}
                        >
                            <SettingsRounded
                                sx={{
                                    color: "#a78bfa",
                                    fontSize: 24,
                                }}
                            />
                        </Box>


                        <Box>

                            <Typography
                                sx={{
                                    fontSize: {
                                        xs: 23,
                                        md: 28,
                                    },
                                    fontWeight: 800,
                                }}
                            >
                                Settings
                            </Typography>

                            <Typography
                                sx={{
                                    mt: .4,
                                    color:
                                        "rgba(255,255,255,.45)",
                                    fontSize: 12,
                                }}
                            >
                                Manage your SHDEP admin preferences
                            </Typography>

                        </Box>

                    </Stack>

                </Box>

            </Box>


            {/* ================= SUCCESS ================= */}

            {saved && (
                <Alert
                    severity="success"
                    onClose={() => setSaved(false)}
                    sx={{
                        mb: 3,
                        borderRadius: 2,
                    }}
                >
                    Settings saved successfully.
                </Alert>
            )}


            <Box
                sx={{
                    display: "grid",
                    gridTemplateColumns: {
                        xs: "1fr",
                        lg: "1fr 1fr",
                    },
                    gap: 3,
                }}
            >

                {/* ================= PROFILE ================= */}

                <Paper
                    sx={{
                        p: 3,
                        background:
                            "rgba(255,255,255,.035)",
                        border:
                            "1px solid rgba(255,255,255,.07)",
                        borderRadius: 3,
                    }}
                >

                    <Stack
                        direction="row"
                        spacing={1.5}
                        alignItems="center"
                        mb={3}
                    >

                        <AccountCircleRounded
                            sx={{
                                color: "#60a5fa",
                                fontSize: 24,
                            }}
                        />

                        <Box>

                            <Typography
                                fontWeight={700}
                            >
                                Admin Profile
                            </Typography>

                            <Typography
                                sx={{
                                    fontSize: 11,
                                    color:
                                        "rgba(255,255,255,.4)",
                                }}
                            >
                                Current authenticated account
                            </Typography>

                        </Box>

                    </Stack>


                    <Stack spacing={2}>

                        <Box
                            sx={{
                                p: 2,
                                borderRadius: 2,
                                background:
                                    "rgba(255,255,255,.035)",
                            }}
                        >

                            <Typography
                                sx={{
                                    fontSize: 10,
                                    color:
                                        "rgba(255,255,255,.4)",
                                    textTransform:
                                        "uppercase",
                                }}
                            >
                                Username
                            </Typography>

                            <Typography
                                sx={{
                                    mt: .5,
                                    fontWeight: 700,
                                }}
                            >
                                {username || "Admin"}
                            </Typography>

                        </Box>


                        <Box
                            sx={{
                                p: 2,
                                borderRadius: 2,
                                background:
                                    "rgba(255,255,255,.035)",
                            }}
                        >

                            <Typography
                                sx={{
                                    fontSize: 10,
                                    color:
                                        "rgba(255,255,255,.4)",
                                    textTransform:
                                        "uppercase",
                                }}
                            >
                                Role
                            </Typography>

                            <Typography
                                sx={{
                                    mt: .5,
                                    fontWeight: 700,
                                    color: "#a78bfa",
                                }}
                            >
                                {normalizedRole}
                            </Typography>

                        </Box>


                        <Box
                            sx={{
                                p: 2,
                                borderRadius: 2,
                                background:
                                    "rgba(53,217,139,.06)",
                                border:
                                    "1px solid rgba(53,217,139,.12)",
                            }}
                        >

                            <Typography
                                sx={{
                                    fontSize: 10,
                                    color:
                                        "rgba(255,255,255,.4)",
                                    textTransform:
                                        "uppercase",
                                }}
                            >
                                Session
                            </Typography>

                            <Typography
                                sx={{
                                    mt: .5,
                                    fontWeight: 700,
                                    color: "#35d98b",
                                }}
                            >
                                ACTIVE
                            </Typography>

                        </Box>

                    </Stack>

                </Paper>


                {/* ================= DASHBOARD ================= */}

                <Paper
                    sx={{
                        p: 3,
                        background:
                            "rgba(255,255,255,.035)",
                        border:
                            "1px solid rgba(255,255,255,.07)",
                        borderRadius: 3,
                    }}
                >

                    <Stack
                        direction="row"
                        spacing={1.5}
                        alignItems="center"
                        mb={3}
                    >

                        <TuneRounded
                            sx={{
                                color: "#a78bfa",
                                fontSize: 24,
                            }}
                        />

                        <Box>

                            <Typography
                                fontWeight={700}
                            >
                                Dashboard Preferences
                            </Typography>

                            <Typography
                                sx={{
                                    fontSize: 11,
                                    color:
                                        "rgba(255,255,255,.4)",
                                }}
                            >
                                Control dashboard behaviour
                            </Typography>

                        </Box>

                    </Stack>


                    <Stack spacing={2.5}>

                        <Box>

                            <Typography
                                sx={{
                                    mb: 1,
                                    fontSize: 12,
                                    color:
                                        "rgba(255,255,255,.55)",
                                }}
                            >
                                Auto Refresh
                            </Typography>

                            <Select
                                fullWidth
                                size="small"
                                value={settings.autoRefresh}
                                onChange={(event) =>
                                    updateSetting(
                                        "autoRefresh",
                                        event.target.value
                                    )
                                }
                                sx={{
                                    color: "#fff",
                                    ".MuiOutlinedInput-notchedOutline": {
                                        borderColor:
                                            "rgba(255,255,255,.12)",
                                    },
                                    ".MuiSvgIcon-root": {
                                        color: "#aaa",
                                    },
                                }}
                            >

                                <MenuItem value="off">
                                    Off
                                </MenuItem>

                                <MenuItem value="15">
                                    Every 15 seconds
                                </MenuItem>

                                <MenuItem value="30">
                                    Every 30 seconds
                                </MenuItem>

                                <MenuItem value="60">
                                    Every 60 seconds
                                </MenuItem>

                            </Select>

                        </Box>


                        <Divider
                            sx={{
                                borderColor:
                                    "rgba(255,255,255,.07)",
                            }}
                        />


                        <FormControlLabel
                            control={
                                <Switch
                                    checked={
                                        settings.compactMode
                                    }
                                    onChange={(event) =>
                                        updateSetting(
                                            "compactMode",
                                            event.target.checked
                                        )
                                    }
                                />
                            }
                            label={
                                <Typography
                                    sx={{
                                        fontSize: 13,
                                    }}
                                >
                                    Compact dashboard
                                </Typography>
                            }
                        />

                    </Stack>

                </Paper>


                {/* ================= ALERTS ================= */}

                <Paper
                    sx={{
                        p: 3,
                        background:
                            "rgba(255,255,255,.035)",
                        border:
                            "1px solid rgba(255,255,255,.07)",
                        borderRadius: 3,
                    }}
                >

                    <Stack
                        direction="row"
                        spacing={1.5}
                        alignItems="center"
                        mb={3}
                    >

                        <NotificationsRounded
                            sx={{
                                color: "#fbbf24",
                                fontSize: 24,
                            }}
                        />

                        <Box>

                            <Typography
                                fontWeight={700}
                            >
                                Alert Preferences
                            </Typography>

                            <Typography
                                sx={{
                                    fontSize: 11,
                                    color:
                                        "rgba(255,255,255,.4)",
                                }}
                            >
                                Configure admin alert behaviour
                            </Typography>

                        </Box>

                    </Stack>


                    <Stack spacing={1}>

                        <FormControlLabel
                            control={
                                <Switch
                                    checked={
                                        settings.alertNotifications
                                    }
                                    onChange={(event) =>
                                        updateSetting(
                                            "alertNotifications",
                                            event.target.checked
                                        )
                                    }
                                />
                            }
                            label={
                                <Box>

                                    <Typography
                                        sx={{
                                            fontSize: 13,
                                        }}
                                    >
                                        Alert notifications
                                    </Typography>

                                    <Typography
                                        sx={{
                                            fontSize: 10,
                                            color:
                                                "rgba(255,255,255,.35)",
                                        }}
                                    >
                                        Show active monitoring alerts
                                    </Typography>

                                </Box>
                            }
                        />


                        <FormControlLabel
                            control={
                                <Switch
                                    checked={
                                        settings.criticalOnly
                                    }
                                    disabled={
                                        !settings.alertNotifications
                                    }
                                    onChange={(event) =>
                                        updateSetting(
                                            "criticalOnly",
                                            event.target.checked
                                        )
                                    }
                                />
                            }
                            label={
                                <Box>

                                    <Typography
                                        sx={{
                                            fontSize: 13,
                                        }}
                                    >
                                        Critical alerts only
                                    </Typography>

                                    <Typography
                                        sx={{
                                            fontSize: 10,
                                            color:
                                                "rgba(255,255,255,.35)",
                                        }}
                                    >
                                        Hide warning-level notifications
                                    </Typography>

                                </Box>
                            }
                        />

                    </Stack>

                </Paper>


                {/* ================= SECURITY ================= */}

                <Paper
                    sx={{
                        p: 3,
                        background:
                            "rgba(255,255,255,.035)",
                        border:
                            "1px solid rgba(255,255,255,.07)",
                        borderRadius: 3,
                    }}
                >

                    <Stack
                        direction="row"
                        spacing={1.5}
                        alignItems="center"
                        mb={3}
                    >

                        <SecurityRounded
                            sx={{
                                color: "#35d98b",
                                fontSize: 24,
                            }}
                        />

                        <Box>

                            <Typography
                                fontWeight={700}
                            >
                                Security & Session
                            </Typography>

                            <Typography
                                sx={{
                                    fontSize: 11,
                                    color:
                                        "rgba(255,255,255,.4)",
                                }}
                            >
                                Manage your current admin session
                            </Typography>

                        </Box>

                    </Stack>


                    <Box
                        sx={{
                            p: 2,
                            borderRadius: 2,
                            background:
                                "rgba(53,217,139,.05)",
                            border:
                                "1px solid rgba(53,217,139,.10)",
                            mb: 2,
                        }}
                    >

                        <Typography
                            sx={{
                                fontSize: 11,
                                color:
                                    "rgba(255,255,255,.45)",
                            }}
                        >
                            Authentication status
                        </Typography>

                        <Typography
                            sx={{
                                mt: .5,
                                fontWeight: 700,
                                color: "#35d98b",
                            }}
                        >
                            AUTHENTICATED
                        </Typography>

                    </Box>


                    <Button
                        fullWidth
                        variant="outlined"
                        color="error"
                        onClick={handleLogout}
                        sx={{
                            textTransform: "none",
                            borderRadius: 2,
                        }}
                    >
                        Logout
                    </Button>

                </Paper>

            </Box>


            {/* ================= ACTIONS ================= */}

            <Box
                sx={{
                    mt: 3,
                    display: "flex",
                    justifyContent: "flex-end",
                    gap: 1.5,
                }}
            >

                <Button
                    variant="outlined"
                    onClick={handleReset}
                    sx={{
                        color: "rgba(255,255,255,.7)",
                        borderColor:
                            "rgba(255,255,255,.12)",
                        textTransform: "none",
                    }}
                >
                    Reset
                </Button>


                <Button
                    variant="contained"
                    startIcon={
                        <RefreshRounded />
                    }
                    onClick={handleSave}
                    sx={{
                        textTransform: "none",
                        background:
                            "linear-gradient(135deg,#315cff,#743cff)",
                    }}
                >
                    Save Settings
                </Button>

            </Box>

        </Box>
    );
}