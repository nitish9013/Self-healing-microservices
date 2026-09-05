import React from "react";
import { useEffect, useState } from "react";
import { getPaymentsByUserId } from "../../services/paymentService";
import {
    Box,
    Card,
    CardContent,
    Typography,
    Button,
    Chip,
    Divider
} from "@mui/material";

import {
    PaymentsRounded,
    RefreshRounded,
    ReceiptLongRounded
} from "@mui/icons-material";



const Payment = () => {

const [payments, setPayments] = useState([]);
const [loading, setLoading] = useState(true);
const [error, setError] = useState("");

const loadPayments = async () => {
    try {
        setLoading(true);
        setError("");

        const userId = localStorage.getItem("userId");

        if (!userId) {
            throw new Error(
                "User ID not found. Please login again."
            );
        }

        const data = await getPaymentsByUserId(userId);

        setPayments(
            Array.isArray(data) ? data : []
        );

    } catch (err) {
        console.error(
            "Failed to load payments:",
            err
        );

        setError(
            err?.response?.data?.message ||
            err?.message ||
            "Unable to load payment history."
        );

        setPayments([]);
    } finally {
        setLoading(false);
    }
};

useEffect(() => {
    loadPayments();
}, []);
    const getStatusColor = (status) => {

        switch (
            String(status || "").toUpperCase()
        ) {

            case "SUCCESS":
                return "success";

            case "PENDING":
                return "warning";

            case "FAILED":
                return "error";

            case "REFUNDED":
                return "info";

            default:
                return "default";
        }
    };


    return (

        <Box
            sx={{
                p: {
                    xs: 2,
                    md: 4
                },

                maxWidth: 1200,

                mx: "auto"
            }}
        >

            {/* =========================
                PAGE HEADER
            ========================= */}

            <Box
                sx={{
                    mb: 4
                }}
            >

                <Box
                    sx={{
                        display: "flex",
                        alignItems: "center",
                        gap: 1.5,
                        mb: 1
                    }}
                >

                    <PaymentsRounded
                        sx={{
                            color: "#38BDF8",
                            fontSize: 32
                        }}
                    />

                    <Typography
                        variant="h4"
                        sx={{
                            fontWeight: 700,
                            color: "white"
                        }}
                    >
                        Payments
                    </Typography>

                </Box>


                <Typography
                    sx={{
                        color: "#94A3B8"
                    }}
                >
                    View and monitor your payment history
                </Typography>

            </Box>


            {/* =========================
                PAYMENT HISTORY
            ========================= */}

            <Card
                sx={{
                    background:
                        "rgba(15,23,42,0.85)",

                    border:
                        "1px solid rgba(255,255,255,0.08)",

                    borderRadius: 3
                }}
            >

                <CardContent
                    sx={{
                        p: {
                            xs: 2,
                            md: 3
                        }
                    }}
                >

                    {/* HEADER */}

                    <Box
                        sx={{
                            display: "flex",

                            justifyContent:
                                "space-between",

                            alignItems:
                                "center",

                            gap: 2,

                            mb: 2
                        }}
                    >

                        <Box>

                            <Typography
                                variant="h6"
                                sx={{
                                    color: "white",
                                    fontWeight: 700
                                }}
                            >
                                Payment History
                            </Typography>


                            <Typography
                                sx={{
                                    color: "#64748B",
                                    fontSize: 13,
                                    mt: 0.5
                                }}
                            >
                                Payments associated with your account
                            </Typography>

                        </Box>


                        <Button
                            variant="outlined"

                            startIcon={
                                <RefreshRounded />
                            }

                            onClick={loadPayments}
                            disabled={loading}
                        >
                            Refresh
                        </Button>

                    </Box>


                    <Divider
                        sx={{
                            borderColor:
                                "rgba(255,255,255,0.08)",

                            mb: 3
                        }}
                    />


                    {/* =========================
                        EMPTY STATE
                    ========================= */}

                    {payments.length === 0 && (

                        <Box
                            sx={{
                                minHeight: 300,

                                display: "flex",

                                flexDirection:
                                    "column",

                                justifyContent:
                                    "center",

                                alignItems:
                                    "center",

                                textAlign:
                                    "center",

                                px: 2
                            }}
                        >

                            <Box
                                sx={{
                                    width: 70,
                                    height: 70,

                                    borderRadius:
                                        "50%",

                                    display:
                                        "flex",

                                    alignItems:
                                        "center",

                                    justifyContent:
                                        "center",

                                    background:
                                        "rgba(56,189,248,0.08)",

                                    border:
                                        "1px solid rgba(56,189,248,0.18)",

                                    mb: 2
                                }}
                            >

                                <ReceiptLongRounded
                                    sx={{
                                        fontSize: 34,
                                        color: "#38BDF8"
                                    }}
                                />

                            </Box>


                            <Typography
                                sx={{
                                    color: "#E2E8F0",

                                    fontWeight: 700,

                                    fontSize: 17
                                }}
                            >
                                No payment records available
                            </Typography>


                            <Typography
                                sx={{
                                    color: "#64748B",

                                    fontSize: 14,

                                    mt: 1,

                                    maxWidth: 430
                                }}
                            >
                                Your completed, pending and failed
                                payments will appear here once payment
                                history is connected.
                            </Typography>

                        </Box>

                    )}


                    {/* =========================
                        PAYMENT LIST
                        Ready for backend data
                    ========================= */}

                    {payments.length > 0 && (

                        <Box
                            sx={{
                                display: "flex",

                                flexDirection:
                                    "column",

                                gap: 1.5
                            }}
                        >

                            {payments.map(
                                (payment) => (

                                    <Box
                                        key={
                                            payment.paymentId
                                        }

                                        sx={{
                                            p: 2,

                                            borderRadius:
                                                2,

                                            background:
                                                "rgba(255,255,255,0.025)",

                                            border:
                                                "1px solid rgba(255,255,255,0.06)"
                                        }}
                                    >

                                        <Box
                                            sx={{
                                                display:
                                                    "flex",

                                                justifyContent:
                                                    "space-between",

                                                alignItems:
                                                    "center",

                                                gap: 2
                                            }}
                                        >

                                            <Box>

                                                <Typography
                                                    sx={{
                                                        color:
                                                            "white",

                                                        fontWeight:
                                                            600
                                                    }}
                                                >
                                                    Payment #
                                                    {
                                                        payment.PaymentId
                                                    }
                                                </Typography>


                                                <Typography
                                                    sx={{
                                                        color:
                                                            "#64748B",

                                                        fontSize:
                                                            12,

                                                        mt:
                                                            0.5
                                                    }}
                                                >
                                                    Order #
                                                    {
                                                        payment.orderId
                                                    }
                                                </Typography>

                                            </Box>


                                            <Chip
                                                label={
                                                    payment.status ||
                                                    "UNKNOWN"
                                                }

                                                color={
                                                    getStatusColor(
                                                        payment.status
                                                    )
                                                }

                                                size="small"
                                            />

                                        </Box>


                                        <Divider
                                            sx={{
                                                my: 2,

                                                borderColor:
                                                    "rgba(255,255,255,0.06)"
                                            }}
                                        />


                                        <Box
                                            sx={{
                                                display:
                                                    "flex",

                                                flexWrap:
                                                    "wrap",

                                                gap: 4
                                            }}
                                        >

                                            <Box>

                                                <Typography
                                                    sx={{
                                                        color:
                                                            "#64748B",

                                                        fontSize:
                                                            11
                                                    }}
                                                >
                                                    Amount
                                                </Typography>


                                                <Typography
                                                    sx={{
                                                        color:
                                                            "#E2E8F0",

                                                        fontWeight:
                                                            600
                                                    }}
                                                >
                                                    ₹
                                                    {
                                                        Number(
                                                            payment.amount ||
                                                            0
                                                        ).toFixed(2)
                                                    }
                                                </Typography>

                                            </Box>


                                            <Box>

                                                <Typography
                                                    sx={{
                                                        color:
                                                            "#64748B",

                                                        fontSize:
                                                            11
                                                    }}
                                                >
                                                    Provider
                                                </Typography>


                                                <Typography
                                                    sx={{
                                                        color:
                                                            "#E2E8F0",

                                                        fontWeight:
                                                            600
                                                    }}
                                                >
                                                    {
                                                        payment.provider ||
                                                        "RAZORPAY"
                                                    }
                                                </Typography>

                                            </Box>


                                            <Box>

                                                <Typography
                                                    sx={{
                                                        color:
                                                            "#64748B",

                                                        fontSize:
                                                            11
                                                    }}
                                                >
                                                    Transaction ID
                                                </Typography>


                                                <Typography
                                                    sx={{
                                                        color:
                                                            "#E2E8F0",

                                                        fontWeight:
                                                            600,

                                                        wordBreak:
                                                            "break-all"
                                                    }}
                                                >
                                                    {
                                                        payment.transactionId ||
                                                        "—"
                                                    }
                                                </Typography>

                                            </Box>


                                            <Box>

                                                <Typography
                                                    sx={{
                                                        color:
                                                            "#64748B",

                                                        fontSize:
                                                            11
                                                    }}
                                                >
                                                    Date
                                                </Typography>


                                                <Typography
                                                    sx={{
                                                        color:
                                                            "#E2E8F0",

                                                        fontWeight:
                                                            600
                                                    }}
                                                >
                                                    {payment.completedAt
                                                        ? new Date(
                                                              payment.completedAt
                                                          ).toLocaleString()
                                                        : payment.createdAt
                                                            ? new Date(
                                                                  payment.createdAt
                                                              ).toLocaleString()
                                                            : "—"}
                                                </Typography>

                                            </Box>

                                        </Box>

                                    </Box>

                                )
                            )}

                        </Box>

                    )}

                </CardContent>

            </Card>

        </Box>
    );
};


export default Payment;