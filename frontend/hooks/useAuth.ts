import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

function parseJwt(token: string) {
    try {
        const base64Url = token.split(".")[1];
        if (!base64Url) return null;
        // Pad base64 if needed
        let base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
        while (base64.length % 4) base64 += "=";
        const jsonPayload = decodeURIComponent(
            atob(base64)
                .split("")
                .map(function (c) {
                    return "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2);
                })
                .join("")
        );
        return JSON.parse(jsonPayload);
    } catch (e) {
        // eslint-disable-next-line no-console
        console.error("JWT parse error", e);
        return null;
    }
}

export function useAuth() {
    const [user, setUser] = useState<any>(null);
    const [isLoading, setIsLoading] = useState(true);

    // Helper to get user from token
    const getUserFromToken = () => {
        const token = typeof window !== "undefined" ? localStorage.getItem("token") : null;
        if (!token) return null;
        const payload = parseJwt(token);
        if (payload && payload.role) return payload;
        return null;
    };

    useEffect(() => {
        // Initial load
        const token = typeof window !== "undefined" ? localStorage.getItem("token") : null;
        const payload = parseJwt(token || "");
        if (token && payload && payload.role) {
            setUser(payload);
            setIsLoading(false);
        } else {
            setUser(null);
            setIsLoading(false);
        }

        // Listen for token changes in other tabs
        const onStorage = (e: StorageEvent) => {
            if (e.key === "token") {
                const t = e.newValue;
                const p = parseJwt(t || "");
                if (t && p && p.role) {
                    setUser(p);
                } else {
                    setUser(null);
                }
                setIsLoading(false);
            }
        };
        window.addEventListener("storage", onStorage);

        // Optionally, poll for token changes in this tab (in case login/logout doesn't reload page)
        let lastToken = localStorage.getItem("token");
        const poll = setInterval(() => {
            const currentToken = localStorage.getItem("token");
            if (currentToken !== lastToken) {
                const p = parseJwt(currentToken || "");
                if (currentToken && p && p.role) {
                    setUser(p);
                } else {
                    setUser(null);
                }
                setIsLoading(false);
                lastToken = currentToken;
            }
        }, 1000);

        return () => {
            window.removeEventListener("storage", onStorage);
            clearInterval(poll);
        };
    }, []);

    return { user, isLoading };
}