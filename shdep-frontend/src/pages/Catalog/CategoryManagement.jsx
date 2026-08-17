import {
    Alert,
    Box,
    Button,
    CircularProgress,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    TextField,
    Typography,
   
} from "@mui/material";

import {
    AddRounded,
    ArrowBackRounded,
    CategoryOutlined,
    RefreshRounded,
     EditOutlined,
     SaveOutlined,
     DeleteOutlineRounded,
} from "@mui/icons-material";

import {
    useEffect,
    useState,
} from "react";

import {
    useNavigate,
} from "react-router-dom";

import {
    useAuth,
} from "../../context/AuthContext";

import catalogService
    from "../../services/catalogService";


export default function CategoryManagement() {
  console.log("🔥 CATEGORY MANAGEMENT PAGE LOADED");
    const navigate = useNavigate();

    const {
        role,
    } = useAuth();


    /* ============================================
       ROLE
    ============================================ */

    const normalizedRole =
        String(role || "")
            .replace("ROLE_", "")
            .toUpperCase();


    const isAdmin =
        normalizedRole === "ADMIN";

    console.log("CURRENT USER ROLE =", role);
console.log("NORMALIZED ROLE =", normalizedRole);
console.log("IS ADMIN =", isAdmin);    


    /* ============================================
       CATEGORIES
    ============================================ */

    const [
        categories,
        setCategories,
    ] = useState([]);


    const [
        loading,
        setLoading,
    ] = useState(true);


    /* ============================================
       ADD CATEGORY
    ============================================ */

    const [
        addDialogOpen,
        setAddDialogOpen,
    ] = useState(false);


    const [
        categoryName,
        setCategoryName,
    ] = useState("");


    const [
        categoryDescription,
        setCategoryDescription,
    ] = useState("");


    const [
        creatingCategory,
        setCreatingCategory,
    ] = useState(false);



const [
    editDialogOpen,
    setEditDialogOpen,
] = useState(false);

const [
    editingCategory,
    setEditingCategory,
] = useState(null);

const [
    updatingCategory,
    setUpdatingCategory,
] = useState(false);

const [
    deleteDialogOpen,
    setDeleteDialogOpen,
] = useState(false);

const [
    categoryToDelete,
    setCategoryToDelete,
] = useState(null);

const [
    deletingCategory,
    setDeletingCategory,
] = useState(false);



    

    /* ============================================
       ERROR / SUCCESS
    ============================================ */

    const [
        error,
        setError,
    ] = useState("");


    const [
        success,
        setSuccess,
    ] = useState("");


    /* ============================================
       LOAD CATEGORIES
    ============================================ */

    const loadCategories =
        async () => {

            try {

                setLoading(true);

                setError("");


                const data =
                    await catalogService
                        .getCategories();


                console.log(
                    "Categories = ",
                    data
                );


                setCategories(
                    Array.isArray(data)
                        ? data
                        : []
                );

            } catch (err) {

                console.error(
                    "Category Load Error = ",
                    err
                );


                setError(
                    err.response?.data?.message ||
                    err.response?.data ||
                    "Unable to load categories."
                );

            } finally {

                setLoading(false);

            }

        };


    /* ============================================
       INITIAL LOAD
    ============================================ */

    useEffect(() => {

        loadCategories();

    }, []);


    /* ============================================
       OPEN ADD DIALOG
    ============================================ */

    const handleOpenAddDialog =
        () => {

            setCategoryName("");

            setCategoryDescription("");

            setError("");

            setSuccess("");

            setAddDialogOpen(true);

        };


    /* ============================================
       CLOSE ADD DIALOG
    ============================================ */

    const handleCloseAddDialog =
        () => {

            if (creatingCategory) {
                return;
            }


            setAddDialogOpen(false);

            setCategoryName("");

            setCategoryDescription("");

        };



      const handleOpenEditDialog = (category) => {

    setEditingCategory(category);

    setCategoryName(
        category.name || ""
    );

    setCategoryDescription(
        category.description || ""
    );

    setError("");

    setSuccess("");

    setEditDialogOpen(true);
};


const handleCloseEditDialog = () => {

    if (updatingCategory) {
        return;
    }

    setEditDialogOpen(false);

    setEditingCategory(null);

    setCategoryName("");

    setCategoryDescription("");

    setError("");
};


const handleUpdateCategory = async () => {

    setError("");

    setSuccess("");

    const trimmedName =
        categoryName.trim();

    const trimmedDescription =
        categoryDescription.trim();


    if (!trimmedName) {

        setError(
            "Category name is required."
        );

        return;
    }


    if (!editingCategory?.id) {

        setError(
            "Category ID is missing."
        );

        return;
    }


    try {

        setUpdatingCategory(true);


        const payload = {

            name:
                trimmedName,

            description:
                trimmedDescription,

        };


        console.log(
            "Update Category Payload = ",
            payload
        );


        await catalogService.updateCategory(
            editingCategory.id,
            payload
        );


        setEditDialogOpen(false);

        setEditingCategory(null);

        setCategoryName("");

        setCategoryDescription("");


        setSuccess(
            "Category updated successfully."
        );


        await loadCategories();


    } catch (err) {

        console.error(
            "Update Category Error = ",
            err
        );


        setError(
            err.response?.data?.message ||
            err.response?.data ||
            "Unable to update category."
        );

    } finally {

        setUpdatingCategory(false);
    }
};  


const handleOpenDeleteDialog = (category) => {

    setCategoryToDelete(category);

    setError("");

    setSuccess("");

    setDeleteDialogOpen(true);
};


const handleDeleteCancel = () => {

    if (deletingCategory) {
        return;
    }

    setDeleteDialogOpen(false);

    setCategoryToDelete(null);

    setError("");
};


const handleDeleteConfirm = async () => {

    if (!categoryToDelete?.id) {

        setError(
            "Category ID is missing."
        );

        return;
    }


    try {

        setDeletingCategory(true);

        setError("");

        setSuccess("");


        console.log(
            "Deleting Category = ",
            categoryToDelete
        );


        await catalogService.deleteCategory(
            categoryToDelete.id
        );


        setDeleteDialogOpen(false);

        setCategoryToDelete(null);


        setSuccess(
            "Category deleted successfully."
        );


        await loadCategories();

   } catch (err) {

    console.error(
        "Delete Category Error = ",
        err
    );


    // Close delete dialog
    setDeleteDialogOpen(false);

    // Clear selected category
    setCategoryToDelete(null);


    // Keep error visible on page
    setError(
        err.response?.data?.message ||
        err.response?.data ||
        "Unable to delete category."
    );

} finally {

        setDeletingCategory(false);
    }
};


    /* ============================================
       CREATE CATEGORY
    ============================================ */

    const handleCreateCategory =
        async () => {

            setError("");

            setSuccess("");


            const trimmedName =
                categoryName.trim();


            const trimmedDescription =
                categoryDescription.trim();


            /* ==============================
               VALIDATION
            ============================== */

            if (!trimmedName) {

                setError(
                    "Category name is required."
                );

                return;

            }


            try {

                setCreatingCategory(true);


                /*
                 * Backend CategoryRequest:
                 *
                 * {
                 *     name: String,
                 *     description: String
                 * }
                 */

                const payload = {

                    name:
                        trimmedName,

                    description:
                        trimmedDescription,

                };


                console.log(
                    "Create Category Payload = ",
                    payload
                );


                await catalogService
                    .createCategory(
                        payload
                    );


                /* ==========================
                   SUCCESS
                ========================== */

                setAddDialogOpen(false);

                setCategoryName("");

                setCategoryDescription("");

                setSuccess(
                    "Category created successfully."
                );


                /*
                 * Reload categories so the
                 * newly created category
                 * appears immediately.
                 */

                await loadCategories();

            } catch (err) {

                console.error(
                    "Create Category Error = ",
                    err
                );


                setError(
                    err.response?.data?.message ||
                    err.response?.data ||
                    "Unable to create category."
                );

            } finally {

                setCreatingCategory(false);

            }

        };


    /* ============================================
       ACCESS CHECK
    ============================================ */

    if (!isAdmin) {

        return (

            <Box
                sx={{
                    minHeight:
                        "100vh",

                    display:
                        "flex",

                    alignItems:
                        "center",

                    justifyContent:
                        "center",

                    px:
                        2,

                    background:
                        "linear-gradient(135deg, #080F23 0%, #0F172A 55%, #111827 100%)",
                }}
            >

                <Box
                    sx={{
                        width:
                            "100%",

                        maxWidth:
                            480,

                        p:
                            4,

                        textAlign:
                            "center",

                        borderRadius:
                            3,

                        background:
                            "rgba(255,255,255,.035)",

                        border:
                            "1px solid rgba(255,255,255,.08)",
                    }}
                >

                    <Typography
                        sx={{
                            color:
                                "#F8FAFC",

                            fontSize:
                                22,

                            fontWeight:
                                800,
                        }}
                    >
                        Access Denied
                    </Typography>


                    <Typography
                        sx={{
                            mt:
                                1,

                            color:
                                "#64748B",

                            fontSize:
                                13,

                            lineHeight:
                                1.6,
                        }}
                    >
                        Only administrators can manage
                        product categories.
                    </Typography>


                    <Button
                        onClick={() =>
                            navigate(
                                "/catalog"
                            )
                        }

                        sx={{
                            mt:
                                3,

                            color:
                                "#93C5FD",

                            textTransform:
                                "none",

                            fontWeight:
                                700,
                        }}
                    >
                        Back to Catalog
                    </Button>

                </Box>

            </Box>

        );

    }


    return (

        <Box
            sx={{
                minHeight:
                    "100vh",

                width:
                    "100%",

                background:
                    "linear-gradient(135deg, #080F23 0%, #0F172A 55%, #111827 100%)",

                color:
                    "#fff",

                px: {
                    xs: 2,
                    sm: 3,
                    md: 5,
                },

                py: {
                    xs: 3,
                    md: 5,
                },
            }}
        >

            <Box
                sx={{
                    width:
                        "100%",

                    maxWidth:
                        1100,

                    mx:
                        "auto",
                }}
            >

                {/* =================================
                    HEADER
                ================================= */}

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

                        gap:
                            2,

                        flexWrap:
                            "wrap",

                        mb:
                            3,
                    }}
                >

                    <Box
                        sx={{
                            display:
                                "flex",

                            alignItems:
                                "center",

                            gap:
                                1.5,
                        }}
                    >

                        <Button
                            onClick={() =>
                                navigate(
                                    "/catalog"
                                )
                            }

                            sx={{
                                minWidth:
                                    40,

                                width:
                                    40,

                                height:
                                    40,

                                p:
                                    0,

                                borderRadius:
                                    2,

                                color:
                                    "#94A3B8",

                                border:
                                    "1px solid rgba(255,255,255,.08)",

                                "&:hover":
                                    {
                                        color:
                                            "#F8FAFC",

                                        background:
                                            "rgba(255,255,255,.04)",
                                    },
                            }}
                        >
                            <ArrowBackRounded
                                fontSize="small"
                            />
                        </Button>


                        <Box>

                            <Typography
                                sx={{
                                    color:
                                        "#F8FAFC",

                                    fontSize:
                                        {
                                            xs:
                                                24,

                                            md:
                                                30,
                                        },

                                    fontWeight:
                                        800,

                                    letterSpacing:
                                        "-.5px",
                                }}
                            >
                                Category Management
                            </Typography>


                            <Typography
                                sx={{
                                    mt:
                                        .5,

                                    color:
                                        "#64748B",

                                    fontSize:
                                        13,
                                }}
                            >
                                Manage product categories
                                for your catalog.
                            </Typography>

                        </Box>

                    </Box>


                    {/* =================================
                        ACTIONS
                    ================================= */}

                    <Box
                        sx={{
                            display:
                                "flex",

                            gap:
                                1,
                        }}
                    >

                        <Button
                            startIcon={
                                <RefreshRounded />
                            }

                            onClick={
                                loadCategories
                            }

                            disabled={
                                loading ||
                                 creatingCategory ||
                                 updatingCategory
                            }

                            sx={{
                                minHeight:
                                    40,

                                px:
                                    2,

                                borderRadius:
                                    2,

                                color:
                                    "#93C5FD",

                                border:
                                    "1px solid rgba(96,165,250,.18)",

                                background:
                                    "rgba(59,130,246,.06)",

                                textTransform:
                                    "none",

                                fontWeight:
                                    700,

                                "&:hover":
                                    {
                                        background:
                                            "rgba(59,130,246,.12)",
                                    },
                            }}
                        >
                            Refresh
                        </Button>


                        <Button
                            startIcon={
                                <AddRounded />
                            }

                            onClick={
                                handleOpenAddDialog
                            }

                            disabled={
                                creatingCategory
                            }

                            variant="contained"

                            sx={{
                                minHeight:
                                    40,

                                px:
                                    2,

                                borderRadius:
                                    2,

                                color:
                                    "#fff",

                                background:
                                    "#2563EB",

                                textTransform:
                                    "none",

                                fontWeight:
                                    700,

                                "&:hover":
                                    {
                                        background:
                                            "#1D4ED8",
                                    },
                            }}
                        >
                            Add Category
                        </Button>

                    </Box>

                </Box>


                {/* =================================
                    SUCCESS
                ================================= */}

                {success && (

                    <Alert
                        severity="success"

                        onClose={() =>
                            setSuccess("")
                        }

                        sx={{
                            mb:
                                3,

                            background:
                                "rgba(34,197,94,.08)",

                            color:
                                "#86EFAC",

                            border:
                                "1px solid rgba(34,197,94,.18)",

                            "& .MuiAlert-icon":
                                {
                                    color:
                                        "#4ADE80",
                                },
                        }}
                    >
                        {success}
                    </Alert>

                )}


                {/* =================================
                    ERROR
                ================================= */}

                {error && !addDialogOpen && (

                    <Alert
                        severity="error"

                        onClose={() =>
                            setError("")
                        }

                        sx={{
                            mb:
                                3,

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
                    >
                        {error}
                    </Alert>

                )}


                {/* =================================
                    CATEGORY LIST
                ================================= */}

                {loading ? (

                    <Box
                        sx={{
                            minHeight:
                                300,

                            display:
                                "flex",

                            alignItems:
                                "center",

                            justifyContent:
                                "center",

                            flexDirection:
                                "column",

                            gap:
                                2,

                            borderRadius:
                                3,

                            background:
                                "rgba(255,255,255,.025)",

                            border:
                                "1px solid rgba(255,255,255,.07)",
                        }}
                    >

                        <CircularProgress
                            size={
                                28
                            }

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
                            Loading categories...
                        </Typography>

                    </Box>

                ) : (

                    <Box
                        sx={{
                            p:
                                {
                                    xs:
                                        2,

                                    md:
                                        3,
                                },

                            borderRadius:
                                3,

                            background:
                                "rgba(255,255,255,.035)",

                            border:
                                "1px solid rgba(255,255,255,.08)",
                        }}
                    >

                        {/* LIST HEADER */}

                        <Box
                            sx={{
                                display:
                                    "flex",

                                alignItems:
                                    "center",

                                justifyContent:
                                    "space-between",

                                mb:
                                    2.5,
                            }}
                        >

                            <Box>

                                <Typography
                                    sx={{
                                        color:
                                            "#F8FAFC",

                                        fontSize:
                                            17,

                                        fontWeight:
                                            750,
                                    }}
                                >
                                    Categories
                                </Typography>


                                <Typography
                                    sx={{
                                        mt:
                                            .4,

                                        color:
                                            "#64748B",

                                        fontSize:
                                            12,
                                    }}
                                >
                                    {
                                        categories.length
                                    }{" "}
                                    categories available
                                </Typography>

                            </Box>


                            <CategoryOutlined
                                sx={{
                                    color:
                                        "#60A5FA",

                                    fontSize:
                                        26,
                                }}
                            />

                        </Box>


                        {/* EMPTY STATE */}

                        {categories.length === 0 ? (

                            <Box
                                sx={{
                                    py:
                                        7,

                                    textAlign:
                                        "center",
                                }}
                            >

                                <CategoryOutlined
                                    sx={{
                                        fontSize:
                                            42,

                                        color:
                                            "#334155",

                                        mb:
                                            1,
                                    }}
                                />


                                <Typography
                                    sx={{
                                        color:
                                            "#94A3B8",

                                        fontSize:
                                            14,

                                        fontWeight:
                                            600,
                                    }}
                                >
                                    No categories found
                                </Typography>


                                <Typography
                                    sx={{
                                        mt:
                                            .5,

                                        color:
                                            "#475569",

                                        fontSize:
                                            12,
                                    }}
                                >
                                    Add your first category
                                    using the button above.
                                </Typography>

                            </Box>

                        ) : (

                            <Box
                                sx={{
                                    display:
                                        "flex",

                                    flexDirection:
                                        "column",

                                    gap:
                                        1,
                                }}
                            >

                                {categories.map(
                                    (
                                        category
                                    ) => (

                                        <Box
                                            key={
                                                category.id
                                            }

                                            sx={{
                                                minHeight:
                                                    58,

                                                px:
                                                    {
                                                        xs:
                                                            1.5,

                                                        md:
                                                            2,
                                                    },

                                                py:
                                                    1,

                                                display:
                                                    "flex",

                                                alignItems:
                                                    "center",

                                                gap:
                                                    1.5,

                                                borderRadius:
                                                    2,

                                                background:
                                                    "rgba(255,255,255,.025)",

                                                border:
                                                    "1px solid rgba(255,255,255,.06)",
                                            }}
                                        >

                                            <Box
                                                sx={{
                                                    width:
                                                        36,

                                                    height:
                                                        36,

                                                    flexShrink:
                                                        0,

                                                    display:
                                                        "flex",

                                                    alignItems:
                                                        "center",

                                                    justifyContent:
                                                        "center",

                                                    borderRadius:
                                                        1.8,

                                                    background:
                                                        "rgba(59,130,246,.10)",
                                                }}
                                            >

                                                <CategoryOutlined
                                                    sx={{
                                                        fontSize:
                                                            19,

                                                        color:
                                                            "#60A5FA",
                                                    }}
                                                />

                                            </Box>


                                            <Box
                                                sx={{
                                                    minWidth:
                                                        0,

                                                    flex:
                                                        1,
                                                }}
                                            >

                                                <Typography
                                                    sx={{
                                                        color:
                                                            "#F8FAFC",

                                                        fontSize:
                                                            13,

                                                        fontWeight:
                                                            700,

                                                        overflow:
                                                            "hidden",

                                                        textOverflow:
                                                            "ellipsis",

                                                        whiteSpace:
                                                            "nowrap",
                                                    }}
                                                >
                                                    {
                                                        category.name ||
                                                        "Unnamed Category"
                                                    }
                                                </Typography>


                                                {category.description && (

                                                    <Typography
                                                        sx={{
                                                            mt:
                                                                .2,

                                                            color:
                                                                "#64748B",

                                                            fontSize:
                                                                11,

                                                            overflow:
                                                                "hidden",

                                                            textOverflow:
                                                                "ellipsis",

                                                            whiteSpace:
                                                                "nowrap",
                                                        }}
                                                    >
                                                        {
                                                            category.description
                                                        }
                                                    </Typography>

                                                )}

                                            </Box>

                                            <Button
    startIcon={
        <EditOutlined />
    }

    onClick={() =>
        handleOpenEditDialog(
            category
        )
    }

    disabled={
        updatingCategory
    }

    sx={{
        flexShrink: 0,

        minWidth: 0,

        px: 1.5,

        py: 0.7,

        borderRadius: 2,

        color: "#93C5FD",

        border:
            "1px solid rgba(96,165,250,.18)",

        background:
            "rgba(59,130,246,.06)",

        textTransform:
            "none",

        fontWeight: 700,

        fontSize: 12,

        "&:hover": {
            background:
                "rgba(59,130,246,.12)",
        },
    }}
>
    Edit
</Button>

<Button
    startIcon={
        <DeleteOutlineRounded />
    }

    onClick={() =>
        handleOpenDeleteDialog(category)
    }

    disabled={
        deletingCategory ||
        updatingCategory
    }

    sx={{
        flexShrink: 0,

        minWidth: 0,

        px: 1.5,

        py: 0.7,

        borderRadius: 2,

        color: "#FCA5A5",

        border:
            "1px solid rgba(239,68,68,.18)",

        background:
            "rgba(239,68,68,.06)",

        textTransform: "none",

        fontWeight: 700,

        fontSize: 12,

        "&:hover": {
            background:
                "rgba(239,68,68,.12)",
        },
    }}
>
    Delete
</Button>


                                        </Box>

                                    )
                                )}

                            </Box>

                        )}

                    </Box>

                )}

            </Box>


            {/* =====================================
                ADD CATEGORY DIALOG
            ===================================== */}

            <Dialog
                open={
                    addDialogOpen
                }

                onClose={
                    creatingCategory
                        ? undefined
                        : handleCloseAddDialog
                }

                fullWidth

                maxWidth="sm"

                PaperProps={{
                    sx: {
                        borderRadius:
                            3,

                        background:
                            "#111827",

                        color:
                            "#F8FAFC",

                        border:
                            "1px solid rgba(255,255,255,.08)",
                    },
                }}
            >

                <DialogTitle
                    sx={{
                        color:
                            "#F8FAFC",

                        fontWeight:
                            800,

                        fontSize:
                            19,
                    }}
                >
                    Add Category
                </DialogTitle>


                <DialogContent>

                    {/* ERROR INSIDE DIALOG */}

                    {error && (

                        <Alert
                            severity="error"

                            sx={{
                                mb:
                                    2,

                                mt:
                                    1,

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
                        >
                            {error}
                        </Alert>

                    )}


                    {/* CATEGORY NAME */}

                    <TextField
                        fullWidth

                        required

                        autoFocus

                        label="Category Name"

                        value={
                            categoryName
                        }

                        onChange={(event) => {

                            setCategoryName(
                                event.target.value
                            );

                            setError("");

                        }}

                        placeholder={
                            "e.g. Mobiles"
                        }

                        disabled={
                            creatingCategory
                        }

                        sx={{
                            mt:
                                1,

                            mb:
                                2,

                            "& .MuiOutlinedInput-root":
                                {
                                    color:
                                        "#F8FAFC",

                                    background:
                                        "rgba(255,255,255,.025)",

                                    borderRadius:
                                        2,

                                    "& fieldset":
                                        {
                                            borderColor:
                                                "rgba(255,255,255,.08)",
                                        },

                                    "&:hover fieldset":
                                        {
                                            borderColor:
                                                "rgba(255,255,255,.18)",
                                        },

                                    "&.Mui-focused fieldset":
                                        {
                                            borderColor:
                                                "#3B82F6",
                                        },
                                },

                            "& .MuiInputLabel-root":
                                {
                                    color:
                                        "#64748B",
                                },

                            "& .MuiInputLabel-root.Mui-focused":
                                {
                                    color:
                                        "#60A5FA",
                                },
                        }}
                    />


                    {/* DESCRIPTION */}

                    <TextField
                        fullWidth

                        multiline

                        minRows={
                            3
                        }

                        label="Description"

                        value={
                            categoryDescription
                        }

                        onChange={(event) => {

                            setCategoryDescription(
                                event.target.value
                            );

                            setError("");

                        }}

                        placeholder={
                            "Optional category description"
                        }

                        disabled={
                            creatingCategory
                        }

                        sx={{
                            "& .MuiOutlinedInput-root":
                                {
                                    color:
                                        "#F8FAFC",

                                    background:
                                        "rgba(255,255,255,.025)",

                                    borderRadius:
                                        2,

                                    "& fieldset":
                                        {
                                            borderColor:
                                                "rgba(255,255,255,.08)",
                                        },

                                    "&:hover fieldset":
                                        {
                                            borderColor:
                                                "rgba(255,255,255,.18)",
                                        },

                                    "&.Mui-focused fieldset":
                                        {
                                            borderColor:
                                                "#3B82F6",
                                        },
                                },

                            "& .MuiInputLabel-root":
                                {
                                    color:
                                        "#64748B",
                                },

                            "& .MuiInputLabel-root.Mui-focused":
                                {
                                    color:
                                        "#60A5FA",
                                },
                        }}
                    />

                </DialogContent>


                {/* =================================
                    DIALOG ACTIONS
                ================================= */}

                <DialogActions
                    sx={{
                        px:
                            3,

                        pb:
                            2.5,

                        gap:
                            1,
                    }}
                >

                    <Button
                        onClick={
                            handleCloseAddDialog
                        }

                        disabled={
                            creatingCategory
                        }

                        sx={{
                            color:
                                "#94A3B8",

                            textTransform:
                                "none",

                            fontWeight:
                                700,

                            borderRadius:
                                2,

                            "&:hover":
                                {
                                    background:
                                        "rgba(255,255,255,.05)",
                                },
                        }}
                    >
                        Cancel
                    </Button>


                    <Button
                        variant="contained"

                        onClick={
                            handleCreateCategory
                        }

                        disabled={
                            creatingCategory
                        }

                        startIcon={
                            creatingCategory ? (

                                <CircularProgress
                                    size={
                                        16
                                    }

                                    sx={{
                                        color:
                                            "#fff",
                                    }}
                                />

                            ) : (

                                <AddRounded />

                            )
                        }

                        sx={{
                            color:
                                "#fff",

                            background:
                                "#2563EB",

                            textTransform:
                                "none",

                            fontWeight:
                                700,

                            borderRadius:
                                2,

                            "&:hover":
                                {
                                    background:
                                        "#1D4ED8",
                                },
                        }}
                    >
                        {creatingCategory
                            ? "Creating..."
                            : "Create Category"}
                    </Button>

                </DialogActions>

            </Dialog>

            <Dialog
    open={editDialogOpen}

    onClose={
        updatingCategory
            ? undefined
            : handleCloseEditDialog
    }

    fullWidth

    maxWidth="sm"

    PaperProps={{
        sx: {
            borderRadius: 3,

            background: "#111827",

            color: "#F8FAFC",

            border:
                "1px solid rgba(255,255,255,.08)",
        },
    }}
>

    <DialogTitle
        sx={{
            color: "#F8FAFC",

            fontWeight: 800,

            fontSize: 19,
        }}
    >
        Edit Category
    </DialogTitle>


    <DialogContent>

        {error && (

            <Alert
                severity="error"

                sx={{
                    mb: 2,

                    mt: 1,

                    background:
                        "rgba(239,68,68,.08)",

                    color: "#FCA5A5",

                    border:
                        "1px solid rgba(239,68,68,.18)",
                }}
            >
                {error}
            </Alert>

        )}


        <TextField
            fullWidth

            required

            autoFocus

            label="Category Name"

            value={categoryName}

            onChange={(event) => {

                setCategoryName(
                    event.target.value
                );

                setError("");

            }}

            disabled={
                updatingCategory
            }

            sx={{
                mt: 1,

                mb: 2,

                "& .MuiOutlinedInput-root": {
                    color: "#F8FAFC",

                    background:
                        "rgba(255,255,255,.025)",

                    borderRadius: 2,

                    "& fieldset": {
                        borderColor:
                            "rgba(255,255,255,.08)",
                    },

                    "&:hover fieldset": {
                        borderColor:
                            "rgba(255,255,255,.18)",
                    },

                    "&.Mui-focused fieldset": {
                        borderColor:
                            "#3B82F6",
                    },
                },

                "& .MuiInputLabel-root": {
                    color: "#64748B",
                },

                "& .MuiInputLabel-root.Mui-focused": {
                    color: "#60A5FA",
                },
            }}
        />


        <TextField
            fullWidth

            multiline

            minRows={3}

            label="Description"

            value={
                categoryDescription
            }

            onChange={(event) => {

                setCategoryDescription(
                    event.target.value
                );

                setError("");

            }}

            disabled={
                updatingCategory
            }

            sx={{
                "& .MuiOutlinedInput-root": {
                    color: "#F8FAFC",

                    background:
                        "rgba(255,255,255,.025)",

                    borderRadius: 2,

                    "& fieldset": {
                        borderColor:
                            "rgba(255,255,255,.08)",
                    },

                    "&:hover fieldset": {
                        borderColor:
                            "rgba(255,255,255,.18)",
                    },

                    "&.Mui-focused fieldset": {
                        borderColor:
                            "#3B82F6",
                    },
                },

                "& .MuiInputLabel-root": {
                    color: "#64748B",
                },

                "& .MuiInputLabel-root.Mui-focused": {
                    color: "#60A5FA",
                },
            }}
        />

    </DialogContent>


    <DialogActions
        sx={{
            px: 3,

            pb: 2.5,

            gap: 1,
        }}
    >

        <Button
            onClick={
                handleCloseEditDialog
            }

            disabled={
                updatingCategory
            }

            sx={{
                color: "#94A3B8",

                textTransform: "none",

                fontWeight: 700,

                borderRadius: 2,

                "&:hover": {
                    background:
                        "rgba(255,255,255,.05)",
                },
            }}
        >
            Cancel
        </Button>


        <Button
            variant="contained"

            onClick={
                handleUpdateCategory
            }

            disabled={
                updatingCategory
            }

            startIcon={
                updatingCategory ? (

                    <CircularProgress
                        size={16}

                        sx={{
                            color: "#fff",
                        }}
                    />

                ) : (

                    <SaveOutlined />

                )
            }

            sx={{
                color: "#fff",

                background: "#2563EB",

                textTransform: "none",

                fontWeight: 700,

                borderRadius: 2,

                "&:hover": {
                    background:
                        "#1D4ED8",
                },
            }}
        >
            {updatingCategory
                ? "Updating..."
                : "Update Category"}
        </Button>

    </DialogActions>

</Dialog>

<Dialog
    open={deleteDialogOpen}

    onClose={
        deletingCategory
            ? undefined
            : handleDeleteCancel
    }

    PaperProps={{
        sx: {
            width: "100%",

            maxWidth: 440,

            borderRadius: 3,

            background: "#111827",

            color: "#F8FAFC",

            border:
                "1px solid rgba(255,255,255,.08)",
        },
    }}
>

    <DialogTitle
        sx={{
            color: "#F8FAFC",

            fontWeight: 800,

            fontSize: 18,
        }}
    >
        Delete Category?
    </DialogTitle>


    <DialogContent>

        <Typography
            sx={{
                color: "#94A3B8",

                fontSize: 13,

                lineHeight: 1.6,
            }}
        >
            Are you sure you want to delete{" "}

            <Box
                component="span"
                sx={{
                    color: "#F8FAFC",

                    fontWeight: 700,
                }}
            >
                {
                    categoryToDelete?.name ||
                    "this category"
                }
            </Box>
            ?

            <br />

            This action cannot be undone.
        </Typography>

    </DialogContent>


    <DialogActions
        sx={{
            px: 3,

            pb: 2.5,

            gap: 1,
        }}
    >

        <Button
            onClick={
                handleDeleteCancel
            }

            disabled={
                deletingCategory
            }

            sx={{
                color: "#94A3B8",

                textTransform: "none",

                fontWeight: 700,

                borderRadius: 2,

                "&:hover": {
                    background:
                        "rgba(255,255,255,.05)",
                },
            }}
        >
            Cancel
        </Button>


        <Button
            variant="contained"

            onClick={
                handleDeleteConfirm
            }

            disabled={
                deletingCategory
            }

            startIcon={
                deletingCategory ? (

                    <CircularProgress
                        size={16}

                        sx={{
                            color: "#fff",
                        }}
                    />

                ) : (

                    <DeleteOutlineRounded />

                )
            }

            sx={{
                color: "#fff",

                background: "#DC2626",

                textTransform: "none",

                fontWeight: 700,

                borderRadius: 2,

                "&:hover": {
                    background: "#B91C1C",
                },
            }}
        >
            {deletingCategory
                ? "Deleting..."
                : "Delete"}
        </Button>

    </DialogActions>

</Dialog>


        </Box>

    );

}