import React, {
    useEffect,
    useMemo,
    useState,
} from "react";

import {
    Alert,
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
    TextField,
    Typography,
} from "@mui/material";

import {
    ArrowBackRounded,
    DescriptionRounded,
    RefreshRounded,
    SearchRounded,
} from "@mui/icons-material";

import { useNavigate } from "react-router-dom";

import {
    getAdminLogs,
} from "../../services/adminDashboardService";


const SERVICES = [
    "AUTH",
    "USER",
    "CATALOG",
    "ORDER",
    "PAYMENT",
    "GATEWAY",
    "DASHBOARD",
];


const LEVELS = [
    "INFO",
    "WARN",
    "ERROR",
    "DEBUG",
];


const getLevelColor = (level) => {

    const normalized =
        String(level || "")
            .toUpperCase();

    if (normalized === "ERROR") {
        return "error";
    }

    if (normalized === "WARN") {
        return "warning";
    }

    if (normalized === "DEBUG") {
        return "info";
    }

    return "success";
};


const formatTimestamp = (timestamp) => {

    if (!timestamp) {
        return "—";
    }

    const date =
        new Date(timestamp);

    if (
        Number.isNaN(
            date.getTime()
        )
    ) {
        return timestamp;
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


export default function AdminLogs() {

    const navigate = useNavigate();

    const [logs, setLogs] =
        useState([]);

    const [loading, setLoading] =
        useState(true);

    const [refreshing, setRefreshing] =
        useState(false);

    const [error, setError] =
        useState("");

    const [service, setService] =
        useState("");

    const [level, setLevel] =
        useState("");

    const [search, setSearch] =
        useState("");

    const [appliedSearch, setAppliedSearch] =
        useState("");


    const loadLogs = async (
        isRefresh = false
    ) => {

        try {

            if (isRefresh) {
                setRefreshing(true);
            } else {
                setLoading(true);
            }

            setError("");

            const data =
                await getAdminLogs({
                    service,
                    level,
                    search: appliedSearch,
                    limit: 100,
                });

            setLogs(
                Array.isArray(data)
                    ? data
                    : []
            );

        } catch (err) {

            console.error(
                "Admin Logs API Error:",
                err
            );

            setError(
                err?.response?.data?.message ||
                "Unable to load centralized logs."
            );

        } finally {

            setLoading(false);
            setRefreshing(false);
        }
    };


    useEffect(() => {

        loadLogs();

    }, [
        service,
        level,
        appliedSearch,
    ]);


    const errorCount =
        useMemo(
            () =>
                logs.filter(
                    (log) =>
                        String(
                            log.level || ""
                        ).toUpperCase()
                        === "ERROR"
                ).length,
            [logs]
        );


    const warnCount =
        useMemo(
            () =>
                logs.filter(
                    (log) =>
                        String(
                            log.level || ""
                        ).toUpperCase()
                        === "WARN"
                ).length,
            [logs]
        );


    const handleSearch = () => {

        setAppliedSearch(
            search.trim()
        );
    };


    const handleSearchKeyDown = (
        event
    ) => {

        if (
            event.key === "Enter"
        ) {
            handleSearch();
        }
    };


    const handleClearFilters = () => {

        setService("");
        setLevel("");
        setSearch("");
        setAppliedSearch("");
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
                    alignItems: {
                        xs: "flex-start",
                        md: "center",
                    },
                    justifyContent:
                        "space-between",
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
                                    "rgba(59,130,246,.12)",
                                border:
                                    "1px solid rgba(59,130,246,.2)",
                            }}
                        >
                            <DescriptionRounded
                                sx={{
                                    color: "#60A5FA",
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
                                Centralized Logs
                            </Typography>

                            <Typography
                                sx={{
                                    mt: .4,
                                    color:
                                        "rgba(255,255,255,.45)",
                                    fontSize: 12,
                                }}
                            >
                                Monitor logs from all SHDEP services
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
                        loadLogs(true)
                    }
                    disabled={
                        loading ||
                        refreshing
                    }
                    sx={{
                        color: "#fff",
                        borderColor:
                            "rgba(255,255,255,.15)",
                    }}
                >
                    Refresh
                </Button>

            </Box>


            {/* =========================================
                SUMMARY
            ========================================= */}

            <Box
                sx={{
                    display: "grid",
                    gridTemplateColumns: {
                        xs: "1fr",
                        sm: "repeat(3, 1fr)",
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
                    }}
                >
                    <Typography
                        sx={{
                            color:
                                "rgba(255,255,255,.4)",
                            fontSize: 11,
                        }}
                    >
                        Logs Loaded
                    </Typography>

                    <Typography
                        sx={{
                            mt: .5,
                            fontSize: 22,
                            fontWeight: 800,
                        }}
                    >
                        {loading
                            ? "—"
                            : logs.length}
                    </Typography>
                </Paper>


                <Paper
                    sx={{
                        p: 2,
                        background:
                            "rgba(255,255,255,.035)",
                    }}
                >
                    <Typography
                        sx={{
                            color:
                                "rgba(255,255,255,.4)",
                            fontSize: 11,
                        }}
                    >
                        Errors
                    </Typography>

                    <Typography
                        sx={{
                            mt: .5,
                            fontSize: 22,
                            fontWeight: 800,
                            color: "#f87171",
                        }}
                    >
                        {loading
                            ? "—"
                            : errorCount}
                    </Typography>
                </Paper>


                <Paper
                    sx={{
                        p: 2,
                        background:
                            "rgba(255,255,255,.035)",
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
                            fontSize: 22,
                            fontWeight: 800,
                            color: "#fbbf24",
                        }}
                    >
                        {loading
                            ? "—"
                            : warnCount}
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
                            minWidth: 170,
                        }}
                    >

                        <InputLabel
                            sx={{
                                color:
                                    "rgba(255,255,255,.5)",
                            }}
                        >
                            Service
                        </InputLabel>

                        <Select
                            value={service}
                            label="Service"
                            onChange={(event) =>
                                setService(
                                    event.target.value
                                )
                            }
                            sx={{
                                color: "#fff",
                                "& .MuiOutlinedInput-notchedOutline":
                                    {
                                        borderColor:
                                            "rgba(255,255,255,.15)",
                                    },
                            }}
                        >

                            <MenuItem value="">
                                All Services
                            </MenuItem>

                            {SERVICES.map(
                                (item) => (
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
                            minWidth: 150,
                        }}
                    >

                        <InputLabel
                            sx={{
                                color:
                                    "rgba(255,255,255,.5)",
                            }}
                        >
                            Level
                        </InputLabel>

                        <Select
                            value={level}
                            label="Level"
                            onChange={(event) =>
                                setLevel(
                                    event.target.value
                                )
                            }
                            sx={{
                                color: "#fff",
                                "& .MuiOutlinedInput-notchedOutline":
                                    {
                                        borderColor:
                                            "rgba(255,255,255,.15)",
                                    },
                            }}
                        >

                            <MenuItem value="">
                                All Levels
                            </MenuItem>

                            {LEVELS.map(
                                (item) => (
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


                    <TextField
                        size="small"
                        fullWidth
                        value={search}
                        onChange={(event) =>
                            setSearch(
                                event.target.value
                            )
                        }
                        onKeyDown={
                            handleSearchKeyDown
                        }
                        placeholder="Search message, logger, service..."
                        InputProps={{
                            startAdornment: (
                                <SearchRounded
                                    sx={{
                                        mr: 1,
                                        color:
                                            "rgba(255,255,255,.35)",
                                    }}
                                />
                            ),
                        }}
                        sx={{
                            "& .MuiInputBase-root":
                                {
                                    color: "#fff",
                                },
                            "& .MuiOutlinedInput-notchedOutline":
                                {
                                    borderColor:
                                        "rgba(255,255,255,.15)",
                                },
                        }}
                    />


                    <Button
                        variant="contained"
                        startIcon={
                            <SearchRounded />
                        }
                        onClick={
                            handleSearch
                        }
                        sx={{
                            minWidth: 110,
                        }}
                    >
                        Search
                    </Button>


                    <Button
                        variant="outlined"
                        onClick={
                            handleClearFilters
                        }
                        sx={{
                            color: "#fff",
                            borderColor:
                                "rgba(255,255,255,.15)",
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
                LOG TABLE
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
                        minWidth: 950,
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
                                LEVEL
                            </TableCell>

                            <TableCell
                                sx={{
                                    color:
                                        "rgba(255,255,255,.45)",
                                    fontWeight: 700,
                                }}
                            >
                                LOGGER
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
                                    colSpan={5}
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
                                        Loading logs...
                                    </Typography>

                                </TableCell>

                            </TableRow>

                        ) : logs.length === 0 ? (

                            <TableRow>

                                <TableCell
                                    colSpan={5}
                                    align="center"
                                    sx={{
                                        py: 8,
                                    }}
                                >

                                    <DescriptionRounded
                                        sx={{
                                            fontSize: 38,
                                            color:
                                                "rgba(255,255,255,.2)",
                                        }}
                                    />

                                    <Typography
                                        sx={{
                                            mt: 1,
                                            fontWeight: 700,
                                        }}
                                    >
                                        No logs found
                                    </Typography>

                                    <Typography
                                        sx={{
                                            mt: .5,
                                            color:
                                                "rgba(255,255,255,.4)",
                                            fontSize: 12,
                                        }}
                                    >
                                        Try changing the filters.
                                    </Typography>

                                </TableCell>

                            </TableRow>

                        ) : (

                            logs.map(
                                (log, index) => (

                                    <TableRow
                                        key={`${log.timestamp}-${index}`}
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
                                            {formatTimestamp(
                                                log.timestamp
                                            )}
                                        </TableCell>


                                        <TableCell>

                                            <Chip
                                                label={
                                                    log.service ||
                                                    "UNKNOWN"
                                                }
                                                size="small"
                                                sx={{
                                                    fontSize: 10,
                                                    fontWeight: 700,
                                                }}
                                            />

                                        </TableCell>


                                        <TableCell>

                                            <Chip
                                                label={
                                                    log.level ||
                                                    "UNKNOWN"
                                                }
                                                size="small"
                                                color={
                                                    getLevelColor(
                                                        log.level
                                                    )
                                                }
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
                                                    "rgba(255,255,255,.5)",
                                                fontSize: 11,
                                                maxWidth: 230,
                                            }}
                                        >
                                            <Typography
                                                sx={{
                                                    fontSize: 11,
                                                    overflow:
                                                        "hidden",
                                                    textOverflow:
                                                        "ellipsis",
                                                    whiteSpace:
                                                        "nowrap",
                                                }}
                                            >
                                                {
                                                    log.loggerName ||
                                                    "—"
                                                }
                                            </Typography>
                                        </TableCell>


                                        <TableCell
                                            sx={{
                                                color:
                                                    "rgba(255,255,255,.8)",
                                                fontSize: 12,
                                                maxWidth: 600,
                                            }}
                                        >

                                            <Typography
                                                sx={{
                                                    fontSize: 12,
                                                    lineHeight: 1.5,
                                                }}
                                            >
                                                {
                                                    log.message ||
                                                    "—"
                                                }
                                            </Typography>

                                            {log.stackTrace && (

                                                <Typography
                                                    sx={{
                                                        mt: .5,
                                                        color:
                                                            "#f87171",
                                                        fontSize: 10,
                                                        maxWidth: 600,
                                                        overflow:
                                                            "hidden",
                                                        textOverflow:
                                                            "ellipsis",
                                                        whiteSpace:
                                                            "nowrap",
                                                    }}
                                                >
                                                    {log.stackTrace}
                                                </Typography>

                                            )}

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