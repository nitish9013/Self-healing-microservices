import ProtectedRoute from "../components/auth/ProtectedRoute";
import { BrowserRouter, Routes, Route } from "react-router-dom";

import Login from "../pages/auth/Login";
import Register from "../pages/auth/Register";
import Dashboard from "../pages/dashboard/Dashboard";

import ProductDetails from "../pages/Catalog/ProductDetails";
import Catalog from "../pages/Catalog/Catalog";
import ProductForm from "../pages/Catalog/ProductForm";
import CategoryManagement from "../pages/Catalog/CategoryManagement";

import Order from "../pages/Order/Order";
import Payment from "../pages/Payment/Payment";
import PaymentDetails from "../pages/Payment/PaymentDetails";
import OrderDetails from "../pages/Order/OrderDetails";

import Wishlist from "../pages/wishlist/Wishlist";
import Support from "../pages/support/Support";
import Profile from "../pages/profile/Profile";
import Settings from "../pages/settings/Settings";
import Cart from "../pages/cart/Cart";

import CartDrawer from "../components/cart/CartDrawer";
import MobileBottomNav from "../components/common/MobileBottomNav";

import AdminRoute from "../components/auth/AdminRoute";
import AdminDashboard from "../pages/admin/AdminDashboard";
import AdminServices from "../pages/admin/AdminServices";
import AdminUsers from "../pages/admin/AdminUsers";
import AdminOrders from "../pages/admin/AdminOrders";
import AdminPayments from "../pages/admin/AdminPayments";
import AdminCatalog from "../pages/admin/AdminCatalog";
import AdminKafka from "../pages/admin/AdminKafka";
import AdminLogs from "../pages/admin/AdminLogs";
import AdminAlerts from "../pages/admin/AdminAlerts";
import AdminSystemMetrics from "../pages/admin/AdminSystemMetrics";
import AdminSettings from "../pages/admin/AdminSettings";


function AppRoutes() {
    return (
        <BrowserRouter>

            <Routes>

                <Route
                    path="/"
                    element={<Login />}
                />

                <Route
                    path="/login"
                    element={<Login />}
                />

                <Route
                    path="/register"
                    element={<Register />}
                />


                {/* ================= ADMIN ================= */}

                <Route
                    path="/admin"
                    element={
                        <ProtectedRoute>
                            <AdminRoute>
                                <AdminDashboard />
                            </AdminRoute>
                        </ProtectedRoute>
                    }
                />


                <Route
                    path="/admin/services"
                    element={
                        <ProtectedRoute>
                            <AdminRoute>
                                <AdminServices />
                            </AdminRoute>
                        </ProtectedRoute>
                    }
                />


                <Route
                    path="/admin/users"
                    element={
                        <ProtectedRoute>
                            <AdminRoute>
                                <AdminUsers />
                            </AdminRoute>
                        </ProtectedRoute>
                    }
                />


                <Route
                    path="/admin/orders"
                    element={
                        <ProtectedRoute>
                            <AdminRoute>
                                <AdminOrders />
                            </AdminRoute>
                        </ProtectedRoute>
                    }
                />


                <Route
                    path="/admin/payments"
                    element={
                        <ProtectedRoute>
                            <AdminRoute>
                                <AdminPayments />
                            </AdminRoute>
                        </ProtectedRoute>
                    }
                />
<Route
    path="/admin/catalog"
    element={
        <ProtectedRoute>
            <AdminRoute>
                <AdminCatalog />
            </AdminRoute>
        </ProtectedRoute>
    }
/>

<Route
    path="/admin/kafka"
    element={
        <ProtectedRoute>
            <AdminRoute>
                <AdminKafka />
            </AdminRoute>
        </ProtectedRoute>
    }
/>

<Route
    path="/admin/logs"
    element={
        <ProtectedRoute>
            <AdminRoute>
                <AdminLogs />
            </AdminRoute>
        </ProtectedRoute>
    }
/>

<Route
    path="/admin/alerts"
    element={
        <ProtectedRoute>
            <AdminRoute>
                <AdminAlerts />
            </AdminRoute>
        </ProtectedRoute>
    }
/>

<Route
    path="/admin/system/metrics"
    element={
        <ProtectedRoute>
            <AdminRoute>
                <AdminSystemMetrics />
            </AdminRoute>
        </ProtectedRoute>
    }
/>

<Route
    path="/admin/settings"
    element={
        <ProtectedRoute>
            <AdminRoute>
                <AdminSettings />
            </AdminRoute>
        </ProtectedRoute>
    }
/>
                {/* ================= USER DASHBOARD ================= */}

                <Route
                    path="/dashboard"
                    element={
                        <ProtectedRoute>
                            <Dashboard />
                        </ProtectedRoute>
                    }
                />


                {/* ================= PAYMENTS ================= */}

                <Route
                    path="/payments"
                    element={
                        <ProtectedRoute>
                            <Payment />
                        </ProtectedRoute>
                    }
                />


                <Route
                    path="/payments/:paymentId"
                    element={
                        <ProtectedRoute>
                            <PaymentDetails />
                        </ProtectedRoute>
                    }
                />


                {/* ================= CATALOG ================= */}

                <Route
                    path="/catalog/product/:id"
                    element={
                        <ProductDetails />
                    }
                />

                <Route
                    path="/catalog"
                    element={
                        <Catalog />
                    }
                />

                <Route
                    path="/catalog/product/new"
                    element={
                        <ProductForm />
                    }
                />

                <Route
                    path="/catalog/product/:id/edit"
                    element={
                        <ProductForm />
                    }
                />


                {/* ================= ORDERS ================= */}

                <Route
                    path="/orders"
                    element={
                        <ProtectedRoute>
                            <Order />
                        </ProtectedRoute>
                    }
                />

                <Route
                    path="/orders/:orderId"
                    element={
                        <ProtectedRoute>
                            <OrderDetails />
                        </ProtectedRoute>
                    }
                />


                {/* ================= CATEGORIES ================= */}

                <Route
                    path="/catalog/categories"
                    element={
                        <ProtectedRoute>
                            <CategoryManagement />
                        </ProtectedRoute>
                    }
                />


                {/* ================= WISHLIST ================= */}

                <Route
                    path="/wishlist"
                    element={
                        <ProtectedRoute>
                            <Wishlist />
                        </ProtectedRoute>
                    }
                />


                {/* ================= SUPPORT ================= */}

                <Route
                    path="/support"
                    element={
                        <ProtectedRoute>
                            <Support />
                        </ProtectedRoute>
                    }
                />


                {/* ================= PROFILE ================= */}

                <Route
                    path="/profile"
                    element={
                        <ProtectedRoute>
                            <Profile />
                        </ProtectedRoute>
                    }
                />


                {/* ================= USER SETTINGS ================= */}

                <Route
                    path="/settings"
                    element={
                        <ProtectedRoute>
                            <Settings />
                        </ProtectedRoute>
                    }
                />


                {/* ================= SHOPPING CART ================= */}

                <Route
                    path="/cart"
                    element={
                        <ProtectedRoute>
                            <Cart />
                        </ProtectedRoute>
                    }
                />

            </Routes>

            <CartDrawer />
            <MobileBottomNav />

        </BrowserRouter>
    );
}


export default AppRoutes;