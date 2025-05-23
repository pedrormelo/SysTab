"use client"

import type React from "react"

import { useEffect, useState } from "react"
import Image from "next/image"
import Link from "next/link"
import { ArrowLeft, Save } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Navbar } from "../../components/layout/navbar"
import { Footer } from "../../components/layout/footer"
import { useToast } from "@/hooks/use-toast"
import { useRouter } from "next/navigation"
import api from "@/lib/api"

export default function NovaUnidade() {
  const [nome, setNome] = useState("")
  const [regional, setRegional] = useState("")
  const [regionais, setRegionais] = useState<{ idReg: number, numReg: string }[]>([])
  const { toast } = useToast()
  const router = useRouter()


  useEffect(() => {
    api.get("/regionais")
      .then(res => setRegionais(res.data))
      .catch(() =>
        toast({
          title: "Erro ao carregar regionais",
          description: "Não foi possível obter a lista de regionais",
          variant: "destructive",
        })
      )
  }, [])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!nome || !regional) {
      toast({
        title: "Erro ao salvar",
        description: "Preencha todos os campos obrigatórios",
        variant: "destructive",
      })
      return
    }

    try {
      await api.post("/unidades", {
        nomeUnidade: nome,
        idReg: parseInt(regional),
      })
      toast({
        title: "Unidade cadastrada",
        description: `A unidade ${nome} foi cadastrada com sucesso`,
        variant: "success",
      })
      setNome("")
      setRegional("")
      router.push("/unidades")
    } catch (err) {
      toast({
        title: "Erro ao cadastrar unidade",
        description: "Não foi possível cadastrar a unidade.",
        variant: "destructive",
      })
    }
  }

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Navbar currentPath="/unidades" />

      <main className="flex-1 relative">
        <div className="absolute inset-0 z-0">
          <Image src="/beach-background.jpg" alt="Fundo de praia" fill className="object-cover" priority />
        </div>

        <div className="relative z-10 container mx-auto py-6 px-4 max-w-3xl">
          <div className="bg-white/90 backdrop-blur-sm rounded-xl w-full p-6 shadow-xl border border-gray-100">
            <div className="flex items-center mb-6">
              <Link href="/unidades">
                <Button variant="outline" size="sm" className="rounded-full border-gray-200 hover:bg-gray-100 mr-4">
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Voltar
                </Button>
              </Link>
              <h2 className="text-3xl font-light text-transparent bg-clip-text bg-gradient-to-r from-[#0948a7] to-[#298ed3] inline-block">
                <span className="font-bold">Nova Unidade</span>
              </h2>
            </div>

            <Card className="border border-gray-100 shadow-md">
              <CardHeader className="bg-gradient-to-r from-[#0948a7] to-[#298ed3] text-white rounded-t-lg">
                <CardTitle className="text-xl">Informações da Unidade</CardTitle>
              </CardHeader>
              <CardContent className="p-6">
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <Label htmlFor="nome" className="text-gray-700">
                        Nome da Unidade <span className="text-red-500">*</span>
                      </Label>
                      <Input
                        id="nome"
                        placeholder="Ex: USF PRAZERES"
                        value={nome}
                        onChange={(e) => setNome(e.target.value)}
                        className="border-gray-200"
                        required
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="regional" className="text-gray-700">
                        Regional <span className="text-red-500">*</span>
                      </Label>
                      <Select value={regional} onValueChange={setRegional} required>
                        <SelectTrigger id="regional" className="border-gray-200">
                          <SelectValue placeholder="Selecione a regional" />
                        </SelectTrigger>
                        <SelectContent>
                          {regionais.map((reg) => (
                            <SelectItem key={reg.idReg} value={String(reg.idReg)}>
                              {reg.numReg}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div className="pt-4">
                    <Button
                      type="submit"
                      className="w-full rounded-full bg-gradient-to-r from-[#0948a7] to-[#298ed3] hover:from-[#083b8a] hover:to-[#1c7ab8] text-white"
                    >
                      <Save className="h-4 w-4 mr-2" />
                      Salvar Unidade
                    </Button>
                  </div>
                </form>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  )
}
