"use client"

import { useState, useEffect } from "react"
import Image from "next/image"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { ArrowLeft, Save } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { UnidadeSelect } from "@/components/ui/UnidadeSelect"
import { Navbar } from "../../../components/layout/navbar"
import { Footer } from "../../../components/layout/footer"
import { useToast } from "@/hooks/use-toast"
import api from "@/lib/api"

export default function EditarUsuario({ params }: { params: { id: string } }) {
  const { toast } = useToast()
  const router = useRouter()

  const [nome, setNome] = useState("")
  const [cpf, setCpf] = useState("")
  const [telefone, setTelefone] = useState("")
  const [idUnidade, setIdUnidade] = useState("")
  const [unidades, setUnidades] = useState<any[]>([])

  useEffect(() => {
    api.get("/unidades")
      .then(res => {
        setUnidades(Array.isArray(res.data)
          ? res.data.map((u: any) => ({
              id: u.idUnidade || u.id || 0,
              nome: u.nomeUnidade || u.nome || ""
            }))
          : []);
      })
      .catch(() => toast({ title: "Erro", description: "Falha ao carregar unidades", variant: "destructive" }))

    api.get("/usuarios")
      .then((res) => {
        const usuario = res.data.find((u: any) => u.idUsuario == params.id || u.idUser == params.id || u.id == params.id)
        if (usuario) {
          setNome(usuario.nomeUser || usuario.nome || "")
          setCpf(usuario.cpf || "")
          setTelefone(usuario.telUser || usuario.telefone || "")
          setIdUnidade(String(usuario.idUnidade || usuario.unidadeId || usuario.idUnidade || ""))
        } else {
          toast({
            title: "Usuário não encontrado",
            description: "Não foi possível encontrar os dados para este ID.",
            variant: "destructive",
          })
          router.push("/usuarios")
        }
      })
      .catch(() => {
        toast({
          title: "Erro ao carregar dados",
          description: "Não foi possível obter os dados do usuário.",
          variant: "destructive",
        })
      })
  }, [params.id, toast, router])

  const formatCPF = (value: string) => {
    const digits = value.replace(/\D/g, "")
    if (digits.length <= 3) return digits
    if (digits.length <= 6) return `${digits.slice(0, 3)}.${digits.slice(3)}`
    if (digits.length <= 9) return `${digits.slice(0, 3)}.${digits.slice(3, 6)}.${digits.slice(6)}`
    return `${digits.slice(0, 3)}.${digits.slice(3, 6)}.${digits.slice(6, 9)}-${digits.slice(9, 11)}`
  }

  const formatTelefone = (value: string) => {
    const digits = value.replace(/\D/g, "")
    if (digits.length <= 2) return `(${digits}`
    if (digits.length <= 6) return `(${digits.slice(0, 2)}) ${digits.slice(2)}`
    if (digits.length <= 10) return `(${digits.slice(0, 2)}) ${digits.slice(2, 6)}-${digits.slice(6)}`
    return `(${digits.slice(0, 2)}) ${digits.slice(2, 7)}-${digits.slice(7, 11)}`
  }

  const handleCPFChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formatted = formatCPF(e.target.value)
    if (formatted.length <= 14) setCpf(formatted)
  }

  const handleTelefoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formatted = formatTelefone(e.target.value)
    if (formatted.length <= 15) setTelefone(formatted)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!nome || !cpf || !idUnidade) {
      toast({
        title: "Erro ao salvar",
        description: "Nome, CPF e Unidade são obrigatórios.",
        variant: "destructive",
      })
      return
    }

    if (cpf.length < 14) {
      toast({
        title: "CPF inválido",
        description: "Por favor, insira um CPF válido.",
        variant: "destructive",
      })
      return
    }

    try {
      await api.put(`/usuarios/${params.id}`, {
        nomeUser: nome,
        cpf,
        telUser: telefone,
        idUnidade
      })

      toast({
        title: "Usuário atualizado",
        description: `O usuário ${nome} foi atualizado com sucesso.`,
        variant: "success",
      })

      router.push("/usuarios")
    } catch {
      toast({
        title: "Erro ao atualizar usuário",
        description: "Não foi possível atualizar os dados do usuário.",
        variant: "destructive",
      })
    }
  }

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Navbar currentPath="/usuarios" />

      <main className="flex-1 relative">
        <div className="absolute inset-0 z-0">
          <Image src="/beach-background.jpg" alt="Fundo de praia" fill className="object-cover" priority />
        </div>

        <div className="relative z-10 container mx-auto py-6 px-4 max-w-3xl">
          <div className="bg-white/90 backdrop-blur-sm rounded-xl w-full p-6 shadow-xl border border-gray-100">
            <div className="flex items-center mb-6">
              <Link href="/usuarios">
                <Button variant="outline" size="sm" className="rounded-full border-gray-200 hover:bg-gray-100 mr-4">
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Voltar
                </Button>
              </Link>
              <h2 className="text-3xl font-light text-transparent bg-clip-text bg-gradient-to-r from-[#0948a7] to-[#298ed3] inline-block">
                <span className="font-bold">Editar Usuário #{params.id}</span>
              </h2>
            </div>

            <Card className="border border-gray-100 shadow-md">
              <CardHeader className="bg-gradient-to-r from-[#0948a7] to-[#298ed3] text-white rounded-t-lg">
                <CardTitle className="text-xl">Informações do Usuário</CardTitle>
              </CardHeader>
              <CardContent className="p-6">
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <Label htmlFor="nome" className="text-gray-700">
                        Nome Completo <span className="text-red-500">*</span>
                      </Label>
                      <Input
                        id="nome"
                        placeholder="Ex: João Silva"
                        value={nome}
                        onChange={(e) => setNome(e.target.value)}
                        className="border-gray-200"
                        required
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="cpf" className="text-gray-700">
                        CPF <span className="text-red-500">*</span>
                      </Label>
                      <Input
                        id="cpf"
                        placeholder="000.000.000-00"
                        value={cpf}
                        onChange={handleCPFChange}
                        className="border-gray-200"
                        required
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="telefone" className="text-gray-700">
                        Telefone
                      </Label>
                      <Input
                        id="telefone"
                        placeholder="(00) 00000-0000"
                        value={telefone}
                        onChange={handleTelefoneChange}
                        className="border-gray-200"
                      />
                    </div>

                    <div className="space-y-2">
                      <UnidadeSelect
                        unidades={unidades}
                        value={idUnidade}
                        onValueChange={setIdUnidade}
                        placeholder="Selecione a unidade"
                        label={"Unidade"}
                        selectId="unidade"
                        required
                      />
                    </div>
                  </div>

                  <div className="pt-4">
                    <Button
                      type="submit"
                      className="w-full rounded-full bg-gradient-to-r from-[#0948a7] to-[#298ed3] hover:from-[#083b8a] hover:to-[#1c7ab8] text-white"
                    >
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
