"use client"

import { useState, useRef } from "react"
import Image from "next/image"
import Link from "next/link"
import { Search, Plus, Eye, Filter, Clock, Calendar, Printer, FileText, FileOutput } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card } from "@/components/ui/card"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Navbar } from "../components/layout/navbar"
import { Footer } from "../components/layout/footer"
import { useToast } from "@/hooks/use-toast"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"

export default function Chamados() {
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState("todos")
  const [showFilters, setShowFilters] = useState(false)
  const [unidadeFilter, setUnidadeFilter] = useState("")
  const [usuarioFilter, setUsuarioFilter] = useState("")
  const [dataInicialFilter, setDataInicialFilter] = useState("")
  const [dataFinalFilter, setDataFinalFilter] = useState("")
  const [printDialogOpen, setPrintDialogOpen] = useState(false)
  const [selectedChamadoId, setSelectedChamadoId] = useState<number | null>(null)
  const tableRef = useRef<HTMLDivElement>(null)
  const { toast } = useToast()

  // Dados de exemplo
  const chamados = [
    {
      id: 101,
      tabletId: 1,
      tombamento: "123.123",
      dataEntrada: "10/02/2025",
      dataSaida: null,
      descricao: "Tela quebrada, necessita de substituição urgente",
      status: "Aberto",
      usuario: "João Silva",
      unidade: "USF ALTO DOIS CARNEIROS",
      diasAberto: 3,
    },
    {
      id: 102,
      tabletId: 2,
      tombamento: "124.456",
      dataEntrada: "08/02/2025",
      dataSaida: null,
      descricao: "Bateria não carrega, mesmo com carregador original",
      status: "Aberto",
      usuario: "Maria Santos",
      unidade: "USF PRAZERES",
      diasAberto: 5,
    },
    {
      id: 100,
      tabletId: 3,
      tombamento: "125.789",
      dataEntrada: "05/02/2025",
      dataSaida: null,
      descricao: "Atualização de sistema operacional para Android 13",
      status: "Aberto",
      usuario: "Carlos Oliveira",
      unidade: "USF CAVALEIRO",
      diasAberto: 8,
    },
    {
      id: 99,
      tabletId: 4,
      tombamento: "126.012",
      dataEntrada: "01/02/2025",
      dataSaida: "03/02/2025",
      descricao: "Troca de equipamento por modelo mais recente",
      status: "Fechado",
      usuario: "Ana Pereira",
      unidade: "USF MURIBECA",
    },
    {
      id: 98,
      tabletId: 1,
      tombamento: "123.123",
      dataEntrada: "25/01/2025",
      dataSaida: "26/01/2025",
      descricao: "Configuração de email institucional e aplicativos",
      status: "Fechado",
      usuario: "João Silva",
      unidade: "USF ALTO DOIS CARNEIROS",
    },
    {
      id: 97,
      tabletId: 5,
      tombamento: "127.345",
      dataEntrada: "20/01/2025",
      dataSaida: "22/01/2025",
      descricao: "Problema com aplicativo de prontuário, travando constantemente",
      status: "Fechado",
      usuario: "Paulo Mendes",
      unidade: "USF JARDIM JORDÃO",
    },
    {
      id: 96,
      tabletId: 6,
      tombamento: "128.678",
      dataEntrada: "15/01/2025",
      dataSaida: "16/01/2025",
      descricao: "Atualização de firmware e reinstalação do sistema",
      status: "Fechado",
      usuario: "Fernanda Lima",
      unidade: "USF BARRA DE JANGADA",
    },
  ]

  // Listas únicas para os filtros
  const unidades = [...new Set(chamados.map((chamado) => chamado.unidade))]
  const usuarios = [...new Set(chamados.map((chamado) => chamado.usuario))]

  const filteredChamados = chamados.filter((chamado) => {
    // Filtro por status
    if (statusFilter === "abertos" && chamado.status !== "Aberto") return false
    if (statusFilter === "fechados" && chamado.status !== "Fechado") return false
    if (statusFilter === "atrasados" && (chamado.status !== "Aberto" || (chamado.diasAberto ?? 0) < 7)) return false

    // Filtros de dropdown
    const unidadeMatch = unidadeFilter === "" || chamado.unidade === unidadeFilter
    const usuarioMatch = usuarioFilter === "" || chamado.usuario === usuarioFilter

    // Filtro por termo de busca
    if (searchTerm) {
      const searchLower = searchTerm.toLowerCase()
      return (
        (chamado.id.toString().includes(searchTerm) ||
          chamado.tabletId.toString().includes(searchTerm) ||
          chamado.tombamento.includes(searchTerm) ||
          chamado.descricao.toLowerCase().includes(searchLower) ||
          chamado.usuario.toLowerCase().includes(searchLower)) &&
        unidadeMatch &&
        usuarioMatch
      )
    }

    return unidadeMatch && usuarioMatch
  })

  // Limpar filtros
  const clearFilters = () => {
    setUnidadeFilter("")
    setUsuarioFilter("")
    setDataInicialFilter("")
    setDataFinalFilter("")
    setShowFilters(false)

    toast({
      title: "Filtros limpos",
      description: "Todos os filtros foram removidos",
      variant: "info",
    })
  }

  const handleNewTicket = () => {
    toast({
      title: "Novo chamado",
      description: "Redirecionando para o formulário de abertura de chamado",
      variant: "info",
    })
  }

  const handlePrintClick = (id: number) => {
    setSelectedChamadoId(id)
    setPrintDialogOpen(true)
  }

  const handlePrintOS = (tipo: "entrega" | "devolucao") => {
    toast({
      title: `O.S. de ${tipo === "entrega" ? "Entrega" : "Devolução"} gerada`,
      description: `Documento para o chamado #${selectedChamadoId} gerado com sucesso`,
      variant: "success",
    })
    setPrintDialogOpen(false)
  }

  // Função para renderizar o status com a bolinha colorida
  const renderStatus = (chamado: (typeof chamados)[0]) => {
    let color = ""

    if (chamado.status === "Fechado") {
      color = "bg-green-400"
    } else if (chamado.status === "Aberto" && chamado.diasAberto && chamado.diasAberto >= 7) {
      color = "bg-amber-400"
    } else {
      color = "bg-sky-400"
    }

    return (
      <div className="flex items-center">
        <div className={`h-2.5 w-2.5 rounded-full ${color} mr-2`}></div>
        <span>{chamado.status}</span>
        {chamado.status === "Aberto" && chamado.diasAberto && chamado.diasAberto >= 7 && (
          <span className="text-xs text-red-500 ml-2">{chamado.diasAberto} dias</span>
        )}
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
        <div className="relative z-10 container mx-auto py-6 px-4 max-w-6xl">
          {/* Chamados Container */}
          <div className="bg-white/90 backdrop-blur-sm rounded-xl w-full p-6 shadow-xl border border-gray-100">
            <div className="flex flex-col space-y-4 mb-6">
              <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4">
                <h2 className="text-3xl font-light text-transparent bg-clip-text bg-gradient-to-r from-[#0948a7] to-[#298ed3] inline-block">
                  <span className="font-bold">Chamados</span>{" "}
                  <span className="text-gray-400 text-xl">| Gerenciamento</span>
                </h2>

                <div className="flex flex-col sm:flex-row gap-3">
                  <div className="relative">
                    <Input
                      type="text"
                      placeholder="Buscar chamado..."
                      className="pl-10 pr-4 py-2 rounded-full w-full sm:w-64 border-gray-200 focus-visible:ring-2 focus-visible:ring-[#298ed3]"
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                    />
                    <Search className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
                  </div>

                  <div className="flex gap-3">
                    <Button
                      variant="outline"
                      className={`rounded-full border-gray-200 hover:bg-gray-100 ${showFilters ? "bg-blue-50 text-blue-600" : ""}`}
                      onClick={() => setShowFilters(!showFilters)}
                    >
                      <Filter className="h-4 w-4 mr-2" />
                      Filtros {showFilters && <span className="ml-1 text-xs">(Ativos)</span>}
                    </Button>

                    <Link href="/chamados/novo">
                      <Button
                        className="rounded-full bg-gradient-to-r from-[#0948a7] to-[#298ed3] hover:from-[#083b8a] hover:to-[#1c7ab8] text-white"
                        onClick={handleNewTicket}
                      >
                        <Plus className="h-4 w-4 mr-2" />
                        Novo Chamado
                      </Button>
                    </Link>
                  </div>
                </div>
              </div>

              <Tabs defaultValue="todos" className="w-full" onValueChange={setStatusFilter}>
                <TabsList className="bg-gray-100 p-1 rounded-full">
                  <TabsTrigger
                    value="todos"
                    className="rounded-full data-[state=active]:bg-gradient-to-r from-[#0948a7] to-[#298ed3] data-[state=active]:text-white"
                  >
                    Todos
                  </TabsTrigger>
                  <TabsTrigger
                    value="abertos"
                    className="rounded-full data-[state=active]:bg-gradient-to-r from-[#0948a7] to-[#298ed3] data-[state=active]:text-white"
                  >
                    Abertos
                  </TabsTrigger>
                  <TabsTrigger
                    value="fechados"
                    className="rounded-full data-[state=active]:bg-gradient-to-r from-[#0948a7] to-[#298ed3] data-[state=active]:text-white"
                  >
                    Fechados
                  </TabsTrigger>
                  <TabsTrigger
                    value="atrasados"
                    className="rounded-full data-[state=active]:bg-gradient-to-r from-[#0948a7] to-[#298ed3] data-[state=active]:text-white"
                  >
                    <Clock className="h-4 w-4 mr-1" />
                    Atrasados (+7 dias)
                  </TabsTrigger>
                </TabsList>
              </Tabs>

              {/* Filtros expandidos */}
              {showFilters && (
                <div className="bg-gray-50 p-4 rounded-xl border border-gray-200 animate-in fade-in duration-200">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                    <div>
                      <Label htmlFor="unidade-filter" className="text-sm text-gray-500 mb-1 block">
                        Unidade
                      </Label>
                      <Select value={unidadeFilter} onValueChange={setUnidadeFilter}>
                        <SelectTrigger id="unidade-filter" className="w-full">
                          <SelectValue placeholder="Selecione a unidade" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="all">Todas</SelectItem>
                          {unidades.map((unidade) => (
                            <SelectItem key={unidade} value={unidade}>
                              {unidade}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    <div>
                      <Label htmlFor="usuario-filter" className="text-sm text-gray-500 mb-1 block">
                        Usuário
                      </Label>
                      <Select value={usuarioFilter} onValueChange={setUsuarioFilter}>
                        <SelectTrigger id="usuario-filter" className="w-full">
                          <SelectValue placeholder="Selecione o usuário" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="all">Todos</SelectItem>
                          {usuarios.map((usuario) => (
                            <SelectItem key={usuario} value={usuario}>
                              {usuario}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                    <div>
                      <Label htmlFor="data-inicial" className="text-sm text-gray-500 mb-1 block">
                        Data Inicial
                      </Label>
                      <Input
                        id="data-inicial"
                        type="date"
                        className="border-gray-200"
                        value={dataInicialFilter}
                        onChange={(e) => setDataInicialFilter(e.target.value)}
                      />
                    </div>

                    <div>
                      <Label htmlFor="data-final" className="text-sm text-gray-500 mb-1 block">
                        Data Final
                      </Label>
                      <Input
                        id="data-final"
                        type="date"
                        className="border-gray-200"
                        value={dataFinalFilter}
                        onChange={(e) => setDataFinalFilter(e.target.value)}
                      />
                    </div>
                  </div>

                  <div className="flex flex-wrap items-center gap-6">
                    <Button
                      variant="outline"
                      size="sm"
                      className="ml-auto rounded-full text-gray-500"
                      onClick={clearFilters}
                    >
                      Limpar filtros
                    </Button>
                  </div>
                </div>
              )}
            </div>

            {/* Modern Table */}
            <Card className="bg-white rounded-xl overflow-hidden shadow-md border border-gray-100">
              <div ref={tableRef} className="max-h-[calc(100vh-340px)] overflow-y-auto">
                <table className="w-full">
                  <thead className="bg-gradient-to-r from-[#0948a7] to-[#298ed3] text-white sticky top-0">
                    <tr>
                      <th className="py-2 px-3 text-left font-medium text-sm">ID</th>
                      <th className="py-2 px-3 text-left font-medium text-sm">TABLET</th>
                      <th className="py-2 px-3 text-left font-medium text-sm">USUÁRIO</th>
                      <th className="py-2 px-3 text-left font-medium text-sm">DATA ENTRADA</th>
                      <th className="py-2 px-3 text-left font-medium text-sm">DATA SAÍDA</th>
                      <th className="py-2 px-3 text-left font-medium text-sm">DESCRIÇÃO</th>
                      <th className="py-2 px-3 text-left font-medium text-sm">STATUS</th>
                      <th className="py-2 px-3 text-center font-medium text-sm">AÇÕES</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredChamados.length > 0 ? (
                      filteredChamados.map((chamado) => (
                        <tr key={chamado.id} className="border-b border-gray-100 hover:bg-gray-50 transition-colors">
                          <td className="py-2 px-3 text-blue-600 font-medium">
                            <Link href={`/chamados/${chamado.id}`} className="hover:underline">
                              {chamado.id}
                            </Link>
                          </td>
                          <td className="py-2 px-3">
                            <Link href={`/tablets/${chamado.tabletId}`} className="text-blue-600 hover:underline">
                              {chamado.tombamento}
                            </Link>
                          </td>
                          <td className="py-2 px-3 text-gray-800 text-sm">{chamado.usuario}</td>
                          <td className="py-2 px-3 text-gray-800 text-sm">
                            <div className="flex items-center">
                              <Calendar className="h-4 w-4 mr-1 text-gray-400" />
                              {chamado.dataEntrada}
                            </div>
                          </td>
                          <td className="py-2 px-3 text-gray-800 text-sm">
                            {chamado.dataSaida ? (
                              <div className="flex items-center">
                                <Calendar className="h-4 w-4 mr-1 text-gray-400" />
                                {chamado.dataSaida}
                              </div>
                            ) : (
                              <span className="text-gray-400">-</span>
                            )}
                          </td>
                          <td
                            className="py-2 px-3 text-gray-800 text-sm max-w-[200px] truncate"
                            title={chamado.descricao}
                          >
                            {chamado.descricao}
                          </td>
                          <td className="py-2 px-3 text-gray-800 text-sm">{renderStatus(chamado)}</td>
                          <td className="py-2 px-3">
                            <div className="flex justify-center space-x-2">
                              <Link href={`/chamados/${chamado.id}`}>
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  className="h-7 w-7 p-0 text-gray-600 hover:text-[#0948a7] hover:bg-blue-50"
                                  title="Visualizar"
                                  onClick={() => {
                                    toast({
                                      title: "Visualizando chamado",
                                      description: `Detalhes do chamado #${chamado.id}`,
                                      variant: "info",
                                    })
                                  }}
                                >
                                  <Eye className="h-4 w-4" />
                                </Button>
                              </Link>
                              <Button
                                variant="ghost"
                                size="sm"
                                className="h-7 w-7 p-0 text-gray-600 hover:text-[#0948a7] hover:bg-blue-50"
                                title="Imprimir O.S."
                                onClick={() => handlePrintClick(chamado.id)}
                              >
                                <Printer className="h-4 w-4" />
                              </Button>
                            </div>
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan={8} className="py-8 text-center text-gray-500">
                          Nenhum chamado encontrado com os critérios de busca.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </Card>
          </div>
        </div>
      </main>

      <Footer />

      {/* Dialog para impressão de O.S. */}
      <Dialog open={printDialogOpen} onOpenChange={setPrintDialogOpen}>
        <DialogContent className="sm:max-w-md p-0 overflow-hidden">
          <DialogHeader className="bg-gradient-to-r from-[#0948a7] to-[#298ed3] text-white p-6 rounded-t-lg">
            <DialogTitle className="text-xl">Gerar Ordem de Serviço</DialogTitle>
            <DialogDescription className="text-white/90 mt-1">
              Selecione o tipo de O.S. que deseja gerar para o chamado #{selectedChamadoId}
            </DialogDescription>
          </DialogHeader>
          <div className="p-6">
            <div className="grid grid-cols-1 gap-4 py-4">
              <Button
                className="bg-gradient-to-r from-green-600 to-green-500 hover:from-green-700 hover:to-green-600 text-white h-16 rounded-xl flex items-center justify-start px-6 transition-all hover:scale-[1.02]"
                onClick={() => handlePrintOS("entrega")}
              >
                <div className="bg-white/20 p-2 rounded-lg mr-4">
                  <FileText className="h-6 w-6" />
                </div>
                <div className="text-left">
                  <p className="font-medium">O.S. de Entrega</p>
                  <p className="text-xs opacity-80">Gerar documento para entrega do equipamento</p>
                </div>
              </Button>

              <Button
                className="bg-gradient-to-r from-[#0948a7] to-[#298ed3] hover:from-[#083b8a] hover:to-[#1c7ab8] text-white h-16 rounded-xl flex items-center justify-start px-6 transition-all hover:scale-[1.02]"
                onClick={() => handlePrintOS("devolucao")}
              >
                <div className="bg-white/20 p-2 rounded-lg mr-4">
                  <FileOutput className="h-6 w-6" />
                </div>
                <div className="text-left">
                  <p className="font-medium">O.S. de Devolução</p>
                  <p className="text-xs opacity-80">Gerar documento para devolução do equipamento</p>
                </div>
              </Button>
            </div>
            <DialogFooter className="pt-4 border-t border-gray-100">
              <Button
                type="button"
                variant="outline"
                onClick={() => setPrintDialogOpen(false)}
                className="rounded-full border-gray-200"
              >
                Cancelar
              </Button>
            </DialogFooter>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}
