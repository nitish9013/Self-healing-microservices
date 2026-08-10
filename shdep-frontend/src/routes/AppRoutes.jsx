import ProtectedRoute from "../components/auth/ProtectedRoute";
import { BrowserRouter, Routes, Route } from "react-router-dom";

import Login from "../pages/auth/Login";
import Register from "../pages/auth/Register";
import Dashboard from "../pages/dashboard/Dashboard";

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
      </Routes>
    </BrowserRouter>
  );
}

export default AppRoutes;