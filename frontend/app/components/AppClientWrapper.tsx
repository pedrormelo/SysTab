"use client"

import { useEffect } from "react"
import { Toaster } from "@/components/ui/toaster"

export default function AppClientWrapper({ children }: { children: React.ReactNode }) {
    useEffect(() => {
        // Auth logic
        const token = localStorage.getItem("token")
        const pathname = window.location.pathname
        if (!token && pathname !== "/login") {
            window.location.href = "/login"
            return
        }
        if (token && pathname === "/login") {
            window.location.href = "/"
            return
        }

        // Inactivity timeout
        let timeout: any
        function logout() {
            localStorage.removeItem("token")
            localStorage.removeItem("usuario")
            window.location.href = "/login"
        }
        function iniciarTimeoutInatividade() {
            clearTimeout(timeout)
            timeout = setTimeout(() => {
                logout()
                alert("Você foi desconectado por inatividade.")
            }, 15 * 60 * 1000)
        }
        window.addEventListener("mousemove", iniciarTimeoutInatividade)
        window.addEventListener("keydown", iniciarTimeoutInatividade)
        window.addEventListener("click", iniciarTimeoutInatividade)
        iniciarTimeoutInatividade()
        return () => {
            clearTimeout(timeout)
            window.removeEventListener("mousemove", iniciarTimeoutInatividade)
            window.removeEventListener("keydown", iniciarTimeoutInatividade)
            window.removeEventListener("click", iniciarTimeoutInatividade)
        }
    }, [])

    return (
        <>
            {children}
            <Toaster />
        </>
    )
}