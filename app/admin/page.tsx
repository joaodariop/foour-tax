'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { useRouter } from 'next/navigation'
import { Users, ShoppingBag, AlertTriangle, FileText, DollarSign, TrendingUp } from 'lucide-react'
import { useEffect, useState } from 'react'

interface AdminStats {
  users: number
  products: number
  declarations: number
  inconsistencies: number
  revenue: number
  completedDeclarations: number
}

export default function AdminDashboardPage() {
  const router = useRouter()
  const [stats, setStats] = useState<AdminStats | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchStats() {
      try {
        const response = await fetch('/api/admin/stats')
        if (response.ok) {
          const data = await response.json()
          setStats(data)
        }
      } catch (error) {
        console.error('[v0] Failed to fetch admin stats:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchStats()
  }, [])

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(value)
  }

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Painel Administrativo</h1>
        <p className="text-muted-foreground">
          Visão geral do sistema Foour
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Usuários</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {loading ? '...' : stats?.users || 0}
            </div>
            <p className="text-xs text-muted-foreground">
              Total de usuários cadastrados
            </p>
            <Button 
              variant="link" 
              className="px-0 mt-2"
              onClick={() => router.push('/admin/users')}
            >
              Gerenciar usuários
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Produtos</CardTitle>
            <ShoppingBag className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {loading ? '...' : stats?.products || 0}
            </div>
            <p className="text-xs text-muted-foreground">
              Produtos no marketplace
            </p>
            <Button 
              variant="link" 
              className="px-0 mt-2"
              onClick={() => router.push('/admin/products')}
            >
              Gerenciar produtos
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Declarações</CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {loading ? '...' : stats?.declarations || 0}
            </div>
            <p className="text-xs text-muted-foreground">
              Total de declarações
            </p>
            <Button 
              variant="link" 
              className="px-0 mt-2"
              onClick={() => router.push('/admin/declarations')}
            >
              Ver declarações
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Inconsistências</CardTitle>
            <AlertTriangle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {loading ? '...' : stats?.inconsistencies || 0}
            </div>
            <p className="text-xs text-muted-foreground">
              Pendentes de revisão
            </p>
            <Button 
              variant="link" 
              className="px-0 mt-2"
              onClick={() => router.push('/admin/inconsistencies')}
            >
              Ver inconsistências
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Receita Total</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {loading ? '...' : formatCurrency(stats?.revenue || 0)}
            </div>
            <p className="text-xs text-muted-foreground">
              De declarações finalizadas
            </p>
            <Button 
              variant="link" 
              className="px-0 mt-2"
              onClick={() => router.push('/admin/financial')}
            >
              Ver financeiro
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Declarações Finalizadas</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {loading ? '...' : stats?.completedDeclarations || 0}
            </div>
            <p className="text-xs text-muted-foreground">
              Concluídas com sucesso
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
