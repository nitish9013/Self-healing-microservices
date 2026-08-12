import {
    Alert,
    Box,
    Button,
    CircularProgress,
    FormControl,
    InputLabel,
    MenuItem,
    Select,
    TextField,
    Typography,
} from "@mui/material";

import {
    SearchRounded,
    RefreshRounded,
    Inventory2Outlined,
    CloseRounded,
} from "@mui/icons-material";

import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

import catalogService from "../../services/catalogService";

import DashboardHeader
    from "../../components/dashboard/DashboardHeader";

import ProductCard
    from "../../components/catalog/ProductCard";

import Sidebar
    from "../../components/dashboard/Sidebar";


export default function Catalog() {

    const navigate = useNavigate();
    const { role } = useAuth();
    const normalizedRole =
    String(role || "")
        .replace("ROLE_", "")
        .toUpperCase();

const canManageProducts =
    normalizedRole === "ADMIN" ||
    normalizedRole === "SALESMAN";


    /* ============================================
       SIDEBAR
    ============================================ */

    const [
        mobileSidebarOpen,
        setMobileSidebarOpen,
    ] = useState(false);


    /* ============================================
       PRODUCTS
    ============================================ */

    const [
        products,
        setProducts,
    ] = useState([]);


    /* ============================================
       CATEGORIES
    ============================================ */

    const [
        categories,
        setCategories,
    ] = useState([]);


    /* ============================================
       SEARCH
    ============================================ */

    const [
        searchKeyword,
        setSearchKeyword,
    ] = useState("");


    const [
        activeSearch,
        setActiveSearch,
    ] = useState("");


    /* ============================================
       CATEGORY
    ============================================ */

    const [
        selectedCategory,
        setSelectedCategory,
    ] = useState("");


    /* ============================================
       PAGINATION
    ============================================ */

    const [
        page,
        setPage,
    ] = useState(0);


    const [
        totalPages,
        setTotalPages,
    ] = useState(0);


    const pageSize = 12;


    /* ============================================
       STATES
    ============================================ */

    const [
        loading,
        setLoading,
    ] = useState(true);


    const [
        categoriesLoading,
        setCategoriesLoading,
    ] = useState(true);


    const [
        error,
        setError,
    ] = useState("");


    /* ============================================
       LOAD CATEGORIES
    ============================================ */

    const loadCategories = async () => {

        try {

            setCategoriesLoading(true);

            const data =
                await catalogService
                    .getCategories();


            setCategories(
                Array.isArray(data)
                    ? data
                    : []
            );

        } catch (err) {

            console.error(
                "Category API Error = ",
                err
            );

        } finally {

            setCategoriesLoading(false);

        }

    };


    /* ============================================
       LOAD PRODUCTS
    ============================================ */

    const loadProducts = async () => {

        try {

            setLoading(true);

            setError("");


            /* =====================================
               SEARCH MODE
            ===================================== */

            if (activeSearch.trim()) {

                const data =
                    await catalogService
                        .searchProducts(
                            activeSearch.trim()
                        );


                setProducts(
                    Array.isArray(data)
                        ? data
                        : []
                );


                setTotalPages(1);

                return;
            }


            /* =====================================
               CATEGORY MODE
            ===================================== */

            if (selectedCategory) {

                const data =
                    await catalogService
                        .getProductsByCategory(
                            selectedCategory
                        );


                setProducts(
                    Array.isArray(data)
                        ? data
                        : []
                );


                setTotalPages(1);

                return;
            }


            /* =====================================
               NORMAL PAGINATION MODE
            ===================================== */

            const data =
                await catalogService
                    .getProducts(
                        page,
                        pageSize
                    );


            setProducts(
                Array.isArray(
                    data?.content
                )
                    ? data.content
                    : []
            );


            setTotalPages(
                Number(
                    data?.totalPages || 0
                )
            );

        } catch (err) {

            console.error(
                "Product API Error = ",
                err
            );


            setProducts([]);

            setTotalPages(0);


            setError(
                err.response?.data?.message ||
                err.response?.data ||
                "Unable to load products."
            );

        } finally {

            setLoading(false);

        }

    };


    /* ============================================
       INITIAL CATEGORY LOAD
    ============================================ */

    useEffect(() => {

        loadCategories();

    }, []);


    /* ============================================
       PRODUCT LOAD
    ============================================ */

    useEffect(() => {

        loadProducts();

    }, [
        page,
        activeSearch,
        selectedCategory,
    ]);


    /* ============================================
       SEARCH
    ============================================ */

    const handleSearch = () => {

        const keyword =
            searchKeyword.trim();


        setPage(0);

        setSelectedCategory("");


        if (!keyword) {

            setActiveSearch("");

            return;
        }


        setActiveSearch(keyword);

    };


    /* ============================================
       SEARCH ENTER
    ============================================ */

    const handleSearchKeyDown = (
        event
    ) => {

        if (event.key === "Enter") {

            handleSearch();

        }

    };


    /* ============================================
       CLEAR SEARCH
    ============================================ */

    const handleClearSearch = () => {

        setSearchKeyword("");

        setActiveSearch("");

        setPage(0);

    };


    /* ============================================
       CATEGORY CHANGE
    ============================================ */

    const handleCategoryChange = (
        event
    ) => {

        const categoryId =
            event.target.value;


        setPage(0);

        setActiveSearch("");

        setSearchKeyword("");

        setSelectedCategory(
            categoryId
        );

    };


    /* ============================================
       CLEAR ALL FILTERS
    ============================================ */

    const handleClearFilters = () => {

        setSearchKeyword("");

        setActiveSearch("");

        setSelectedCategory("");

        setPage(0);

    };


    /* ============================================
       RETRY
    ============================================ */

    const handleRetry = () => {

        loadCategories();

        loadProducts();

    };


    /* ============================================
       PRODUCT DETAILS
    ============================================ */

    const handleProductClick = (
        productId
    ) => {

        if (!productId) {
            return;
        }


        navigate(
            `/catalog/product/${productId}`
        );

    };


    /* ============================================
       PAGE CHANGE
    ============================================ */

    const handlePageChange = (
        nextPage
    ) => {

        if (
            nextPage < 0 ||
            nextPage >= totalPages
        ) {
            return;
        }


        setPage(nextPage);


        window.scrollTo({
            top: 0,
            behavior: "smooth",
        });

    };


    /* ============================================
       FILTER STATUS
    ============================================ */

    const hasActiveFilter =
        Boolean(
            activeSearch ||
            selectedCategory
        );


    /* ============================================
       SELECTED CATEGORY NAME
    ============================================ */

    const selectedCategoryName =
        categories.find(
            (category) =>
                String(category.id) ===
                String(selectedCategory)
        )?.name || "";


    return (

        <Box
            sx={{
                minHeight: "100vh",

                width: "100%",

                background:
                    "linear-gradient(135deg, #080F23 0%, #0F172A 55%, #111827 100%)",

                color: "#fff",
            }}
        >

            {/* =====================================
                HEADER
            ===================================== */}

            <DashboardHeader
                onMenuClick={() =>
                    setMobileSidebarOpen(true)
                }
            />


            {/* =====================================
                BODY
            ===================================== */}

            <Box
                sx={{
                    display: "flex",

                    width: "100%",
                }}
            >

                {/* =================================
                    SIDEBAR
                ================================= */}

                <Sidebar
                    mobileOpen={
                        mobileSidebarOpen
                    }

                    onClose={() =>
                        setMobileSidebarOpen(false)
                    }
                />


                {/* =================================
                    MAIN CONTENT
                ================================= */}

                <Box
                    sx={{
                        flex: 1,

                        minWidth: 0,

                        width: "100%",
                    }}
                >

                    <Box
                        sx={{
                            width: "100%",

                            maxWidth: 1600,

                            mx: "auto",

                            px: {
                                xs: 2,
                                sm: 3,
                                md: 4,
                                lg: 5,
                                xl: 6,
                            },

                            py: {
                                xs: 3,
                                md: 4,
                            },
                        }}
                    >

                        {/* =========================
                            PAGE HEADER
                        ========================= */}

                        <Box
                            sx={{
                                mb: {
                                    xs: 3,
                                    md: 4,
                                },
                            }}
                        >

                            <Typography
                                sx={{
                                    color: "#F8FAFC",

                                    fontSize: {
                                        xs: 24,
                                        md: 30,
                                    },

                                    fontWeight: 800,

                                    letterSpacing:
                                        "-.5px",
                                }}
                            >
                                Catalog
                            </Typography>


                            <Typography
                                sx={{
                                    mt: 0.7,

                                    color: "#64748B",

                                    fontSize: 13,
                                }}
                            >
                                Explore products and
                                categories
                            </Typography>

                        </Box>


                        {/* =========================
                            SEARCH + CATEGORY
                        ========================= */}

                        <Box
                            sx={{
                                display: "grid",

                                gridTemplateColumns: {
                                    xs: "1fr",
                                    md:
                                        "minmax(0, 2fr) minmax(240px, 1fr) auto",
                                },

                                gap: 2,

                                mb: 3,
                            }}
                        >

                            {/* SEARCH */}

                            <TextField
                                fullWidth

                                value={
                                    searchKeyword
                                }

                                onChange={(
                                    event
                                ) =>
                                    setSearchKeyword(
                                        event.target.value
                                    )
                                }

                                onKeyDown={
                                    handleSearchKeyDown
                                }

                                placeholder={
                                    "Search products..."
                                }

                                size="small"

                                InputProps={{
                                    startAdornment: (
                                        <SearchRounded
                                            sx={{
                                                mr: 1,

                                                color:
                                                    "#64748B",
                                            }}
                                        />
                                    ),

                                    endAdornment:
                                        searchKeyword && (
                                            <Button
                                                onClick={
                                                    handleClearSearch
                                                }

                                                sx={{
                                                    minWidth:
                                                        30,

                                                    width:
                                                        30,

                                                    height:
                                                        30,

                                                    p: 0,

                                                    color:
                                                        "#64748B",
                                                }}
                                            >
                                                <CloseRounded
                                                    sx={{
                                                        fontSize:
                                                            17,
                                                    }}
                                                />
                                            </Button>
                                        ),
                                }}

                                sx={{
                                    "& .MuiOutlinedInput-root":
                                        {
                                            color:
                                                "#F8FAFC",

                                            background:
                                                "rgba(255,255,255,.04)",

                                            borderRadius:
                                                2.5,

                                            "& fieldset":
                                                {
                                                    borderColor:
                                                        "rgba(255,255,255,.08)",
                                                },

                                            "&:hover fieldset":
                                                {
                                                    borderColor:
                                                        "rgba(255,255,255,.16)",
                                                },

                                            "&.Mui-focused fieldset":
                                                {
                                                    borderColor:
                                                        "#3B82F6",
                                                },
                                        },

                                    "& input::placeholder":
                                        {
                                            color:
                                                "#64748B",

                                            opacity:
                                                1,
                                        },
                                }}
                            />


                            {/* CATEGORY */}

                            <FormControl
                                fullWidth
                                size="small"
                            >

                                <InputLabel
                                    sx={{
                                        color:
                                            "#64748B",

                                        "&.Mui-focused":
                                            {
                                                color:
                                                    "#60A5FA",
                                            },
                                    }}
                                >
                                    Category
                                </InputLabel>


                                <Select
                                    value={
                                        selectedCategory
                                    }

                                    label="Category"

                                    onChange={
                                        handleCategoryChange
                                    }

                                    disabled={
                                        categoriesLoading
                                    }

                                    sx={{
                                        color:
                                            "#F8FAFC",

                                        background:
                                            "rgba(255,255,255,.04)",

                                        borderRadius:
                                            2.5,

                                        "& .MuiOutlinedInput-notchedOutline":
                                            {
                                                borderColor:
                                                    "rgba(255,255,255,.08)",
                                            },

                                        "&:hover .MuiOutlinedInput-notchedOutline":
                                            {
                                                borderColor:
                                                    "rgba(255,255,255,.16)",
                                            },

                                        "&.Mui-focused .MuiOutlinedInput-notchedOutline":
                                            {
                                                borderColor:
                                                    "#3B82F6",
                                            },

                                        "& .MuiSvgIcon-root":
                                            {
                                                color:
                                                    "#94A3B8",
                                            },
                                    }}

                                    MenuProps={{
                                        PaperProps: {
                                            sx: {
                                                background:
                                                    "#111827",

                                                color:
                                                    "#F8FAFC",

                                                border:
                                                    "1px solid rgba(255,255,255,.08)",
                                            },
                                        },
                                    }}
                                >

                                    <MenuItem
                                        value=""
                                    >
                                        All Categories
                                    </MenuItem>


                                    {categories.map(
                                        (
                                            category
                                        ) => (

                                            <MenuItem
                                                key={
                                                    category.id
                                                }

                                                value={
                                                    category.id
                                                }
                                            >
                                                {
                                                    category.name
                                                }
                                            </MenuItem>

                                        )
                                    )}

                                </Select>

                            </FormControl>


                            {/* SEARCH BUTTON */}

                            <Button
                                variant="contained"

                                onClick={
                                    handleSearch
                                }

                                startIcon={
                                    <SearchRounded />
                                }

                                sx={{
                                    minHeight: 40,

                                    px: 2.5,

                                    borderRadius: 2.5,

                                    textTransform:
                                        "none",

                                    fontWeight: 700,

                                    background:
                                        "#2563EB",

                                    "&:hover":
                                        {
                                            background:
                                                "#1D4ED8",
                                        },
                                }}
                            >
                                Search
                            </Button>

                        </Box>


                        {/* =========================
                            ACTIVE FILTER BAR
                        ========================= */}

                        {hasActiveFilter && (

                            <Box
                                sx={{
                                    display:
                                        "flex",

                                    alignItems:
                                        {
                                            xs:
                                                "flex-start",
                                            sm:
                                                "center",
                                        },

                                    justifyContent:
                                        "space-between",

                                    flexDirection:
                                        {
                                            xs:
                                                "column",
                                            sm:
                                                "row",
                                        },

                                    gap: 1.5,

                                    mb: 3,

                                    p: 1.5,

                                    borderRadius:
                                        2.5,

                                    background:
                                        "rgba(59,130,246,.07)",

                                    border:
                                        "1px solid rgba(59,130,246,.15)",
                                }}
                            >

                                <Box>

                                    <Typography
                                        sx={{
                                            color:
                                                "#93C5FD",

                                            fontSize:
                                                13,

                                            fontWeight:
                                                600,
                                        }}
                                    >

                                        {activeSearch
                                            ? `Search results for "${activeSearch}"`
                                            : `Category: ${selectedCategoryName || "Selected category"}`}

                                    </Typography>


                                    <Typography
                                        sx={{
                                            mt:
                                                .3,

                                            color:
                                                "#64748B",

                                            fontSize:
                                                11,
                                        }}
                                    >
                                        {products.length}{" "}
                                        result
                                        {products.length ===
                                        1
                                            ? ""
                                            : "s"}
                                    </Typography>

                                </Box>


                                <Button
                                    size="small"

                                    onClick={
                                        handleClearFilters
                                    }

                                    startIcon={
                                        <RefreshRounded />
                                    }

                                    sx={{
                                        color:
                                            "#93C5FD",

                                        textTransform:
                                            "none",

                                        fontSize:
                                            12,

                                        fontWeight:
                                            700,
                                    }}
                                >
                                    Clear Filters
                                </Button>

                            </Box>

                        )}


                        {/* =========================
                            ERROR
                        ========================= */}

                        {error && (

                            <Alert
                                severity="error"

                                sx={{
                                    mb: 3,

                                    background:
                                        "rgba(239,68,68,.08)",

                                    color:
                                        "#FCA5A5",

                                    border:
                                        "1px solid rgba(239,68,68,.18)",

                                    "& .MuiAlert-icon":
                                        {
                                            color:
                                                "#F87171",
                                        },
                                }}

                                action={

                                    <Button
                                        color="inherit"

                                        size="small"

                                        onClick={
                                            handleRetry
                                        }
                                    >
                                        Retry
                                    </Button>

                                }
                            >
                                {error}
                            </Alert>

                        )}


                        {/* =========================
                            LOADING
                        ========================= */}

                        {loading ? (

                            <Box
                                sx={{
                                    minHeight:
                                        350,

                                    display:
                                        "flex",

                                    alignItems:
                                        "center",

                                    justifyContent:
                                        "center",

                                    flexDirection:
                                        "column",

                                    gap: 2,
                                }}
                            >

                                <CircularProgress
                                    size={34}

                                    sx={{
                                        color:
                                            "#60A5FA",
                                    }}
                                />


                                <Typography
                                    sx={{
                                        color:
                                            "#64748B",

                                        fontSize:
                                            13,
                                    }}
                                >
                                    Loading products...
                                </Typography>

                            </Box>

                        ) : (

                            <>
                                {/* =====================
                                    PRODUCTS HEADER
                                ===================== */}

                                <Box
                                    sx={{
                                        display:
                                            "flex",

                                        alignItems:
                                            "center",

                                        justifyContent:
                                            "space-between",

                                        mb: 2.5,
                                    }}
                                >

                                    <Box>

                                        <Typography
                                            sx={{
                                                color:
                                                    "#F8FAFC",

                                                fontSize:
                                                    18,

                                                fontWeight:
                                                    750,
                                            }}
                                        >
                                            {hasActiveFilter
                                                ? "Results"
                                                : "Products"}
                                        </Typography>


                                        <Typography
                                            sx={{
                                                mt:
                                                    .3,

                                                color:
                                                    "#64748B",

                                                fontSize:
                                                    12,
                                            }}
                                        >
                                            {products.length}{" "}
                                            product
                                            {products.length ===
                                            1
                                                ? ""
                                                : "s"}{" "}
                                            available
                                        </Typography>

                                    </Box>


                                    {hasActiveFilter && (

                                        <Button
                                            size="small"

                                            onClick={
                                                handleClearFilters
                                            }

                                            startIcon={
                                                <RefreshRounded />
                                            }

                                            sx={{
                                                display:
                                                    {
                                                        xs:
                                                            "none",
                                                        sm:
                                                            "flex",
                                                    },

                                                color:
                                                    "#94A3B8",

                                                textTransform:
                                                    "none",

                                                fontSize:
                                                    12,
                                            }}
                                        >
                                            View All
                                        </Button>

                                    )}

                                </Box>
                                {canManageProducts && (

    <Button
        variant="contained"

        onClick={() =>
            navigate(
                "/catalog/product/new"
            )
        }

        sx={{
            minHeight: 40,

            px: 2.2,

            borderRadius: 2,

            textTransform: "none",

            fontWeight: 700,

            background: "#2563EB",

            "&:hover": {
                background: "#1D4ED8",
            },
        }}
    >
        Add Product
    </Button>

)}


                                {/* =====================
                                    EMPTY STATE
                                ===================== */}

                                {products.length ===
                                0 ? (

                                    <Box
                                        sx={{
                                            minHeight:
                                                320,

                                            display:
                                                "flex",

                                            flexDirection:
                                                "column",

                                            alignItems:
                                                "center",

                                            justifyContent:
                                                "center",

                                            textAlign:
                                                "center",

                                            borderRadius:
                                                3,

                                            border:
                                                "1px solid rgba(255,255,255,.07)",

                                            background:
                                                "rgba(255,255,255,.025)",

                                            px: 3,
                                        }}
                                    >

                                        <Inventory2Outlined
                                            sx={{
                                                fontSize:
                                                    48,

                                                color:
                                                    "#475569",

                                                mb:
                                                    1.5,
                                            }}
                                        />


                                        <Typography
                                            sx={{
                                                color:
                                                    "#CBD5E1",

                                                fontSize:
                                                    16,

                                                fontWeight:
                                                    700,
                                            }}
                                        >
                                            {hasActiveFilter
                                                ? "No matching products"
                                                : "No products available"}
                                        </Typography>


                                        <Typography
                                            sx={{
                                                mt:
                                                    .6,

                                                color:
                                                    "#64748B",

                                                fontSize:
                                                    12,

                                                maxWidth:
                                                    400,
                                            }}
                                        >
                                            {hasActiveFilter
                                                ? "Try another search term or choose a different category."
                                                : "There are currently no products available in the catalog."}
                                        </Typography>


                                        {hasActiveFilter && (

                                            <Button
                                                onClick={
                                                    handleClearFilters
                                                }

                                                sx={{
                                                    mt:
                                                        2,

                                                    color:
                                                        "#60A5FA",

                                                    textTransform:
                                                        "none",

                                                    fontWeight:
                                                        700,
                                                }}
                                            >
                                                Clear Filters
                                            </Button>

                                        )}

                                    </Box>

                                ) : (

                                    <>
                                        {/* =================
                                            PRODUCT GRID
                                        ================= */}

                                        <Box
                                            sx={{
                                                display:
                                                    "grid",

                                                gridTemplateColumns:
                                                    {
                                                        xs:
                                                            "1fr",
                                                        sm:
                                                            "repeat(2, 1fr)",
                                                        md:
                                                            "repeat(3, 1fr)",
                                                        lg:
                                                            "repeat(4, 1fr)",
                                                    },

                                                gap: {
                                                    xs:
                                                        2,
                                                    md:
                                                        2.5,
                                                },
                                            }}
                                        >

                                            {products.map(
                                                (
                                                    product
                                                ) => (

                                                    <ProductCard
                                                        key={
                                                            product.id
                                                        }

                                                        product={
                                                            product
                                                        }

                                                        onClick={() =>
                                                            handleProductClick(
                                                                product.id
                                                            )
                                                        }
                                                    />

                                                )
                                            )}

                                        </Box>


                                        {/* =================
                                            PAGINATION
                                        ================= */}

                                        {!hasActiveFilter &&
                                            totalPages >
                                                1 && (

                                            <Box
                                                sx={{
                                                    display:
                                                        "flex",

                                                    justifyContent:
                                                        "center",

                                                    alignItems:
                                                        "center",

                                                    gap:
                                                        2,

                                                    mt:
                                                        4,
                                                }}
                                            >

                                                <Button
                                                    disabled={
                                                        page ===
                                                        0
                                                    }

                                                    onClick={() =>
                                                        handlePageChange(
                                                            page -
                                                                1
                                                        )
                                                    }

                                                    sx={{
                                                        color:
                                                            "#CBD5E1",

                                                        border:
                                                            "1px solid rgba(255,255,255,.08)",

                                                        textTransform:
                                                            "none",

                                                        borderRadius:
                                                            2,

                                                        "&:disabled":
                                                            {
                                                                color:
                                                                    "#334155",
                                                            },
                                                    }}
                                                >
                                                    Previous
                                                </Button>


                                                <Typography
                                                    sx={{
                                                        color:
                                                            "#94A3B8",

                                                        fontSize:
                                                            13,

                                                        minWidth:
                                                            80,

                                                        textAlign:
                                                            "center",
                                                    }}
                                                >
                                                    Page{" "}
                                                    {page +
                                                        1}{" "}
                                                    of{" "}
                                                    {
                                                        totalPages
                                                    }
                                                </Typography>


                                                <Button
                                                    disabled={
                                                        page >=
                                                        totalPages -
                                                            1
                                                    }

                                                    onClick={() =>
                                                        handlePageChange(
                                                            page +
                                                                1
                                                        )
                                                    }

                                                    sx={{
                                                        color:
                                                            "#CBD5E1",

                                                        border:
                                                            "1px solid rgba(255,255,255,.08)",

                                                        textTransform:
                                                            "none",

                                                        borderRadius:
                                                            2,

                                                        "&:disabled":
                                                            {
                                                                color:
                                                                    "#334155",
                                                            },
                                                    }}
                                                >
                                                    Next
                                                </Button>

                                            </Box>

                                        )}

                                    </>

                                )}

                            </>

                        )}

                    </Box>

                </Box>

            </Box>

        </Box>
    );
}