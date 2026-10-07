import {
    AccountCircleOutlined,
    DashboardOutlined,
    FavoriteBorderOutlined,
    HelpOutlineOutlined,
    LogoutRounded,
    PaymentsOutlined,
    SettingsOutlined,
    ShoppingBagOutlined,
    ShoppingCartOutlined,
    CategoryOutlined,
} from "@mui/icons-material";

import {
    Box,
    Divider,
    Typography,
} from "@mui/material";

import { useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { useCart } from "../../context/CartContext";


export default function Sidebar({
    mobileOpen = false,
    onClose,
}) {

    const navigate = useNavigate();
    const location = useLocation();
    const currentPath = location.pathname;

    const { logout } = useAuth();
    const {
    role,
} = useAuth();
    const { getCartCount } = useCart();
    const cartCount = getCartCount();


const normalizedRole =
    String(role || "")
        .replace("ROLE_", "")
        .toUpperCase();

const isAdmin =
    normalizedRole === "ADMIN";

    const handleLogout = () => {

        logout();

        navigate("/login");

        if (onClose) {
            onClose();
        }
    };
    const handleNavigation = (path) => {

    if (!path) {
        return;
    }

    navigate(path);

    onClose?.();
};


    const handleHome = () => {

        navigate("/dashboard");

        if (onClose) {
            onClose();
        }
    };


    const mainNavigation = [

        {
            label: "Home",
            icon: DashboardOutlined,
            active: currentPath === "/dashboard" || currentPath === "/",
            onClick: handleHome,
        },

    {
    label: "Catalog",
    icon: ShoppingBagOutlined,
    active: currentPath === "/catalog" || (currentPath.startsWith("/catalog") && currentPath !== "/catalog/categories"),
    path: "/catalog",
},

{
    label: "Cart",
    icon: ShoppingCartOutlined,
    badge: cartCount > 0 ? cartCount : null,
    active: currentPath === "/cart",
    path: "/cart",
},

{
    label: "Manage Categories",
    icon: CategoryOutlined,
    visible: isAdmin,
    active: currentPath === "/catalog/categories",
    onClick: () => {
        navigate("/catalog/categories");

        if (onClose) {
            onClose();
        }
    },
},

        {
            label: "Orders",
            icon: ShoppingBagOutlined,
            active: currentPath.startsWith("/orders"),
            path: "/orders",
        },

        {
            label: "Payments",
            icon: PaymentsOutlined,
            active: currentPath.startsWith("/payments"),
            path: "/payments",
        },

        {
            label: "Wishlist",
            icon: FavoriteBorderOutlined,
            active: currentPath.startsWith("/wishlist"),
            path: "/wishlist",
        },

        {
            label: "Support",
            icon: HelpOutlineOutlined,
            active: currentPath.startsWith("/support"),
            path: "/support",
        },
    ];


    const accountNavigation = [

        {
            label: "Profile",
            icon: AccountCircleOutlined,
            active: currentPath.startsWith("/profile"),
            path: "/profile",
        },

        {
            label: "Settings",
            icon: SettingsOutlined,
            active: currentPath.startsWith("/settings"),
            path: "/settings",
        },
    ];


    const renderNavigationItem = (item) => {

         if (item.visible === false) {
        return null;
    }
    
        const Icon = item.icon;


        return (

            <Box
                key={item.label}

                component="button"

                type="button"

              onClick={
    item.disabled
        ? undefined
        : item.onClick
            ? item.onClick
            : () => handleNavigation(item.path)
}

disabled={item.disabled}

                sx={{
                    width: "100%",

                    minHeight: 44,

                    px: 1.5,

                    border: "none",

                    borderRadius: 2.2,

                    display: "flex",

                    alignItems: "center",

                    gap: 1.4,

                    background:
                        item.active
                            ? "rgba(59,130,246,.12)"
                            : "transparent",

                    color:
                        item.active
                            ? "#93C5FD"
                            : "#64748B",

                    cursor:
                        item.disabled
                            ? "default"
                            : "pointer",

                    opacity:
                        item.disabled
                            ? 0.55
                            : 1,

                    textAlign: "left",

                    transition:
                        "all .2s ease",

                    "&:hover":
                        !item.disabled
                            ? {
                                background:
                                    "rgba(59,130,246,.08)",

                                color: "#BFDBFE",
                            }
                            : {},

                    "&.Mui-disabled": {
                        color: "#64748B",

                        opacity: 0.55,
                    },
                }}
            >

                <Icon
                    sx={{
                        fontSize: 20,

                        flexShrink: 0,

                        color:
                            item.active
                                ? "#60A5FA"
                                : "inherit",
                    }}
                />


                <Typography
                    sx={{
                        fontSize: 12.5,

                        fontWeight:
                            item.active
                                ? 700
                                : 600,

                        color: "inherit",
                    }}
                >
                    {item.label}
                </Typography>


                {item.badge != null && (
                    <Box
                        sx={{
                            marginLeft: "auto",
                            px: 0.9,
                            py: 0.2,
                            borderRadius: 10,
                            background: "rgba(59, 130, 246, 0.2)",
                            border: "1px solid rgba(59, 130, 246, 0.35)",
                            color: "#60A5FA",
                            fontSize: 10,
                            fontWeight: 700,
                        }}
                    >
                        {item.badge}
                    </Box>
                )}

                {item.disabled && (

                    <Typography
                        sx={{
                            marginLeft: "auto",

                            fontSize: 8,

                            color: "#475569",

                            letterSpacing: ".5px",

                            textTransform:
                                "uppercase",
                        }}
                    >
                        Soon
                    </Typography>

                )}

            </Box>
        );
    };


    return (
        
  <>
        {/* MOBILE OVERLAY */}

        {mobileOpen && (
            <Box
                onClick={onClose}
                sx={{
                    position: "fixed",
                    inset: 0,
                    zIndex: 1199,

                    display: {
                        xs: "block",
                        md: "none",
                    },

                    background:
                        "rgba(0,0,0,.55)",

                    backdropFilter:
                        "blur(3px)",
                }}
            />
        )}


        <Box
            sx={{
                position: {
                    xs: "fixed",
                    md: "sticky",
                },

                top: {
                    xs: 0,
                    md: 72,
                },

                left: 0,

                zIndex: 1200,

                width: {
                    xs: 280,
                    md: 245,
                    lg: 260,
                },

                height: {
                    xs: "100vh",
                    md: "calc(100vh - 72px)",
                },

                flexShrink: 0,

                display: {
                    xs: mobileOpen
                        ? "flex"
                        : "none",

                    md: "flex",
                },

                flexDirection: "column",

                background:
                    "rgba(8,15,35,.96)",

                borderRight:
                    "1px solid rgba(255,255,255,.07)",

                backdropFilter:
                    "blur(20px)",

                overflowY: "auto",

                "&::-webkit-scrollbar": {
                    width: 4,
                },

                "&::-webkit-scrollbar-thumb": {
                    background:
                        "rgba(255,255,255,.08)",

                    borderRadius: 10,
                },
            }}
        >

            {/* =================================
                MOBILE CLOSE
            ================================= */}

            <Box
                sx={{
                    display: {
                        xs: "flex",
                        md: "none",
                    },

                    alignItems: "center",

                    justifyContent:
                        "space-between",

                    px: 2,

                    py: 2,
                }}
            >

                <Typography
                    sx={{
                        color: "#F8FAFC",

                        fontWeight: 800,

                        fontSize: 15,
                    }}
                >
                    Navigation
                </Typography>


                <Box
                    component="button"

                    onClick={onClose}

                    sx={{
                        border: "none",

                        background:
                            "transparent",

                        color: "#64748B",

                        cursor: "pointer",

                        fontSize: 20,
                    }}
                >
                    ×
                </Box>

            </Box>


            {/* =================================
                MAIN NAVIGATION
            ================================= */}

            <Box
                sx={{
                    px: 1.5,

                    pt: {
                        xs: 1,
                        md: 2.5,
                    },
                }}
            >

                <Typography
                    sx={{
                        px: 1.2,

                        mb: 1,

                        color: "#475569",

                        fontSize: 9,

                        fontWeight: 800,

                        letterSpacing: "1.4px",

                        textTransform:
                            "uppercase",
                    }}
                >
                    Workspace
                </Typography>


                <Box
                    sx={{
                        display: "flex",

                        flexDirection: "column",

                        gap: .45,
                    }}
                >

                    {mainNavigation.map(
                        renderNavigationItem
                    )}

                </Box>

            </Box>


            <Divider
                sx={{
                    my: 2,

                    borderColor:
                        "rgba(255,255,255,.06)",
                }}
            />


            {/* =================================
                ACCOUNT
            ================================= */}

            <Box
                sx={{
                    px: 1.5,
                }}
            >

                <Typography
                    sx={{
                        px: 1.2,

                        mb: 1,

                        color: "#475569",

                        fontSize: 9,

                        fontWeight: 800,

                        letterSpacing: "1.4px",

                        textTransform:
                            "uppercase",
                    }}
                >
                    Account
                </Typography>


                <Box
                    sx={{
                        display: "flex",

                        flexDirection: "column",

                        gap: .45,
                    }}
                >

                    {accountNavigation.map(
                        renderNavigationItem
                    )}

                </Box>

            </Box>


            {/* =================================
                BOTTOM LOGOUT
            ================================= */}

            <Box
                sx={{
                    marginTop: "auto",

                    p: 1.5,
                }}
            >

                <Box
                    component="button"

                    type="button"

                    onClick={handleLogout}

                    sx={{
                        width: "100%",

                        minHeight: 44,

                        px: 1.5,

                        borderRadius: 2.2,

                        border:
                            "1px solid rgba(239,68,68,.12)",

                        background:
                            "rgba(239,68,68,.05)",

                        color: "#FCA5A5",

                        display: "flex",

                        alignItems: "center",

                        gap: 1.4,

                        cursor: "pointer",

                        transition:
                            "all .2s ease",

                        "&:hover": {
                            background:
                                "rgba(239,68,68,.10)",

                            borderColor:
                                "rgba(239,68,68,.25)",
                        },
                    }}
                >

                    <LogoutRounded
                        sx={{
                            fontSize: 19,
                        }}
                    />


                    <Typography
                        sx={{
                            fontSize: 12.5,

                            fontWeight: 700,
                        }}
                    >
                        Logout
                    </Typography>

                </Box>

            </Box>

        </Box>
        </>
    );
}