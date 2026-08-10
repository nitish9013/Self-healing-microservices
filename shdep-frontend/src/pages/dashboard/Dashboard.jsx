import { Box } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

import DashboardHeader from "../../components/dashboard/DashboardHeader";
import WelcomeCard from "../../components/dashboard/WelcomeCard";
import SummaryCard from "../../components/dashboard/SummaryCard";
import QuickActions from "../../components/dashboard/QuickActions";
import RecentActivity from "../../components/dashboard/RecentActivity";
import SupportCard from "../../components/dashboard/SupportCard";
import { useEffect, useState } from "react";
import dashboardService from "../../services/dashboardService";

export default function Dashboard() {

    const navigate = useNavigate();

    const { logout } = useAuth();

    const handleLogout = () => {
        logout();
        navigate("/login");
    };

    const {
    userId,
    username,
    role,
    
     } = useAuth();


    const [dashboardData, setDashboardData] = useState(null);

     const [loading, setLoading] = useState(true);

    const [error, setError] = useState("");
     
    useEffect(() => {
    const loadDashboard = async () => {

        if (!userId) {
            setError("User information not available.");
            setLoading(false);
            return;
        }

        try {

            setLoading(true);
            setError("");

            const data =
                await dashboardService.getUserDashboard(userId);

            console.log(
                "Dashboard Data = ",
                data
            );

            setDashboardData(data);

        } catch (err) {

            console.error(
                "Dashboard API Error = ",
                err
            );

            setError(
                err.response?.data ||
                "Unable to load dashboard."
            );

        } finally {

            setLoading(false);

        }
    };

    loadDashboard();

}, [userId]);


    return (
        <Box
            sx={{
                minHeight: "100vh",
                background:
                    "linear-gradient(135deg, #080F23 0%, #0F172A 55%, #111827 100%)",
            }}
        >

            {/* Header */}

            <DashboardHeader />


            {/* Main Dashboard */}

            <Box
                sx={{
                    width: "100%",
                    maxWidth: 1450,
                    mx: "auto",

                    px: {
                        xs: 2,
                        sm: 3,
                        md: 5,
                        lg: 6,
                    },

                    py: {
                        xs: 3,
                        md: 5,
                    },
                }}
            >

                {/* Welcome */}

                <WelcomeCard />


                {/* Summary */}

                <Box sx={{ mt: { xs: 3, md: 4 } }}>
                    <SummaryCard />
                </Box>


                {/* Quick Actions */}

                <Box sx={{ mt: { xs: 3, md: 4 } }}>
                    <QuickActions />
                </Box>


                {/* Activity + Support */}

                <Box
                    sx={{
                        mt: { xs: 3, md: 4 },

                        display: "grid",

                        gridTemplateColumns: {
                            xs: "1fr",
                            md: "minmax(0, 2fr) minmax(280px, 1fr)",
                        },

                        gap: {
                            xs: 2,
                            md: 3,
                        },
                    }}
                >
                    <RecentActivity />

                    <SupportCard />
                </Box>


                {/* Logout */}

                <Box
                    sx={{
                        mt: 4,
                        display: "flex",
                        justifyContent: "flex-end",
                    }}
                >
                    <Box
                        component="button"
                        onClick={handleLogout}
                        sx={{
                            border: "1px solid rgba(239,68,68,.25)",
                            background: "rgba(239,68,68,.08)",
                            color: "#FCA5A5",

                            borderRadius: 2.5,

                            px: 2.5,
                            py: 1,

                            fontSize: 13,
                            fontWeight: 600,

                            cursor: "pointer",

                            transition: "all .2s ease",

                            "&:hover": {
                                background:
                                    "rgba(239,68,68,.15)",
                                borderColor:
                                    "rgba(239,68,68,.45)",
                                transform:
                                    "translateY(-1px)",
                            },
                        }}
                    >
                        Logout
                    </Box>
                </Box>

            </Box>

        </Box>
    );
}