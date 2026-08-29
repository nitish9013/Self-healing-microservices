import {
    getOrders,
    createOrder
} from "../../services/orderService";

import {
    getProducts
} from "../../services/productService";
import React, { useEffect, useState } from "react";

import {
    Box,
    Typography,
    Card,
    CardContent,
    Button,
    TextField,
    MenuItem,
    CircularProgress,
    Alert,
    Chip,
    Divider
} from "@mui/material";



const Order = () => {

    // =========================
    // PRODUCTS
    // =========================

    const [products, setProducts] = useState([]);

    const [productId, setProductId] = useState("");

    const [quantity, setQuantity] = useState(1);


    // =========================
    // ORDERS
    // =========================

    const [orders, setOrders] = useState([]);


    // =========================
    // UI STATES
    // =========================

    const [loading, setLoading] = useState(true);

    const [productsLoading, setProductsLoading] =
        useState(true);

    const [creating, setCreating] = useState(false);

    const [error, setError] = useState("");

    const [success, setSuccess] = useState("");


    // =========================
    // INITIAL LOAD
    // =========================

useEffect(() => {
    console.log("🔥 ORDER COMPONENT MOUNTED");
    console.log("🔥 TOKEN =", localStorage.getItem("token"));

    loadProducts();
    loadOrders();
}, []);

    // =========================
    // LOAD PRODUCTS
    // =========================

    const loadProducts = async () => {

        try {

            setProductsLoading(true);

            const data = await getProducts();

            setProducts(
                Array.isArray(data)
                    ? data
                    : []
            );

        } catch (err) {

            console.error(
                "Failed to load products:",
                err
            );

            setError(
                err.message ||
                "Unable to load products."
            );

        } finally {

            setProductsLoading(false);
        }
    };


    // =========================
    // LOAD ORDERS
    // =========================

    const loadOrders = async () => {

        try {

            setLoading(true);

            setError("");

            const data = await getOrders();

            setOrders(
                Array.isArray(data)
                    ? data
                    : []
            );

        } catch (err) {

            console.error(
                "Failed to load orders:",
                err
            );

            setError(
                err.message ||
                "Unable to load your orders."
            );

        } finally {

            setLoading(false);
        }
    };


    // =========================
    // CREATE ORDER
    // =========================

    const handleCreateOrder = async (event) => {

        event.preventDefault();

        setError("");

        setSuccess("");


        // Product validation

        if (!productId) {

            setError(
                "Please select a product."
            );

            return;
        }


        // Quantity validation

        if (
            !quantity ||
            Number(quantity) < 1
        ) {

            setError(
                "Quantity must be at least 1."
            );

            return;
        }


        try {

            setCreating(true);


            await createOrder(
                productId,
                quantity
            );


            setSuccess(
                "Order created successfully."
            );


            // Reset form

            setProductId("");

            setQuantity(1);


            // Reload orders

            await loadOrders();

        } catch (err) {

            console.error(
                "Order creation failed:",
                err
            );

            setError(
                err.message ||
                "Unable to create order."
            );

        } finally {

            setCreating(false);
        }
    };


    // =========================
    // STATUS COLOR
    // =========================

    const getStatusColor = (status) => {

        switch (
            status?.toUpperCase()
        ) {

            case "CREATED":
                return "info";

            case "PAID":
                return "success";

            case "PENDING":
                return "warning";

            case "FAILED":
                return "error";

            case "CANCELLED":
                return "error";

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


            {/* =================================
                PAGE HEADER
            ================================= */}

            <Box sx={{ mb: 4 }}>

                <Typography
                    variant="h4"
                    sx={{
                        fontWeight: 700,
                        color: "white",
                        mb: 1
                    }}
                >
                    Orders
                </Typography>


                <Typography
                    sx={{
                        color: "#94A3B8"
                    }}
                >
                    Create and monitor your orders
                </Typography>

            </Box>


            {/* =================================
                ERROR
            ================================= */}

            {error && (

                <Alert
                    severity="error"
                    sx={{ mb: 3 }}
                    onClose={() =>
                        setError("")
                    }
                >
                    {error}
                </Alert>

            )}


            {/* =================================
                SUCCESS
            ================================= */}

            {success && (

                <Alert
                    severity="success"
                    sx={{ mb: 3 }}
                    onClose={() =>
                        setSuccess("")
                    }
                >
                    {success}
                </Alert>

            )}


            {/* =================================
                CREATE ORDER
            ================================= */}

            <Card
                sx={{
                    mb: 4,

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

                    <Typography
                        variant="h6"
                        sx={{
                            color: "white",
                            fontWeight: 700,
                            mb: 3
                        }}
                    >
                        Create Order
                    </Typography>


                    <Box
                        component="form"
                        onSubmit={
                            handleCreateOrder
                        }
                    >

                        <Box
                            sx={{
                                display: "grid",

                                gridTemplateColumns: {
                                    xs: "1fr",
                                    md: "2fr 1fr auto"
                                },

                                gap: 2,

                                alignItems:
                                    "center"
                            }}
                        >


                            {/* PRODUCT */}

                            <TextField
                                select
                                fullWidth
                                label="Product"

                                value={productId}

                                onChange={(event) =>
                                    setProductId(
                                        event.target.value
                                    )
                                }

                                disabled={
                                    productsLoading ||
                                    creating
                                }

                                InputLabelProps={{
                                    sx: {
                                        color:
                                            "#94A3B8"
                                    }
                                }}

                                sx={{
                                    "& .MuiInputBase-root": {
                                        color: "white"
                                    },

                                    "& .MuiOutlinedInput-notchedOutline":
                                        {
                                            borderColor:
                                                "rgba(255,255,255,0.2)"
                                        }
                                }}
                            >

                                <MenuItem value="">
                                    {productsLoading
                                        ? "Loading products..."
                                        : "Select Product"}
                                </MenuItem>


                                {products.map(
                                    (product) => (

                                        <MenuItem
                                            key={
                                                product.id
                                            }

                                            value={
                                                product.id
                                            }
                                        >
                                            {product.name}
                                            {" — ₹"}
                                            {product.price}
                                        </MenuItem>

                                    )
                                )}

                            </TextField>


                            {/* QUANTITY */}

                            <TextField
                                type="number"

                                label="Quantity"

                                value={quantity}

                                onChange={(event) =>
                                    setQuantity(
                                        event.target.value
                                    )
                                }

                                disabled={creating}

                                inputProps={{
                                    min: 1
                                }}

                                fullWidth

                                InputLabelProps={{
                                    sx: {
                                        color:
                                            "#94A3B8"
                                    }
                                }}

                                sx={{
                                    "& .MuiInputBase-root": {
                                        color: "white"
                                    }
                                }}
                            />


                            {/* CREATE BUTTON */}

                            <Button
                                type="submit"

                                variant="contained"

                                disabled={
                                    creating ||
                                    productsLoading ||
                                    !products.length
                                }

                                sx={{
                                    minHeight: 56,

                                    px: 3,

                                    fontWeight: 700
                                }}
                            >

                                {creating ? (

                                    <CircularProgress
                                        size={24}
                                        color="inherit"
                                    />
                                   
                                ) : (

                                    "Create Order"

                                )}

                            </Button>

                        </Box>

                    </Box>

                </CardContent>

            </Card>


            {/* =================================
                ORDER HISTORY
            ================================= */}

            <Card
                sx={{
                    background:
                        "rgba(15,23,42,0.85)",

                    border:
                        "1px solid rgba(255,255,255,0.08)",

                    borderRadius: 3
                }}
            >

                <CardContent>


                    {/* HEADER */}

                    <Box
                        sx={{
                            display: "flex",

                            justifyContent:
                                "space-between",

                            alignItems:
                                "center",

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
                                Your Orders
                            </Typography>


                            <Typography
                                sx={{
                                    color:
                                        "#64748B",

                                    fontSize: 13
                                }}
                            >
                                Orders associated
                                with your account
                            </Typography>

                        </Box>


                        <Button
                            variant="outlined"

                            onClick={
                                loadOrders
                            }

                            disabled={loading || creating}
                        >
                            Refresh
                        </Button>

                    </Box>


                    <Divider
                        sx={{
                            borderColor:
                                "rgba(255,255,255,0.08)",

                            mb: 2
                        }}
                    />


                    {/* LOADING */}

                    {loading && (

                        <Box
                            sx={{
                                display:
                                    "flex",

                                justifyContent:
                                    "center",

                                py: 6
                            }}
                        >

                            <CircularProgress />

                        </Box>

                    )}


                    {/* EMPTY */}

                    {!loading &&
                        orders.length === 0 && (

                            <Box
                                sx={{
                                    textAlign:
                                        "center",

                                    py: 6
                                }}
                            >

                                <Typography
                                    sx={{
                                        color:
                                            "#CBD5E1",

                                        fontWeight:
                                            600
                                    }}
                                >
                                    No orders yet
                                </Typography>


                                <Typography
                                    sx={{
                                        color:
                                            "#64748B",

                                        mt: 1,

                                        fontSize: 14
                                    }}
                                >
                                    Your orders
                                    will appear
                                    here.
                                </Typography>

                            </Box>

                        )}


                    {/* ORDERS */}

                    {!loading &&
                        orders.length > 0 && (

                            <Box
                                sx={{
                                    display:
                                        "flex",

                                    flexDirection:
                                        "column",

                                    gap: 1.5
                                }}
                            >

                                {orders.map(
                                    (order) => (

                                        <Box
                                            key={
                                                order.id
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


                                            {/* TOP */}

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
                                                        {order.productName ||
                                                            "Product"}
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
                                                        {order.id}
                                                    </Typography>

                                                </Box>


                                                <Chip
                                                    label={
                                                        order.status ||
                                                        "UNKNOWN"
                                                    }

                                                    color={
                                                        getStatusColor(
                                                            order.status
                                                        )
                                                    }

                                                    size="small"
                                                />

                                            </Box>


                                            {/* DETAILS */}

                                            <Box
                                                sx={{
                                                    display:
                                                        "flex",

                                                    gap: 4,

                                                    mt: 2
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
                                                        Quantity
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
                                                            order.quantity
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
                                                        Price
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
                                                            order.price
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
                                                        Total
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
                                                            (
                                                                Number(
                                                                    order.price
                                                                ) *
                                                                Number(
                                                                    order.quantity
                                                                )
                                                            ).toFixed(
                                                                2
                                                            )
                                                        }
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


export default Order;