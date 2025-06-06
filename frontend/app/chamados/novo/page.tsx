"use client"

import type React from "react"

import { useState, useEffect } from "react"
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
import { Navbar } from "../../components/layout/navbar"
import { Footer } from "../../components/layout/footer"
import { useToast } from "@/hooks/use-toast"
import api from "@/lib/api"

export default function NovoChamado() {
  const searchParams = useSearchParams()
  const tabletId = searchParams.get("tablet")
  const { toast } = useToast()

  // Vamos modificar a página de criação de novo chamado conforme solicitado

  // Substitua a parte dos itens recebidos e observações
  // Remova o motivo e modifique os campos conforme solicitado

  // Primeiro, atualize os estados no início do componente
  const [descricao, setDescricao] = useState("")
  const [telefone, setTelefone] = useState("")
  const [tabletSelecionado, setTabletSelecionado] = useState(tabletId || "")
  const [itensRecebidos, setItensRecebidos] = useState("")

  // Tablets fetched from backend
  const [tablets, setTablets] = useState<any[]>([])

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

  // Fetch tablets from backend
  useEffect(() => {
    api.get("/tablets")
      .then(res => {
        // Normalize tablets to always have .id and .tombamento
        const normalized = res.data.map((t: any) => ({
          ...t,
          id: t.idTab || t.id, // fallback for mock/dev
          tombamento: t.tombamento || t.idTomb || t.idtombamento || t.tomb || "",
        }))
        setTablets(normalized)
      })
      .catch(() => toast({ title: "Erro", description: "Falha ao carregar tablets", variant: "destructive" }))
  }, [])

  // Encontrar o tablet selecionado
  const tablet = tablets.find((t) => t.id === Number(tabletSelecionado))

  // Atualize também a função handleSubmit para refletir as mudanças
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!tabletSelecionado || !itensRecebidos) {
      toast({
        title: "Erro ao salvar",
        description: "Preencha todos os campos obrigatórios",
        variant: "destructive",
      })
      return
    }
    try {
      await api.post("/chamados", {
        idTab: tabletSelecionado,
        descricao,
        item: itensRecebidos,
      })
      toast({
        title: "Chamado aberto com sucesso",
        description: `O chamado para o tablet ${tabletSelecionado} foi registrado`,
        variant: "success",
      })
      // Optionally redirect to chamados list or details
    } catch (err) {
      toast({
        title: "Erro ao salvar chamado",
        description: "Ocorreu um erro ao tentar abrir o chamado.",
        variant: "destructive",
      })
    }
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
                            {tablets.filter(t => t.id !== undefined).map((t) => (
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
