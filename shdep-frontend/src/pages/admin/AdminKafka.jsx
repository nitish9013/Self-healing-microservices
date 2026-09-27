import React, {
    useEffect,
    useState,
} from "react";

import {
    Box,
    Typography,
    Button,
    Chip,
    CircularProgress,
    Alert,
} from "@mui/material";

import {
    ArrowBackRounded,
    RefreshRounded,
    HubRounded,
    CheckCircleRounded,
    ErrorRounded,
    TopicRounded,
    GroupsRounded,
    OpenInNewRounded,
    StorageRounded,
} from "@mui/icons-material";

import { useNavigate } from "react-router-dom";

import {
    getKafkaStatus,
} from "../../services/adminKafkaService";


const formatNumber = (value) =>
    Number(value || 0).toLocaleString(
        "en-IN"
    );


export default function AdminKafka() {

    const navigate = useNavigate();

    const [data, setData] =
        useState(null);

    const [loading, setLoading] =
        useState(true);

    const [refreshing, setRefreshing] =
        useState(false);

    const [error, setError] =
        useState("");


    const loadKafka = async (
        isRefresh = false
    ) => {

        try {

            if (isRefresh) {
                setRefreshing(true);
            } else {
                setLoading(true);
            }

            setError("");

            const response =
                await getKafkaStatus();

            setData(response);

        } catch (err) {

            console.error(
                "Kafka Monitoring API Error:",
                err
            );

            setError(
                err?.response?.data?.message ||
                "Unable to load Kafka monitoring data."
            );

        } finally {

            setLoading(false);
            setRefreshing(false);
        }
    };


    useEffect(() => {
        loadKafka();
    }, []);


    const topics =
        data?.topics || [];

    const consumerGroups =
        data?.consumerGroups || [];


    const totalPartitions =
        topics.reduce(
            (sum, topic) =>
                sum +
                Number(
                    topic.partitions || 0
                ),
            0
        );


    const totalLag =
        consumerGroups.reduce(
            (sum, group) =>
                sum +
                Number(
                    group.lag || 0
                ),
            0
        );


    const openKafkaUI = () => {

        window.open(
            "http://localhost:8089",
            "_blank",
            "noopener,noreferrer"
        );
    };


    const getGroupColor = (
        state
    ) => {

        const normalized =
            String(
                state || ""
            ).toUpperCase();


        if (
            normalized === "STABLE"
        ) {
            return "#35d98b";
        }


        if (
            normalized === "EMPTY"
        ) {
            return "#fbbf24";
        }


        if (
            normalized === "DEAD"
        ) {
            return "#ef4444";
        }


        return "#94a3b8";
    };


    return (
        <Box
            sx={{
                minHeight: "100vh",
                background:
                    "linear-gradient(135deg, #050816 0%, #0b1026 100%)",
                color: "#fff",
                p: {
                    xs: 2,
                    md: 4,
                },
            }}
        >

            {/* HEADER */}

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
                    mb: 4,
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
                        Back to Overview
                    </Button>


                    <Typography
                        sx={{
                            fontSize: {
                                xs: 26,
                                md: 32,
                            },
                            fontWeight: 800,
                        }}
                    >
                        Kafka
                    </Typography>


                    <Typography
                        sx={{
                            mt: .5,
                            color:
                                "rgba(255,255,255,.45)",
                            fontSize: 14,
                        }}
                    >
                        Monitor Kafka broker,
                        topics and consumer
                        groups in SHDEP.
                    </Typography>

                </Box>


                <Box
                    sx={{
                        display: "flex",
                        gap: 1,
                    }}
                >

                    <Button
                        variant="outlined"
                        startIcon={
                            refreshing ? (
                                <CircularProgress
                                    size={16}
                                    sx={{
                                        color:
                                            "#76a7ff",
                                    }}
                                />
                            ) : (
                                <RefreshRounded />
                            )
                        }
                        onClick={() =>
                            loadKafka(true)
                        }
                        disabled={
                            loading ||
                            refreshing
                        }
                        sx={{
                            color: "#fff",
                            borderColor:
                                "rgba(255,255,255,.12)",
                            textTransform:
                                "none",
                            borderRadius: 2,
                        }}
                    >
                        Refresh
                    </Button>


                    <Button
                        variant="contained"
                        startIcon={
                            <OpenInNewRounded />
                        }
                        onClick={
                            openKafkaUI
                        }
                        sx={{
                            background:
                                "#355cff",
                            textTransform:
                                "none",
                            borderRadius: 2,
                            boxShadow: "none",
                            "&:hover": {
                                background:
                                    "#4268ff",
                                boxShadow:
                                    "none",
                            },
                        }}
                    >
                        Kafka UI
                    </Button>

                </Box>

            </Box>


            {/* ERROR */}

            {error && (
                <Alert
                    severity="error"
                    onClose={() =>
                        setError("")
                    }
                    sx={{
                        mb: 3,
                    }}
                >
                    {error}
                </Alert>
            )}


            {/* LOADING */}

            {loading ? (

                <Box
                    sx={{
                        minHeight: 400,
                        display: "flex",
                        alignItems:
                            "center",
                        justifyContent:
                            "center",
                        gap: 1.5,
                    }}
                >

                    <CircularProgress
                        size={24}
                        sx={{
                            color:
                                "#76a7ff",
                        }}
                    />

                    <Typography
                        sx={{
                            color:
                                "rgba(255,255,255,.45)",
                            fontSize: 13,
                        }}
                    >
                        Connecting to Kafka...
                    </Typography>

                </Box>

            ) : (

                <>

                    {/* CONNECTION CARD */}

                    <Box
                        sx={{
                            mb: 3,
                            p: 2.5,
                            borderRadius: 3,
                            border:
                                "1px solid rgba(255,255,255,.08)",
                            background:
                                "rgba(255,255,255,.025)",
                            display: "flex",
                            alignItems:
                                "center",
                            justifyContent:
                                "space-between",
                            flexWrap: "wrap",
                            gap: 2,
                        }}
                    >

                        <Box
                            sx={{
                                display:
                                    "flex",
                                alignItems:
                                    "center",
                                gap: 1.5,
                            }}
                        >

                            {data?.connected ? (
                                <CheckCircleRounded
                                    sx={{
                                        color:
                                            "#35d98b",
                                        fontSize: 28,
                                    }}
                                />
                            ) : (
                                <ErrorRounded
                                    sx={{
                                        color:
                                            "#ef4444",
                                        fontSize: 28,
                                    }}
                                />
                            )}


                            <Box>

                                <Typography
                                    sx={{
                                        fontSize: 15,
                                        fontWeight: 800,
                                    }}
                                >
                                    {data?.connected
                                        ? "Kafka Connected"
                                        : "Kafka Unavailable"}
                                </Typography>


                                <Typography
                                    sx={{
                                        mt: .35,
                                        fontSize: 11,
                                        color:
                                            "rgba(255,255,255,.4)",
                                    }}
                                >
                                    Bootstrap:
                                    {" "}
                                    {
                                        data?.bootstrapServers ||
                                        "—"
                                    }
                                </Typography>

                            </Box>

                        </Box>


                        <Chip
                            icon={
                                data?.connected
                                    ? (
                                        <CheckCircleRounded />
                                    )
                                    : (
                                        <ErrorRounded />
                                    )
                            }
                            label={
                                data?.connected
                                    ? "ONLINE"
                                    : "OFFLINE"
                            }
                            sx={{
                                color:
                                    data?.connected
                                        ? "#35d98b"
                                        : "#ef4444",

                                background:
                                    data?.connected
                                        ? "rgba(53,217,139,.08)"
                                        : "rgba(239,68,68,.08)",

                                border:
                                    "1px solid rgba(255,255,255,.08)",

                                fontWeight: 800,
                            }}
                        />

                    </Box>


                    {/* STATS */}

                    <Box
                        sx={{
                            display: "grid",
                            gridTemplateColumns: {
                                xs: "1fr",
                                sm:
                                    "repeat(2, 1fr)",
                                xl:
                                    "repeat(5, 1fr)",
                            },
                            gap: 2,
                            mb: 3,
                        }}
                    >

                        {[
                            [
                                "Broker",
                                data?.brokerCount ||
                                    0,
                                StorageRounded,
                                "#76a7ff",
                            ],
                            [
                                "Topics",
                                topics.length,
                                TopicRounded,
                                "#c084fc",
                            ],
                            [
                                "Partitions",
                                totalPartitions,
                                HubRounded,
                                "#35d98b",
                            ],
                            [
                                "Consumer Groups",
                                consumerGroups.length,
                                GroupsRounded,
                                "#fbbf24",
                            ],
                            [
                                "Total Lag",
                                totalLag,
                                HubRounded,
                                totalLag > 0
                                    ? "#fbbf24"
                                    : "#35d98b",
                            ],
                        ].map(
                            ([
                                label,
                                value,
                                Icon,
                                color,
                            ]) => (

                                <Box
                                    key={label}
                                    sx={{
                                        p: 2.2,
                                        borderRadius: 3,
                                        border:
                                            "1px solid rgba(255,255,255,.08)",
                                        background:
                                            "rgba(255,255,255,.025)",
                                    }}
                                >

                                    <Box
                                        sx={{
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
                                                fontSize: 10,
                                                color:
                                                    "rgba(255,255,255,.4)",
                                                textTransform:
                                                    "uppercase",
                                                letterSpacing:
                                                    1,
                                            }}
                                        >
                                            {label}
                                        </Typography>


                                        <Icon
                                            sx={{
                                                fontSize: 19,
                                                color,
                                            }}
                                        />

                                    </Box>


                                    <Typography
                                        sx={{
                                            mt: 1.2,
                                            fontSize: 25,
                                            fontWeight: 800,
                                            color,
                                        }}
                                    >
                                        {formatNumber(
                                            value
                                        )}
                                    </Typography>

                                </Box>

                            )
                        )}

                    </Box>


                    {/* CLUSTER INFO */}

                    <Box
                        sx={{
                            mb: 3,
                            p: 2,
                            borderRadius: 3,
                            border:
                                "1px solid rgba(255,255,255,.08)",
                            background:
                                "rgba(255,255,255,.02)",
                        }}
                    >

                        <Typography
                            sx={{
                                fontSize: 11,
                                color:
                                    "rgba(255,255,255,.35)",
                                textTransform:
                                    "uppercase",
                                letterSpacing: 1,
                            }}
                        >
                            Cluster
                        </Typography>


                        <Typography
                            sx={{
                                mt: .8,
                                fontSize: 13,
                                fontWeight: 700,
                                wordBreak:
                                    "break-all",
                            }}
                        >
                            {data?.clusterId ||
                                "Unavailable"}
                        </Typography>


                        <Typography
                            sx={{
                                mt: .5,
                                fontSize: 10,
                                color:
                                    "rgba(255,255,255,.3)",
                            }}
                        >
                            Last checked:{" "}
                            {data?.checkedAt
                                ? new Date(
                                    data.checkedAt
                                ).toLocaleString(
                                    "en-IN"
                                )
                                : "—"}
                        </Typography>

                    </Box>


                    {/* TOPICS */}

                    <Box
                        sx={{
                            mb: 3,
                            borderRadius: 3,
                            border:
                                "1px solid rgba(255,255,255,.08)",
                            background:
                                "rgba(255,255,255,.02)",
                            overflow:
                                "hidden",
                        }}
                    >

                        <Box
                            sx={{
                                px: 2.5,
                                py: 2,
                                borderBottom:
                                    "1px solid rgba(255,255,255,.07)",
                            }}
                        >

                            <Box
                                sx={{
                                    display:
                                        "flex",
                                    alignItems:
                                        "center",
                                    gap: 1,
                                }}
                            >

                                <TopicRounded
                                    sx={{
                                        color:
                                            "#c084fc",
                                    }}
                                />

                                <Typography
                                    sx={{
                                        fontSize: 15,
                                        fontWeight: 800,
                                    }}
                                >
                                    Topics
                                </Typography>

                            </Box>

                        </Box>


                        <Box
                            sx={{
                                display: {
                                    xs:
                                        "none",
                                    md:
                                        "grid",
                                },
                                gridTemplateColumns:
                                    "2fr 1fr 1.2fr 1fr",
                                gap: 2,
                                px: 2.5,
                                py: 1.3,
                                background:
                                    "rgba(255,255,255,.02)",
                            }}
                        >

                            {[
                                "Topic",
                                "Partitions",
                                "Replication",
                                "Latest Offset",
                            ].map(
                                (heading) => (

                                    <Typography
                                        key={
                                            heading
                                        }
                                        sx={{
                                            fontSize: 10,
                                            color:
                                                "rgba(255,255,255,.35)",
                                            textTransform:
                                                "uppercase",
                                            letterSpacing:
                                                .8,
                                        }}
                                    >
                                        {heading}
                                    </Typography>

                                )
                            )}

                        </Box>


                        {topics.length === 0 ? (

                            <Box
                                sx={{
                                    py: 6,
                                    textAlign:
                                        "center",
                                }}
                            >
                                <Typography
                                    sx={{
                                        color:
                                            "rgba(255,255,255,.4)",
                                        fontSize: 13,
                                    }}
                                >
                                    No Kafka topics
                                    found.
                                </Typography>
                            </Box>

                        ) : (

                            topics.map(
                                (topic) => (

                                    <Box
                                        key={
                                            topic.name
                                        }
                                        sx={{
                                            display:
                                                "grid",
                                            gridTemplateColumns:
                                                {
                                                    xs:
                                                        "1fr",
                                                    md:
                                                        "2fr 1fr 1.2fr 1fr",
                                                },
                                            gap: 2,
                                            px: 2.5,
                                            py: 2,
                                            borderTop:
                                                "1px solid rgba(255,255,255,.05)",
                                        }}
                                    >

                                        <Typography
                                            sx={{
                                                fontSize: 12,
                                                fontWeight:
                                                    700,
                                                wordBreak:
                                                    "break-all",
                                            }}
                                        >
                                            {topic.name}
                                        </Typography>


                                        <Typography
                                            sx={{
                                                fontSize: 12,
                                                color:
                                                    "rgba(255,255,255,.6)",
                                            }}
                                        >
                                            {
                                                topic.partitions
                                            }
                                        </Typography>


                                        <Typography
                                            sx={{
                                                fontSize: 12,
                                                color:
                                                    "rgba(255,255,255,.6)",
                                            }}
                                        >
                                            {
                                                topic.replicationFactor
                                            }
                                        </Typography>


                                        <Typography
                                            sx={{
                                                fontSize: 12,
                                                fontWeight:
                                                    700,
                                                color:
                                                    "#76a7ff",
                                            }}
                                        >
                                            {formatNumber(
                                                topic.latestOffset
                                            )}
                                        </Typography>

                                    </Box>

                                )
                            )

                        )}

                    </Box>


                    {/* CONSUMER GROUPS */}

                    <Box
                        sx={{
                            borderRadius: 3,
                            border:
                                "1px solid rgba(255,255,255,.08)",
                            background:
                                "rgba(255,255,255,.02)",
                            overflow:
                                "hidden",
                        }}
                    >

                        <Box
                            sx={{
                                px: 2.5,
                                py: 2,
                                borderBottom:
                                    "1px solid rgba(255,255,255,.07)",
                            }}
                        >

                            <Box
                                sx={{
                                    display:
                                        "flex",
                                    alignItems:
                                        "center",
                                    gap: 1,
                                }}
                            >

                                <GroupsRounded
                                    sx={{
                                        color:
                                            "#fbbf24",
                                    }}
                                />

                                <Typography
                                    sx={{
                                        fontSize: 15,
                                        fontWeight: 800,
                                    }}
                                >
                                    Consumer Groups
                                </Typography>

                            </Box>

                        </Box>


                        <Box
                            sx={{
                                display: {
                                    xs:
                                        "none",
                                    md:
                                        "grid",
                                },
                                gridTemplateColumns:
                                    "2fr 1fr 1fr 1fr",
                                gap: 2,
                                px: 2.5,
                                py: 1.3,
                                background:
                                    "rgba(255,255,255,.02)",
                            }}
                        >

                            {[
                                "Group",
                                "State",
                                "Members",
                                "Lag",
                            ].map(
                                (heading) => (

                                    <Typography
                                        key={
                                            heading
                                        }
                                        sx={{
                                            fontSize: 10,
                                            color:
                                                "rgba(255,255,255,.35)",
                                            textTransform:
                                                "uppercase",
                                            letterSpacing:
                                                .8,
                                        }}
                                    >
                                        {heading}
                                    </Typography>

                                )
                            )}

                        </Box>


                        {consumerGroups.length === 0 ? (

                            <Box
                                sx={{
                                    py: 6,
                                    textAlign:
                                        "center",
                                }}
                            >
                                <Typography
                                    sx={{
                                        color:
                                            "rgba(255,255,255,.4)",
                                        fontSize: 13,
                                    }}
                                >
                                    No consumer
                                    groups found.
                                </Typography>
                            </Box>

                        ) : (

                            consumerGroups.map(
                                (group) => {

                                    const color =
                                        getGroupColor(
                                            group.state
                                        );

                                    return (

                                        <Box
                                            key={
                                                group.groupId
                                            }
                                            sx={{
                                                display:
                                                    "grid",
                                                gridTemplateColumns:
                                                    {
                                                        xs:
                                                            "1fr",
                                                        md:
                                                            "2fr 1fr 1fr 1fr",
                                                    },
                                                gap: 2,
                                                alignItems:
                                                    "center",
                                                px: 2.5,
                                                py: 2,
                                                borderTop:
                                                    "1px solid rgba(255,255,255,.05)",
                                            }}
                                        >

                                            <Typography
                                                sx={{
                                                    fontSize: 12,
                                                    fontWeight:
                                                        700,
                                                    wordBreak:
                                                        "break-all",
                                                }}
                                            >
                                                {
                                                    group.groupId
                                                }
                                            </Typography>


                                            <Chip
                                                size="small"
                                                label={
                                                    group.state
                                                }
                                                sx={{
                                                    width:
                                                        "fit-content",
                                                    color,
                                                    background:
                                                        `${color}14`,
                                                    border:
                                                        `1px solid ${color}35`,
                                                    fontSize:
                                                        10,
                                                    fontWeight:
                                                        800,
                                                }}
                                            />


                                            <Typography
                                                sx={{
                                                    fontSize: 12,
                                                    color:
                                                        "rgba(255,255,255,.6)",
                                                }}
                                            >
                                                {
                                                    group.members
                                                }
                                            </Typography>


                                            <Typography
                                                sx={{
                                                    fontSize: 12,
                                                    fontWeight:
                                                        800,
                                                    color:
                                                        Number(
                                                            group.lag ||
                                                                0
                                                        ) > 0
                                                            ? "#fbbf24"
                                                            : "#35d98b",
                                                }}
                                            >
                                                {formatNumber(
                                                    group.lag
                                                )}
                                            </Typography>

                                        </Box>

                                    );
                                }
                            )

                        )}

                    </Box>

                </>

            )}

        </Box>
    );
}