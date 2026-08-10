import {
    ArrowForwardRounded,
    CategoryOutlined,
} from "@mui/icons-material";

import {
    Box,
    Typography,
} from "@mui/material";


export default function TopCategories({
    categories = [],
}) {

    const visibleCategories =
        categories.slice(0, 5);


    return (

        <Box
            sx={{
                width: "100%",

                p: {
                    xs: 2.5,
                    md: 3,
                },

                borderRadius: 3.5,

                background:
                    "rgba(255,255,255,.035)",

                border:
                    "1px solid rgba(255,255,255,.07)",
            }}
        >

            {/* =====================================
                HEADER
            ===================================== */}

            <Box
                sx={{
                    display: "flex",

                    alignItems: "center",

                    justifyContent:
                        "space-between",

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
                        }}
                    >
                        Top Categories
                    </Typography>


                    <Typography
                        sx={{
                            mt: .45,

                            color: "#64748B",

                            fontSize: 11.5,
                        }}
                    >
                        Categories available in catalog
                    </Typography>

                </Box>


                <Box
                    sx={{
                        width: 36,

                        height: 36,

                        borderRadius: 2,

                        display: "flex",

                        alignItems: "center",

                        justifyContent: "center",

                        background:
                            "rgba(139,92,246,.08)",
                    }}
                >

                    <CategoryOutlined
                        sx={{
                            fontSize: 19,

                            color: "#A78BFA",
                        }}
                    />

                </Box>

            </Box>


            {/* =====================================
                EMPTY STATE
            ===================================== */}

            {visibleCategories.length === 0 && (

                <Box
                    sx={{
                        minHeight: 190,

                        display: "flex",

                        flexDirection: "column",

                        alignItems: "center",

                        justifyContent: "center",

                        textAlign: "center",

                        borderRadius: 2.5,

                        background:
                            "rgba(255,255,255,.018)",

                        border:
                            "1px dashed rgba(255,255,255,.08)",
                    }}
                >

                    <CategoryOutlined
                        sx={{
                            fontSize: 31,

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
                        No categories available
                    </Typography>


                    <Typography
                        sx={{
                            mt: .5,

                            color: "#475569",

                            fontSize: 11,
                        }}
                    >
                        Categories will appear here when available.
                    </Typography>

                </Box>

            )}


            {/* =====================================
                CATEGORY LIST
            ===================================== */}

            {visibleCategories.length > 0 && (

                <Box
                    sx={{
                        display: "flex",

                        flexDirection: "column",

                        gap: 1,
                    }}
                >

                    {visibleCategories.map(
                        (category, index) => {

                            const name =
                                category?.name ||
                                category?.categoryName ||
                                category?.title ||
                                `Category ${index + 1}`;

                            const id =
                                category?.id ??
                                category?.categoryId ??
                                index;


                            return (

                                <Box
                                    key={id}

                                    sx={{
                                        minHeight: 57,

                                        px: 1.5,

                                        py: 1,

                                        borderRadius: 2.5,

                                        display: "flex",

                                        alignItems: "center",

                                        gap: 1.3,

                                        background:
                                            "rgba(255,255,255,.018)",

                                        border:
                                            "1px solid rgba(255,255,255,.045)",

                                        transition:
                                            "all .2s ease",

                                        "&:hover": {
                                            background:
                                                "rgba(139,92,246,.05)",
                                        },
                                    }}
                                >

                                    {/* Number */}

                                    <Box
                                        sx={{
                                            width: 30,

                                            height: 30,

                                            flexShrink: 0,

                                            borderRadius: 1.8,

                                            display: "flex",

                                            alignItems:
                                                "center",

                                            justifyContent:
                                                "center",

                                            color: "#A78BFA",

                                            background:
                                                "rgba(139,92,246,.08)",

                                            fontSize: 11,

                                            fontWeight: 800,
                                        }}
                                    >
                                        {index + 1}
                                    </Box>


                                    {/* Category */}

                                    <Box
                                        sx={{
                                            minWidth: 0,

                                            flex: 1,
                                        }}
                                    >

                                        <Typography
                                            sx={{
                                                color: "#E2E8F0",

                                                fontSize: 12.5,

                                                fontWeight: 650,

                                                overflow:
                                                    "hidden",

                                                textOverflow:
                                                    "ellipsis",

                                                whiteSpace:
                                                    "nowrap",
                                            }}
                                        >
                                            {name}
                                        </Typography>

                                    </Box>


                                    <ArrowForwardRounded
                                        sx={{
                                            fontSize: 16,

                                            color: "#475569",
                                        }}
                                    />

                                </Box>

                            );

                        }
                    )}

                </Box>

            )}

        </Box>
    );
}