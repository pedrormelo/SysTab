"use client"

import type React from "react"

import { useState } from "react"
import Image from "next/image"
import Link from "next/link"
import { ArrowLeft, Save } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Label } from "@/components/ui/label"
import { Navbar } from "../../../components/layout/navbar"
import { Footer } from "../../../components/layout/footer"
import { useToast } from "@/hooks/use-toast"

export default function EditarChamado({ params }: { params: { id: string } }) {
  const { toast } = useToast()

  // Dados de exemplo
  const chamadoOriginal = {
    id: 101,
    tabletId: 1,
    tombamento: "123.123",
    dataEntrada: "10/02/2025",
    dataSaida: null,
    descricao:
      "Tela quebrada, necessita de substituição urgente. O usuário relatou que o tablet caiu no chão e a tela trincou em vários pontos, impossibilitando o uso. Será necessário avaliar se compensa o reparo ou a substituição do equipamento.",
    status: "Aberto",
    usuario: "João Silva",
    telefone: "(81) 99999-9999",
    unidade: "USF ALTO DOIS CARNEIROS",
    diasAberto: 3,
    itensRecebidos: "Carregador e Capinha",
  }

  // Estados para os campos editáveis
  const [descricao, setDescricao] = useState(chamadoOriginal.descricao)
  const [telefone, setTelefone] = useState(chamadoOriginal.telefone)
  const [itensRecebidos, setItensRecebidos] = useState(chamadoOriginal.itensRecebidos)

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

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    // Validação básica
    if (!itensRecebidos) {
      toast({
        title: "Erro ao salvar",
        description: "Preencha todos os campos obrigatórios",
        variant: "destructive",
      })
      return
    }

    // Lógica para salvar o chamado
    toast({
      title: "Chamado atualizado com sucesso",
      description: `O chamado #${params.id} foi atualizado`,
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
              <Link href={`/chamados/${params.id}`}>
                <Button variant="outline" size="sm" className="rounded-full border-gray-200 hover:bg-gray-100 mr-4">
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Voltar
                </Button>
              </Link>
              <h2 className="text-3xl font-light text-transparent bg-clip-text bg-gradient-to-r from-[#0948a7] to-[#298ed3] inline-block">
                <span className="font-bold">Editar Chamado #{params.id}</span>
              </h2>
            </div>

            <form onSubmit={handleSubmit}>
              <div className="space-y-6">
                <Card className="border border-gray-100 shadow-md">
                  <CardHeader className="bg-gradient-to-r from-[#0948a7] to-[#298ed3] text-white rounded-t-lg">
                    <CardTitle className="text-xl">Informações do Tablet</CardTitle>
                  </CardHeader>
                  <CardContent className="p-6">
                    <div className="grid grid-cols-3 gap-4">
                      <div>
                        <p className="text-sm text-gray-500">ID</p>
                        <p className="font-medium">{chamadoOriginal.tabletId}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-500">Tombamento</p>
                        <p className="font-medium">{chamadoOriginal.tombamento}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-500">Usuário</p>
                        <p className="font-medium">{chamadoOriginal.usuario}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-500">Unidade</p>
                        <p className="font-medium">{chamadoOriginal.unidade}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-500">Data de Entrada</p>
                        <p className="font-medium">{chamadoOriginal.dataEntrada}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-500">Status</p>
                        <p className="font-medium">{chamadoOriginal.status}</p>
                      </div>
                    </div>
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

                <div className="pt-4">
                  <Button
                    type="submit"
                    className="w-full rounded-full bg-gradient-to-r from-[#0948a7] to-[#298ed3] hover:from-[#083b8a] hover:to-[#1c7ab8] text-white"
                  >
                    <Save className="h-4 w-4 mr-2" />
                    Salvar Alterações
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
