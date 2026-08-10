import {
    AppBar,
    Toolbar,
    Box,
    Typography,
    TextField,
    InputAdornment,
    IconButton,
    Avatar,
    Chip,
} from "@mui/material";

import SearchRoundedIcon from "@mui/icons-material/SearchRounded";
import NotificationsNoneRoundedIcon from "@mui/icons-material/NotificationsNoneRounded";
import SettingsRoundedIcon from "@mui/icons-material/SettingsRounded";

import { useAuth } from "../../context/AuthContext";

export default function DashboardHeader() {

    const { username, role } = useAuth();

    return (
        <AppBar
            position="sticky"
            elevation={0}
            sx={{
                background: "rgba(8,15,35,.82)",
                backdropFilter: "blur(22px)",
                borderBottom: "1px solid rgba(255,255,255,.08)",
                zIndex: (theme) => theme.zIndex.drawer + 1,
            }}
        >

            <Toolbar
                sx={{
                    minHeight: "76px !important",
                    px: {
                        xs: 2,
                        md: 4,
                    },
                    display: "flex",
                    justifyContent: "space-between",
                    gap: 3,
                }}
            >

                {/* SHDEP */}

                <Box
                    sx={{
                        display: "flex",
                        alignItems: "center",
                        minWidth: 150,
                    }}
                >

                    <Typography
                        variant="h5"
                        sx={{
                            fontWeight: 800,
                            letterSpacing: 1,
                            color: "#fff",
                        }}
                    >
                        SHDEP
                    </Typography>

                </Box>


                {/* Search */}

                <TextField
                    placeholder="Search anything..."
                    size="small"
                    sx={{
                        width: "100%",
                        maxWidth: 420,

                        display: {
                            xs: "none",
                            md: "block",
                        },

                        "& .MuiOutlinedInput-root": {
                            height: 44,
                            borderRadius: 3,

                            background:
                                "rgba(255,255,255,.04)",

                            "& fieldset": {
                                borderColor:
                                    "rgba(255,255,255,.08)",
                            },

                            "&:hover fieldset": {
                                borderColor:
                                    "rgba(59,130,246,.5)",
                            },

                            "&.Mui-focused fieldset": {
                                borderColor: "#3B82F6",
                            },
                        },

                        "& input": {
                            color: "#fff",
                        },

                        "& input::placeholder": {
                            color: "#94A3B8",
                            opacity: 1,
                        },
                    }}

                    InputProps={{
                        startAdornment: (
                            <InputAdornment position="start">
                                <SearchRoundedIcon
                                    sx={{
                                        color: "#64748B",
                                    }}
                                />
                            </InputAdornment>
                        ),
                    }}
                />


                {/* Right Side */}

                <Box
                    sx={{
                        display: "flex",
                        alignItems: "center",
                        gap: 1.5,
                    }}
                >

                    {/* Notifications */}

                    <IconButton
                        sx={{
                            color: "#CBD5E1",

                            "&:hover": {
                                color: "#60A5FA",
                                background:
                                    "rgba(59,130,246,.10)",
                            },
                        }}
                    >
                        <NotificationsNoneRoundedIcon />
                    </IconButton>


                    {/* Settings */}

                    <IconButton
                        sx={{
                            color: "#CBD5E1",

                            display: {
                                xs: "none",
                                sm: "inline-flex",
                            },

                            "&:hover": {
                                color: "#60A5FA",
                                background:
                                    "rgba(59,130,246,.10)",
                            },
                        }}
                    >
                        <SettingsRoundedIcon />
                    </IconButton>


                    {/* Avatar */}

                    <Avatar
                        sx={{
                            width: 42,
                            height: 42,

                            fontWeight: 700,

                            background:
                                "linear-gradient(135deg,#2563EB,#7C3AED)",

                            border:
                                "2px solid rgba(255,255,255,.12)",

                            boxShadow:
                                "0 0 20px rgba(37,99,235,.25)",
                        }}
                    >
                        {username
                            ? username.charAt(0).toUpperCase()
                            : "U"}
                    </Avatar>


                    {/* Username + Role */}

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
                                color: "#fff",
                                fontWeight: 600,
                                fontSize: 14,
                                lineHeight: 1.3,
                            }}
                        >
                            {username || "User"}
                        </Typography>

                        <Chip
                            label={role || "USER"}
                            size="small"
                            sx={{
                                mt: 0.4,
                                height: 20,
                                fontSize: 10,
                                fontWeight: 700,

                                color: "#93C5FD",

                                background:
                                    "rgba(59,130,246,.12)",

                                border:
                                    "1px solid rgba(59,130,246,.25)",
                            }}
                        />

                    </Box>

                </Box>

            </Toolbar>

        </AppBar>
    );
}