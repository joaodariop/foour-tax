'use client'

import { useEffect, useState } from 'react'
import { useAuth } from '@/lib/hooks/use-auth'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Trash2 } from 'lucide-react'
import { Alert, AlertDescription } from '@/components/ui/alert'

interface Income {
  id: string
  income_type: string
  source: string
  description: string | null
  amount: number | null
  frequency: string | null
  start_date: string | null
  status: string
  created_at: string
}

const incomeTypeLabels: Record<string, string> = {
  salary: 'Salário',
  freelance: 'Freelance',
  investment: 'Investimento',
  rental: 'Aluguel',
  pension: 'Pensão',
  business: 'Negócio Próprio',
  other: 'Outro',
}

const frequencyLabels: Record<string, string> = {
  monthly: 'Mensal',
  yearly: 'Anual',
  one_time: 'Único',
}

export function IncomesList() {
  const { user } = useAuth()
  const [incomes, setIncomes] = useState<Income[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    const loadIncomes = async () => {
      if (!user) return

      const response = await fetch('/api/incomes', {
        headers: {
          'x-user-id': user.id
        }
      })
      const data = await response.json()

      if (!response.ok) {
        console.error('[v0] Error loading incomes:', data.error)
        setError('Erro ao carregar rendimentos')
      } else {
        setIncomes(data.incomes || [])
      }

      setLoading(false)
    }

    loadIncomes()
  }, [user])

  const handleDelete = async (id: string) => {
    if (!confirm('Tem certeza que deseja excluir este rendimento?')) return

    const response = await fetch(`/api/incomes/${id}`, {
      method: 'DELETE',
      headers: {
        'x-user-id': user?.id || ''
      }
    })

    if (!response.ok) {
      console.error('[v0] Error deleting income:', await response.json())
      alert('Erro ao excluir rendimento')
    } else {
      setIncomes(incomes.filter(i => i.id !== id))
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

  if (incomes.length === 0) {
    return (
      <Card>
        <CardContent className="flex flex-col items-center justify-center py-12">
          <p className="text-muted-foreground mb-4">Você ainda não cadastrou nenhum rendimento</p>
          <p className="text-sm text-muted-foreground">
            Clique em "Adicionar Rendimento" para começar
          </p>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="grid gap-4 md:grid-cols-2">
      {incomes.map(income => (
        <Card key={income.id}>
          <CardHeader>
            <div className="flex items-start justify-between">
              <div>
                <CardTitle className="text-lg">{income.source}</CardTitle>
                <CardDescription>
                  <Badge variant="secondary" className="mt-1">
                    {incomeTypeLabels[income.income_type] || income.income_type}
                  </Badge>
                </CardDescription>
              </div>
              <Button variant="ghost" size="icon" onClick={() => handleDelete(income.id)}>
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          </CardHeader>
          <CardContent className="space-y-2">
            {income.description && (
              <p className="text-sm text-muted-foreground">{income.description}</p>
            )}
            {income.amount && (
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Valor:</span>
                <span className="font-medium text-primary">
                  {new Intl.NumberFormat('pt-BR', {
                    style: 'currency',
                    currency: 'BRL',
                  }).format(income.amount)}
                </span>
              </div>
            )}
            {income.frequency && (
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Frequência:</span>
                <span>{frequencyLabels[income.frequency] || income.frequency}</span>
              </div>
            )}
            {income.start_date && (
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Data de Início:</span>
                <span>
                  {new Date(income.start_date).toLocaleDateString('pt-BR')}
                </span>
              </div>
            )}
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
