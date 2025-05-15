"use client"

import type React from "react"

import { useState } from "react"
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

export default function NovoUsuario() {
  const [nome, setNome] = useState("")
  const [cpf, setCpf] = useState("")
  const [telefone, setTelefone] = useState("")
  const [unidade, setUnidade] = useState("")
  const { toast } = useToast()

  // Lista de unidades
  const unidades = [
    "USF ALTO DOIS CARNEIROS",
    "USF PRAZERES",
    "USF CAVALEIRO",
    "USF MURIBECA",
    "USF JARDIM JORDÃO",
    "USF BARRA DE JANGADA",
  ]

  // Função para formatar CPF
  const formatCPF = (value: string) => {
    const digits = value.replace(/\D/g, "")
    if (digits.length <= 3) return digits
    if (digits.length <= 6) return `${digits.slice(0, 3)}.${digits.slice(3)}`
    if (digits.length <= 9) return `${digits.slice(0, 3)}.${digits.slice(3, 6)}.${digits.slice(6)}`
    return `${digits.slice(0, 3)}.${digits.slice(3, 6)}.${digits.slice(6, 9)}-${digits.slice(9, 11)}`
  }

  // Função para formatar telefone
  const formatTelefone = (value: string) => {
    const digits = value.replace(/\D/g, "")
    if (digits.length <= 2) return `(${digits}`
    if (digits.length <= 6) return `(${digits.slice(0, 2)}) ${digits.slice(2)}`
    if (digits.length <= 10) return `(${digits.slice(0, 2)}) ${digits.slice(2, 6)}-${digits.slice(6)}`
    return `(${digits.slice(0, 2)}) ${digits.slice(2, 7)}-${digits.slice(7, 11)}`
  }

  const handleCPFChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formattedCPF = formatCPF(e.target.value)
    if (formattedCPF.length <= 14) {
      setCpf(formattedCPF)
    }
  }

  const handleTelefoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formattedTelefone = formatTelefone(e.target.value)
    if (formattedTelefone.length <= 15) {
      setTelefone(formattedTelefone)
    }
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    // Validação básica
    if (!nome || !cpf || !unidade) {
      toast({
        title: "Erro ao salvar",
        description: "Preencha todos os campos obrigatórios",
        variant: "destructive",
      })
      return
    }

    // Validar CPF (formato básico)
    if (cpf.length < 14) {
      toast({
        title: "CPF inválido",
        description: "Por favor, insira um CPF válido",
        variant: "destructive",
      })
      return
    }

    // Lógica para salvar o usuário
    toast({
      title: "Usuário cadastrado",
      description: `O usuário ${nome} foi cadastrado com sucesso`,
      variant: "success",
    })

    // Limpar formulário
    setNome("")
    setCpf("")
    setTelefone("")
    setUnidade("")
  }

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Navbar currentPath="/usuarios" />

      {/* Main Content with Background Image */}
      <main className="flex-1 relative">
        {/* Background Image */}
        <div className="absolute inset-0 z-0">
          <Image src="/beach-background.jpg" alt="Fundo de praia" fill className="object-cover" priority />
        </div>

        {/* Content */}
        <div className="relative z-10 container mx-auto py-6 px-4 max-w-3xl">
          <div className="bg-white/90 backdrop-blur-sm rounded-xl w-full p-6 shadow-xl border border-gray-100">
            <div className="flex items-center mb-6">
              <Link href="/usuarios">
                <Button variant="outline" size="sm" className="rounded-full border-gray-200 hover:bg-gray-100 mr-4">
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Voltar
                </Button>
              </Link>
              <h2 className="text-3xl font-light text-transparent bg-clip-text bg-gradient-to-r from-[#0948a7] to-[#298ed3] inline-block">
                <span className="font-bold">Novo Usuário</span>
              </h2>
            </div>

            <Card className="border border-gray-100 shadow-md">
              <CardHeader className="bg-gradient-to-r from-[#0948a7] to-[#298ed3] text-white rounded-t-lg">
                <CardTitle className="text-xl">Informações do Usuário</CardTitle>
              </CardHeader>
              <CardContent className="p-6">
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <Label htmlFor="nome" className="text-gray-700">
                        Nome Completo <span className="text-red-500">*</span>
                      </Label>
                      <Input
                        id="nome"
                        placeholder="Ex: João Silva"
                        value={nome}
                        onChange={(e) => setNome(e.target.value)}
                        className="border-gray-200"
                        required
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="cpf" className="text-gray-700">
                        CPF <span className="text-red-500">*</span>
                      </Label>
                      <Input
                        id="cpf"
                        placeholder="000.000.000-00"
                        value={cpf}
                        onChange={handleCPFChange}
                        className="border-gray-200"
                        required
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="telefone" className="text-gray-700">
                        Telefone
                      </Label>
                      <Input
                        id="telefone"
                        placeholder="(00) 00000-0000"
                        value={telefone}
                        onChange={handleTelefoneChange}
                        className="border-gray-200"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="unidade" className="text-gray-700">
                        Unidade <span className="text-red-500">*</span>
                      </Label>
                      <Select value={unidade} onValueChange={setUnidade} required>
                        <SelectTrigger id="unidade" className="border-gray-200">
                          <SelectValue placeholder="Selecione a unidade" />
                        </SelectTrigger>
                        <SelectContent>
                          {unidades.map((unid) => (
                            <SelectItem key={unid} value={unid}>
                              {unid}
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
                      Salvar Usuário
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
