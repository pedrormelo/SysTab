"use client"

import { useState, useRef, useEffect } from "react"
import Image from "next/image"
import Link from "next/link"
import { Search, Plus, Trash2, Filter } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Card } from "@/components/ui/card"
import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Navbar } from "../components/layout/navbar"
import { Footer } from "../components/layout/footer"
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

interface Unidade {
  id: number;
  nome: string;
  regional: string;
  qtdTablets: number;
}

export default function Unidades() {
  const [searchTerm, setSearchTerm] = useState("")
  const [showFilters, setShowFilters] = useState(false)
  const [regionalFilter, setRegionalFilter] = useState("")
  const [comTabletsFilter, setComTabletsFilter] = useState(false)
  const [semTabletsFilter, setSemTabletsFilter] = useState(false)
  const [unitToDelete, setUnitToDelete] = useState<number | null>(null)
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)
  const [unidades, setUnidades] = useState<Unidade[]>([])
  const tableRef = useRef<HTMLDivElement>(null)
  const { toast } = useToast()

  useEffect(() => {
    api.get("/unidades")
      .then((res: any) => {
        const data = Array.isArray(res.data)
          ? res.data.map((u: any) => ({
              id: u.idUnidade || u.id || 0,
              nome: u.nomeUnidade || u.nome || "",
              regional: u.regional || "",
              qtdTablets: u.qtdTablets ?? 0,
            }))
          : [];
        setUnidades(data);
      })
      .catch(() => {
        toast({
          title: "Erro ao carregar unidades",
          description: "Não foi possível obter as unidades do servidor.",
          variant: "destructive",
        })
      })
  }, [])

  // Listas únicas para os filtros
  const regionais = [...new Set(unidades.map((unidade) => unidade.regional))]

  const filteredUnidades = unidades.filter((unidade) => {
    // Filtro de busca
    const searchMatch =
      searchTerm === "" ||
      unidade.nome.toLowerCase().includes(searchTerm.toLowerCase()) ||
      unidade.regional.toLowerCase().includes(searchTerm.toLowerCase())

    // Filtros de dropdown
    const regionalMatch = regionalFilter === "" || unidade.regional === regionalFilter

    // Filtros de checkbox
    const comTabletsMatch = !comTabletsFilter || unidade.qtdTablets > 0
    const semTabletsMatch = !semTabletsFilter || unidade.qtdTablets === 0

    return searchMatch && regionalMatch && comTabletsMatch && semTabletsMatch
  })

  // Limpar filtros
  const clearFilters = () => {
    setRegionalFilter("")
    setComTabletsFilter(false)
    setSemTabletsFilter(false)
    setShowFilters(false)

    toast({
      title: "Filtros limpos",
      description: "Todos os filtros foram removidos",
      variant: "info",
    })
  }

  const handleAddUnit = () => {
    toast({
      title: "Nova unidade",
      description: "Redirecionando para o formulário de cadastro",
      variant: "info",
    })
  }

  const handleDeleteUnit = (id: number) => {
    setUnitToDelete(id)
    setIsDeleteDialogOpen(true)
  }

  const confirmDelete = async () => {
    if (!unitToDelete) return;
    try {
      await api.delete(`/unidades/${unitToDelete}`)
      toast({
        title: "Unidade excluída",
        description: `A unidade #${unitToDelete} foi excluída com sucesso`,
        variant: "info",
      })
      setUnidades((prev) => prev.filter((u) => u.id !== unitToDelete))
    } catch (err) {
      toast({
        title: "Erro ao excluir unidade",
        description: "Não foi possível excluir a unidade.",
        variant: "destructive",
      })
    }
    setIsDeleteDialogOpen(false)
    setUnitToDelete(null)
  }

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Navbar currentPath="/unidades" />

      {/* Main Content with Background Image */}
      <main className="flex-1 relative">
        {/* Background Image */}
        <div className="absolute inset-0 z-0">
          <Image src="/beach-background.jpg" alt="Fundo de praia" fill className="object-cover" priority />
        </div>

        {/* Content */}
        <div className="relative z-10 container mx-auto py-6 px-4 max-w-6xl">
          {/* Unidades Container */}
          <div className="bg-white/90 backdrop-blur-sm rounded-xl w-full p-6 shadow-xl border border-gray-100">
            <div className="flex flex-col space-y-4 mb-6">
              <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4">
                <h2 className="text-3xl font-light text-transparent bg-clip-text bg-gradient-to-r from-[#0948a7] to-[#298ed3] inline-block">
                  <span className="font-bold">Unidades</span>{" "}
                  <span className="text-gray-400 text-xl">| Gerenciamento</span>
                </h2>

                <div className="flex flex-col sm:flex-row gap-3">
                  <div className="relative">
                    <Input
                      type="text"
                      placeholder="Buscar unidade..."
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

                    <Link href="/unidades/nova">
                      <Button
                        className="rounded-full bg-gradient-to-r from-[#0948a7] to-[#298ed3] hover:from-[#083b8a] hover:to-[#1c7ab8] text-white"
                        onClick={handleAddUnit}
                      >
                        <Plus className="h-4 w-4 mr-2" />
                        Nova Unidade
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
                    <div className="flex items-center space-x-2">
                      <Checkbox
                        id="com-tablets"
                        checked={comTabletsFilter}
                        onCheckedChange={(checked) => setComTabletsFilter(checked as boolean)}
                      />
                      <Label htmlFor="com-tablets" className="text-sm cursor-pointer">
                        Unidades com tablets
                      </Label>
                    </div>

                    <div className="flex items-center space-x-2">
                      <Checkbox
                        id="sem-tablets"
                        checked={semTabletsFilter}
                        onCheckedChange={(checked) => setSemTabletsFilter(checked as boolean)}
                      />
                      <Label htmlFor="sem-tablets" className="text-sm cursor-pointer">
                        Unidades sem tablets
                      </Label>
                    </div>

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
              <div ref={tableRef} className="max-h-[calc(100vh-280px)] overflow-y-auto">
                <table className="w-full">
                  <thead className="bg-gradient-to-r from-[#0948a7] to-[#298ed3] text-white sticky top-0">
                    <tr>
                      <th className="py-2 px-3 text-left font-medium text-sm">UNIDADE</th>
                      <th className="py-2 px-3 text-left font-medium text-sm">REGIONAL</th>
                      <th className="py-2 px-3 text-left font-medium text-sm">TABLETS</th>
                      <th className="py-2 px-3 text-center font-medium text-sm">AÇÕES</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredUnidades.length > 0 ? (
                      filteredUnidades.map((unidade) => (
                        <tr key={unidade.id} className="border-b border-gray-100 hover:bg-gray-50 transition-colors">
                          <td className="py-2 px-3 text-gray-800 font-medium">{unidade.nome}</td>
                          <td className="py-2 px-3 text-gray-800 text-sm">{unidade.regional}</td>
                          <td className="py-2 px-3">
                            <Link href={`/tablets?unidade=${unidade.id}`}>
                              <Badge
                                variant="outline"
                                className="bg-blue-50 text-blue-600 hover:bg-blue-100 cursor-pointer"
                              >
                                {unidade.qtdTablets} {unidade.qtdTablets === 1 ? "tablet" : "tablets"}
                              </Badge>
                            </Link>
                          </td>
                          <td className="py-2 px-3">
                            <div className="flex justify-center space-x-2">
                              <Button
                                variant="ghost"
                                size="sm"
                                className="h-7 w-7 p-0 text-gray-600 hover:text-red-600 hover:bg-red-50"
                                title="Excluir"
                                onClick={() => handleDeleteUnit(unidade.id)}
                              >
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </div>
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan={4} className="py-8 text-center text-gray-500">
                          Nenhuma unidade encontrada com os critérios de busca.
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
              Tem certeza que deseja excluir esta unidade? Esta ação não pode ser desfeita.
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
