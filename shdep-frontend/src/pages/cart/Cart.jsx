import { useState } from "react";
import {
    Box,
    Typography,
    Button,
    Card,
    Divider,
    IconButton,
    Avatar,
    Tooltip,
    Alert,
    CircularProgress,
    Chip,
} from "@mui/material";
import {
    ArrowBackRounded,
    ShoppingBagOutlined,
    DeleteOutlineRounded,
    AddRounded,
    RemoveRounded,
    ArrowForwardRounded,
    CheckCircleRounded,
} from "@mui/icons-material";
import { useNavigate } from "react-router-dom";
import { useCart } from "../../context/CartContext";
import DashboardHeader from "../../components/dashboard/DashboardHeader";
import Sidebar from "../../components/dashboard/Sidebar";
import { createOrder } from "../../services/orderService";
import { createPayment, openRazorpayCheckout } from "../../services/paymentService";

export default function Cart() {
    const navigate = useNavigate();
    const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);

    const {
        cartItems,
        removeFromCart,
        updateQuantity,
        clearCart,
        getCartTotal,
        getCartCount,
    } = useCart();

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");

    const totalAmount = getCartTotal();
    const totalCount = getCartCount();

    const handleCheckout = async () => {
        if (cartItems.length === 0) return;

        setLoading(true);
        setError("");
        setSuccess("");

        const userId = localStorage.getItem("userId");
        if (!userId) {
            setError("User session expired. Please log in again.");
            setLoading(false);
            return;
        }

        try {
            const firstItem = cartItems[0];
            const createdOrder = await createOrder(firstItem.id, firstItem.quantity);
            const orderAmount = Number(createdOrder.price) * Number(createdOrder.quantity);

            const payment = await createPayment({
                orderId: String(createdOrder.id),
                userId: String(userId),
                amount: orderAmount,
                currency: "INR",
                idempotencyKey: crypto.randomUUID(),
            });

            openRazorpayCheckout({
                payment,
                onSuccess: () => {
                    setSuccess(`Order #${createdOrder.id} placed successfully!`);
                    clearCart();
                    setTimeout(() => {
                        navigate("/orders");
                    }, 1500);
                },
                onDismiss: () => {
                    setError("Payment dismissed or canceled.");
                    setLoading(false);
                },
            });
        } catch (err) {
            console.error("Cart checkout error:", err);
            setError(
                err?.response?.data?.message ||
                err?.message ||
                "Failed to place order. Please try again."
            );
            setLoading(false);
        }
    };

    return (
        <Box sx={{ display: "flex", minHeight: "100vh", background: "#0A1220" }}>
            <Sidebar
                mobileOpen={mobileSidebarOpen}
                onClose={() => setMobileSidebarOpen(false)}
            />

            <Box sx={{ flexGrow: 1, minWidth: 0, display: "flex", flexDirection: "column" }}>
                <DashboardHeader onMenuClick={() => setMobileSidebarOpen(true)} />

                <Box
                    sx={{
                        p: { xs: 2, sm: 3, md: 4 },
                        maxWidth: 1280,
                        width: "100%",
                        mx: "auto",
                        mb: { xs: 10, md: 4 },
                    }}
                >
                    {/* Top Bar */}
                    <Box
                        sx={{
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "space-between",
                            flexWrap: "wrap",
                            gap: 2,
                            mb: 3,
                        }}
                    >
                        <Button
                            variant="outlined"
                            startIcon={<ArrowBackRounded />}
                            onClick={() => navigate("/catalog")}
                            sx={{
                                color: "#94A3B8",
                                borderColor: "rgba(255, 255, 255, 0.12)",
                                borderRadius: 2.5,
                                textTransform: "none",
                                fontWeight: 600,
                                "&:hover": {
                                    borderColor: "rgba(255, 255, 255, 0.25)",
                                    background: "rgba(255, 255, 255, 0.04)",
                                    color: "#F8FAFC",
                                },
                            }}
                        >
                            Back to Catalog
                        </Button>

                        {cartItems.length > 0 && (
                            <Button
                                variant="text"
                                onClick={clearCart}
                                startIcon={<DeleteOutlineRounded />}
                                sx={{
                                    color: "#EF4444",
                                    textTransform: "none",
                                    fontWeight: 600,
                                    "&:hover": { background: "rgba(239, 68, 68, 0.1)" },
                                }}
                            >
                                Clear Cart
                            </Button>
                        )}
                    </Box>

                    {/* Page Header */}
                    <Box sx={{ mb: 4 }}>
                        <Typography
                            sx={{
                                fontSize: { xs: 26, md: 32 },
                                fontWeight: 800,
                                color: "#F8FAFC",
                                letterSpacing: "-0.5px",
                            }}
                        >
                            Your Shopping Cart
                        </Typography>
                        <Typography sx={{ color: "#94A3B8", fontSize: 14, mt: 0.5 }}>
                            {totalCount > 0
                                ? `You have ${totalCount} item${totalCount > 1 ? "s" : ""} in your cart`
                                : "Your cart is currently empty"}
                        </Typography>
                    </Box>

                    {/* Alerts */}
                    {error && (
                        <Alert
                            severity="error"
                            onClose={() => setError("")}
                            sx={{
                                mb: 3,
                                background: "rgba(239, 68, 68, 0.1)",
                                color: "#FCA5A5",
                                border: "1px solid rgba(239, 68, 68, 0.2)",
                            }}
                        >
                            {error}
                        </Alert>
                    )}

                    {success && (
                        <Alert
                            severity="success"
                            icon={<CheckCircleRounded sx={{ color: "#4ADE80" }} />}
                            sx={{
                                mb: 3,
                                background: "rgba(34, 197, 94, 0.1)",
                                color: "#86EFAC",
                                border: "1px solid rgba(34, 197, 94, 0.2)",
                            }}
                        >
                            {success}
                        </Alert>
                    )}

                    {cartItems.length === 0 ? (
                        <Card
                            sx={{
                                p: 6,
                                textAlign: "center",
                                borderRadius: 4,
                                background: "rgba(15, 23, 42, 0.65)",
                                border: "1px solid rgba(255, 255, 255, 0.08)",
                                backdropFilter: "blur(20px)",
                            }}
                        >
                            <Box
                                sx={{
                                    width: 90,
                                    height: 90,
                                    borderRadius: "50%",
                                    background: "rgba(255, 255, 255, 0.03)",
                                    border: "1px solid rgba(255, 255, 255, 0.08)",
                                    display: "flex",
                                    alignItems: "center",
                                    justifyContent: "center",
                                    mx: "auto",
                                    mb: 2,
                                }}
                            >
                                <ShoppingBagOutlined sx={{ fontSize: 44, color: "#64748B" }} />
                            </Box>
                            <Typography sx={{ fontSize: 20, fontWeight: 700, color: "#F8FAFC", mb: 1 }}>
                                Your shopping cart is empty
                            </Typography>
                            <Typography sx={{ color: "#94A3B8", fontSize: 14, maxWidth: 400, mx: "auto", mb: 3 }}>
                                Looks like you haven't added anything yet. Discover our latest products in the catalog!
                            </Typography>
                            <Button
                                variant="contained"
                                endIcon={<ArrowForwardRounded />}
                                onClick={() => navigate("/catalog")}
                                sx={{
                                    borderRadius: 3,
                                    textTransform: "none",
                                    fontWeight: 700,
                                    px: 4,
                                    py: 1.3,
                                    background: "linear-gradient(135deg, #2563EB, #3B82F6)",
                                }}
                            >
                                Explore Catalog
                            </Button>
                        </Card>
                    ) : (
                        <Box
                            sx={{
                                display: "grid",
                                gridTemplateColumns: { xs: "1fr", lg: "1fr 380px" },
                                gap: 3.5,
                                alignItems: "start",
                            }}
                        >
                            {/* Items List */}
                            <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
                                {cartItems.map((item) => (
                                    <Card
                                        key={item.id}
                                        sx={{
                                            borderRadius: 3.5,
                                            background: "rgba(15, 23, 42, 0.65)",
                                            border: "1px solid rgba(255, 255, 255, 0.08)",
                                            backdropFilter: "blur(18px)",
                                            p: 2.5,
                                            display: "flex",
                                            gap: 2.5,
                                            alignItems: "center",
                                            flexWrap: { xs: "wrap", sm: "nowrap" },
                                        }}
                                    >
                                        <Avatar
                                            src={item.imageUrl}
                                            variant="rounded"
                                            sx={{
                                                width: 80,
                                                height: 80,
                                                borderRadius: 3,
                                                background: "rgba(255, 255, 255, 0.04)",
                                                border: "1px solid rgba(255, 255, 255, 0.08)",
                                            }}
                                        >
                                            <ShoppingBagOutlined sx={{ color: "#64748B" }} />
                                        </Avatar>

                                        <Box sx={{ flexGrow: 1, minWidth: 0 }}>
                                            <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 0.5 }}>
                                                {item.categoryName && (
                                                    <Chip
                                                        label={item.categoryName}
                                                        size="small"
                                                        sx={{
                                                            fontSize: 10,
                                                            fontWeight: 700,
                                                            height: 20,
                                                            color: "#60A5FA",
                                                            background: "rgba(59, 130, 246, 0.12)",
                                                            border: "1px solid rgba(59, 130, 246, 0.25)",
                                                        }}
                                                    />
                                                )}
                                            </Box>
                                            <Typography
                                                noWrap
                                                sx={{
                                                    fontSize: 16,
                                                    fontWeight: 700,
                                                    color: "#F8FAFC",
                                                }}
                                            >
                                                {item.name}
                                            </Typography>
                                            <Typography
                                                sx={{
                                                    mt: 0.8,
                                                    fontSize: 16,
                                                    fontWeight: 800,
                                                    color: "#38BDF8",
                                                }}
                                            >
                                                ₹{Number(item.price || 0).toLocaleString("en-IN")}
                                            </Typography>
                                        </Box>

                                        {/* Stepper & Total */}
                                        <Box
                                            sx={{
                                                display: "flex",
                                                alignItems: "center",
                                                gap: 3,
                                                ml: "auto",
                                            }}
                                        >
                                            <Box
                                                sx={{
                                                    display: "inline-flex",
                                                    alignItems: "center",
                                                    background: "rgba(255, 255, 255, 0.05)",
                                                    borderRadius: 2.5,
                                                    p: 0.4,
                                                    border: "1px solid rgba(255, 255, 255, 0.08)",
                                                }}
                                            >
                                                <IconButton
                                                    size="small"
                                                    onClick={() => updateQuantity(item.id, item.quantity - 1)}
                                                    sx={{ color: "#94A3B8" }}
                                                >
                                                    <RemoveRounded sx={{ fontSize: 16 }} />
                                                </IconButton>
                                                <Typography
                                                    sx={{
                                                        px: 1.5,
                                                        fontSize: 13,
                                                        fontWeight: 700,
                                                        color: "#F8FAFC",
                                                    }}
                                                >
                                                    {item.quantity}
                                                </Typography>
                                                <IconButton
                                                    size="small"
                                                    onClick={() => updateQuantity(item.id, item.quantity + 1)}
                                                    sx={{ color: "#94A3B8" }}
                                                >
                                                    <AddRounded sx={{ fontSize: 16 }} />
                                                </IconButton>
                                            </Box>

                                            <Typography
                                                sx={{
                                                    minWidth: 80,
                                                    textAlign: "right",
                                                    fontWeight: 800,
                                                    fontSize: 15,
                                                    color: "#F8FAFC",
                                                }}
                                            >
                                                ₹{(Number(item.price || 0) * item.quantity).toLocaleString("en-IN")}
                                            </Typography>

                                            <Tooltip title="Remove item">
                                                <IconButton
                                                    onClick={() => removeFromCart(item.id)}
                                                    sx={{
                                                        color: "#64748B",
                                                        "&:hover": {
                                                            color: "#F87171",
                                                            background: "rgba(239, 68, 68, 0.1)",
                                                        },
                                                    }}
                                                >
                                                    <DeleteOutlineRounded />
                                                </IconButton>
                                            </Tooltip>
                                        </Box>
                                    </Card>
                                ))}
                            </Box>

                            {/* Summary Card */}
                            <Card
                                sx={{
                                    borderRadius: 3.5,
                                    background: "rgba(15, 23, 42, 0.75)",
                                    border: "1px solid rgba(255, 255, 255, 0.08)",
                                    backdropFilter: "blur(20px)",
                                    p: 3,
                                    position: "sticky",
                                    top: 100,
                                }}
                            >
                                <Typography sx={{ fontSize: 18, fontWeight: 800, color: "#F8FAFC", mb: 2.5 }}>
                                    Order Summary
                                </Typography>

                                <Box sx={{ display: "flex", justifyContent: "space-between", mb: 1.5 }}>
                                    <Typography sx={{ color: "#94A3B8", fontSize: 14 }}>
                                        Subtotal ({totalCount} items)
                                    </Typography>
                                    <Typography sx={{ fontWeight: 600, fontSize: 14, color: "#E2E8F0" }}>
                                        ₹{totalAmount.toLocaleString("en-IN")}
                                    </Typography>
                                </Box>

                                <Box sx={{ display: "flex", justifyContent: "space-between", mb: 1.5 }}>
                                    <Typography sx={{ color: "#94A3B8", fontSize: 14 }}>
                                        Delivery Charges
                                    </Typography>
                                    <Typography sx={{ fontWeight: 700, fontSize: 14, color: "#4ADE80" }}>
                                        FREE
                                    </Typography>
                                </Box>

                                <Divider sx={{ borderColor: "rgba(255, 255, 255, 0.08)", my: 2 }} />

                                <Box sx={{ display: "flex", justifyContent: "space-between", mb: 3 }}>
                                    <Typography sx={{ fontSize: 16, fontWeight: 800, color: "#F8FAFC" }}>
                                        Estimated Total
                                    </Typography>
                                    <Typography sx={{ fontSize: 20, fontWeight: 800, color: "#38BDF8" }}>
                                        ₹{totalAmount.toLocaleString("en-IN")}
                                    </Typography>
                                </Box>

                                <Button
                                    fullWidth
                                    variant="contained"
                                    disabled={loading}
                                    onClick={handleCheckout}
                                    sx={{
                                        py: 1.5,
                                        borderRadius: 3,
                                        fontSize: 15,
                                        fontWeight: 800,
                                        textTransform: "none",
                                        background: "linear-gradient(135deg, #2563EB, #1D4ED8)",
                                        boxShadow: "0 10px 25px rgba(37, 99, 235, 0.35)",
                                        "&:hover": {
                                            background: "linear-gradient(135deg, #1D4ED8, #1E40AF)",
                                        },
                                    }}
                                >
                                    {loading ? (
                                        <CircularProgress size={22} sx={{ color: "#fff" }} />
                                    ) : (
                                        `Place Order (₹${totalAmount.toLocaleString("en-IN")})`
                                    )}
                                </Button>
                            </Card>
                        </Box>
                    )}
                </Box>
            </Box>
        </Box>
    );
}
