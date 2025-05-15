"use client"

import type React from "react"
import { Bell, Check, CheckCheck, Trash2, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import { type Notification, useNotifications } from "@/contexts/notification-context"
import { formatDistanceToNow } from "date-fns"
import { ptBR } from "date-fns/locale"

export const NotificationPanel: React.FC<{ onClose: () => void }> = ({ onClose }) => {
  const { notifications, unreadCount, markAsRead, markAllAsRead, removeNotification, clearAllNotifications } =
    useNotifications()

  // Função para formatar a data relativa (ex: "há 5 minutos")
  const formatRelativeTime = (date: Date) => {
    return formatDistanceToNow(date, { addSuffix: true, locale: ptBR })
  }

  // Função para obter a cor de fundo baseada no tipo de notificação
  const getNotificationColor = (type: Notification["type"]) => {
    switch (type) {
      case "success":
        return "bg-green-50 border-green-200"
      case "error":
        return "bg-red-50 border-red-200"
      case "warning":
        return "bg-amber-50 border-amber-200"
      case "info":
      default:
        return "bg-blue-50 border-blue-200"
    }
  }

  // Função para obter o ícone baseado no tipo de notificação
  const getNotificationIcon = (type: Notification["type"]) => {
    switch (type) {
      case "success":
        return <div className="h-2 w-2 rounded-full bg-green-500"></div>
      case "error":
        return <div className="h-2 w-2 rounded-full bg-red-500"></div>
      case "warning":
        return <div className="h-2 w-2 rounded-full bg-amber-500"></div>
      case "info":
      default:
        return <div className="h-2 w-2 rounded-full bg-blue-500"></div>
    }
  }

  return (
    <div className="absolute top-full right-0 mt-2 w-80 sm:w-96 bg-white rounded-lg shadow-lg border border-gray-200 z-50 overflow-hidden">
      <div className="bg-gradient-to-r from-[#0948a7] to-[#298ed3] text-white p-3">
        <div className="flex justify-between items-center">
          <h3 className="font-medium flex items-center">
            <Bell className="h-4 w-4 mr-2" />
            Notificações
            {unreadCount > 0 && (
              <span className="ml-2 bg-white text-blue-600 text-xs rounded-full h-5 min-w-5 flex items-center justify-center px-1">
                {unreadCount}
              </span>
            )}
          </h3>
          <div className="flex items-center space-x-1">
            {unreadCount > 0 && (
              <Button
                variant="ghost"
                size="sm"
                className="h-7 w-7 p-0 text-white hover:bg-white/20 rounded-full"
                onClick={markAllAsRead}
                title="Marcar todas como lidas"
              >
                <CheckCheck className="h-4 w-4" />
              </Button>
            )}
            {notifications.length > 0 && (
              <Button
                variant="ghost"
                size="sm"
                className="h-7 w-7 p-0 text-white hover:bg-white/20 rounded-full"
                onClick={clearAllNotifications}
                title="Limpar todas"
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            )}
            <Button
              variant="ghost"
              size="sm"
              className="h-7 w-7 p-0 text-white hover:bg-white/20 rounded-full"
              onClick={onClose}
              title="Fechar"
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>

      <ScrollArea className="max-h-[400px] overflow-y-auto">
        {notifications.length === 0 ? (
          <div className="p-6 text-center text-gray-500">
            <Bell className="h-10 w-10 mx-auto mb-2 text-gray-300" />
            <p>Nenhuma notificação</p>
          </div>
        ) : (
          <div className="divide-y divide-gray-100">
            {notifications.map((notification) => (
              <div
                key={notification.id}
                className={`p-3 relative ${notification.read ? "bg-white" : getNotificationColor(notification.type)}`}
              >
                <div className="flex justify-between items-start">
                  <div className="flex items-start space-x-3">
                    <div className="mt-1">{getNotificationIcon(notification.type)}</div>
                    <div>
                      <h4 className="text-sm font-medium">{notification.title}</h4>
                      <p className="text-xs text-gray-600 mt-0.5">{notification.message}</p>
                      <p className="text-xs text-gray-400 mt-1">{formatRelativeTime(notification.timestamp)}</p>
                    </div>
                  </div>
                  <div className="flex space-x-1">
                    {!notification.read && (
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-6 w-6 p-0 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-full"
                        onClick={() => markAsRead(notification.id)}
                        title="Marcar como lida"
                      >
                        <Check className="h-3 w-3" />
                      </Button>
                    )}
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-6 w-6 p-0 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-full"
                      onClick={() => removeNotification(notification.id)}
                      title="Remover"
                    >
                      <X className="h-3 w-3" />
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </ScrollArea>
    </div>
  )
}
