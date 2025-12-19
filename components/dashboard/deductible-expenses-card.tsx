'use client'

import { useState, useEffect } from 'react'
import { useAuth } from '@/lib/hooks/use-auth'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import { Progress } from '@/components/ui/progress'
import Link from 'next/link'
import { Receipt, AlertCircle, TrendingUp } from 'lucide-react'

const DEDUCTIBLE_INFO = [
  { type: 'Saúde', description: 'Consultas, exames, planos de saúde, medicamentos com receita', limit: 'Sem limite' },
  { type: 'Educação', description: 'Educação infantil, ensino fundamental, médio e superior', limit: 'R$ 3.561,50 por pessoa' },
  { type: 'Pensão Alimentícia', description: 'Valores pagos conforme decisão judicial', limit: 'Sem limite' },
  { type: 'Previdência Privada', description: 'PGBL e fundos de pensão', limit: 'Até 12% da renda' },
  { type: 'Dependentes', description: 'R$ 2.275,08 por dependente', limit: 'R$ 2.275,08 cada' },
]

interface DeductibleExpense {
  expense_type: string
  amount: number
}

export function DeductibleExpensesCard() {
  const { user } = useAuth()
  const [expenses, setExpenses] = useState<DeductibleExpense[]>([])
  const [loading, setLoading] = useState(true)
  const [totalDeductible, setTotalDeductible] = useState(0)

  useEffect(() => {
    const loadExpenses = async () => {
      if (!user?.id) return
      try {
        const res = await fetch('/api/declaration/deductible-expenses', {
          headers: { 'x-user-id': user.id }
        })
        const data = await res.json()
        const expensesList = data.expenses || []
        setExpenses(expensesList)
        
        const total = expensesList.reduce((sum: number, exp: DeductibleExpense) => sum + exp.amount, 0)
        setTotalDeductible(total)
      } catch (error) {
        console.error('[v0] Error loading expenses:', error)
      } finally {
        setLoading(false)
      }
    }
    loadExpenses()
  }, [user?.id])

  const estimatedTaxSavings = totalDeductible * 0.275 // Estimativa de 27.5% de economia

  return (
    <Card className="border-primary/50 shadow-md">
      <CardHeader className="space-y-1">
        <div className="flex items-center justify-between">
          <CardTitle className="text-xl flex items-center gap-2">
            <Receipt className="size-5 text-primary" />
            Despesas Dedutíveis
          </CardTitle>
          <Button asChild size="sm">
            <Link href="/assets?category=expenses">
              Ver Todas
            </Link>
          </Button>
        </div>
        <CardDescription className="text-xs">
          Cadastre suas despesas e reduza o imposto a pagar
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-3">
        <Alert className="bg-primary/5 border-primary/20 py-2">
          <TrendingUp className="size-4" />
          <AlertTitle className="text-sm">Economize no seu imposto!</AlertTitle>
          <AlertDescription className="text-xs">
            Despesas dedutíveis podem reduzir significativamente o valor do seu IR.
          </AlertDescription>
        </Alert>

        <div className="grid gap-3 sm:grid-cols-2">
          <div className="rounded-lg border bg-card p-3">
            <p className="text-xs text-muted-foreground mb-0.5">Total Dedutível</p>
            <p className="text-xl font-bold text-primary">
              R$ {totalDeductible.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
            </p>
            <p className="text-xs text-muted-foreground mt-0.5">
              {expenses.length} {expenses.length === 1 ? 'despesa' : 'despesas'}
            </p>
          </div>
          <div className="rounded-lg border bg-card p-3">
            <p className="text-xs text-muted-foreground mb-0.5">Economia Estimada</p>
            <p className="text-xl font-bold text-green-600">
              R$ {estimatedTaxSavings.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
            </p>
            <p className="text-xs text-muted-foreground mt-0.5">
              Alíquota de 27,5%
            </p>
          </div>
        </div>

        <div className="space-y-2">
          <p className="text-xs font-medium flex items-center gap-1.5">
            <AlertCircle className="size-3.5" />
            O que você pode deduzir?
          </p>
          <div className="space-y-1.5 text-xs">
            {DEDUCTIBLE_INFO.slice(0, 3).map((info) => (
              <div key={info.type} className="rounded border p-2 hover:bg-muted/50 transition-colors">
                <div className="flex justify-between items-start mb-0.5">
                  <p className="font-medium text-xs">{info.type}</p>
                  <span className="text-[10px] bg-primary/10 text-primary px-1.5 py-0.5 rounded">
                    {info.limit}
                  </span>
                </div>
                <p className="text-[10px] text-muted-foreground leading-tight">{info.description}</p>
              </div>
            ))}
            <p className="text-[10px] text-muted-foreground text-center pt-1">
              + {DEDUCTIBLE_INFO.length - 3} outras categorias disponíveis
            </p>
          </div>
        </div>

        <Button asChild className="w-full" size="sm">
          <Link href="/assets?category=expenses">
            <Receipt className="mr-2 size-4" />
            Cadastrar Nova Despesa
          </Link>
        </Button>
      </CardContent>
    </Card>
  )
}
