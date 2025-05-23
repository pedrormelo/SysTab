"use client"

import { useState, useRef } from "react"
import Image from "next/image"
import Link from "next/link"
import { Search, Plus, Eye, Edit, Trash2, Filter } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Navbar } from "./components/layout/navbar"
import { Footer } from "./components/layout/footer"
import { useToast } from "@/hooks/use-toast"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"

export default function SysTAB() {
  const [searchTerm, setSearchTerm] = useState("")
  const [showFilters, setShowFilters] = useState(false)
  const [empresaFilter, setEmpresaFilter] = useState("")
  const [unidadeFilter, setUnidadeFilter] = useState("")
  const [regionalFilter, setRegionalFilter] = useState("")
  const [chamadosAbertosFilter, setChamadosAbertosFilter] = useState(false)
  const [chamadosAtrasadosFilter, setChamadosAtrasadosFilter] = useState(false)
  const [tabletToDelete, setTabletToDelete] = useState<number | null>(null)
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)
  const tableRef = useRef<HTMLDivElement>(null)
  const { toast } = useToast()

  // Dados de exemplo
  const tablets = [
    {
      id: 1,
      tombamento: "123.123",
      imei: "355637050806462",
      usuario: "João Silva",
      empresa: "EVEREST",
      unidade: "USF ALTO DOIS CARNEIROS",
      regional: "Regional 2",
    },
    {
      id: 2,
      tombamento: "124.456",
      imei: "355637050806463",
      usuario: "Maria Santos",
      empresa: "EVEREST",
      unidade: "USF PRAZERES",
      regional: "Regional 1",
    },
    {
      id: 3,
      tombamento: "125.789",
      imei: "355637050806464",
      usuario: "Carlos Oliveira",
      empresa: "EVEREST",
      unidade: "USF CAVALEIRO",
      regional: "Regional 3",
    },
    {
      id: 4,
      tombamento: "126.012",
      imei: "355637050806465",
      usuario: "Ana Pereira",
      empresa: "EVEREST",
      unidade: "USF MURIBECA",
      regional: "Regional 2",
    },
    {
      id: 5,
      tombamento: "127.345",
      imei: "355637050806466",
      usuario: "Paulo Mendes",
      empresa: "EVEREST",
      unidade: "USF JARDIM JORDÃO",
      regional: "Regional 1",
    },
    {
      id: 6,
      tombamento: "128.678",
      imei: "355637050806467",
      usuario: "Fernanda Lima",
      empresa: "EVEREST",
      unidade: "USF BARRA DE JANGADA",
      regional: "Regional 3",
    },
    {
      id: 7,
      tombamento: "129.901",
      imei: "355637050806468",
      usuario: "Ricardo Souza",
      empresa: "NEXUS",
      unidade: "USF CAJUEIRO SECO",
      regional: "Regional 2",
    },
  ]

  // Listas únicas para os filtros
  const empresas = [...new Set(tablets.map((tablet) => tablet.empresa))]
  const unidades = [...new Set(tablets.map((tablet) => tablet.unidade))]
  const regionais = [...new Set(tablets.map((tablet) => tablet.regional))]

  const filteredTablets = tablets.filter((tablet) => {
    // Filtro de busca
    const searchMatch =
      searchTerm === "" ||
      tablet.imei.toLowerCase().includes(searchTerm.toLowerCase()) ||
      tablet.usuario.toLowerCase().includes(searchTerm.toLowerCase()) ||
      tablet.tombamento.toLowerCase().includes(searchTerm.toLowerCase()) ||
      String(tablet.id).toLowerCase().includes(searchTerm.toLowerCase()) ||
      tablet.unidade.toLowerCase().includes(searchTerm.toLowerCase())

    // Filtros de dropdown
    const empresaMatch = empresaFilter === "" || tablet.empresa === empresaFilter
    const unidadeMatch = unidadeFilter === "" || tablet.unidade === unidadeFilter
    const regionalMatch = regionalFilter === "" || tablet.regional === regionalFilter

    return searchMatch && empresaMatch && unidadeMatch && regionalMatch
  })

  // Limpar filtros
  const clearFilters = () => {
    setEmpresaFilter("")
    setUnidadeFilter("")
    setRegionalFilter("")
    setChamadosAbertosFilter(false)
    setChamadosAtrasadosFilter(false)
    setShowFilters(false)

    toast({
      title: "Filtros limpos",
      description: "Todos os filtros foram removidos",
      variant: "info",
    })
  }

  // Funções para manipulação de tablets
  const handleAddTablet = () => {
    toast({
      title: "Novo tablet",
      description: "Formulário de cadastro de tablet aberto",
      variant: "info",
    })
  }

  const handleDeleteTablet = (id: number) => {
    setTabletToDelete(id)
    setIsDeleteDialogOpen(true)
  }

  const confirmDelete = () => {
    // Lógica para excluir o tablet
    toast({
      title: "Tablet excluído",
      description: `O tablet #${tabletToDelete} foi excluído com sucesso`,
      variant: "success",
    })
    setIsDeleteDialogOpen(false)
    setTabletToDelete(null)
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
        <div className="relative z-10 container mx-auto py-6 px-4 max-w-6xl">
          {/* Tablets Container */}
          <div className="bg-white/90 backdrop-blur-sm rounded-xl w-full p-6 shadow-xl border border-gray-100">
            <div className="flex flex-col space-y-4 mb-6">
              <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4">
                <h2 className="text-3xl font-light text-transparent bg-clip-text bg-gradient-to-r from-[#0948a7] to-[#298ed3] inline-block">
                  <span className="font-bold">Tablets</span>{" "}
                  <span className="text-gray-400 text-xl">| Gerenciamento</span>
                </h2>

                <div className="flex flex-col sm:flex-row gap-3">
                  <div className="relative">
                    <Input
                      type="text"
                      placeholder="Buscar por ID, usuário, IMEI..."
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

                    <Link href="/tablets/novo">
                      <Button
                        className="rounded-full bg-gradient-to-r from-[#0948a7] to-[#298ed3] hover:from-[#083b8a] hover:to-[#1c7ab8] text-white"
                        onClick={handleAddTablet}
                      >
                        <Plus className="h-4 w-4 mr-2" />
                        Adicionar Tablet
                      </Button>
                    </Link>
                  </div>
                </div>
              </div>

              {/* Filtros expandidos */}
              {showFilters && (
                <div className="bg-gray-50 p-4 rounded-xl border border-gray-200 animate-in fade-in duration-200">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                    <div>
                      <Label htmlFor="empresa-filter" className="text-sm text-gray-500 mb-1 block">
                        Empresa
                      </Label>
                      <Select value={empresaFilter} onValueChange={setEmpresaFilter}>
                        <SelectTrigger id="empresa-filter" className="w-full">
                          <SelectValue placeholder="Selecione a empresa" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="all">Todas</SelectItem>
                          {empresas.map((empresa) => (
                            <SelectItem key={empresa} value={empresa}>
                              {empresa}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

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
                      <Label htmlFor="regional-filter" className="text-sm text-gray-500 mb-1 block">
                        Regional
                      </Label>
                      <Select value={regionalFilter} onValueChange={setRegionalFilter}>
                        <SelectTrigger id="regional-filter" className="w-full">
                          <SelectValue placeholder="Selecione a regional" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="all">Todas</SelectItem>
                          {regionais.map((regional) => (
                            <SelectItem key={regional} value={regional}>
                              {regional}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
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
              <div ref={tableRef} className="max-h-[calc(100vh-350px)] overflow-y-auto">
                <table className="w-full">
                  <thead className="bg-gradient-to-r from-[#0948a7] to-[#298ed3] text-white sticky top-0">
                    <tr>
                      <th className="py-2 px-3 text-left font-medium text-sm">ID</th>
                      <th className="py-2 px-3 text-left font-medium text-sm">TOMBAMENTO</th>
                      <th className="py-2 px-3 text-left font-medium text-sm">IMEI</th>
                      <th className="py-2 px-3 text-left font-medium text-sm">USUÁRIO</th>
                      <th className="py-2 px-3 text-left font-medium text-sm">EMPRESA</th>
                      <th className="py-2 px-3 text-left font-medium text-sm">UNIDADE</th>
                      <th className="py-2 px-3 text-center font-medium text-sm">AÇÕES</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredTablets.length > 0 ? (
                      filteredTablets.map((tablet) => (
                        <tr key={tablet.id} className="border-b border-gray-100 hover:bg-gray-50 transition-colors">
                          <td className="py-2 px-3 text-blue-600 font-medium">
                            <Link href={`/tablets/${tablet.id}`} className="hover:underline">
                              {tablet.id}
                            </Link>
                          </td>
                          <td className="py-2 px-3 text-gray-800 text-sm">{tablet.tombamento}</td>
                          <td className="py-2 px-3 text-gray-800 text-sm">{tablet.imei}</td>
                          <td className="py-2 px-3 text-gray-800 text-sm">{tablet.usuario}</td>
                          <td className="py-2 px-3 text-gray-800 text-sm">{tablet.empresa}</td>
                          <td className="py-2 px-3 text-gray-800 text-sm max-w-[150px] truncate" title={tablet.unidade}>
                            {tablet.unidade}
                          </td>
                          <td className="py-2 px-3">
                            <div className="flex justify-center space-x-1">
                              <Link href={`/tablets/${tablet.id}`}>
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  className="h-7 w-7 p-0 text-gray-600 hover:text-[#0948a7] hover:bg-blue-50"
                                  title="Visualizar"
                                  onClick={() => {
                                    toast({
                                      title: "Visualizando tablet",
                                      description: `Detalhes do tablet #${tablet.id}`,
                                      variant: "info",
                                    })
                                  }}
                                >
                                  <Eye className="h-4 w-4" />
                                </Button>
                              </Link>
                              <Link href={`/tablets/${tablet.id}/editar`}>
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  className="h-7 w-7 p-0 text-gray-600 hover:text-[#0948a7] hover:bg-blue-50"
                                  title="Editar"
                                  onClick={() => {
                                    toast({
                                      title: "Editando tablet",
                                      description: `Formulário de edição do tablet #${tablet.id}`,
                                      variant: "info",
                                    })
                                  }}
                                >
                                  <Edit className="h-4 w-4" />
                                </Button>
                              </Link>
                              <Button
                                variant="ghost"
                                size="sm"
                                className="h-7 w-7 p-0 text-gray-600 hover:text-red-600 hover:bg-red-50"
                                title="Excluir"
                                onClick={() => handleDeleteTablet(tablet.id)}
                              >
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </div>
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan={7} className="py-8 text-center text-gray-500">
                          Nenhum tablet encontrado com os critérios de busca.
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

      {/* Dialog de confirmação de exclusão */}
      <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Confirmar exclusão</AlertDialogTitle>
            <AlertDialogDescription>
              Tem certeza que deseja excluir o tablet #{tabletToDelete}? Esta ação não pode ser desfeita.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction onClick={confirmDelete} className="bg-red-500 text-white hover:bg-red-600">
              Excluir
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}
