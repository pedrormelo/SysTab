"use client"

import Image from "next/image"
import { ExternalLink } from "lucide-react"
import { Card, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Navbar } from "../components/layout/navbar"
import { Footer } from "../components/layout/footer"
import { useToast } from "@/hooks/use-toast"

export default function OutrosSistemas() {
  const { toast } = useToast()

  // Dados de exemplo
  const sistemas = [
    {
      id: 1,
      nome: "Sistema de Prontuário Eletrônico",
      descricao: "Acesso ao prontuário eletrônico dos pacientes",
      url: "https://prontuario.saude.gov.br",
      icone: "📋",
    },
    {
      id: 2,
      nome: "Sistema de Agendamento",
      descricao: "Gerenciamento de consultas e agendamentos",
      url: "https://agendamento.saude.gov.br",
      icone: "📅",
    },
    {
      id: 3,
      nome: "Sistema de Estoque",
      descricao: "Controle de medicamentos e insumos",
      url: "https://estoque.saude.gov.br",
      icone: "📦",
    },
    {
      id: 4,
      nome: "Portal da Transparência",
      descricao: "Informações sobre gastos e investimentos",
      url: "https://transparencia.saude.gov.br",
      icone: "📊",
    },
    {
      id: 5,
      nome: "Sistema de Recursos Humanos",
      descricao: "Gerenciamento de funcionários e escalas",
      url: "https://rh.saude.gov.br",
      icone: "👥",
    },
    {
      id: 6,
      nome: "Painel de Indicadores",
      descricao: "Visualização de métricas e indicadores de saúde",
      url: "https://indicadores.saude.gov.br",
      icone: "📈",
    },
  ]

  const handleAccessSystem = (sistema: { nome: string; url: string }) => {
    toast({
      title: "Acessando sistema externo",
      description: `Redirecionando para ${sistema.nome}`,
      variant: "info",
    })
  }

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Navbar currentPath="/outros-sistemas" />

      {/* Main Content with Background Image */}
      <main className="flex-1 relative">
        {/* Background Image */}
        <div className="absolute inset-0 z-0">
          <Image src="/beach-background.jpg" alt="Fundo de praia" fill className="object-cover" priority />
        </div>

        {/* Content */}
        <div className="relative z-10 container mx-auto py-6 px-4 max-w-6xl">
          {/* Outros Sistemas Container */}
          <div className="bg-white/90 backdrop-blur-sm rounded-xl w-full p-6 shadow-xl border border-gray-100">
            <div className="mb-6">
              <h2 className="text-3xl font-light text-transparent bg-clip-text bg-gradient-to-r from-[#0948a7] to-[#298ed3] inline-block">
                <span className="font-bold">Outros Sistemas</span>{" "}
                <span className="text-gray-400 text-xl">| Integrações</span>
              </h2>
              <p className="text-gray-600 mt-2">Acesse outros sistemas da Secretaria de Saúde diretamente por aqui.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {sistemas.map((sistema) => (
                <Card
                  key={sistema.id}
                  className="bg-white text-gray-800 hover:shadow-lg transition-shadow border border-gray-100"
                >
                  <CardHeader className="pb-2">
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-xl font-medium">{sistema.nome}</CardTitle>
                      <span className="text-3xl">{sistema.icone}</span>
                    </div>
                    <CardDescription>{sistema.descricao}</CardDescription>
                  </CardHeader>
                  <CardFooter>
                    <a href={sistema.url} target="_blank" rel="noopener noreferrer" className="w-full">
                      <Button
                        className="w-full rounded-full bg-gradient-to-r from-[#0948a7] to-[#298ed3] hover:from-[#083b8a] hover:to-[#1c7ab8] text-white"
                        onClick={() => handleAccessSystem(sistema)}
                      >
                        <ExternalLink className="h-4 w-4 mr-2" />
                        Acessar
                      </Button>
                    </a>
                  </CardFooter>
                </Card>
              ))}
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  )
}
