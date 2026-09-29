import React, {
    useCallback,
    useEffect,
    useMemo,
    useState,
} from "react";

import {
    Alert,
    Box,
    Button,
    CircularProgress,
    Paper,
    Stack,
    Typography,
} from "@mui/material";

import {
    ArrowBackRounded,
    MemoryRounded,
    SpeedRounded,
    StorageRounded,
    RefreshRounded,
    DeveloperBoardRounded,
    AccessTimeRounded,
    DataUsageRounded,
} from "@mui/icons-material";

import { useNavigate } from "react-router-dom";

import {
    getSystemMetrics,
} from "../../services/adminSystemMetricsService";


const formatBytes = (bytes) => {

    if (
        bytes === null ||
        bytes === undefined ||
        Number.isNaN(Number(bytes))
    ) {
        return "0 MB";
    }

    const value = Number(bytes);

    if (value < 1024) {
        return `${value} B`;
    }

    if (value < 1024 * 1024) {
        return `${(
            value / 1024
        ).toFixed(1)} KB`;
    }

    if (value < 1024 * 1024 * 1024) {
        return `${(
            value /
            (1024 * 1024)
        ).toFixed(1)} MB`;
    }

    return `${(
        value /
        (1024 * 1024 * 1024)
    ).toFixed(2)} GB`;
};


const getUsageColor = (value) => {

    const usage =
        Number(value || 0);

    if (usage >= 85) {
        return "#ef4444";
    }

    if (usage >= 70) {
        return "#fbbf24";
    }

    return "#35d98b";
};


const getUsageLabel = (value) => {

    const usage =
        Number(value || 0);

    if (usage >= 85) {
        return "High";
    }

    if (usage >= 70) {
        return "Moderate";
    }

    return "Normal";
};


function MetricCard({
    title,
    value,
    subtitle,
    icon: Icon,
    iconColor,
}) {

    return (
        <Paper
            sx={{
                p: 2.5,

                background:
                    "rgba(255,255,255,.035)",

                border:
                    "1px solid rgba(255,255,255,.07)",

                borderRadius: 3,

                height: "100%",
            }}
        >

            <Stack
                direction="row"
                justifyContent="space-between"
                alignItems="flex-start"
            >

                <Box>

                    <Typography
                        sx={{
                            color:
                                "rgba(255,255,255,.45)",

                            fontSize: 11,

                            fontWeight: 600,

                            textTransform:
                                "uppercase",

                            letterSpacing:
                                ".04em",
                        }}
                    >
                        {title}
                    </Typography>


                    <Typography
                        sx={{
                            mt: 1,

                            fontSize: {
                                xs: 24,
                                md: 30,
                            },

                            fontWeight: 800,

                            color: "#fff",
                        }}
                    >
                        {value}
                    </Typography>


                    <Typography
                        sx={{
                            mt: .5,

                            color:
                                "rgba(255,255,255,.4)",

                            fontSize: 11,
                        }}
                    >
                        {subtitle}
                    </Typography>

                </Box>


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
                            `${iconColor}18`,

                        border:
                            `1px solid ${iconColor}35`,
                    }}
                >

                    <Icon
                        sx={{
                            color: iconColor,

                            fontSize: 22,
                        }}
                    />

                </Box>

            </Stack>

        </Paper>
    );
}


function UsageBar({
    label,
    value,
    color,
}) {

    const safeValue =
        Math.min(
            100,
            Math.max(
                0,
                Number(value || 0)
            )
        );

    return (
        <Box>

            <Stack
                direction="row"
                justifyContent="space-between"
                sx={{
                    mb: .7,
                }}
            >

                <Typography
                    sx={{
                        fontSize: 11,

                        color:
                            "rgba(255,255,255,.5)",
                    }}
                >
                    {label}
                </Typography>


                <Typography
                    sx={{
                        fontSize: 11,

                        color: color,

                        fontWeight: 700,
                    }}
                >
                    {safeValue.toFixed(2)}%
                </Typography>

            </Stack>


            <Box
                sx={{
                    width: "100%",

                    height: 7,

                    borderRadius: 10,

                    background:
                        "rgba(255,255,255,.08)",

                    overflow: "hidden",
                }}
            >

                <Box
                    sx={{
                        width: `${safeValue}%`,

                        height: "100%",

                        borderRadius: 10,

                        background: color,

                        transition:
                            "width .4s ease",
                    }}
                />

            </Box>

        </Box>
    );
}


export default function AdminSystemMetrics() {

    const navigate =
        useNavigate();


    const [metrics, setMetrics] =
        useState(null);

    const [loading, setLoading] =
        useState(true);

    const [refreshing, setRefreshing] =
        useState(false);

    const [error, setError] =
        useState("");


    const loadMetrics =
        useCallback(
            async (isRefresh = false) => {

                try {

                    if (isRefresh) {
                        setRefreshing(true);
                    } else {
                        setLoading(true);
                    }

                    setError("");

                    const data =
                        await getSystemMetrics();

                    setMetrics(data);

                } catch (err) {

                    console.error(
                        "System Metrics API Error:",
                        err
                    );

                    setError(
                        err?.response?.data?.message ||
                        "Unable to load system metrics."
                    );

                } finally {

                    setLoading(false);
                    setRefreshing(false);
                }
            },
            []
        );


    useEffect(() => {

        loadMetrics();

    }, [loadMetrics]);


    const cpuColor =
        useMemo(
            () =>
                getUsageColor(
                    metrics?.cpuUsage
                ),
            [metrics]
        );


    const memoryColor =
        useMemo(
            () =>
                getUsageColor(
                    metrics?.memoryUsage
                ),
            [metrics]
        );


    const heapPercentage =
        useMemo(() => {

            if (
                !metrics ||
                !metrics.heapMax ||
                metrics.heapMax <= 0
            ) {
                return 0;
            }

            return Math.min(
                100,
                (
                    metrics.heapUsed /
                    metrics.heapMax
                ) * 100
            );

        }, [metrics]);


    return (
        <Box
            sx={{
                minHeight: "100vh",

                background:
                    "linear-gradient(135deg, #060b1a 0%, #0a1024 45%, #101936 100%)",

                color: "#fff",

                p: {
                    xs: 2,
                    md: 3,
                },
            }}
        >

            {/* =========================================
                HEADER
            ========================================= */}

            <Box
                sx={{
                    display: "flex",

                    justifyContent:
                        "space-between",

                    alignItems: {
                        xs: "flex-start",
                        md: "center",
                    },

                    flexDirection: {
                        xs: "column",
                        md: "row",
                    },

                    gap: 2,

                    mb: 3,
                }}
            >

                <Box>

                    <Button
                        startIcon={
                            <ArrowBackRounded />
                        }
                        onClick={() =>
                            navigate("/admin")
                        }
                        sx={{
                            color:
                                "rgba(255,255,255,.55)",

                            mb: 1,

                            textTransform:
                                "none",
                        }}
                    >
                        Back to Admin
                    </Button>


                    <Stack
                        direction="row"
                        spacing={1.5}
                        alignItems="center"
                    >

                        <Box
                            sx={{
                                width: 44,
                                height: 44,

                                borderRadius: 2.5,

                                display: "flex",

                                alignItems:
                                    "center",

                                justifyContent:
                                    "center",

                                background:
                                    "rgba(139,92,246,.10)",

                                border:
                                    "1px solid rgba(139,92,246,.20)",
                            }}
                        >

                            <QueryStatsIcon />

                        </Box>


                        <Box>

                            <Typography
                                sx={{
                                    fontSize: {
                                        xs: 22,
                                        md: 26,
                                    },

                                    fontWeight: 800,
                                }}
                            >
                                System Metrics
                            </Typography>


                            <Typography
                                sx={{
                                    mt: .4,

                                    color:
                                        "rgba(255,255,255,.45)",

                                    fontSize: 12,
                                }}
                            >
                                Live runtime metrics from the Dashboard Service
                            </Typography>

                        </Box>

                    </Stack>

                </Box>


                <Button
                    variant="outlined"

                    startIcon={
                        refreshing
                            ? (
                                <CircularProgress
                                    size={16}
                                />
                            )
                            : (
                                <RefreshRounded />
                            )
                    }

                    onClick={() =>
                        loadMetrics(true)
                    }

                    disabled={
                        loading ||
                        refreshing
                    }

                    sx={{
                        color: "#fff",

                        borderColor:
                            "rgba(255,255,255,.15)",

                        textTransform:
                            "none",
                    }}
                >
                    Refresh
                </Button>

            </Box>


            {/* =========================================
                ERROR
            ========================================= */}

            {error && (

                <Alert
                    severity="error"
                    sx={{
                        mb: 2,
                    }}
                >
                    {error}
                </Alert>

            )}


            {/* =========================================
                LOADING
            ========================================= */}

            {loading && !metrics ? (

                <Paper
                    sx={{
                        p: 8,

                        textAlign: "center",

                        background:
                            "rgba(255,255,255,.035)",

                        border:
                            "1px solid rgba(255,255,255,.07)",
                    }}
                >

                    <CircularProgress />

                    <Typography
                        sx={{
                            mt: 2,

                            color:
                                "rgba(255,255,255,.45)",

                            fontSize: 12,
                        }}
                    >
                        Loading system metrics...
                    </Typography>

                </Paper>

            ) : (

                <>
                    {/* =================================
                        TOP METRICS
                    ================================= */}

                    <Box
                        sx={{
                            display: "grid",

                            gridTemplateColumns: {
                                xs: "1fr",
                                sm: "repeat(2, 1fr)",
                                lg: "repeat(4, 1fr)",
                            },

                            gap: 1.5,

                            mb: 2,
                        }}
                    >

                        <MetricCard
                            title="CPU Usage"
                            value={`${Number(
                                metrics?.cpuUsage || 0
                            ).toFixed(2)}%`}
                            subtitle={
                                getUsageLabel(
                                    metrics?.cpuUsage
                                )
                            }
                            icon={
                                SpeedRounded
                            }
                            iconColor={
                                cpuColor
                            }
                        />


                        <MetricCard
                            title="Memory Usage"
                            value={`${Number(
                                metrics?.memoryUsage || 0
                            ).toFixed(2)}%`}
                            subtitle={
                                getUsageLabel(
                                    metrics?.memoryUsage
                                )
                            }
                            icon={
                                MemoryRounded
                            }
                            iconColor={
                                memoryColor
                            }
                        />


                        <MetricCard
                            title="Active Threads"
                            value={
                                metrics?.threadCount ??
                                "—"
                            }
                            subtitle="Live JVM threads"
                            icon={
                                DeveloperBoardRounded
                            }
                            iconColor="#60A5FA"
                        />


                        <MetricCard
                            title="Uptime"
                            value={
                                metrics?.uptime ||
                                "—"
                            }
                            subtitle="Dashboard Service"
                            icon={
                                AccessTimeRounded
                            }
                            iconColor="#A78BFA"
                        />

                    </Box>


                    {/* =================================
                        DETAILS
                    ================================= */}

                    <Box
                        sx={{
                            display: "grid",

                            gridTemplateColumns: {
                                xs: "1fr",
                                lg: "1.2fr .8fr",
                            },

                            gap: 2,
                        }}
                    >

                        {/* =============================
                            MEMORY
                        ============================= */}

                        <Paper
                            sx={{
                                p: 2.5,

                                background:
                                    "rgba(255,255,255,.035)",

                                border:
                                    "1px solid rgba(255,255,255,.07)",

                                borderRadius: 3,
                            }}
                        >

                            <Stack
                                direction="row"
                                spacing={1}
                                alignItems="center"
                                sx={{
                                    mb: 2.5,
                                }}
                            >

                                <DataUsageRounded
                                    sx={{
                                        color:
                                            "#60A5FA",
                                        fontSize: 20,
                                    }}
                                />

                                <Typography
                                    sx={{
                                        fontWeight: 700,
                                    }}
                                >
                                    Memory & Heap
                                </Typography>

                            </Stack>


                            <Stack
                                spacing={2.5}
                            >

                                <UsageBar
                                    label="JVM Heap Usage"
                                    value={
                                        heapPercentage
                                    }
                                    color={
                                        getUsageColor(
                                            heapPercentage
                                        )
                                    }
                                />


                                <Box
                                    sx={{
                                        display: "grid",

                                        gridTemplateColumns:
                                            "1fr 1fr",

                                        gap: 1.5,
                                    }}
                                >

                                    <Box
                                        sx={{
                                            p: 2,

                                            borderRadius: 2,

                                            background:
                                                "rgba(255,255,255,.035)",
                                        }}
                                    >

                                        <Typography
                                            sx={{
                                                fontSize: 10,

                                                color:
                                                    "rgba(255,255,255,.4)",
                                            }}
                                        >
                                            HEAP USED
                                        </Typography>

                                        <Typography
                                            sx={{
                                                mt: .6,

                                                fontSize: 18,

                                                fontWeight: 700,
                                            }}
                                        >
                                            {formatBytes(
                                                metrics?.heapUsed
                                            )}
                                        </Typography>

                                    </Box>


                                    <Box
                                        sx={{
                                            p: 2,

                                            borderRadius: 2,

                                            background:
                                                "rgba(255,255,255,.035)",
                                        }}
                                    >

                                        <Typography
                                            sx={{
                                                fontSize: 10,

                                                color:
                                                    "rgba(255,255,255,.4)",
                                            }}
                                        >
                                            HEAP MAX
                                        </Typography>

                                        <Typography
                                            sx={{
                                                mt: .6,

                                                fontSize: 18,

                                                fontWeight: 700,
                                            }}
                                        >
                                            {formatBytes(
                                                metrics?.heapMax
                                            )}
                                        </Typography>

                                    </Box>

                                </Box>

                            </Stack>

                        </Paper>


                        {/* =============================
                            SYSTEM STATUS
                        ============================= */}

                        <Paper
                            sx={{
                                p: 2.5,

                                background:
                                    "rgba(255,255,255,.035)",

                                border:
                                    "1px solid rgba(255,255,255,.07)",

                                borderRadius: 3,
                            }}
                        >

                            <Stack
                                direction="row"
                                spacing={1}
                                alignItems="center"
                                sx={{
                                    mb: 2.5,
                                }}
                            >

                                <StorageRounded
                                    sx={{
                                        color:
                                            "#34D399",
                                        fontSize: 20,
                                    }}
                                />

                                <Typography
                                    sx={{
                                        fontWeight: 700,
                                    }}
                                >
                                    Runtime Status
                                </Typography>

                            </Stack>


                            <Stack
                                spacing={1.5}
                            >

                                <Box
                                    sx={{
                                        display: "flex",

                                        justifyContent:
                                            "space-between",

                                        alignItems:
                                            "center",

                                        p: 1.5,

                                        borderRadius: 2,

                                        background:
                                            "rgba(255,255,255,.035)",
                                    }}
                                >

                                    <Typography
                                        sx={{
                                            color:
                                                "rgba(255,255,255,.55)",

                                            fontSize: 12,
                                        }}
                                    >
                                        CPU Status
                                    </Typography>

                                    <Typography
                                        sx={{
                                            color:
                                                cpuColor,

                                            fontSize: 12,

                                            fontWeight: 700,
                                        }}
                                    >
                                        {
                                            getUsageLabel(
                                                metrics?.cpuUsage
                                            )
                                        }
                                    </Typography>

                                </Box>


                                <Box
                                    sx={{
                                        display: "flex",

                                        justifyContent:
                                            "space-between",

                                        alignItems:
                                            "center",

                                        p: 1.5,

                                        borderRadius: 2,

                                        background:
                                            "rgba(255,255,255,.035)",
                                    }}
                                >

                                    <Typography
                                        sx={{
                                            color:
                                                "rgba(255,255,255,.55)",

                                            fontSize: 12,
                                        }}
                                    >
                                        Memory Status
                                    </Typography>

                                    <Typography
                                        sx={{
                                            color:
                                                memoryColor,

                                            fontSize: 12,

                                            fontWeight: 700,
                                        }}
                                    >
                                        {
                                            getUsageLabel(
                                                metrics?.memoryUsage
                                            )
                                        }
                                    </Typography>

                                </Box>


                                <Box
                                    sx={{
                                        display: "flex",

                                        justifyContent:
                                            "space-between",

                                        alignItems:
                                            "center",

                                        p: 1.5,

                                        borderRadius: 2,

                                        background:
                                            "rgba(255,255,255,.035)",
                                    }}
                                >

                                    <Typography
                                        sx={{
                                            color:
                                                "rgba(255,255,255,.55)",

                                            fontSize: 12,
                                        }}
                                    >
                                        Thread Count
                                    </Typography>

                                    <Typography
                                        sx={{
                                            fontSize: 12,

                                            fontWeight: 700,
                                        }}
                                    >
                                        {
                                            metrics?.threadCount ??
                                            "—"
                                        }
                                    </Typography>

                                </Box>


                                <Box
                                    sx={{
                                        display: "flex",

                                        justifyContent:
                                            "space-between",

                                        alignItems:
                                            "center",

                                        p: 1.5,

                                        borderRadius: 2,

                                        background:
                                            "rgba(255,255,255,.035)",
                                    }}
                                >

                                    <Typography
                                        sx={{
                                            color:
                                                "rgba(255,255,255,.55)",

                                            fontSize: 12,
                                        }}
                                    >
                                        Application
                                    </Typography>

                                    <Typography
                                        sx={{
                                            fontSize: 12,

                                            fontWeight: 700,

                                            color:
                                                "#35d98b",
                                        }}
                                    >
                                        RUNNING
                                    </Typography>

                                </Box>

                            </Stack>

                        </Paper>

                    </Box>

                </>
            )}

        </Box>
    );
}


function QueryStatsIcon() {

    return (
        <DataUsageRounded
            sx={{
                color: "#A78BFA",
                fontSize: 23,
            }}
        />
    );
}