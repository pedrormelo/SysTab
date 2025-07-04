"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Navbar } from "../components/layout/navbar"
import { Footer } from "../components/layout/footer"
import { useToast } from "@/hooks/use-toast"
import api from "@/lib/api"
import Image from "next/image"

export default function Login() {
    const [usuario, setUsuario] = useState("")
    const [senha, setSenha] = useState("")
    const [loading, setLoading] = useState(false)
    const { toast } = useToast()
    const router = useRouter()

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault()
        setLoading(true)
        try {
            const res = await api.post("/auth/login", { nome: usuario, senha })
            localStorage.setItem("token", res.data.token)
            localStorage.setItem("usuario", JSON.stringify(res.data.usuario))
            toast({ title: "Login realizado", variant: "success" })
            router.push("/") // Redirect to home/dashboard
        } catch {
            toast({ title: "Usuário ou senha inválidos", variant: "destructive" })
        } finally {
            setLoading(false)
        }
    } 
    return (
        <div className="min-h-screen flex flex-col bg-gray-50">
            <Navbar currentPath="/login" />
            <main className="flex-1 relative flex items-center justify-center">
                <div className="absolute inset-0 z-0">
                    <Image src="/beach-background.jpg" alt="Fundo de praia" fill className="object-cover" priority />
                </div>
                <div className="relative z-10 w-full flex items-center justify-center">
                    <Card className="w-full max-w-md p-8 shadow-xl border border-gray-100 bg-white/90">
                        <h2 className="text-2xl font-bold mb-6 text-center text-transparent bg-clip-text bg-gradient-to-r from-[#0948a7] to-[#298ed3]">Login</h2>
                        <form onSubmit={handleLogin} className="space-y-4">
                            <Input
                                type="text"
                                placeholder="Usuário"
                                value={usuario}
                                onChange={e => setUsuario(e.target.value)}
                                required
                                autoFocus
                            />
                            <Input
                                type="password"
                                placeholder="Senha"
                                value={senha}
                                onChange={e => setSenha(e.target.value)}
                                required
                            />
                            <Button
                                type="submit"
                                className="w-full bg-gradient-to-r from-[#0948a7] to-[#298ed3] text-white"
                                disabled={loading}
                            >
                                {loading ? "Entrando..." : "Entrar"}
                            </Button>
                        </form>
                    </Card>
                </div>
            </main>
            <Footer />
        </div>
    )
}