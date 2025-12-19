'use client'

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Bell, Info, AlertTriangle, CheckCircle } from 'lucide-react'
import { useEffect, useState } from 'react'

interface Notification {
  id: string
  type: 'info' | 'warning' | 'success'
  title: string
  message: string
  date: string
}

export function NotificationsPanel() {
  const [notifications, setNotifications] = useState<Notification[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchNotifications() {
      try {
        const response = await fetch('/api/dashboard/notifications')
        if (response.ok) {
          const data = await response.json()
          setNotifications(data)
        }
      } catch (error) {
        console.error('[v0] Error fetching notifications:', error)
      } finally {
        setLoading(false)
      }
    }
    fetchNotifications()
  }, [])

  const getIcon = (type: string) => {
    switch (type) {
      case 'warning':
        return <AlertTriangle className="size-4 text-amber-600" />
      case 'success':
        return <CheckCircle className="size-4 text-green-600" />
      default:
        return <Info className="size-4 text-blue-600" />
    }
  }

  const getVariant = (type: string): "default" | "secondary" | "destructive" | "outline" => {
    switch (type) {
      case 'warning':
        return 'destructive'
      case 'success':
        return 'default'
      default:
        return 'secondary'
    }
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="flex items-center gap-2">
              <Bell className="size-5" />
              Notificações
            </CardTitle>
            <CardDescription>
              Mantenha-se atualizado sobre suas declarações
            </CardDescription>
          </div>
          {notifications.length > 0 && (
            <Badge variant="secondary">{notifications.length}</Badge>
          )}
        </div>
      </CardHeader>
      <CardContent>
        {loading ? (
          <div className="space-y-4">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="flex gap-3 pb-4 border-b last:border-0">
                <div className="size-4 bg-muted animate-pulse rounded-full mt-1" />
                <div className="flex-1 space-y-2">
                  <div className="h-4 w-3/4 bg-muted animate-pulse rounded" />
                  <div className="h-3 w-full bg-muted animate-pulse rounded" />
                </div>
              </div>
            ))}
          </div>
        ) : notifications.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">
            <Bell className="size-12 mx-auto mb-3 opacity-20" />
            <p className="text-sm">Nenhuma notificação no momento</p>
          </div>
        ) : (
          <div className="space-y-4">
            {notifications.map((notif) => (
              <div
                key={notif.id}
                className="flex gap-3 pb-4 border-b last:border-0 last:pb-0"
              >
                <div className="mt-1">{getIcon(notif.type)}</div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-2 mb-1">
                    <h4 className="font-medium text-sm">{notif.title}</h4>
                    <Badge variant={getVariant(notif.type)} className="text-xs shrink-0">
                      {notif.type === 'warning' ? 'Atenção' : notif.type === 'success' ? 'Sucesso' : 'Info'}
                    </Badge>
                  </div>
                  <p className="text-sm text-muted-foreground mb-1">{notif.message}</p>
                  <p className="text-xs text-muted-foreground">{notif.date}</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  )
}
