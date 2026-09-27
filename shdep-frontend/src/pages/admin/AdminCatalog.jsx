import React, { useEffect, useMemo, useState } from "react";

import {
    Box,
    Typography,
    TextField,
    InputAdornment,
    Button,
    Chip,
    CircularProgress,
    MenuItem,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    IconButton,
    Tooltip,
    Alert,
} from "@mui/material";

import {
    SearchRounded,
    RefreshRounded,
    ArrowBackRounded,
    Inventory2Rounded,
    AddRounded,
    EditRounded,
    DeleteOutlineRounded,
    CategoryRounded,
    CheckCircleRounded,
    WarningAmberRounded,
    InventoryRounded,
    CloseRounded,
} from "@mui/icons-material";

import { useNavigate } from "react-router-dom";
import catalogService from "../../services/catalogService";

const initialProduct = {
    name: "",
    description: "",
    price: "",
    stockQuantity: "",
    imageUrl: "",
    categoryId: "",
};

const initialCategory = {
    name: "",
    description: "",
};

const money = (value) => {
    const amount = Number(value || 0);

    return new Intl.NumberFormat("en-IN", {
        style: "currency",
        currency: "INR",
        maximumFractionDigits: 2,
    }).format(amount);
};

const dateTime = (value) => {
    if (!value) return "—";

    const date = new Date(value);

    if (Number.isNaN(date.getTime())) {
        return "—";
    }

    return date.toLocaleString("en-IN", {
        day: "2-digit",
        month: "short",
        year: "numeric",
    });
};

export default function AdminCatalog() {

    const navigate = useNavigate();

    const [tab, setTab] = useState("PRODUCTS");

    const [products, setProducts] = useState([]);
    const [categories, setCategories] = useState([]);

    const [loading, setLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);

    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");

    const [search, setSearch] = useState("");
    const [categoryFilter, setCategoryFilter] = useState("ALL");

    const [productDialog, setProductDialog] = useState(false);
    const [categoryDialog, setCategoryDialog] = useState(false);

    const [editingProduct, setEditingProduct] = useState(null);
    const [editingCategory, setEditingCategory] = useState(null);

    const [productForm, setProductForm] = useState(initialProduct);
    const [categoryForm, setCategoryForm] = useState(initialCategory);

    const [saving, setSaving] = useState(false);
    const [deletingId, setDeletingId] = useState("");


    const loadCatalog = async (isRefresh = false) => {

        try {

            if (isRefresh) {
                setRefreshing(true);
            } else {
                setLoading(true);
            }

            setError("");

            const [
                productData,
                categoryData,
            ] = await Promise.all([
                catalogService.getAllProducts(),
                catalogService.getCategories(),
            ]);

            setProducts(
                Array.isArray(productData)
                    ? productData
                    : []
            );

            setCategories(
                Array.isArray(categoryData)
                    ? categoryData
                    : []
            );

        } catch (err) {

            console.error(
                "Admin Catalog API Error:",
                err
            );

            setError(
                err?.response?.data?.message ||
                err?.response?.data?.error ||
                "Unable to load catalog."
            );

        } finally {

            setLoading(false);
            setRefreshing(false);

        }
    };


    useEffect(() => {
        loadCatalog();
    }, []);


    const filteredProducts = useMemo(() => {

        const keyword =
            search.trim().toLowerCase();

        return products.filter((product) => {

            const matchesSearch =
                !keyword ||
                String(product.id || "")
                    .toLowerCase()
                    .includes(keyword) ||
                String(product.name || "")
                    .toLowerCase()
                    .includes(keyword) ||
                String(product.description || "")
                    .toLowerCase()
                    .includes(keyword) ||
                String(product.categoryName || "")
                    .toLowerCase()
                    .includes(keyword);

            const matchesCategory =
                categoryFilter === "ALL" ||
                String(product.categoryId || "") ===
                    String(categoryFilter);

            return (
                matchesSearch &&
                matchesCategory
            );
        });

    }, [
        products,
        search,
        categoryFilter,
    ]);


    const activeProducts =
        products.filter(
            (product) =>
                product.active !== false
        ).length;


    const lowStockProducts =
        products.filter(
            (product) =>
                Number(
                    product.stockQuantity || 0
                ) > 0 &&
                Number(
                    product.stockQuantity || 0
                ) <= 5
        ).length;


    const outOfStockProducts =
        products.filter(
            (product) =>
                Number(
                    product.stockQuantity || 0
                ) <= 0
        ).length;


    const openProductCreate = () => {

        setEditingProduct(null);

        setProductForm(
            initialProduct
        );

        setError("");

        setProductDialog(true);
    };


    const openProductEdit = (product) => {

        setEditingProduct(product);

        setProductForm({
            name: product.name || "",
            description:
                product.description || "",
            price:
                product.price ?? "",
            stockQuantity:
                product.stockQuantity ?? "",
            imageUrl:
                product.imageUrl || "",
            categoryId:
                product.categoryId || "",
        });

        setError("");

        setProductDialog(true);
    };


    const saveProduct = async () => {

        if (!productForm.name.trim()) {

            setError(
                "Product name is required."
            );

            return;
        }


        if (
            !productForm.price ||
            Number(productForm.price) <= 0
        ) {

            setError(
                "Price must be greater than zero."
            );

            return;
        }


        if (
            productForm.stockQuantity === "" ||
            Number(productForm.stockQuantity) < 0
        ) {

            setError(
                "Stock quantity cannot be negative."
            );

            return;
        }


        if (!productForm.categoryId) {

            setError(
                "Please select a category."
            );

            return;
        }


        try {

            setSaving(true);
            setError("");

            const payload = {

                name:
                    productForm.name.trim(),

                description:
                    productForm.description.trim(),

                price:
                    Number(productForm.price),

                stockQuantity:
                    Number(
                        productForm.stockQuantity
                    ),

                imageUrl:
                    productForm.imageUrl.trim(),

                categoryId:
                    productForm.categoryId,
            };


            if (editingProduct) {

                await catalogService.updateProduct(
                    editingProduct.id,
                    payload
                );

                setSuccess(
                    "Product updated successfully."
                );

            } else {

                await catalogService.createProduct(
                    payload
                );

                setSuccess(
                    "Product created successfully."
                );
            }


            setProductDialog(false);

            await loadCatalog(true);

        } catch (err) {

            console.error(
                "Product Save Error:",
                err
            );

            setError(
                err?.response?.data?.message ||
                err?.response?.data?.error ||
                "Unable to save product."
            );

        } finally {

            setSaving(false);

        }
    };


    const deleteProduct = async (
        product
    ) => {

        if (
            !window.confirm(
                `Delete product "${product.name}"?`
            )
        ) {
            return;
        }


        try {

            setDeletingId(product.id);

            setError("");

            await catalogService.deleteProduct(
                product.id
            );

            setSuccess(
                "Product deleted successfully."
            );

            await loadCatalog(true);

        } catch (err) {

            console.error(
                "Product Delete Error:",
                err
            );

            setError(
                err?.response?.data?.message ||
                err?.response?.data?.error ||
                "Unable to delete product."
            );

        } finally {

            setDeletingId("");

        }
    };


    const openCategoryCreate = () => {

        setEditingCategory(null);

        setCategoryForm(
            initialCategory
        );

        setError("");

        setCategoryDialog(true);
    };


    const openCategoryEdit = (
        category
    ) => {

        setEditingCategory(category);

        setCategoryForm({
            name: category.name || "",
            description:
                category.description || "",
        });

        setError("");

        setCategoryDialog(true);
    };


    const saveCategory = async () => {

        if (!categoryForm.name.trim()) {

            setError(
                "Category name is required."
            );

            return;
        }


        try {

            setSaving(true);

            setError("");

            const payload = {

                name:
                    categoryForm.name.trim(),

                description:
                    categoryForm.description.trim(),
            };


            if (editingCategory) {

                await catalogService.updateCategory(
                    editingCategory.id,
                    payload
                );

                setSuccess(
                    "Category updated successfully."
                );

            } else {

                await catalogService.createCategory(
                    payload
                );

                setSuccess(
                    "Category created successfully."
                );
            }


            setCategoryDialog(false);

            await loadCatalog(true);

        } catch (err) {

            console.error(
                "Category Save Error:",
                err
            );

            setError(
                err?.response?.data?.message ||
                err?.response?.data?.error ||
                "Unable to save category."
            );

        } finally {

            setSaving(false);

        }
    };


    const deleteCategory = async (
        category
    ) => {

        if (
            !window.confirm(
                `Delete category "${category.name}"?`
            )
        ) {
            return;
        }


        try {

            setDeletingId(category.id);

            setError("");

            await catalogService.deleteCategory(
                category.id
            );

            setSuccess(
                "Category deleted successfully."
            );

            await loadCatalog(true);

        } catch (err) {

            console.error(
                "Category Delete Error:",
                err
            );

            setError(
                err?.response?.data?.message ||
                err?.response?.data?.error ||
                "Unable to delete category. It may still be used by products."
            );

        } finally {

            setDeletingId("");

        }
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
                                "rgba(255,255,255,0.55)",
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
                        Catalog
                    </Typography>


                    <Typography
                        sx={{
                            mt: 0.5,
                            color:
                                "rgba(255,255,255,0.45)",
                            fontSize: 14,
                        }}
                    >
                        Manage products,
                        categories, pricing and
                        inventory.
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
                            loadCatalog(true)
                        }
                        disabled={
                            loading ||
                            refreshing
                        }
                        sx={{
                            color: "#fff",
                            borderColor:
                                "rgba(255,255,255,0.12)",
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
                            <AddRounded />
                        }
                        onClick={
                            tab === "PRODUCTS"
                                ? openProductCreate
                                : openCategoryCreate
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
                        {tab === "PRODUCTS"
                            ? "Add Product"
                            : "Add Category"}
                    </Button>

                </Box>

            </Box>


            {/* STAT CARDS */}

            <Box
                sx={{
                    display: "grid",
                    gridTemplateColumns: {
                        xs: "1fr",
                        sm: "repeat(2, 1fr)",
                        xl: "repeat(4, 1fr)",
                    },
                    gap: 2,
                    mb: 3,
                }}
            >

                {[
                    [
                        "Total Products",
                        products.length,
                        Inventory2Rounded,
                        "#76a7ff",
                    ],
                    [
                        "Active Products",
                        activeProducts,
                        CheckCircleRounded,
                        "#35d98b",
                    ],
                    [
                        "Low Stock",
                        lowStockProducts,
                        WarningAmberRounded,
                        "#fbbf24",
                    ],
                    [
                        "Categories",
                        categories.length,
                        CategoryRounded,
                        "#c084fc",
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
                                borderRadius: 3,
                                border:
                                    "1px solid rgba(255,255,255,0.08)",
                                background:
                                    "rgba(255,255,255,0.025)",
                                p: 2.2,
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
                                        fontSize: 11,
                                        color:
                                            "rgba(255,255,255,0.45)",
                                        textTransform:
                                            "uppercase",
                                        letterSpacing: 1,
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
                                {value}
                            </Typography>

                        </Box>

                    )
                )}

            </Box>


            {/* OUT OF STOCK */}

            {outOfStockProducts > 0 && (
                <Alert
                    severity="warning"
                    sx={{
                        mb: 2,
                        background:
                            "rgba(251,191,36,0.07)",
                        color: "#fbbf24",
                        border:
                            "1px solid rgba(251,191,36,0.12)",
                        "& .MuiAlert-icon": {
                            color: "#fbbf24",
                        },
                    }}
                >
                    {outOfStockProducts} product
                    {outOfStockProducts === 1
                        ? " is"
                        : "s are"}{" "}
                    currently out of stock.
                </Alert>
            )}


            {/* ERROR */}

            {error && (
                <Alert
                    severity="error"
                    onClose={() =>
                        setError("")
                    }
                    sx={{
                        mb: 2,
                        background:
                            "rgba(239,68,68,0.06)",
                        color: "#fca5a5",
                    }}
                >
                    {error}
                </Alert>
            )}


            {/* SUCCESS */}

            {success && (
                <Alert
                    severity="success"
                    onClose={() =>
                        setSuccess("")
                    }
                    sx={{
                        mb: 2,
                        background:
                            "rgba(53,217,139,0.06)",
                        color: "#86efac",
                    }}
                >
                    {success}
                </Alert>
            )}


            {/* TABS */}

            <Box
                sx={{
                    display: "flex",
                    gap: 1,
                    mb: 2,
                    borderBottom:
                        "1px solid rgba(255,255,255,0.08)",
                }}
            >

                {[
                    "PRODUCTS",
                    "CATEGORIES",
                ].map((item) => (

                    <Button
                        key={item}
                        onClick={() => {

                            setTab(item);
                            setSearch("");
                            setCategoryFilter(
                                "ALL"
                            );
                            setError("");

                        }}
                        startIcon={
                            item ===
                            "PRODUCTS" ? (
                                <Inventory2Rounded />
                            ) : (
                                <CategoryRounded />
                            )
                        }
                        sx={{
                            color:
                                tab === item
                                    ? "#76a7ff"
                                    : "rgba(255,255,255,0.42)",

                            borderBottom:
                                tab === item
                                    ? "2px solid #76a7ff"
                                    : "2px solid transparent",

                            borderRadius: 0,

                            textTransform:
                                "none",

                            fontWeight: 700,

                            px: 2,
                            py: 1.2,
                        }}
                    >
                        {item ===
                        "PRODUCTS"
                            ? "Products"
                            : "Categories"}
                    </Button>

                ))}

            </Box>


            {/* PRODUCTS */}

            {tab === "PRODUCTS" ? (

                <>

                    {/* SEARCH */}

                    <Box
                        sx={{
                            display: "flex",
                            flexDirection: {
                                xs: "column",
                                md: "row",
                            },
                            gap: 2,
                            mb: 2,
                        }}
                    >

                        <TextField
                            fullWidth
                            placeholder="Search product, category or description..."
                            value={search}
                            onChange={(e) =>
                                setSearch(
                                    e.target.value
                                )
                            }
                            slotProps={{
                                input: {
                                    startAdornment: (
                                        <InputAdornment
                                            position="start"
                                        >
                                            <SearchRounded
                                                sx={{
                                                    color:
                                                        "rgba(255,255,255,0.35)",
                                                }}
                                            />
                                        </InputAdornment>
                                    ),
                                },
                            }}
                            sx={{
                                "& .MuiOutlinedInput-root":
                                    {
                                        color:
                                            "#fff",
                                        borderRadius:
                                            2,
                                        background:
                                            "rgba(255,255,255,0.025)",

                                        "& fieldset":
                                            {
                                                borderColor:
                                                    "rgba(255,255,255,0.09)",
                                            },
                                    },

                                "& input::placeholder":
                                    {
                                        color:
                                            "rgba(255,255,255,0.3)",
                                        opacity: 1,
                                    },
                            }}
                        />


                        <TextField
                            select
                            value={
                                categoryFilter
                            }
                            onChange={(e) =>
                                setCategoryFilter(
                                    e.target.value
                                )
                            }
                            sx={{
                                minWidth: {
                                    md: 220,
                                },

                                "& .MuiOutlinedInput-root":
                                    {
                                        color:
                                            "#fff",
                                        borderRadius:
                                            2,
                                        background:
                                            "rgba(255,255,255,0.025)",

                                        "& fieldset":
                                            {
                                                borderColor:
                                                    "rgba(255,255,255,0.09)",
                                            },
                                    },
                            }}
                        >

                            <MenuItem value="ALL">
                                All categories
                            </MenuItem>


                            {categories.map(
                                (category) => (

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

                        </TextField>

                    </Box>


                    {/* PRODUCT TABLE */}

                    <Box
                        sx={{
                            borderRadius: 3,
                            border:
                                "1px solid rgba(255,255,255,0.08)",
                            background:
                                "rgba(255,255,255,0.02)",
                            overflow:
                                "hidden",
                        }}
                    >

                        <Box
                            sx={{
                                display: {
                                    xs: "none",
                                    lg: "grid",
                                },
                                gridTemplateColumns:
                                    "2fr 1.2fr 1fr .8fr .9fr .8fr",
                                gap: 2,
                                px: 2.5,
                                py: 1.5,
                                borderBottom:
                                    "1px solid rgba(255,255,255,0.07)",
                                background:
                                    "rgba(255,255,255,0.025)",
                            }}
                        >

                            {[
                                "Product",
                                "Category",
                                "Price",
                                "Stock",
                                "Status",
                                "Actions",
                            ].map(
                                (heading) => (

                                    <Typography
                                        key={
                                            heading
                                        }
                                        sx={{
                                            fontSize: 10,
                                            fontWeight: 700,
                                            color:
                                                "rgba(255,255,255,0.35)",
                                            textTransform:
                                                "uppercase",
                                            letterSpacing:
                                                0.8,
                                        }}
                                    >
                                        {heading}
                                    </Typography>

                                )
                            )}

                        </Box>


                        {loading ? (

                            <Box
                                sx={{
                                    py: 8,
                                    display:
                                        "flex",
                                    justifyContent:
                                        "center",
                                    gap: 1.5,
                                }}
                            >

                                <CircularProgress
                                    size={22}
                                    sx={{
                                        color:
                                            "#76a7ff",
                                    }}
                                />

                                <Typography
                                    sx={{
                                        fontSize: 13,
                                        color:
                                            "rgba(255,255,255,0.4)",
                                    }}
                                >
                                    Loading
                                    catalog...
                                </Typography>

                            </Box>

                        ) : filteredProducts.length === 0 ? (

                            <Box
                                sx={{
                                    py: 8,
                                    textAlign:
                                        "center",
                                }}
                            >

                                <Inventory2Rounded
                                    sx={{
                                        fontSize: 38,
                                        color:
                                            "rgba(255,255,255,0.15)",
                                        mb: 1,
                                    }}
                                />

                                <Typography
                                    sx={{
                                        fontSize: 14,
                                        fontWeight: 600,
                                    }}
                                >
                                    No products found
                                </Typography>

                                <Typography
                                    sx={{
                                        mt: 0.5,
                                        fontSize: 12,
                                        color:
                                            "rgba(255,255,255,0.35)",
                                    }}
                                >
                                    Try another
                                    search or add
                                    a new product.
                                </Typography>

                            </Box>

                        ) : (

                            filteredProducts.map(
                                (product) => {

                                    const stock =
                                        Number(
                                            product.stockQuantity ||
                                                0
                                        );

                                    const stockColor =
                                        stock <= 0
                                            ? "#ef4444"
                                            : stock <= 5
                                                ? "#fbbf24"
                                                : "#35d98b";


                                    return (

                                        <Box
                                            key={
                                                product.id
                                            }
                                            sx={{
                                                display:
                                                    "grid",
                                                gridTemplateColumns:
                                                    {
                                                        xs: "1fr",
                                                        lg:
                                                            "2fr 1.2fr 1fr .8fr .9fr .8fr",
                                                    },
                                                gap: 2,
                                                alignItems:
                                                    "center",
                                                px: 2.5,
                                                py: 2,
                                                borderBottom:
                                                    "1px solid rgba(255,255,255,0.05)",
                                                "&:hover":
                                                    {
                                                        background:
                                                            "rgba(255,255,255,0.025)",
                                                    },
                                            }}
                                        >

                                            <Box
                                                sx={{
                                                    minWidth:
                                                        0,
                                                }}
                                            >

                                                <Typography
                                                    sx={{
                                                        fontSize: 13,
                                                        fontWeight: 700,
                                                        overflow:
                                                            "hidden",
                                                        textOverflow:
                                                            "ellipsis",
                                                        whiteSpace:
                                                            "nowrap",
                                                    }}
                                                >
                                                    {
                                                        product.name ||
                                                        "Unnamed Product"
                                                    }
                                                </Typography>


                                                <Typography
                                                    sx={{
                                                        mt: 0.35,
                                                        fontSize: 10,
                                                        color:
                                                            "rgba(255,255,255,0.35)",
                                                    }}
                                                >
                                                    {
                                                        product.id ||
                                                        "—"
                                                    }{" "}
                                                    · Updated{" "}
                                                    {dateTime(
                                                        product.updatedAt
                                                    )}
                                                </Typography>

                                            </Box>


                                            <Typography
                                                sx={{
                                                    fontSize: 12,
                                                    color:
                                                        "rgba(255,255,255,0.6)",
                                                }}
                                            >
                                                {
                                                    product.categoryName ||
                                                    "Uncategorized"
                                                }
                                            </Typography>


                                            <Typography
                                                sx={{
                                                    fontSize: 13,
                                                    fontWeight: 700,
                                                }}
                                            >
                                                {money(
                                                    product.price
                                                )}
                                            </Typography>


                                            <Typography
                                                sx={{
                                                    fontSize: 13,
                                                    fontWeight: 700,
                                                    color:
                                                        stockColor,
                                                }}
                                            >
                                                {stock}
                                            </Typography>


                                            <Chip
                                                size="small"
                                                label={
                                                    product.active ===
                                                    false
                                                        ? "INACTIVE"
                                                        : "ACTIVE"
                                                }
                                                sx={{
                                                    width:
                                                        "fit-content",
                                                    color:
                                                        product.active ===
                                                        false
                                                            ? "#94a3b8"
                                                            : "#35d98b",
                                                    background:
                                                        product.active ===
                                                        false
                                                            ? "rgba(148,163,184,.08)"
                                                            : "rgba(53,217,139,.08)",
                                                    border:
                                                        "1px solid rgba(255,255,255,.08)",
                                                    fontWeight:
                                                        700,
                                                    fontSize: 10,
                                                }}
                                            />


                                            <Box
                                                sx={{
                                                    display:
                                                        "flex",
                                                    gap: 0.5,
                                                }}
                                            >

                                                <Tooltip
                                                    title="Edit product"
                                                >

                                                    <IconButton
                                                        size="small"
                                                        onClick={() =>
                                                            openProductEdit(
                                                                product
                                                            )
                                                        }
                                                        sx={{
                                                            color:
                                                                "#76a7ff",
                                                        }}
                                                    >
                                                        <EditRounded
                                                            fontSize="small"
                                                        />
                                                    </IconButton>

                                                </Tooltip>


                                                <Tooltip
                                                    title="Delete product"
                                                >

                                                    <span>

                                                        <IconButton
                                                            size="small"
                                                            disabled={
                                                                deletingId ===
                                                                product.id
                                                            }
                                                            onClick={() =>
                                                                deleteProduct(
                                                                    product
                                                                )
                                                            }
                                                            sx={{
                                                                color:
                                                                    "#ef7777",
                                                            }}
                                                        >

                                                            {deletingId ===
                                                            product.id ? (
                                                                <CircularProgress
                                                                    size={
                                                                        17
                                                                    }
                                                                    sx={{
                                                                        color:
                                                                            "#ef7777",
                                                                    }}
                                                                />
                                                            ) : (
                                                                <DeleteOutlineRounded
                                                                    fontSize="small"
                                                                />
                                                            )}

                                                        </IconButton>

                                                    </span>

                                                </Tooltip>

                                            </Box>

                                        </Box>

                                    );
                                }
                            )

                        )}

                    </Box>

                </>

            ) : (

                /* CATEGORIES */

                <Box
                    sx={{
                        borderRadius: 3,
                        border:
                            "1px solid rgba(255,255,255,0.08)",
                        background:
                            "rgba(255,255,255,0.02)",
                        overflow:
                            "hidden",
                    }}
                >

                    <Box
                        sx={{
                            display: {
                                xs: "none",
                                md: "grid",
                            },
                            gridTemplateColumns:
                                "1.5fr 3fr 1fr .8fr",
                            gap: 2,
                            px: 2.5,
                            py: 1.5,
                            borderBottom:
                                "1px solid rgba(255,255,255,0.07)",
                            background:
                                "rgba(255,255,255,0.025)",
                        }}
                    >

                        {[
                            "Category",
                            "Description",
                            "Created",
                            "Actions",
                        ].map(
                            (heading) => (

                                <Typography
                                    key={
                                        heading
                                    }
                                    sx={{
                                        fontSize: 10,
                                        fontWeight: 700,
                                        color:
                                            "rgba(255,255,255,0.35)",
                                        textTransform:
                                            "uppercase",
                                        letterSpacing:
                                            0.8,
                                    }}
                                >
                                    {heading}
                                </Typography>

                            )
                        )}

                    </Box>


                    {loading ? (

                        <Box
                            sx={{
                                py: 8,
                                display:
                                    "flex",
                                justifyContent:
                                    "center",
                            }}
                        >
                            <CircularProgress
                                size={22}
                                sx={{
                                    color:
                                        "#76a7ff",
                                }}
                            />
                        </Box>

                    ) : categories.length === 0 ? (

                        <Box
                            sx={{
                                py: 8,
                                textAlign:
                                    "center",
                            }}
                        >

                            <CategoryRounded
                                sx={{
                                    fontSize: 38,
                                    color:
                                        "rgba(255,255,255,.15)",
                                }}
                            />

                            <Typography
                                sx={{
                                    mt: 1,
                                    fontSize: 14,
                                }}
                            >
                                No categories found
                            </Typography>

                        </Box>

                    ) : (

                        categories.map(
                            (category) => (

                                <Box
                                    key={
                                        category.id
                                    }
                                    sx={{
                                        display:
                                            "grid",
                                        gridTemplateColumns:
                                            {
                                                xs: "1fr",
                                                md:
                                                    "1.5fr 3fr 1fr .8fr",
                                            },
                                        gap: 2,
                                        alignItems:
                                            "center",
                                        px: 2.5,
                                        py: 2,
                                        borderBottom:
                                            "1px solid rgba(255,255,255,0.05)",
                                    }}
                                >

                                    <Typography
                                        sx={{
                                            fontSize: 13,
                                            fontWeight: 700,
                                        }}
                                    >
                                        {
                                            category.name
                                        }
                                    </Typography>


                                    <Typography
                                        sx={{
                                            fontSize: 12,
                                            color:
                                                "rgba(255,255,255,.55)",
                                        }}
                                    >
                                        {
                                            category.description ||
                                            "No description"
                                        }
                                    </Typography>


                                    <Typography
                                        sx={{
                                            fontSize: 11,
                                            color:
                                                "rgba(255,255,255,.4)",
                                        }}
                                    >
                                        {dateTime(
                                            category.createdAt
                                        )}
                                    </Typography>


                                    <Box
                                        sx={{
                                            display:
                                                "flex",
                                            gap: 0.5,
                                        }}
                                    >

                                        <Tooltip
                                            title="Edit category"
                                        >

                                            <IconButton
                                                size="small"
                                                onClick={() =>
                                                    openCategoryEdit(
                                                        category
                                                    )
                                                }
                                                sx={{
                                                    color:
                                                        "#76a7ff",
                                                }}
                                            >
                                                <EditRounded
                                                    fontSize="small"
                                                />
                                            </IconButton>

                                        </Tooltip>


                                        <Tooltip
                                            title="Delete category"
                                        >

                                            <span>

                                                <IconButton
                                                    size="small"
                                                    disabled={
                                                        deletingId ===
                                                        category.id
                                                    }
                                                    onClick={() =>
                                                        deleteCategory(
                                                            category
                                                        )
                                                    }
                                                    sx={{
                                                        color:
                                                            "#ef7777",
                                                    }}
                                                >

                                                    {deletingId ===
                                                    category.id ? (
                                                        <CircularProgress
                                                            size={
                                                                17
                                                            }
                                                            sx={{
                                                                color:
                                                                    "#ef7777",
                                                            }}
                                                        />
                                                    ) : (
                                                        <DeleteOutlineRounded
                                                            fontSize="small"
                                                        />
                                                    )}

                                                </IconButton>

                                            </span>

                                        </Tooltip>

                                    </Box>

                                </Box>

                            )
                        )

                    )}

                </Box>

            )}


            {/* PRODUCT DIALOG */}

            <Dialog
                open={productDialog}
                onClose={() =>
                    !saving &&
                    setProductDialog(false)
                }
                fullWidth
                maxWidth="sm"
                PaperProps={{
                    sx: {
                        background:
                            "#0d142b",
                        color: "#fff",
                        border:
                            "1px solid rgba(255,255,255,.08)",
                    },
                }}
            >

                <DialogTitle
                    sx={{
                        fontWeight: 800,
                    }}
                >
                    {editingProduct
                        ? "Edit Product"
                        : "Add Product"}
                </DialogTitle>


                <DialogContent>

                    <Box
                        sx={{
                            display: "grid",
                            gap: 2,
                            pt: 1,
                        }}
                    >

                        <TextField
                            label="Product name"
                            value={
                                productForm.name
                            }
                            onChange={(e) =>
                                setProductForm({
                                    ...productForm,
                                    name:
                                        e.target
                                            .value,
                                })
                            }
                            fullWidth
                        />


                        <TextField
                            label="Description"
                            value={
                                productForm.description
                            }
                            onChange={(e) =>
                                setProductForm({
                                    ...productForm,
                                    description:
                                        e.target
                                            .value,
                                })
                            }
                            multiline
                            minRows={3}
                            fullWidth
                        />


                        <Box
                            sx={{
                                display:
                                    "grid",
                                gridTemplateColumns:
                                    "1fr 1fr",
                                gap: 2,
                            }}
                        >

                            <TextField
                                label="Price"
                                type="number"
                                value={
                                    productForm.price
                                }
                                onChange={(e) =>
                                    setProductForm({
                                        ...productForm,
                                        price:
                                            e.target
                                                .value,
                                    })
                                }
                            />


                            <TextField
                                label="Stock quantity"
                                type="number"
                                value={
                                    productForm.stockQuantity
                                }
                                onChange={(e) =>
                                    setProductForm({
                                        ...productForm,
                                        stockQuantity:
                                            e.target
                                                .value,
                                    })
                                }
                            />

                        </Box>


                        <TextField
                            select
                            label="Category"
                            value={
                                productForm.categoryId
                            }
                            onChange={(e) =>
                                setProductForm({
                                    ...productForm,
                                    categoryId:
                                        e.target
                                            .value,
                                })
                            }
                        >

                            {categories.map(
                                (category) => (

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

                        </TextField>


                        <TextField
                            label="Image URL"
                            value={
                                productForm.imageUrl
                            }
                            onChange={(e) =>
                                setProductForm({
                                    ...productForm,
                                    imageUrl:
                                        e.target
                                            .value,
                                })
                            }
                            fullWidth
                        />

                    </Box>

                </DialogContent>


                <DialogActions
                    sx={{
                        p: 2,
                    }}
                >

                    <Button
                        onClick={() =>
                            setProductDialog(
                                false
                            )
                        }
                        disabled={saving}
                        sx={{
                            color:
                                "rgba(255,255,255,.55)",
                            textTransform:
                                "none",
                        }}
                    >
                        Cancel
                    </Button>


                    <Button
                        variant="contained"
                        onClick={
                            saveProduct
                        }
                        disabled={saving}
                        startIcon={
                            saving ? (
                                <CircularProgress
                                    size={15}
                                    color="inherit"
                                />
                            ) : (
                                <CheckCircleRounded />
                            )
                        }
                        sx={{
                            background:
                                "#355cff",
                            textTransform:
                                "none",
                        }}
                    >
                        Save Product
                    </Button>

                </DialogActions>

            </Dialog>


            {/* CATEGORY DIALOG */}

            <Dialog
                open={categoryDialog}
                onClose={() =>
                    !saving &&
                    setCategoryDialog(false)
                }
                fullWidth
                maxWidth="sm"
                PaperProps={{
                    sx: {
                        background:
                            "#0d142b",
                        color: "#fff",
                        border:
                            "1px solid rgba(255,255,255,.08)",
                    },
                }}
            >

                <DialogTitle
                    sx={{
                        fontWeight: 800,
                    }}
                >
                    {editingCategory
                        ? "Edit Category"
                        : "Add Category"}
                </DialogTitle>


                <DialogContent>

                    <Box
                        sx={{
                            display: "grid",
                            gap: 2,
                            pt: 1,
                        }}
                    >

                        <TextField
                            label="Category name"
                            value={
                                categoryForm.name
                            }
                            onChange={(e) =>
                                setCategoryForm({
                                    ...categoryForm,
                                    name:
                                        e.target
                                            .value,
                                })
                            }
                            fullWidth
                        />


                        <TextField
                            label="Description"
                            value={
                                categoryForm.description
                            }
                            onChange={(e) =>
                                setCategoryForm({
                                    ...categoryForm,
                                    description:
                                        e.target
                                            .value,
                                })
                            }
                            multiline
                            minRows={3}
                            fullWidth
                        />

                    </Box>

                </DialogContent>


                <DialogActions
                    sx={{
                        p: 2,
                    }}
                >

                    <Button
                        onClick={() =>
                            setCategoryDialog(
                                false
                            )
                        }
                        disabled={saving}
                        sx={{
                            color:
                                "rgba(255,255,255,.55)",
                            textTransform:
                                "none",
                        }}
                    >
                        Cancel
                    </Button>


                    <Button
                        variant="contained"
                        onClick={
                            saveCategory
                        }
                        disabled={saving}
                        startIcon={
                            saving ? (
                                <CircularProgress
                                    size={15}
                                    color="inherit"
                                />
                            ) : (
                                <CheckCircleRounded />
                            )
                        }
                        sx={{
                            background:
                                "#355cff",
                            textTransform:
                                "none",
                        }}
                    >
                        Save Category
                    </Button>

                </DialogActions>

            </Dialog>

        </Box>
    );
}