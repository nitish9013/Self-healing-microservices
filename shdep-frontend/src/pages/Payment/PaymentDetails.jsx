import React, { useEffect, useState } from "react";
import {
    Box,
    Card,
    CardContent,
    Typography,
    Button,
    Chip,
    Divider,
    CircularProgress,
    Alert
} from "@mui/material";

import {
    ArrowBackRounded,
    PaymentsRounded,
    ReceiptLongRounded
} from "@mui/icons-material";

import { useNavigate, useParams } from "react-router-dom";

import { getPaymentById } from "../../services/paymentService";


const PaymentDetails = () => {

    const navigate = useNavigate();

    const { paymentId } = useParams();

    const [payment, setPayment] = useState(null);

    const [loading, setLoading] = useState(true);

    const [error, setError] = useState("");


    const loadPayment = async () => {

        try {

            setLoading(true);

            setError("");

            const data =
                await getPaymentById(paymentId);

            setPayment(data);

        } catch (err) {

            console.error(
                "Failed to load payment:",
                err
            );

            setError(
                err?.response?.data?.message ||
                err?.message ||
                "Unable to load payment details."
            );

        } finally {

            setLoading(false);

        }
    };


    useEffect(() => {

        if (paymentId) {
            loadPayment();
        }

    }, [paymentId]);


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


    if (loading) {

        return (
            <Box
                sx={{
                    minHeight: "70vh",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center"
                }}
            >
                <CircularProgress />
            </Box>
        );
    }


    if (error) {

        return (
            <Box
                sx={{
                    p: {
                        xs: 2,
                        md: 4
                    },
                    maxWidth: 1000,
                    mx: "auto"
                }}
            >

                <Button
                    startIcon={
                        <ArrowBackRounded />
                    }
                    onClick={() =>
                        navigate("/payments")
                    }
                    sx={{
                        mb: 3
                    }}
                >
                    Back to Payments
                </Button>

                <Alert severity="error">
                    {error}
                </Alert>

            </Box>
        );
    }


    if (!payment) {
        return null;
    }


    return (
        <Box
            sx={{
                p: {
                    xs: 2,
                    md: 4
                },
                maxWidth: 1000,
                mx: "auto"
            }}
        >

            {/* BACK */}

            <Button
                startIcon={
                    <ArrowBackRounded />
                }
                onClick={() =>
                    navigate("/payments")
                }
                sx={{
                    mb: 3
                }}
            >
                Back to Payments
            </Button>


            {/* HEADER */}

            <Box
                sx={{
                    display: "flex",
                    alignItems: "center",
                    gap: 1.5,
                    mb: 4
                }}
            >

                <PaymentsRounded
                    sx={{
                        color: "#38BDF8",
                        fontSize: 34
                    }}
                />

                <Box>

                    <Typography
                        variant="h4"
                        sx={{
                            color: "white",
                            fontWeight: 700
                        }}
                    >
                        Payment Details
                    </Typography>

                    <Typography
                        sx={{
                            color: "#94A3B8",
                            mt: 0.5
                        }}
                    >
                        Payment #{payment.id}
                    </Typography>

                </Box>

            </Box>


            {/* DETAILS CARD */}

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
                            md: 4
                        }
                    }}
                >

                    {/* STATUS */}

                    <Box
                        sx={{
                            display: "flex",
                            justifyContent:
                                "space-between",
                            alignItems: "center",
                            mb: 3
                        }}
                    >

                        <Typography
                            variant="h6"
                            sx={{
                                color: "white",
                                fontWeight: 700
                            }}
                        >
                            Payment Information
                        </Typography>

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
                        />

                    </Box>


                    <Divider
                        sx={{
                            borderColor:
                                "rgba(255,255,255,0.08)",
                            mb: 3
                        }}
                    />


                    {/* DETAILS */}

                    <Box
                        sx={{
                            display: "grid",
                            gridTemplateColumns: {
                                xs: "1fr",
                                md: "1fr 1fr"
                            },
                            gap: 3
                        }}
                    >

                        <Box>
                            <Typography
                                sx={{
                                    color: "#64748B",
                                    fontSize: 12
                                }}
                            >
                                Payment ID
                            </Typography>

                            <Typography
                                sx={{
                                    color: "#E2E8F0",
                                    fontWeight: 600,
                                    wordBreak:
                                        "break-all"
                                }}
                            >
                                {payment.id || "—"}
                            </Typography>
                        </Box>


                       <Box>
    <Typography
        sx={{
            color: "#64748B",
            fontSize: 12
        }}
    >
        Order ID
    </Typography>

    <Typography
        sx={{
            color: "#E2E8F0",
            fontWeight: 600
        }}
    >
        {payment.orderId || "—"}
    </Typography>

    {payment.orderId && (
        <Button
            variant="outlined"
            size="small"
           onClick={() =>
    navigate(
        `/orders/${payment.orderId}`
    )
}
            sx={{
                mt: 1.5
            }}
        >
            View Order
        </Button>
    )}
</Box>


                        <Box>
                            <Typography
                                sx={{
                                    color: "#64748B",
                                    fontSize: 12
                                }}
                            >
                                Amount
                            </Typography>

                            <Typography
                                sx={{
                                    color: "#E2E8F0",
                                    fontWeight: 600,
                                    fontSize: 20
                                }}
                            >
                                ₹
                                {Number(
                                    payment.amount || 0
                                ).toFixed(2)}
                            </Typography>
                        </Box>


                        <Box>
                            <Typography
                                sx={{
                                    color: "#64748B",
                                    fontSize: 12
                                }}
                            >
                                Currency
                            </Typography>

                            <Typography
                                sx={{
                                    color: "#E2E8F0",
                                    fontWeight: 600
                                }}
                            >
                                {payment.currency ||
                                    "INR"}
                            </Typography>
                        </Box>


                        <Box>
                            <Typography
                                sx={{
                                    color: "#64748B",
                                    fontSize: 12
                                }}
                            >
                                Provider
                            </Typography>

                            <Typography
                                sx={{
                                    color: "#E2E8F0",
                                    fontWeight: 600
                                }}
                            >
                                {payment.provider ||
                                    "RAZORPAY"}
                            </Typography>
                        </Box>


                        <Box>
                            <Typography
                                sx={{
                                    color: "#64748B",
                                    fontSize: 12
                                }}
                            >
                                Transaction ID
                            </Typography>

                            <Typography
                                sx={{
                                    color: "#E2E8F0",
                                    fontWeight: 600,
                                    wordBreak:
                                        "break-all"
                                }}
                            >
                                {payment.transactionId ||
                                    "—"}
                            </Typography>
                        </Box>


                        <Box>
                            <Typography
                                sx={{
                                    color: "#64748B",
                                    fontSize: 12
                                }}
                            >
                                Created At
                            </Typography>

                            <Typography
                                sx={{
                                    color: "#E2E8F0",
                                    fontWeight: 600
                                }}
                            >{payment.createdAt
    ? new Date(
          payment.createdAt
      ).toLocaleString()
    : payment.completedAt
        ? new Date(
              payment.completedAt
          ).toLocaleString()
        : "—"}
                            </Typography>
                        </Box>


                        <Box>
                            <Typography
                                sx={{
                                    color: "#64748B",
                                    fontSize: 12
                                }}
                            >
                                Completed At
                            </Typography>

                            <Typography
                                sx={{
                                    color: "#E2E8F0",
                                    fontWeight: 600
                                }}
                            >
                                {payment.completedAt
                                    ? new Date(
                                          payment.completedAt
                                      ).toLocaleString()
                                    : "—"}
                            </Typography>
                        </Box>

                    </Box>

                </CardContent>

            </Card>

        </Box>
    );
};


export default PaymentDetails;