import React, {
    useEffect,
    useState
} from "react";

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
    ShoppingBagRounded,
    CheckCircleOutlineRounded,
    PendingRounded,
    CancelRounded
} from "@mui/icons-material";

import {
    useNavigate,
    useParams
} from "react-router-dom";

import {
    getOrderById
} from "../../services/orderService";


const OrderDetails = () => {

    const navigate = useNavigate();

    const { orderId } = useParams();

    const [order, setOrder] =
        useState(null);

    const [loading, setLoading] =
        useState(true);

    const [error, setError] =
        useState("");


    const loadOrder = async () => {

        try {

            setLoading(true);
            setError("");

            const data =
                await getOrderById(orderId);

            setOrder(data);

        } catch (err) {

            console.error(
                "Failed to load order:",
                err
            );

            setError(
                err?.response?.data?.message ||
                err?.message ||
                "Unable to load order details."
            );

        } finally {

            setLoading(false);

        }
    };


    useEffect(() => {

        if (orderId) {
            loadOrder();
        }

    }, [orderId]);


    const getStatusConfig = (status) => {

        switch (
            String(status || "")
                .toUpperCase()
        ) {

            case "PAID":
                return {
                    label: "PAID",
                    color: "success",
                    icon:
                        CheckCircleOutlineRounded
                };

            case "FAILED":
                return {
                    label: "FAILED",
                    color: "error",
                    icon: CancelRounded
                };

            case "PENDING":
            case "CREATED":
            default:
                return {
                    label:
                        String(
                            status || "PENDING"
                        ).toUpperCase(),
                    color: "warning",
                    icon: PendingRounded
                };
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
                        navigate("/orders")
                    }
                    sx={{
                        mb: 3
                    }}
                >
                    Back to Orders
                </Button>

                <Alert severity="error">
                    {error}
                </Alert>

            </Box>
        );
    }


    if (!order) {
        return null;
    }


    const status =
        getStatusConfig(order.status);

    const StatusIcon =
        status.icon;


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
                    navigate("/orders")
                }
                sx={{
                    mb: 3
                }}
            >
                Back to Orders
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

                <ShoppingBagRounded
                    sx={{
                        color: "#38BDF8",
                        fontSize: 36
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
                        Order Details
                    </Typography>

                    <Typography
                        sx={{
                            color: "#94A3B8",
                            mt: 0.5
                        }}
                    >
                        Order #{order.id}
                    </Typography>

                </Box>

            </Box>


            {/* MAIN CARD */}

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

                    {/* STATUS HEADER */}

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
                            Order Information
                        </Typography>

                        <Chip
                            icon={
                                <StatusIcon />
                            }
                            label={
                                status.label
                            }
                            color={
                                status.color
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


                    {/* ORDER DETAILS */}

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

                        {/* ORDER ID */}

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
                                {order.id}
                            </Typography>

                        </Box>


                        {/* PRODUCT */}

                        <Box>

                            <Typography
                                sx={{
                                    color: "#64748B",
                                    fontSize: 12
                                }}
                            >
                                Product
                            </Typography>

                            <Typography
                                sx={{
                                    color: "#E2E8F0",
                                    fontWeight: 600
                                }}
                            >
                                {order.productName ||
                                    "—"}
                            </Typography>

                        </Box>


                        {/* QUANTITY */}

                        <Box>

                            <Typography
                                sx={{
                                    color: "#64748B",
                                    fontSize: 12
                                }}
                            >
                                Quantity
                            </Typography>

                            <Typography
                                sx={{
                                    color: "#E2E8F0",
                                    fontWeight: 600
                                }}
                            >
                                {order.quantity}
                            </Typography>

                        </Box>


                        {/* PRICE */}

                        <Box>

                            <Typography
                                sx={{
                                    color: "#64748B",
                                    fontSize: 12
                                }}
                            >
                                Price
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
                                    order.price || 0
                                ).toFixed(2)}
                            </Typography>

                        </Box>


                        {/* USERNAME */}

                        <Box>

                            <Typography
                                sx={{
                                    color: "#64748B",
                                    fontSize: 12
                                }}
                            >
                                Customer
                            </Typography>

                            <Typography
                                sx={{
                                    color: "#E2E8F0",
                                    fontWeight: 600
                                }}
                            >
                                {order.username ||
                                    "—"}
                            </Typography>

                        </Box>


                        {/* STATUS */}

                        <Box>

                            <Typography
                                sx={{
                                    color: "#64748B",
                                    fontSize: 12
                                }}
                            >
                                Status
                            </Typography>

                            <Typography
                                sx={{
                                    color: "#E2E8F0",
                                    fontWeight: 600
                                }}
                            >
                                {order.status ||
                                    "—"}
                            </Typography>

                        </Box>

                    </Box>


                    {/* ACTIONS */}

                    <Divider
                        sx={{
                            borderColor:
                                "rgba(255,255,255,0.08)",
                            my: 4
                        }}
                    />

                    <Box
                        sx={{
                            display: "flex",
                            gap: 2,
                            flexWrap: "wrap"
                        }}
                    >

                        <Button
                            variant="outlined"
                            onClick={() =>
                                navigate("/orders")
                            }
                        >
                            Back to Orders
                        </Button>

                        <Button
                            variant="outlined"
                            onClick={() =>
                                navigate("/payments")
                            }
                        >
                            View Payments
                        </Button>

                    </Box>

                </CardContent>

            </Card>

        </Box>
    );
};


export default OrderDetails;