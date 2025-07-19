"use client"

import { useState, useRef, useEffect } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog"
import Image from "next/image"
import Link from "next/link"
import { Search, Plus, Trash2, Filter, ScrollText } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Card } from "@/components/ui/card"
import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"
import { UnidadeSelect } from "@/components/ui/UnidadeSelect"
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

import { useAuth } from "@/hooks/useAuth"
import { useRouter } from "next/navigation"
export default function Unidades() {
  // ...existing code...
  const [isTermoDialogOpen, setIsTermoDialogOpen] = useState(false);
  const [selectedUnidadeId, setSelectedUnidadeId] = useState<number | null>(null);
  const [acsList, setAcsList] = useState<any[]>([]);
  const [isLoadingTermos, setIsLoadingTermos] = useState(false);
  const [downloadStatus, setDownloadStatus] = useState<string>("");
  const [unidadeSearchTerm, setUnidadeSearchTerm] = useState("");
  const { user, isLoading } = useAuth();
  const [searchTerm, setSearchTerm] = useState("")
  // Debug: log user and loading state (must be after useAuth)
  useEffect(() => {
    if (typeof window !== "undefined") {
      // eslint-disable-next-line no-console
      console.log("[Unidades] user:", user, "isLoading:", isLoading);
    }
  }, [user, isLoading]);
  const [showFilters, setShowFilters] = useState(false)
  const [regionalFilter, setRegionalFilter] = useState("")
  const [comTabletsFilter, setComTabletsFilter] = useState(false)
  const [semTabletsFilter, setSemTabletsFilter] = useState(false)
  const [unitToDelete, setUnitToDelete] = useState<number | null>(null)
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)
  const [unidades, setUnidades] = useState<Unidade[]>([])
  const tableRef = useRef<HTMLDivElement>(null)
  const { toast } = useToast()
  const router = useRouter();

  // Restrict page to admin only: show styled message, do not redirect
  // This effect is no longer needed, as we want to show a styled message, not redirect

  useEffect(() => {
    if (isLoading || !user) return;
    api.get("/unidades")
      .then((res: any) => {
        if (Array.isArray(res.data)) {
          const data = res.data.map((u: any) => ({
            id: u.idUnidade || u.id || 0,
            nome: u.nomeUnidade || u.nome || "",
            regional: u.regional || "",
            qtdTablets: u.tabletsCount ?? 0,
          }))
          setUnidades(data);
        } else {
          setUnidades([]);
          toast({
            title: "Erro de autenticação",
            description: res.data?.error || "Token não enviado. Faça login novamente.",
            variant: "destructive",
          });
        }
      })
      .catch((err: any) => {
        let errorMsg = "Ocorreu um erro inesperado. Tente novamente.";
        if (err && typeof err === "object") {
          if ("response" in err && err.response && typeof err.response === "object") {
            if (err.response.data && typeof err.response.data.error === "string") {
              errorMsg = err.response.data.error;
            }
            if (err.response.status === 403) {
              errorMsg = "Apenas administradores podem acessar a página de unidades.";
            }
          } else if ("message" in err && typeof err.message === "string") {
            errorMsg = err.message;
          }
        } else if (typeof err === "string") {
          errorMsg = err;
        }
        toast({
          title: errorMsg.toLowerCase().includes("admin") ? "Acesso restrito" : "Erro ao carregar unidades",
          description: errorMsg,
          variant: "destructive",
        });
      });
  }, [isLoading, user, toast]);
  // Listas únicas para os filtros
  const safeUnidades = Array.isArray(unidades) ? unidades : [];
  const regionais = [...new Set(safeUnidades.map((unidade) => unidade.regional))]

  const filteredUnidades = Array.isArray(safeUnidades)
    ? safeUnidades.filter((unidade: Unidade) => {
        // Filtro de busca
        const searchMatch =
          searchTerm === "" ||
          unidade.nome.toLowerCase().includes(searchTerm.toLowerCase()) ||
          String(unidade.regional || "").toLowerCase().includes(searchTerm.toLowerCase());

        // Filtros de dropdown
        const regionalMatch = regionalFilter === "" || unidade.regional === regionalFilter;

        // Filtros de checkbox
        const comTabletsMatch = !comTabletsFilter || unidade.qtdTablets > 0;
        const semTabletsMatch = !semTabletsFilter || unidade.qtdTablets === 0;

        return searchMatch && regionalMatch && comTabletsMatch && semTabletsMatch;
      })
    : [];

  // Limpar filtros
  const clearFilters = (): void => {
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
      setUnidades((prev) => Array.isArray(prev) ? prev.filter((u) => u.id !== unitToDelete) : [])
    } catch (err) {
      let errorMsg = "Ocorreu um erro inesperado. Tente novamente.";
      if (err && typeof err === "object") {
        if ("response" in err && err.response && typeof err.response === "object") {
          const response = err.response as { data?: any; status?: number };
          if (response.data && typeof response.data.error === "string") {
            errorMsg = response.data.error;
          }
          if (response.status === 403) {
            errorMsg = "Apenas administradores podem excluir unidades.";
          }
        } else if ("message" in err && typeof err.message === "string") {
          errorMsg = err.message;
        }
      } else if (typeof err === "string") {
        errorMsg = err;
      }
      if (typeof errorMsg === "string" && errorMsg.toLowerCase().includes("admin")) {
        toast({
          title: "Acesso restrito",
          description: "Apenas administradores podem excluir unidades.",
          variant: "destructive",
        });
        router.replace("/");
      } else {
        toast({
          title: "Erro ao excluir unidade",
          description: errorMsg,
          variant: "destructive",
        });
      }
    }
    setIsDeleteDialogOpen(false)
    setUnitToDelete(null)
  }

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <span className="text-lg text-gray-500">Carregando...</span>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <span className="text-lg text-red-500">Token inválido ou usuário não autenticado.<br/>Faça login novamente.</span>
      </div>
    );
  }
  // Permitir login padrão visualizar unidades, mas não excluir

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Navbar currentPath="/unidades" />
      <main className="flex-1 relative">
        <div className="absolute inset-0 z-0">
          <Image src="/beach-background.jpg" alt="Fundo de praia" fill className="object-cover" priority />
        </div>
        <div className="relative z-10 container mx-auto py-6 px-4 max-w-6xl">
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
                    {/* Gerar Termos de Responsabilidade Button */}
                    <Button
                      className="rounded-full bg-gradient-to-r from-[#0948a7] to-[#298ed3] hover:from-[#083b8a] hover:to-[#1c7ab8] text-white"
                      onClick={() => setIsTermoDialogOpen(true)}
                    >
                      <ScrollText className="h-4 w-4 mr-2" />
                      Gerar Termos
                    </Button>
                  </div>
                </div>
              </div>
      {/* Termos de Responsabilidade Dialog */}
      <Dialog open={isTermoDialogOpen} onOpenChange={setIsTermoDialogOpen}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>Gerar Termos de Responsabilidade</DialogTitle>
            <DialogDescription>
              Selecione a unidade para gerar os termos para todos os ACS vinculados.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <UnidadeSelect
              unidades={unidades}
              value={selectedUnidadeId ? String(selectedUnidadeId) : ""}
              onValueChange={val => setSelectedUnidadeId(Number(val))}
              placeholder="Selecione a unidade"
              selectId="unidade-select"
            />
            {selectedUnidadeId && (
              <div className="flex flex-col items-center gap-3 mt-2">
                <Button
                  className="rounded-full bg-gradient-to-r from-[#0948a7] to-[#298ed3] hover:from-[#083b8a] hover:to-[#1c7ab8] text-white"
                  disabled={isLoadingTermos}
                  onClick={async () => {
                    setIsLoadingTermos(true);
                    setDownloadStatus("");
                    try {
                      // Fetch ACS users for unidade
                      const res = await api.get(`/usuarios?unidade=${selectedUnidadeId}`);
                      const acs = Array.isArray(res.data) ? res.data.filter((u: any) => u.nomeUser && u.nomeUser !== "Não Cadastrado") : [];
                      setAcsList(acs);
                      // Download all termos
                      let success = 0;
                      for (const user of acs) {
                        if (user.tablet && user.tablet.idTab) {
                          try {
                            let baseUrl = (api && api.defaults && api.defaults.baseURL) ? api.defaults.baseURL.replace(/\/$/, "") : "";
                            const url = `${baseUrl}/tablets/${user.tablet.idTab}/termo-responsabilidade`;
                            // Use fetch to include credentials/token
                            const token = localStorage.getItem('token');
                            const response = await fetch(url, {
                              method: 'GET',
                              headers: {
                                'Authorization': token ? `Bearer ${token}` : '',
                              },
                            });
                            if (!response.ok) throw new Error('Falha ao baixar termo');
                            const blob = await response.blob();
                            const contentDisposition = response.headers.get('content-disposition');
                            let filename = `termo_responsabilidade_${user.tablet.idTab}.docx`;
                            if (contentDisposition) {
                              const match = contentDisposition.match(/filename="?([^";]+)"?/);
                              if (match) filename = match[1];
                            }
                            const link = document.createElement('a');
                            link.href = window.URL.createObjectURL(blob);
                            link.download = filename;
                            document.body.appendChild(link);
                            link.click();
                            document.body.removeChild(link);
                            success++;
                          } catch (err) {
                            // Ignore individual errors
                          }
                        }
                      }
                      setDownloadStatus(`${success} termo(s) gerado(s) para ${acs.length} ACS.`);
                    } catch (err) {
                      setDownloadStatus("Erro ao buscar ACS ou gerar termos.");
                    }
                    setIsLoadingTermos(false);
                  }}
                >
                  {isLoadingTermos && (
                    <svg className="animate-spin h-5 w-5 mr-2 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z"></path>
                    </svg>
                  )}
                  Gerar termos para todos os ACS desta unidade
                </Button>
                {downloadStatus && (
                  <div className={`text-sm mt-2 px-3 py-2 rounded-lg font-medium shadow-sm ${downloadStatus.includes('Erro') ? 'bg-red-100 text-red-700' : 'bg-green-100 text-green-700'}`}>
                    {downloadStatus}
                  </div>
                )}
              </div>
            )}
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsTermoDialogOpen(false)}>Fechar</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

              {/* Filtros expandidos */}
              {showFilters && (
                <div className="bg-gray-50 p-4 rounded-xl border border-gray-200 animate-in fade-in duration-200">
                  <div className="mb-4 flex flex-wrap gap-4 items-center">
                    <span className="text-sm text-gray-700 font-medium">
                      Total de unidades: <span className="font-bold">{unidades.length}</span>
                    </span>
                    {filteredUnidades.length !== unidades.length && (
                      <span className="text-sm text-blue-700 font-medium">
                        Filtradas: <span className="font-bold">{filteredUnidades.length}</span>
                      </span>
                    )}
                  </div>
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
              <div ref={tableRef} className="max-h-[calc(100vh-280px)] overflow-y-auto scrollbar-hide">
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
                      filteredUnidades.map((unidade: Unidade) => (
                        <tr key={unidade.id} className="border-b border-gray-100 hover:bg-gray-50 transition-colors">
                          <td className="py-2 px-3 text-gray-800 font-medium">{unidade.nome}</td>
                          <td className="py-2 px-3 text-gray-800 text-sm">{unidade.regional}</td>
                          <td className="py-2 px-3">
                            <Badge
                              variant="outline"
                              className={
                                unidade.qtdTablets > 0
                                  ? "bg-blue-50 text-blue-600"
                                  : "bg-gray-200 text-gray-400"
                              }
                            >
                              {unidade.qtdTablets} {unidade.qtdTablets === 1 ? "tablet" : "tablets"}
                            </Badge>
                          </td>
                          <td className="py-2 px-3">
                            <div className="flex justify-center space-x-2">
                              {user?.role === "admin" && (
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  className="h-7 w-7 p-0 text-gray-600 hover:text-red-600 hover:bg-red-50"
                                  title="Excluir"
                                  onClick={() => handleDeleteUnit(unidade.id)}
                                >
                                  <Trash2 className="h-4 w-4" />
                                </Button>
                              )}
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
