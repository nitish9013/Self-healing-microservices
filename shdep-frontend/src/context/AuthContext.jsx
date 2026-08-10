import { createContext, useContext, useState } from "react";
import { jwtDecode } from "jwt-decode";

const AuthContext = createContext();

export function AuthProvider({ children }) {

    const [token, setToken] = useState(
        localStorage.getItem("token")
    );

    const [username, setUsername] = useState(
        localStorage.getItem("username")
    );

    const [role, setRole] = useState(
        localStorage.getItem("role")
    );

    const [userId, setUserId] = useState(
        localStorage.getItem("userId")
    );


    const login = (jwt, id) => {

        const decoded = jwtDecode(jwt);

        const username = decoded.sub;

        const role = decoded.roles?.[0] || "USER";


        localStorage.setItem("token", jwt);
        localStorage.setItem("username", username);
        localStorage.setItem("role", role);
        localStorage.setItem("userId", id);


        setToken(jwt);
        setUsername(username);
        setRole(role);
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

                isAuthenticated: !!token,
            }}
        >
            {children}
        </AuthContext.Provider>
    );
}


export const useAuth = () => useContext(AuthContext);