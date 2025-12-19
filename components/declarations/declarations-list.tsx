'use client'

import { useEffect, useState } from 'react'
import { useAuth } from '@/lib/hooks/use-auth'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Trash2, FileText, Eye } from 'lucide-react'
import { Alert, AlertDescription } from '@/components/ui/alert'

interface Declaration {
  id: string
  year: number
  status: string
  submission_date: string | null
  declaration_type: string | null
  total_income: number | null
  total_deductions: number | null
  tax_due: number | null
  receipt_number: string | null
  notes: string | null
  created_at: string
  updated_at: string
}

const statusLabels: Record<string, string> = {
  draft: 'Rascunho',
  in_progress: 'Em Preenchimento',
  submitted: 'Enviada',
  approved: 'Aprovada',
  rejected: 'Rejeitada',
}

const statusColors: Record<string, 'default' | 'secondary' | 'destructive' | 'outline'> = {
  draft: 'outline',
  in_progress: 'secondary',
  submitted: 'default',
  approved: 'default',
  rejected: 'destructive',
}

const typeLabels: Record<string, string> = {
  complete: 'Completa',
  simplified: 'Simplificada',
}

export function DeclarationsList() {
  const { user } = useAuth()
  const [declarations, setDeclarations] = useState<Declaration[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    const loadDeclarations = async () => {
      if (!user) return

      const response = await fetch('/api/declarations', {
        headers: {
          'x-user-id': user.id,
        },
      })
      const data = await response.json()

      if (!response.ok) {
        console.error('[v0] Error loading declarations:', data.error)
        setError('Erro ao carregar declarações')
      } else {
        setDeclarations(data || [])
      }

      setLoading(false)
    }

    loadDeclarations()
  }, [user])

  const handleDelete = async (id: string) => {
    if (!confirm('Tem certeza que deseja excluir esta declaração?')) return

    const response = await fetch(`/api/declarations/${id}`, {
      method: 'DELETE',
      headers: {
        'x-user-id': user?.id || '',
      },
    })

    if (!response.ok) {
      console.error('[v0] Error deleting declaration:', await response.json())
      alert('Erro ao excluir declaração')
    } else {
      setDeclarations(declarations.filter(d => d.id !== id))
    }
  }

  if (loading) {
    return <p className="text-muted-foreground">Carregando...</p>
  }

  if (error) {
    return (
      <Alert variant="destructive">
        <AlertDescription>{error}</AlertDescription>
      </Alert>
    )
  }

  if (declarations.length === 0) {
    return (
      <Card>
        <CardContent className="flex flex-col items-center justify-center py-12">
          <FileText className="h-16 w-16 text-muted-foreground mb-4" />
          <p className="text-muted-foreground mb-4">Você ainda não possui declarações</p>
          <p className="text-sm text-muted-foreground">
            Clique em "Nova Declaração" para começar
          </p>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
      {declarations.map(declaration => (
        <Card key={declaration.id} className="relative">
          <CardHeader>
            <div className="flex items-start justify-between">
              <div>
                <CardTitle className="text-2xl">IRPF {declaration.year}</CardTitle>
                <CardDescription className="mt-2 space-y-1">
                  <Badge variant={statusColors[declaration.status]}>
                    {statusLabels[declaration.status] || declaration.status}
                  </Badge>
                  {declaration.declaration_type && (
                    <Badge variant="outline" className="ml-2">
                      {typeLabels[declaration.declaration_type] || declaration.declaration_type}
                    </Badge>
                  )}
                </CardDescription>
              </div>
              <Button 
                variant="ghost" 
                size="icon" 
                onClick={() => handleDelete(declaration.id)}
                className="text-muted-foreground hover:text-destructive"
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          </CardHeader>
          <CardContent className="space-y-3">
            {declaration.total_income !== null && (
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Renda Total:</span>
                <span className="font-medium">
                  {new Intl.NumberFormat('pt-BR', {
                    style: 'currency',
                    currency: 'BRL',
                  }).format(declaration.total_income)}
                </span>
              </div>
            )}

            {declaration.total_deductions !== null && (
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Deduções:</span>
                <span className="font-medium">
                  {new Intl.NumberFormat('pt-BR', {
                    style: 'currency',
                    currency: 'BRL',
                  }).format(declaration.total_deductions)}
                </span>
              </div>
            )}

            {declaration.tax_due !== null && (
              <div className="flex justify-between text-sm pt-2 border-t">
                <span className="text-muted-foreground">Imposto Devido:</span>
                <span className="font-bold text-primary">
                  {new Intl.NumberFormat('pt-BR', {
                    style: 'currency',
                    currency: 'BRL',
                  }).format(declaration.tax_due)}
                </span>
              </div>
            )}

            {declaration.submission_date && (
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Data de Envio:</span>
                <span>
                  {new Date(declaration.submission_date).toLocaleDateString('pt-BR')}
                </span>
              </div>
            )}

            {declaration.receipt_number && (
              <div className="text-sm pt-2 border-t">
                <span className="text-muted-foreground">Recibo:</span>
                <p className="mt-1 font-mono text-xs">{declaration.receipt_number}</p>
              </div>
            )}

            {declaration.notes && (
              <div className="text-sm pt-2 border-t">
                <span className="text-muted-foreground">Observações:</span>
                <p className="mt-1 text-xs">{declaration.notes}</p>
              </div>
            )}

            <div className="pt-4">
              <Button className="w-full" variant="outline">
                <Eye className="mr-2 h-4 w-4" />
                Ver Detalhes
              </Button>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
