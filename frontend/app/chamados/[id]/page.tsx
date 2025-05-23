"use client"

import { useState } from "react"
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
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Textarea } from "@/components/ui/textarea"
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

export default function ChamadoDetails({ params }: { params: { id: string } }) {
  const [resolucao, setResolucao] = useState("")
  const [isClosing, setIsClosing] = useState(false)
  const [printDialogOpen, setPrintDialogOpen] = useState(false)
  const { toast } = useToast()

  // Dados de exemplo
  const chamado = {
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

  // Função para renderizar o status com a bolinha colorida
  const renderStatus = () => {
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
    if (!resolucao.trim()) {
      toast({
        title: "Erro ao fechar chamado",
        description: "É necessário informar a resolução do chamado",
        variant: "destructive",
      })
      return
    }

    toast({
      title: "Chamado fechado com sucesso",
      description: `O chamado #${params.id} foi fechado`,
      variant: "success",
    })
    setIsClosing(false)
  }

  const handlePrintOS = (tipo: "entrega" | "devolucao") => {
    toast({
      title: `O.S. de ${tipo === "entrega" ? "Entrega" : "Devolução"} gerada`,
      description: `Documento para o chamado #${params.id} gerado com sucesso`,
      variant: "success",
    })
    setPrintDialogOpen(false)
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
                  className="rounded-full border-gray-200 hover:bg-gray-100"
                  onClick={() => setPrintDialogOpen(true)}
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
                          {chamado.dataEntrada}
                        </p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-500">Data de Saída</p>
                        <p className="font-medium flex items-center">
                          <Calendar className="h-4 w-4 mr-1 text-gray-400" />
                          {chamado.dataSaida || "Não finalizado"}
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

                    {chamado.status === "Fechado" && (
                      <div>
                        <p className="text-sm text-gray-500">Resolução</p>
                        <p className="mt-1 text-gray-800 bg-gray-50 p-3 rounded-lg border border-gray-100">
                          Problema resolvido com a substituição da tela. Equipamento testado e funcionando normalmente.
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
            <DialogDescription>Informe a resolução do chamado para finalizá-lo</DialogDescription>
          </DialogHeader>
          <div className="py-4">
            <Textarea
              placeholder="Descreva como o problema foi resolvido..."
              className="min-h-[120px]"
              value={resolucao}
              onChange={(e) => setResolucao(e.target.value)}
            />
          </div>
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
              Selecione o tipo de O.S. que deseja gerar para o chamado #{params.id}
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
