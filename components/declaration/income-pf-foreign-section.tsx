'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { useAuth } from '@/lib/hooks/use-auth'

type IncomePfForeign = {
  id: string
  payer_name: string
  payer_cpf_cnpj: string
  income_type: string
  amount_received: number
  carne_leao_paid: number
  inss_paid: number
  foreign_tax_paid: number
  currency_conversion_rate: number
  deductible_expenses: number
}

export function IncomePFForeignSection() {
  const { user } = useAuth()
  const [items, setItems] = useState<IncomePfForeign[]>([])
  const [loading, setLoading] = useState(true)
  const [dialogOpen, setDialogOpen] = useState(false)
  const [formData, setFormData] = useState({
    payer_name: '',
    payer_cpf_cnpj: '',
    income_type: 'trabalho_sem_vinculo',
    amount_received: '',
    carne_leao_paid: '',
    inss_paid: '',
    foreign_tax_paid: '',
    currency_conversion_rate: '',
    deductible_expenses: ''
  })

  useEffect(() => {
    if (user) {
      loadItems()
    }
  }, [user])

  const loadItems = async () => {
    try {
      const response = await fetch('/api/declaration/income-pf-foreign', {
        headers: { 'x-user-id': user!.id }
      })
      if (response.ok) {
        const data = await response.json()
        setItems(data.items || [])
      }
    } catch (error) {
      console.error('Error loading PF/foreign income:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      const response = await fetch('/api/declaration/income-pf-foreign', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-user-id': user!.id
        },
        body: JSON.stringify(formData)
      })

      if (response.ok) {
        setDialogOpen(false)
        setFormData({
          payer_name: '',
          payer_cpf_cnpj: '',
          income_type: 'trabalho_sem_vinculo',
          amount_received: '',
          carne_leao_paid: '',
          inss_paid: '',
          foreign_tax_paid: '',
          currency_conversion_rate: '',
          deductible_expenses: ''
        })
        loadItems()
      }
    } catch (error) {
      console.error('Error saving PF/foreign income:', error)
    }
  }

  const handleDelete = async (id: string) => {
    try {
      const response = await fetch(`/api/declaration/income-pf-foreign/${id}`, {
        method: 'DELETE',
        headers: { 'x-user-id': user!.id }
      })
      if (response.ok) {
        loadItems()
      }
    } catch (error) {
      console.error('Error deleting item:', error)
    }
  }

  const incomeTypes = [
    { value: 'trabalho_sem_vinculo', label: 'Trabalho sem Vínculo' },
    { value: 'alugueis', label: 'Aluguéis' },
    { value: 'outros', label: 'Outros' }
  ]

  if (loading) {
    return <div className="text-sm text-muted-foreground">Carregando...</div>
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Rendimentos de PF/Exterior</CardTitle>
        <CardDescription>
          Rendimentos recebidos de pessoa física ou do exterior
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogTrigger asChild>
            <Button>Adicionar Rendimento</Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Novo Rendimento PF/Exterior</DialogTitle>
              <DialogDescription>
                Preencha os dados do rendimento recebido
              </DialogDescription>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="payer_name">Nome do Pagador *</Label>
                  <Input
                    id="payer_name"
                    required
                    value={formData.payer_name}
                    onChange={(e) => setFormData({ ...formData, payer_name: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="payer_cpf_cnpj">CPF/CNPJ do Pagador</Label>
                  <Input
                    id="payer_cpf_cnpj"
                    value={formData.payer_cpf_cnpj}
                    onChange={(e) => setFormData({ ...formData, payer_cpf_cnpj: e.target.value })}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="income_type">Tipo de Rendimento *</Label>
                <Select
                  value={formData.income_type}
                  onValueChange={(value) => setFormData({ ...formData, income_type: value })}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {incomeTypes.map((type) => (
                      <SelectItem key={type.value} value={type.value}>
                        {type.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="amount_received">Valor Recebido (R$) *</Label>
                  <Input
                    id="amount_received"
                    type="number"
                    step="0.01"
                    required
                    value={formData.amount_received}
                    onChange={(e) => setFormData({ ...formData, amount_received: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="carne_leao_paid">Carnê-Leão Pago (R$)</Label>
                  <Input
                    id="carne_leao_paid"
                    type="number"
                    step="0.01"
                    value={formData.carne_leao_paid}
                    onChange={(e) => setFormData({ ...formData, carne_leao_paid: e.target.value })}
                  />
                </div>
              </div>

              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="inss_paid">INSS Pago (R$)</Label>
                  <Input
                    id="inss_paid"
                    type="number"
                    step="0.01"
                    value={formData.inss_paid}
                    onChange={(e) => setFormData({ ...formData, inss_paid: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="foreign_tax_paid">Imposto Pago no Exterior (R$)</Label>
                  <Input
                    id="foreign_tax_paid"
                    type="number"
                    step="0.01"
                    value={formData.foreign_tax_paid}
                    onChange={(e) => setFormData({ ...formData, foreign_tax_paid: e.target.value })}
                  />
                </div>
              </div>

              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="currency_conversion_rate">Taxa de Conversão</Label>
                  <Input
                    id="currency_conversion_rate"
                    type="number"
                    step="0.0001"
                    value={formData.currency_conversion_rate}
                    onChange={(e) => setFormData({ ...formData, currency_conversion_rate: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="deductible_expenses">Despesas Dedutíveis (R$)</Label>
                  <Input
                    id="deductible_expenses"
                    type="number"
                    step="0.01"
                    value={formData.deductible_expenses}
                    onChange={(e) => setFormData({ ...formData, deductible_expenses: e.target.value })}
                  />
                </div>
              </div>

              <DialogFooter>
                <Button type="button" variant="outline" onClick={() => setDialogOpen(false)}>
                  Cancelar
                </Button>
                <Button type="submit">Salvar</Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>

        {items.length === 0 ? (
          <p className="text-sm text-muted-foreground">Nenhum rendimento cadastrado</p>
        ) : (
          <div className="space-y-2">
            {items.map((item) => (
              <Card key={item.id}>
                <CardContent className="pt-6">
                  <div className="flex justify-between items-start">
                    <div className="space-y-1">
                      <p className="font-medium">{item.payer_name}</p>
                      <p className="text-sm text-muted-foreground">
                        {incomeTypes.find(t => t.value === item.income_type)?.label}
                      </p>
                      <p className="text-sm">
                        Valor: R$ {item.amount_received.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                      </p>
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleDelete(item.id)}
                    >
                      Excluir
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  )
}
