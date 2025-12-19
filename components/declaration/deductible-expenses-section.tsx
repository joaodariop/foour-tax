'use client'

import { useState, useEffect } from 'react'
import { useAuth } from '@/lib/hooks/use-auth'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'

interface DeductibleExpense {
  id: string
  expense_type: string
  beneficiary_name: string
  beneficiary_cpf: string
  amount: number
  description: string
}

export function DeductibleExpensesSection() {
  const { user } = useAuth()
  const [expenses, setExpenses] = useState<DeductibleExpense[]>([])
  const [loading, setLoading] = useState(true)
  const [open, setOpen] = useState(false)

  const loadExpenses = async () => {
    if (!user?.id) return
    try {
      const res = await fetch('/api/declaration/deductible-expenses', {
        headers: { 'x-user-id': user.id }
      })
      const data = await res.json()
      setExpenses(data.expenses || [])
    } catch (error) {
      console.error('[v0] Error loading deductible expenses:', error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadExpenses()
  }, [user?.id])

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    if (!user?.id) return

    const formData = new FormData(e.currentTarget)
    const data = {
      expense_type: formData.get('expense_type'),
      beneficiary_name: formData.get('beneficiary_name'),
      beneficiary_cpf: formData.get('beneficiary_cpf'),
      amount: parseFloat(formData.get('amount') as string) || 0,
      description: formData.get('description'),
    }

    try {
      await fetch('/api/declaration/deductible-expenses', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'x-user-id': user.id },
        body: JSON.stringify(data)
      })
      loadExpenses()
      setOpen(false)
    } catch (error) {
      console.error('[v0] Error saving expense:', error)
    }
  }

  const handleDelete = async (id: string) => {
    if (!user?.id) return
    try {
      await fetch(`/api/declaration/deductible-expenses/${id}`, {
        method: 'DELETE',
        headers: { 'x-user-id': user.id }
      })
      loadExpenses()
    } catch (error) {
      console.error('[v0] Error deleting expense:', error)
    }
  }

  if (loading) return <div>Carregando...</div>

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-xl font-semibold">Pagamentos e Despesas Dedutíveis</h2>
          <p className="text-sm text-muted-foreground">
            Saúde, educação, pensão alimentícia, previdência privada e doações
          </p>
        </div>
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button>Adicionar Despesa</Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Nova Despesa Dedutível</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-4">
                <div>
                  <Label htmlFor="expense_type">Tipo de Despesa *</Label>
                  <Select name="expense_type" required>
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione o tipo" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="saude">Saúde</SelectItem>
                      <SelectItem value="educacao">Educação</SelectItem>
                      <SelectItem value="pensao">Pensão Alimentícia</SelectItem>
                      <SelectItem value="previdencia">Previdência Privada</SelectItem>
                      <SelectItem value="doacao">Doação</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="beneficiary_name">Nome do Beneficiário *</Label>
                  <Input id="beneficiary_name" name="beneficiary_name" required />
                </div>
                <div>
                  <Label htmlFor="beneficiary_cpf">CPF do Beneficiário *</Label>
                  <Input id="beneficiary_cpf" name="beneficiary_cpf" required placeholder="000.000.000-00" />
                </div>
                <div>
                  <Label htmlFor="amount">Valor Pago *</Label>
                  <Input id="amount" name="amount" type="number" step="0.01" required placeholder="0,00" />
                </div>
                <div>
                  <Label htmlFor="description">Descrição</Label>
                  <Input id="description" name="description" placeholder="Informações adicionais" />
                </div>
              </div>
              <div className="flex justify-end gap-2">
                <Button type="button" variant="outline" onClick={() => setOpen(false)}>Cancelar</Button>
                <Button type="submit">Salvar</Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid gap-4">
        {expenses.length === 0 ? (
          <Card>
            <CardContent className="py-8 text-center text-muted-foreground">
              Nenhuma despesa dedutível cadastrada
            </CardContent>
          </Card>
        ) : (
          expenses.map((expense) => (
            <Card key={expense.id}>
              <CardHeader>
                <div className="flex justify-between items-start">
                  <div>
                    <CardTitle className="text-lg">{expense.beneficiary_name}</CardTitle>
                    <CardDescription>{expense.expense_type} - CPF: {expense.beneficiary_cpf}</CardDescription>
                  </div>
                  <Button variant="ghost" size="sm" onClick={() => handleDelete(expense.id)}>Remover</Button>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <div>
                    <p className="text-muted-foreground text-sm">Valor Pago</p>
                    <p className="font-semibold">R$ {expense.amount.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</p>
                  </div>
                  {expense.description && (
                    <div>
                      <p className="text-muted-foreground text-sm">Descrição</p>
                      <p className="text-sm">{expense.description}</p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </div>
  )
}
