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
    RefreshRounded,
    CircleRounded,
} from "@mui/icons-material";

import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import {
    getServiceHealth,
    getServiceRuntime,
    getCircuitBreakerStatus,
    getRetryStatus,
} from "../../services/adminDashboardService";

const menuItems = [
    {
        label: "Overview",
        icon: DashboardRounded,
        path: "/admin",
    },
    {
        label: "Services",
        icon: DnsRounded,
        path: "/admin/services",
        active: true,
    },
    {
        label: "Users",
        path:"/admin/users",
        icon: PeopleRounded,
    },
    {
        label: "Orders",
        path:"/admin/orders",
        icon: ShoppingCartRounded,
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


export default function AdminServices() {

    const navigate = useNavigate();

    const { username } = useAuth();

    const displayName = username || "Admin";


    const [serviceHealth, setServiceHealth] = useState([]);

    const [loading, setLoading] = useState(true);

    const [error, setError] = useState("");
    const [expandedService, setExpandedService] = useState(null);
    const [serviceRuntime, setServiceRuntime] = useState([]);
const [runtimeLoading, setRuntimeLoading] = useState(false);
const [circuitBreaker, setCircuitBreaker] = useState(null);
const [retryStatus, setRetryStatus] = useState(null);
const [resilienceLoading, setResilienceLoading] = useState(false);


    const loadServices = async () => {

        try {

            setLoading(true);

            setError("");

            const data = await getServiceHealth();

            setServiceHealth(data || []);

        } catch (error) {

            console.error(
                "Admin Services API Error:",
                error
            );

            setError(
                "Unable to load service health."
            );

        } finally {

            setLoading(false);

        }

    };

    const loadRuntime = async () => {

    try {

        setRuntimeLoading(true);

        const data = await getServiceRuntime();

        setServiceRuntime(data || []);

    } catch (error) {

        console.error(
            "Service Runtime API Error:",
            error
        );

    } finally {

        setRuntimeLoading(false);

    }
};

const loadResilience = async () => {

    try {

        setResilienceLoading(true);

        const [circuitBreakerData, retryData] =
            await Promise.all([
                getCircuitBreakerStatus(),
                getRetryStatus(),
            ]);

        setCircuitBreaker(circuitBreakerData);
        setRetryStatus(retryData);

    } catch (error) {

        console.error(
            "Resilience Monitoring API Error:",
            error
        );

    } finally {

        setResilienceLoading(false);

    }
};


    useEffect(() => {

        loadServices();

        loadRuntime();

        loadResilience();

    }, []);


    const getStatusColor = (status) => {

        const normalized =
            String(status || "").toUpperCase();

        if (normalized === "UP") {
            return "#35d98b";
        }

        return "#ef4444";
    };


    const getStatusBackground = (status) => {

        const normalized =
            String(status || "").toUpperCase();

        if (normalized === "UP") {
            return "rgba(53,217,139,0.08)";
        }

        return "rgba(239,68,68,0.08)";
    };

    const handleServiceClick = (serviceName) => {
    setExpandedService((current) =>
        current === serviceName
            ? null
            : serviceName
    );
};


const formatUptime = (seconds) => {

    if (!seconds) {
        return "—";
    }

    const totalSeconds = Math.floor(seconds);

    const hours = Math.floor(totalSeconds / 3600);

    const minutes = Math.floor(
        (totalSeconds % 3600) / 60
    );

    const secs = totalSeconds % 60;

    if (hours > 0) {
        return `${hours}h ${minutes}m`;
    }

    if (minutes > 0) {
        return `${minutes}m ${secs}s`;
    }

    return `${secs}s`;
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
                    borderRight:
                        "1px solid rgba(255,255,255,0.08)",
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
                                color:
                                    "rgba(255,255,255,0.42)",
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

                <Box
                    sx={{
                        px: 2,
                        py: 2,
                        flex: 1,
                    }}
                >

                    <Typography
                        sx={{
                            px: 1.5,
                            mb: 1,
                            fontSize: 10,
                            letterSpacing: 1.5,
                            color:
                                "rgba(255,255,255,0.35)",
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

                                    if (item.path) {
                                        navigate(item.path);
                                    }

                                }}
                                disabled={!item.path}
                                sx={{
                                    width: "100%",
                                    border: "none",
                                    textAlign: "left",
                                    display: "flex",
                                    alignItems: "center",
                                    gap: 1.5,
                                    px: 1.5,
                                    py: 1.25,
                                    mb: 0.5,
                                    borderRadius: 2,
                                    cursor:
                                        item.path
                                            ? "pointer"
                                            : "default",

                                    background:
                                        item.active
                                            ? "rgba(52, 92, 255, 0.18)"
                                            : "transparent",

                                    color:
                                        item.active
                                            ? "#76a7ff"
                                            : "rgba(255,255,255,0.5)",

                                    opacity:
                                        item.path
                                            ? 1
                                            : 0.55,

                                    transition:
                                        "all 0.2s ease",

                                    "&:hover":
                                        item.path
                                            ? {
                                                  background:
                                                      "rgba(255,255,255,0.06)",
                                                  color: "#fff",
                                              }
                                            : {},
                                }}
                            >

                                <Icon
                                    sx={{
                                        fontSize: 20,
                                    }}
                                />

                                <Typography
                                    sx={{
                                        fontSize: 13,
                                        fontWeight:
                                            item.active
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
                        }}
                    >
                        Services
                    </Typography>


                    <Box sx={{ flex: 1 }} />


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

                    {/* Header */}

                    <Box
                        sx={{
                            mb: 4,
                            display: "flex",
                            justifyContent:
                                "space-between",
                            alignItems: {
                                xs: "flex-start",
                                sm: "center",
                            },
                            gap: 2,
                        }}
                    >

                        <Box>

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
                                Service Health
                            </Typography>

                            <Typography
                                sx={{
                                    mt: 1,
                                    color:
                                        "rgba(255,255,255,0.48)",
                                    fontSize: 14,
                                }}
                            >
                                Monitor the health and response
                                time of every SHDEP microservice.
                            </Typography>

                        </Box>


                        <Button
                            size="small"
                            startIcon={
                                <RefreshRounded />
                            }
                           onClick={() => {
    loadServices();
    loadRuntime();
    loadResilience();
}}
disabled={
    loading ||
    runtimeLoading ||
    resilienceLoading
}
                            sx={{
                                color: "#76a7ff",
                                textTransform: "none",
                                border:
                                    "1px solid rgba(255,255,255,0.08)",
                                borderRadius: 2,
                                px: 2,
                            }}
                        >
                            Refresh
                        </Button>

                    </Box>


                    {/* Error */}

                    {error && (
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
                                {error}
                            </Typography>

                        </Box>
                    )}


                    {/* Services */}

                    <Box
                        sx={{
                            display: "grid",
                            gridTemplateColumns: {
                                xs: "1fr",
                                md: "repeat(2, 1fr)",
                                xl: "repeat(3, 1fr)",
                            },
                            gap: 2,
                        }}
                    >

                        {loading ? (

                            Array.from({ length: 7 }).map(
                                (_, index) => (

                                    <Box
                                        key={index}
                                        sx={{
                                            minHeight: 190,
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
                                                color:
                                                    "rgba(255,255,255,0.3)",
                                                fontSize: 13,
                                            }}
                                        >
                                            Checking service...
                                        </Typography>

                                    </Box>

                                )
                            )

                        ) : (

                            serviceHealth.map(
                                (service) => {

                                    const isUp =
                                        String(
                                            service.status || ""
                                        ).toUpperCase() === "UP";

                                        const runtime = serviceRuntime.find(
    (item) =>
        item.serviceName === service.serviceName
);

                                        const isExpanded =
    expandedService === service.serviceName;

                                    const statusColor =
                                        getStatusColor(
                                            service.status
                                        );

                                    return (

                                        <Box
                                            key={
                                                service.serviceName
                                            }
                                            onClick={() =>
        handleServiceClick(service.serviceName)
    }
                                            sx={{
                                                minHeight: 190,
                                                borderRadius: 3,
                                                border:
                                                    "1px solid rgba(255,255,255,0.08)",
                                                background:
                                                    "linear-gradient(145deg, rgba(255,255,255,0.055), rgba(255,255,255,0.018))",
                                                p: 2.5,
                                                transition:
                                                    "all 0.2s ease",

                                                "&:hover": {
                                                    transform:
                                                        "translateY(-2px)",
                                                    borderColor:
                                                        "rgba(118,167,255,0.22)",
                                                },
                                            }}
                                        >

                                            {/* Top */}

                                            <Box
                                                sx={{
                                                    display: "flex",
                                                    justifyContent:
                                                        "space-between",
                                                    alignItems:
                                                        "flex-start",
                                                }}
                                            >

                                                <Box
                                                    sx={{
                                                        width: 44,
                                                        height: 44,
                                                        borderRadius: 2,
                                                        display:
                                                            "flex",
                                                        alignItems:
                                                            "center",
                                                        justifyContent:
                                                            "center",
                                                        background:
                                                            "rgba(70,120,255,0.12)",
                                                    }}
                                                >

                                                    <DnsRounded
                                                        sx={{
                                                            color:
                                                                "#76a7ff",
                                                        }}
                                                    />

                                                </Box>


                                                <Box
                                                    sx={{
                                                        display:
                                                            "flex",
                                                        alignItems:
                                                            "center",
                                                        gap: 0.8,
                                                        px: 1,
                                                        py: 0.5,
                                                        borderRadius:
                                                            5,
                                                        background:
                                                            getStatusBackground(
                                                                service.status
                                                            ),
                                                    }}
                                                >

                                                    <CircleRounded
                                                        sx={{
                                                            fontSize: 8,
                                                            color:
                                                                statusColor,
                                                        }}
                                                    />

                                                    <Typography
                                                        sx={{
                                                            fontSize: 10,
                                                            fontWeight: 700,
                                                            color:
                                                                statusColor,
                                                        }}
                                                    >
                                                        {isUp
                                                            ? "UP"
                                                            : "DOWN"}
                                                    </Typography>

                                                </Box>

                                            </Box>


                                            {/* Name */}

                                            <Typography
                                                sx={{
                                                    mt: 2.5,
                                                    fontSize: 17,
                                                    fontWeight: 700,
                                                }}
                                            >
                                                {
                                                    service.serviceName
                                                }
                                            </Typography>


                                            {/* Response Time */}

                                            <Box
                                                sx={{
                                                    mt: 2,
                                                    display:
                                                        "flex",
                                                    justifyContent:
                                                        "space-between",
                                                    alignItems:
                                                        "center",
                                                }}
                                            >

                                                <Typography
                                                    sx={{
                                                        fontSize: 11,
                                                        color:
                                                            "rgba(255,255,255,0.38)",
                                                    }}
                                                >
                                                    Response time
                                                </Typography>

                                                <Typography
                                                    sx={{
                                                        fontSize: 13,
                                                        fontWeight: 700,
                                                        color:
                                                            isUp
                                                                ? "#7de5b0"
                                                                : "#fca5a5",
                                                    }}
                                                >
                                                    {
                                                        service.responseTime
                                                    }{" "}
                                                    ms
                                                </Typography>

                                            </Box>


                                            {/* Checked */}

                                            <Box
                                                sx={{
                                                    mt: 1.5,
                                                    pt: 1.5,
                                                    borderTop:
                                                        "1px solid rgba(255,255,255,0.05)",
                                                }}
                                            >

                                                <Typography
                                                    sx={{
                                                        fontSize: 10,
                                                        color:
                                                            "rgba(255,255,255,0.28)",
                                                    }}
                                                >
                                                    Last checked
                                                </Typography>

                                                <Typography
                                                    sx={{
                                                        mt: 0.3,
                                                        fontSize: 11,
                                                        color:
                                                            "rgba(255,255,255,0.45)",
                                                    }}
                                                >
                                                    {
                                                        service.checkedAt
                                                            ? new Date(
                                                                  service.checkedAt
                                                              ).toLocaleString()
                                                            : "—"
                                                    }
                                                </Typography>


                                            </Box>
                                            {isExpanded && (
                                                <Box
                                                    sx={{
                                                        mt: 2,
                                                        pt: 2,
                                                        borderTop:
                                                            "1px solid rgba(255,255,255,0.07)",
                                                    }}
                                                >
                                                    <Typography
                                                        sx={{
                                                            fontSize: 12,
                                                            fontWeight: 700,
                                                            color: "#76a7ff",
                                                            mb: 1.5,
                                                        }}
                                                    >
                                                        Health Details
                                                    </Typography>

                                                    <Box
                                                        sx={{
                                                            display: "grid",
                                                            gridTemplateColumns: {
                                                                xs: "1fr",
                                                                sm: "repeat(2, 1fr)",
                                                            },
                                                            gap: 1.2,
                                                        }}
                                                    >
                                                        <Box
                                                            sx={{
                                                                p: 1.3,
                                                                borderRadius: 2,
                                                                background:
                                                                    "rgba(255,255,255,0.035)",
                                                            }}
                                                        >
                                                            <Typography
                                                                sx={{
                                                                    fontSize: 10,
                                                                    color:
                                                                        "rgba(255,255,255,0.35)",
                                                                }}
                                                            >
                                                                Status
                                                            </Typography>

                                                            <Typography
                                                                sx={{
                                                                    mt: 0.4,
                                                                    fontSize: 12,
                                                                    fontWeight: 700,
                                                                    color: statusColor,
                                                                }}
                                                            >
                                                                {isUp ? "UP" : "DOWN"}
                                                            </Typography>
                                                        </Box>

                                                        <Box
                                                            sx={{
                                                                p: 1.3,
                                                                borderRadius: 2,
                                                                background:
                                                                    "rgba(255,255,255,0.035)",
                                                            }}
                                                        >
                                                            <Typography
                                                                sx={{
                                                                    fontSize: 10,
                                                                    color:
                                                                        "rgba(255,255,255,0.35)",
                                                                }}
                                                            >
                                                                Response Time
                                                            </Typography>

                                                            <Typography
                                                                sx={{
                                                                    mt: 0.4,
                                                                    fontSize: 12,
                                                                    fontWeight: 700,
                                                                }}
                                                            >
                                                                {service.responseTime ?? 0} ms
                                                            </Typography>
                                                        </Box>

                                                        <Box
                                                            sx={{
                                                                p: 1.3,
                                                                borderRadius: 2,
                                                                background:
                                                                    "rgba(255,255,255,0.035)",
                                                                gridColumn: {
                                                                    sm: "1 / -1",
                                                                },
                                                            }}
                                                        >
                                                            <Typography
                                                                sx={{
                                                                    fontSize: 10,
                                                                    color:
                                                                        "rgba(255,255,255,0.35)",
                                                                }}
                                                            >
                                                                Last Health Check
                                                            </Typography>

                                                            <Typography
                                                                sx={{
                                                                    mt: 0.4,
                                                                    fontSize: 12,
                                                                    color:
                                                                        "rgba(255,255,255,0.65)",
                                                                }}
                                                            >
                                                                {service.checkedAt
                                                                    ? new Date(
                                                                          service.checkedAt
                                                                      ).toLocaleString()
                                                                    : "—"}
                                                            </Typography>
                                                        </Box>
                                                    </Box>
                                                      <Box
                                                sx={{
                                                    mt: 2,
                                                    pt: 2,
                                                    borderTop:
                                                        "1px solid rgba(255,255,255,0.07)",
                                                }}
                                            >
                                                <Typography
                                                    sx={{
                                                        fontSize: 12,
                                                        fontWeight: 700,
                                                        color: "#76a7ff",
                                                        mb: 1.5,
                                                    }}
                                                >
                                                    Runtime
                                                </Typography>

                                                <Box
                                                    sx={{
                                                        display: "grid",
                                                        gridTemplateColumns: {
                                                            xs: "1fr",
                                                            sm: "repeat(2, 1fr)",
                                                        },
                                                        gap: 1.2,
                                                    }}
                                                >

                                                    <Box
                                                        sx={{
                                                            p: 1.3,
                                                            borderRadius: 2,
                                                            background:
                                                                "rgba(255,255,255,0.035)",
                                                        }}
                                                    >
                                                        <Typography
                                                            sx={{
                                                                fontSize: 10,
                                                                color:
                                                                    "rgba(255,255,255,0.35)",
                                                            }}
                                                        >
                                                            CPU Usage
                                                        </Typography>

                                                        <Typography
                                                            sx={{
                                                                mt: 0.4,
                                                                fontSize: 12,
                                                                fontWeight: 700,
                                                            }}
                                                        >
                                                            {runtime
                                                                ? `${runtime.cpuUsage.toFixed(1)}%`
                                                                : "—"}
                                                        </Typography>
                                                    </Box>


                                                    <Box
                                                        sx={{
                                                            p: 1.3,
                                                            borderRadius: 2,
                                                            background:
                                                                "rgba(255,255,255,0.035)",
                                                        }}
                                                    >
                                                        <Typography
                                                            sx={{
                                                                fontSize: 10,
                                                                color:
                                                                    "rgba(255,255,255,0.35)",
                                                            }}
                                                        >
                                                            Threads
                                                        </Typography>

                                                        <Typography
                                                            sx={{
                                                                mt: 0.4,
                                                                fontSize: 12,
                                                                fontWeight: 700,
                                                            }}
                                                        >
                                                            {runtime
                                                                ? runtime.threads
                                                                : "—"}
                                                        </Typography>
                                                    </Box>


                                                    <Box
                                                        sx={{
                                                            p: 1.3,
                                                            borderRadius: 2,
                                                            background:
                                                                "rgba(255,255,255,0.035)",
                                                        }}
                                                    >
                                                        <Typography
                                                            sx={{
                                                                fontSize: 10,
                                                                color:
                                                                    "rgba(255,255,255,0.35)",
                                                            }}
                                                        >
                                                            Memory
                                                        </Typography>

                                                        <Typography
                                                            sx={{
                                                                mt: 0.4,
                                                                fontSize: 12,
                                                                fontWeight: 700,
                                                            }}
                                                        >
                                                            {runtime
                                                                ? `${(
                                                                      runtime.memoryUsed /
                                                                      1024 /
                                                                      1024
                                                                  ).toFixed(0)} MB`
                                                                : "—"}
                                                        </Typography>
                                                    </Box>


                                                    <Box
                                                        sx={{
                                                            p: 1.3,
                                                            borderRadius: 2,
                                                            background:
                                                                "rgba(255,255,255,0.035)",
                                                        }}
                                                    >
                                                        <Typography
                                                            sx={{
                                                                fontSize: 10,
                                                                color:
                                                                    "rgba(255,255,255,0.35)",
                                                            }}
                                                        >
                                                            Uptime
                                                        </Typography>

                                                        <Typography
                                                            sx={{
                                                                mt: 0.4,
                                                                fontSize: 12,
                                                                fontWeight: 700,
                                                            }}
                                                        >
                                                            {runtime
                                                                ? formatUptime(
                                                                      runtime.uptimeSeconds
                                                                  )
                                                                : "—"}
                                                        </Typography>
                                                    </Box>
                                                                                                        <Box
                                                        sx={{
                                                            mt: 2,
                                                            pt: 2,
                                                            borderTop:
                                                                "1px solid rgba(255,255,255,0.07)",
                                                        }}
                                                    >
                                                        <Typography
                                                            sx={{
                                                                fontSize: 12,
                                                                fontWeight: 700,
                                                                color: "#76a7ff",
                                                                mb: 1.5,
                                                            }}
                                                        >
                                                            Resilience
                                                        </Typography>

                                                        <Box
                                                            sx={{
                                                                display: "grid",
                                                                gridTemplateColumns: {
                                                                    xs: "1fr",
                                                                    sm: "repeat(2, 1fr)",
                                                                },
                                                                gap: 1.2,
                                                            }}
                                                        >

                                                            {/* Circuit Breaker */}

                                                            <Box
                                                                sx={{
                                                                    p: 1.3,
                                                                    borderRadius: 2,
                                                                    background:
                                                                        "rgba(255,255,255,0.035)",
                                                                }}
                                                            >
                                                                <Typography
                                                                    sx={{
                                                                        fontSize: 10,
                                                                        color:
                                                                            "rgba(255,255,255,0.35)",
                                                                    }}
                                                                >
                                                                    Circuit Breaker
                                                                </Typography>

                                                                <Typography
                                                                    sx={{
                                                                        mt: 0.4,
                                                                        fontSize: 12,
                                                                        fontWeight: 700,
                                                                        color:
                                                                            circuitBreaker?.state ===
                                                                            "CLOSED"
                                                                                ? "#35d98b"
                                                                                : circuitBreaker?.state ===
                                                                                  "OPEN"
                                                                                ? "#ef4444"
                                                                                : "#fbbf24",
                                                                    }}
                                                                >
                                                                    {resilienceLoading
                                                                        ? "Loading..."
                                                                        : circuitBreaker?.state ||
                                                                          "—"}
                                                                </Typography>
                                                            </Box>


                                                            {/* Retry Attempts */}

                                                            <Box
                                                                sx={{
                                                                    p: 1.3,
                                                                    borderRadius: 2,
                                                                    background:
                                                                        "rgba(255,255,255,0.035)",
                                                                }}
                                                            >
                                                                <Typography
                                                                    sx={{
                                                                        fontSize: 10,
                                                                        color:
                                                                            "rgba(255,255,255,0.35)",
                                                                    }}
                                                                >
                                                                    Retry Attempts
                                                                </Typography>

                                                                <Typography
                                                                    sx={{
                                                                        mt: 0.4,
                                                                        fontSize: 12,
                                                                        fontWeight: 700,
                                                                    }}
                                                                >
                                                                    {resilienceLoading
                                                                        ? "Loading..."
                                                                        : retryStatus?.totalRetries ?? 0}
                                                                </Typography>
                                                            </Box>


                                                            {/* Retry Success */}

                                                            <Box
                                                                sx={{
                                                                    p: 1.3,
                                                                    borderRadius: 2,
                                                                    background:
                                                                        "rgba(255,255,255,0.035)",
                                                                }}
                                                            >
                                                                <Typography
                                                                    sx={{
                                                                        fontSize: 10,
                                                                        color:
                                                                            "rgba(255,255,255,0.35)",
                                                                    }}
                                                                >
                                                                    Retry Success
                                                                </Typography>

                                                                <Typography
                                                                    sx={{
                                                                        mt: 0.4,
                                                                        fontSize: 12,
                                                                        fontWeight: 700,
                                                                        color: "#35d98b",
                                                                    }}
                                                                >
                                                                    {resilienceLoading
                                                                        ? "Loading..."
                                                                        : retryStatus?.successfulRetries ?? 0}
                                                                </Typography>
                                                            </Box>


                                                            {/* Retry Failures */}

                                                            <Box
                                                                sx={{
                                                                    p: 1.3,
                                                                    borderRadius: 2,
                                                                    background:
                                                                        "rgba(255,255,255,0.035)",
                                                                }}
                                                            >
                                                                <Typography
                                                                    sx={{
                                                                        fontSize: 10,
                                                                        color:
                                                                            "rgba(255,255,255,0.35)",
                                                                    }}
                                                                >
                                                                    Retry Failures
                                                                </Typography>

                                                                <Typography
                                                                    sx={{
                                                                        mt: 0.4,
                                                                        fontSize: 12,
                                                                        fontWeight: 700,
                                                                        color: "#ef4444",
                                                                    }}
                                                                >
                                                                    {resilienceLoading
                                                                        ? "Loading..."
                                                                        : retryStatus?.failedRetries ?? 0}
                                                                </Typography>
                                                            </Box>

                                                        </Box>
                                                    </Box>

                                                </Box>
                                            </Box>

                                                </Box>
                                            )}
                                            
                                                                                      
                                        </Box>
                                        

                                    );

                                }
                            )

                        )}

                        

                    </Box>

                </Box>

            </Box>

        </Box>
    );
}