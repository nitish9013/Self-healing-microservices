import {
    Box,
    Card,
    Typography,
    Button,
} from "@mui/material";

import Inventory2RoundedIcon from "@mui/icons-material/Inventory2Rounded";
import ShoppingBagRoundedIcon from "@mui/icons-material/ShoppingBagRounded";
import PaymentsRoundedIcon from "@mui/icons-material/PaymentsRounded";
import PersonRoundedIcon from "@mui/icons-material/PersonRounded";
import { useNavigate } from "react-router-dom";

const actions = [
    {
        title: "Browse Catalog",
        description: "Explore available products",
        icon: Inventory2RoundedIcon,
    },
    {
        title: "My Orders",
        description: "View your orders",
        icon: ShoppingBagRoundedIcon,
    },
    {
        title: "Payments",
        description: "View payment history",
        icon: PaymentsRoundedIcon,
    },
    {
        title: "My Profile",
        description: "Manage your account",
        icon: PersonRoundedIcon,
    },
];


export default function QuickActions() {

    const navigate = useNavigate();

    return (
        <Card
            elevation={0}
            sx={{
                p: {
                    xs: 3,
                    md: 4,
                },

                borderRadius: 5,

                background:
                    "rgba(18,28,48,.72)",

                border:
                    "1px solid rgba(255,255,255,.08)",

                backdropFilter:
                    "blur(20px)",
            }}
        >

            {/* Heading */}

            <Typography
                sx={{
                    color: "#fff",
                    fontSize: 20,
                    fontWeight: 700,
                    mb: 0.5,
                }}
            >
                Quick Actions
            </Typography>


            <Typography
                sx={{
                    color: "#64748B",
                    fontSize: 13,
                    mb: 3,
                }}
            >
                Quickly access your frequently used features.
            </Typography>


            {/* Actions */}

            <Box
                sx={{
                    display: "grid",

                    gridTemplateColumns: {
                        xs: "1fr",
                        sm: "repeat(2, 1fr)",
                        lg: "repeat(4, 1fr)",
                    },

                    gap: 2,
                }}
            >

                {actions.map((action) => {

                    const Icon = action.icon;

                    return (
                        <Button
                            key={action.title}
                            variant="outlined"
                            onClick={() => {
    if (action.title === "Payments") {
        navigate("/payments");
    }
}}
                            sx={{
                                minHeight: 90,

                                p: 2,

                                borderRadius: 3,

                                borderColor:
                                    "rgba(255,255,255,.08)",

                                color: "#fff",

                                textTransform: "none",

                                display: "flex",

                                alignItems: "center",

                                justifyContent: "flex-start",

                                gap: 2,

                                textAlign: "left",

                                transition:
                                    "all .25s ease",

                                "&:hover": {
                                    transform:
                                        "translateY(-3px)",

                                    borderColor:
                                        "rgba(59,130,246,.45)",

                                    background:
                                        "rgba(59,130,246,.06)",

                                    boxShadow:
                                        "0 12px 30px rgba(0,0,0,.20)",
                                },
                            }}
                        >

                            {/* Icon */}

                            <Box
                                sx={{
                                    width: 44,
                                    height: 44,

                                    minWidth: 44,

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


                            {/* Text */}

                            <Box>

                                <Typography
                                    sx={{
                                        fontSize: 14,
                                        fontWeight: 700,
                                        color: "#E2E8F0",
                                    }}
                                >
                                    {action.title}
                                </Typography>


                                <Typography
                                    sx={{
                                        mt: 0.4,
                                        fontSize: 11,
                                        color: "#64748B",
                                    }}
                                >
                                    {action.description}
                                </Typography>

                            </Box>

                        </Button>
                    );
                })}

            </Box>

        </Card>
    );
}