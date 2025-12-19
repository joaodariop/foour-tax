'use client'

import { useEffect, useState } from 'react'
import { useAdminAuth } from '@/lib/hooks/use-admin-auth'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import { Badge } from '@/components/ui/badge'
import { Bell, Plus, Trash2 } from 'lucide-react'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'

interface Notification {
  id: string
  title: string
  message: string
  type: string
  is_global: boolean
  created_at: string
}

export default function AdminNotificationsPage() {
  const { admin, loading: adminLoading } = useAdminAuth()
  const [notifications, setNotifications] = useState<Notification[]>([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [formData, setFormData] = useState({
    title: '',
    message: '',
    type: 'info',
    is_global: true,
  })

  useEffect(() => {
    const loadNotifications = async () => {
      if (!admin) return

      const response = await fetch('/api/admin/notifications')
      const data = await response.json()

      if (response.ok) {
        setNotifications(data || [])
      }

      setLoading(false)
    }

    if (admin) {
      loadNotifications()
    }
  }, [admin])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    const response = await fetch('/api/admin/notifications', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(formData),
    })

    if (response.ok) {
      const newNotification = await response.json()
      setNotifications([newNotification, ...notifications])
      setFormData({ title: '', message: '', type: 'info', is_global: true })
      setShowForm(false)
    }
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Tem certeza que deseja excluir esta notificação?')) return

    const response = await fetch(`/api/admin/notifications/${id}`, {
      method: 'DELETE',
    })

    if (response.ok) {
      setNotifications(notifications.filter(n => n.id !== id))
    }
  }

  if (adminLoading || !admin) {
    return null
  }

  const typeColors: Record<string, 'default' | 'secondary' | 'destructive'> = {
    info: 'default',
    warning: 'secondary',
    alert: 'destructive',
  }

  return (
    <main className="container mx-auto px-4 py-8">
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold mb-2">Gerenciar Notificações</h1>
          <p className="text-muted-foreground">
            Crie e gerencie notificações para os clientes
          </p>
        </div>
        <Button onClick={() => setShowForm(!showForm)}>
          <Plus className="mr-2 h-4 w-4" />
          Nova Notificação
        </Button>
      </div>

      {showForm && (
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Criar Notificação</CardTitle>
            <CardDescription>Envie uma notificação para todos os usuários</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <Label htmlFor="title">Título</Label>
                <Input
                  id="title"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  required
                />
              </div>

              <div>
                <Label htmlFor="message">Mensagem</Label>
                <Textarea
                  id="message"
                  value={formData.message}
                  onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                  rows={4}
                  required
                />
              </div>

              <div>
                <Label htmlFor="type">Tipo</Label>
                <Select
                  value={formData.type}
                  onValueChange={(value) => setFormData({ ...formData, type: value })}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="info">Informação</SelectItem>
                    <SelectItem value="warning">Aviso</SelectItem>
                    <SelectItem value="alert">Alerta</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="flex gap-2">
                <Button type="submit">Criar Notificação</Button>
                <Button type="button" variant="outline" onClick={() => setShowForm(false)}>
                  Cancelar
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      )}

      {loading ? (
        <p className="text-muted-foreground">Carregando notificações...</p>
      ) : notifications.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <Bell className="h-16 w-16 text-muted-foreground mb-4" />
            <p className="text-muted-foreground">Nenhuma notificação criada</p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4">
          {notifications.map(notification => (
            <Card key={notification.id}>
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="space-y-1">
                    <CardTitle className="text-lg">{notification.title}</CardTitle>
                    <CardDescription>{notification.message}</CardDescription>
                  </div>
                  <div className="flex gap-2">
                    <Badge variant={typeColors[notification.type]}>
                      {notification.type}
                    </Badge>
                    {notification.is_global && <Badge variant="outline">Global</Badge>}
                    <Button
                      size="icon"
                      variant="ghost"
                      onClick={() => handleDelete(notification.id)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  Criada em {new Date(notification.created_at).toLocaleString('pt-BR')}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </main>
  )
}
