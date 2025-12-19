'use client'

import { useState, useEffect } from 'react'
import { useAuth } from '@/lib/hooks/use-auth'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'

interface TaxExemptIncome {
  id: string
  income_type: string
  source_name: string
  amount: number
  description: string
}

export function TaxExemptIncomeSection() {
  const { user } = useAuth()
  const [incomes, setIncomes] = useState<TaxExemptIncome[]>([])
  const [loading, setLoading] = useState(true)
  const [open, setOpen] = useState(false)

  const loadIncomes = async () => {
    if (!user?.id) return
    try {
      const res = await fetch('/api/declaration/tax-exempt-income', {
        headers: { 'x-user-id': user.id }
      })
      const data = await res.json()
      setIncomes(data.incomes || [])
    } catch (error) {
      console.error('[v0] Error loading tax exempt income:', error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadIncomes()
  }, [user?.id])

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    if (!user?.id) return

    const formData = new FormData(e.currentTarget)
    const data = {
      income_type: formData.get('income_type'),
      source_name: formData.get('source_name'),
      amount: parseFloat(formData.get('amount') as string) || 0,
      description: formData.get('description'),
    }

    try {
      await fetch('/api/declaration/tax-exempt-income', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'x-user-id': user.id },
        body: JSON.stringify(data)
      })
      loadIncomes()
      setOpen(false)
    } catch (error) {
      console.error('[v0] Error saving income:', error)
    }
  }

  const handleDelete = async (id: string) => {
    if (!user?.id) return
    try {
      await fetch(`/api/declaration/tax-exempt-income/${id}`, {
        method: 'DELETE',
        headers: { 'x-user-id': user.id }
      })
      loadIncomes()
    } catch (error) {
      console.error('[v0] Error deleting income:', error)
    }
  }

  if (loading) return <div>Carregando...</div>

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-xl font-semibold">Rendimentos Isentos e Não Tributáveis</h2>
          <p className="text-sm text-muted-foreground">
            FGTS, poupança, dividendos, bolsas, doações e heranças
          </p>
        </div>
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button>Adicionar Rendimento Isento</Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Novo Rendimento Isento</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-4">
                <div>
                  <Label htmlFor="income_type">Tipo de Rendimento *</Label>
                  <Select name="income_type" required>
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione o tipo" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="fgts">FGTS</SelectItem>
                      <SelectItem value="poupanca">Poupança</SelectItem>
                      <SelectItem value="dividendos">Dividendos</SelectItem>
                      <SelectItem value="bolsa">Bolsa de Estudos</SelectItem>
                      <SelectItem value="doacao">Doação</SelectItem>
                      <SelectItem value="heranca">Herança</SelectItem>
                      <SelectItem value="outros">Outros</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="source_name">Nome da Fonte *</Label>
                  <Input id="source_name" name="source_name" required placeholder="Ex: Banco, empresa, pessoa" />
                </div>
                <div>
                  <Label htmlFor="amount">Valor Recebido *</Label>
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
        {incomes.length === 0 ? (
          <Card>
            <CardContent className="py-8 text-center text-muted-foreground">
              Nenhum rendimento isento cadastrado
            </CardContent>
          </Card>
        ) : (
          incomes.map((income) => (
            <Card key={income.id}>
              <CardHeader>
                <div className="flex justify-between items-start">
                  <div>
                    <CardTitle className="text-lg">{income.source_name}</CardTitle>
                    <CardDescription>{income.income_type}</CardDescription>
                  </div>
                  <Button variant="ghost" size="sm" onClick={() => handleDelete(income.id)}>Remover</Button>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <div>
                    <p className="text-muted-foreground text-sm">Valor Recebido</p>
                    <p className="font-semibold">R$ {income.amount.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</p>
                  </div>
                  {income.description && (
                    <div>
                      <p className="text-muted-foreground text-sm">Descrição</p>
                      <p className="text-sm">{income.description}</p>
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
