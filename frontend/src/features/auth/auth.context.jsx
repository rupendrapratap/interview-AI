/* eslint-disable react-refresh/only-export-components */
// ye api ke call krne ke time ko or api ke response ke time ke beech mai loading ke time ko show krega
import { createContext, useState, useEffect } from "react";
import { getMe } from "./services/auth.api";

export const AuthContext = createContext()

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null)
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        const getandsetuser = async () => {
            try {
                const data = await getMe()
                if (data && data.user) {
                    setUser(data.user)
                }
            } catch (err) {
                console.error("Error fetching user details on mount:", err)
            } finally {
                setLoading(false)
            }
        }
        getandsetuser()
    }, [])

    return (
        <AuthContext.Provider value={{ user, setUser, loading, setLoading }}>
            {children}
        </AuthContext.Provider>
    )
}
