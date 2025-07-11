"use client"

import { useState, useEffect } from "react"
import Image from "next/image"
import Link from "next/link"
import {
  ArrowLeft,
  Edit,
  Calendar,
  Smartphone,
  Building2,
  Phone,
  Save,
  Printer,
  FileText,
  FileOutput,
  RotateCcw,
  Trash2,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Navbar } from "../../components/layout/navbar"
import { Footer } from "../../components/layout/footer"
import { useToast } from "@/hooks/use-toast"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import api from "@/lib/api"

export default function ChamadoDetails({ params }: { params: { id: string } }) {
  const [isClosing, setIsClosing] = useState(false)
  const [printDialogOpen, setPrintDialogOpen] = useState(false)
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [chamado, setChamado] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const { toast } = useToast()

  useEffect(() => {
    setLoading(true)
    api.get(`/chamados/id/${params.id}`)
      .then(res => {
        // Normalize fields for frontend usage
        const c = res.data
        setChamado({
          ...c,
          id: c.idChamado || c.id,
          tabletId: c.idTab,
          tombamento: c.tombamento || c.idTomb || c.idtombamento || c.tomb || "",
          usuario: c.nomeUser || c.usuario,
          telefone: c.telUser || c.telefone,
          unidade: c.nomeUnidade || c.unidade,
          itensRecebidos: c.item || c.itensRecebidos,
          dataEntrada: c.dataEntrada,
          dataSaida: c.dataSaida,
          status: c.status,
          descricao: c.descricao,
          diasAberto: c.diasAberto,
        })
        setLoading(false)
      })
      .catch(() => {
        toast({ title: "Erro", description: "Não foi possível carregar o chamado.", variant: "destructive" })
        setLoading(false)
      })
  }, [params.id])

  // Helper to format date as dd/mm/yyyy
  function formatDate(dateValue: any) {
    if (!dateValue) return "-"
    const date = new Date(dateValue)
    if (isNaN(date.getTime())) return "-"
    const day = String(date.getDate()).padStart(2, '0')
    const month = String(date.getMonth() + 1).padStart(2, '0')
    const year = date.getFullYear()
    return `${day}/${month}/${year}`
  }

  // Função para renderizar o status com a bolinha colorida
  const renderStatus = () => {
    if (!chamado) return null
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
        <div className={`h-3 w-3 rounded-full ${color} mr-2`}></div>
        <span>{chamado.status}</span>
        {chamado.status === "Aberto" && chamado.diasAberto && chamado.diasAberto >= 7 && (
          <span className="text-xs text-red-500 ml-2">{chamado.diasAberto} dias</span>
        )}
      </div>
    )
  }

  const handleCloseChamado = () => {
    api.patch(`/chamados/${params.id}/fechar`)
      .then(() => {
        toast({
          title: "Chamado fechado com sucesso",
          description: `O chamado #${params.id} foi fechado`,
          variant: "success",
        })
        setIsClosing(false)
        // Optionally, reload chamado data
        setLoading(true)
        api.get(`/chamados/id/${params.id}`).then(res => {
          const c = res.data
          setChamado({
            ...c,
            id: c.idChamado || c.id,
            tabletId: c.idTab,
            tombamento: c.tombamento || c.idTomb || c.idtombamento || c.tomb || "",
            usuario: c.nomeUser || c.usuario,
            telefone: c.telUser || c.telefone,
            unidade: c.nomeUnidade || c.unidade,
            itensRecebidos: c.item || c.itensRecebidos,
            dataEntrada: c.dataEntrada,
            dataSaida: c.dataSaida,
            status: c.status,
            descricao: c.descricao,
            diasAberto: c.diasAberto,
          })
          setLoading(false)
        })
      })
      .catch(() => {
        toast({
          title: "Erro ao fechar chamado",
          description: "Não foi possível fechar o chamado.",
          variant: "destructive",
        })
      })
  }

  // Função para baixar O.S. (entrega/devolucao)
  function downloadOS(tipo: "entrega" | "devolucao") {
    if (!chamado?.id) return;
    api.get(`/chamados/gerar-os/${chamado.id}/${tipo}`, { responseType: 'blob' })
      .then((res) => {
        const blob = res.data instanceof Blob ? res.data : new Blob([res.data]);
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = `OS_${tipo.toUpperCase()}_${chamado.id}.docx`;
        document.body.appendChild(a);
        a.click();
        a.remove();
        window.URL.revokeObjectURL(url);
      })
      .catch(() => {
        toast({
          title: "Erro ao gerar O.S.",
          description: "Não foi possível gerar a Ordem de Serviço.",
          variant: "destructive",
        });
      });
  }

  const handlePrintOS = (tipo: "entrega" | "devolucao") => {
    toast({
      title: `O.S. de ${tipo === "entrega" ? "Entrega" : "Devolução"} gerada`,
      description: `Documento para o chamado #${params.id} gerado com sucesso`,
      variant: "success",
    })
    setPrintDialogOpen(false)
  }

  const handleReabrirChamado = () => {
    api.patch(`/chamados/${params.id}/reabrir`)
      .then(() => {
        toast({
          title: "Chamado reaberto com sucesso",
          description: `O chamado #${params.id} foi reaberto`,
          variant: "success",
        })
        setLoading(true)
        api.get(`/chamados/id/${params.id}`).then(res => {
          const c = res.data
          setChamado({
            ...c,
            id: c.idChamado || c.id,
            tabletId: c.idTab,
            tombamento: c.tombamento || c.idTomb || c.idtombamento || c.tomb || "",
            usuario: c.nomeUser || c.usuario,
            telefone: c.telUser || c.telefone,
            unidade: c.nomeUnidade || c.unidade,
            itensRecebidos: c.item || c.itensRecebidos,
            dataEntrada: c.dataEntrada,
            dataSaida: c.dataSaida,
            status: c.status,
            descricao: c.descricao,
            diasAberto: c.diasAberto,
          })
          setLoading(false)
        })
      })
      .catch(() => {
        toast({
          title: "Erro ao reabrir chamado",
          description: "Não foi possível reabrir o chamado.",
          variant: "destructive",
        })
      })
  }

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col bg-gray-50">
        <Navbar currentPath="/chamados" />
        <main className="flex-1 flex items-center justify-center">
          <span className="text-gray-500 text-lg">Carregando chamado...</span>
        </main>
        <Footer />
      </div>
    )
  }

  if (!chamado) {
    return (
      <div className="min-h-screen flex flex-col bg-gray-50">
        <Navbar currentPath="/chamados" />
        <main className="flex-1 flex items-center justify-center">
          <span className="text-red-500 text-lg">Chamado não encontrado.</span>
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
        <div className="relative z-10 container mx-auto py-6 px-4 max-w-5xl">
          <div className="bg-white/90 backdrop-blur-sm rounded-xl w-full p-6 shadow-xl border border-gray-100">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
              <div className="flex items-center gap-4">
                <Link href="/chamados">
                  <Button variant="outline" size="sm" className="rounded-full border-gray-200 hover:bg-gray-100">
                    <ArrowLeft className="h-4 w-4 mr-2" />
                    Voltar
                  </Button>
                </Link>
                <h2 className="text-3xl font-light text-transparent bg-clip-text bg-gradient-to-r from-[#0948a7] to-[#298ed3] inline-block">
                  <span className="font-bold">Chamado #{params.id}</span>
                </h2>
                <div className="text-sm font-medium">{renderStatus()}</div>
              </div>
              <div className="flex flex-wrap gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  className="rounded-full border-gray-200 hover:bg-gray-100 flex items-center gap-2"
                  onClick={() => setPrintDialogOpen(true)}
                  title="Imprimir O.S."
                >
                  <Printer className="h-4 w-4 mr-2" />
                  Imprimir O.S.
                </Button>
                <Link href={`/chamados/${params.id}/editar`}>
                  <Button variant="outline" size="sm" className="rounded-full border-gray-200 hover:bg-gray-100">
                    <Edit className="h-4 w-4 mr-2" />
                    Editar
                  </Button>
                </Link>
                {chamado.status === "Aberto" && (
                  <Button
                    className="rounded-full bg-green-600 hover:bg-green-700 text-white"
                    size="sm"
                    onClick={() => setIsClosing(true)}
                  >
                    <Save className="h-4 w-4 mr-2" />
                    Fechar Chamado
                  </Button>
                )}
                {chamado.status === "Fechado" && (
                  <Button
                    className="rounded-full bg-green-600 hover:bg-green-700 text-white"
                    size="sm"
                    onClick={handleReabrirChamado}
                    title="Reabrir Chamado"
                  >
                    <RotateCcw className="h-4 w-4 mr-2" />
                    Reabrir Chamado
                  </Button>
                )}
                <Button
                  variant="outline"
                  size="sm"
                  className="rounded-full border-gray-200 hover:bg-red-100 hover:text-red-700 flex items-center justify-center p-2"
                  title="Excluir Chamado"
                  onClick={() => setDeleteDialogOpen(true)}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
      {/* Dialog para confirmação de exclusão */}
      <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Excluir Chamado</DialogTitle>
            <DialogDescription>Tem certeza que deseja excluir este chamado? Esta ação não pode ser desfeita.</DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDeleteDialogOpen(false)} className="rounded-full border-gray-200">
              Cancelar
            </Button>
            <Button
              onClick={async () => {
                try {
                  await api.delete(`/chamados/${params.id}`);
                  toast({
                    title: "Chamado excluído com sucesso!",
                    variant: "success",
                  });
                  window.location.href = "/chamados";
                } catch {
                  toast({
                    title: "Erro ao excluir chamado",
                    description: "Não foi possível excluir o chamado.",
                    variant: "destructive",
                  });
                }
              }}
              className="rounded-full bg-red-600 hover:bg-red-700 text-white"
            >
              Excluir
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Informações do Chamado */}
              <Card className="col-span-2 bg-white shadow-md border border-gray-100">
                <CardHeader className="bg-gradient-to-r from-[#0948a7] to-[#298ed3] text-white rounded-t-lg">
                  <CardTitle className="text-xl">Informações do Chamado</CardTitle>
                </CardHeader>
                <CardContent className="p-6">
                  <div className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <p className="text-sm text-gray-500">Data de Entrada</p>
                        <p className="font-medium flex items-center">
                          <Calendar className="h-4 w-4 mr-1 text-gray-400" />
                          {formatDate(chamado.dataEntrada)}
                        </p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-500">Data de Saída</p>
                        <p className="font-medium flex items-center">
                          <Calendar className="h-4 w-4 mr-1 text-gray-400" />
                          {chamado.dataSaida ? formatDate(chamado.dataSaida) : "Não finalizado"}
                        </p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-500">Itens Recebidos</p>
                        <p className="font-medium">{chamado.itensRecebidos}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-500">Tablet</p>
                        <Link
                          href={`/tablets/${chamado.tabletId}`}
                          className="font-medium flex items-center text-blue-600 hover:underline"
                        >
                          <Smartphone className="h-4 w-4 mr-1" />
                          {chamado.tombamento}
                        </Link>
                      </div>
                    </div>

                    <div>
                      <p className="text-sm text-gray-500">Descrição</p>
                      <p className="mt-1 text-gray-800 bg-gray-50 p-3 rounded-lg border border-gray-100">
                        {chamado.descricao}
                      </p>
                    </div>

                    {chamado.status === "Fechado" && chamado.resolucao && (
                      <div>
                        <p className="text-sm text-gray-500">Resolução</p>
                        <p className="mt-1 text-gray-800 bg-gray-50 p-3 rounded-lg border border-gray-100">
                          {chamado.resolucao}
                        </p>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>

              {/* Informações do Usuário */}
              <Card className="bg-white shadow-md border border-gray-100">
                <CardHeader className="bg-gradient-to-r from-[#0948a7] to-[#298ed3] text-white rounded-t-lg">
                  <CardTitle className="text-xl">Usuário</CardTitle>
                </CardHeader>
                <CardContent className="p-6">
                  <div className="space-y-4">
                    <div>
                      <p className="text-sm text-gray-500">Nome</p>
                      <p className="font-medium">{chamado.usuario}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Telefone</p>
                      <p className="font-medium flex items-center">
                        <Phone className="h-4 w-4 mr-1 text-gray-400" />
                        {chamado.telefone}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Unidade</p>
                      <p className="font-medium flex items-center">
                        <Building2 className="h-4 w-4 mr-1 text-gray-400" />
                        {chamado.unidade}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </main>

      <Footer />

      {/* Dialog para fechar chamado */}
      <Dialog open={isClosing} onOpenChange={setIsClosing}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Fechar Chamado</DialogTitle>
            <DialogDescription>Tem certeza que deseja fechar este chamado?</DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsClosing(false)} className="rounded-full border-gray-200">
              Cancelar
            </Button>
            <Button onClick={handleCloseChamado} className="rounded-full bg-green-600 hover:bg-green-700 text-white">
              Fechar Chamado
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Dialog para impressão de O.S. */}
      <Dialog open={printDialogOpen} onOpenChange={setPrintDialogOpen}>
        <DialogContent className="sm:max-w-md p-0 overflow-hidden">
          <DialogHeader className="bg-gradient-to-r from-[#0948a7] to-[#298ed3] text-white p-6 rounded-t-lg">
            <DialogTitle className="text-xl">Gerar Ordem de Serviço</DialogTitle>
            <DialogDescription className="text-white/90 mt-1">
              Selecione o tipo de O.S. que deseja gerar para o chamado #{chamado?.id}
            </DialogDescription>
          </DialogHeader>
          <div className="p-6">
            <div className="grid grid-cols-1 gap-4 py-4">
              <Button
                className="bg-gradient-to-r from-green-600 to-green-500 hover:from-green-700 hover:to-green-600 text-white h-16 rounded-xl flex items-center justify-start px-6 transition-all hover:scale-[1.02]"
                onClick={() => downloadOS("entrega")}
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
                onClick={() => downloadOS("devolucao")}
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
