"use client"

import type React from "react"

import { useState } from "react"
import Image from "next/image"
import Link from "next/link"
import { ArrowLeft, Save, FileDown } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Label } from "@/components/ui/label"
import { useSearchParams } from "next/navigation"
import { Navbar } from "../components/layout/navbar"
import { Footer } from "../components/layout/footer"
import { useToast } from "@/hooks/use-toast"

export default function NovoChamado() {
  const searchParams = useSearchParams()
  const tabletId = searchParams.get("tablet")
  const { toast } = useToast()

  // Estados para os campos do formulário
  const [descricao, setDescricao] = useState("")
  const [telefone, setTelefone] = useState("")
  const [tabletSelecionado, setTabletSelecionado] = useState(tabletId || "")
  const [itensRecebidos, setItensRecebidos] = useState("")

  // Formatar telefone
  const formatTelefone = (value: string) => {
    const digits = value.replace(/\D/g, "")
    if (digits.length <= 2) return `(${digits}`
    if (digits.length <= 6) return `(${digits.slice(0, 2)}) ${digits.slice(2)}`
    if (digits.length <= 10) return `(${digits.slice(0, 2)}) ${digits.slice(2, 6)}-${digits.slice(6)}`
    return `(${digits.slice(0, 2)}) ${digits.slice(2, 7)}-${digits.slice(7, 11)}`
  }

  const handleTelefoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formattedTelefone = formatTelefone(e.target.value)
    if (formattedTelefone.length <= 15) {
      setTelefone(formattedTelefone)
    }
  }

  // Dados de exemplo
  const tablets = [
    {
      id: 1,
      tombamento: "123.123",
      imei: "355637050806462",
      usuario: "João Silva",
      empresa: "EVEREST",
      unidade: "USF ALTO DOIS CARNEIROS",
      modelo: "Samsung Galaxy Tab A7",
    },
    {
      id: 2,
      tombamento: "124.456",
      imei: "355637050806463",
      usuario: "Maria Santos",
      empresa: "EVEREST",
      unidade: "USF PRAZERES",
      modelo: "Samsung Galaxy Tab A7",
    },
    {
      id: 3,
      tombamento: "125.789",
      imei: "355637050806464",
      usuario: "Carlos Oliveira",
      empresa: "EVEREST",
      unidade: "USF CAVALEIRO",
      modelo: "Samsung Galaxy Tab A7",
    },
    {
      id: 4,
      tombamento: "126.012",
      imei: "355637050806465",
      usuario: "Ana Pereira",
      empresa: "EVEREST",
      unidade: "USF MURIBECA",
      modelo: "Samsung Galaxy Tab A7",
    },
    {
      id: 5,
      tombamento: "127.345",
      imei: "355637050806466",
      usuario: "Paulo Mendes",
      empresa: "EVEREST",
      unidade: "USF JARDIM JORDÃO",
      modelo: "Samsung Galaxy Tab A7",
    },
    {
      id: 6,
      tombamento: "128.678",
      imei: "355637050806467",
      usuario: "Fernanda Lima",
      empresa: "EVEREST",
      unidade: "USF BARRA DE JANGADA",
      modelo: "Samsung Galaxy Tab A7",
    },
    {
      id: 7,
      tombamento: "129.901",
      imei: "355637050806468",
      usuario: "Ricardo Souza",
      empresa: "NEXUS",
      unidade: "USF CAJUEIRO SECO",
      modelo: "Samsung Galaxy Tab A7",
    },
  ]

  // Encontrar o tablet selecionado
  const tablet = tablets.find((t) => t.id === Number(tabletSelecionado))

  // Função para lidar com o envio do formulário
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    // Validação básica
    if (!tabletSelecionado || !itensRecebidos) {
      toast({
        title: "Erro ao salvar",
        description: "Preencha todos os campos obrigatórios",
        variant: "destructive",
      })
      return
    }

    // Lógica para salvar o chamado
    toast({
      title: "Chamado aberto com sucesso",
      description: `O chamado para o tablet ${tablet?.tombamento} foi registrado`,
      variant: "success",
    })
  }

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Navbar currentPath="/chamados" />

      {/* Main Content with Background Image */}
      <main className="flex-1 relative">
        {/* Background Image */}
        <div className="absolute inset-0 z-0">
          <Image src="/beach-background.jpg" alt="Fundo de praia" fill className="object-cover" priority />
        </div>

        {/* Content */}
        <div className="relative z-10 container mx-auto py-6 px-4 max-w-4xl">
          <div className="bg-white/90 backdrop-blur-sm rounded-xl w-full p-6 shadow-xl border border-gray-100">
            <div className="flex items-center mb-6">
              <Link href="/chamados">
                <Button variant="outline" size="sm" className="rounded-full border-gray-200 hover:bg-gray-100 mr-4">
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Voltar
                </Button>
              </Link>
              <h2 className="text-3xl font-light text-transparent bg-clip-text bg-gradient-to-r from-[#0948a7] to-[#298ed3] inline-block">
                <span className="font-bold">Abrir Novo Chamado</span>
              </h2>
            </div>

            <form onSubmit={handleSubmit}>
              <div className="space-y-6">
                <Card className="border border-gray-100 shadow-md">
                  <CardHeader className="bg-gradient-to-r from-[#0948a7] to-[#298ed3] text-white rounded-t-lg">
                    <CardTitle className="text-xl">Selecione o Tablet</CardTitle>
                  </CardHeader>
                  <CardContent className="p-6">
                    {tablet ? (
                      <div className="grid grid-cols-3 gap-4">
                        <div>
                          <p className="text-sm text-gray-500">ID</p>
                          <p className="font-medium">{tablet.id}</p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-500">Tombamento</p>
                          <p className="font-medium">{tablet.tombamento}</p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-500">IMEI</p>
                          <p className="font-medium">{tablet.imei}</p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-500">Modelo</p>
                          <p className="font-medium">{tablet.modelo}</p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-500">Usuário</p>
                          <p className="font-medium">{tablet.usuario}</p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-500">Unidade</p>
                          <p className="font-medium">{tablet.unidade}</p>
                        </div>
                      </div>
                    ) : (
                      <div>
                        <Label htmlFor="tablet" className="text-gray-700 mb-2 block">
                          Selecione o Tablet <span className="text-red-500">*</span>
                        </Label>
                        <Select value={tabletSelecionado} onValueChange={setTabletSelecionado} required>
                          <SelectTrigger id="tablet" className="border-gray-200">
                            <SelectValue placeholder="Selecione um tablet" />
                          </SelectTrigger>
                          <SelectContent>
                            {tablets.map((t) => (
                              <SelectItem key={t.id} value={t.id.toString()}>
                                ID: {t.id} - Tombamento: {t.tombamento} - {t.usuario}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                    )}
                  </CardContent>
                </Card>

                <Card className="border border-gray-100 shadow-md">
                  <CardHeader className="bg-gradient-to-r from-[#0948a7] to-[#298ed3] text-white rounded-t-lg">
                    <CardTitle className="text-xl">Informações do Chamado</CardTitle>
                  </CardHeader>
                  <CardContent className="p-6 space-y-6">
                    <div>
                      <Label htmlFor="itens" className="text-gray-700 mb-2 block">
                        Itens Recebidos <span className="text-red-500">*</span>
                      </Label>
                      <Select value={itensRecebidos} onValueChange={setItensRecebidos} required>
                        <SelectTrigger id="itens" className="border-gray-200">
                          <SelectValue placeholder="Selecione os itens recebidos" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Carregador">Carregador</SelectItem>
                          <SelectItem value="Carregador e Capinha">Carregador e Capinha</SelectItem>
                          <SelectItem value="Capinha">Capinha</SelectItem>
                          <SelectItem value="Nenhum">Nenhum</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div>
                      <Label htmlFor="telefone" className="text-gray-700 mb-2 block">
                        Telefone para Contato
                      </Label>
                      <Input
                        id="telefone"
                        placeholder="(00) 00000-0000"
                        className="border-gray-200"
                        value={telefone}
                        onChange={handleTelefoneChange}
                      />
                    </div>

                    <div>
                      <Label htmlFor="descricao" className="text-gray-700 mb-2 block">
                        Descrição
                      </Label>
                      <Textarea
                        id="descricao"
                        placeholder="Descreva o problema ou motivo do chamado..."
                        className="border-gray-200 min-h-[100px]"
                        value={descricao}
                        onChange={(e) => setDescricao(e.target.value)}
                      />
                    </div>
                  </CardContent>
                </Card>

                <div className="flex flex-col sm:flex-row space-y-3 sm:space-y-0 sm:space-x-4 pt-4">
                  <Button type="submit" className="bg-green-600 hover:bg-green-700 text-white flex-1 rounded-full">
                    <Save className="h-4 w-4 mr-2" />
                    Salvar Chamado
                  </Button>
                  <Button
                    type="button"
                    className="bg-gradient-to-r from-[#0948a7] to-[#298ed3] hover:from-[#083b8a] hover:to-[#1c7ab8] text-white flex-1 rounded-full"
                    onClick={() => {
                      toast({
                        title: "Termo de entrega gerado",
                        description: "O documento foi gerado e está pronto para impressão",
                        variant: "success",
                      })
                    }}
                  >
                    <FileDown className="h-4 w-4 mr-2" />
                    Salvar e Gerar Termo de Entrega
                  </Button>
                </div>
              </div>
            </form>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  )
}
