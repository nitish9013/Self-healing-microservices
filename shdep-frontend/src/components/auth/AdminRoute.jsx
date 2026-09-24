import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

export default function AdminRoute({ children }) {
    const { role } = useAuth();
    const location = useLocation();

    const normalizedRole = String(role || "")
        .replace("ROLE_", "")
        .toUpperCase();

    const isAdmin = normalizedRole === "ADMIN";

    if (!isAdmin) {
        return (
            <Navigate
                to="/dashboard"
                replace
                state={{ from: location.pathname }}
            />
        );
    }

    return children;
}