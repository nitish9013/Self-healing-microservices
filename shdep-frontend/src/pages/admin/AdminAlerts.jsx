import React, {
    useEffect,
    useMemo,
    useState,
} from "react";

import {
    Alert as MuiAlert,
    Box,
    Button,
    Chip,
    CircularProgress,
    FormControl,
    InputLabel,
    MenuItem,
    Paper,
    Select,
    Stack,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Typography,
} from "@mui/material";

import {
    ArrowBackRounded,
    CheckCircleRounded,
    RefreshRounded,
    WarningAmberRounded,
    ErrorRounded,
    NotificationsActiveRounded,
} from "@mui/icons-material";

import { useNavigate } from "react-router-dom";

import {
    getAdminAlerts,
} from "../../services/adminDashboardService";


const SERVICES = [
    "API Gateway",
    "Authentication",
    "User Service",
    "Catalog Service",
    "Order Service",
    "Payment Service",
    "Dashboard Service",
];


const TYPES = [
    "SERVICE_HEALTH",
    "CIRCUIT_BREAKER",
    "RETRY_FAILURE",
];


const SEVERITIES = [
    "CRITICAL",
    "WARNING",
];


const getSeverityColor = (severity) => {

    if (
        String(severity)
            .toUpperCase() === "CRITICAL"
    ) {
        return "error";
    }

    return "warning";
};


const formatDateTime = (value) => {

    if (!value) {
        return "—";
    }

    const date =
        new Date(value);

    if (
        Number.isNaN(
            date.getTime()
        )
    ) {
        return value;
    }

    return date.toLocaleString(
        "en-IN",
        {
            day: "2-digit",
            month: "short",
            year: "numeric",
            hour: "2-digit",
            minute: "2-digit",
            second: "2-digit",
        }
    );
};


export default function AdminAlerts() {

    const navigate =
        useNavigate();


    const [alerts, setAlerts] =
        useState([]);

    const [loading, setLoading] =
        useState(true);

    const [refreshing, setRefreshing] =
        useState(false);

    const [error, setError] =
        useState("");


    const [service, setService] =
        useState("");

    const [severity, setSeverity] =
        useState("");

    const [type, setType] =
        useState("");


    const loadAlerts = async (
        refresh = false
    ) => {

        try {

            if (refresh) {
                setRefreshing(true);
            } else {
                setLoading(true);
            }

            setError("");

            const data =
                await getAdminAlerts({
                    service,
                    severity,
                    type,
                });

            setAlerts(
                Array.isArray(data)
                    ? data
                    : []
            );

        } catch (err) {

            console.error(
                "Admin Alerts API Error:",
                err
            );

            setError(
                err?.response?.data?.message ||
                "Unable to load alerts."
            );

        } finally {

            setLoading(false);
            setRefreshing(false);
        }
    };


    useEffect(() => {

        loadAlerts();

    }, [
        service,
        severity,
        type,
    ]);


    const criticalCount =
        useMemo(
            () =>
                alerts.filter(
                    alert =>
                        String(
                            alert.severity || ""
                        ).toUpperCase()
                        === "CRITICAL"
                ).length,
            [alerts]
        );


    const warningCount =
        useMemo(
            () =>
                alerts.filter(
                    alert =>
                        String(
                            alert.severity || ""
                        ).toUpperCase()
                        === "WARNING"
                ).length,
            [alerts]
        );


    const clearFilters = () => {

        setService("");
        setSeverity("");
        setType("");
    };


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
                                alignItems: "center",
                                justifyContent:
                                    "center",

                                background:
                                    "rgba(245,158,11,.10)",

                                border:
                                    "1px solid rgba(245,158,11,.20)",
                            }}
                        >

                            <NotificationsActiveRounded
                                sx={{
                                    color: "#FBBF24",
                                    fontSize: 23,
                                }}
                            />

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
                                Alerts
                            </Typography>

                            <Typography
                                sx={{
                                    mt: .4,
                                    color:
                                        "rgba(255,255,255,.45)",
                                    fontSize: 12,
                                }}
                            >
                                Active platform health and resilience alerts
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
                        loadAlerts(true)
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
                SUMMARY CARDS
            ========================================= */}

            <Box
                sx={{
                    display: "grid",
                    gridTemplateColumns: {
                        xs: "1fr",
                        md: "repeat(3, 1fr)",
                    },
                    gap: 1.5,
                    mb: 2,
                }}
            >

                <Paper
                    sx={{
                        p: 2,
                        background:
                            "rgba(255,255,255,.035)",
                        border:
                            "1px solid rgba(255,255,255,.07)",
                    }}
                >

                    <Typography
                        sx={{
                            color:
                                "rgba(255,255,255,.4)",
                            fontSize: 11,
                        }}
                    >
                        Active Alerts
                    </Typography>

                    <Typography
                        sx={{
                            mt: .5,
                            fontSize: 24,
                            fontWeight: 800,
                        }}
                    >
                        {loading
                            ? "—"
                            : alerts.length}
                    </Typography>

                </Paper>


                <Paper
                    sx={{
                        p: 2,
                        background:
                            "rgba(255,255,255,.035)",
                        border:
                            "1px solid rgba(255,255,255,.07)",
                    }}
                >

                    <Typography
                        sx={{
                            color:
                                "rgba(255,255,255,.4)",
                            fontSize: 11,
                        }}
                    >
                        Critical
                    </Typography>

                    <Typography
                        sx={{
                            mt: .5,
                            fontSize: 24,
                            fontWeight: 800,
                            color: "#f87171",
                        }}
                    >
                        {loading
                            ? "—"
                            : criticalCount}
                    </Typography>

                </Paper>


                <Paper
                    sx={{
                        p: 2,
                        background:
                            "rgba(255,255,255,.035)",
                        border:
                            "1px solid rgba(255,255,255,.07)",
                    }}
                >

                    <Typography
                        sx={{
                            color:
                                "rgba(255,255,255,.4)",
                            fontSize: 11,
                        }}
                    >
                        Warnings
                    </Typography>

                    <Typography
                        sx={{
                            mt: .5,
                            fontSize: 24,
                            fontWeight: 800,
                            color: "#FBBF24",
                        }}
                    >
                        {loading
                            ? "—"
                            : warningCount}
                    </Typography>

                </Paper>

            </Box>


            {/* =========================================
                FILTERS
            ========================================= */}

            <Paper
                sx={{
                    p: 2,
                    mb: 2,
                    background:
                        "rgba(255,255,255,.035)",
                    border:
                        "1px solid rgba(255,255,255,.07)",
                }}
            >

                <Stack
                    direction={{
                        xs: "column",
                        md: "row",
                    }}
                    spacing={1.5}
                >

                    <FormControl
                        size="small"
                        sx={{
                            minWidth: 190,
                        }}
                    >

                        <InputLabel>
                            Service
                        </InputLabel>

                        <Select
                            value={service}
                            label="Service"
                            onChange={
                                event =>
                                    setService(
                                        event.target.value
                                    )
                            }
                        >

                            <MenuItem value="">
                                All Services
                            </MenuItem>

                            {SERVICES.map(
                                item => (
                                    <MenuItem
                                        key={item}
                                        value={item}
                                    >
                                        {item}
                                    </MenuItem>
                                )
                            )}

                        </Select>

                    </FormControl>


                    <FormControl
                        size="small"
                        sx={{
                            minWidth: 160,
                        }}
                    >

                        <InputLabel>
                            Severity
                        </InputLabel>

                        <Select
                            value={severity}
                            label="Severity"
                            onChange={
                                event =>
                                    setSeverity(
                                        event.target.value
                                    )
                            }
                        >

                            <MenuItem value="">
                                All Severity
                            </MenuItem>

                            {SEVERITIES.map(
                                item => (
                                    <MenuItem
                                        key={item}
                                        value={item}
                                    >
                                        {item}
                                    </MenuItem>
                                )
                            )}

                        </Select>

                    </FormControl>


                    <FormControl
                        size="small"
                        sx={{
                            minWidth: 190,
                        }}
                    >

                        <InputLabel>
                            Alert Type
                        </InputLabel>

                        <Select
                            value={type}
                            label="Alert Type"
                            onChange={
                                event =>
                                    setType(
                                        event.target.value
                                    )
                            }
                        >

                            <MenuItem value="">
                                All Types
                            </MenuItem>

                            {TYPES.map(
                                item => (
                                    <MenuItem
                                        key={item}
                                        value={item}
                                    >
                                        {item}
                                    </MenuItem>
                                )
                            )}

                        </Select>

                    </FormControl>


                    <Button
                        variant="outlined"
                        onClick={
                            clearFilters
                        }
                        sx={{
                            color: "#fff",
                            borderColor:
                                "rgba(255,255,255,.15)",
                            textTransform:
                                "none",
                        }}
                    >
                        Clear
                    </Button>

                </Stack>

            </Paper>


            {/* =========================================
                ERROR
            ========================================= */}

            {error && (

                <MuiAlert
                    severity="error"
                    sx={{
                        mb: 2,
                    }}
                >
                    {error}
                </MuiAlert>

            )}


            {/* =========================================
                ALERT TABLE
            ========================================= */}

            <TableContainer
                component={Paper}
                sx={{
                    background:
                        "rgba(255,255,255,.035)",
                    border:
                        "1px solid rgba(255,255,255,.07)",
                    overflowX: "auto",
                }}
            >

                <Table
                    size="small"
                    sx={{
                        minWidth: 900,
                    }}
                >

                    <TableHead>

                        <TableRow>

                            <TableCell
                                sx={{
                                    color:
                                        "rgba(255,255,255,.45)",
                                    fontWeight: 700,
                                }}
                            >
                                TIME
                            </TableCell>

                            <TableCell
                                sx={{
                                    color:
                                        "rgba(255,255,255,.45)",
                                    fontWeight: 700,
                                }}
                            >
                                SERVICE
                            </TableCell>

                            <TableCell
                                sx={{
                                    color:
                                        "rgba(255,255,255,.45)",
                                    fontWeight: 700,
                                }}
                            >
                                TYPE
                            </TableCell>

                            <TableCell
                                sx={{
                                    color:
                                        "rgba(255,255,255,.45)",
                                    fontWeight: 700,
                                }}
                            >
                                SEVERITY
                            </TableCell>

                            <TableCell
                                sx={{
                                    color:
                                        "rgba(255,255,255,.45)",
                                    fontWeight: 700,
                                }}
                            >
                                STATUS
                            </TableCell>

                            <TableCell
                                sx={{
                                    color:
                                        "rgba(255,255,255,.45)",
                                    fontWeight: 700,
                                }}
                            >
                                MESSAGE
                            </TableCell>

                        </TableRow>

                    </TableHead>


                    <TableBody>

                        {loading ? (

                            <TableRow>

                                <TableCell
                                    colSpan={6}
                                    align="center"
                                    sx={{
                                        py: 8,
                                    }}
                                >

                                    <CircularProgress
                                        size={28}
                                    />

                                    <Typography
                                        sx={{
                                            mt: 1.5,
                                            color:
                                                "rgba(255,255,255,.4)",
                                            fontSize: 12,
                                        }}
                                    >
                                        Checking platform alerts...
                                    </Typography>

                                </TableCell>

                            </TableRow>

                        ) : alerts.length === 0 ? (

                            <TableRow>

                                <TableCell
                                    colSpan={6}
                                    align="center"
                                    sx={{
                                        py: 9,
                                    }}
                                >

                                    <CheckCircleRounded
                                        sx={{
                                            fontSize: 44,
                                            color:
                                                "#35d98b",
                                        }}
                                    />

                                    <Typography
                                        sx={{
                                            mt: 1,
                                            fontSize: 16,
                                            fontWeight: 700,
                                        }}
                                    >
                                        No active alerts
                                    </Typography>

                                    <Typography
                                        sx={{
                                            mt: .5,
                                            color:
                                                "rgba(255,255,255,.4)",
                                            fontSize: 12,
                                        }}
                                    >
                                        All monitored platform conditions are currently healthy.
                                    </Typography>

                                </TableCell>

                            </TableRow>

                        ) : (

                            alerts.map(
                                alert => (

                                    <TableRow
                                        key={
                                            alert.id
                                        }
                                        hover
                                    >

                                        <TableCell
                                            sx={{
                                                color:
                                                    "rgba(255,255,255,.65)",
                                                fontSize: 11,
                                                whiteSpace:
                                                    "nowrap",
                                            }}
                                        >
                                            {formatDateTime(
                                                alert.detectedAt
                                            )}
                                        </TableCell>


                                        <TableCell>

                                            <Chip
                                                label={
                                                    alert.serviceName
                                                }
                                                size="small"
                                                sx={{
                                                    fontSize: 10,
                                                    fontWeight: 700,
                                                }}
                                            />

                                        </TableCell>


                                        <TableCell
                                            sx={{
                                                fontSize: 11,
                                                color:
                                                    "rgba(255,255,255,.65)",
                                            }}
                                        >
                                            {alert.type}
                                        </TableCell>


                                        <TableCell>

                                            <Chip
                                                icon={
                                                    String(
                                                        alert.severity
                                                    ).toUpperCase()
                                                    === "CRITICAL"
                                                        ? (
                                                            <ErrorRounded />
                                                        )
                                                        : (
                                                            <WarningAmberRounded />
                                                        )
                                                }
                                                label={
                                                    alert.severity
                                                }
                                                size="small"
                                                color={
                                                    getSeverityColor(
                                                        alert.severity
                                                    )
                                                }
                                                variant="outlined"
                                                sx={{
                                                    fontSize: 10,
                                                    fontWeight: 700,
                                                }}
                                            />

                                        </TableCell>


                                        <TableCell>

                                            <Chip
                                                label={
                                                    alert.status
                                                }
                                                size="small"
                                                color="error"
                                                variant="outlined"
                                                sx={{
                                                    fontSize: 10,
                                                    fontWeight: 700,
                                                }}
                                            />

                                        </TableCell>


                                        <TableCell
                                            sx={{
                                                color:
                                                    "rgba(255,255,255,.8)",
                                                fontSize: 12,
                                            }}
                                        >
                                            {alert.message}
                                        </TableCell>

                                    </TableRow>

                                )
                            )

                        )}

                    </TableBody>

                </Table>

            </TableContainer>

        </Box>
    );
}