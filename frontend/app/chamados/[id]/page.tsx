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
  RefreshCw,
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

export default function ChamadoDetails({ params }: { params: { id: string } }) {
  const [isClosing, setIsClosing] = useState(false)
  const [printDialogOpen, setPrintDialogOpen] = useState(false)
  const [chamado, setChamado] = useState<any>(null)
  const { toast } = useToast()
  // Adicionar estado para controlar o diálogo de confirmação para reabrir chamado
  const [isReopeningDialog, setIsReopeningDialog] = useState(false)

  // Dados de exemplo - simulando uma base de dados
  const chamadosData = [
    {
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
    },
    {
      id: 102,
      tabletId: 2,
      tombamento: "124.456",
      dataEntrada: "08/02/2025",
      dataSaida: null,
      descricao:
        "Bateria não carrega, mesmo com carregador original. Usuário tentou diferentes tomadas e carregadores, mas o tablet não responde.",
      status: "Aberto",
      usuario: "Maria Santos",
      telefone: "(81) 99999-8888",
      unidade: "USF PRAZERES",
      diasAberto: 5,
      itensRecebidos: "Tablet e Carregador",
    },
    {
      id: 100,
      tabletId: 3,
      tombamento: "125.789",
      dataEntrada: "05/02/2025",
      dataSaida: null,
      descricao:
        "Atualização de sistema operacional para Android 13. O tablet está lento e com problemas de compatibilidade com alguns aplicativos.",
      status: "Aberto",
      usuario: "Carlos Oliveira",
      telefone: "(81) 99999-7777",
      unidade: "USF CAVALEIRO",
      diasAberto: 8,
      itensRecebidos: "Tablet",
    },
    {
      id: 99,
      tabletId: 4,
      tombamento: "126.012",
      dataEntrada: "01/02/2025",
      dataSaida: "03/02/2025",
      descricao: "Troca de equipamento por modelo mais recente devido à obsolescência do hardware.",
      status: "Fechado",
      usuario: "Ana Pereira",
      telefone: "(81) 99999-6666",
      unidade: "USF MURIBECA",
      itensRecebidos: "Tablet, Carregador e Capinha",
      resolucao: "Equipamento substituído por um modelo mais recente. Configurações e dados transferidos com sucesso.",
    },
    {
      id: 98,
      tabletId: 1,
      tombamento: "123.123",
      dataEntrada: "25/01/2025",
      dataSaida: "26/01/2025",
      descricao: "Configuração de email institucional e aplicativos.",
      status: "Fechado",
      usuario: "João Silva",
      telefone: "(81) 99999-9999",
      unidade: "USF ALTO DOIS CARNEIROS",
      itensRecebidos: "Tablet",
      resolucao:
        "Email configurado e aplicativos instalados conforme solicitado. Realizado treinamento básico com o usuário.",
    },
    {
      id: 97,
      tabletId: 5,
      tombamento: "127.345",
      dataEntrada: "20/01/2025",
      dataSaida: "22/01/2025",
      descricao: "Problema com aplicativo de prontuário, travando constantemente.",
      status: "Fechado",
      usuario: "Paulo Mendes",
      telefone: "(81) 99999-5555",
      unidade: "USF JARDIM JORDÃO",
      itensRecebidos: "Tablet e Carregador",
      resolucao: "Aplicativo reinstalado e cache limpo. Problema resolvido após atualização do sistema operacional.",
    },
    {
      id: 96,
      tabletId: 6,
      tombamento: "128.678",
      dataEntrada: "15/01/2025",
      dataSaida: "16/01/2025",
      descricao: "Atualização de firmware e reinstalação do sistema.",
      status: "Fechado",
      usuario: "Fernanda Lima",
      telefone: "(81) 99999-4444",
      unidade: "USF BARRA DE JANGADA",
      itensRecebidos: "Tablet",
      resolucao: "Firmware atualizado e sistema reinstalado com sucesso. Todos os aplicativos configurados.",
    },
    {
      id: 95,
      tabletId: 7,
      tombamento: "129.901",
      dataEntrada: "10/01/2025",
      dataSaida: "12/01/2025",
      descricao: "Configuração inicial e instalação de aplicativos.",
      status: "Fechado",
      usuario: "Ricardo Souza",
      telefone: "(81) 99999-3333",
      unidade: "USF CAJUEIRO SECO",
      itensRecebidos: "Tablet e Carregador",
      resolucao: "Tablet configurado e todos os aplicativos necessários instalados conforme solicitado.",
    },
  ]

  // Carregar os dados do chamado com base no ID
  useEffect(() => {
    const chamadoId = Number.parseInt(params.id)
    const chamadoEncontrado = chamadosData.find((c) => c.id === chamadoId)

    if (chamadoEncontrado) {
      setChamado(chamadoEncontrado)
    } else {
      // Fallback para o primeiro chamado se não encontrar (apenas para demonstração)
      toast({
        title: "Chamado não encontrado",
        description: "O chamado solicitado não foi encontrado no sistema.",
        variant: "destructive",
      })
    }
  }, [params.id, toast])

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
    setIsClosing(true)
  }

  const handlePrintOS = (tipo: "entrega" | "devolucao") => {
    toast({
      title: `O.S. de ${tipo === "entrega" ? "Entrega" : "Devolução"} gerada`,
      description: `Documento para o chamado #${params.id} gerado com sucesso`,
      variant: "success",
    })
    setPrintDialogOpen(false)
  }

  if (!chamado) {
    return (
      <div className="min-h-screen flex flex-col bg-gray-50">
        <Navbar currentPath="/chamados" />
        <main className="flex-1 relative">
          <div className="absolute inset-0 z-0">
            <Image src="/beach-background.jpg" alt="Fundo de praia" fill className="object-cover" priority />
          </div>
          <div className="relative z-10 container mx-auto py-6 px-4 flex items-center justify-center h-full">
            <div className="bg-gradient-to-r from-[#0948a7] to-[#298ed3] rounded-xl p-8 shadow-xl border border-gray-100 text-center">
              <h2 className="text-xl font-medium text-white mb-2">Chamado não encontrado</h2>
              <p className="text-white/80 mb-4">O chamado solicitado não existe ou foi removido.</p>
              <Link href="/chamados">
                <Button className="rounded-full bg-white text-[#0948a7] hover:bg-gray-100">
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Voltar para Chamados
                </Button>
              </Link>
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
                {chamado.status === "Aberto" ? (
                  <Button
                    className="rounded-full bg-green-600 hover:bg-green-700 text-white"
                    size="sm"
                    onClick={handleCloseChamado}
                  >
                    <Save className="h-4 w-4 mr-2" />
                    Fechar Chamado
                  </Button>
                ) : (
                  <Button
                    className="rounded-full bg-blue-600 hover:bg-blue-700 text-white"
                    size="sm"
                    onClick={() => setIsReopeningDialog(true)}
                  >
                    <RefreshCw className="h-4 w-4 mr-2" />
                    Reabrir Chamado
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

                    {chamado.status === "Fechado" && <div></div>}
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
          <DialogFooter className="pt-4">
            <Button variant="outline" onClick={() => setIsClosing(false)} className="rounded-full border-gray-200">
              Cancelar
            </Button>
            <Button
              onClick={() => {
                toast({
                  title: "Chamado fechado com sucesso",
                  description: `O chamado #${params.id} foi fechado`,
                  variant: "success",
                })
                setIsClosing(false)
              }}
              className="rounded-full bg-green-600 hover:bg-green-700 text-white"
            >
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
      {/* Dialog para reabrir chamado */}
      <Dialog open={isReopeningDialog} onOpenChange={setIsReopeningDialog}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Reabrir Chamado</DialogTitle>
            <DialogDescription>
              Tem certeza que deseja reabrir este chamado? Isso irá alterar o status para "Aberto" novamente.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="pt-4">
            <Button
              variant="outline"
              onClick={() => setIsReopeningDialog(false)}
              className="rounded-full border-gray-200"
            >
              Cancelar
            </Button>
            <Button
              onClick={() => {
                toast({
                  title: "Chamado reaberto",
                  description: `O chamado #${params.id} foi reaberto com sucesso`,
                  variant: "success",
                })
                setIsReopeningDialog(false)
              }}
              className="rounded-full bg-blue-600 hover:bg-blue-700 text-white"
            >
              Reabrir Chamado
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
