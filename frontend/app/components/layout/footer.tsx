import Image from "next/image"

export function Footer() {
  return (
    <div className="fixed bottom-6 right-6 z-20">
      <div className="group bg-gradient-to-r from-[#0948a7] to-[#1c7ab8] text-white p-3 rounded-2xl shadow-lg flex items-center space-x-4 hover:shadow-xl transition-all duration-500 ease-in-out hover:scale-105">
        <div className="text-xs max-w-0 group-hover:max-w-xs opacity-0 group-hover:opacity-100 transition-all duration-500 ease-in-out overflow-hidden whitespace-nowrap">
          <p>Gerenciador de Tablets do GETI da Sec. de Saúde</p>
          <p>Jaboatão dos Guararapes - Março de 2025 - Ver: 0.01</p>
          <p>
            Clique{" "}
            <a href="https://github.com/pedrormelo/SysTab" className="underline font-bold hover:text-blue-200 transition-colors">
              aqui
            </a>{" "}
            para saber mais do projeto.
          </p>
        </div>

        <div className="bg-white p-2 rounded-lg flex-shrink-0 transform transition-transform duration-500 ease-in-out group-hover:rotate-3 group-hover:scale-110">
          <Image src="/qr-code.svg" alt="QR Code" width={80} height={80} />
        </div>
      </div>
    </div>
  )
}
