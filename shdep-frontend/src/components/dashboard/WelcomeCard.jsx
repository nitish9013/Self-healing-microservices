import { Box, Chip, Typography } from "@mui/material";
import {
    ArrowForwardRounded,
    VerifiedUserOutlined,
} from "@mui/icons-material";
import { useAuth } from "../../context/AuthContext";

export default function WelcomeCard() {

    const {
        username,
        role,
    } = useAuth();

    const displayName = username || "User";
    const displayRole = role || "USER";

    return (
        <Box
            sx={{
                position: "relative",
                overflow: "hidden",

                width: "100%",

                minHeight: {
                    xs: 220,
                    sm: 230,
                    md: 245,
                },

                borderRadius: {
                    xs: 3,
                    md: 4,
                },

                border:
                    "1px solid rgba(96,165,250,.14)",

                background:
                    "linear-gradient(105deg, rgba(30,64,175,.32) 0%, rgba(30,41,59,.45) 48%, rgba(15,23,42,.72) 100%)",

                boxShadow:
                    "0 20px 55px rgba(0,0,0,.18)",

                display: "flex",

                alignItems: "center",

                px: {
                    xs: 2.5,
                    sm: 4,
                    md: 5,
                    lg: 6,
                },

                py: {
                    xs: 3,
                    md: 4,
                },
            }}
        >

            {/* =====================================
                BACKGROUND GLOW
            ===================================== */}

            <Box
                sx={{
                    position: "absolute",

                    width: {
                        xs: 220,
                        md: 340,
                    },

                    height: {
                        xs: 220,
                        md: 340,
                    },

                    borderRadius: "50%",

                    background:
                        "rgba(59,130,246,.12)",

                    filter: "blur(60px)",

                    top: -150,

                    right: {
                        xs: -100,
                        md: 40,
                    },

                    pointerEvents: "none",
                }}
            />


            <Box
                sx={{
                    position: "absolute",

                    width: 180,

                    height: 180,

                    borderRadius: "50%",

                    background:
                        "rgba(124,58,237,.08)",

                    filter: "blur(55px)",

                    bottom: -120,

                    right: {
                        xs: 80,
                        md: 280,
                    },

                    pointerEvents: "none",
                }}
            />


            {/* =====================================
                LEFT CONTENT
            ===================================== */}

            <Box
                sx={{
                    position: "relative",

                    zIndex: 1,

                    width: "100%",

                    display: "flex",

                    alignItems: {
                        xs: "flex-start",
                        md: "center",
                    },

                    justifyContent: "space-between",

                    flexDirection: {
                        xs: "column",
                        md: "row",
                    },

                    gap: {
                        xs: 3,
                        md: 4,
                    },
                }}
            >

                <Box>

                    {/* Small label */}

                    <Typography
                        sx={{
                            color: "#60A5FA",

                            fontSize: {
                                xs: 10,
                                md: 11,
                            },

                            fontWeight: 800,

                            letterSpacing: "1.5px",

                            textTransform:
                                "uppercase",

                            mb: 1,
                        }}
                    >
                        Personal Dashboard
                    </Typography>


                    {/* Greeting */}

                    <Typography
                        component="h1"
                        sx={{
                            color: "#F8FAFC",

                            fontSize: {
                                xs: 25,
                                sm: 30,
                                md: 36,
                                lg: 40,
                            },

                            lineHeight: 1.1,

                            fontWeight: 800,

                            letterSpacing: "-1px",
                        }}
                    >
                        Welcome back,{" "}
                        <Box
                            component="span"
                            sx={{
                                color: "#93C5FD",
                            }}
                        >
                            {displayName}
                        </Box>
                    </Typography>


                    {/* Description */}

                    <Typography
                        sx={{
                            mt: 1.5,

                            color: "#94A3B8",

                            fontSize: {
                                xs: 12,
                                sm: 13,
                                md: 14,
                            },

                            lineHeight: 1.7,

                            maxWidth: 620,
                        }}
                    >
                        Manage your account, explore products,
                        track your orders and keep everything
                        in one place.
                    </Typography>


                    {/* Account status */}

                    <Box
                        sx={{
                            mt: 2.5,

                            display: "flex",

                            alignItems: "center",

                            flexWrap: "wrap",

                            gap: 1,
                        }}
                    >

                        <Chip
                            icon={
                                <VerifiedUserOutlined
                                    sx={{
                                        fontSize:
                                            "15px !important",
                                    }}
                                />
                            }
                            label="Account Active"
                            size="small"
                            sx={{
                                height: 29,

                                color: "#BBF7D0",

                                background:
                                    "rgba(34,197,94,.10)",

                                border:
                                    "1px solid rgba(34,197,94,.18)",

                                fontSize: 11,

                                fontWeight: 700,

                                "& .MuiChip-icon": {
                                    color: "#4ADE80",
                                },
                            }}
                        />


                        <Chip
                            label={displayRole}
                            size="small"
                            sx={{
                                height: 29,

                                color: "#BFDBFE",

                                background:
                                    "rgba(59,130,246,.10)",

                                border:
                                    "1px solid rgba(59,130,246,.18)",

                                fontSize: 10,

                                fontWeight: 800,

                                letterSpacing: ".7px",
                            }}
                        />

                    </Box>

                </Box>


                {/* =================================
                    RIGHT VISUAL
                ================================= */}

                <Box
                    sx={{
                        display: {
                            xs: "none",
                            sm: "flex",
                        },

                        alignItems: "center",

                        justifyContent: "center",

                        flexShrink: 0,

                        width: {
                            sm: 125,
                            md: 155,
                        },

                        height: {
                            sm: 125,
                            md: 155,
                        },

                        borderRadius: "50%",

                        background:
                            "radial-gradient(circle at 35% 30%, rgba(96,165,250,.22), rgba(59,130,246,.06) 48%, rgba(15,23,42,.15) 70%)",

                        border:
                            "1px solid rgba(147,197,253,.12)",

                        boxShadow:
                            "inset 0 0 35px rgba(59,130,246,.08)",
                    }}
                >

                    <Box
                        sx={{
                            width: {
                                sm: 82,
                                md: 102,
                            },

                            height: {
                                sm: 82,
                                md: 102,
                            },

                            borderRadius: "50%",

                            display: "flex",

                            alignItems: "center",

                            justifyContent: "center",

                            background:
                                "linear-gradient(135deg, #2563EB, #4F46E5)",

                            border:
                                "4px solid rgba(255,255,255,.07)",

                            boxShadow:
                                "0 15px 40px rgba(37,99,235,.28)",
                        }}
                    >

                        <Typography
                            sx={{
                                color: "#fff",

                                fontSize: {
                                    sm: 30,
                                    md: 38,
                                },

                                fontWeight: 800,
                            }}
                        >
                            {displayName
                                .charAt(0)
                                .toUpperCase()}
                        </Typography>

                    </Box>

                </Box>

            </Box>


            {/* =====================================
                BOTTOM ACCENT
            ===================================== */}

            <Box
                sx={{
                    position: "absolute",

                    left: {
                        xs: 24,
                        md: 40,
                    },

                    bottom: 0,

                    width: {
                        xs: 90,
                        md: 130,
                    },

                    height: 2,

                    borderRadius: 10,

                    background:
                        "linear-gradient(90deg, #60A5FA, transparent)",
                }}
            />

        </Box>
    );
}