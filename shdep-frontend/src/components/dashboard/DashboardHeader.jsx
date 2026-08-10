import {
    AppBar,
    Avatar,
    Box,
    Divider,
    IconButton,
    Toolbar,
    Typography,
} from "@mui/material";

import {
    MenuRounded,
    NotificationsNoneRounded,
    SettingsOutlined,
} from "@mui/icons-material";

import { useAuth } from "../../context/AuthContext";


export default function DashboardHeader({
    onMenuClick,
}) {

    const {
        username,
        role,
    } = useAuth();


    const displayName =
        username || "User";


    const initial =
        displayName
            .charAt(0)
            .toUpperCase();


    return (

        <AppBar
            position="sticky"
            elevation={0}
            sx={{
                background:
                    "rgba(8,15,35,.88)",

                backdropFilter:
                    "blur(18px)",

                borderBottom:
                    "1px solid rgba(255,255,255,.07)",

                color: "#fff",
            }}
        >

            <Toolbar
                sx={{
                    minHeight: {
                        xs: 64,
                        md: 72,
                    },

                    px: {
                        xs: 2,
                        sm: 3,
                        md: 4,
                        lg: 5,
                    },

                    gap: {
                        xs: 1,
                        sm: 2,
                    },
                }}
            >

                {/* =================================
                    MOBILE MENU
                ================================= */}

                <IconButton
                    onClick={onMenuClick}
                    aria-label="Open navigation"
                    sx={{
                        display: {
                            xs: "flex",
                            md: "none",
                        },

                        width: 40,

                        height: 40,

                        mr: .5,

                        color: "#CBD5E1",

                        border:
                            "1px solid rgba(255,255,255,.07)",

                        background:
                            "rgba(255,255,255,.025)",

                        "&:hover": {
                            background:
                                "rgba(255,255,255,.07)",

                            color: "#fff",
                        },
                    }}
                >

                    <MenuRounded
                        sx={{
                            fontSize: 22,
                        }}
                    />

                </IconButton>


                {/* =================================
                    BRAND
                ================================= */}

                <Box
                    sx={{
                        display: "flex",

                        alignItems: "center",

                        gap: 1.5,

                        minWidth: {
                            xs: "auto",
                            md: 190,
                        },
                    }}
                >

                    <Box
                        sx={{
                            width: 38,

                            height: 38,

                            borderRadius: 2.2,

                            display: "flex",

                            alignItems: "center",

                            justifyContent: "center",

                            background:
                                "linear-gradient(135deg, #2563EB, #7C3AED)",

                            boxShadow:
                                "0 8px 25px rgba(37,99,235,.25)",
                        }}
                    >

                        <Typography
                            sx={{
                                color: "#fff",

                                fontSize: 16,

                                fontWeight: 900,

                                letterSpacing: "-.5px",
                            }}
                        >
                            S
                        </Typography>

                    </Box>


                    <Box
                        sx={{
                            display: {
                                xs: "none",
                                sm: "block",
                            },
                        }}
                    >

                        <Typography
                            sx={{
                                color: "#fff",

                                fontSize: 17,

                                fontWeight: 800,

                                lineHeight: 1.1,

                                letterSpacing: ".2px",
                            }}
                        >
                            SHDEP
                        </Typography>


                        <Typography
                            sx={{
                                mt: .25,

                                color: "#64748B",

                                fontSize: 9,

                                fontWeight: 600,

                                letterSpacing: "1.2px",

                                textTransform:
                                    "uppercase",
                            }}
                        >
                            User Dashboard
                        </Typography>

                    </Box>

                </Box>


                {/* =================================
                    PAGE TITLE
                ================================= */}

                <Box
                    sx={{
                        display: {
                            xs: "none",
                            md: "block",
                        },

                        ml: {
                            md: 1,
                            lg: 2,
                        },
                    }}
                >

                    <Typography
                        sx={{
                            color: "#F8FAFC",

                            fontSize: 15,

                            fontWeight: 700,
                        }}
                    >
                        Home
                    </Typography>


                    <Typography
                        sx={{
                            mt: .2,

                            color: "#64748B",

                            fontSize: 11,
                        }}
                    >
                        Overview of your account
                    </Typography>

                </Box>


                {/* =================================
                    FLEX SPACER
                ================================= */}

                <Box
                    sx={{
                        flex: 1,
                    }}
                />


                {/* =================================
                    NOTIFICATIONS
                ================================= */}

                <IconButton
                    disabled
                    aria-label="Notifications"
                    sx={{
                        width: 40,

                        height: 40,

                        color: "#64748B",

                        border:
                            "1px solid rgba(255,255,255,.06)",

                        background:
                            "rgba(255,255,255,.025)",

                        display: {
                            xs: "none",
                            sm: "flex",
                        },

                        "&.Mui-disabled": {
                            color: "#475569",
                        },
                    }}
                >

                    <NotificationsNoneRounded
                        sx={{
                            fontSize: 21,
                        }}
                    />

                </IconButton>


                {/* =================================
                    SETTINGS
                ================================= */}

                <IconButton
                    disabled
                    aria-label="Settings"
                    sx={{
                        width: 40,

                        height: 40,

                        color: "#64748B",

                        border:
                            "1px solid rgba(255,255,255,.06)",

                        background:
                            "rgba(255,255,255,.025)",

                        display: {
                            xs: "none",
                            sm: "flex",
                        },

                        "&.Mui-disabled": {
                            color: "#475569",
                        },
                    }}
                >

                    <SettingsOutlined
                        sx={{
                            fontSize: 20,
                        }}
                    />

                </IconButton>


                {/* =================================
                    DIVIDER
                ================================= */}

                <Divider
                    orientation="vertical"
                    flexItem
                    sx={{
                        height: 30,

                        alignSelf: "center",

                        borderColor:
                            "rgba(255,255,255,.08)",

                        mx: .5,

                        display: {
                            xs: "none",
                            sm: "block",
                        },
                    }}
                />


                {/* =================================
                    USER
                ================================= */}

                <Box
                    sx={{
                        display: "flex",

                        alignItems: "center",

                        gap: 1.2,

                        pl: .5,
                    }}
                >

                    <Avatar
                        sx={{
                            width: 38,

                            height: 38,

                            fontSize: 14,

                            fontWeight: 800,

                            color: "#DBEAFE",

                            background:
                                "linear-gradient(135deg, #1D4ED8, #4F46E5)",

                            border:
                                "2px solid rgba(255,255,255,.08)",
                        }}
                    >
                        {initial}
                    </Avatar>


                    <Box
                        sx={{
                            display: {
                                xs: "none",
                                sm: "block",
                            },

                            minWidth: 80,
                        }}
                    >

                        <Typography
                            sx={{
                                color: "#F8FAFC",

                                fontSize: 13,

                                fontWeight: 700,

                                overflow: "hidden",

                                textOverflow:
                                    "ellipsis",

                                whiteSpace:
                                    "nowrap",

                                maxWidth: 130,
                            }}
                        >
                            {displayName}
                        </Typography>


                        <Typography
                            sx={{
                                mt: .15,

                                color: "#64748B",

                                fontSize: 10,

                                fontWeight: 600,

                                textTransform:
                                    "uppercase",

                                letterSpacing: ".6px",
                            }}
                        >
                            {role || "USER"}
                        </Typography>

                    </Box>

                </Box>

            </Toolbar>

        </AppBar>
    );
}