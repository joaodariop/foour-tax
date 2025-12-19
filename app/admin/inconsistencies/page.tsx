'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { useAdminAuth } from '@/lib/hooks/use-admin-auth'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Alert, AlertDescription } from '@/components/ui/alert'
import Link from 'next/link'
import Image from 'next/image'
import { AlertTriangle } from 'lucide-react'

interface Inconsistency {
  id: string
  user_id: string
  declaration_id: string | null
  inconsistency_type: string
  description: string
  severity: string
  status: string
  created_at: string
}

const severityColors: Record<string, 'default' | 'secondary' | 'destructive' | 'outline'> = {
  low: 'secondary',
  medium: 'default',
  high: 'destructive',
  critical: 'destructive',
}

const statusLabels: Record<string, string> = {
  pending: 'Pendente',
  reviewed: 'Revisada',
  resolved: 'Resolvida',
  ignored: 'Ignorada',
}

export default function AdminInconsistenciesPage() {
  const { admin, loading: adminLoading } = useAdminAuth()
  const [inconsistencies, setInconsistencies] = useState<Inconsistency[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    const loadInconsistencies = async () => {
      if (!admin) return

      const response = await fetch('/api/admin/inconsistencies')
      const data = await response.json()

      if (response.status !== 200) {
        console.error('[v0] Error loading inconsistencies:', data.error)
        setError('Erro ao carregar inconsistências')
      } else {
        setInconsistencies(data.inconsistencies || [])
      }

      setLoading(false)
    }

    if (admin) {
      loadInconsistencies()
    }
  }, [admin])

  if (adminLoading || !admin) {
    return null
  }

  return (
    <div className="min-h-screen bg-background">
      <main className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Inconsistências Detectadas</h1>
          <p className="text-muted-foreground">
            Revise e resolva inconsistências nas declarações dos usuários
          </p>
        </div>

        {loading ? (
          <p className="text-muted-foreground">Carregando inconsistências...</p>
        ) : error ? (
          <Alert variant="destructive">
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        ) : inconsistencies.length === 0 ? (
          <Card>
            <CardContent className="flex flex-col items-center justify-center py-12">
              <AlertTriangle className="h-16 w-16 text-muted-foreground mb-4" />
              <p className="text-muted-foreground">Nenhuma inconsistência detectada</p>
            </CardContent>
          </Card>
        ) : (
          <div className="grid gap-4">
            {inconsistencies.map(inconsistency => (
              <Card key={inconsistency.id}>
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="space-y-1">
                      <CardTitle className="text-lg">{inconsistency.inconsistency_type}</CardTitle>
                      <CardDescription>{inconsistency.description}</CardDescription>
                    </div>
                    <div className="flex gap-2">
                      <Badge variant={severityColors[inconsistency.severity]}>
                        {inconsistency.severity.toUpperCase()}
                      </Badge>
                      <Badge variant="outline">
                        {statusLabels[inconsistency.status] || inconsistency.status}
                      </Badge>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">
                      Detectada em {new Date(inconsistency.created_at).toLocaleDateString('pt-BR')}
                    </span>
                    <Button size="sm" variant="outline">
                      Revisar
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </main>
    </div>
  )
}
