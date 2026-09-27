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
    IconButton,
    Tooltip,
} from "@mui/material";

import SearchIcon from "@mui/icons-material/Search";
import RefreshIcon from "@mui/icons-material/Refresh";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import PaymentsIcon from "@mui/icons-material/Payments";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import PendingIcon from "@mui/icons-material/Pending";
import CancelIcon from "@mui/icons-material/Cancel";
import CurrencyRupeeIcon from "@mui/icons-material/CurrencyRupee";
import ReplayIcon from "@mui/icons-material/Replay";

import { useNavigate } from "react-router-dom";

import {
    getAdminPayments,
    refundPayment,
} from "../../services/adminPaymentService";


const normalizeStatus = (status) =>
    String(status || "UNKNOWN").toUpperCase();


const formatMoney = (amount, currency = "INR") => {
    const value = Number(amount || 0);

    try {
        return new Intl.NumberFormat("en-IN", {
            style: "currency",
            currency: currency || "INR",
            maximumFractionDigits: 2,
        }).format(value);
    } catch {
        return `₹${value.toLocaleString("en-IN", {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2,
        })}`;
    }
};


const formatDate = (value) => {
    if (!value) return "—";

    const date = new Date(value);

    if (Number.isNaN(date.getTime())) return "—";

    return date.toLocaleString("en-IN", {
        day: "2-digit",
        month: "short",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
    });
};


export default function AdminPayments() {

    const navigate = useNavigate();

    const [payments, setPayments] = useState([]);
    const [loading, setLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);
    const [error, setError] = useState("");
    const [search, setSearch] = useState("");
    const [statusFilter, setStatusFilter] = useState("ALL");
    const [refundingId, setRefundingId] = useState("");


    const loadPayments = async (isRefresh = false) => {
        try {
            if (isRefresh) {
                setRefreshing(true);
            } else {
                setLoading(true);
            }

            setError("");

            const data = await getAdminPayments();

            setPayments(Array.isArray(data) ? data : []);
        } catch (err) {
            console.error("Admin Payments API Error:", err);

            setError(
                err?.response?.data?.message ||
                "Unable to load payments."
            );
        } finally {
            setLoading(false);
            setRefreshing(false);
        }
    };


    useEffect(() => {
        loadPayments();
    }, []);


    const normalizedPayments = useMemo(() => (
        payments.map((payment) => ({
            ...payment,
            normalizedStatus: normalizeStatus(payment.status),
        }))
    ), [payments]);


    const filteredPayments = useMemo(() => {
        const keyword = search.trim().toLowerCase();

        return normalizedPayments.filter((payment) => {
            const matchesSearch =
                !keyword ||
                String(payment.paymentId || "").toLowerCase().includes(keyword) ||
                String(payment.orderId || "").toLowerCase().includes(keyword) ||
                String(payment.userId || "").toLowerCase().includes(keyword) ||
                String(payment.transactionId || "").toLowerCase().includes(keyword) ||
                String(payment.provider || "").toLowerCase().includes(keyword);

            const matchesStatus =
                statusFilter === "ALL" ||
                payment.normalizedStatus === statusFilter;

            return matchesSearch && matchesStatus;
        });
    }, [normalizedPayments, search, statusFilter]);


    const totalPayments = payments.length;

    const successfulPayments = payments.filter(
        (payment) => normalizeStatus(payment.status) === "SUCCESS"
    ).length;

    const pendingPayments = payments.filter((payment) => {
        const status = normalizeStatus(payment.status);

        return (
            status === "PENDING" ||
            status === "CREATED" ||
            status === "PROCESSING"
        );
    }).length;

    const failedPayments = payments.filter(
        (payment) => normalizeStatus(payment.status) === "FAILED"
    ).length;

    const refundedPayments = payments.filter(
        (payment) => normalizeStatus(payment.status) === "REFUNDED"
    ).length;

    const totalRevenue = payments
        .filter(
            (payment) =>
                normalizeStatus(payment.status) === "SUCCESS"
        )
        .reduce(
            (sum, payment) =>
                sum + Number(payment.amount || 0),
            0
        );


    const getStatusConfig = (status) => {

        switch (normalizeStatus(status)) {

            case "SUCCESS":
                return {
                    label: "SUCCESS",
                    color: "#35d98b",
                    background: "rgba(53,217,139,0.08)",
                    border: "rgba(53,217,139,0.2)",
                    icon: <CheckCircleIcon />,
                };

            case "FAILED":
                return {
                    label: "FAILED",
                    color: "#ef4444",
                    background: "rgba(239,68,68,0.08)",
                    border: "rgba(239,68,68,0.2)",
                    icon: <CancelIcon />,
                };

            case "REFUNDED":
                return {
                    label: "REFUNDED",
                    color: "#c084fc",
                    background: "rgba(192,132,252,0.08)",
                    border: "rgba(192,132,252,0.2)",
                    icon: <ReplayIcon />,
                };

            case "PENDING":
            case "CREATED":
            case "PROCESSING":
                return {
                    label: normalizeStatus(status),
                    color: "#fbbf24",
                    background: "rgba(251,191,36,0.08)",
                    border: "rgba(251,191,36,0.2)",
                    icon: <PendingIcon />,
                };

            default:
                return {
                    label: normalizeStatus(status),
                    color: "#94a3b8",
                    background: "rgba(148,163,184,0.08)",
                    border: "rgba(148,163,184,0.2)",
                    icon: <PendingIcon />,
                };
        }
    };


    const handleRefund = async (payment) => {

        const paymentId = payment.paymentId;

        if (
            !paymentId ||
            normalizeStatus(payment.status) !== "SUCCESS"
        ) {
            return;
        }

        const confirmed = window.confirm(
            `Refund payment ${paymentId}?\n\nAmount: ${formatMoney(
                payment.amount,
                payment.currency
            )}`
        );

        if (!confirmed) return;

        try {

            setRefundingId(paymentId);
            setError("");

            await refundPayment(paymentId);

            await loadPayments(true);

        } catch (err) {

            console.error(
                "Payment refund failed:",
                err
            );

            setError(
                err?.response?.data?.message ||
                "Unable to refund payment."
            );

        } finally {

            setRefundingId("");

        }
    };


    return (
        <Box
            sx={{
                minHeight: "100vh",
                background:
                    "linear-gradient(135deg, #050816 0%, #0b1026 100%)",
                color: "#fff",
                p: { xs: 2, md: 4 },
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
                        Payments
                    </Typography>

                    <Typography
                        sx={{
                            mt: 0.5,
                            color:
                                "rgba(255,255,255,0.45)",
                            fontSize: 14,
                        }}
                    >
                        Monitor payment activity and
                        transaction health across SHDEP.
                    </Typography>

                </Box>


                <Button
                    variant="outlined"
                    startIcon={
                        refreshing ? (
                            <CircularProgress
                                size={16}
                                sx={{
                                    color: "#76a7ff",
                                }}
                            />
                        ) : (
                            <RefreshIcon />
                        )
                    }
                    onClick={() => loadPayments(true)}
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
                        xl: "repeat(5, 1fr)",
                    },
                    gap: 2,
                    mb: 3,
                }}
            >

                {/* Total */}

                <Box
                    sx={{
                        borderRadius: 3,
                        border:
                            "1px solid rgba(255,255,255,0.08)",
                        background:
                            "rgba(255,255,255,0.025)",
                        p: 2.2,
                    }}
                >

                    <Box
                        sx={{
                            display: "flex",
                            justifyContent:
                                "space-between",
                            alignItems: "center",
                        }}
                    >

                        <Typography
                            sx={{
                                fontSize: 11,
                                color:
                                    "rgba(255,255,255,0.45)",
                                textTransform:
                                    "uppercase",
                                letterSpacing: 1,
                            }}
                        >
                            Total Payments
                        </Typography>

                        <PaymentsIcon
                            sx={{
                                fontSize: 19,
                                color: "#76a7ff",
                            }}
                        />

                    </Box>

                    <Typography
                        sx={{
                            mt: 1.2,
                            fontSize: 25,
                            fontWeight: 800,
                        }}
                    >
                        {totalPayments}
                    </Typography>

                </Box>


                {/* Successful */}

                <Box
                    sx={{
                        borderRadius: 3,
                        border:
                            "1px solid rgba(53,217,139,0.12)",
                        background:
                            "rgba(53,217,139,0.025)",
                        p: 2.2,
                    }}
                >

                    <Typography
                        sx={{
                            fontSize: 11,
                            color:
                                "rgba(255,255,255,0.45)",
                            textTransform:
                                "uppercase",
                            letterSpacing: 1,
                        }}
                    >
                        Successful
                    </Typography>

                    <Typography
                        sx={{
                            mt: 1.2,
                            fontSize: 25,
                            fontWeight: 800,
                            color: "#35d98b",
                        }}
                    >
                        {successfulPayments}
                    </Typography>

                </Box>


                {/* Pending */}

                <Box
                    sx={{
                        borderRadius: 3,
                        border:
                            "1px solid rgba(251,191,36,0.12)",
                        background:
                            "rgba(251,191,36,0.025)",
                        p: 2.2,
                    }}
                >

                    <Typography
                        sx={{
                            fontSize: 11,
                            color:
                                "rgba(255,255,255,0.45)",
                            textTransform:
                                "uppercase",
                            letterSpacing: 1,
                        }}
                    >
                        Pending
                    </Typography>

                    <Typography
                        sx={{
                            mt: 1.2,
                            fontSize: 25,
                            fontWeight: 800,
                            color: "#fbbf24",
                        }}
                    >
                        {pendingPayments}
                    </Typography>

                </Box>


                {/* Failed */}

                <Box
                    sx={{
                        borderRadius: 3,
                        border:
                            "1px solid rgba(239,68,68,0.12)",
                        background:
                            "rgba(239,68,68,0.025)",
                        p: 2.2,
                    }}
                >

                    <Typography
                        sx={{
                            fontSize: 11,
                            color:
                                "rgba(255,255,255,0.45)",
                            textTransform:
                                "uppercase",
                            letterSpacing: 1,
                        }}
                    >
                        Failed
                    </Typography>

                    <Typography
                        sx={{
                            mt: 1.2,
                            fontSize: 25,
                            fontWeight: 800,
                            color: "#ef4444",
                        }}
                    >
                        {failedPayments}
                    </Typography>

                </Box>


                {/* Revenue */}

                <Box
                    sx={{
                        borderRadius: 3,
                        border:
                            "1px solid rgba(118,167,255,0.12)",
                        background:
                            "rgba(118,167,255,0.025)",
                        p: 2.2,
                    }}
                >

                    <Typography
                        sx={{
                            fontSize: 11,
                            color:
                                "rgba(255,255,255,0.45)",
                            textTransform:
                                "uppercase",
                            letterSpacing: 1,
                        }}
                    >
                        Successful Revenue
                    </Typography>

                    <Typography
                        sx={{
                            mt: 1.2,
                            fontSize: 20,
                            fontWeight: 800,
                            color: "#76a7ff",
                        }}
                    >
                        {formatMoney(totalRevenue)}
                    </Typography>

                    <Typography
                        sx={{
                            mt: 0.5,
                            fontSize: 10,
                            color:
                                "rgba(255,255,255,0.3)",
                        }}
                    >
                        Refunded: {refundedPayments}
                    </Typography>

                </Box>

            </Box>


            {/* ERROR */}

            {error && (
                <Box
                    sx={{
                        mb: 3,
                        p: 1.5,
                        borderRadius: 2,
                        border:
                            "1px solid rgba(239,68,68,0.2)",
                        background:
                            "rgba(239,68,68,0.06)",
                    }}
                >

                    <Typography
                        sx={{
                            fontSize: 12,
                            color: "#fca5a5",
                        }}
                    >
                        {error}
                    </Typography>

                </Box>
            )}


            {/* CONTROLS */}

            <Box
                sx={{
                    display: "flex",
                    flexDirection: {
                        xs: "column",
                        md: "row",
                    },
                    gap: 2,
                    mb: 3,
                }}
            >

              <TextField
    fullWidth
    placeholder="Search payment, order, user or transaction..."
    value={search}
    onChange={(event) =>
        setSearch(event.target.value)
    }
    slotProps={{
        input: {
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
        },
    }}
                    sx={{
                        maxWidth: {
                            md: 520,
                        },

                        "& .MuiOutlinedInput-root": {
                            color: "#fff",
                            borderRadius: 2,
                            background:
                                "rgba(255,255,255,0.025)",

                            "& fieldset": {
                                borderColor:
                                    "rgba(255,255,255,0.09)",
                            },

                            "&:hover fieldset": {
                                borderColor:
                                    "rgba(255,255,255,0.15)",
                            },

                            "&.Mui-focused fieldset": {
                                borderColor:
                                    "rgba(118,167,255,0.55)",
                            },
                        },

                        "& input::placeholder": {
                            color:
                                "rgba(255,255,255,0.3)",
                            opacity: 1,
                        },
                    }}
                />


                <TextField
                    select
                    value={statusFilter}
                    onChange={(event) =>
                        setStatusFilter(event.target.value)
                    }
                    sx={{
                        minWidth: {
                            md: 180,
                        },

                        "& .MuiOutlinedInput-root": {
                            color: "#fff",
                            borderRadius: 2,
                            background:
                                "rgba(255,255,255,0.025)",

                            "& fieldset": {
                                borderColor:
                                    "rgba(255,255,255,0.09)",
                            },
                        },

                        "& .MuiSvgIcon-root": {
                            color:
                                "rgba(255,255,255,0.5)",
                        },
                    }}
                >

                    <MenuItem value="ALL">
                        All statuses
                    </MenuItem>

                    <MenuItem value="SUCCESS">
                        Success
                    </MenuItem>

                    <MenuItem value="PENDING">
                        Pending
                    </MenuItem>

                    <MenuItem value="FAILED">
                        Failed
                    </MenuItem>

                    <MenuItem value="REFUNDED">
                        Refunded
                    </MenuItem>

                </TextField>

            </Box>


            {/* PAYMENT LIST */}

            <Box
                sx={{
                    borderRadius: 3,
                    border:
                        "1px solid rgba(255,255,255,0.08)",
                    background:
                        "rgba(255,255,255,0.02)",
                    overflow: "hidden",
                }}
            >

                {/* TABLE HEADER */}

                <Box
                    sx={{
                        display: {
                            xs: "none",
                            lg: "grid",
                        },
                        gridTemplateColumns:
                            "1.2fr 1.2fr 1.4fr 0.9fr 0.8fr 0.9fr 0.9fr",
                        gap: 2,
                        px: 2.5,
                        py: 1.5,
                        borderBottom:
                            "1px solid rgba(255,255,255,0.07)",
                        background:
                            "rgba(255,255,255,0.025)",
                    }}
                >

                    {[
                        "Payment",
                        "Order / User",
                        "Transaction",
                        "Amount",
                        "Provider",
                        "Status",
                        "Action",
                    ].map((heading) => (
                        <Typography
                            key={heading}
                            sx={{
                                fontSize: 10,
                                fontWeight: 700,
                                color:
                                    "rgba(255,255,255,0.35)",
                                textTransform:
                                    "uppercase",
                                letterSpacing: 0.8,
                            }}
                        >
                            {heading}
                        </Typography>
                    ))}

                </Box>


                {loading ? (

                    <Box
                        sx={{
                            py: 8,
                            display: "flex",
                            justifyContent:
                                "center",
                            alignItems: "center",
                            gap: 1.5,
                        }}
                    >

                        <CircularProgress
                            size={22}
                            sx={{
                                color: "#76a7ff",
                            }}
                        />

                        <Typography
                            sx={{
                                fontSize: 13,
                                color:
                                    "rgba(255,255,255,0.4)",
                            }}
                        >
                            Loading payments...
                        </Typography>

                    </Box>

                ) : filteredPayments.length === 0 ? (

                    <Box
                        sx={{
                            py: 8,
                            textAlign: "center",
                        }}
                    >

                        <PaymentsIcon
                            sx={{
                                fontSize: 38,
                                color:
                                    "rgba(255,255,255,0.15)",
                                mb: 1,
                            }}
                        />

                        <Typography
                            sx={{
                                fontSize: 14,
                                fontWeight: 600,
                            }}
                        >
                            No payments found
                        </Typography>

                        <Typography
                            sx={{
                                mt: 0.5,
                                fontSize: 12,
                                color:
                                    "rgba(255,255,255,0.35)",
                            }}
                        >
                            Try changing your search or
                            status filter.
                        </Typography>

                    </Box>

                ) : (

                    <Box>

                        {filteredPayments.map(
                            (payment) => {

                                const status =
                                    getStatusConfig(
                                        payment.status
                                    );

                                const isRefunding =
                                    refundingId ===
                                    payment.paymentId;

                                const canRefund =
                                    normalizeStatus(
                                        payment.status
                                    ) === "SUCCESS";

                                return (
                                    <Box
                                        key={
                                            payment.paymentId
                                        }
                                        sx={{
                                            display: "grid",
                                            gridTemplateColumns: {
                                                xs: "1fr",
                                                lg:
                                                    "1.2fr 1.2fr 1.4fr 0.9fr 0.8fr 0.9fr 0.9fr",
                                            },
                                            gap: 2,
                                            px: 2.5,
                                            py: 2,
                                            borderBottom:
                                                "1px solid rgba(255,255,255,0.05)",
                                            "&:hover": {
                                                background:
                                                    "rgba(255,255,255,0.025)",
                                            },
                                        }}
                                    >

                                        <Box>
                                            <Typography
                                                sx={{
                                                    fontSize: 12,
                                                    fontWeight: 700,
                                                }}
                                            >
                                                #
                                                {payment.paymentId ||
                                                    "—"}
                                            </Typography>

                                            <Typography
                                                sx={{
                                                    mt: 0.35,
                                                    fontSize: 10,
                                                    color:
                                                        "rgba(255,255,255,0.38)",
                                                }}
                                            >
                                                {formatDate(
                                                    payment.createdAt
                                                )}
                                            </Typography>
                                        </Box>


                                        <Box>

                                            <Typography
                                                sx={{
                                                    fontSize: 12,
                                                    fontWeight: 700,
                                                }}
                                            >
                                                Order #
                                                {payment.orderId ||
                                                    "—"}
                                            </Typography>

                                            <Typography
                                                sx={{
                                                    mt: 0.35,
                                                    fontSize: 10,
                                                    color:
                                                        "rgba(255,255,255,0.45)",
                                                }}
                                            >
                                                User:{" "}
                                                {payment.userId ||
                                                    "—"}
                                            </Typography>

                                        </Box>


                                        <Typography
                                            sx={{
                                                fontSize: 11,
                                                color:
                                                    "rgba(255,255,255,0.6)",
                                                overflow:
                                                    "hidden",
                                                textOverflow:
                                                    "ellipsis",
                                                whiteSpace:
                                                    "nowrap",
                                                pr: 2,
                                            }}
                                            title={
                                                payment.transactionId ||
                                                ""
                                            }
                                        >
                                            {payment.transactionId ||
                                                "—"}
                                        </Typography>


                                        <Typography
                                            sx={{
                                                fontSize: 13,
                                                fontWeight: 700,
                                            }}
                                        >
                                            {formatMoney(
                                                payment.amount,
                                                payment.currency
                                            )}
                                        </Typography>


                                        <Typography
                                            sx={{
                                                fontSize: 12,
                                                color:
                                                    "rgba(255,255,255,0.6)",
                                            }}
                                        >
                                            {payment.provider ||
                                                "—"}
                                        </Typography>


                                        <Chip
                                            icon={status.icon}
                                            label={status.label}
                                            size="small"
                                            sx={{
                                                width: "fit-content",
                                                color:
                                                    status.color,
                                                background:
                                                    status.background,
                                                border: `1px solid ${status.border}`,
                                                fontWeight: 700,
                                                fontSize: 10,
                                            }}
                                        />


                                        <Box>

                                            {canRefund ? (

                                                <Tooltip
                                                    title="Refund payment"
                                                >

                                                    <span>

                                                        <Button
                                                            size="small"
                                                            variant="outlined"
                                                            startIcon={
                                                                isRefunding ? (
                                                                    <CircularProgress
                                                                        size={
                                                                            13
                                                                        }
                                                                        sx={{
                                                                            color:
                                                                                "#c084fc",
                                                                        }}
                                                                    />
                                                                ) : (
                                                                    <ReplayIcon />
                                                                )
                                                            }
                                                            disabled={
                                                                isRefunding
                                                            }
                                                            onClick={() =>
                                                                handleRefund(
                                                                    payment
                                                                )
                                                            }
                                                            sx={{
                                                                color:
                                                                    "#c084fc",
                                                                borderColor:
                                                                    "rgba(192,132,252,0.2)",
                                                                textTransform:
                                                                    "none",
                                                                borderRadius:
                                                                    2,
                                                                fontSize: 11,
                                                            }}
                                                        >
                                                            Refund
                                                        </Button>

                                                    </span>

                                                </Tooltip>

                                            ) : (

                                                <IconButton
                                                    size="small"
                                                    disabled
                                                    sx={{
                                                        color:
                                                            "rgba(255,255,255,0.16)",
                                                    }}
                                                >
                                                    <PaymentsIcon
                                                        fontSize="small"
                                                    />
                                                </IconButton>

                                            )}

                                        </Box>

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