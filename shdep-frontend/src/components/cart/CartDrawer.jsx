import { useState } from "react";
import {
    Drawer,
    Box,
    Typography,
    IconButton,
    Button,
    Divider,
    Avatar,
    Tooltip,
    CircularProgress,
    Alert,
} from "@mui/material";
import {
    CloseRounded,
    DeleteOutlineRounded,
    AddRounded,
    RemoveRounded,
    ShoppingBagOutlined,
    ArrowForwardRounded,
    CheckCircleRounded,
} from "@mui/icons-material";
import { useNavigate } from "react-router-dom";
import { useCart } from "../../context/CartContext";
import { createOrder } from "../../services/orderService";
import { createPayment, openRazorpayCheckout } from "../../services/paymentService";

export default function CartDrawer() {
    const navigate = useNavigate();
    const {
        cartItems,
        removeFromCart,
        updateQuantity,
        clearCart,
        getCartTotal,
        getCartCount,
        isDrawerOpen,
        closeCartDrawer,
    } = useCart();

    const [checkoutLoading, setCheckoutLoading] = useState(false);
    const [checkoutError, setCheckoutError] = useState("");
    const [checkoutSuccess, setCheckoutSuccess] = useState("");

    const totalAmount = getCartTotal();
    const totalCount = getCartCount();

    const handleCheckout = async () => {
        if (cartItems.length === 0) return;

        setCheckoutLoading(true);
        setCheckoutError("");
        setCheckoutSuccess("");

        const userId = localStorage.getItem("userId");
        if (!userId) {
            setCheckoutError("User session not found. Please log in again.");
            setCheckoutLoading(false);
            return;
        }

        try {
            // Process the first/main order item or batch
            // Since backend OrderService currently accepts one product per order
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
                    setCheckoutSuccess(`Order #${createdOrder.id} placed successfully!`);
                    clearCart();
                    setTimeout(() => {
                        closeCartDrawer();
                        navigate("/orders");
                    }, 1500);
                },
                onDismiss: () => {
                    setCheckoutError("Payment was canceled or dismissed.");
                    setCheckoutLoading(false);
                },
            });
        } catch (err) {
            console.error("Cart checkout error:", err);
            setCheckoutError(
                err?.response?.data?.message ||
                err?.message ||
                "Failed to place order. Please try again."
            );
            setCheckoutLoading(false);
        }
    };

    return (
        <Drawer
            anchor="right"
            open={isDrawerOpen}
            onClose={closeCartDrawer}
            PaperProps={{
                sx: {
                    width: { xs: "100%", sm: 440 },
                    background: "rgba(15, 23, 42, 0.95)",
                    backdropFilter: "blur(24px)",
                    borderLeft: "1px solid rgba(255, 255, 255, 0.08)",
                    color: "#F8FAFC",
                    display: "flex",
                    flexDirection: "column",
                },
            }}
        >
            {/* Header */}
            <Box
                sx={{
                    p: 2.5,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    borderBottom: "1px solid rgba(255, 255, 255, 0.08)",
                }}
            >
                <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
                    <ShoppingBagOutlined sx={{ color: "#3B82F6", fontSize: 26 }} />
                    <Typography sx={{ fontWeight: 800, fontSize: 18, letterSpacing: "-0.5px" }}>
                        Shopping Cart
                    </Typography>
                    {totalCount > 0 && (
                        <Box
                            sx={{
                                px: 1,
                                py: 0.2,
                                borderRadius: 10,
                                background: "rgba(59, 130, 246, 0.15)",
                                border: "1px solid rgba(59, 130, 246, 0.3)",
                                color: "#60A5FA",
                                fontSize: 12,
                                fontWeight: 700,
                            }}
                        >
                            {totalCount} {totalCount === 1 ? "item" : "items"}
                        </Box>
                    )}
                </Box>

                <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                    {cartItems.length > 0 && (
                        <Button
                            size="small"
                            onClick={clearCart}
                            sx={{
                                color: "#94A3B8",
                                fontSize: 12,
                                textTransform: "none",
                                "&:hover": { color: "#F87171" },
                            }}
                        >
                            Clear
                        </Button>
                    )}
                    <IconButton
                        onClick={closeCartDrawer}
                        sx={{
                            color: "#94A3B8",
                            "&:hover": { color: "#F8FAFC", background: "rgba(255,255,255,0.06)" },
                        }}
                    >
                        <CloseRounded />
                    </IconButton>
                </Box>
            </Box>

            {/* Error / Success Notifications */}
            {checkoutError && (
                <Box sx={{ p: 2 }}>
                    <Alert
                        severity="error"
                        onClose={() => setCheckoutError("")}
                        sx={{
                            background: "rgba(239, 68, 68, 0.12)",
                            color: "#FCA5A5",
                            border: "1px solid rgba(239, 68, 68, 0.25)",
                        }}
                    >
                        {checkoutError}
                    </Alert>
                </Box>
            )}

            {checkoutSuccess && (
                <Box sx={{ p: 2 }}>
                    <Alert
                        severity="success"
                        icon={<CheckCircleRounded sx={{ color: "#4ADE80" }} />}
                        sx={{
                            background: "rgba(34, 197, 94, 0.12)",
                            color: "#86EFAC",
                            border: "1px solid rgba(34, 197, 94, 0.25)",
                        }}
                    >
                        {checkoutSuccess}
                    </Alert>
                </Box>
            )}

            {/* Content Body */}
            <Box sx={{ flexGrow: 1, overflowY: "auto", p: 2.5 }}>
                {cartItems.length === 0 ? (
                    <Box
                        sx={{
                            height: "100%",
                            display: "flex",
                            flexDirection: "column",
                            alignItems: "center",
                            justifyContent: "center",
                            textAlign: "center",
                            gap: 2,
                            py: 8,
                        }}
                    >
                        <Box
                            sx={{
                                width: 80,
                                height: 80,
                                borderRadius: "50%",
                                background: "rgba(255, 255, 255, 0.03)",
                                border: "1px solid rgba(255, 255, 255, 0.08)",
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                            }}
                        >
                            <ShoppingBagOutlined sx={{ fontSize: 38, color: "#64748B" }} />
                        </Box>
                        <Typography sx={{ fontWeight: 700, fontSize: 18, color: "#E2E8F0" }}>
                            Your cart is empty
                        </Typography>
                        <Typography sx={{ color: "#94A3B8", fontSize: 13, maxWidth: 260 }}>
                            Explore our product catalog and add products to your cart.
                        </Typography>
                        <Button
                            variant="contained"
                            onClick={() => {
                                closeCartDrawer();
                                navigate("/catalog");
                            }}
                            endIcon={<ArrowForwardRounded />}
                            sx={{
                                mt: 1,
                                borderRadius: 3,
                                textTransform: "none",
                                fontWeight: 700,
                                background: "linear-gradient(135deg, #2563EB, #3B82F6)",
                                px: 3,
                                py: 1.2,
                            }}
                        >
                            Browse Catalog
                        </Button>
                    </Box>
                ) : (
                    <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
                        {cartItems.map((item) => (
                            <Box
                                key={item.id}
                                sx={{
                                    p: 2,
                                    borderRadius: 3,
                                    background: "rgba(255, 255, 255, 0.03)",
                                    border: "1px solid rgba(255, 255, 255, 0.07)",
                                    display: "flex",
                                    gap: 2,
                                    alignItems: "center",
                                    transition: "all 0.2s ease",
                                    "&:hover": {
                                        background: "rgba(255, 255, 255, 0.05)",
                                        borderColor: "rgba(255, 255, 255, 0.12)",
                                    },
                                }}
                            >
                                <Avatar
                                    src={item.imageUrl}
                                    variant="rounded"
                                    sx={{
                                        width: 60,
                                        height: 60,
                                        borderRadius: 2.5,
                                        background: "rgba(255, 255, 255, 0.05)",
                                        border: "1px solid rgba(255, 255, 255, 0.08)",
                                    }}
                                >
                                    <ShoppingBagOutlined sx={{ color: "#64748B" }} />
                                </Avatar>

                                <Box sx={{ flexGrow: 1, minWidth: 0 }}>
                                    <Typography
                                        noWrap
                                        sx={{
                                            fontWeight: 700,
                                            fontSize: 14,
                                            color: "#F8FAFC",
                                        }}
                                    >
                                        {item.name}
                                    </Typography>
                                    {item.categoryName && (
                                        <Typography
                                            sx={{
                                                fontSize: 11,
                                                color: "#60A5FA",
                                                fontWeight: 600,
                                                textTransform: "uppercase",
                                            }}
                                        >
                                            {item.categoryName}
                                        </Typography>
                                    )}
                                    <Typography
                                        sx={{
                                            mt: 0.5,
                                            fontWeight: 800,
                                            fontSize: 14,
                                            color: "#38BDF8",
                                        }}
                                    >
                                        ₹{Number(item.price || 0).toLocaleString("en-IN")}
                                    </Typography>

                                    {/* Quantity Stepper */}
                                    <Box
                                        sx={{
                                            mt: 1,
                                            display: "inline-flex",
                                            alignItems: "center",
                                            background: "rgba(255, 255, 255, 0.06)",
                                            borderRadius: 2,
                                            p: 0.3,
                                            border: "1px solid rgba(255, 255, 255, 0.08)",
                                        }}
                                    >
                                        <IconButton
                                            size="small"
                                            onClick={() => updateQuantity(item.id, item.quantity - 1)}
                                            sx={{ color: "#94A3B8", p: 0.4 }}
                                        >
                                            <RemoveRounded sx={{ fontSize: 14 }} />
                                        </IconButton>
                                        <Typography
                                            sx={{
                                                px: 1.2,
                                                fontSize: 12,
                                                fontWeight: 700,
                                                color: "#F8FAFC",
                                            }}
                                        >
                                            {item.quantity}
                                        </Typography>
                                        <IconButton
                                            size="small"
                                            onClick={() => updateQuantity(item.id, item.quantity + 1)}
                                            sx={{ color: "#94A3B8", p: 0.4 }}
                                        >
                                            <AddRounded sx={{ fontSize: 14 }} />
                                        </IconButton>
                                    </Box>
                                </Box>

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
                                        <DeleteOutlineRounded sx={{ fontSize: 20 }} />
                                    </IconButton>
                                </Tooltip>
                            </Box>
                        ))}
                    </Box>
                )}
            </Box>

            {/* Footer Summary & Checkout */}
            {cartItems.length > 0 && (
                <Box
                    sx={{
                        p: 2.5,
                        borderTop: "1px solid rgba(255, 255, 255, 0.08)",
                        background: "rgba(10, 16, 29, 0.8)",
                    }}
                >
                    <Box sx={{ display: "flex", justifyContent: "space-between", mb: 1 }}>
                        <Typography sx={{ color: "#94A3B8", fontSize: 13 }}>Subtotal</Typography>
                        <Typography sx={{ fontWeight: 600, fontSize: 14, color: "#E2E8F0" }}>
                            ₹{totalAmount.toLocaleString("en-IN")}
                        </Typography>
                    </Box>
                    <Box sx={{ display: "flex", justifyContent: "space-between", mb: 1.5 }}>
                        <Typography sx={{ color: "#94A3B8", fontSize: 13 }}>Delivery</Typography>
                        <Typography sx={{ fontWeight: 700, fontSize: 13, color: "#4ADE80" }}>
                            FREE
                        </Typography>
                    </Box>

                    <Divider sx={{ borderColor: "rgba(255, 255, 255, 0.08)", my: 1.5 }} />

                    <Box sx={{ display: "flex", justifyContent: "space-between", mb: 2.5 }}>
                        <Typography sx={{ fontWeight: 800, fontSize: 16, color: "#F8FAFC" }}>
                            Total Amount
                        </Typography>
                        <Typography
                            sx={{
                                fontWeight: 800,
                                fontSize: 18,
                                color: "#38BDF8",
                            }}
                        >
                            ₹{totalAmount.toLocaleString("en-IN")}
                        </Typography>
                    </Box>

                    <Button
                        fullWidth
                        variant="contained"
                        disabled={checkoutLoading}
                        onClick={handleCheckout}
                        sx={{
                            py: 1.4,
                            borderRadius: 3,
                            fontWeight: 800,
                            fontSize: 15,
                            textTransform: "none",
                            background: "linear-gradient(135deg, #2563EB, #1D4ED8)",
                            boxShadow: "0 10px 25px rgba(37, 99, 235, 0.35)",
                            "&:hover": {
                                background: "linear-gradient(135deg, #1D4ED8, #1E40AF)",
                            },
                        }}
                    >
                        {checkoutLoading ? (
                            <CircularProgress size={22} sx={{ color: "#fff" }} />
                        ) : (
                            `Proceed to Checkout (₹${totalAmount.toLocaleString("en-IN")})`
                        )}
                    </Button>
                </Box>
            )}
        </Drawer>
    );
}
