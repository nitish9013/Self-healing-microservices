import React, { useEffect, useMemo, useState } from "react";

import {
    Box,
    Typography,
    TextField,
    InputAdornment,
    Button,
    Chip,
    CircularProgress,
    MenuItem,
} from "@mui/material";

import SearchIcon from "@mui/icons-material/Search";
import RefreshIcon from "@mui/icons-material/Refresh";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import PendingIcon from "@mui/icons-material/Pending";
import CancelIcon from "@mui/icons-material/Cancel";

import { useNavigate } from "react-router-dom";

import { getAdminOrders } from "../../services/adminOrderService";


export default function AdminOrders() {

    const navigate = useNavigate();

    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);
    const [error, setError] = useState("");

    const [search, setSearch] = useState("");
    const [statusFilter, setStatusFilter] = useState("ALL");


    const loadOrders = async (isRefresh = false) => {

        try {

            if (isRefresh) {
                setRefreshing(true);
            } else {
                setLoading(true);
            }

            setError("");

            const data = await getAdminOrders();

            setOrders(
                Array.isArray(data)
                    ? data
                    : []
            );

        } catch (err) {

            console.error(
                "Admin Orders API Error:",
                err
            );

            setError(
                err?.response?.data?.message ||
                "Unable to load orders."
            );

        } finally {

            setLoading(false);
            setRefreshing(false);
        }
    };


    useEffect(() => {
        loadOrders();
    }, []);


    const normalizedOrders = useMemo(() => {

        return orders.map((order) => ({
            ...order,

            normalizedStatus:
                String(order.status || "UNKNOWN")
                    .toUpperCase(),

            total:
                Number(order.price || 0) *
                Number(order.quantity || 0),
        }));

    }, [orders]);


    const filteredOrders = useMemo(() => {

        const keyword =
            search.trim().toLowerCase();

        return normalizedOrders.filter((order) => {

            const matchesSearch =
                !keyword ||
                String(order.id || "")
                    .toLowerCase()
                    .includes(keyword) ||
                String(order.username || "")
                    .toLowerCase()
                    .includes(keyword) ||
                String(order.productName || "")
                    .toLowerCase()
                    .includes(keyword);

            const matchesStatus =
                statusFilter === "ALL" ||
                order.normalizedStatus === statusFilter;

            return (
                matchesSearch &&
                matchesStatus
            );
        });

    }, [
        normalizedOrders,
        search,
        statusFilter,
    ]);


    const totalOrders =
        orders.length;

    const paidOrders =
        orders.filter(
            (order) =>
                String(order.status || "")
                    .toUpperCase() === "PAID"
        ).length;

    const pendingOrders =
        orders.filter((order) => {

            const status =
                String(order.status || "")
                    .toUpperCase();

            return (
                status === "PENDING" ||
                status === "CREATED"
            );

        }).length;

    const failedOrders =
        orders.filter(
            (order) =>
                String(order.status || "")
                    .toUpperCase() === "FAILED"
        ).length;


    const getStatusConfig = (status) => {

        switch (
            String(status || "")
                .toUpperCase()
        ) {

            case "PAID":
                return {
                    label: "PAID",
                    color: "#35d98b",
                    background:
                        "rgba(53,217,139,0.08)",
                    border:
                        "rgba(53,217,139,0.2)",
                    icon: <CheckCircleIcon />,
                };

            case "FAILED":
                return {
                    label: "FAILED",
                    color: "#ef4444",
                    background:
                        "rgba(239,68,68,0.08)",
                    border:
                        "rgba(239,68,68,0.2)",
                    icon: <CancelIcon />,
                };

            case "PENDING":
            case "CREATED":
                return {
                    label:
                        String(status || "")
                            .toUpperCase() === "CREATED"
                            ? "CREATED"
                            : "PENDING",
                    color: "#fbbf24",
                    background:
                        "rgba(251,191,36,0.08)",
                    border:
                        "rgba(251,191,36,0.2)",
                    icon: <PendingIcon />,
                };

            default:
                return {
                    label:
                        String(status || "UNKNOWN")
                            .toUpperCase(),
                    color: "#94a3b8",
                    background:
                        "rgba(148,163,184,0.08)",
                    border:
                        "rgba(148,163,184,0.2)",
                    icon: <PendingIcon />,
                };
        }
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
                        onClick={() =>
                            navigate("/admin")
                        }
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
                        Orders
                    </Typography>

                    <Typography
                        sx={{
                            mt: 0.5,
                            color:
                                "rgba(255,255,255,0.45)",
                            fontSize: 14,
                        }}
                    >
                        Monitor all orders across SHDEP.
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
                    onClick={() =>
                        loadOrders(true)
                    }
                    disabled={
                        loading ||
                        refreshing
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


            {/* STAT CARDS */}

            <Box
                sx={{
                    display: "grid",
                    gridTemplateColumns: {
                        xs: "1fr",
                        sm: "repeat(2, 1fr)",
                        xl: "repeat(4, 1fr)",
                    },
                    gap: 2,
                    mb: 3,
                }}
            >

                {[
                    {
                        label: "Total Orders",
                        value: totalOrders,
                        icon: <ShoppingCartIcon />,
                        color: "#76a7ff",
                    },
                    {
                        label: "Paid Orders",
                        value: paidOrders,
                        icon: <CheckCircleIcon />,
                        color: "#35d98b",
                    },
                    {
                        label: "Pending / Created",
                        value: pendingOrders,
                        icon: <PendingIcon />,
                        color: "#fbbf24",
                    },
                    {
                        label: "Failed Orders",
                        value: failedOrders,
                        icon: <CancelIcon />,
                        color: "#ef4444",
                    },
                ].map((card) => (

                    <Box
                        key={card.label}
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
                                    `${card.color}18`,
                                color: card.color,
                                mb: 2,
                            }}
                        >
                            {card.icon}
                        </Box>

                        <Typography
                            sx={{
                                fontSize: 12,
                                color:
                                    "rgba(255,255,255,0.4)",
                            }}
                        >
                            {card.label}
                        </Typography>

                        <Typography
                            sx={{
                                mt: 0.5,
                                fontSize: 30,
                                fontWeight: 800,
                                color: card.color,
                            }}
                        >
                            {card.value}
                        </Typography>

                    </Box>

                ))}

            </Box>


            {/* SEARCH + FILTER */}

            <Box
                sx={{
                    display: "grid",
                    gridTemplateColumns: {
                        xs: "1fr",
                        md: "1fr 220px",
                    },
                    gap: 2,
                    mb: 2,
                }}
            >

                <TextField
                    fullWidth
                    value={search}
                    onChange={(e) =>
                        setSearch(e.target.value)
                    }
                    placeholder="Search order ID, username or product..."
                    InputProps={{
                        startAdornment: (
                            <InputAdornment
                                position="start"
                            >
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


                <TextField
                    select
                    value={statusFilter}
                    onChange={(e) =>
                        setStatusFilter(
                            e.target.value
                        )
                    }
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
                        },
                        "& .MuiSvgIcon-root": {
                            color:
                                "rgba(255,255,255,0.5)",
                        },
                    }}
                >

                    <MenuItem value="ALL">
                        All Statuses
                    </MenuItem>

                    <MenuItem value="CREATED">
                        Created
                    </MenuItem>

                    <MenuItem value="PENDING">
                        Pending
                    </MenuItem>

                    <MenuItem value="PAID">
                        Paid
                    </MenuItem>

                    <MenuItem value="FAILED">
                        Failed
                    </MenuItem>

                </TextField>

            </Box>


            {/* ERROR */}

            {error && (

                <Box
                    sx={{
                        mb: 3,
                        p: 2,
                        borderRadius: 2,
                        border:
                            "1px solid rgba(239,68,68,0.2)",
                        background:
                            "rgba(239,68,68,0.08)",
                    }}
                >
                    <Typography
                        sx={{
                            color: "#fca5a5",
                            fontSize: 13,
                        }}
                    >
                        {error}
                    </Typography>
                </Box>

            )}


            {/* TABLE */}

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

                ) : filteredOrders.length === 0 ? (

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

                        <ShoppingCartIcon
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
                            No orders found
                        </Typography>

                    </Box>

                ) : (

                    <Box
                        sx={{
                            overflowX: "auto",
                        }}
                    >

                        {/* HEADER */}

                        <Box
                            sx={{
                                minWidth: 950,
                                display: "grid",
                                gridTemplateColumns:
                                    "80px 1.2fr 1.5fr 80px 110px 130px",
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
                                "Customer",
                                "Product",
                                "Qty",
                                "Amount",
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


                        {/* ROWS */}

                        {filteredOrders.map(
                            (order, index) => {

                                const status =
                                    getStatusConfig(
                                        order.status
                                    );

                                return (

                                    <Box
                                        key={
                                            order.id ??
                                            index
                                        }
                                        sx={{
                                            minWidth: 950,
                                            display: "grid",
                                            gridTemplateColumns:
                                                "80px 1.2fr 1.5fr 80px 110px 130px",
                                            px: 2.5,
                                            py: 2,
                                            alignItems:
                                                "center",
                                            borderBottom:
                                                index ===
                                                filteredOrders.length - 1
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
                                            #{order.id}
                                        </Typography>


                                        <Typography
                                            sx={{
                                                fontSize: 13,
                                                fontWeight: 700,
                                            }}
                                        >
                                            {order.username || "—"}
                                        </Typography>


                                        <Typography
                                            sx={{
                                                fontSize: 12,
                                                color:
                                                    "rgba(255,255,255,0.6)",
                                            }}
                                        >
                                            {order.productName || "—"}
                                        </Typography>


                                        <Typography
                                            sx={{
                                                fontSize: 12,
                                                color:
                                                    "rgba(255,255,255,0.65)",
                                            }}
                                        >
                                            {order.quantity ?? "—"}
                                        </Typography>


                                        <Typography
                                            sx={{
                                                fontSize: 13,
                                                fontWeight: 700,
                                            }}
                                        >
                                            ₹
                                            {order.total.toLocaleString(
                                                "en-IN",
                                                {
                                                    minimumFractionDigits: 2,
                                                    maximumFractionDigits: 2,
                                                }
                                            )}
                                        </Typography>


                                        <Chip
                                            icon={
                                                status.icon
                                            }
                                            label={
                                                status.label
                                            }
                                            size="small"
                                            sx={{
                                                width:
                                                    "fit-content",
                                                color:
                                                    status.color,
                                                background:
                                                    status.background,
                                                border:
                                                    `1px solid ${status.border}`,
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