import {
    Box,
    Button,
    CircularProgress,
    Typography,
} from "@mui/material";

import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { useEffect, useState } from "react";

import DashboardHeader from "../../components/dashboard/DashboardHeader";
import WelcomeCard from "../../components/dashboard/WelcomeCard";
import SummaryCard from "../../components/dashboard/SummaryCard";
import RecentActivity from "../../components/dashboard/RecentActivity";
import FeaturedProducts from "../../components/dashboard/FeaturedProducts";
import TopCategories from "../../components/dashboard/TopCategories";
import Sidebar from "../../components/dashboard/Sidebar";

import dashboardService from "../../services/dashboardService";


export default function Dashboard() {

    const navigate = useNavigate();

    const {
        userId,
        token,
    } = useAuth();


    const [dashboardData, setDashboardData] =
        useState(null);

    const [loading, setLoading] =
        useState(true);

    const [error, setError] =
        useState("");
        const [mobileSidebarOpen, setMobileSidebarOpen] =
    useState(false);


    /* ==============================
       LOAD DASHBOARD
    ============================== */

    const loadDashboard = async () => {

    if (!token || !userId) {

        navigate("/login", {
            replace: true,
        });

        return;
    }

    try {

        setLoading(true);
        setError("");

        const data =
            await dashboardService
                .getUserDashboard(userId);

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

        if (err.response?.status === 401) {

            navigate("/login", {
                replace: true,
            });

            return;
        }

        setError(
            err.response?.data?.message ||
            err.response?.data ||
            "Unable to load dashboard."
        );

    } finally {

        setLoading(false);

    }
};

    useEffect(() => {

        loadDashboard();

    }, [userId]);


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
                TOP HEADER
            ===================================== */}

          <DashboardHeader
    onMenuClick={() =>
        setMobileSidebarOpen(true)
    }
/>


            {/* =====================================
                SIDEBAR + MAIN CONTENT
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
    mobileOpen={mobileSidebarOpen}
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
                    }}
                >

                    <Box
                        sx={{
                            width: "100%",

                            maxWidth: 1600,

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

                        {/* =================================
                            LOADING
                        ================================= */}

                        {loading && (

                            <Box
                                sx={{
                                    minHeight: "70vh",

                                    display: "flex",

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
                                    size={42}
                                    sx={{
                                        color: "#60A5FA",
                                    }}
                                />


                                <Typography
                                    sx={{
                                        color: "#94A3B8",

                                        fontSize: 14,
                                    }}
                                >
                                    Loading dashboard...
                                </Typography>

                            </Box>

                        )}


                        {/* =================================
                            ERROR
                        ================================= */}

                        {!loading && error && (

                            <Box
                                sx={{
                                    minHeight: "70vh",

                                    display: "flex",

                                    flexDirection:
                                        "column",

                                    alignItems:
                                        "center",

                                    justifyContent:
                                        "center",

                                    textAlign: "center",

                                    gap: 2,
                                }}
                            >

                                <Typography
                                    sx={{
                                        color: "#F87171",

                                        fontSize: 20,

                                        fontWeight: 700,
                                    }}
                                >
                                    Unable to load dashboard
                                </Typography>


                                <Typography
                                    sx={{
                                        color: "#94A3B8",

                                        maxWidth: 500,

                                        fontSize: 14,
                                    }}
                                >
                                    {error}
                                </Typography>


                                <Button
                                    variant="contained"

                                    onClick={
                                        loadDashboard
                                    }

                                    sx={{
                                        mt: 1,

                                        borderRadius: 2,

                                        textTransform:
                                            "none",

                                        fontWeight: 600,
                                    }}
                                >
                                    Retry
                                </Button>

                            </Box>

                        )}


                        {/* =================================
                            ACTUAL DASHBOARD
                        ================================= */}

                        {!loading &&
                            !error &&
                            dashboardData && (

                            <>

                                {/* =========================
                                    WELCOME
                                ========================= */}

                                <WelcomeCard />


                                {/* =========================
                                    FEATURED PRODUCTS
                                ========================= */}

                                <Box
                                    sx={{
                                        mt: {
                                            xs: 3,
                                            md: 4,
                                        },
                                    }}
                                >

                                    <FeaturedProducts
                                        products={
                                            dashboardData
                                                ?.featuredProducts || []
                                        }
                                    />

                                </Box>


                                {/* =========================
                                    SUMMARY
                                ========================= */}

                                <Box
                                    sx={{
                                        mt: {
                                            xs: 3,
                                            md: 4,
                                        },
                                    }}
                                >

                                    <SummaryCard
                                        dashboardData={
                                            dashboardData
                                        }
                                    />

                                </Box>


                                {/* =========================
                                    RECENT ORDERS + CATEGORIES
                                ========================= */}

                                <Box
                                    sx={{
                                        mt: {
                                            xs: 3,
                                            md: 4,
                                        },

                                        display: "grid",

                                        gridTemplateColumns: {
                                            xs: "1fr",

                                            md:
                                                "minmax(0, 2fr) minmax(280px, 1fr)",
                                        },

                                        gap: {
                                            xs: 2,

                                            md: 3,
                                        },
                                    }}
                                >

                                    <RecentActivity
                                        dashboardData={
                                            dashboardData
                                        }
                                    />


                                    <TopCategories
                                        categories={
                                            dashboardData
                                                ?.categories || []
                                        }
                                    />

                                </Box>

                            </>

                        )}

                    </Box>

                </Box>

            </Box>

        </Box>

    );
}