import apiClient from "../api/apiClient";

/*
=================================================
CATALOG SERVICE

Frontend
   ↓
API Gateway :8080
   ↓
/catalog/**
   ↓
Catalog Service :8085
   ↓
/api/products
/api/categories

All requests go through apiClient.

apiClient automatically attaches:
Authorization: Bearer <JWT>

=================================================
*/


/* =================================================
   PRODUCT APIs
================================================= */


/**
 * Get paginated products
 *
 * Backend:
 * GET /api/products?page=0&size=10
 */
const getProducts = async (
    page = 0,
    size = 10
) => {

    const response =
        await apiClient.get(
            "/catalog/api/products",
            {
                params: {
                    page,
                    size,
                },
            }
        );

    return response.data;
};


/**
 * Get all products without pagination
 *
 * Backend:
 * GET /api/products/all
 */
const getAllProducts = async () => {

    const response =
        await apiClient.get(
            "/catalog/api/products/all"
        );

    return response.data;
};


/**
 * Get product by ID
 *
 * Backend:
 * GET /api/products/{id}
 */
const getProductById = async (
    productId
) => {

    const response =
        await apiClient.get(
            `/catalog/api/products/${productId}`
        );

    return response.data;
};


/**
 * Search products
 *
 * Backend:
 * GET /api/products/search?keyword=phone
 */
const searchProducts = async (
    keyword
) => {

    const response =
        await apiClient.get(
            "/catalog/api/products/search",
            {
                params: {
                    keyword,
                },
            }
        );

    return response.data;
};


/**
 * Get products by category
 *
 * Backend:
 * GET /api/products/category/{categoryId}
 */
const getProductsByCategory = async (
    categoryId
) => {

    const response =
        await apiClient.get(
            `/catalog/api/products/category/${categoryId}`
        );

    return response.data;
};


/**
 * Create product
 *
 * Backend:
 * POST /api/products
 *
 * Used by:
 * ADMIN / SALESMAN
 */
const createProduct = async (
    productData
) => {

    const response =
        await apiClient.post(
            "/catalog/api/products",
            productData
        );

    return response.data;
};


/**
 * Update product
 *
 * Backend:
 * PUT /api/products/{id}
 */
const updateProduct = async (
    productId,
    productData
) => {

    const response =
        await apiClient.put(
            `/catalog/api/products/${productId}`,
            productData
        );

    return response.data;
};


/**
 * Delete product
 *
 * Backend:
 * DELETE /api/products/{id}
 *
 * NOTE:
 * Backend currently performs hard delete.
 * We will revisit this when implementing
 * Admin Product Management.
 */
const deleteProduct = async (
    productId
) => {

    const response =
        await apiClient.delete(
            `/catalog/api/products/${productId}`
        );

    return response.data;
};


/* =================================================
   CATEGORY APIs
================================================= */


/**
 * Get all categories
 *
 * Backend:
 * GET /api/categories
 */
const getCategories = async () => {

    const response =
        await apiClient.get(
            "/catalog/api/categories"
        );

    return response.data;
};


/**
 * Get category by ID
 *
 * Backend:
 * GET /api/categories/{id}
 */
const getCategoryById = async (
    categoryId
) => {

    const response =
        await apiClient.get(
            `/catalog/api/categories/${categoryId}`
        );

    return response.data;
};


/**
 * Create category
 *
 * Backend:
 * POST /api/categories
 *
 * Admin functionality - later
 */
const createCategory = async (
    categoryData
) => {

    const response =
        await apiClient.post(
            "/catalog/api/categories",
            categoryData
        );

    return response.data;
};


/**
 * Update category
 *
 * Backend:
 * PUT /api/categories/{id}
 */
const updateCategory = async (
    categoryId,
    categoryData
) => {

    const response =
        await apiClient.put(
            `/catalog/api/categories/${categoryId}`,
            categoryData
        );

    return response.data;
};


/**
 * Delete category
 *
 * Backend:
 * DELETE /api/categories/{id}
 */
const deleteCategory = async (
    categoryId
) => {

    const response =
        await apiClient.delete(
            `/catalog/api/categories/${categoryId}`
        );

    return response.data;
};


/* =================================================
   PRODUCT COUNT
================================================= */


/**
 * Get total number of products
 *
 * Backend:
 * GET /api/products/count
 */
const getProductCount = async () => {

    const response =
        await apiClient.get(
            "/catalog/api/products/count"
        );

    return response.data;
};


/* =================================================
   CATEGORY COUNT
================================================= */


/**
 * Get total number of categories
 *
 * Backend:
 * GET /api/categories/count
 */
const getCategoryCount = async () => {

    const response =
        await apiClient.get(
            "/catalog/api/categories/count"
        );

    return response.data;
};


/* =================================================
   EXPORT
================================================= */

const catalogService = {

    // Products
    getProducts,
    getAllProducts,
    getProductById,
    searchProducts,
    getProductsByCategory,

    // Product Management
    createProduct,
    updateProduct,
    deleteProduct,

    // Categories
    getCategories,
    getCategoryById,
    createCategory,
    updateCategory,
    deleteCategory,

    // Counts
    getProductCount,
    getCategoryCount,

};


export default catalogService;