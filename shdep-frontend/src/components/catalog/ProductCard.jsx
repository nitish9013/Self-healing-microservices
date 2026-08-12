import {
    Box,
    Button,
    Chip,
    Typography,
} from "@mui/material";

import {
    ShoppingCartOutlined,
    ArrowForwardRounded,
    Inventory2Outlined,
} from "@mui/icons-material";


export default function ProductCard({
    product,
    onClick,
}) {

    if (!product) {
        return null;
    }


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


    /* ============================================
       STOCK STATUS
    ============================================ */

    const isAvailable =
        active === true &&
        Number(stockQuantity) > 0;


    const isOutOfStock =
        Number(stockQuantity) <= 0;


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
       CLICK
    ============================================ */

    const handleClick = () => {

        if (onClick && id) {
            onClick(id);
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

            onClick={handleClick}
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

                        src={imageUrl}

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
                    VIEW PRODUCT
                ================================= */}

                <Button
                    fullWidth

                    variant="outlined"

                    startIcon={
                        isAvailable
                            ? (
                                <ShoppingCartOutlined />
                            )
                            : (
                                <ArrowForwardRounded />
                            )
                    }

                    onClick={(event) => {

                        event.stopPropagation();

                        handleClick();

                    }}

                    sx={{
                        mt: 2,

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
                            "#93C5FD",

                        borderColor:
                            "rgba(96,165,250,.20)",

                        "&:hover": {
                            borderColor:
                                "rgba(96,165,250,.45)",

                            background:
                                "rgba(59,130,246,.08)",
                        },
                    }}
                >
                    {isAvailable
                        ? "View Product"
                        : "View Details"}
                </Button>

            </Box>

        </Box>
    );
}