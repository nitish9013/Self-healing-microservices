import ProtectedRoute from "../components/auth/ProtectedRoute";
import { BrowserRouter, Routes, Route } from "react-router-dom";

import Login from "../pages/auth/Login";
import Register from "../pages/auth/Register";
import Dashboard from "../pages/dashboard/Dashboard";
import ProductDetails from "../pages/Catalog/ProductDetails";
import Catalog from "../pages/Catalog/Catalog";
import ProductForm
    from "../pages/Catalog/ProductForm";
import CategoryManagement
    from "../pages/Catalog/CategoryManagement";    
import Order from "../pages/Order/Order";   
import Payment from "../pages/Payment/Payment"; 

function AppRoutes() {
  return (
    <BrowserRouter>
  
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register"element={<Register />}/>
        <Route
              path="/dashboard"
              element={
                      <ProtectedRoute>
                       <Dashboard />
                      </ProtectedRoute>
                      }/>
                      <Route
    path="/payments"
    element={
        <ProtectedRoute>
            <Payment />
        </ProtectedRoute>
    }
/>
       <Route path="/catalog/product/:id" element={<ProductDetails />}/>
       <Route path="/catalog" element={<Catalog />} />
       <Route
    path="/catalog/product/new"
    element={<ProductForm />}
/>

<Route
    path="/catalog/product/:id/edit"
    element={<ProductForm />}
/>

<Route
    path="/orders"
    element={
        <ProtectedRoute>
            <Order />
        </ProtectedRoute>
    } />

 <Route
    path="/catalog/categories"
    element={
        <ProtectedRoute>
            <CategoryManagement />
        </ProtectedRoute>
    }
/>


      </Routes>
    </BrowserRouter>
  );
}

export default AppRoutes;