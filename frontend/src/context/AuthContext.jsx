import { createContext, useContext, useState } from "react";

const AuthContext = createContext()

export function AuthProvider({children}){
    const [accessToken, setAccessToken] = useState(localStorage.getItem('access') || null)
    const [refreshToken, setRefreshToken] = useState(localStorage.getItem('refresh') || null)

    const login = (access, refresh) => {
        setAccessToken(access)
        setRefreshToken(refresh)
        localStorage.setItem('access', access)
        localStorage.setItem('refresh', refresh)
    }

    const logout = () => {
        setAccessToken(null)
        setRefreshToken(null)
        localStorage.removeItem('access')
        localStorage.removeItem('refresh')
    }

    return (
        <AuthContext.Provider value = {{ accessToken, refreshToken, login, logout }}>
            {children}
        </AuthContext.Provider>
    )
}

export function useAuth() {
    return useContext(AuthContext)
}