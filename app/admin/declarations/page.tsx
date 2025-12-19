'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { useAdminAuth } from '@/lib/hooks/use-admin-auth'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Search, FileText, Eye } from 'lucide-react'

interface Declaration {
  id: string
  user_id: string
  year: number
  type: string
  status: string
  total_income: number
  total_assets: number
  receipt_number: string | null
  created_at: string
  user: {
    full_name: string
    email: string
  }
}

export default function AdminDeclarationsPage() {
  const { admin, loading: adminLoading } = useAdminAuth()
  const router = useRouter()
  const [declarations, setDeclarations] = useState<Declaration[]>([])
  const [filteredDeclarations, setFilteredDeclarations] = useState<Declaration[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')

  useEffect(() => {
    const loadDeclarations = async () => {
      if (!admin) return

      const response = await fetch('/api/admin/declarations')
      const data = await response.json()

      if (response.ok) {
        setDeclarations(data || [])
        setFilteredDeclarations(data || [])
      }

      setLoading(false)
    }

    if (admin) {
      loadDeclarations()
    }
  }, [admin])

  useEffect(() => {
    if (searchTerm.trim() === '') {
      setFilteredDeclarations(declarations)
    } else {
      const filtered = declarations.filter(dec =>
        dec.user.full_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        dec.user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        dec.year.toString().includes(searchTerm) ||
        dec.receipt_number?.includes(searchTerm)
      )
      setFilteredDeclarations(filtered)
    }
  }, [searchTerm, declarations])

  if (adminLoading || !admin) {
    return null
  }

  const statusColors: Record<string, 'default' | 'secondary' | 'outline'> = {
    draft: 'outline',
    submitted: 'default',
    processing: 'secondary',
    completed: 'default',
  }

  return (
    <main className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Declarações dos Clientes</h1>
        <p className="text-muted-foreground">
          Visualize e acompanhe todas as declarações de IRPF dos clientes
        </p>
      </div>

      <div className="mb-6">
        <div className="relative max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Buscar por nome, email, ano ou recibo..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-9"
          />
        </div>
      </div>

      {loading ? (
        <p className="text-muted-foreground">Carregando declarações...</p>
      ) : filteredDeclarations.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <FileText className="h-16 w-16 text-muted-foreground mb-4" />
            <p className="text-muted-foreground">
              {searchTerm ? 'Nenhuma declaração encontrada' : 'Nenhuma declaração cadastrada'}
            </p>
          </CardContent>
        </Card>
      ) : (
        <>
          <div className="grid gap-4">
            {filteredDeclarations.map(declaration => (
              <Card key={declaration.id}>
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="space-y-1">
                      <CardTitle className="text-lg flex items-center gap-2">
                        <FileText className="h-5 w-5" />
                        Declaração {declaration.year} - {declaration.user.full_name}
                      </CardTitle>
                      <CardDescription>{declaration.user.email}</CardDescription>
                    </div>
                    <div className="flex gap-2 items-center">
                      <Badge variant={statusColors[declaration.status] || 'outline'}>
                        {declaration.status}
                      </Badge>
                      <Badge variant="secondary">{declaration.type}</Badge>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4 text-sm">
                    <div>
                      <span className="text-muted-foreground">Total Rendimentos:</span>
                      <p className="font-medium">
                        {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(declaration.total_income || 0)}
                      </p>
                    </div>
                    <div>
                      <span className="text-muted-foreground">Total Bens:</span>
                      <p className="font-medium">
                        {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(declaration.total_assets || 0)}
                      </p>
                    </div>
                    <div>
                      <span className="text-muted-foreground">Recibo:</span>
                      <p className="font-medium">{declaration.receipt_number || '-'}</p>
                    </div>
                    <div>
                      <span className="text-muted-foreground">Criada em:</span>
                      <p className="font-medium">{new Date(declaration.created_at).toLocaleDateString('pt-BR')}</p>
                    </div>
                  </div>
                  <div className="flex justify-end">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => router.push(`/admin/users/${declaration.user_id}`)}
                    >
                      <Eye className="h-4 w-4 mr-1" />
                      Ver Cliente
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
          <p className="text-sm text-muted-foreground text-center mt-6">
            Mostrando {filteredDeclarations.length} de {declarations.length} declarações
          </p>
        </>
      )}
    </main>
  )
}
