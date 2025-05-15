"use client"

import type React from "react"
import { createContext, useContext, useState, useEffect } from "react"
import { toast } from "@/hooks/use-toast"

export type NotificationType = "success" | "error" | "info" | "warning"

export interface Notification {
  id: string
  title: string
  message: string
  type: NotificationType
  read: boolean
  timestamp: Date
}

interface NotificationContextType {
  notifications: Notification[]
  unreadCount: number
  addNotification: (notification: Omit<Notification, "id" | "read" | "timestamp">) => void
  markAsRead: (id: string) => void
  markAllAsRead: () => void
  removeNotification: (id: string) => void
  clearAllNotifications: () => void
}

const NotificationContext = createContext<NotificationContextType | undefined>(undefined)

export const useNotifications = () => {
  const context = useContext(NotificationContext)
  if (!context) {
    throw new Error("useNotifications must be used within a NotificationProvider")
  }
  return context
}

export const NotificationProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [notifications, setNotifications] = useState<Notification[]>([])
  const [unreadCount, setUnreadCount] = useState(0)

  // Carregar notificações do localStorage ao iniciar (se existirem)
  useEffect(() => {
    if (typeof window !== "undefined") {
      const savedNotifications = localStorage.getItem("systab_notifications")
      if (savedNotifications) {
        try {
          const parsedNotifications = JSON.parse(savedNotifications).map((notification: any) => ({
            ...notification,
            timestamp: new Date(notification.timestamp),
          }))
          setNotifications(parsedNotifications)
        } catch (error) {
          console.error("Erro ao carregar notificações:", error)
        }
      }
    }
  }, [])

  // Atualizar o contador de não lidas quando as notificações mudarem
  useEffect(() => {
    const count = notifications.filter((notification) => !notification.read).length
    setUnreadCount(count)

    // Salvar notificações no localStorage
    if (typeof window !== "undefined") {
      localStorage.setItem("systab_notifications", JSON.stringify(notifications))
    }
  }, [notifications])

  const addNotification = (notification: Omit<Notification, "id" | "read" | "timestamp">) => {
    const newNotification: Notification = {
      ...notification,
      id: Date.now().toString(),
      read: false,
      timestamp: new Date(),
    }

    setNotifications((prev) => [newNotification, ...prev])

    // Também exibir como toast para feedback imediato
    toast({
      title: notification.title,
      description: notification.message,
      variant: notification.type,
    })
  }

  const markAsRead = (id: string) => {
    setNotifications((prev) =>
      prev.map((notification) => (notification.id === id ? { ...notification, read: true } : notification)),
    )
  }

  const markAllAsRead = () => {
    setNotifications((prev) =>
      prev.map((notification) => ({
        ...notification,
        read: true,
      })),
    )
  }

  const removeNotification = (id: string) => {
    setNotifications((prev) => prev.filter((notification) => notification.id !== id))
  }

  const clearAllNotifications = () => {
    setNotifications([])
  }

  return (
    <NotificationContext.Provider
      value={{
        notifications,
        unreadCount,
        addNotification,
        markAsRead,
        markAllAsRead,
        removeNotification,
        clearAllNotifications,
      }}
    >
      {children}
    </NotificationContext.Provider>
  )
}
