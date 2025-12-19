'use client'

import { useEffect, useState } from 'react'
import { useAuth } from '@/lib/hooks/use-auth'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Trash2, Edit } from 'lucide-react'
import { Alert, AlertDescription } from '@/components/ui/alert'

interface Asset {
  id: string
  type: string
  description: string
  acquisition_date: string | null
  value: number
  status: string
  created_at: string
}

const assetTypeLabels: Record<string, string> = {
  real_estate: 'Imóvel',
  vehicle: 'Veículo',
  investment: 'Investimento',
  bank_account: 'Conta Bancária',
  crypto: 'Criptomoeda',
  other: 'Outro',
}

export function AssetsList() {
  const { user } = useAuth()
  const [assets, setAssets] = useState<Asset[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    const loadAssets = async () => {
      if (!user) return

      try {
        const response = await fetch('/api/assets', {
          headers: {
            'x-user-id': user.id
          }
        })
        const data = await response.json()

        if (!response.ok) {
          setError(data.error || 'Erro ao carregar bens')
        } else {
          setAssets(data.assets || [])
        }
      } catch (err) {
        console.error('[v0] Error loading assets:', err)
        setError('Erro ao carregar bens')
      }

      setLoading(false)
    }

    loadAssets()
  }, [user])

  const handleDelete = async (id: string) => {
    if (!confirm('Tem certeza que deseja excluir este bem?')) return

    try {
      const response = await fetch(`/api/assets/${id}`, {
        method: 'DELETE',
        headers: {
          'x-user-id': user?.id || ''
        }
      })

      if (response.ok) {
        setAssets(assets.filter(a => a.id !== id))
      } else {
        alert('Erro ao excluir bem')
      }
    } catch (err) {
      console.error('[v0] Error deleting asset:', err)
      alert('Erro ao excluir bem')
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

  if (assets.length === 0) {
    return (
      <Card>
        <CardContent className="flex flex-col items-center justify-center py-12">
          <p className="text-muted-foreground mb-4">Você ainda não cadastrou nenhum bem</p>
          <p className="text-sm text-muted-foreground">
            Clique em "Adicionar Bem" para começar
          </p>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="grid gap-4 md:grid-cols-2">
      {assets.map(asset => (
        <Card key={asset.id}>
          <CardHeader>
            <div className="flex items-start justify-between">
              <div>
                <CardTitle className="text-lg">{asset.description}</CardTitle>
                <CardDescription>
                  <Badge variant="secondary" className="mt-1">
                    {assetTypeLabels[asset.type] || asset.type}
                  </Badge>
                </CardDescription>
              </div>
              <div className="flex gap-2">
                <Button variant="ghost" size="icon" onClick={() => handleDelete(asset.id)}>
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-2">
            {asset.value && (
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Valor:</span>
                <span className="font-medium">
                  {new Intl.NumberFormat('pt-BR', {
                    style: 'currency',
                    currency: 'BRL',
                  }).format(asset.value)}
                </span>
              </div>
            )}
            {asset.acquisition_date && (
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Data de Aquisição:</span>
                <span>
                  {new Date(asset.acquisition_date).toLocaleDateString('pt-BR')}
                </span>
              </div>
            )}
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
