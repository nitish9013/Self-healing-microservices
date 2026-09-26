import {
    Box,
    Typography,
    IconButton,
    Avatar,
    Button,
    Divider,
} from "@mui/material";

import {
    DashboardRounded,
    DnsRounded,
    PeopleRounded,
    ShoppingCartRounded,
    PaymentsRounded,
    Inventory2Rounded,
    HubRounded,
    DescriptionRounded,
    WarningAmberRounded,
    QueryStatsRounded,
    SettingsRounded,
    SearchRounded,
    RefreshRounded,
    CircleRounded,
} from "@mui/icons-material";

import { useAuth } from "../../context/AuthContext";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
    getAdminAnalytics,
    getServiceHealth,
    getCircuitBreakerStatus,
} from "../../services/adminDashboardService";
const menuItems = [
    {
        label: "Overview",
        icon: DashboardRounded,
        active: true,
    },
    {
        label: "Services",
        icon: DnsRounded,
    },
    {
        label: "Users",
        icon: PeopleRounded,
    },
    {
        label: "Orders",
        icon: ShoppingCartRounded,
        path: "/admin/orders",
    },
    {
        label: "Payments",
        icon: PaymentsRounded,
    },
    {
        label: "Catalog",
        icon: Inventory2Rounded,
    },
    {
        label: "Kafka",
        icon: HubRounded,
    },
    {
        label: "Logs",
        icon: DescriptionRounded,
    },
    {
        label: "Alerts",
        icon: WarningAmberRounded,
    },
    {
        label: "System Metrics",
        icon: QueryStatsRounded,
    },
    {
        label: "Settings",
        icon: SettingsRounded,
    },
];


const statCards = [
    {
        label: "Total Users",
        icon: PeopleRounded,
        key: "totalUsers",
    },
    {
        label: "Total Orders",
        icon: ShoppingCartRounded,
        key: "totalOrders",
    },
    {
        label: "Total Payments",
        icon: PaymentsRounded,
        key: "totalPayments",
    },
    {
        label: "Total Products",
        icon: Inventory2Rounded,
        key: "totalProducts",
    },
];


const services = [
    "API Gateway",
    "Authentication",
    "User Service",
    "Catalog Service",
    "Order Service",
    "Payment Service",
    "Dashboard Service",
];


export default function AdminDashboard() {
 const navigate = useNavigate();
    const { username } = useAuth();

    const displayName = username || "Admin";
    const [analytics, setAnalytics] = useState(null);
const [analyticsLoading, setAnalyticsLoading] = useState(true);
const [analyticsError, setAnalyticsError] = useState("");

const [serviceHealth, setServiceHealth] = useState([]);
const [healthLoading, setHealthLoading] = useState(true);
const [healthError, setHealthError] = useState("");

const [circuitBreaker, setCircuitBreaker] = useState(null);
const [circuitBreakerLoading, setCircuitBreakerLoading] = useState(true);
const [circuitBreakerError, setCircuitBreakerError] = useState("");


const loadAnalytics = async () => {
    try {
        setAnalyticsLoading(true);
        setAnalyticsError("");

        const data = await getAdminAnalytics();

        setAnalytics(data);
    } catch (error) {
        console.error(
            "Admin Analytics API Error:",
            error
        );

        setAnalyticsError(
            "Unable to load admin analytics."
        );
    } finally {
        setAnalyticsLoading(false);
    }
};

useEffect(() => {
    loadAnalytics();
    loadServiceHealth();
    loadCircuitBreaker();
}, []);

const loadServiceHealth = async () => {
    try {
        setHealthLoading(true);
        setHealthError("");

        const data = await getServiceHealth();

        setServiceHealth(data);
    } catch (error) {
        console.error(
            "Service Health API Error:",
            error
        );

        setHealthError(
            "Unable to load service health."
        );
    } finally {
        setHealthLoading(false);
    }
};

const loadCircuitBreaker = async () => {
    try {
        setCircuitBreakerLoading(true);
        setCircuitBreakerError("");

        const data = await getCircuitBreakerStatus();

        setCircuitBreaker(data);
    } catch (error) {
        console.error("Circuit Breaker API Error:", error);
        setCircuitBreakerError(
            "Unable to load circuit breaker status."
        );
    } finally {
        setCircuitBreakerLoading(false);
    }
};

const getCircuitBreakerColor = (state) => {
    const normalizedState = String(state || "").toUpperCase();

    if (normalizedState === "CLOSED") {
        return "#34d399";
    }

    if (normalizedState === "OPEN") {
        return "#f87171";
    }

    if (normalizedState === "HALF_OPEN") {
        return "#fbbf24";
    }

    return "#94a3b8";
};

const getCircuitBreakerLabel = (state) => {
    const normalizedState = String(state || "").toUpperCase();

    if (normalizedState === "HALF_OPEN") {
        return "HALF-OPEN";
    }

    return normalizedState || "UNKNOWN";
};

    return (
        <Box
            sx={{
                minHeight: "100vh",
                display: "flex",
                background:
                    "linear-gradient(135deg, #060b1a 0%, #0a1024 45%, #101936 100%)",
                color: "#fff",
            }}
        >

            {/* ================= SIDEBAR ================= */}

            <Box
                sx={{
                    width: 250,
                    minHeight: "100vh",
                    borderRight: "1px solid rgba(255,255,255,0.08)",
                    background:
                        "rgba(5, 10, 25, 0.92)",
                    display: "flex",
                    flexDirection: "column",
                    position: "sticky",
                    top: 0,
                }}
            >

                {/* Brand */}

                <Box
                    sx={{
                        px: 3,
                        py: 3,
                        display: "flex",
                        alignItems: "center",
                        gap: 1.5,
                    }}
                >

                    <Box
                        sx={{
                            width: 42,
                            height: 42,
                            borderRadius: "50%",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            background:
                                "linear-gradient(135deg, #315cff, #743cff)",
                            fontWeight: 800,
                            fontSize: 18,
                            boxShadow:
                                "0 0 25px rgba(65, 92, 255, 0.35)",
                        }}
                    >
                        S
                    </Box>

                    <Box>
                        <Typography
                            sx={{
                                fontWeight: 800,
                                fontSize: 18,
                                lineHeight: 1.1,
                            }}
                        >
                            SHDEP
                        </Typography>

                        <Typography
                            sx={{
                                color: "rgba(255,255,255,0.42)",
                                fontSize: 10,
                                letterSpacing: 1.5,
                                textTransform: "uppercase",
                            }}
                        >
                            Admin Dashboard
                        </Typography>
                    </Box>

                </Box>


                <Divider
                    sx={{
                        borderColor:
                            "rgba(255,255,255,0.07)",
                    }}
                />


                {/* Navigation */}

                <Box sx={{ px: 2, py: 2, flex: 1 }}>

                    <Typography
                        sx={{
                            px: 1.5,
                            mb: 1,
                            fontSize: 10,
                            letterSpacing: 1.5,
                            color: "rgba(255,255,255,0.35)",
                            fontWeight: 700,
                        }}
                    >
                        WORKSPACE
                    </Typography>


                   {menuItems.map((item) => {

    const Icon = item.icon;

    return (
        <Box
            key={item.label}
            component="button"
            type="button"
            onClick={() => {

                if (item.label === "Services") {
                    navigate("/admin/services");
                }

                if (item.label === "Users") {
                    navigate("/admin/users");
                }

                if (item.label === "Orders") {
                    navigate("/admin/orders");
                }

            }}
                                sx={{
                                    display: "flex",
                                    alignItems: "center",
                                    gap: 1.5,
                                    px: 1.5,
                                    py: 1.25,
                                    mb: 0.5,
                                    borderRadius: 2,
                                    cursor: "pointer",

                                    background: item.active
                                        ? "rgba(52, 92, 255, 0.18)"
                                        : "transparent",

                                    color: item.active
                                        ? "#76a7ff"
                                        : "rgba(255,255,255,0.5)",

                                    transition:
                                        "all 0.2s ease",

                                    "&:hover": {
                                        background:
                                            "rgba(255,255,255,0.06)",
                                        color: "#fff",
                                    },
                                }}
                            >

                                <Icon sx={{ fontSize: 20 }} />

                                <Typography
                                    sx={{
                                        fontSize: 13,
                                        fontWeight: item.active
                                            ? 700
                                            : 500,
                                    }}
                                >
                                    {item.label}
                                </Typography>

                            </Box>
                        );
                    })}

                </Box>


                {/* Footer */}

                <Box sx={{ p: 2 }}>

                    <Box
                        sx={{
                            p: 2,
                            borderRadius: 2.5,
                            border:
                                "1px solid rgba(255,255,255,0.07)",
                            background:
                                "rgba(255,255,255,0.025)",
                        }}
                    >

                        <Typography
                            sx={{
                                fontWeight: 700,
                                fontSize: 13,
                            }}
                        >
                            SHDEP
                        </Typography>

                        <Typography
                            sx={{
                                mt: 0.5,
                                fontSize: 10,
                                lineHeight: 1.5,
                                color:
                                    "rgba(255,255,255,0.4)",
                            }}
                        >
                            Self-Healing
                            <br />
                            Distributed Event Platform
                        </Typography>

                        <Typography
                            sx={{
                                mt: 1.5,
                                fontSize: 10,
                                color:
                                    "rgba(255,255,255,0.3)",
                            }}
                        >
                            v1.0.0
                        </Typography>

                    </Box>

                </Box>

            </Box>


            {/* ================= MAIN ================= */}

            <Box
                sx={{
                    flex: 1,
                    minWidth: 0,
                }}
            >

                {/* ================= TOP BAR ================= */}

                <Box
                    sx={{
                        height: 76,
                        px: {
                            xs: 2,
                            md: 4,
                        },
                        display: "flex",
                        alignItems: "center",
                        gap: 3,
                        borderBottom:
                            "1px solid rgba(255,255,255,0.07)",
                        background:
                            "rgba(5, 10, 25, 0.65)",
                        backdropFilter: "blur(18px)",
                    }}
                >

                    <Typography
                        sx={{
                            fontWeight: 700,
                            fontSize: 17,
                            minWidth: 160,
                        }}
                    >
                        Overview
                    </Typography>


                    {/* Search */}

                    <Box
                        sx={{
                            flex: 1,
                            maxWidth: 500,
                            display: {
                                xs: "none",
                                md: "flex",
                            },
                            alignItems: "center",
                            gap: 1,
                            px: 2,
                            py: 1,
                            borderRadius: 2,
                            border:
                                "1px solid rgba(255,255,255,0.08)",
                            background:
                                "rgba(255,255,255,0.035)",
                        }}
                    >

                        <SearchRounded
                            sx={{
                                color:
                                    "rgba(255,255,255,0.4)",
                                fontSize: 20,
                            }}
                        />

                        <Typography
                            sx={{
                                color:
                                    "rgba(255,255,255,0.35)",
                                fontSize: 13,
                            }}
                        >
                            Search services, orders, users...
                        </Typography>

                    </Box>


                    <Box sx={{ flex: 1 }} />


                    {/* System status */}

                    <Box
                        sx={{
                            display: {
                                xs: "none",
                                lg: "flex",
                            },
                            alignItems: "center",
                            gap: 1,
                        }}
                    >

                        <CircleRounded
                            sx={{
                                fontSize: 9,
                                color: "#35d98b",
                            }}
                        />

                        <Typography
                            sx={{
                                fontSize: 12,
                                color: "#7de5b0",
                                fontWeight: 600,
                            }}
                        >
                            All Systems Operational
                        </Typography>

                    </Box>


                    <IconButton
    onClick={() => {
    loadAnalytics();
    loadServiceHealth();
    loadCircuitBreaker();
}}
disabled={
    analyticsLoading ||
    healthLoading ||
    circuitBreakerLoading
}
    sx={{
        color: "rgba(255,255,255,0.65)",
        border:
            "1px solid rgba(255,255,255,0.08)",
        borderRadius: 2,
    }}
>
    <RefreshRounded />
</IconButton>


                    <Box
                        sx={{
                            display: "flex",
                            alignItems: "center",
                            gap: 1.2,
                        }}
                    >

                        <Avatar
                            sx={{
                                width: 38,
                                height: 38,
                                background:
                                    "linear-gradient(135deg, #315cff, #743cff)",
                                fontWeight: 700,
                            }}
                        >
                            {displayName
                                .charAt(0)
                                .toUpperCase()}
                        </Avatar>

                        <Box
                            sx={{
                                display: {
                                    xs: "none",
                                    sm: "block",
                                },
                            }}
                        >

                            <Typography
                                sx={{
                                    fontSize: 13,
                                    fontWeight: 700,
                                }}
                            >
                                {displayName}
                            </Typography>

                            <Typography
                                sx={{
                                    fontSize: 10,
                                    color:
                                        "rgba(255,255,255,0.4)",
                                }}
                            >
                                Administrator
                            </Typography>

                        </Box>

                    </Box>

                </Box>


                {/* ================= CONTENT ================= */}

                <Box
                    sx={{
                        p: {
                            xs: 2,
                            md: 4,
                        },
                        maxWidth: 1600,
                        mx: "auto",
                    }}
                >

                    {/* Heading */}

                    <Box sx={{ mb: 4 }}>

{analyticsError && (
    <Box
        sx={{
            mb: 3,
            px: 2,
            py: 1.5,
            borderRadius: 2,
            border:
                "1px solid rgba(239,68,68,0.25)",
            background:
                "rgba(239,68,68,0.08)",
        }}
    >
        <Typography
            sx={{
                color: "#fca5a5",
                fontSize: 13,
            }}
        >
            {analyticsError}
        </Typography>
    </Box>
)}
                        <Typography
                            sx={{
                                fontSize: {
                                    xs: 28,
                                    md: 36,
                                },
                                fontWeight: 800,
                                letterSpacing: -1,
                            }}
                        >
                            Welcome,
                                             
                            {" "}
                            <Box
                                component="span"
                                sx={{
                                    color: "#75a8ff",
                                }}
                            >
                                Admin
                            </Box>
                            !
                        </Typography>

                        <Typography
                            sx={{
                                mt: 1,
                                color:
                                    "rgba(255,255,255,0.48)",
                                fontSize: 14,
                            }}
                        >
                            Monitor and manage your SHDEP
                            microservices platform.
                        </Typography>

                    </Box>


                    {/* ================= KPI CARDS ================= */}

                    <Box
                        sx={{
                            display: "grid",
                            gridTemplateColumns: {
                                xs: "1fr",
                                sm: "repeat(2, 1fr)",
                                xl: "repeat(4, 1fr)",
                            },
                            gap: 2,
                            mb: 3,
                        }}
                    >

                        {statCards.map((card) => {

                            const Icon = card.icon;

                    

                            return (
                                <Box
                                    key={card.label}
                                    sx={{
                                        p: 2.5,
                                        minHeight: 145,
                                        borderRadius: 3,
                                        border:
                                            "1px solid rgba(255,255,255,0.08)",
                                        background:
                                            "linear-gradient(145deg, rgba(255,255,255,0.055), rgba(255,255,255,0.018))",
                                        boxShadow:
                                            "0 15px 45px rgba(0,0,0,0.18)",
                                    }}
                                >

                                    <Box
                                        sx={{
                                            display: "flex",
                                            justifyContent:
                                                "space-between",
                                            alignItems: "flex-start",
                                        }}
                                    >

                                        <Box
                                            sx={{
                                                width: 42,
                                                height: 42,
                                                borderRadius: 2,
                                                display: "flex",
                                                alignItems: "center",
                                                justifyContent:
                                                    "center",
                                                background:
                                                    "rgba(70,120,255,0.12)",
                                                color: "#6fa5ff",
                                            }}
                                        >
                                            <Icon />
                                        </Box>

                                    </Box>


                                    <Typography
                                        sx={{
                                            mt: 2,
                                            fontSize: 12,
                                            color:
                                                "rgba(255,255,255,0.45)",
                                        }}
                                    >
                                        {card.label}
                                    </Typography>

                                    <Typography
                                        sx={{
                                            mt: 0.5,
                                            fontSize: 28,
                                            fontWeight: 800,
                                        }}
                                    >
                                      {analyticsLoading
    ? "..."
    : analytics
        ? card.key === "totalPayments"
            ? `₹${Number(
                analytics[card.key] || 0
            ).toLocaleString("en-IN")}`
            : Number(
                analytics[card.key] || 0
            ).toLocaleString("en-IN")
        : "—"}
                                    </Typography>

                                </Box>
                            );
                        })}

                    </Box>


                    {/* ================= LOWER GRID ================= */}

                    <Box
                        sx={{
                            display: "grid",
                            gridTemplateColumns: {
                                xs: "1fr",
                                xl: "1.6fr 1fr",
                            },
                            gap: 2,
                        }}
                    >

                        {/* Service Health */}

                        <Box
                            sx={{
                                borderRadius: 3,
                                border:
                                    "1px solid rgba(255,255,255,0.08)",
                                background:
                                    "rgba(255,255,255,0.025)",
                                overflow: "hidden",
                            }}
                        >

                            <Box
                                sx={{
                                    px: 2.5,
                                    py: 2,
                                    display: "flex",
                                    justifyContent:
                                        "space-between",
                                    alignItems: "center",
                                    borderBottom:
                                        "1px solid rgba(255,255,255,0.06)",
                                }}
                            >

                                <Box>

                                    <Typography
                                        sx={{
                                            fontWeight: 700,
                                            fontSize: 16,
                                        }}
                                    >
                                        Service Health
                                    </Typography>

                                    <Typography
                                        sx={{
                                            mt: 0.3,
                                            fontSize: 11,
                                            color:
                                                "rgba(255,255,255,0.38)",
                                        }}
                                    >
                                        Live microservice status
                                    </Typography>

                                </Box>

                                <Button
                                    size="small"
                                    startIcon={
                                        <RefreshRounded />
                                    }
                                     onClick={loadServiceHealth}
                                     disabled={healthLoading}
                                    sx={{
                                        color: "#76a7ff",
                                        textTransform: "none",
                                    }}
                                >
                                    Refresh
                                </Button>

                            </Box>


                           {healthLoading ? (
    <Box
        sx={{
            px: 2.5,
            py: 3,
        }}
    >
        <Typography
            sx={{
                fontSize: 13,
                color: "rgba(255,255,255,0.45)",
            }}
        >
            Checking service health...
        </Typography>
    </Box>
) : healthError ? (
    <Box
        sx={{
            px: 2.5,
            py: 3,
        }}
    >
        <Typography
            sx={{
                fontSize: 13,
                color: "#fca5a5",
            }}
        >
            {healthError}
        </Typography>
    </Box>
) : (
    serviceHealth.map((service) => {

        const isUp =
            String(service.status || "")
                .toUpperCase() === "UP";

        return (
            <Box
                key={service.serviceName}
                sx={{
                    px: 2.5,
                    py: 1.7,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    borderBottom:
                        "1px solid rgba(255,255,255,0.04)",
                }}
            >

                <Box
                    sx={{
                        display: "flex",
                        alignItems: "center",
                        gap: 1.2,
                    }}
                >
                    <CircleRounded
                        sx={{
                            fontSize: 9,
                            color: isUp
                                ? "#35d98b"
                                : "#ef4444",
                        }}
                    />

                    <Typography
                        sx={{
                            fontSize: 13,
                        }}
                    >
                        {service.serviceName}
                    </Typography>
                </Box>

                <Box
                    sx={{
                        display: "flex",
                        alignItems: "center",
                        gap: 1.5,
                    }}
                >
                    <Typography
                        sx={{
                            fontSize: 11,
                            color: isUp
                                ? "#7de5b0"
                                : "#fca5a5",
                            fontWeight: 600,
                        }}
                    >
                        {service.status}
                    </Typography>

                    <Typography
                        sx={{
                            fontSize: 10,
                            color:
                                "rgba(255,255,255,0.3)",
                        }}
                    >
                        {service.responseTime} ms
                    </Typography>
                </Box>

            </Box>
        );
    })
)}
                        </Box>


                        {/* System Overview */}

                        <Box
                            sx={{
                                borderRadius: 3,
                                border:
                                    "1px solid rgba(255,255,255,0.08)",
                                background:
                                    "rgba(255,255,255,0.025)",
                                p: 2.5,
                            }}
                        >

                            <Typography
                                sx={{
                                    fontWeight: 700,
                                    fontSize: 16,
                                }}
                            >
                                System Overview
                            </Typography>

                            <Typography
                                sx={{
                                    mt: 0.5,
                                    fontSize: 11,
                                    color:
                                        "rgba(255,255,255,0.38)",
                                }}
                            >
                                SHDEP platform monitoring
                            </Typography>


                           <Box
    sx={{
        mt: 3,
        display: "flex",
        flexDirection: "column",
        gap: 1.5,
    }}
>
    {/* Service Monitoring */}

    <Box
        sx={{
            p: 1.6,
            borderRadius: 2,
            border:
                "1px solid rgba(255,255,255,0.06)",
            background:
                "rgba(255,255,255,0.025)",
        }}
    >
        <Typography
            sx={{
                fontSize: 12,
                color:
                    "rgba(255,255,255,0.55)",
            }}
        >
            Service monitoring
        </Typography>

        <Typography
            sx={{
                mt: 0.5,
                fontSize: 11,
                color:
                    "rgba(255,255,255,0.32)",
            }}
        >
            Live microservice health monitoring
        </Typography>
    </Box>

    {/* Circuit Breaker */}

    <Box
        sx={{
            p: 1.6,
            borderRadius: 2,
            border:
                "1px solid rgba(255,255,255,0.06)",
            background:
                "rgba(255,255,255,0.025)",
        }}
    >
        <Box
            sx={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
            }}
        >
            <Typography
                sx={{
                    fontSize: 12,
                    color:
                        "rgba(255,255,255,0.55)",
                }}
            >
                Circuit breaker status
            </Typography>

            <IconButton
                onClick={loadCircuitBreaker}
                disabled={circuitBreakerLoading}
                size="small"
                sx={{
                    color: "#76a7ff",
                }}
            >
                <RefreshRounded
                    sx={{ fontSize: 17 }}
                />
            </IconButton>
        </Box>

        {circuitBreakerLoading ? (
            <Typography
                sx={{
                    mt: 1,
                    fontSize: 13,
                    color:
                        "rgba(255,255,255,0.4)",
                }}
            >
                Loading...
            </Typography>
        ) : circuitBreakerError ? (
            <Typography
                sx={{
                    mt: 1,
                    fontSize: 13,
                    color: "#fca5a5",
                }}
            >
                {circuitBreakerError}
            </Typography>
        ) : (
            <Box
                sx={{
                    mt: 1,
                    display: "flex",
                    alignItems: "center",
                    gap: 1,
                }}
            >
                <CircleRounded
                    sx={{
                        fontSize: 9,
                        color:
                            getCircuitBreakerColor(
                                circuitBreaker?.state
                            ),
                    }}
                />

                <Typography
                    sx={{
                        fontSize: 16,
                        fontWeight: 700,
                        color: "#fff",
                    }}
                >
                    {getCircuitBreakerLabel(
                        circuitBreaker?.state
                    )}
                </Typography>

                <Typography
                    sx={{
                        ml: 0.5,
                        fontSize: 11,
                        color:
                            "rgba(255,255,255,0.35)",
                    }}
                >
                    {circuitBreaker?.name ||
                        "dashboardService"}
                </Typography>
            </Box>
        )}
    </Box>

    {/* Kafka */}

    <Box
        sx={{
            p: 1.6,
            borderRadius: 2,
            border:
                "1px solid rgba(255,255,255,0.06)",
            background:
                "rgba(255,255,255,0.025)",
        }}
    >
        <Typography
            sx={{
                fontSize: 12,
                color:
                    "rgba(255,255,255,0.55)",
            }}
        >
            Kafka event processing
        </Typography>

        <Typography
            sx={{
                mt: 0.5,
                fontSize: 11,
                color:
                    "rgba(255,255,255,0.32)",
            }}
        >
            Coming in next dashboard integration
        </Typography>
    </Box>

    {/* Self Healing */}

    <Box
        sx={{
            p: 1.6,
            borderRadius: 2,
            border:
                "1px solid rgba(255,255,255,0.06)",
            background:
                "rgba(255,255,255,0.025)",
        }}
    >
        <Typography
            sx={{
                fontSize: 12,
                color:
                    "rgba(255,255,255,0.55)",
            }}
        >
            Self-healing activity
        </Typography>

        <Typography
            sx={{
                mt: 0.5,
                fontSize: 11,
                color:
                    "rgba(255,255,255,0.32)",
            }}
        >
            Coming in next dashboard integration
        </Typography>
    </Box>
</Box>

                        </Box>

                    </Box>

                </Box>

            </Box>

        </Box>
    );
}