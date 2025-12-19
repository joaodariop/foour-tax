'use client'

import { useEffect, useState } from 'react'
import { useAuth } from '@/lib/hooks/use-auth'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Trash2 } from 'lucide-react'
import { Alert, AlertDescription } from '@/components/ui/alert'

interface Debt {
  id: string
  debt_type: string
  creditor: string
  description: string | null
  original_amount: number | null
  current_balance: number | null
  interest_rate: number | null
  start_date: string | null
  monthly_payment: number | null
  status: string
  created_at: string
}

const debtTypeLabels: Record<string, string> = {
  mortgage: 'Financiamento Imobiliário',
  car_loan: 'Financiamento Veículo',
  personal_loan: 'Empréstimo Pessoal',
  credit_card: 'Cartão de Crédito',
  student_loan: 'Empréstimo Estudantil',
  other: 'Outro',
}

export function DebtsList() {
  const { user } = useAuth()
  const [debts, setDebts] = useState<Debt[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    const loadDebts = async () => {
      if (!user) return

      const response = await fetch('/api/debts', {
        headers: {
          'x-user-id': user.id
        }
      })
      const data = await response.json()

      if (!response.ok) {
        console.error('[v0] Error loading debts:', data.error)
        setError('Erro ao carregar dívidas')
      } else {
        setDebts(data.debts || [])
      }

      setLoading(false)
    }

    loadDebts()
  }, [user])

  const handleDelete = async (id: string) => {
    if (!confirm('Tem certeza que deseja excluir esta dívida?')) return

    const response = await fetch(`/api/debts/${id}`, {
      method: 'DELETE',
      headers: {
        'x-user-id': user?.id || ''
      }
    })

    if (!response.ok) {
      console.error('[v0] Error deleting debt:', await response.json())
      alert('Erro ao excluir dívida')
    } else {
      setDebts(debts.filter(d => d.id !== id))
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

  if (debts.length === 0) {
    return (
      <Card>
        <CardContent className="flex flex-col items-center justify-center py-12">
          <p className="text-muted-foreground mb-4">Você ainda não cadastrou nenhuma dívida</p>
          <p className="text-sm text-muted-foreground">
            Clique em "Adicionar Dívida" para começar
          </p>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="grid gap-4 md:grid-cols-2">
      {debts.map(debt => (
        <Card key={debt.id}>
          <CardHeader>
            <div className="flex items-start justify-between">
              <div>
                <CardTitle className="text-lg">{debt.creditor}</CardTitle>
                <CardDescription>
                  <Badge variant="secondary" className="mt-1">
                    {debtTypeLabels[debt.debt_type] || debt.debt_type}
                  </Badge>
                </CardDescription>
              </div>
              <Button variant="ghost" size="icon" onClick={() => handleDelete(debt.id)}>
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          </CardHeader>
          <CardContent className="space-y-2">
            {debt.description && (
              <p className="text-sm text-muted-foreground">{debt.description}</p>
            )}
            {debt.original_amount && (
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Valor Original:</span>
                <span className="font-medium">
                  {new Intl.NumberFormat('pt-BR', {
                    style: 'currency',
                    currency: 'BRL',
                  }).format(debt.original_amount)}
                </span>
              </div>
            )}
            {debt.current_balance && (
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Saldo Atual:</span>
                <span className="font-medium text-destructive">
                  {new Intl.NumberFormat('pt-BR', {
                    style: 'currency',
                    currency: 'BRL',
                  }).format(debt.current_balance)}
                </span>
              </div>
            )}
            {debt.monthly_payment && (
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Parcela Mensal:</span>
                <span>
                  {new Intl.NumberFormat('pt-BR', {
                    style: 'currency',
                    currency: 'BRL',
                  }).format(debt.monthly_payment)}
                </span>
              </div>
            )}
            {debt.interest_rate && (
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Taxa de Juros:</span>
                <span>{debt.interest_rate}% a.a.</span>
              </div>
            )}
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
