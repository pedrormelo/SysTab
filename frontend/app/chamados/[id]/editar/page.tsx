"use client"

import type React from "react"

import { useEffect, useState } from "react"
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
import api from "@/lib/api"

export default function EditarChamado({ params }: { params: { id: string } }) {
  const { toast } = useToast()

  const [loading, setLoading] = useState(true)
  const [descricao, setDescricao] = useState("")
  const [itensRecebidos, setItensRecebidos] = useState("")
  const [chamado, setChamado] = useState<any>(null)

  useEffect(() => {
    setLoading(true)
    api.get(`/chamados/id/${params.id}`)
      .then(res => {
        const c = res.data
        setChamado({
          ...c,
          id: c.idChamado || c.id,
          tabletId: c.idTab,
          tombamento: c.tombamento || c.idTomb || c.idtombamento || c.tomb || "",
          usuario: c.nomeUser || c.usuario,
          unidade: c.nomeUnidade || c.unidade,
          itensRecebidos: c.item || c.itensRecebidos,
          dataEntrada: c.dataEntrada,
          dataSaida: c.dataSaida,
          status: c.status,
          descricao: c.descricao,
          diasAberto: c.diasAberto,
        })
        setDescricao(c.descricao || "")
        setItensRecebidos(c.item || c.itensRecebidos || "")
        setLoading(false)
      })
      .catch(() => {
        toast({ title: "Erro", description: "Não foi possível carregar o chamado.", variant: "destructive" })
        setLoading(false)
      })
  }, [params.id])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!itensRecebidos) {
      toast({
        title: "Erro ao salvar",
        description: "Preencha todos os campos obrigatórios",
        variant: "destructive",
      })
      return
    }
    try {
      await api.put(`/chamados/${params.id}`, {
        descricao,
        itensRecebidos,
      })
      toast({
        title: "Chamado atualizado com sucesso",
        description: `O chamado #${params.id} foi atualizado`,
        variant: "success",
      })
    } catch {
      toast({
        title: "Erro ao atualizar chamado",
        description: "Não foi possível atualizar o chamado.",
        variant: "destructive",
      })
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col bg-gray-50">
        <Navbar currentPath="/chamados" />
        <main className="flex-1 flex items-center justify-center">
          <div className="animate-pulse">
            <div className="h-4 bg-gray-200 rounded w-1/2 mb-4"></div>
            <div className="space-y-2">
              <div className="h-4 bg-gray-200 rounded w-full"></div>
              <div className="h-4 bg-gray-200 rounded w-full"></div>
              <div className="h-4 bg-gray-200 rounded w-full"></div>
            </div>
          </div>
        </main>
        <Footer />
      </div>
    )
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
                        <p className="font-medium">{chamado?.tabletId || "-"}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-500">Tombamento</p>
                        <p className="font-medium">{chamado?.tombamento || "-"}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-500">Usuário</p>
                        <p className="font-medium">{chamado?.usuario || "-"}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-500">Unidade</p>
                        <p className="font-medium">{chamado?.unidade || "-"}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-500">Data de Entrada</p>
                        <p className="font-medium">{chamado?.dataEntrada ? chamado.dataEntrada : "-"}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-500">Status</p>
                        <p className="font-medium">{chamado?.status || "-"}</p>
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
