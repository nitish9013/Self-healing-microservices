import {
    ArrowForwardRounded,
    Inventory2Outlined,
} from "@mui/icons-material";

import {
    Box,
    ButtonBase,
    Typography,
} from "@mui/material";

export default function FeaturedProducts({
    products = [],
}) {

    const visibleProducts =
        products.slice(0, 4);


    return (
        <Box
            sx={{
                width: "100%",

                p: {
                    xs: 2.5,
                    sm: 3,
                    md: 3.5,
                },

                borderRadius: {
                    xs: 3,
                    md: 3.5,
                },

                background:
                    "rgba(255,255,255,.035)",

                border:
                    "1px solid rgba(255,255,255,.07)",

                boxShadow:
                    "0 16px 45px rgba(0,0,0,.12)",
            }}
        >

            {/* =================================
                HEADER
            ================================= */}

            <Box
                sx={{
                    display: "flex",

                    alignItems: {
                        xs: "flex-start",
                        sm: "center",
                    },

                    justifyContent:
                        "space-between",

                    flexDirection: {
                        xs: "column",
                        sm: "row",
                    },

                    gap: 1.5,

                    mb: 2.5,
                }}
            >

                <Box>

                    <Typography
                        sx={{
                            color: "#F8FAFC",

                            fontSize: {
                                xs: 17,
                                md: 19,
                            },

                            fontWeight: 750,

                            letterSpacing:
                                "-.2px",
                        }}
                    >
                        Featured Products
                    </Typography>


                    <Typography
                        sx={{
                            mt: .5,

                            color: "#64748B",

                            fontSize: 12,

                            lineHeight: 1.5,
                        }}
                    >
                        Explore products from your catalog
                    </Typography>

                </Box>


                <Box
                    sx={{
                        display: "flex",

                        alignItems: "center",

                        gap: .7,

                        px: 1.3,

                        py: .7,

                        borderRadius: 2,

                        background:
                            "rgba(96,165,250,.07)",

                        border:
                            "1px solid rgba(96,165,250,.10)",
                    }}
                >

                    <Inventory2Outlined
                        sx={{
                            fontSize: 16,

                            color: "#60A5FA",
                        }}
                    />


                    <Typography
                        sx={{
                            color: "#93C5FD",

                            fontSize: 11,

                            fontWeight: 700,
                        }}
                    >
                        {products.length}{" "}
                        {products.length === 1
                            ? "Product"
                            : "Products"}
                    </Typography>

                </Box>

            </Box>


            {/* =================================
                EMPTY STATE
            ================================= */}

            {visibleProducts.length === 0 && (

                <Box
                    sx={{
                        minHeight: 150,

                        borderRadius: 2.5,

                        display: "flex",

                        flexDirection: "column",

                        alignItems: "center",

                        justifyContent: "center",

                        textAlign: "center",

                        background:
                            "rgba(255,255,255,.018)",

                        border:
                            "1px dashed rgba(255,255,255,.08)",
                    }}
                >

                    <Inventory2Outlined
                        sx={{
                            fontSize: 30,

                            color: "#475569",

                            mb: 1,
                        }}
                    />


                    <Typography
                        sx={{
                            color: "#94A3B8",

                            fontSize: 13,

                            fontWeight: 600,
                        }}
                    >
                        No featured products
                    </Typography>


                    <Typography
                        sx={{
                            mt: .5,

                            color: "#475569",

                            fontSize: 11,
                        }}
                    >
                        Products will appear here when available.
                    </Typography>

                </Box>

            )}


            {/* =================================
                PRODUCT GRID
            ================================= */}

            {visibleProducts.length > 0 && (

                <Box
                    sx={{
                        display: "grid",

                        gridTemplateColumns: {
                            xs: "1fr",
                            sm: "repeat(2, 1fr)",
                            lg: "repeat(4, 1fr)",
                        },

                        gap: {
                            xs: 1.5,
                            md: 2,
                        },
                    }}
                >

                    {visibleProducts.map(
                        (product, index) => {

                            const productName =
                                product.name ||
                                product.productName ||
                                `Product ${index + 1}`;

                            const category =
                                product.categoryName ||
                                product.category ||
                                "Product";


                            return (

                                <ButtonBase
                                    key={
                                        product.id ??
                                        product.productId ??
                                        index
                                    }

                                    disabled

                                    sx={{
                                        width: "100%",

                                        display: "block",

                                        textAlign: "left",

                                        borderRadius: 2.5,

                                        "&.Mui-disabled": {
                                            color: "inherit",
                                        },
                                    }}
                                >

                                    <Box
                                        sx={{
                                            minHeight: 145,

                                            p: 2,

                                            borderRadius: 2.5,

                                            background:
                                                "linear-gradient(145deg, rgba(255,255,255,.045), rgba(255,255,255,.018))",

                                            border:
                                                "1px solid rgba(255,255,255,.065)",

                                            transition:
                                                "all .2s ease",

                                            display: "flex",

                                            flexDirection:
                                                "column",

                                            justifyContent:
                                                "space-between",

                                            "&:hover": {
                                                background:
                                                    "rgba(96,165,250,.06)",

                                                borderColor:
                                                    "rgba(96,165,250,.18)",
                                            },
                                        }}
                                    >

                                        {/* Product visual */}

                                        <Box
                                            sx={{
                                                width: 42,

                                                height: 42,

                                                borderRadius: 2,

                                                display: "flex",

                                                alignItems:
                                                    "center",

                                                justifyContent:
                                                    "center",

                                                background:
                                                    "rgba(59,130,246,.10)",

                                                border:
                                                    "1px solid rgba(96,165,250,.10)",
                                            }}
                                        >

                                            <Inventory2Outlined
                                                sx={{
                                                    fontSize: 21,

                                                    color:
                                                        "#60A5FA",
                                                }}
                                            />

                                        </Box>


                                        {/* Product info */}

                                        <Box
                                            sx={{
                                                mt: 2,
                                            }}
                                        >

                                            <Typography
                                                sx={{
                                                    color:
                                                        "#F8FAFC",

                                                    fontSize:
                                                        13,

                                                    fontWeight:
                                                        700,

                                                    overflow:
                                                        "hidden",

                                                    textOverflow:
                                                        "ellipsis",

                                                    whiteSpace:
                                                        "nowrap",
                                                }}
                                            >
                                                {productName}
                                            </Typography>


                                            <Typography
                                                sx={{
                                                    mt: .5,

                                                    color:
                                                        "#64748B",

                                                    fontSize:
                                                        11,

                                                    overflow:
                                                        "hidden",

                                                    textOverflow:
                                                        "ellipsis",

                                                    whiteSpace:
                                                        "nowrap",
                                                }}
                                            >
                                                {category}
                                            </Typography>

                                        </Box>

                                    </Box>

                                </ButtonBase>

                            );
                        }
                    )}

                </Box>

            )}

        </Box>
    );
}