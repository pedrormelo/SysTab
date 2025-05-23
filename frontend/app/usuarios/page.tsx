"use client"

import { useState, useRef, useEffect } from "react"
import Image from "next/image"
import Link from "next/link"
import { Search, Plus, Edit, Trash2, Filter, Smartphone, Phone } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
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

interface Usuario {
  id: number;
  nome: string;
  cpf: string;
  telefone: string;
  unidade: string;
  tabletId?: number;
  tombamento?: string;
}

export default function Usuarios() {
  const [searchTerm, setSearchTerm] = useState("")
  const [showFilters, setShowFilters] = useState(false)
  const [unidadeFilter, setUnidadeFilter] = useState("")
  const [comTabletFilter, setComTabletFilter] = useState(false)
  const [semTabletFilter, setSemTabletFilter] = useState(false)
  const [userToDelete, setUserToDelete] = useState<number | null>(null)
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)
  const [usuarios, setUsuarios] = useState<Usuario[]>([])
  const [tabletVinculado, setTabletVinculado] = useState(false)
  const tableRef = useRef<HTMLDivElement>(null)
  const { toast } = useToast()

  useEffect(() => {
    api.get("/usuarios")
      .then((res: any) => {
        const data = Array.isArray(res.data)
          ? res.data.map((u: any) => ({
            id: u.idUser || u.id || 0,
            nome: u.nomeUser || u.nome || "",
            cpf: u.cpf || "",
            telefone: u.telUser || u.telefone || "",
            unidade: u.unidade || "",
            tabletId: u.idTablet,
            tombamento: u.tombamento,
          }))
          : [];
        setUsuarios(data);
      })
      .catch(() => {
        toast({
          title: "Erro ao carregar usuários",
          description: "Não foi possível obter os usuários do servidor.",
          variant: "destructive",
        })
      })
  }, [])

  // Listas únicas para os filtros
  const unidades = [...new Set(usuarios.map((usuario) => usuario.unidade))]

  const filteredUsuarios = usuarios.filter((usuario) => {
    // Filtro de busca
    const searchMatch =
      searchTerm === "" ||
      usuario.nome.toLowerCase().includes(searchTerm.toLowerCase()) ||
      usuario.cpf.includes(searchTerm) ||
      usuario.unidade.toLowerCase().includes(searchTerm.toLowerCase()) ||
      usuario.telefone.includes(searchTerm) ||
      (usuario.tombamento && usuario.tombamento.includes(searchTerm))

    // Filtros de dropdown
    const unidadeMatch = unidadeFilter === "" || usuario.unidade === unidadeFilter

    // Filtros de checkbox
    const comTabletMatch = !comTabletFilter || usuario.tabletId !== undefined
    const semTabletMatch = !semTabletFilter || usuario.tabletId === undefined

    return searchMatch && unidadeMatch && comTabletMatch && semTabletMatch
  })

  // Limpar filtros
  const clearFilters = () => {
    setUnidadeFilter("")
    setComTabletFilter(false)
    setSemTabletFilter(false)
    setShowFilters(false)

    toast({
      title: "Filtros limpos",
      description: "Todos os filtros foram removidos",
      variant: "default",
    })
  }

  const handleAddUser = () => {
    toast({
      title: "Novo usuário",
      description: "Redirecionando para o formulário de cadastro",
      variant: "info",
    })
  }

  const handleDeleteUser = (usuario: Usuario) => {
    setUserToDelete(usuario.id)
    setIsDeleteDialogOpen(true)
  }

  const confirmDelete = async () => {
    if (!userToDelete) return;
    try {
      await api.delete(`/usuarios/${userToDelete}`)
      toast({
        title: "Usuário excluído",
        description: `O usuário #${userToDelete} foi excluído com sucesso`,
        variant: "info",
      })
      setUsuarios((prev) => prev.filter((u) => u.id !== userToDelete))
    } catch (err) {
      toast({
        title: "Erro ao excluir usuário",
        description: "Não foi possível excluir o usuário.",
        variant: "destructive",
      })
    }
    setIsDeleteDialogOpen(false)
    setUserToDelete(null)
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
        <div className="relative z-10 container mx-auto py-6 px-4 max-w-6xl">
          {/* Usuarios Container */}
          <div className="bg-white/90 backdrop-blur-sm rounded-xl w-full p-6 shadow-xl border border-gray-100">
            <div className="flex flex-col space-y-4 mb-6">
              <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4">
                <h2 className="text-3xl font-light text-transparent bg-clip-text bg-gradient-to-r from-[#0948a7] to-[#298ed3] inline-block">
                  <span className="font-bold">Usuários</span>{" "}
                  <span className="text-gray-400 text-xl">| Gerenciamento</span>
                </h2>

                <div className="flex flex-col sm:flex-row gap-3">
                  <div className="relative">
                    <Input
                      type="text"
                      placeholder="Buscar usuário..."
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

                    <Link href="/usuarios/novo">
                      <Button
                        className="rounded-full bg-gradient-to-r from-[#0948a7] to-[#298ed3] hover:from-[#083b8a] hover:to-[#1c7ab8] text-white"
                        onClick={handleAddUser}
                      >
                        <Plus className="h-4 w-4 mr-2" />
                        Novo Usuário
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
                  </div>

                  <div className="flex flex-wrap items-center gap-6">
                    <div className="flex items-center space-x-2">
                      <Checkbox
                        id="com-tablet"
                        checked={comTabletFilter}
                        onCheckedChange={(checked) => setComTabletFilter(checked as boolean)}
                      />
                      <Label htmlFor="com-tablet" className="text-sm cursor-pointer">
                        Usuários com tablet
                      </Label>
                    </div>

                    <div className="flex items-center space-x-2">
                      <Checkbox
                        id="sem-tablet"
                        checked={semTabletFilter}
                        onCheckedChange={(checked) => setSemTabletFilter(checked as boolean)}
                      />
                      <Label htmlFor="sem-tablet" className="text-sm cursor-pointer">
                        Usuários sem tablet
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
                      <th className="py-2 px-3 text-left font-medium text-sm">NOME</th>
                      <th className="py-2 px-3 text-left font-medium text-sm">CPF</th>
                      <th className="py-2 px-3 text-left font-medium text-sm">TELEFONE</th>
                      <th className="py-2 px-3 text-left font-medium text-sm">UNIDADE</th>
                      <th className="py-2 px-3 text-left font-medium text-sm">TABLET</th>
                      <th className="py-2 px-3 text-center font-medium text-sm">AÇÕES</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredUsuarios.length > 0 ? (
                      filteredUsuarios.map((usuario) => (
                        <tr key={usuario.id} className="border-b border-gray-100 hover:bg-gray-50 transition-colors">
                          <td className="py-2 px-3 text-gray-800 font-medium">{usuario.nome}</td>
                          <td className="py-2 px-3 text-gray-800 text-sm">{usuario.cpf}</td>
                          <td className="py-2 px-3">
                            <div className="flex items-center text-gray-600">
                              <Phone className="h-4 w-4 mr-1" />
                              <span className="text-sm">{usuario.telefone}</span>
                            </div>
                          </td>
                          <td
                            className="py-2 px-3 text-gray-800 text-sm max-w-[200px] truncate"
                            title={usuario.unidade}
                          >
                            {usuario.unidade}
                          </td>
                          <td className="py-2 px-3">
                            {usuario.tabletId ? (
                              <Link
                                href={`/tablets/${usuario.tabletId}`}
                                className="flex items-center text-blue-600 hover:underline"
                              >
                                <Smartphone className="h-4 w-4 mr-1" />
                                {usuario.tombamento}
                              </Link>
                            ) : (
                              <span className="text-gray-400 text-sm">Não associado</span>
                            )}
                          </td>
                          <td className="py-2 px-3">
                            <div className="flex justify-center space-x-2">
                              <Link href={`/usuarios/${usuario.id}/editar`}>
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  className="h-7 w-7 p-0 text-gray-600 hover:text-[#0948a7] hover:bg-blue-50"
                                  title="Editar"
                                  onClick={() => {
                                    toast({
                                      title: "Editando usuário",
                                      description: `Formulário de edição do usuário ${usuario.nome}`,
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
                                onClick={() => handleDeleteUser(usuario)}
                              >
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </div>
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan={6} className="py-8 text-center text-gray-500">
                          Nenhum usuário encontrado com os critérios de busca.
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
              {usuarios.find(u => u.id === userToDelete)?.tabletId !== undefined
                ? "Este item possui um tablet vinculado. Ao excluir, o tablet será mantido, mas o vínculo será removido. Deseja continuar?"
                : "Tem certeza que deseja excluir este item? Esta ação não pode ser desfeita."}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction
              onClick={confirmDelete}
              className="bg-red-500 text-white hover:bg-red-600"
            >
              Excluir
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>


    </div>
  )
}
