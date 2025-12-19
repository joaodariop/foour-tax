'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { useAdminAuth } from '@/lib/hooks/use-admin-auth'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Button } from '@/components/ui/button'
import { Search, Mail, Calendar, Eye } from 'lucide-react'

interface User {
  id: string
  email: string
  full_name: string | null
  created_at: string
  profile?: {
    cpf: string | null
    phone: string | null
    cell_phone: string | null
  }
}

export default function AdminUsersPage() {
  const { admin, loading: adminLoading } = useAdminAuth()
  const router = useRouter()
  const [users, setUsers] = useState<User[]>([])
  const [filteredUsers, setFilteredUsers] = useState<User[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [searchTerm, setSearchTerm] = useState('')

  useEffect(() => {
    const loadUsers = async () => {
      if (!admin) return

      const response = await fetch('/api/admin/users')
      const data = await response.json()

      if (!response.ok) {
        console.error('[v0] Error loading users:', data.error)
        setError('Erro ao carregar usuários')
      } else {
        setUsers(data || [])
        setFilteredUsers(data || [])
      }

      setLoading(false)
    }

    if (admin) {
      loadUsers()
    }
  }, [admin])

  useEffect(() => {
    if (searchTerm.trim() === '') {
      setFilteredUsers(users)
    } else {
      const filtered = users.filter(user =>
        user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.full_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.profile?.cpf?.includes(searchTerm)
      )
      setFilteredUsers(filtered)
    }
  }, [searchTerm, users])

  if (adminLoading || !admin) {
    return null
  }

  return (
    <main className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Gerenciamento de Usuários</h1>
        <p className="text-muted-foreground">
          Visualize e gerencie todos os usuários da plataforma
        </p>
      </div>

      <div className="mb-6">
        <div className="relative max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Buscar por nome, email ou CPF..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-9"
          />
        </div>
      </div>

      {loading ? (
        <p className="text-muted-foreground">Carregando usuários...</p>
      ) : error ? (
        <Alert variant="destructive">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      ) : filteredUsers.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <p className="text-muted-foreground">
              {searchTerm ? 'Nenhum usuário encontrado' : 'Nenhum usuário cadastrado'}
            </p>
          </CardContent>
        </Card>
      ) : (
        <>
          <div className="grid gap-4">
            {filteredUsers.map(user => (
              <Card key={user.id}>
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="space-y-1">
                      <CardTitle className="text-lg">
                        {user.full_name || 'Nome não informado'}
                      </CardTitle>
                      <CardDescription className="flex items-center gap-2">
                        <Mail className="h-3 w-3" />
                        {user.email}
                      </CardDescription>
                    </div>
                    <div className="flex gap-2">
                      <Badge variant="outline">Usuário</Badge>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => router.push(`/admin/users/${user.id}`)}
                      >
                        <Eye className="h-4 w-4 mr-1" />
                        Ver Detalhes
                      </Button>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="grid gap-2 text-sm">
                    {user.profile?.cpf && (
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">CPF:</span>
                        <span>{user.profile.cpf}</span>
                      </div>
                    )}
                    {(user.profile?.phone || user.profile?.cell_phone) && (
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Telefone:</span>
                        <span>{user.profile?.cell_phone || user.profile?.phone}</span>
                      </div>
                    )}
                    <div className="flex justify-between items-center pt-2 border-t">
                      <div className="flex items-center gap-2 text-muted-foreground">
                        <Calendar className="h-3 w-3" />
                        <span>Cadastrado em {new Date(user.created_at).toLocaleDateString('pt-BR')}</span>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
          <p className="text-sm text-muted-foreground text-center mt-6">
            Mostrando {filteredUsers.length} de {users.length} usuários
          </p>
        </>
      )}
    </main>
  )
}
