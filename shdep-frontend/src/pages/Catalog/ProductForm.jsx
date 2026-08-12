import {
    Alert,
    Box,
    Button,
    CircularProgress,
    MenuItem,
    TextField,
    Typography,
} from "@mui/material";

import {
    ArrowBackRounded,
    SaveRounded,
} from "@mui/icons-material";

import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

import catalogService
    from "../../services/catalogService";


export default function ProductForm() {

    const navigate = useNavigate();

    const { id } = useParams();

    const isEditMode = Boolean(id);


    /* ============================================
       FORM
    ============================================ */

    const [formData, setFormData] = useState({
        name: "",
        description: "",
        price: "",
        stockQuantity: "",
        imageUrl: "",
        categoryId: "",
    });


    /* ============================================
       CATEGORIES
    ============================================ */

    const [
        categories,
        setCategories,
    ] = useState([]);


    /* ============================================
       STATES
    ============================================ */

    const [
        loading,
        setLoading,
    ] = useState(isEditMode);


    const [
        submitting,
        setSubmitting,
    ] = useState(false);


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

    const loadCategories = async () => {

        try {

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
                "Category Load Error = ",
                err
            );

            setError(
                err.response?.data?.message ||
                err.response?.data ||
                "Unable to load categories."
            );

        }

    };


    /* ============================================
       LOAD PRODUCT FOR EDIT
    ============================================ */

    const loadProduct = async () => {

        if (!id) {
            return;
        }


        try {

            setLoading(true);

            setError("");


            const product =
                await catalogService
                    .getProductById(id);


            setFormData({
                name:
                    product?.name || "",

                description:
                    product?.description || "",

                price:
                    product?.price ?? "",

                stockQuantity:
                    product?.stockQuantity ?? "",

                imageUrl:
                    product?.imageUrl || "",

                categoryId:
                    product?.categoryId || "",
            });

        } catch (err) {

            console.error(
                "Product Load Error = ",
                err
            );


            setError(
                err.response?.data?.message ||
                err.response?.data ||
                "Unable to load product."
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

        loadProduct();

    }, [id]);


    /* ============================================
       INPUT HANDLER
    ============================================ */

    const handleChange = (
        event
    ) => {

        const {
            name,
            value,
        } = event.target;


        setFormData(
            (previous) => ({
                ...previous,
                [name]: value,
            })
        );


        setError("");

        setSuccess("");

    };


    /* ============================================
       VALIDATION
    ============================================ */

    const validateForm = () => {

        if (!formData.name.trim()) {

            return "Product name is required.";

        }


        if (!formData.description.trim()) {

            return "Product description is required.";

        }


        if (
            formData.price === "" ||
            Number(formData.price) < 0
        ) {

            return "Please enter a valid price.";

        }


        if (
            formData.stockQuantity === "" ||
            Number(formData.stockQuantity) < 0
        ) {

            return "Please enter a valid stock quantity.";

        }


        if (!formData.categoryId) {

            return "Please select a category.";

        }


        return "";

    };


    /* ============================================
       SUBMIT
    ============================================ */

    const handleSubmit = async (
        event
    ) => {

        event.preventDefault();


        setError("");

        setSuccess("");


        const validationError =
            validateForm();


        if (validationError) {

            setError(
                validationError
            );

            return;

        }


        const payload = {

            name:
                formData.name.trim(),

            description:
                formData.description.trim(),

            price:
                Number(formData.price),

            stockQuantity:
                Number(
                    formData.stockQuantity
                ),

            imageUrl:
                formData.imageUrl.trim(),

            categoryId:
                formData.categoryId,
        };


        try {

            setSubmitting(true);


            if (isEditMode) {

                await catalogService
                    .updateProduct(
                        id,
                        payload
                    );


                setSuccess(
                    "Product updated successfully."
                );

            } else {

                await catalogService
                    .createProduct(
                        payload
                    );


                setSuccess(
                    "Product created successfully."
                );

            }


            /*
             * Give the success message a moment
             * before returning to Catalog.
             */

            setTimeout(() => {

                navigate("/catalog");

            }, 800);

        } catch (err) {

            console.error(
                "Product Save Error = ",
                err
            );


            setError(
                err.response?.data?.message ||
                err.response?.data ||
                "Unable to save product."
            );

        } finally {

            setSubmitting(false);

        }

    };


    /* ============================================
       BACK
    ============================================ */

    const handleBack = () => {

        navigate("/catalog");

    };


    /* ============================================
       LOADING EDIT PRODUCT
    ============================================ */

    if (loading) {

        return (

            <Box
                sx={{
                    minHeight: "100vh",

                    display:
                        "flex",

                    alignItems:
                        "center",

                    justifyContent:
                        "center",

                    flexDirection:
                        "column",

                    gap: 2,

                    background:
                        "linear-gradient(135deg, #080F23 0%, #0F172A 55%, #111827 100%)",
                }}
            >

                <CircularProgress
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
                    Loading product...
                </Typography>

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
                        900,

                    mx:
                        "auto",
                }}
            >

                {/* =================================
                    BACK
                ================================= */}

                <Button
                    startIcon={
                        <ArrowBackRounded />
                    }

                    onClick={
                        handleBack
                    }

                    sx={{
                        mb:
                            3,

                        color:
                            "#94A3B8",

                        textTransform:
                            "none",

                        fontWeight:
                            600,

                        "&:hover":
                            {
                                color:
                                    "#F8FAFC",

                                background:
                                    "rgba(255,255,255,.04)",
                            },
                    }}
                >
                    Back to Catalog
                </Button>


                {/* =================================
                    HEADER
                ================================= */}

                <Box
                    sx={{
                        mb:
                            3,
                    }}
                >

                    <Typography
                        sx={{
                            color:
                                "#F8FAFC",

                            fontSize:
                                {
                                    xs: 25,
                                    md: 32,
                                },

                            fontWeight:
                                800,

                            letterSpacing:
                                "-.5px",
                        }}
                    >
                        {isEditMode
                            ? "Edit Product"
                            : "Add Product"}
                    </Typography>


                    <Typography
                        sx={{
                            mt:
                                .6,

                            color:
                                "#64748B",

                            fontSize:
                                13,
                        }}
                    >
                        {isEditMode
                            ? "Update the product information below."
                            : "Add a new product to the catalog."}
                    </Typography>

                </Box>


                {/* =================================
                    FORM CARD
                ================================= */}

                <Box
                    component="form"

                    onSubmit={
                        handleSubmit
                    }

                    sx={{
                        p: {
                            xs: 2.5,
                            md: 4,
                        },

                        borderRadius:
                            3,

                        background:
                            "rgba(255,255,255,.035)",

                        border:
                            "1px solid rgba(255,255,255,.08)",

                        backdropFilter:
                            "blur(15px)",
                    }}
                >

                    {/* =============================
                        ERROR
                    ============================= */}

                    {error && (

                        <Alert
                            severity="error"

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


                    {/* =============================
                        SUCCESS
                    ============================= */}

                    {success && (

                        <Alert
                            severity="success"

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


                    {/* =============================
                        BASIC INFORMATION
                    ============================= */}

                    <Typography
                        sx={{
                            color:
                                "#CBD5E1",

                            fontSize:
                                14,

                            fontWeight:
                                700,

                            mb:
                                2,
                        }}
                    >
                        Product Information
                    </Typography>


                    {/* NAME */}

                    <TextField
                        fullWidth

                        required

                        name="name"

                        label="Product Name"

                        value={
                            formData.name
                        }

                        onChange={
                            handleChange
                        }

                        placeholder="Enter product name"

                        sx={{
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

                        required

                        multiline

                        minRows={4}

                        name="description"

                        label="Description"

                        value={
                            formData.description
                        }

                        onChange={
                            handleChange
                        }

                        placeholder="Describe the product"

                        sx={{
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


                    {/* =============================
                        PRICE + STOCK
                    ============================= */}

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
                                },

                            gap:
                                2,

                            mb:
                                2,
                        }}
                    >

                        {/* PRICE */}

                        <TextField
                            fullWidth

                            required

                            type="number"

                            name="price"

                            label="Price"

                            value={
                                formData.price
                            }

                            onChange={
                                handleChange
                            }

                            inputProps={{
                                min: 0,

                                step:
                                    "0.01",
                            }}

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


                        {/* STOCK */}

                        <TextField
                            fullWidth

                            required

                            type="number"

                            name="stockQuantity"

                            label="Stock Quantity"

                            value={
                                formData.stockQuantity
                            }

                            onChange={
                                handleChange
                            }

                            inputProps={{
                                min: 0,

                                step: 1,
                            }}

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

                    </Box>


                    {/* =============================
                        CATEGORY
                    ============================= */}

                    <TextField
                        fullWidth

                        required

                        select

                        name="categoryId"

                        label="Category"

                        value={
                            formData.categoryId
                        }

                        onChange={
                            handleChange
                        }

                        sx={{
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

                        SelectProps={{
                            MenuProps: {
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
                            },
                        }}
                    >

                        <MenuItem
                            value=""
                            disabled
                        >
                            Select Category
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


                    {/* =============================
                        IMAGE URL
                    ============================= */}

                    <TextField
                        fullWidth

                        name="imageUrl"

                        label="Image URL"

                        value={
                            formData.imageUrl
                        }

                        onChange={
                            handleChange
                        }

                        placeholder="https://example.com/product.jpg"

                        helperText="Optional"

                        sx={{
                            mb:
                                3,

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

                            "& .MuiFormHelperText-root":
                                {
                                    color:
                                        "#475569",
                                },
                        }}
                    />


                    {/* =============================
                        ACTIONS
                    ============================= */}

                    <Box
                        sx={{
                            display:
                                "flex",

                            justifyContent:
                                "flex-end",

                            gap:
                                1.5,

                            flexWrap:
                                "wrap",
                        }}
                    >

                        <Button
                            type="button"

                            onClick={
                                handleBack
                            }

                            disabled={
                                submitting
                            }

                            sx={{
                                minHeight:
                                    42,

                                px:
                                    2.5,

                                color:
                                    "#94A3B8",

                                border:
                                    "1px solid rgba(255,255,255,.08)",

                                borderRadius:
                                    2,

                                textTransform:
                                    "none",

                                "&:hover":
                                    {
                                        color:
                                            "#F8FAFC",

                                        background:
                                            "rgba(255,255,255,.04)",
                                    },
                            }}
                        >
                            Cancel
                        </Button>


                        <Button
                            type="submit"

                            variant="contained"

                            disabled={
                                submitting
                            }

                            startIcon={
                                submitting
                                    ? (
                                        <CircularProgress
                                            size={17}

                                            sx={{
                                                color:
                                                    "#fff",
                                            }}
                                        />
                                    )
                                    : (
                                        <SaveRounded />
                                    )
                            }

                            sx={{
                                minHeight:
                                    42,

                                px:
                                    2.8,

                                borderRadius:
                                    2,

                                textTransform:
                                    "none",

                                fontWeight:
                                    700,

                                background:
                                    "#2563EB",

                                "&:hover":
                                    {
                                        background:
                                            "#1D4ED8",
                                    },
                            }}
                        >
                            {submitting
                                ? "Saving..."
                                : isEditMode
                                    ? "Update Product"
                                    : "Create Product"}
                        </Button>

                    </Box>

                </Box>

            </Box>

        </Box>
    );
}