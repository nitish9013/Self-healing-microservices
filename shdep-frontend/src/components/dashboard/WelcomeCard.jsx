import {
    Box,
    Card,
    Typography,
    Chip,
} from "@mui/material";

import WavingHandRoundedIcon from "@mui/icons-material/WavingHandRounded";
import VerifiedRoundedIcon from "@mui/icons-material/VerifiedRounded";

import { useAuth } from "../../context/AuthContext";

export default function WelcomeCard() {

    const { username, role } = useAuth();

    return (
        <Card
            elevation={0}
            sx={{
                position: "relative",
                overflow: "hidden",

                p: {
                    xs: 3,
                    md: 4,
                },

                borderRadius: 5,

                background:
                    "linear-gradient(135deg, rgba(37,99,235,.22), rgba(124,58,237,.14))",

                border:
                    "1px solid rgba(96,165,250,.18)",

                backdropFilter: "blur(20px)",

                boxShadow:
                    "0 20px 60px rgba(0,0,0,.25)",

                "&::before": {
                    content: '""',

                    position: "absolute",

                    width: 220,
                    height: 220,

                    right: -80,
                    top: -100,

                    borderRadius: "50%",

                    background:
                        "rgba(59,130,246,.16)",

                    filter: "blur(20px)",
                },
            }}
        >

            <Box
                sx={{
                    position: "relative",

                    display: "flex",

                    flexDirection: {
                        xs: "column",
                        sm: "row",
                    },

                    alignItems: {
                        xs: "flex-start",
                        sm: "center",
                    },

                    justifyContent: "space-between",

                    gap: 3,
                }}
            >

                {/* ================= LEFT ================= */}

                <Box>

                    <Typography
                        sx={{
                            color: "#94A3B8",
                            fontSize: 14,
                            fontWeight: 600,
                            mb: 1,
                        }}
                    >
                        SHDEP WORKSPACE
                    </Typography>


                    <Box
                        sx={{
                            display: "flex",
                            alignItems: "center",
                            gap: 1.2,
                        }}
                    >

                        <Typography
                            variant="h4"
                            sx={{
                                color: "#fff",
                                fontWeight: 800,

                                fontSize: {
                                    xs: 28,
                                    md: 34,
                                },
                            }}
                        >
                            Welcome back,{" "}
                            {username || "User"}
                        </Typography>


                        <WavingHandRoundedIcon
                            sx={{
                                color: "#FBBF24",
                                fontSize: 32,
                            }}
                        />

                    </Box>


                    <Typography
                        sx={{
                            mt: 1.5,
                            color: "#94A3B8",
                            fontSize: 15,
                            lineHeight: 1.7,
                            maxWidth: 650,
                        }}
                    >
                        Here's what's happening with your
                        SHDEP workspace today. Manage your
                        orders, payments and account from one
                        place.
                    </Typography>


                    {/* Role */}

                    <Chip
                        icon={
                            <VerifiedRoundedIcon
                                sx={{
                                    fontSize: "16px !important",
                                }}
                            />
                        }
                        label={`Role: ${role || "USER"}`}
                        size="small"
                        sx={{
                            mt: 2.5,

                            color: "#93C5FD",

                            background:
                                "rgba(59,130,246,.12)",

                            border:
                                "1px solid rgba(59,130,246,.25)",

                            fontWeight: 700,

                            "& .MuiChip-icon": {
                                color: "#60A5FA",
                            },
                        }}
                    />

                </Box>


                {/* ================= STATUS ================= */}

                <Box
                    sx={{
                        display: "flex",
                        alignItems: "center",
                        gap: 1,

                        px: 2,
                        py: 1,

                        borderRadius: 3,

                        background:
                            "rgba(34,197,94,.08)",

                        border:
                            "1px solid rgba(34,197,94,.18)",

                        alignSelf: {
                            xs: "flex-start",
                            sm: "center",
                        },
                    }}
                >

                    <Box
                        sx={{
                            width: 9,
                            height: 9,

                            borderRadius: "50%",

                            background: "#22C55E",

                            boxShadow:
                                "0 0 12px rgba(34,197,94,.8)",
                        }}
                    />

                    <Typography
                        sx={{
                            color: "#86EFAC",
                            fontSize: 13,
                            fontWeight: 700,
                        }}
                    >
                        Account Active
                    </Typography>

                </Box>

            </Box>

        </Card>
    );
}