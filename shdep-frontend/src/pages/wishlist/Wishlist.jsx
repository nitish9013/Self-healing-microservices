import { useState, useEffect } from "react";
import {
    Box,
    Typography,
    Card,
    CardContent,
    Button,
    Chip,
    IconButton,
    TextField,
    InputAdornment,
    MenuItem,
    Snackbar,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogContentText,
    DialogActions,
    Tooltip,
} from "@mui/material";

import {
    FavoriteRounded,
    FavoriteBorderRounded,
    DeleteOutlineRounded,
    ShoppingCartOutlined,
    StorefrontRounded,
    SearchRounded,
    ArrowForwardRounded,
    CheckCircleOutlineRounded,
    ClearAllRounded,
} from "@mui/icons-material";

import { useNavigate } from "react-router-dom";
import DashboardHeader from "../../components/dashboard/DashboardHeader";
import Sidebar from "../../components/dashboard/Sidebar";
import wishlistService from "../../services/wishlistService";

export default function Wishlist() {
    const navigate = useNavigate();

    const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);
    const [wishlist, setWishlist] = useState(() => wishlistService.getWishlist());
    const [searchQuery, setSearchQuery] = useState("");
    const [selectedCategory, setSelectedCategory] = useState("ALL");
    const [notification, setNotification] = useState("");
    const [clearDialogOpen, setClearDialogOpen] = useState(false);

    useEffect(() => {
        const handleWishlistChange = () => {
            setWishlist(wishlistService.getWishlist());
        };
        window.addEventListener("shdep_wishlist_changed", handleWishlistChange);
        return () => window.removeEventListener("shdep_wishlist_changed", handleWishlistChange);
    }, []);

    const handleRemove = (productId, productName) => {
        wishlistService.removeFromWishlist(productId);
        setWishlist((prev) => prev.filter((item) => String(item.id) !== String(productId)));
        setNotification(`"${productName || "Item"}" removed from wishlist.`);
    };

    const handleClearAll = () => {
        wishlistService.clearWishlist();
        setWishlist([]);
        setClearDialogOpen(false);
        setNotification("Wishlist cleared completely.");
    };

    // Categories available in wishlist
    const categories = ["ALL", ...new Set(wishlist.map((item) => item.categoryName).filter(Boolean))];

    // Filtered wishlist
    const filteredItems = wishlist.filter((item) => {
        const matchesSearch =
            !searchQuery ||
            item.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
            item.description?.toLowerCase().includes(searchQuery.toLowerCase());
        const matchesCategory =
            selectedCategory === "ALL" || item.categoryName === selectedCategory;
        return matchesSearch && matchesCategory;
    });

    const totalValue = wishlist.reduce((acc, item) => acc + (Number(item.price) || 0), 0);
    const inStockCount = wishlist.filter((item) => Number(item.stockQuantity) > 0).length;

    return (
        <Box
            sx={{
                minHeight: "100vh",
                width: "100%",
                background: "linear-gradient(135deg, #080F23 0%, #0F172A 55%, #111827 100%)",
                color: "#fff",
            }}
        >
            {/* TOP HEADER */}
            <DashboardHeader onMenuClick={() => setMobileSidebarOpen(true)} />

            {/* SIDEBAR + MAIN CONTENT */}
            <Box sx={{ display: "flex", width: "100%" }}>
                <Sidebar
                    mobileOpen={mobileSidebarOpen}
                    onClose={() => setMobileSidebarOpen(false)}
                />

                <Box sx={{ flex: 1, minWidth: 0 }}>
                    <Box
                        sx={{
                            width: "100%",
                            maxWidth: 1600,
                            mx: "auto",
                            px: { xs: 2, sm: 3, md: 4, lg: 5, xl: 6 },
                            py: { xs: 3, md: 4 },
                        }}
                    >
                        {/* HEADER BANNER */}
                        <Box
                            sx={{
                                p: { xs: 3, md: 4 },
                                mb: 4,
                                borderRadius: 4,
                                background:
                                    "linear-gradient(135deg, rgba(236,72,153,.15) 0%, rgba(30,41,59,.8) 100%)",
                                border: "1px solid rgba(244,114,182,.25)",
                                backdropFilter: "blur(20px)",
                                display: "flex",
                                flexDirection: { xs: "column", md: "row" },
                                alignItems: { xs: "flex-start", md: "center" },
                                justifyContent: "space-between",
                                gap: 3,
                            }}
                        >
                            <Box>
                                <Box sx={{ display: "flex", alignItems: "center", gap: 1.8, mb: 1 }}>
                                    <Box
                                        sx={{
                                            width: 48,
                                            height: 48,
                                            borderRadius: 3,
                                            background: "rgba(244,114,182,.15)",
                                            border: "1px solid rgba(244,114,182,.3)",
                                            color: "#F472B6",
                                            display: "flex",
                                            alignItems: "center",
                                            justifyContent: "center",
                                        }}
                                    >
                                        <FavoriteRounded sx={{ fontSize: 26 }} />
                                    </Box>
                                    <div>
                                        <Typography
                                            variant="h4"
                                            sx={{
                                                fontWeight: 800,
                                                color: "#F8FAFC",
                                                fontSize: { xs: 22, md: 28 },
                                                letterSpacing: "-.5px",
                                            }}
                                        >
                                            My Wishlist
                                        </Typography>
                                        <Typography sx={{ color: "#94A3B8", fontSize: 13, mt: 0.3 }}>
                                            Keep track of microservice products and services you want to purchase
                                        </Typography>
                                    </div>
                                </Box>

                                {/* STATS CHIPS */}
                                <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1.5, mt: 2 }}>
                                    <Chip
                                        icon={<FavoriteRounded sx={{ fontSize: "16px !important", color: "#F472B6 !important" }} />}
                                        label={`${wishlist.length} Items Saved`}
                                        sx={{
                                            background: "rgba(244,114,182,.1)",
                                            color: "#FBCFE8",
                                            border: "1px solid rgba(244,114,182,.2)",
                                            fontWeight: 600,
                                            fontSize: 12,
                                        }}
                                    />
                                    <Chip
                                        icon={<CheckCircleOutlineRounded sx={{ fontSize: "16px !important", color: "#4ADE80 !important" }} />}
                                        label={`${inStockCount} In Stock`}
                                        sx={{
                                            background: "rgba(34,197,94,.1)",
                                            color: "#86EFAC",
                                            border: "1px solid rgba(34,197,94,.2)",
                                            fontWeight: 600,
                                            fontSize: 12,
                                        }}
                                    />
                                    <Chip
                                        label={`Est. Total: ₹${totalValue.toLocaleString("en-IN")}`}
                                        sx={{
                                            background: "rgba(59,130,246,.1)",
                                            color: "#93C5FD",
                                            border: "1px solid rgba(59,130,246,.2)",
                                            fontWeight: 700,
                                            fontSize: 12,
                                        }}
                                    />
                                </Box>
                            </Box>

                            {/* ACTIONS */}
                            <Box sx={{ display: "flex", gap: 1.5, flexWrap: "wrap" }}>
                                <Button
                                    variant="outlined"
                                    startIcon={<StorefrontRounded />}
                                    onClick={() => navigate("/catalog")}
                                    sx={{
                                        borderRadius: 2.5,
                                        color: "#93C5FD",
                                        borderColor: "rgba(59,130,246,.3)",
                                        textTransform: "none",
                                        fontWeight: 700,
                                        "&:hover": {
                                            borderColor: "#60A5FA",
                                            background: "rgba(59,130,246,.1)",
                                        },
                                    }}
                                >
                                    Browse Catalog
                                </Button>

                                {wishlist.length > 0 && (
                                    <Button
                                        variant="outlined"
                                        color="error"
                                        startIcon={<ClearAllRounded />}
                                        onClick={() => setClearDialogOpen(true)}
                                        sx={{
                                            borderRadius: 2.5,
                                            borderColor: "rgba(239,68,68,.3)",
                                            color: "#FCA5A5",
                                            textTransform: "none",
                                            fontWeight: 600,
                                            "&:hover": {
                                                borderColor: "#EF4444",
                                                background: "rgba(239,68,68,.1)",
                                            },
                                        }}
                                    >
                                        Clear All
                                    </Button>
                                )}
                            </Box>
                        </Box>

                        {/* SEARCH & FILTER CONTROLS */}
                        {wishlist.length > 0 && (
                            <Box
                                sx={{
                                    display: "flex",
                                    flexDirection: { xs: "column", sm: "row" },
                                    gap: 2,
                                    mb: 3,
                                    p: 2,
                                    borderRadius: 3,
                                    background: "rgba(18,28,48,.65)",
                                    border: "1px solid rgba(255,255,255,.07)",
                                }}
                            >
                                <TextField
                                    fullWidth
                                    size="small"
                                    placeholder="Search saved products..."
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    InputProps={{
                                        startAdornment: (
                                            <InputAdornment position="start">
                                                <SearchRounded sx={{ color: "#64748B", fontSize: 20 }} />
                                            </InputAdornment>
                                        ),
                                    }}
                                    sx={{
                                        "& .MuiOutlinedInput-root": {
                                            borderRadius: 2.2,
                                            background: "rgba(255,255,255,.03)",
                                            color: "#fff",
                                            "& fieldset": { borderColor: "rgba(255,255,255,.08)" },
                                            "&:hover fieldset": { borderColor: "#3B82F6" },
                                        },
                                    }}
                                />

                                <TextField
                                    select
                                    size="small"
                                    value={selectedCategory}
                                    onChange={(e) => setSelectedCategory(e.target.value)}
                                    sx={{
                                        minWidth: { xs: "100%", sm: 220 },
                                        "& .MuiOutlinedInput-root": {
                                            borderRadius: 2.2,
                                            background: "rgba(255,255,255,.03)",
                                            color: "#fff",
                                            "& fieldset": { borderColor: "rgba(255,255,255,.08)" },
                                        },
                                    }}
                                >
                                    {categories.map((cat) => (
                                        <MenuItem key={cat} value={cat}>
                                            {cat === "ALL" ? "All Categories" : cat}
                                        </MenuItem>
                                    ))}
                                </TextField>
                            </Box>
                        )}

                        {/* WISHLIST ITEMS GRID */}
                        {filteredItems.length > 0 ? (
                            <Box
                                sx={{
                                    display: "grid",
                                    gridTemplateColumns: {
                                        xs: "1fr",
                                        sm: "repeat(2, 1fr)",
                                        lg: "repeat(3, 1fr)",
                                        xl: "repeat(4, 1fr)",
                                    },
                                    gap: 2.5,
                                }}
                            >
                                {filteredItems.map((item) => {
                                    const inStock = Number(item.stockQuantity) > 0;
                                    return (
                                        <Card
                                            key={item.id}
                                            elevation={0}
                                            sx={{
                                                borderRadius: 3.5,
                                                background: "rgba(18,28,48,.7)",
                                                border: "1px solid rgba(255,255,255,.08)",
                                                backdropFilter: "blur(20px)",
                                                overflow: "hidden",
                                                display: "flex",
                                                flexDirection: "column",
                                                transition: "all .25s ease",
                                                "&:hover": {
                                                    transform: "translateY(-4px)",
                                                    borderColor: "rgba(244,114,182,.4)",
                                                    boxShadow: "0 12px 30px rgba(0,0,0,.3)",
                                                },
                                            }}
                                        >
                                            {/* IMAGE CONTAINER */}
                                            <Box
                                                sx={{
                                                    position: "relative",
                                                    width: "100%",
                                                    height: 180,
                                                    background: "linear-gradient(135deg, #111827, #1E293B)",
                                                    overflow: "hidden",
                                                }}
                                            >
                                                {item.imageUrl ? (
                                                    <Box
                                                        component="img"
                                                        src={item.imageUrl}
                                                        alt={item.name}
                                                        sx={{
                                                            width: "100%",
                                                            height: "100%",
                                                            objectFit: "cover",
                                                        }}
                                                    />
                                                ) : (
                                                    <Box
                                                        sx={{
                                                            width: "100%",
                                                            height: "100%",
                                                            display: "flex",
                                                            alignItems: "center",
                                                            justifyContent: "center",
                                                            color: "#64748B",
                                                        }}
                                                    >
                                                        <FavoriteBorderRounded sx={{ fontSize: 44, opacity: 0.5 }} />
                                                    </Box>
                                                )}

                                                {/* STOCK BADGE */}
                                                <Chip
                                                    label={inStock ? "In Stock" : "Out of Stock"}
                                                    size="small"
                                                    sx={{
                                                        position: "absolute",
                                                        top: 10,
                                                        left: 10,
                                                        height: 24,
                                                        fontSize: 11,
                                                        fontWeight: 700,
                                                        background: inStock
                                                            ? "rgba(34,197,94,.85)"
                                                            : "rgba(239,68,68,.85)",
                                                        color: "#fff",
                                                        backdropFilter: "blur(4px)",
                                                    }}
                                                />

                                                {/* REMOVE BUTTON */}
                                                <Tooltip title="Remove from wishlist">
                                                    <IconButton
                                                        onClick={() => handleRemove(item.id, item.name)}
                                                        sx={{
                                                            position: "absolute",
                                                            top: 10,
                                                            right: 10,
                                                            width: 32,
                                                            height: 32,
                                                            background: "rgba(15,23,42,.8)",
                                                            color: "#F472B6",
                                                            backdropFilter: "blur(4px)",
                                                            border: "1px solid rgba(255,255,255,.15)",
                                                            "&:hover": {
                                                                background: "#EF4444",
                                                                color: "#fff",
                                                            },
                                                        }}
                                                    >
                                                        <DeleteOutlineRounded sx={{ fontSize: 18 }} />
                                                    </IconButton>
                                                </Tooltip>
                                            </Box>

                                            {/* CARD BODY */}
                                            <CardContent sx={{ p: 2.5, flex: 1, display: "flex", flexDirection: "column" }}>
                                                {item.categoryName && (
                                                    <Typography
                                                        sx={{
                                                            color: "#60A5FA",
                                                            fontSize: 11,
                                                            fontWeight: 700,
                                                            textTransform: "uppercase",
                                                            letterSpacing: ".6px",
                                                            mb: 0.5,
                                                        }}
                                                    >
                                                        {item.categoryName}
                                                    </Typography>
                                                )}

                                                <Typography
                                                    sx={{
                                                        color: "#F8FAFC",
                                                        fontWeight: 750,
                                                        fontSize: 16,
                                                        lineHeight: 1.3,
                                                        mb: 1,
                                                        display: "-webkit-box",
                                                        WebkitLineClamp: 2,
                                                        WebkitBoxOrient: "vertical",
                                                        overflow: "hidden",
                                                    }}
                                                >
                                                    {item.name}
                                                </Typography>

                                                <Typography
                                                    sx={{
                                                        color: "#94A3B8",
                                                        fontSize: 12,
                                                        lineHeight: 1.5,
                                                        mb: 2,
                                                        flex: 1,
                                                        display: "-webkit-box",
                                                        WebkitLineClamp: 2,
                                                        WebkitBoxOrient: "vertical",
                                                        overflow: "hidden",
                                                    }}
                                                >
                                                    {item.description || "Microservice component ready for deployment."}
                                                </Typography>

                                                <Box
                                                    sx={{
                                                        display: "flex",
                                                        alignItems: "center",
                                                        justifyContent: "space-between",
                                                        mb: 2,
                                                        pt: 1.5,
                                                        borderTop: "1px solid rgba(255,255,255,.06)",
                                                    }}
                                                >
                                                    <Box>
                                                        <Typography sx={{ color: "#64748B", fontSize: 10, textTransform: "uppercase" }}>
                                                            Price
                                                        </Typography>
                                                        <Typography sx={{ color: "#F8FAFC", fontWeight: 800, fontSize: 18 }}>
                                                            ₹{Number(item.price || 0).toLocaleString("en-IN")}
                                                        </Typography>
                                                    </Box>
                                                    <Typography sx={{ color: "#64748B", fontSize: 11 }}>
                                                        {item.stockQuantity} units left
                                                    </Typography>
                                                </Box>

                                                {/* ACTION BUTTONS */}
                                                <Box sx={{ display: "flex", gap: 1 }}>
                                                    <Button
                                                        fullWidth
                                                        variant="contained"
                                                        startIcon={<ShoppingCartOutlined sx={{ fontSize: 17 }} />}
                                                        onClick={() => navigate("/orders")}
                                                        disabled={!inStock}
                                                        sx={{
                                                            height: 38,
                                                            borderRadius: 2,
                                                            textTransform: "none",
                                                            fontSize: 12.5,
                                                            fontWeight: 700,
                                                            background: inStock
                                                                ? "linear-gradient(90deg, #2563EB, #0EA5E9)"
                                                                : "rgba(255,255,255,.05)",
                                                            color: inStock ? "#fff" : "#64748B",
                                                        }}
                                                    >
                                                        {inStock ? "Order Now" : "Unavailable"}
                                                    </Button>

                                                    <Button
                                                        variant="outlined"
                                                        onClick={() => {
                                                            if (item.id && !String(item.id).startsWith("prod-wl")) {
                                                                navigate(`/catalog/product/${item.id}`);
                                                            } else {
                                                                navigate("/catalog");
                                                            }
                                                        }}
                                                        sx={{
                                                            minWidth: 40,
                                                            px: 1.5,
                                                            height: 38,
                                                            borderRadius: 2,
                                                            color: "#93C5FD",
                                                            borderColor: "rgba(59,130,246,.25)",
                                                            "&:hover": {
                                                                borderColor: "#3B82F6",
                                                                background: "rgba(59,130,246,.1)",
                                                            },
                                                        }}
                                                    >
                                                        <ArrowForwardRounded sx={{ fontSize: 18 }} />
                                                    </Button>
                                                </Box>
                                            </CardContent>
                                        </Card>
                                    );
                                })}
                            </Box>
                        ) : (
                            /* EMPTY STATE */
                            <Box
                                sx={{
                                    py: 8,
                                    px: 3,
                                    borderRadius: 4,
                                    background: "rgba(18,28,48,.6)",
                                    border: "1px dashed rgba(255,255,255,.12)",
                                    textAlign: "center",
                                    display: "flex",
                                    flexDirection: "column",
                                    alignItems: "center",
                                    justifyContent: "center",
                                    gap: 2,
                                }}
                            >
                                <Box
                                    sx={{
                                        width: 72,
                                        height: 72,
                                        borderRadius: "50%",
                                        background: "rgba(244,114,182,.1)",
                                        border: "1px solid rgba(244,114,182,.2)",
                                        color: "#F472B6",
                                        display: "flex",
                                        alignItems: "center",
                                        justifyContent: "center",
                                    }}
                                >
                                    <FavoriteBorderRounded sx={{ fontSize: 36 }} />
                                </Box>
                                <Typography variant="h5" sx={{ fontWeight: 800, color: "#F8FAFC" }}>
                                    {wishlist.length === 0 ? "Your wishlist is empty" : "No items match your filter"}
                                </Typography>
                                <Typography sx={{ color: "#94A3B8", maxWidth: 450, fontSize: 14 }}>
                                    {wishlist.length === 0
                                        ? "Explore our enterprise catalog to discover microservice components and save items for easy access."
                                        : "Try adjusting your search query or category filter to find the saved item."}
                                </Typography>
                                <Button
                                    variant="contained"
                                    startIcon={<StorefrontRounded />}
                                    onClick={() => navigate("/catalog")}
                                    sx={{
                                        mt: 1,
                                        borderRadius: 2.5,
                                        px: 3,
                                        py: 1.2,
                                        textTransform: "none",
                                        fontWeight: 700,
                                        background: "linear-gradient(90deg, #2563EB, #0EA5E9)",
                                    }}
                                >
                                    Explore Catalog
                                </Button>
                            </Box>
                        )}
                    </Box>
                </Box>
            </Box>

            {/* CLEAR CONFIRM DIALOG */}
            <Dialog
                open={clearDialogOpen}
                onClose={() => setClearDialogOpen(false)}
                PaperProps={{
                    sx: {
                        background: "#0F172A",
                        border: "1px solid rgba(255,255,255,.12)",
                        borderRadius: 3.5,
                        color: "#fff",
                    },
                }}
            >
                <DialogTitle sx={{ fontWeight: 700 }}>Clear Entire Wishlist?</DialogTitle>
                <DialogContent>
                    <DialogContentText sx={{ color: "#94A3B8" }}>
                        Are you sure you want to remove all saved items from your wishlist? This action cannot be undone.
                    </DialogContentText>
                </DialogContent>
                <DialogActions sx={{ p: 2 }}>
                    <Button onClick={() => setClearDialogOpen(false)} sx={{ color: "#94A3B8" }}>
                        Cancel
                    </Button>
                    <Button onClick={handleClearAll} variant="contained" color="error" sx={{ borderRadius: 2 }}>
                        Yes, Clear All
                    </Button>
                </DialogActions>
            </Dialog>

            {/* NOTIFICATION TOAST */}
            <Snackbar
                open={Boolean(notification)}
                autoHideDuration={3500}
                onClose={() => setNotification("")}
                message={notification}
                anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
            />
        </Box>
    );
}
