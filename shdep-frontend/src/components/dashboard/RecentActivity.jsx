import {
    Box,
    Card,
    Typography,
    Divider,
} from "@mui/material";

import ShoppingBagRoundedIcon from "@mui/icons-material/ShoppingBagRounded";
import PaymentsRoundedIcon from "@mui/icons-material/PaymentsRounded";
import PersonRoundedIcon from "@mui/icons-material/PersonRounded";


const activities = [
    {
        title: "Order Placed",
        description: "Order #1024 was successfully created.",
        time: "2 hours ago",
        icon: ShoppingBagRoundedIcon,
    },
    {
        title: "Payment Successful",
        description: "Payment for Order #1024 was completed.",
        time: "2 hours ago",
        icon: PaymentsRoundedIcon,
    },
    {
        title: "Profile Updated",
        description: "Your profile information was updated.",
        time: "Yesterday",
        icon: PersonRoundedIcon,
    },
];


export default function RecentActivity() {

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
                }}
            >
                Recent Activity
            </Typography>

            <Typography
                sx={{
                    mt: 0.5,
                    mb: 3,
                    color: "#64748B",
                    fontSize: 13,
                }}
            >
                Your latest account activity.
            </Typography>


            {/* Activity List */}

            <Box>

                {activities.map((activity, index) => {

                    const Icon = activity.icon;

                    return (
                        <Box key={activity.title}>

                            <Box
                                sx={{
                                    display: "flex",
                                    alignItems: "center",
                                    gap: 2,
                                    py: 2,
                                }}
                            >

                                {/* Icon */}

                                <Box
                                    sx={{
                                        width: 42,
                                        height: 42,
                                        minWidth: 42,

                                        borderRadius: 3,

                                        display: "flex",
                                        alignItems: "center",
                                        justifyContent: "center",

                                        background:
                                            "rgba(59,130,246,.10)",

                                        color: "#60A5FA",
                                    }}
                                >
                                    <Icon fontSize="small" />
                                </Box>


                                {/* Content */}

                                <Box sx={{ flex: 1 }}>

                                    <Typography
                                        sx={{
                                            color: "#E2E8F0",
                                            fontSize: 14,
                                            fontWeight: 700,
                                        }}
                                    >
                                        {activity.title}
                                    </Typography>

                                    <Typography
                                        sx={{
                                            mt: 0.4,
                                            color: "#64748B",
                                            fontSize: 12,
                                        }}
                                    >
                                        {activity.description}
                                    </Typography>

                                </Box>


                                {/* Time */}

                                <Typography
                                    sx={{
                                        color: "#475569",
                                        fontSize: 11,
                                        whiteSpace: "nowrap",
                                    }}
                                >
                                    {activity.time}
                                </Typography>

                            </Box>


                            {index < activities.length - 1 && (
                                <Divider
                                    sx={{
                                        borderColor:
                                            "rgba(255,255,255,.06)",
                                    }}
                                />
                            )}

                        </Box>
                    );
                })}

            </Box>

        </Card>
    );
}