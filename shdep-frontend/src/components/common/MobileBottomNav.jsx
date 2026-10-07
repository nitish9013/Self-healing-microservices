import {
    Box,
    BottomNavigation,
    BottomNavigationAction,
    Badge,
} from "@mui/material";
import {
    HomeRounded,
    StorefrontRounded,
    ShoppingBagOutlined,
    FavoriteBorderRounded,
    PersonOutlineRounded,
} from "@mui/icons-material";
import { useLocation, useNavigate } from "react-router-dom";
import { useCart } from "../../context/CartContext";
import { useAuth } from "../../context/AuthContext";

export default function MobileBottomNav() {
    const navigate = useNavigate();
    const location = useLocation();
    const { getCartCount, openCartDrawer } = useCart();
    const { isAuthenticated } = useAuth();

    const currentPath = location.pathname;

    if (!isAuthenticated ||
        currentPath === "/login" ||
        currentPath === "/register" ||
        currentPath === "/" ||
        currentPath.startsWith("/admin")) {
        return null;
    }

    return (
        <Box
            sx={{
                position: "fixed",
                bottom: 0,
                left: 0,
                right: 0,
                zIndex: 1200,
                display: { xs: "block", md: "none" },
                background: "rgba(10, 16, 31, 0.92)",
                backdropFilter: "blur(20px)",
                borderTop: "1px solid rgba(255, 255, 255, 0.08)",
                boxShadow: "0 -10px 25px rgba(0, 0, 0, 0.5)",
            }}
        >
            <BottomNavigation
                showLabels
                value={currentPath}
                onChange={(event, newValue) => {
                    if (newValue === "cart") {
                        openCartDrawer();
                    } else {
                        navigate(newValue);
                    }
                }}
                sx={{
                    background: "transparent",
                    height: 64,
                    "& .MuiBottomNavigationAction-root": {
                        color: "#64748B",
                        minWidth: 0,
                        padding: "6px 0",
                        "&.Mui-selected": {
                            color: "#38BDF8",
                        },
                    },
                    "& .MuiBottomNavigationAction-label": {
                        fontSize: "0.72rem",
                        fontWeight: 600,
                        mt: 0.3,
                        "&.Mui-selected": {
                            fontSize: "0.72rem",
                            fontWeight: 700,
                        },
                    },
                }}
            >
                <BottomNavigationAction
                    label="Home"
                    value="/dashboard"
                    icon={<HomeRounded sx={{ fontSize: 22 }} />}
                />
                <BottomNavigationAction
                    label="Catalog"
                    value="/catalog"
                    icon={<StorefrontRounded sx={{ fontSize: 22 }} />}
                />
                <BottomNavigationAction
                    label="Cart"
                    value="cart"
                    icon={
                        <Badge
                            badgeContent={getCartCount()}
                            color="primary"
                            sx={{
                                "& .MuiBadge-badge": {
                                    background: "#2563EB",
                                    color: "#fff",
                                    fontSize: 10,
                                    height: 16,
                                    minWidth: 16,
                                },
                            }}
                        >
                            <ShoppingBagOutlined sx={{ fontSize: 22 }} />
                        </Badge>
                    }
                />
                <BottomNavigationAction
                    label="Wishlist"
                    value="/wishlist"
                    icon={<FavoriteBorderRounded sx={{ fontSize: 22 }} />}
                />
                <BottomNavigationAction
                    label="Profile"
                    value="/profile"
                    icon={<PersonOutlineRounded sx={{ fontSize: 22 }} />}
                />
            </BottomNavigation>
        </Box>
    );
}
