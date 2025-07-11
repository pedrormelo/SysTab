"use client"

import { useEffect, useState } from "react"
import Image from "next/image"
import Link from "next/link"
import { useParams } from "next/navigation"
import {
  ArrowLeft, Edit, Phone, Calendar, Smartphone, Building, MapPin, Plus, Eye, Printer
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Navbar } from "../../components/layout/navbar"
import { Footer } from "../../components/layout/footer"
import { useToast } from "@/hooks/use-toast"
import api from "@/lib/api"

export default function TabletDetails() {
  const { toast } = useToast()
  const params = useParams()
  const id = params?.id?.toString() || ""

  const [tablet, setTablet] = useState<any>(null)
  const [chamados, setChamados] = useState<any[]>([])

  useEffect(() => {
    if (!id) return

    api.get(`/tablets/${id}`)
      .then(res => setTablet(res.data))
      .catch(() => {
        toast({
          title: "Erro",
          description: "Falha ao carregar dados do tablet.",
          variant: "destructive"
        })
      })

    api.get(`/chamados/tablet/${id}`)
      .then(res => setChamados(res.data))
      .catch(() => {
        toast({
          title: "Erro",
          description: "Falha ao carregar chamados relacionados.",
          variant: "destructive"
        })
      })
  }, [id])

  const renderStatus = (chamado: any) => {
    let color = chamado.status === "Fechado"
      ? "bg-green-400"
      : chamado.diasAberto >= 7
      ? "bg-amber-400"
      : "bg-sky-400"

    return (
      <div className="flex items-center">
        <div className={`h-2.5 w-2.5 rounded-full ${color} mr-2`}></div>
        <span>{chamado.status}</span>
        {chamado.status === "Aberto" && chamado.diasAberto >= 7 && (
          <span className="text-xs text-red-500 ml-2">{chamado.diasAberto} dias</span>
        )}
      </div>
    )
  }

  if (!tablet) return null

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Navbar currentPath="/" />
      <main className="flex-1 relative">
        <div className="absolute inset-0 z-0">
          <Image src="/beach-background.jpg" alt="Fundo de praia" fill className="object-cover" priority />
        </div>
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
                  <span className="font-bold">Tablet #{id}</span>
                </h2>
              </div>
              <Link href={`/tablets/${id}/editar`}>
                <Button className="rounded-full bg-gradient-to-r from-[#0948a7] to-[#298ed3] text-white">
                  <Edit className="h-4 w-4 mr-2" />
                  Editar Tablet
                </Button>
              </Link>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <Card className="col-span-2">
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
                      <p className="font-medium">{tablet.idTomb}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">IMEI</p>
                      <p className="font-medium">{tablet.imei}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Empresa</p>
                      <p className="font-medium">{tablet.nomeEmp}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Unidade</p>
                      <p className="font-medium">{tablet.nomeUnidade}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Regional</p>
                      <p className="font-medium flex items-center">
                        <MapPin className="h-4 w-4 mr-1 text-gray-400" />
                        {tablet.numReg}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
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
                      <p className="font-medium">{tablet.nomeUser}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Telefone</p>
                      <p className="font-medium flex items-center">
                        <Phone className="h-4 w-4 mr-1 text-gray-400" />
                        {tablet.telUser || "Não informado"}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            <div className="mt-8">
              <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4 mb-4">
                <h3 className="text-xl font-medium text-gray-800">Chamados Relacionados</h3>
                <Link href={`/chamados/novo?tablet=${id}`}>
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
                        <th className="py-3 px-4 text-left">ID</th>
                        <th className="py-3 px-4 text-left">DATA ENTRADA</th>
                        <th className="py-3 px-4 text-left">DATA SAÍDA</th>
                        <th className="py-3 px-4 text-left">DESCRIÇÃO</th>
                        <th className="py-3 px-4 text-left">STATUS</th>
                        <th className="py-3 px-4 text-center">AÇÕES</th>
                      </tr>
                    </thead>
                    <tbody>
                      {[...chamados].sort((a, b) => {
                        // Prefer sort by dataEntrada (date) if available, else by idChamado
                        if (a.dataEntrada && b.dataEntrada) {
                          return new Date(b.dataEntrada).getTime() - new Date(a.dataEntrada).getTime();
                        }
                        return (b.idChamado || 0) - (a.idChamado || 0);
                      }).map((chamado) => (
                        <tr key={chamado.idChamado} className="border-b border-gray-100 hover:bg-gray-50">
                          <td className="py-3 px-4 text-blue-600 font-medium">
                            <Link href={`/chamados/${chamado.idChamado}`} className="hover:underline">
                              {chamado.idChamado}
                            </Link>
                          </td>
                          <td className="py-3 px-4">{chamado.dataEntrada}</td>
                          <td className="py-3 px-4">{chamado.dataSaida || "-"}</td>
                          <td className="py-3 px-4 max-w-[200px] truncate" title={chamado.descricao}>
                            {chamado.descricao}
                          </td>
                          <td className="py-3 px-4">{renderStatus(chamado)}</td>
                          <td className="py-3 px-4 text-center">
                            <div className="flex justify-center space-x-2">
                              <Link href={`/chamados/${chamado.idChamado}`}>
                                <Button variant="ghost" size="sm" className="h-7 w-7 p-0">
                                  <Eye className="h-4 w-4" />
                                </Button>
                              </Link>
                              <Button variant="ghost" size="sm" className="h-7 w-7 p-0">
                                <Printer className="h-4 w-4" />
                              </Button>
                            </div>
                          </td>
                        </tr>
                      ))}
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
