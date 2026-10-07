import { useState, useEffect } from "react";
import {
    Box,
    Button,
    Chip,
    Typography,
    IconButton,
    Tooltip,
} from "@mui/material";

import {
    ShoppingCartOutlined,
    Inventory2Outlined,
    EditOutlined,
    DeleteOutlineRounded,
    FavoriteRounded,
    FavoriteBorderRounded,
} from "@mui/icons-material";

import { useAuth } from "../../context/AuthContext";
import { useCart } from "../../context/CartContext";
import wishlistService from "../../services/wishlistService";


export default function ProductCard({
    product,
    onClick,
    onEdit,
    onDelete,
}) {
    /* ============================================
       AUTH / ROLE & CART HOOKS (UNCONDITIONAL)
    ============================================ */
    const { role } = useAuth();
    const { addToCart, isInCart, openCartDrawer } = useCart();

    const productId = product?.id;
    const [inWishlist, setInWishlist] = useState(() => (productId ? wishlistService.isInWishlist(productId) : false));

    useEffect(() => {
        if (productId) {
            const current = wishlistService.isInWishlist(productId);
            // eslint-disable-next-line react-hooks/set-state-in-effect
            setInWishlist((prev) => (prev !== current ? current : prev));
        }
    }, [productId]);

    if (!product) {
        return null;
    }

    const inCart = productId ? isInCart(productId) : false;

    const normalizedRole =
        String(role || "")
            .replace("ROLE_", "")
            .toUpperCase();

    const canEditProduct =
        normalizedRole === "ADMIN" ||
        normalizedRole === "SALESMAN";

    const canDeleteProduct =
        normalizedRole === "ADMIN";

    /* ============================================
       PRODUCT DATA
    ============================================ */
    const {
        id,
        name,
        description,
        price,
        stockQuantity,
        imageUrl,
        active,
        categoryName,
    } = product;

    const handleWishlistToggle = (event) => {
        event.stopPropagation();
        if (!id) return;

        if (inWishlist) {
            wishlistService.removeFromWishlist(id);
            setInWishlist(false);
        } else {
            wishlistService.addToWishlist(product);
            setInWishlist(true);
        }
    };

    const handleAddToCart = (event) => {
        event.stopPropagation();
        if (!isAvailable) return;
        addToCart(product, 1);
        openCartDrawer();
    };

    /* ============================================
       STOCK STATUS
    ============================================ */
    const isAvailable =
        active === true &&
        Number(stockQuantity) > 0;


    /* ============================================
       DESCRIPTION
    ============================================ */

    const shortDescription =
        description
            ? description.length > 90
                ? `${description.substring(0, 90)}...`
                : description
            : "No description available.";


    /* ============================================
       PRICE
    ============================================ */

    const formattedPrice =
        Number(price || 0).toLocaleString(
            "en-IN",
            {
                style: "currency",
                currency: "INR",
                maximumFractionDigits: 2,
            }
        );


    /* ============================================
       IMAGE FALLBACK
    ============================================ */

    const hasImage =
        Boolean(
            imageUrl &&
            imageUrl.trim()
        );


    /* ============================================
       VIEW PRODUCT
    ============================================ */

    const handleClick = () => {

        if (onClick && id) {
            onClick(id);
        }

    };


    /* ============================================
       EDIT PRODUCT
    ============================================ */

    const handleEdit = (
        event
    ) => {

        /*
         * Prevent the card's onClick from firing.
         *
         * Without this, clicking Edit would also
         * open Product Details.
         */

        event.stopPropagation();


        if (
            onEdit &&
            id &&
            canEditProduct
        ) {

            onEdit(id);

        }

    };


    /* ============================================
       DELETE PRODUCT
    ============================================ */
const handleDelete = (
    event
) => {

    event.stopPropagation();


    if (
        onDelete &&
        id &&
        canDeleteProduct
    ) {

        onDelete(id);

    }

};

    return (

        <Box
            sx={{
                width: "100%",

                minWidth: 0,

                borderRadius: 3,

                overflow: "hidden",

                background:
                    "rgba(255,255,255,.035)",

                border:
                    "1px solid rgba(255,255,255,.07)",

                transition:
                    "transform .2s ease, border-color .2s ease, background .2s ease",

                cursor: "pointer",

                "&:hover": {
                    transform:
                        "translateY(-4px)",

                    background:
                        "rgba(255,255,255,.055)",

                    borderColor:
                        "rgba(96,165,250,.28)",
                },
            }}

            onClick={
                handleClick
            }
        >

            {/* =====================================
                PRODUCT IMAGE
            ===================================== */}

            <Box
                sx={{
                    position:
                        "relative",

                    width: "100%",

                    aspectRatio:
                        "4 / 3",

                    overflow:
                        "hidden",

                    background:
                        "linear-gradient(135deg, #111827, #1E293B)",
                }}
            >

                {hasImage ? (

                    <Box
                        component="img"

                        src={
                            imageUrl
                        }

                        alt={
                            name ||
                            "Product"
                        }

                        sx={{
                            width: "100%",

                            height: "100%",

                            objectFit:
                                "cover",

                            display:
                                "block",

                            transition:
                                "transform .3s ease",

                            "&:hover": {
                                transform:
                                    "scale(1.04)",
                            },
                        }}
                    />

                ) : (

                    <Box
                        sx={{
                            width: "100%",

                            height: "100%",

                            display:
                                "flex",

                            alignItems:
                                "center",

                            justifyContent:
                                "center",

                            flexDirection:
                                "column",

                            gap: 1,

                            color:
                                "#475569",
                        }}
                    >

                        <Inventory2Outlined
                            sx={{
                                fontSize:
                                    42,
                            }}
                        />


                        <Typography
                            sx={{
                                fontSize:
                                    11,

                                color:
                                    "#64748B",
                            }}
                        >
                            No image
                        </Typography>

                    </Box>

                )}


                {/* =================================
                    WISHLIST BUTTON
                ================================= */}

                <Tooltip title={inWishlist ? "Remove from wishlist" : "Add to wishlist"}>
                    <IconButton
                        onClick={handleWishlistToggle}
                        sx={{
                            position: "absolute",
                            top: 10,
                            left: 10,
                            width: 32,
                            height: 32,
                            background: "rgba(15,23,42,.75)",
                            backdropFilter: "blur(6px)",
                            border: inWishlist
                                ? "1px solid rgba(244,114,182,.4)"
                                : "1px solid rgba(255,255,255,.15)",
                            color: inWishlist ? "#F472B6" : "#94A3B8",
                            transition: "all .2s ease",
                            "&:hover": {
                                background: "rgba(15,23,42,.95)",
                                color: "#F472B6",
                                transform: "scale(1.1)",
                            },
                        }}
                    >
                        {inWishlist ? (
                            <FavoriteRounded sx={{ fontSize: 18 }} />
                        ) : (
                            <FavoriteBorderRounded sx={{ fontSize: 18 }} />
                        )}
                    </IconButton>
                </Tooltip>

                {/* =================================
                    STOCK BADGE
                ================================= */}

                <Box
                    sx={{
                        position:
                            "absolute",

                        top: 12,

                        right: 12,
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
                            height: 25,

                            fontSize: 11,

                            fontWeight: 700,

                            color:
                                isAvailable
                                    ? "#86EFAC"
                                    : "#FCA5A5",

                            background:
                                isAvailable
                                    ? "rgba(34,197,94,.12)"
                                    : "rgba(239,68,68,.12)",

                            border:
                                isAvailable
                                    ? "1px solid rgba(34,197,94,.20)"
                                    : "1px solid rgba(239,68,68,.20)",
                        }}
                    />

                </Box>

            </Box>


            {/* =====================================
                PRODUCT CONTENT
            ===================================== */}

            <Box
                sx={{
                    p: 2,
                }}
            >

                {/* CATEGORY */}

                {categoryName && (

                    <Typography
                        sx={{
                            color:
                                "#60A5FA",

                            fontSize:
                                11,

                            fontWeight:
                                700,

                            textTransform:
                                "uppercase",

                            letterSpacing:
                                ".5px",

                            mb: .7,
                        }}
                    >
                        {categoryName}
                    </Typography>

                )}


                {/* PRODUCT NAME */}

                <Typography
                    sx={{
                        color:
                            "#F8FAFC",

                        fontSize:
                            16,

                        fontWeight:
                            750,

                        lineHeight:
                            1.3,

                        display:
                            "-webkit-box",

                        WebkitLineClamp:
                            2,

                        WebkitBoxOrient:
                            "vertical",

                        overflow:
                            "hidden",
                    }}
                >
                    {name ||
                        "Unnamed Product"}
                </Typography>


                {/* DESCRIPTION */}

                <Typography
                    sx={{
                        mt: .8,

                        color:
                            "#64748B",

                        fontSize:
                            12,

                        lineHeight:
                            1.5,

                        minHeight:
                            36,

                        display:
                            "-webkit-box",

                        WebkitLineClamp:
                            2,

                        WebkitBoxOrient:
                            "vertical",

                        overflow:
                            "hidden",
                    }}
                >
                    {shortDescription}
                </Typography>


                {/* =================================
                    PRICE + STOCK
                ================================= */}

                <Box
                    sx={{
                        mt: 2,

                        display:
                            "flex",

                        alignItems:
                            "flex-end",

                        justifyContent:
                            "space-between",

                        gap: 1,
                    }}
                >

                    <Box>

                        <Typography
                            sx={{
                                color:
                                    "#F8FAFC",

                                fontSize:
                                    19,

                                fontWeight:
                                    800,
                            }}
                        >
                            {formattedPrice}
                        </Typography>


                        <Typography
                            sx={{
                                mt: .2,

                                color:
                                    isAvailable
                                        ? "#64748B"
                                        : "#F87171",

                                fontSize:
                                    11,
                            }}
                        >
                            {isAvailable
                                ? `${stockQuantity} available`
                                : "Currently unavailable"}
                        </Typography>

                    </Box>

                </Box>


                {/* =================================
                    ACTIONS: VIEW & ADD TO CART
                ================================= */}

                <Box sx={{ mt: 2, display: "flex", gap: 1 }}>
                    <Button
                        fullWidth
                        variant="outlined"
                        onClick={(event) => {
                            event.stopPropagation();
                            handleClick();
                        }}
                        sx={{
                            minHeight: 40,
                            borderRadius: 2,
                            textTransform: "none",
                            fontSize: 12,
                            fontWeight: 700,
                            color: "#93C5FD",
                            borderColor: "rgba(96,165,250,.20)",
                            "&:hover": {
                                borderColor: "rgba(96,165,250,.45)",
                                background: "rgba(59,130,246,.08)",
                            },
                        }}
                    >
                        View
                    </Button>

                    {isAvailable && (
                        <Button
                            fullWidth
                            variant="contained"
                            startIcon={<ShoppingCartOutlined sx={{ fontSize: 16 }} />}
                            onClick={handleAddToCart}
                            sx={{
                                minHeight: 40,
                                borderRadius: 2,
                                textTransform: "none",
                                fontSize: 12,
                                fontWeight: 700,
                                background: inCart
                                    ? "linear-gradient(135deg, #10B981, #059669)"
                                    : "linear-gradient(135deg, #2563EB, #1D4ED8)",
                                color: "#fff",
                                boxShadow: "0 4px 14px rgba(37,99,235,.25)",
                                "&:hover": {
                                    background: inCart
                                        ? "linear-gradient(135deg, #059669, #047857)"
                                        : "linear-gradient(135deg, #1D4ED8, #1E40AF)",
                                },
                            }}
                        >
                            {inCart ? "In Cart ✓" : "Add to Cart"}
                        </Button>
                    )}
                </Box>


                {/* =================================
                    EDIT PRODUCT
                ================================= */}

                {canEditProduct && (

                    <Button
                        fullWidth

                        variant="contained"

                        startIcon={
                            <EditOutlined />
                        }

                        onClick={
                            handleEdit
                        }

                        sx={{
                            mt: 1,

                            minHeight:
                                40,

                            borderRadius:
                                2,

                            textTransform:
                                "none",

                            fontSize:
                                12,

                            fontWeight:
                                700,

                            color:
                                "#E0F2FE",

                            background:
                                "rgba(59,130,246,.16)",

                            border:
                                "1px solid rgba(96,165,250,.20)",

                            boxShadow:
                                "none",

                            "&:hover": {
                                background:
                                    "rgba(59,130,246,.26)",

                                borderColor:
                                    "rgba(96,165,250,.40)",

                                boxShadow:
                                    "none",
                            },
                        }}
                    >
                        Edit Product
                    </Button>

                )}


                {/* =================================
                    DELETE PRODUCT
                ================================= */}
                {canDeleteProduct && (

    <Button
        fullWidth

        variant="outlined"

        startIcon={
            <DeleteOutlineRounded />
        }

        onClick={
            handleDelete
        }

        sx={{
            mt: 1,

            minHeight: 40,

            borderRadius: 2,

            textTransform: "none",

            fontSize: 12,

            fontWeight: 700,

            color: "#FCA5A5",

            borderColor:
                "rgba(239,68,68,.22)",

            background:
                "rgba(239,68,68,.04)",

            "&:hover": {
                color: "#FECACA",

                borderColor:
                    "rgba(239,68,68,.45)",

                background:
                    "rgba(239,68,68,.10)",
            },
        }}
    >
        Delete Product
    </Button>

)}

            </Box>

        </Box>
    );
}