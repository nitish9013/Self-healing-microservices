import React, { useEffect, useMemo, useState } from "react";
import {
    Box,
    Typography,
    TextField,
    InputAdornment,
    IconButton,
    Button,
    Chip,
    CircularProgress,
} from "@mui/material";

import SearchIcon from "@mui/icons-material/Search";
import RefreshIcon from "@mui/icons-material/Refresh";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import PeopleIcon from "@mui/icons-material/People";
import AdminPanelSettingsIcon from "@mui/icons-material/AdminPanelSettings";
import PersonIcon from "@mui/icons-material/Person";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import BlockIcon from "@mui/icons-material/Block";

import { useNavigate } from "react-router-dom";

import { getAdminUsers } from "../../services/adminUserService";

export default function AdminUsers() {

    const navigate = useNavigate();

    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);
    const [error, setError] = useState("");
    const [search, setSearch] = useState("");

    const loadUsers = async (isRefresh = false) => {

        try {

            if (isRefresh) {
                setRefreshing(true);
            } else {
                setLoading(true);
            }

            setError("");

            const data = await getAdminUsers();

            setUsers(Array.isArray(data) ? data : []);

        } catch (err) {

            console.error(
                "Admin Users API Error:",
                err
            );

            setError(
                err?.response?.data?.message ||
                "Unable to load users."
            );

        } finally {

            setLoading(false);
            setRefreshing(false);

        }
    };

    useEffect(() => {
        loadUsers();
    }, []);

    const filteredUsers = useMemo(() => {

        const keyword =
            search.trim().toLowerCase();

        if (!keyword) {
            return users;
        }

        return users.filter((user) => {

            const username =
                String(user.username || "")
                    .toLowerCase();

            const email =
                String(user.email || "")
                    .toLowerCase();

            const role =
                Array.isArray(user.roles)
                    ? user.roles.join(" ").toLowerCase()
                    : String(user.roles || "")
                        .toLowerCase();

            return (
                username.includes(keyword) ||
                email.includes(keyword) ||
                role.includes(keyword)
            );
        });

    }, [users, search]);

    const getRole = (user) => {

        if (
            !user.roles ||
            user.roles.length === 0
        ) {
            return "USER";
        }

        return String(user.roles[0])
            .replace("ROLE_", "")
            .toUpperCase();
    };

    const getRoleColor = (role) => {

        if (role === "ADMIN") {
            return "#a78bfa";
        }

        return "#76a7ff";
    };

    return (
        <Box
            sx={{
                minHeight: "100vh",
                background:
                    "linear-gradient(135deg, #050816 0%, #0b1026 100%)",
                color: "#fff",
                p: {
                    xs: 2,
                    md: 4,
                },
            }}
        >

            {/* HEADER */}

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
                        startIcon={<ArrowBackIcon />}
                        onClick={() => navigate("/admin")}
                        sx={{
                            color:
                                "rgba(255,255,255,0.55)",
                            mb: 1,
                            textTransform: "none",
                        }}
                    >
                        Back to Overview
                    </Button>

                    <Typography
                        sx={{
                            fontSize: {
                                xs: 26,
                                md: 32,
                            },
                            fontWeight: 800,
                        }}
                    >
                        Users
                    </Typography>

                    <Typography
                        sx={{
                            mt: 0.5,
                            color:
                                "rgba(255,255,255,0.45)",
                            fontSize: 14,
                        }}
                    >
                        Manage registered users
                    </Typography>

                </Box>


                <Button
                    variant="outlined"
                    startIcon={
                        refreshing
                            ? (
                                <CircularProgress
                                    size={16}
                                    sx={{
                                        color: "#76a7ff",
                                    }}
                                />
                            )
                            : <RefreshIcon />
                    }
                    onClick={() => loadUsers(true)}
                    disabled={
                        loading || refreshing
                    }
                    sx={{
                        color: "#fff",
                        borderColor:
                            "rgba(255,255,255,0.12)",
                        textTransform: "none",
                        borderRadius: 2,
                        px: 2,
                    }}
                >
                    Refresh
                </Button>

            </Box>


            {/* TOTAL USERS */}

            <Box
                sx={{
                    display: "grid",
                    gridTemplateColumns: {
                        xs: "1fr",
                        sm: "repeat(3, 1fr)",
                    },
                    gap: 2,
                    mb: 3,
                }}
            >

                <Box
                    sx={{
                        p: 2.5,
                        borderRadius: 4,
                        background:
                            "rgba(255,255,255,0.035)",
                        border:
                            "1px solid rgba(255,255,255,0.07)",
                    }}
                >

                    <Box
                        sx={{
                            width: 42,
                            height: 42,
                            borderRadius: 2,
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            background:
                                "rgba(118,167,255,0.12)",
                            mb: 2,
                        }}
                    >
                        <PeopleIcon
                            sx={{
                                color: "#76a7ff",
                            }}
                        />
                    </Box>

                    <Typography
                        sx={{
                            fontSize: 12,
                            color:
                                "rgba(255,255,255,0.4)",
                        }}
                    >
                        Total Users
                    </Typography>

                    <Typography
                        sx={{
                            mt: 0.5,
                            fontSize: 30,
                            fontWeight: 800,
                        }}
                    >
                        {users.length}
                    </Typography>

                </Box>


                <Box
                    sx={{
                        p: 2.5,
                        borderRadius: 4,
                        background:
                            "rgba(255,255,255,0.035)",
                        border:
                            "1px solid rgba(255,255,255,0.07)",
                    }}
                >

                    <Typography
                        sx={{
                            fontSize: 12,
                            color:
                                "rgba(255,255,255,0.4)",
                        }}
                    >
                        Active Users
                    </Typography>

                    <Typography
                        sx={{
                            mt: 0.5,
                            fontSize: 30,
                            fontWeight: 800,
                            color: "#35d98b",
                        }}
                    >
                        {
                            users.filter(
                                (user) =>
                                    user.active
                            ).length
                        }
                    </Typography>

                </Box>


                <Box
                    sx={{
                        p: 2.5,
                        borderRadius: 4,
                        background:
                            "rgba(255,255,255,0.035)",
                        border:
                            "1px solid rgba(255,255,255,0.07)",
                    }}
                >

                    <Typography
                        sx={{
                            fontSize: 12,
                            color:
                                "rgba(255,255,255,0.4)",
                        }}
                    >
                        Admin Users
                    </Typography>

                    <Typography
                        sx={{
                            mt: 0.5,
                            fontSize: 30,
                            fontWeight: 800,
                            color: "#a78bfa",
                        }}
                    >
                        {
                            users.filter(
                                (user) =>
                                    getRole(user) ===
                                    "ADMIN"
                            ).length
                        }
                    </Typography>

                </Box>

            </Box>


            {/* SEARCH */}

            <Box
                sx={{
                    mb: 2,
                }}
            >

                <TextField
                    fullWidth
                    value={search}
                    onChange={(e) =>
                        setSearch(e.target.value)
                    }
                    placeholder="Search username, email or role..."
                    InputProps={{
                        startAdornment: (
                            <InputAdornment position="start">
                                <SearchIcon
                                    sx={{
                                        color:
                                            "rgba(255,255,255,0.35)",
                                    }}
                                />
                            </InputAdornment>
                        ),
                    }}
                    sx={{
                        "& .MuiOutlinedInput-root": {
                            color: "#fff",
                            background:
                                "rgba(255,255,255,0.035)",
                            borderRadius: 3,
                            "& fieldset": {
                                borderColor:
                                    "rgba(255,255,255,0.07)",
                            },
                            "&:hover fieldset": {
                                borderColor:
                                    "rgba(118,167,255,0.3)",
                            },
                            "&.Mui-focused fieldset": {
                                borderColor:
                                    "#76a7ff",
                            },
                        },
                        "& input::placeholder": {
                            color:
                                "rgba(255,255,255,0.35)",
                            opacity: 1,
                        },
                    }}
                />

            </Box>


            {/* CONTENT */}

            <Box
                sx={{
                    borderRadius: 4,
                    overflow: "hidden",
                    border:
                        "1px solid rgba(255,255,255,0.07)",
                    background:
                        "rgba(255,255,255,0.025)",
                }}
            >

                {loading ? (

                    <Box
                        sx={{
                            minHeight: 300,
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                        }}
                    >
                        <CircularProgress
                            sx={{
                                color: "#76a7ff",
                            }}
                        />
                    </Box>

                ) : error ? (

                    <Box
                        sx={{
                            p: 5,
                            textAlign: "center",
                        }}
                    >

                        <Typography
                            sx={{
                                color: "#ef4444",
                                mb: 2,
                            }}
                        >
                            {error}
                        </Typography>

                        <Button
                            onClick={() =>
                                loadUsers(true)
                            }
                            variant="outlined"
                            sx={{
                                color: "#fff",
                                borderColor:
                                    "rgba(255,255,255,0.15)",
                                textTransform: "none",
                            }}
                        >
                            Try Again
                        </Button>

                    </Box>

                ) : filteredUsers.length === 0 ? (

                    <Box
                        sx={{
                            minHeight: 250,
                            display: "flex",
                            flexDirection: "column",
                            alignItems: "center",
                            justifyContent: "center",
                            p: 4,
                        }}
                    >

                        <PeopleIcon
                            sx={{
                                fontSize: 45,
                                color:
                                    "rgba(255,255,255,0.18)",
                                mb: 1,
                            }}
                        />

                        <Typography
                            sx={{
                                color:
                                    "rgba(255,255,255,0.55)",
                            }}
                        >
                            No users found
                        </Typography>

                    </Box>

                ) : (

                    <Box
                        sx={{
                            overflowX: "auto",
                        }}
                    >

                        {/* TABLE HEADER */}

                        <Box
                            sx={{
                                minWidth: 750,
                                display: "grid",
                                gridTemplateColumns:
                                    "80px 1.3fr 1.8fr 1fr 120px",
                                px: 2.5,
                                py: 1.8,
                                borderBottom:
                                    "1px solid rgba(255,255,255,0.07)",
                                background:
                                    "rgba(255,255,255,0.025)",
                            }}
                        >

                            {[
                                "ID",
                                "Username",
                                "Email",
                                "Role",
                                "Status",
                            ].map((heading) => (

                                <Typography
                                    key={heading}
                                    sx={{
                                        fontSize: 11,
                                        fontWeight: 700,
                                        color:
                                            "rgba(255,255,255,0.4)",
                                        textTransform:
                                            "uppercase",
                                    }}
                                >
                                    {heading}
                                </Typography>

                            ))}

                        </Box>


                        {/* USER ROWS */}

                        {filteredUsers.map(
                            (user, index) => {

                                const role =
                                    getRole(user);

                                const active =
                                    Boolean(
                                        user.active
                                    );

                                return (

                                    <Box
                                        key={
                                            user.id ??
                                            index
                                        }
                                        sx={{
                                            minWidth: 750,
                                            display: "grid",
                                            gridTemplateColumns:
                                                "80px 1.3fr 1.8fr 1fr 120px",
                                            px: 2.5,
                                            py: 2,
                                            alignItems:
                                                "center",
                                            borderBottom:
                                                index ===
                                                filteredUsers.length - 1
                                                    ? "none"
                                                    : "1px solid rgba(255,255,255,0.05)",
                                            "&:hover": {
                                                background:
                                                    "rgba(255,255,255,0.025)",
                                            },
                                        }}
                                    >

                                        <Typography
                                            sx={{
                                                fontSize: 12,
                                                color:
                                                    "rgba(255,255,255,0.5)",
                                            }}
                                        >
                                            #{user.id}
                                        </Typography>


                                        <Box
                                            sx={{
                                                display: "flex",
                                                alignItems: "center",
                                                gap: 1.2,
                                            }}
                                        >

                                            <Box
                                                sx={{
                                                    width: 34,
                                                    height: 34,
                                                    borderRadius: "50%",
                                                    display: "flex",
                                                    alignItems: "center",
                                                    justifyContent: "center",
                                                    background:
                                                        "rgba(118,167,255,0.12)",
                                                }}
                                            >
                                                <PersonIcon
                                                    sx={{
                                                        fontSize: 18,
                                                        color:
                                                            "#76a7ff",
                                                    }}
                                                />
                                            </Box>

                                            <Typography
                                                sx={{
                                                    fontSize: 13,
                                                    fontWeight: 700,
                                                }}
                                            >
                                                {user.username}
                                            </Typography>

                                        </Box>


                                        <Typography
                                            sx={{
                                                fontSize: 12,
                                                color:
                                                    "rgba(255,255,255,0.6)",
                                            }}
                                        >
                                            {user.email}
                                        </Typography>


                                        <Chip
                                            icon={
                                                role ===
                                                "ADMIN"
                                                    ? (
                                                        <AdminPanelSettingsIcon />
                                                    )
                                                    : undefined
                                            }
                                            label={role}
                                            size="small"
                                            sx={{
                                                width: "fit-content",
                                                color:
                                                    getRoleColor(
                                                        role
                                                    ),
                                                background:
                                                    "rgba(118,167,255,0.08)",
                                                border:
                                                    `1px solid ${getRoleColor(role)}33`,
                                                fontWeight: 700,
                                                fontSize: 10,
                                            }}
                                        />


                                        <Chip
                                            icon={
                                                active
                                                    ? (
                                                        <CheckCircleIcon />
                                                    )
                                                    : (
                                                        <BlockIcon />
                                                    )
                                            }
                                            label={
                                                active
                                                    ? "ACTIVE"
                                                    : "INACTIVE"
                                            }
                                            size="small"
                                            sx={{
                                                width: "fit-content",
                                                color: active
                                                    ? "#35d98b"
                                                    : "#ef4444",
                                                background:
                                                    active
                                                        ? "rgba(53,217,139,0.08)"
                                                        : "rgba(239,68,68,0.08)",
                                                border:
                                                    active
                                                        ? "1px solid rgba(53,217,139,0.2)"
                                                        : "1px solid rgba(239,68,68,0.2)",
                                                fontWeight: 700,
                                                fontSize: 10,
                                            }}
                                        />

                                    </Box>
                                );
                            }
                        )}

                    </Box>
                )}

            </Box>

        </Box>
    );
}