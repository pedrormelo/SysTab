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

export default function NovoTablet() {
  const [tombamento, setTombamento] = useState("")
  const [imei, setImei] = useState("")
  const [modelo, setModelo] = useState("")
  const [empresa, setEmpresa] = useState("")
  const [usuario, setUsuario] = useState("")
  const [unidade, setUnidade] = useState("")
  const [regional, setRegional] = useState("")
  const { toast } = useToast()

  // Listas de exemplo
  const modelos = ["Samsung Galaxy Tab A7", "Samsung Galaxy Tab S6", "iPad 8ª Geração", "Lenovo Tab M10"]
  const empresas = ["EVEREST", "NEXUS", "TECH SOLUTIONS"]
  const usuarios = ["João Silva", "Maria Santos", "Carlos Oliveira", "Ana Pereira", "Paulo Mendes", "Fernanda Lima"]
  const unidades = [
    "USF ALTO DOIS CARNEIROS",
    "USF PRAZERES",
    "USF CAVALEIRO",
    "USF MURIBECA",
    "USF JARDIM JORDÃO",
    "USF BARRA DE JANGADA",
  ]
  const regionais = ["Regional 1", "Regional 2", "Regional 3"]

  // Formatar IMEI
  const formatIMEI = (value: string) => {
    return value.replace(/\D/g, "").substring(0, 15)
  }

  const handleIMEIChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setImei(formatIMEI(e.target.value))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    // Validação básica
    if (!tombamento || !imei || !modelo || !empresa || !usuario || !unidade || !regional) {
      toast({
        title: "Erro ao salvar",
        description: "Preencha todos os campos obrigatórios",
        variant: "destructive",
      })
      return
    }

    // Validar IMEI (formato básico)
    if (imei.length !== 15) {
      toast({
        title: "IMEI inválido",
        description: "O IMEI deve conter 15 dígitos",
        variant: "destructive",
      })
      return
    }

    // Lógica para salvar o tablet
    toast({
      title: "Tablet cadastrado",
      description: `O tablet com tombamento ${tombamento} foi cadastrado com sucesso`,
      variant: "success",
    })

    // Limpar formulário
    setTombamento("")
    setImei("")
    setModelo("")
    setEmpresa("")
    setUsuario("")
    setUnidade("")
    setRegional("")
  }

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Navbar currentPath="/" />

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
              <Link href="/">
                <Button variant="outline" size="sm" className="rounded-full border-gray-200 hover:bg-gray-100 mr-4">
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Voltar
                </Button>
              </Link>
              <h2 className="text-3xl font-light text-transparent bg-clip-text bg-gradient-to-r from-[#0948a7] to-[#298ed3] inline-block">
                <span className="font-bold">Novo Tablet</span>
              </h2>
            </div>

            <Card className="border border-gray-100 shadow-md">
              <CardHeader className="bg-gradient-to-r from-[#0948a7] to-[#298ed3] text-white rounded-t-lg">
                <CardTitle className="text-xl">Informações do Tablet</CardTitle>
              </CardHeader>
              <CardContent className="p-6">
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <Label htmlFor="tombamento" className="text-gray-700">
                        Tombamento <span className="text-red-500">*</span>
                      </Label>
                      <Input
                        id="tombamento"
                        placeholder="Ex: 123.456"
                        value={tombamento}
                        onChange={(e) => setTombamento(e.target.value)}
                        className="border-gray-200"
                        required
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="imei" className="text-gray-700">
                        IMEI <span className="text-red-500">*</span>
                      </Label>
                      <Input
                        id="imei"
                        placeholder="Ex: 123456789012345"
                        value={imei}
                        onChange={handleIMEIChange}
                        className="border-gray-200"
                        required
                      />
                      <p className="text-xs text-gray-500">O IMEI deve conter 15 dígitos</p>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="modelo" className="text-gray-700">
                        Modelo <span className="text-red-500">*</span>
                      </Label>
                      <Select value={modelo} onValueChange={setModelo} required>
                        <SelectTrigger id="modelo" className="border-gray-200">
                          <SelectValue placeholder="Selecione o modelo" />
                        </SelectTrigger>
                        <SelectContent>
                          {modelos.map((mod) => (
                            <SelectItem key={mod} value={mod}>
                              {mod}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="empresa" className="text-gray-700">
                        Empresa <span className="text-red-500">*</span>
                      </Label>
                      <Select value={empresa} onValueChange={setEmpresa} required>
                        <SelectTrigger id="empresa" className="border-gray-200">
                          <SelectValue placeholder="Selecione a empresa" />
                        </SelectTrigger>
                        <SelectContent>
                          {empresas.map((emp) => (
                            <SelectItem key={emp} value={emp}>
                              {emp}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="usuario" className="text-gray-700">
                        Usuário <span className="text-red-500">*</span>
                      </Label>
                      <Select value={usuario} onValueChange={setUsuario} required>
                        <SelectTrigger id="usuario" className="border-gray-200">
                          <SelectValue placeholder="Selecione o usuário" />
                        </SelectTrigger>
                        <SelectContent>
                          {usuarios.map((user) => (
                            <SelectItem key={user} value={user}>
                              {user}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
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
                            <SelectItem key={reg} value={reg}>
                              {reg}
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
                      Salvar Tablet
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
