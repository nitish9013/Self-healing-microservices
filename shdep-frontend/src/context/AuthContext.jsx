import { createContext, useContext, useState, useEffect } from "react";
import { jwtDecode } from "jwt-decode";

const AuthContext = createContext();

const isTokenValid = (token) => {
    if (!token) return false;
    try {
        const decoded = jwtDecode(token);
        if (decoded.exp && decoded.exp * 1000 <= Date.now()) {
            return false;
        }
        return true;
    } catch {
        return false;
    }
};

export function AuthProvider({ children }) {
    const rawToken = localStorage.getItem("token");
    const valid = isTokenValid(rawToken);

    if (!valid && rawToken) {
        localStorage.removeItem("token");
        localStorage.removeItem("username");
        localStorage.removeItem("role");
        localStorage.removeItem("userId");
    }

    const [token, setToken] = useState(valid ? rawToken : null);
    const [username, setUsername] = useState(valid ? localStorage.getItem("username") : null);
    const [role, setRole] = useState(valid ? localStorage.getItem("role") : null);
    const [userId, setUserId] = useState(valid ? localStorage.getItem("userId") : null);

    // Auto-logout when token expires in the background
    useEffect(() => {
        if (!token) return;

        try {
            const decoded = jwtDecode(token);
            if (decoded.exp) {
                const timeRemaining = decoded.exp * 1000 - Date.now();
                if (timeRemaining <= 0) {
                    logout();
                } else {
                    const timer = setTimeout(() => {
                        logout();
                    }, timeRemaining);
                    return () => clearTimeout(timer);
                }
            }
        } catch {
            logout();
        }
    }, [token]);

    const login = (jwt, id) => {
        const decoded = jwtDecode(jwt);
        const user = decoded.sub;
        const userRole = decoded.roles?.[0] || "USER";

        localStorage.setItem("token", jwt);
        localStorage.setItem("username", user);
        localStorage.setItem("role", userRole);
        localStorage.setItem("userId", id);

        setToken(jwt);
        setUsername(user);
        setRole(userRole);
        setUserId(id);
    };

    const logout = () => {
        localStorage.removeItem("token");
        localStorage.removeItem("username");
        localStorage.removeItem("role");
        localStorage.removeItem("userId");

        setToken(null);
        setUsername(null);
        setRole(null);
        setUserId(null);
    };

    return (
        <AuthContext.Provider
            value={{
                token,
                username,
                userId,
                role,
                login,
                logout,
                isAuthenticated: !!token && isTokenValid(token),
            }}
        >
            {children}
        </AuthContext.Provider>
    );
}

export const useAuth = () => useContext(AuthContext);