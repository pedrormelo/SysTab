"use client"

import { useEffect, useState, useRef } from "react"
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
import api from "@/lib/api"

export default function SysTAB() {
  const [tablets, setTablets] = useState<any[]>([])
  const [searchTerm, setSearchTerm] = useState("")
  const [showFilters, setShowFilters] = useState(false)
  const [empresaFilter, setEmpresaFilter] = useState("")
  const [unidadeFilter, setUnidadeFilter] = useState("")
  const [regionalFilter, setRegionalFilter] = useState("")
  const [tabletToDelete, setTabletToDelete] = useState<number | null>(null)
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)
  const tableRef = useRef<HTMLDivElement>(null)
  const { toast } = useToast()

  useEffect(() => {
    api.get("/tablets")
      .then(res => setTablets(res.data))
      .catch(() => {
        toast({
          title: "Erro ao carregar tablets",
          description: "Não foi possível obter os tablets do servidor.",
          variant: "destructive",
        })
      })
  }, [])

  const empresas = [...new Set(tablets.map((tablet) => tablet.empresa))]
  const unidades = [...new Set(tablets.map((tablet) => tablet.unidade))]
  const regionais = [...new Set(tablets.map((tablet) => tablet.regional))]

  const filteredTablets = tablets.filter((tablet) => {
    const searchMatch =
      searchTerm === "" ||
      String(tablet.imei).toLowerCase().includes(searchTerm.toLowerCase()) ||
      String(tablet.usuario).toLowerCase().includes(searchTerm.toLowerCase()) ||
      String(tablet.idTomb).toLowerCase().includes(searchTerm.toLowerCase()) ||
      String(tablet.idTab).toLowerCase().includes(searchTerm.toLowerCase()) ||
      String(tablet.unidade).toLowerCase().includes(searchTerm.toLowerCase())

    const empresaMatch = empresaFilter === "" || tablet.empresa === empresaFilter
    const unidadeMatch = unidadeFilter === "" || tablet.unidade === unidadeFilter
    const regionalMatch = regionalFilter === "" || tablet.regional === regionalFilter

    return searchMatch && empresaMatch && unidadeMatch && regionalMatch
  })

  const clearFilters = () => {
    setEmpresaFilter("")
    setUnidadeFilter("")
    setRegionalFilter("")
    setShowFilters(false)

    toast({
      title: "Filtros limpos",
      description: "Todos os filtros foram removidos",
      variant: "info",
    })
  }

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

  const confirmDelete = async () => {
    if (!tabletToDelete) return

    try {
      await api.delete(`/tablets/${tabletToDelete}`)

      setTablets((prev) => prev.filter((t) => t.idTab !== tabletToDelete))
      toast({
        title: "Tablet excluído",
        description: `O tablet #${tabletToDelete} foi excluído com sucesso`,
        variant: "success",
      })
    } catch (error) {
      toast({
        title: "Erro ao excluir",
        description: "Não foi possível excluir o tablet. Tente novamente.",
        variant: "destructive",
      })
    } finally {
      setIsDeleteDialogOpen(false)
      setTabletToDelete(null)
    }
  }


  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Navbar currentPath="/" />

      <main className="flex-1 relative">
        <div className="absolute inset-0 z-0">
          <Image src="/beach-background.jpg" alt="Fundo de praia" fill className="object-cover" priority />
        </div>

        <div className="relative z-10 container mx-auto py-6 px-4 max-w-6xl">
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

              {showFilters && (
                <div className="bg-gray-50 p-4 rounded-xl border border-gray-200 animate-in fade-in duration-200">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                    <div>
                      <Label htmlFor="empresa-filter" className="text-sm text-gray-500 mb-1 block">Empresa</Label>
                      <Select value={empresaFilter} onValueChange={setEmpresaFilter}>
                        <SelectTrigger id="empresa-filter" className="w-full">
                          <SelectValue placeholder="Selecione a empresa" />
                        </SelectTrigger>
                        <SelectContent>
                          {empresas.map((empresa) => (
                            <SelectItem key={empresa} value={empresa}>{empresa}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    <div>
                      <Label htmlFor="unidade-filter" className="text-sm text-gray-500 mb-1 block">Unidade</Label>
                      <Select value={unidadeFilter} onValueChange={setUnidadeFilter}>
                        <SelectTrigger id="unidade-filter" className="w-full">
                          <SelectValue placeholder="Selecione a unidade" />
                        </SelectTrigger>
                        <SelectContent>
                          {unidades.map((unidade) => (
                            <SelectItem key={unidade} value={unidade}>{unidade}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    <div>
                      <Label htmlFor="regional-filter" className="text-sm text-gray-500 mb-1 block">Regional</Label>
                      <Select value={regionalFilter} onValueChange={setRegionalFilter}>
                        <SelectTrigger id="regional-filter" className="w-full">
                          <SelectValue placeholder="Selecione a regional" />
                        </SelectTrigger>
                        <SelectContent>
                          {regionais.map((regional) => (
                            <SelectItem key={regional} value={regional}>{regional}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div className="flex justify-end">
                    <Button variant="outline" size="sm" className="rounded-full text-gray-500" onClick={clearFilters}>
                      Limpar filtros
                    </Button>
                  </div>
                </div>
              )}
            </div>

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
                        <tr key={tablet.idTab} className="border-b border-gray-100 hover:bg-gray-50 transition-colors">
                          <td className="py-2 px-3 text-blue-600 font-medium">
                            <Link href={`/tablets/${tablet.idTab}`} className="hover:underline">
                              {tablet.idTab}
                            </Link>
                          </td>
                          <td className="py-2 px-3 text-gray-800 text-sm">{tablet.idTomb}</td>
                          <td className="py-2 px-3 text-gray-800 text-sm">{tablet.imei}</td>
                          <td className="py-2 px-3 text-gray-800 text-sm">{tablet.usuario}</td>
                          <td className="py-2 px-3 text-gray-800 text-sm">{tablet.empresa}</td>
                          <td className="py-2 px-3 text-gray-800 text-sm max-w-[150px] truncate" title={tablet.unidade}>
                            {tablet.unidade}
                          </td>
                          <td className="py-2 px-3">
                            <div className="flex justify-center space-x-1">
                              <Link href={`/tablets/${tablet.idTab}`}>
                                <Button variant="ghost" size="sm" className="h-7 w-7 p-0 text-gray-600 hover:text-[#0948a7] hover:bg-blue-50" title="Visualizar">
                                  <Eye className="h-4 w-4" />
                                </Button>
                              </Link>
                              <Link href={`/tablets/${tablet.idTab}/editar`}>
                                <Button variant="ghost" size="sm" className="h-7 w-7 p-0 text-gray-600 hover:text-[#0948a7] hover:bg-blue-50" title="Editar">
                                  <Edit className="h-4 w-4" />
                                </Button>
                              </Link>
                              <Button variant="ghost" size="sm" className="h-7 w-7 p-0 text-gray-600 hover:text-red-600 hover:bg-red-50" title="Excluir" onClick={() => handleDeleteTablet(tablet.idTab)}>
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
