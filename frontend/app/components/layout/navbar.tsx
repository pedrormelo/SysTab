"use client"

import { useState } from "react"
import Link from "next/link"
import { Bell, Tablet, FileText, Building2, Users, ExternalLink } from "lucide-react"
import { useNotifications } from "@/contexts/notification-context"
import { NotificationPanel } from "../notifications/notification-panel"

interface NavbarProps {
  currentPath: string
}

export function Navbar({ currentPath }: NavbarProps) {
  const { unreadCount } = useNotifications()
  const [showNotifications, setShowNotifications] = useState(false)

  const navItems = [
    { path: "/", icon: Tablet, label: "Tablets" },
    { path: "/chamados", icon: FileText, label: "Chamados" },
    { path: "/unidades", icon: Building2, label: "Unidades" },
    { path: "/usuarios", icon: Users, label: "Usuários" },
    { path: "/outros-sistemas", icon: ExternalLink, label: "Outros Sistemas" },
  ]

  const toggleNotifications = () => {
    setShowNotifications(!showNotifications)
  }

  return (
    <header className="bg-gradient-to-r from-[#0948a7] to-[#1c7ab8] text-white py-3 px-4 md:px-6 flex items-center justify-between shadow-md z-50 sticky top-0">
      <div className="flex items-center space-x-4 md:space-x-8">
        <Link href="/" className="text-2xl font-bold hover:opacity-90 transition-opacity">
          SysTAB
        </Link>

        <nav className="hidden md:flex items-center space-x-1 lg:space-x-6">
          {navItems.map((item) => (
            <Link
              key={item.path}
              href={item.path}
              className={`flex items-center space-x-2 font-medium px-3 py-2 rounded-lg transition-colors ${
                currentPath === item.path
                  ? "bg-white/20 text-white"
                  : "hover:bg-white/10 text-white/90 hover:text-white"
              }`}
            >
              <item.icon className="h-5 w-5" />
              <span className="hidden lg:inline">{item.label}</span>
            </Link>
          ))}
        </nav>
      </div>

      <div className="flex items-center">
        <div className="relative">
          <button
            className="p-1 relative hover:bg-white/10 rounded-full transition-colors"
            onClick={toggleNotifications}
            aria-label="Notificações"
          >
            <Bell className="h-6 w-6" />
            {unreadCount > 0 && (
              <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-4 w-4 flex items-center justify-center">
                {unreadCount > 9 ? "9+" : unreadCount}
              </span>
            )}
          </button>

          {showNotifications && <NotificationPanel onClose={() => setShowNotifications(false)} />}
        </div>
      </div>
    </header>
  )
}
