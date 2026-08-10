import {
    Box,
    Card,
    Typography,
    Button,
} from "@mui/material";

import HelpOutlineRoundedIcon from "@mui/icons-material/HelpOutlineRounded";
import MenuBookRoundedIcon from "@mui/icons-material/MenuBookRounded";
import SupportAgentRoundedIcon from "@mui/icons-material/SupportAgentRounded";


export default function SupportCard() {

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
                    "linear-gradient(145deg, rgba(37,99,235,.14), rgba(18,28,48,.78))",

                border:
                    "1px solid rgba(96,165,250,.15)",

                backdropFilter:
                    "blur(20px)",

                display: "flex",

                flexDirection: "column",
            }}
        >

            {/* Icon */}

            <Box
                sx={{
                    width: 48,
                    height: 48,

                    borderRadius: 3,

                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",

                    background:
                        "rgba(59,130,246,.12)",

                    color: "#60A5FA",

                    mb: 2,
                }}
            >
                <HelpOutlineRoundedIcon />
            </Box>


            {/* Heading */}

            <Typography
                sx={{
                    color: "#fff",
                    fontSize: 20,
                    fontWeight: 700,
                }}
            >
                Need Help?
            </Typography>


            <Typography
                sx={{
                    mt: 1,

                    color: "#94A3B8",

                    fontSize: 13,

                    lineHeight: 1.7,
                }}
            >
                Need assistance with your account,
                orders or payments? We're here to
                help.
            </Typography>


            {/* Actions */}

            <Box
                sx={{
                    mt: 3,

                    display: "flex",

                    flexDirection: "column",

                    gap: 1.5,
                }}
            >

                <Button
                    variant="outlined"
                    startIcon={<MenuBookRoundedIcon />}
                    sx={{
                        justifyContent: "flex-start",

                        borderRadius: 3,

                        color: "#CBD5E1",

                        borderColor:
                            "rgba(255,255,255,.10)",

                        textTransform: "none",

                        "&:hover": {
                            borderColor: "#3B82F6",

                            background:
                                "rgba(59,130,246,.08)",
                        },
                    }}
                >
                    Documentation
                </Button>


                <Button
                    variant="contained"
                    startIcon={<SupportAgentRoundedIcon />}
                    sx={{
                        justifyContent: "flex-start",

                        borderRadius: 3,

                        textTransform: "none",

                        fontWeight: 700,

                        background:
                            "linear-gradient(90deg,#2563EB,#0EA5E9)",

                        "&:hover": {
                            background:
                                "linear-gradient(90deg,#1D4ED8,#0284C7)",
                        },
                    }}
                >
                    Contact Support
                </Button>

            </Box>

        </Card>
    );
}