import {
    Alert,
    Box,
    Button,
    Chip,
    CircularProgress,
    Typography,
    IconButton,
} from "@mui/material";

import {
    ArrowBackRounded,
    Inventory2Outlined,
    RefreshRounded,
    AddRounded,
    RemoveRounded,
    ShoppingCartOutlined,
    FlashOnRounded,
} from "@mui/icons-material";

import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useCart } from "../../context/CartContext";

import catalogService from "../../services/catalogService";

import DashboardHeader
    from "../../components/dashboard/DashboardHeader";

import Sidebar
    from "../../components/dashboard/Sidebar";


export default function ProductDetails() {

    const navigate = useNavigate();

    const { id } = useParams();


    /* ============================================
       SIDEBAR
    ============================================ */

    const [
        mobileSidebarOpen,
        setMobileSidebarOpen,
    ] = useState(false);


    /* ============================================
       PRODUCT
    ============================================ */

    const [
        product,
        setProduct,
    ] = useState(null);


    /* ============================================
       STATES
    ============================================ */

    const [
        loading,
        setLoading,
    ] = useState(true);


    const [
        error,
        setError,
    ] = useState("");

    const { addToCart, isInCart, openCartDrawer } = useCart();
    const [orderQty, setOrderQty] = useState(1);
    const inCart = product?.id ? isInCart(product.id) : false;

    const handleAddToCart = () => {
        if (!product || !isAvailable) return;
        addToCart(product, orderQty);
        openCartDrawer();
    };

    const handleBuyNow = () => {
        if (!product || !isAvailable) return;
        addToCart(product, orderQty);
        openCartDrawer();
    };


    /* ============================================
       LOAD PRODUCT
    ============================================ */

    const loadProduct = async () => {

        if (!id) {

            setError(
                "Product ID is missing."
            );

            setLoading(false);

            return;
        }


        try {

            setLoading(true);

            setError("");


            const data =
                await catalogService
                    .getProductById(id);


            console.log(
                "Product Details = ",
                data
            );


            setProduct(data);

        } catch (err) {

            console.error(
                "Product Details API Error = ",
                err
            );


            setProduct(null);


            setError(
                err.response?.data?.message ||
                err.response?.data ||
                "Unable to load product details."
            );

        } finally {

            setLoading(false);

        }

    };


    /* ============================================
       LOAD ON ID CHANGE
    ============================================ */

    useEffect(() => {
        // eslint-disable-next-line react-hooks/set-state-in-effect
        loadProduct();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [id]);


    /* ============================================
       GO BACK
    ============================================ */

    const handleBack = () => {

        navigate("/catalog");

    };


    /* ============================================
       PRICE
    ============================================ */

    const formattedPrice =
        product
            ? Number(
                product.price || 0
            ).toLocaleString(
                "en-IN",
                {
                    style: "currency",
                    currency: "INR",
                    maximumFractionDigits: 2,
                }
            )
            : "";


    /* ============================================
       STOCK
    ============================================ */

    const stockQuantity =
        Number(
            product?.stockQuantity || 0
        );


    const isAvailable =
        product?.active === true &&
        stockQuantity > 0;


    return (

        <Box
            sx={{
                minHeight: "100vh",

                width: "100%",

                background:
                    "linear-gradient(135deg, #080F23 0%, #0F172A 55%, #111827 100%)",

                color: "#fff",
            }}
        >

            {/* =====================================
                HEADER
            ===================================== */}

            <DashboardHeader
                onMenuClick={() =>
                    setMobileSidebarOpen(true)
                }
            />


            {/* =====================================
                BODY
            ===================================== */}

            <Box
                sx={{
                    display: "flex",

                    width: "100%",
                }}
            >

                {/* =================================
                    SIDEBAR
                ================================= */}

                <Sidebar
                    mobileOpen={
                        mobileSidebarOpen
                    }

                    onClose={() =>
                        setMobileSidebarOpen(false)
                    }
                />


                {/* =================================
                    MAIN CONTENT
                ================================= */}

                <Box
                    sx={{
                        flex: 1,

                        minWidth: 0,

                        width: "100%",
                    }}
                >

                    <Box
                        sx={{
                            width: "100%",

                            maxWidth: 1450,

                            mx: "auto",

                            px: {
                                xs: 2,
                                sm: 3,
                                md: 4,
                                lg: 5,
                                xl: 6,
                            },

                            py: {
                                xs: 3,
                                md: 4,
                            },
                        }}
                    >

                        {/* =========================
                            BACK BUTTON
                        ========================= */}

                        <Button
                            startIcon={
                                <ArrowBackRounded />
                            }

                            onClick={
                                handleBack
                            }

                            sx={{
                                mb: 3,

                                color:
                                    "#94A3B8",

                                textTransform:
                                    "none",

                                fontWeight:
                                    600,

                                "&:hover": {
                                    color:
                                        "#F8FAFC",

                                    background:
                                        "rgba(255,255,255,.04)",
                                },
                            }}
                        >
                            Back to Catalog
                        </Button>


                        {/* =========================
                            LOADING
                        ========================= */}

                        {loading && (

                            <Box
                                sx={{
                                    minHeight:
                                        500,

                                    display:
                                        "flex",

                                    flexDirection:
                                        "column",

                                    alignItems:
                                        "center",

                                    justifyContent:
                                        "center",

                                    gap: 2,
                                }}
                            >

                                <CircularProgress
                                    size={40}

                                    sx={{
                                        color:
                                            "#60A5FA",
                                    }}
                                />


                                <Typography
                                    sx={{
                                        color:
                                            "#64748B",

                                        fontSize:
                                            13,
                                    }}
                                >
                                    Loading product...
                                </Typography>

                            </Box>

                        )}


                        {/* =========================
                            ERROR
                        ========================= */}

                        {!loading &&
                            error && (

                            <Alert
                                severity="error"

                                sx={{
                                    background:
                                        "rgba(239,68,68,.08)",

                                    color:
                                        "#FCA5A5",

                                    border:
                                        "1px solid rgba(239,68,68,.18)",

                                    "& .MuiAlert-icon":
                                        {
                                            color:
                                                "#F87171",
                                        },
                                }}

                                action={

                                    <Button
                                        color="inherit"

                                        size="small"

                                        onClick={
                                            loadProduct
                                        }

                                        startIcon={
                                            <RefreshRounded />
                                        }
                                    >
                                        Retry
                                    </Button>

                                }
                            >
                                {error}
                            </Alert>

                        )}


                        {/* =========================
                            PRODUCT DETAILS
                        ========================= */}

                        {!loading &&
                            !error &&
                            product && (

                            <Box
                                sx={{
                                    display:
                                        "grid",

                                    gridTemplateColumns:
                                        {
                                            xs:
                                                "1fr",
                                            md:
                                                "minmax(0, 1fr) minmax(0, 1fr)",
                                        },

                                    gap: {
                                        xs: 3,
                                        md: 5,
                                    },
                                }}
                            >

                                {/* =================
                                    IMAGE
                                ================= */}

                                <Box
                                    sx={{
                                        minWidth: 0,
                                    }}
                                >

                                    <Box
                                        sx={{
                                            width:
                                                "100%",

                                            aspectRatio:
                                                "1 / 1",

                                            maxHeight:
                                                600,

                                            overflow:
                                                "hidden",

                                            borderRadius:
                                                4,

                                            background:
                                                "linear-gradient(135deg, #111827, #1E293B)",

                                            border:
                                                "1px solid rgba(255,255,255,.08)",

                                            display:
                                                "flex",

                                            alignItems:
                                                "center",

                                            justifyContent:
                                                "center",
                                        }}
                                    >

                                        {product.imageUrl ? (

                                            <Box
                                                component="img"

                                                src={
                                                    product.imageUrl
                                                }

                                                alt={
                                                    product.name ||
                                                    "Product"
                                                }

                                                sx={{
                                                    width:
                                                        "100%",

                                                    height:
                                                        "100%",

                                                    objectFit:
                                                        "cover",

                                                    display:
                                                        "block",
                                                }}
                                            />

                                        ) : (

                                            <Box
                                                sx={{
                                                    display:
                                                        "flex",

                                                    flexDirection:
                                                        "column",

                                                    alignItems:
                                                        "center",

                                                    gap: 1,

                                                    color:
                                                        "#475569",
                                                }}
                                            >

                                                <Inventory2Outlined
                                                    sx={{
                                                        fontSize:
                                                            70,
                                                    }}
                                                />

                                                <Typography
                                                    sx={{
                                                        color:
                                                            "#64748B",

                                                        fontSize:
                                                            13,
                                                    }}
                                                >
                                                    No image
                                                    available
                                                </Typography>

                                            </Box>

                                        )}

                                    </Box>

                                </Box>


                                {/* =================
                                    INFORMATION
                                ================= */}

                                <Box
                                    sx={{
                                        minWidth:
                                            0,

                                        display:
                                            "flex",

                                        flexDirection:
                                            "column",

                                        justifyContent:
                                            "center",
                                    }}
                                >

                                    {/* CATEGORY */}

                                    {product.categoryName && (

                                        <Typography
                                            sx={{
                                                color:
                                                    "#60A5FA",

                                                fontSize:
                                                    12,

                                                fontWeight:
                                                    700,

                                                textTransform:
                                                    "uppercase",

                                                letterSpacing:
                                                    ".7px",

                                                mb: 1,
                                            }}
                                        >
                                            {
                                                product.categoryName
                                            }
                                        </Typography>

                                    )}


                                    {/* NAME */}

                                    <Typography
                                        sx={{
                                            color:
                                                "#F8FAFC",

                                            fontSize:
                                                {
                                                    xs:
                                                        28,
                                                    md:
                                                        38,
                                                },

                                            lineHeight:
                                                1.15,

                                            fontWeight:
                                                800,

                                            letterSpacing:
                                                "-.7px",
                                        }}
                                    >
                                        {
                                            product.name ||
                                            "Unnamed Product"
                                        }
                                    </Typography>


                                    {/* STATUS */}

                                    <Box
                                        sx={{
                                            mt: 2,

                                            display:
                                                "flex",

                                            alignItems:
                                                "center",

                                            gap: 1,
                                        }}
                                    >

                                        <Chip
                                            label={
                                                isAvailable
                                                    ? "In Stock"
                                                    : "Out of Stock"
                                            }

                                            size="small"

                                            sx={{
                                                color:
                                                    isAvailable
                                                        ? "#86EFAC"
                                                        : "#FCA5A5",

                                                background:
                                                    isAvailable
                                                        ? "rgba(34,197,94,.10)"
                                                        : "rgba(239,68,68,.10)",

                                                border:
                                                    isAvailable
                                                        ? "1px solid rgba(34,197,94,.20)"
                                                        : "1px solid rgba(239,68,68,.20)",

                                                fontWeight:
                                                    700,
                                            }}
                                        />


                                        {isAvailable && (

                                            <Typography
                                                sx={{
                                                    color:
                                                        "#64748B",

                                                    fontSize:
                                                        12,
                                                }}
                                            >
                                                {
                                                    stockQuantity
                                                }{" "}
                                                units
                                                available
                                            </Typography>

                                        )}

                                    </Box>


                                    {/* PRICE */}

                                    <Typography
                                        sx={{
                                            mt: 3,

                                            color:
                                                "#F8FAFC",

                                            fontSize:
                                                {
                                                    xs:
                                                        28,
                                                    md:
                                                        32,
                                                },

                                            fontWeight:
                                                800,
                                        }}
                                    >
                                        {
                                            formattedPrice
                                        }
                                    </Typography>


                                    {/* DESCRIPTION */}

                                    <Box
                                        sx={{
                                            mt: 3,

                                            p: 2.5,

                                            borderRadius:
                                                3,

                                            background:
                                                "rgba(255,255,255,.035)",

                                            border:
                                                "1px solid rgba(255,255,255,.07)",
                                        }}
                                    >

                                        <Typography
                                            sx={{
                                                color:
                                                    "#CBD5E1",

                                                fontSize:
                                                    14,

                                                fontWeight:
                                                    700,

                                                mb: 1,
                                            }}
                                        >
                                            Description
                                        </Typography>


                                        <Typography
                                            sx={{
                                                color:
                                                    "#94A3B8",

                                                fontSize:
                                                    13,

                                                lineHeight:
                                                    1.7,
                                            }}
                                        >
                                            {
                                                product.description ||
                                                "No description available."
                                            }
                                        </Typography>

                                    </Box>


                                    {/* PRODUCT META */}

                                    <Box
                                        sx={{
                                            mt: 2,

                                            display:
                                                "grid",

                                            gridTemplateColumns:
                                                {
                                                    xs:
                                                        "1fr",
                                                    sm:
                                                        "repeat(2, 1fr)",
                                                },

                                            gap: 1.5,
                                        }}
                                    >

                                        <Box
                                            sx={{
                                                p: 2,

                                                borderRadius:
                                                    2.5,

                                                background:
                                                    "rgba(255,255,255,.025)",

                                                border:
                                                    "1px solid rgba(255,255,255,.06)",
                                            }}
                                        >

                                            <Typography
                                                sx={{
                                                    color:
                                                        "#64748B",

                                                    fontSize:
                                                        11,
                                                }}
                                            >
                                                Product ID
                                            </Typography>


                                            <Typography
                                                sx={{
                                                    mt:
                                                        .4,

                                                    color:
                                                        "#CBD5E1",

                                                    fontSize:
                                                        12,

                                                    fontWeight:
                                                        600,

                                                    wordBreak:
                                                        "break-all",
                                                }}
                                            >
                                                {
                                                    product.id
                                                }
                                            </Typography>

                                        </Box>


                                        <Box
                                            sx={{
                                                p: 2,

                                                borderRadius:
                                                    2.5,

                                                background:
                                                    "rgba(255,255,255,.025)",

                                                border:
                                                    "1px solid rgba(255,255,255,.06)",
                                            }}
                                        >

                                            <Typography
                                                sx={{
                                                    color:
                                                        "#64748B",

                                                    fontSize:
                                                        11,
                                                }}
                                            >
                                                Category
                                            </Typography>


                                            <Typography
                                                sx={{
                                                    mt:
                                                        .4,

                                                    color:
                                                        "#CBD5E1",

                                                    fontSize:
                                                        12,

                                                    fontWeight:
                                                        600,
                                                }}
                                            >
                                                {
                                                    product.categoryName ||
                                                    "Uncategorized"
                                                }
                                            </Typography>

                                        </Box>

                                    </Box>


                                    {/* =================
                                        ACTIONS: QUANTITY, CART & BUY NOW
                                    ================= */}

                                    {isAvailable ? (
                                        <Box sx={{ mt: 3, display: "flex", flexDirection: "column", gap: 2 }}>
                                            {/* Quantity Selector */}
                                            <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                                                <Typography sx={{ color: "#94A3B8", fontSize: 13, fontWeight: 600 }}>
                                                    Quantity:
                                                </Typography>
                                                <Box
                                                    sx={{
                                                        display: "inline-flex",
                                                        alignItems: "center",
                                                        background: "rgba(255,255,255,.05)",
                                                        borderRadius: 2.5,
                                                        p: 0.5,
                                                        border: "1px solid rgba(255,255,255,.10)",
                                                    }}
                                                >
                                                    <IconButton
                                                        size="small"
                                                        disabled={orderQty <= 1}
                                                        onClick={() => setOrderQty((prev) => Math.max(1, prev - 1))}
                                                        sx={{ color: "#94A3B8" }}
                                                    >
                                                        <RemoveRounded sx={{ fontSize: 16 }} />
                                                    </IconButton>
                                                    <Typography sx={{ px: 2, fontSize: 14, fontWeight: 700, color: "#F8FAFC" }}>
                                                        {orderQty}
                                                    </Typography>
                                                    <IconButton
                                                        size="small"
                                                        disabled={orderQty >= (product.stockQuantity || 99)}
                                                        onClick={() => setOrderQty((prev) => Math.min(product.stockQuantity || 99, prev + 1))}
                                                        sx={{ color: "#94A3B8" }}
                                                    >
                                                        <AddRounded sx={{ fontSize: 16 }} />
                                                    </IconButton>
                                                </Box>
                                            </Box>

                                            {/* Action Buttons */}
                                            <Box sx={{ display: "grid", gridTemplateColumns: { xs: "1fr", sm: "1fr 1fr" }, gap: 1.5 }}>
                                                <Button
                                                    fullWidth
                                                    variant="contained"
                                                    startIcon={<ShoppingCartOutlined />}
                                                    onClick={handleAddToCart}
                                                    sx={{
                                                        minHeight: 48,
                                                        borderRadius: 2.5,
                                                        background: inCart
                                                            ? "linear-gradient(135deg, #10B981, #059669)"
                                                            : "linear-gradient(135deg, #2563EB, #1D4ED8)",
                                                        color: "#fff",
                                                        textTransform: "none",
                                                        fontSize: 14,
                                                        fontWeight: 700,
                                                        boxShadow: "0 8px 20px rgba(37,99,235,.25)",
                                                        "&:hover": {
                                                            background: inCart
                                                                ? "linear-gradient(135deg, #059669, #047857)"
                                                                : "linear-gradient(135deg, #1D4ED8, #1E40AF)",
                                                        },
                                                    }}
                                                >
                                                    {inCart ? "In Cart (Add More)" : "Add to Cart"}
                                                </Button>

                                                <Button
                                                    fullWidth
                                                    variant="contained"
                                                    startIcon={<FlashOnRounded />}
                                                    onClick={handleBuyNow}
                                                    sx={{
                                                        minHeight: 48,
                                                        borderRadius: 2.5,
                                                        background: "linear-gradient(135deg, #F59E0B, #D97706)",
                                                        color: "#fff",
                                                        textTransform: "none",
                                                        fontSize: 14,
                                                        fontWeight: 700,
                                                        boxShadow: "0 8px 20px rgba(245,158,11,.25)",
                                                        "&:hover": {
                                                            background: "linear-gradient(135deg, #D97706, #B45309)",
                                                        },
                                                    }}
                                                >
                                                    Buy Now
                                                </Button>
                                            </Box>
                                        </Box>
                                    ) : (
                                        <Button
                                            fullWidth
                                            disabled
                                            sx={{
                                                mt: 3,
                                                minHeight: 48,
                                                borderRadius: 2.5,
                                                background: "rgba(255,255,255,.06)",
                                                color: "#64748B",
                                                textTransform: "none",
                                                fontSize: 14,
                                                fontWeight: 700,
                                            }}
                                        >
                                            Currently Unavailable
                                        </Button>
                                    )}

                                </Box>

                            </Box>

                        )}


                        {/* =========================
                            PRODUCT NOT FOUND
                        ========================= */}

                        {!loading &&
                            !error &&
                            !product && (

                            <Box
                                sx={{
                                    minHeight:
                                        400,

                                    display:
                                        "flex",

                                    flexDirection:
                                        "column",

                                    alignItems:
                                        "center",

                                    justifyContent:
                                        "center",

                                    textAlign:
                                        "center",
                                }}
                            >

                                <Inventory2Outlined
                                    sx={{
                                        fontSize:
                                            55,

                                        color:
                                            "#475569",

                                        mb: 1.5,
                                    }}
                                />


                                <Typography
                                    sx={{
                                        color:
                                            "#CBD5E1",

                                        fontSize:
                                            18,

                                        fontWeight:
                                            700,
                                    }}
                                >
                                    Product not found
                                </Typography>


                                <Button
                                    onClick={
                                        handleBack
                                    }

                                    sx={{
                                        mt: 2,

                                        color:
                                            "#60A5FA",

                                        textTransform:
                                            "none",
                                    }}
                                >
                                    Return to Catalog
                                </Button>

                            </Box>

                        )}

                    </Box>

                </Box>

            </Box>

        </Box>
    );
}