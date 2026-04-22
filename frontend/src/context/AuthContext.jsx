import { createContext, useContext, useState } from "react";

const AuthContext = createContext()

const [accessToken, setAccessToken] = useState(localStorage.getItem('access') || null)
const [refreshToken, setRefreshToken] = useState(localStorage.getItem('refresh') || null)

const login = (access, refresh) => {
    setAccessToken(access)
    setRefreshToken(refresh)
    localStorage.setItem('access', access)
    localStorage.setItem('refresh', refresh)
}