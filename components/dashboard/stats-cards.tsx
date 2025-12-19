'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Briefcase, Home, CreditCard, DollarSign } from 'lucide-react'
import { useEffect, useState } from 'react'
import { useAuth } from '@/lib/hooks/use-auth'

interface Stats {
  totalAssets: number
  totalDebts: number
  totalIncomes: number
  netWorth: number
}

export function StatsCards() {
  const { user } = useAuth()
  const [stats, setStats] = useState<Stats>({
    totalAssets: 0,
    totalDebts: 0,
    totalIncomes: 0,
    netWorth: 0,
  })
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchStats() {
      if (!user?.id) {
        setLoading(false)
        return
      }

      try {
        const response = await fetch('/api/dashboard/stats', {
          headers: { 'x-user-id': user.id }
        })
        if (response.ok) {
          const data = await response.json()
          console.log('[v0] Dashboard stats loaded:', data)
          setStats(data)
        } else {
          console.error('[v0] Failed to fetch stats:', response.statusText)
        }
      } catch (error) {
        console.error('[v0] Error fetching stats:', error)
      } finally {
        setLoading(false)
      }
    }
    fetchStats()
  }, [user?.id])

  const cards = [
    {
      title: 'Total de Bens',
      value: stats.totalAssets,
      icon: Home,
      description: 'Bens cadastrados',
      color: 'text-blue-600',
    },
    {
      title: 'Dívidas',
      value: stats.totalDebts,
      icon: CreditCard,
      description: 'Dívidas registradas',
      color: 'text-red-600',
    },
    {
      title: 'Rendimentos',
      value: stats.totalIncomes,
      icon: DollarSign,
      description: 'Fontes de renda',
      color: 'text-green-600',
    },
    {
      title: 'Patrimônio Líquido',
      value: `R$ ${stats.netWorth.toLocaleString('pt-BR')}`,
      icon: Briefcase,
      description: 'Valor estimado',
      color: 'text-purple-600',
    },
  ]

  if (loading) {
    return (
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {[...Array(4)].map((_, i) => (
          <Card key={i}>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <div className="h-4 w-24 bg-muted animate-pulse rounded" />
              <div className="size-10 bg-muted animate-pulse rounded" />
            </CardHeader>
            <CardContent>
              <div className="h-8 w-16 bg-muted animate-pulse rounded mb-2" />
              <div className="h-3 w-32 bg-muted animate-pulse rounded" />
            </CardContent>
          </Card>
        ))}
      </div>
    )
  }

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      {cards.map((card) => {
        const Icon = card.icon
        return (
          <Card key={card.title}>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">
                {card.title}
              </CardTitle>
              <Icon className={`size-4 ${card.color}`} />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{card.value}</div>
              <p className="text-xs text-muted-foreground mt-1">
                {card.description}
              </p>
            </CardContent>
          </Card>
        )
      })}
    </div>
  )
}
