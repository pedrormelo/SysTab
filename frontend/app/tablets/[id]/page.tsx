"use client"

import { useState, useEffect } from "react"
import Image from "next/image"
import Link from "next/link"
import { ArrowLeft, Edit, Phone, Calendar, Smartphone, Building, MapPin, Plus, Eye, Printer } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Navbar } from "../../components/layout/navbar"
import { Footer } from "../../components/layout/footer"
import { useToast } from "@/hooks/use-toast"

export default function TabletDetails({ params }: { params: { id: string } }) {
  const { toast } = useToast()
  const [tablet, setTablet] = useState<any>(null)
  const [chamados, setChamados] = useState<any[]>([])

  // Dados de exemplo
  const tabletsData = [
    {
      id: 1,
      tombamento: "123.123",
      imei: "355637050806462",
      usuario: "João Silva",
      empresa: "EVEREST",
      unidade: "USF ALTO DOIS CARNEIROS",
      modelo: "Samsung Galaxy Tab A7",
      regional: "Regional 2",
      dataEntrega: "15/01/2025",
      telefoneUsuario: "(81) 99999-9999",
    },
    {
      id: 2,
      tombamento: "124.456",
      imei: "355637050806463",
      usuario: "Maria Santos",
      empresa: "EVEREST",
      unidade: "USF PRAZERES",
      modelo: "Samsung Galaxy Tab A7",
      regional: "Regional 1",
      dataEntrega: "20/01/2025",
      telefoneUsuario: "(81) 99999-8888",
    },
    {
      id: 3,
      tombamento: "125.789",
      imei: "355637050806464",
      usuario: "Carlos Oliveira",
      empresa: "EVEREST",
      unidade: "USF CAVALEIRO",
      modelo: "Samsung Galaxy Tab A7",
      regional: "Regional 3",
      dataEntrega: "25/01/2025",
      telefoneUsuario: "(81) 99999-7777",
    },
  ]

  const chamadosData = [
    {
      id: 101,
      tabletId: 1,
      dataEntrada: "10/02/2025",
      dataSaida: null,
      descricao: "Tela quebrada",
      status: "Aberto",
      itensRecebidos: ["Tablet", "Carregador", "Capa"],
      diasAberto: 3,
    },
    {
      id: 102,
      tabletId: 2,
      dataEntrada: "08/02/2025",
      dataSaida: null,
      descricao: "Bateria não carrega",
      status: "Aberto",
      itensRecebidos: ["Tablet", "Carregador"],
      diasAberto: 5,
    },
    {
      id: 100,
      tabletId: 3,
      dataEntrada: "05/02/2025",
      dataSaida: null,
      descricao: "Atualização de sistema",
      status: "Aberto",
      itensRecebidos: ["Tablet"],
      diasAberto: 8,
    },
    {
      id: 99,
      tabletId: 4,
      dataEntrada: "01/02/2025",
      dataSaida: "03/02/2025",
      descricao: "Troca de equipamento",
      status: "Fechado",
      itensRecebidos: ["Tablet", "Carregador", "Capa"],
    },
    {
      id: 98,
      tabletId: 1,
      dataEntrada: "25/01/2025",
      dataSaida: "26/01/2025",
      descricao: "Configuração de email",
      status: "Fechado",
      itensRecebidos: ["Tablet"],
    },
    {
      id: 97,
      tabletId: 2,
      dataEntrada: "20/01/2025",
      dataSaida: "22/01/2025",
      descricao: "Problema com aplicativo",
      status: "Fechado",
      itensRecebidos: ["Tablet", "Carregador"],
    },
    {
      id: 96,
      tabletId: 3,
      dataEntrada: "15/01/2025",
      dataSaida: "16/01/2025",
      descricao: "Atualização de firmware",
      status: "Fechado",
      itensRecebidos: ["Tablet"],
    },
  ]

  // Carregar dados do tablet e chamados relacionados
  useEffect(() => {
    try {
      const tabletId = Number.parseInt(params.id)

      // Verificar se o ID é um número válido
      if (isNaN(tabletId)) {
        toast({
          title: "ID inválido",
          description: "O ID do tablet fornecido não é válido.",
          variant: "destructive",
        })
        return
      }

      // Buscar tablet pelo ID - Garantir que estamos usando todos os tablets disponíveis
      const tabletEncontrado = tabletsData.find((t) => t.id === tabletId)

      if (tabletEncontrado) {
        setTablet(tabletEncontrado)

        // Buscar chamados relacionados a este tablet
        const chamadosRelacionados = chamadosData.filter((c) => c.tabletId === tabletId)
        setChamados(chamadosRelacionados)
      } else {
        console.error(
          `Tablet com ID ${tabletId} não encontrado. Tablets disponíveis:`,
          tabletsData.map((t) => t.id),
        )
        toast({
          title: "Tablet não encontrado",
          description: `O tablet #${tabletId} não foi encontrado no sistema.`,
          variant: "destructive",
        })
      }
    } catch (error) {
      console.error("Erro ao carregar dados do tablet:", error)
      toast({
        title: "Erro ao carregar dados",
        description: "Ocorreu um erro ao carregar os dados do tablet.",
        variant: "destructive",
      })
    }
  }, [params.id, toast])

  // Função para renderizar o status com a bolinha colorida
  const renderStatus = (chamado: any) => {
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

  if (!tablet) {
    return (
      <div className="min-h-screen flex flex-col bg-gray-50">
        <Navbar currentPath="/" />
        <main className="flex-1 relative">
          <div className="absolute inset-0 z-0">
            <Image src="/beach-background.jpg" alt="Fundo de praia" fill className="object-cover" priority />
          </div>
          <div className="relative z-10 container mx-auto py-6 px-4 flex items-center justify-center h-full">
            <div className="bg-gradient-to-r from-[#0948a7] to-[#298ed3] rounded-xl p-8 shadow-xl border border-gray-100 text-center">
              <h2 className="text-xl font-medium text-white mb-2">Tablet não encontrado</h2>
              <p className="text-white/80 mb-4">O tablet solicitado não existe ou foi removido.</p>
              <Link href="/">
                <Button className="rounded-full bg-white text-[#0948a7] hover:bg-gray-100">
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Voltar para Tablets
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
      <Navbar currentPath="/" />

      {/* Main Content with Background Image */}
      <main className="flex-1 relative">
        {/* Background Image */}
        <div className="absolute inset-0 z-0">
          <Image src="/beach-background.jpg" alt="Fundo de praia" fill className="object-cover" priority />
        </div>

        {/* Content */}
        <div className="relative z-10 container mx-auto py-6 px-4">
          <div className="bg-white/90 backdrop-blur-sm rounded-xl w-full p-6 shadow-xl border border-gray-100">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
              <div className="flex items-center gap-4">
                <Link href="/">
                  <Button variant="outline" size="sm" className="rounded-full border-gray-200 hover:bg-gray-100">
                    <ArrowLeft className="h-4 w-4 mr-2" />
                    Voltar
                  </Button>
                </Link>
                <h2 className="text-3xl font-light text-transparent bg-clip-text bg-gradient-to-r from-[#0948a7] to-[#298ed3] inline-block">
                  <span className="font-bold">Tablet #{params.id}</span>
                </h2>
              </div>
              <div>
                <Link href={`/tablets/${params.id}/editar`}>
                  <Button className="rounded-full bg-gradient-to-r from-[#0948a7] to-[#298ed3] hover:from-[#083b8a] hover:to-[#1c7ab8] text-white">
                    <Edit className="h-4 w-4 mr-2" />
                    Editar Tablet
                  </Button>
                </Link>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Informações do Tablet */}
              <Card className="col-span-2 bg-white shadow-md border border-gray-100">
                <CardHeader className="bg-gradient-to-r from-[#0948a7] to-[#298ed3] text-white rounded-t-lg">
                  <CardTitle className="text-xl flex items-center">
                    <Smartphone className="h-5 w-5 mr-2" />
                    Informações do Tablet
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-6">
                  <div className="grid grid-cols-3 gap-4">
                    <div>
                      <p className="text-sm text-gray-500">Tombamento</p>
                      <p className="font-medium">{tablet.tombamento}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">IMEI</p>
                      <p className="font-medium">{tablet.imei}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Modelo</p>
                      <p className="font-medium">{tablet.modelo}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Data de Entrega</p>
                      <p className="font-medium flex items-center">
                        <Calendar className="h-4 w-4 mr-1 text-gray-400" />
                        {tablet.dataEntrega}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Empresa</p>
                      <p className="font-medium">{tablet.empresa}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Regional</p>
                      <p className="font-medium flex items-center">
                        <MapPin className="h-4 w-4 mr-1 text-gray-400" />
                        {tablet.regional}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Informações do Usuário */}
              <Card className="bg-white shadow-md border border-gray-100">
                <CardHeader className="bg-gradient-to-r from-[#0948a7] to-[#298ed3] text-white rounded-t-lg">
                  <CardTitle className="text-xl flex items-center">
                    <Building className="h-5 w-5 mr-2" />
                    Usuário Associado
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-6">
                  <div className="space-y-4">
                    <div>
                      <p className="text-sm text-gray-500">Nome</p>
                      <p className="font-medium">{tablet.usuario}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Telefone</p>
                      <p className="font-medium flex items-center">
                        <Phone className="h-4 w-4 mr-1 text-gray-400" />
                        {tablet.telefoneUsuario}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Unidade</p>
                      <p className="font-medium flex items-center">
                        <Building className="h-4 w-4 mr-1 text-gray-400" />
                        {tablet.unidade}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Chamados Relacionados */}
            <div className="mt-8">
              <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4 mb-4">
                <h3 className="text-xl font-medium text-gray-800">Chamados Relacionados</h3>
                <Link href={`/novo-chamado?tablet=${params.id}`}>
                  <Button className="rounded-full bg-green-600 hover:bg-green-700 text-white">
                    <Plus className="h-4 w-4 mr-2" />
                    Abrir Chamado
                  </Button>
                </Link>
              </div>

              <Card className="bg-white rounded-xl overflow-hidden shadow-md border border-gray-100">
                <div className="max-h-[300px] overflow-y-auto">
                  <table className="w-full">
                    <thead className="bg-gradient-to-r from-[#0948a7] to-[#298ed3] text-white sticky top-0">
                      <tr>
                        <th className="py-3 px-4 text-left font-medium">ID</th>
                        <th className="py-3 px-4 text-left font-medium">DATA ENTRADA</th>
                        <th className="py-3 px-4 text-left font-medium">DATA SAÍDA</th>
                        <th className="py-3 px-4 text-left font-medium">DESCRIÇÃO</th>
                        <th className="py-3 px-4 text-left font-medium">STATUS</th>
                        <th className="py-3 px-4 text-center font-medium">AÇÕES</th>
                      </tr>
                    </thead>
                    <tbody>
                      {chamados.length > 0 ? (
                        chamados.map((chamado) => (
                          <tr key={chamado.id} className="border-b border-gray-100 hover:bg-gray-50 transition-colors">
                            <td className="py-3 px-4 text-blue-600 font-medium">
                              <Link href={`/chamados/${chamado.id}`} className="hover:underline">
                                {chamado.id}
                              </Link>
                            </td>
                            <td className="py-3 px-4 text-gray-800">
                              <div className="flex items-center">
                                <Calendar className="h-4 w-4 mr-1 text-gray-400" />
                                {chamado.dataEntrada}
                              </div>
                            </td>
                            <td className="py-3 px-4 text-gray-800">
                              {chamado.dataSaida ? (
                                <div className="flex items-center">
                                  <Calendar className="h-4 w-4 mr-1 text-gray-400" />
                                  {chamado.dataSaida}
                                </div>
                              ) : (
                                <span className="text-gray-400">-</span>
                              )}
                            </td>
                            <td className="py-3 px-4 text-gray-800 max-w-[200px] truncate" title={chamado.descricao}>
                              {chamado.descricao}
                            </td>
                            <td className="py-3 px-4 text-gray-800">{renderStatus(chamado)}</td>
                            <td className="py-3 px-4">
                              <div className="flex justify-center space-x-2">
                                <Link href={`/chamados/${chamado.id}`}>
                                  <Button
                                    variant="ghost"
                                    size="sm"
                                    className="h-7 w-7 p-0 text-gray-600 hover:text-[#0948a7] hover:bg-blue-50"
                                    title="Visualizar"
                                  >
                                    <Eye className="h-4 w-4" />
                                  </Button>
                                </Link>
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  className="h-7 w-7 p-0 text-gray-600 hover:text-[#0948a7] hover:bg-blue-50"
                                  title="Imprimir O.S."
                                  onClick={() => {
                                    toast({
                                      title: "Gerando O.S.",
                                      description: `Documento para o chamado #${chamado.id}`,
                                      variant: "info",
                                    })
                                  }}
                                >
                                  <Printer className="h-4 w-4" />
                                </Button>
                              </div>
                            </td>
                          </tr>
                        ))
                      ) : (
                        <tr>
                          <td colSpan={6} className="py-8 text-center text-gray-500">
                            Nenhum chamado encontrado para este tablet.
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </Card>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  )
}
