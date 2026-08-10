import {
    Box,
    Card,
    Typography,
} from "@mui/material";

import Inventory2RoundedIcon from "@mui/icons-material/Inventory2Rounded";
import ShoppingCartRoundedIcon from "@mui/icons-material/ShoppingCartRounded";
import PaymentsRoundedIcon from "@mui/icons-material/PaymentsRounded";
import CheckCircleRoundedIcon from "@mui/icons-material/CheckCircleRounded";


const summaryData = [
    {
        title: "Products",
        value: "128",
        description: "Available products",
        icon: Inventory2RoundedIcon,
    },
    {
        title: "Orders",
        value: "46",
        description: "Total orders",
        icon: ShoppingCartRoundedIcon,
    },
    {
        title: "Payments",
        value: "32",
        description: "Transactions",
        icon: PaymentsRoundedIcon,
    },
    {
        title: "Account",
        value: "Active",
        description: "Good standing",
        icon: CheckCircleRoundedIcon,
    },
];


export default function SummaryCard() {

    return (
        <Box
            sx={{
                display: "grid",

                gridTemplateColumns: {
                    xs: "1fr",
                    sm: "repeat(2, 1fr)",
                    lg: "repeat(4, 1fr)",
                },

                gap: 3,
            }}
        >

            {summaryData.map((item) => {

                const Icon = item.icon;

                return (
                    <Card
                        key={item.title}
                        elevation={0}
                        sx={{
                            p: 3,

                            minHeight: 150,

                            borderRadius: 4,

                            background:
                                "rgba(18,28,48,.72)",

                            border:
                                "1px solid rgba(255,255,255,.08)",

                            backdropFilter:
                                "blur(20px)",

                            transition:
                                "all .25s ease",

                            "&:hover": {
                                transform:
                                    "translateY(-5px)",

                                borderColor:
                                    "rgba(59,130,246,.35)",

                                boxShadow:
                                    "0 18px 45px rgba(0,0,0,.25)",
                            },
                        }}
                    >

                        {/* Top */}

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
                                    fontSize: 14,
                                    fontWeight: 600,
                                }}
                            >
                                {item.title}
                            </Typography>


                            <Box
                                sx={{
                                    width: 42,
                                    height: 42,

                                    borderRadius: 3,

                                    display: "flex",
                                    alignItems: "center",
                                    justifyContent: "center",

                                    background:
                                        "rgba(59,130,246,.12)",

                                    color: "#60A5FA",
                                }}
                            >
                                <Icon />
                            </Box>

                        </Box>


                        {/* Value */}

                        <Typography
                            sx={{
                                mt: 2,

                                color: "#fff",

                                fontSize: {
                                    xs: 26,
                                    md: 30,
                                },

                                fontWeight: 800,
                            }}
                        >
                            {item.value}
                        </Typography>


                        {/* Description */}

                        <Typography
                            sx={{
                                mt: 0.5,

                                color: "#64748B",

                                fontSize: 13,
                            }}
                        >
                            {item.description}
                        </Typography>

                    </Card>
                );
            })}

        </Box>
    );
}