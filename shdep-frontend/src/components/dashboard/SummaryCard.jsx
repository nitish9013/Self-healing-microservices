import {
    CategoryOutlined,
    Inventory2Outlined,
    PersonOutlineRounded,
    ShoppingBagOutlined,
} from "@mui/icons-material";

import {
    Box,
    Typography,
} from "@mui/material";

import { useAuth } from "../../context/AuthContext";


export default function SummaryCard({
    dashboardData,
}) {

    const {
        role,
    } = useAuth();


    const products =
        dashboardData?.featuredProducts?.length || 0;

    const categories =
        dashboardData?.categories?.length || 0;

    const orders =
        dashboardData?.recentOrders?.length || 0;

    const accountStatus =
        dashboardData?.user
            ? "Active"
            : "Unavailable";


    const cards = [
        {
            label: "Products",
            value: products,
            description: "Featured products",
            icon: Inventory2Outlined,
            iconColor: "#60A5FA",
            iconBackground: "rgba(59,130,246,.10)",
        },

        {
            label: "Categories",
            value: categories,
            description: "Available categories",
            icon: CategoryOutlined,
            iconColor: "#A78BFA",
            iconBackground: "rgba(139,92,246,.10)",
        },

        {
            label: "Orders",
            value: orders,
            description: "Recent orders",
            icon: ShoppingBagOutlined,
            iconColor: "#34D399",
            iconBackground: "rgba(16,185,129,.10)",
        },

        {
            label: "Account",
            value: accountStatus,
            description: role || "USER",
            icon: PersonOutlineRounded,
            iconColor: "#FBBF24",
            iconBackground: "rgba(245,158,11,.10)",
        },
    ];


    return (

        <Box
            sx={{
                width: "100%",

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

            {cards.map((card) => {

                const Icon = card.icon;

                return (

                    <Box
                        key={card.label}

                        sx={{
                            minHeight: {
                                xs: 125,
                                md: 140,
                            },

                            p: {
                                xs: 2,
                                md: 2.5,
                            },

                            borderRadius: 3,

                            background:
                                "rgba(255,255,255,.035)",

                            border:
                                "1px solid rgba(255,255,255,.07)",

                            display: "flex",

                            flexDirection: "column",

                            justifyContent:
                                "space-between",

                            transition:
                                "all .2s ease",

                            "&:hover": {
                                background:
                                    "rgba(255,255,255,.05)",

                                borderColor:
                                    "rgba(255,255,255,.11)",

                                transform:
                                    "translateY(-2px)",
                            },
                        }}
                    >

                        {/* =========================
                            TOP
                        ========================= */}

                        <Box
                            sx={{
                                display: "flex",

                                alignItems: "center",

                                justifyContent:
                                    "space-between",
                            }}
                        >

                            <Typography
                                sx={{
                                    color: "#94A3B8",

                                    fontSize: 12,

                                    fontWeight: 600,
                                }}
                            >
                                {card.label}
                            </Typography>


                            <Box
                                sx={{
                                    width: 36,

                                    height: 36,

                                    borderRadius: 2,

                                    display: "flex",

                                    alignItems: "center",

                                    justifyContent:
                                        "center",

                                    background:
                                        card.iconBackground,

                                    border:
                                        `1px solid ${card.iconColor}20`,
                                }}
                            >

                                <Icon
                                    sx={{
                                        fontSize: 19,

                                        color:
                                            card.iconColor,
                                    }}
                                />

                            </Box>

                        </Box>


                        {/* =========================
                            VALUE
                        ========================= */}

                        <Box>

                            <Typography
                                sx={{
                                    color: "#F8FAFC",

                                    fontSize:
                                        card.label === "Account"
                                            ? 19
                                            : 27,

                                    lineHeight: 1,

                                    fontWeight: 800,

                                    letterSpacing:
                                        "-.5px",
                                }}
                            >
                                {card.value}
                            </Typography>


                            <Typography
                                sx={{
                                    mt: .7,

                                    color: "#475569",

                                    fontSize: 10,

                                    fontWeight: 500,
                                }}
                            >
                                {card.description}
                            </Typography>

                        </Box>

                    </Box>

                );
            })}

        </Box>
    );
}