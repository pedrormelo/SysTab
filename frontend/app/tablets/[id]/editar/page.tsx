"use client"

import { useEffect, useState } from "react"
import Image from "next/image"
import Link from "next/link"
import { useParams, useRouter } from "next/navigation"
import { ArrowLeft, Save } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Navbar } from "../../../components/layout/navbar"
import { Footer } from "../../../components/layout/footer"
import { useToast } from "@/hooks/use-toast"
import api from "@/lib/api"

export default function EditarTablet() {
  const { toast } = useToast()
  const params = useParams()
  const router = useRouter()
  const tabletId = params?.id as string

  const [tombamento, setTombamento] = useState("")
  const [imei, setImei] = useState("")
  const [idUser, setIdUser] = useState("")
  const [idEmp, setIdEmp] = useState("")
  const [idUnidade, setIdUnidade] = useState("")

  const [usuarios, setUsuarios] = useState<any[]>([])
  const [empresas, setEmpresas] = useState<any[]>([])
  const [unidades, setUnidades] = useState<any[]>([])

  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const carregarDados = async () => {
      try {
        const [usuariosRes, empresasRes, unidadesRes, tabletRes] = await Promise.all([
          api.get("/usuarios"),
          api.get("/empresas"),
          api.get("/unidades"),
          api.get(`/tablets/${tabletId}`),
        ])

        setUsuarios(usuariosRes.data)
        setEmpresas(empresasRes.data)
        setUnidades(unidadesRes.data)

        const tablet = tabletRes.data
        setTombamento(tablet.idTomb.toString().padStart(6, "0").replace(/^(\d{3})(\d{3})$/, "$1.$2"))
        setImei(tablet.imei)
        setIdUser(String(tablet.idUser))
        setIdEmp(String(tablet.idEmp))
        setIdUnidade(String(tablet.idUnidade))

        setIsLoading(false)
      } catch (error) {
        toast({ title: "Erro", description: "Erro ao carregar dados do tablet", variant: "destructive" })
      }
    }

    carregarDados()
  }, [tabletId])

  const formatIMEI = (value: string) => {
    return value.replace(/\D/g, "").substring(0, 15)
  }

  const handleIMEIChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setImei(formatIMEI(e.target.value))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!tombamento || !imei || !idUser || !idEmp || !idUnidade) {
      toast({ title: "Erro", description: "Preencha todos os campos obrigatórios", variant: "destructive" })
      return
    }

    if (imei.length !== 15) {
      toast({ title: "IMEI inválido", description: "O IMEI deve conter 15 dígitos", variant: "destructive" })
      return
    }

    try {
      await api.put(`/tablets/${tabletId}`, {
        idTomb: parseInt(tombamento.replace(/\D/g, "")),
        imei,
        idUser: parseInt(idUser),
        idEmp: parseInt(idEmp),
        idUnidade: parseInt(idUnidade),
      })

      toast({ title: "Tablet atualizado", description: `O tablet #${tabletId} foi atualizado com sucesso`, variant: "success" })
      router.push(`/tablets/${tabletId}`)
    } catch (error) {
      toast({ title: "Erro ao atualizar tablet", description: "Verifique os dados e tente novamente.", variant: "destructive" })
    }
  }

  const formatTombamento = (value: string) => {
    const digits = value.replace(/\D/g, "")
    if (digits.length <= 3) return digits
    return `${digits.slice(0, 3)}.${digits.slice(3, 6)}`
  }

  if (isLoading) return null

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Navbar currentPath="/" />
      <main className="flex-1 relative">
        <div className="absolute inset-0 z-0">
          <Image src="/beach-background.jpg" alt="Fundo de praia" fill className="object-cover" priority />
        </div>

        <div className="relative z-10 container mx-auto py-6 px-4 max-w-3xl">
          <div className="bg-white/90 backdrop-blur-sm rounded-xl w-full p-6 shadow-xl border border-gray-100">
            <div className="flex items-center mb-6">
              <Link href={`/tablets/${tabletId}`}>
                <Button variant="outline" size="sm" className="rounded-full border-gray-200 hover:bg-gray-100 mr-4">
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Voltar
                </Button>
              </Link>
              <h2 className="text-3xl font-light text-transparent bg-clip-text bg-gradient-to-r from-[#0948a7] to-[#298ed3] inline-block">
                <span className="font-bold">Editar Tablet #{tabletId}</span>
              </h2>
            </div>

            <Card className="border border-gray-100 shadow-md">
              <CardHeader className="bg-gradient-to-r from-[#0948a7] to-[#298ed3] text-white rounded-t-lg">
                <CardTitle className="text-xl">Informações do Tablet</CardTitle>
              </CardHeader>
              <CardContent className="p-6">
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <Label htmlFor="tombamento">Tombamento *</Label>
                      <Input id="tombamento" value={tombamento} onChange={(e) => setTombamento(formatTombamento(e.target.value))} />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="imei">IMEI *</Label>
                      <Input id="imei" value={imei} onChange={handleIMEIChange} />
                      <p className="text-xs text-gray-500">O IMEI deve conter 15 dígitos</p>
                    </div>

                    {empresas.length > 0 && idEmp && (
                      <div className="space-y-2">
                        <Label htmlFor="empresa">Empresa *</Label>
                        <Select value={idEmp} onValueChange={setIdEmp}>
                          <SelectTrigger id="empresa" className="border-gray-200">
                            <SelectValue placeholder="Selecione a empresa" />
                          </SelectTrigger>
                          <SelectContent>
                            {empresas.map(emp => (
                              <SelectItem key={emp.idEmp} value={String(emp.idEmp)}>{emp.nomeEmp}</SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                    )}

                    {usuarios.length > 0 && idUser && (
                      <div className="space-y-2">
                        <Label htmlFor="usuario">Usuário *</Label>
                        <Select value={idUser} onValueChange={setIdUser}>
                          <SelectTrigger id="usuario" className="border-gray-200">
                            <SelectValue placeholder="Selecione o usuário" />
                          </SelectTrigger>
                          <SelectContent>
                            {usuarios.map(user => (
                              <SelectItem key={user.idUser} value={String(user.idUser)}>{user.nomeUser}</SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                    )}

                    {unidades.length > 0 && idUnidade && (
                      <div className="space-y-2">
                        <Label htmlFor="unidade">Unidade *</Label>
                        <Select value={idUnidade} onValueChange={setIdUnidade}>
                          <SelectTrigger id="unidade" className="border-gray-200">
                            <SelectValue placeholder="Selecione a unidade" />
                          </SelectTrigger>
                          <SelectContent>
                            {unidades.map(unid => (
                              <SelectItem key={unid.idUnidade} value={String(unid.idUnidade)}>{unid.nomeUnidade}</SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                    )}
                  </div>

                  <div className="pt-4">
                    <Button type="submit" className="w-full rounded-full bg-gradient-to-r from-[#0948a7] to-[#298ed3] hover:from-[#083b8a] hover:to-[#1c7ab8] text-white">
                      <Save className="h-4 w-4 mr-2" />
                      Salvar Alterações
                    </Button>
                  </div>
                </form>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  )
}
