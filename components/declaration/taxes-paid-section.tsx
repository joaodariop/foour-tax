'use client'

import { useState, useEffect } from 'react'
import { useAuth } from '@/lib/hooks/use-auth'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'

interface TaxPaid {
  id: string
  tax_type: string
  tax_period: string
  darf_number: string
  payment_date: string
  amount_paid: number
}

export function TaxesPaidSection() {
  const { user } = useAuth()
  const [taxes, setTaxes] = useState<TaxPaid[]>([])
  const [loading, setLoading] = useState(true)
  const [open, setOpen] = useState(false)

  const loadTaxes = async () => {
    if (!user?.id) return
    try {
      const res = await fetch('/api/declaration/taxes-paid', {
        headers: { 'x-user-id': user.id }
      })
      const data = await res.json()
      setTaxes(data.taxes || [])
    } catch (error) {
      console.error('[v0] Error loading taxes paid:', error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadTaxes()
  }, [user?.id])

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    if (!user?.id) return

    const formData = new FormData(e.currentTarget)
    const data = {
      tax_type: formData.get('tax_type'),
      tax_period: formData.get('tax_period'),
      darf_number: formData.get('darf_number'),
      payment_date: formData.get('payment_date'),
      amount_paid: parseFloat(formData.get('amount_paid') as string) || 0,
    }

    try {
      await fetch('/api/declaration/taxes-paid', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'x-user-id': user.id },
        body: JSON.stringify(data)
      })
      loadTaxes()
      setOpen(false)
    } catch (error) {
      console.error('[v0] Error saving tax paid:', error)
    }
  }

  const handleDelete = async (id: string) => {
    if (!user?.id) return
    try {
      await fetch(`/api/declaration/taxes-paid/${id}`, {
        method: 'DELETE',
        headers: { 'x-user-id': user.id }
      })
      loadTaxes()
    } catch (error) {
      console.error('[v0] Error deleting tax paid:', error)
    }
  }

  if (loading) return <div>Carregando...</div>

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-xl font-semibold">Impostos Pagos e Retenções</h2>
          <p className="text-sm text-muted-foreground">
            Carnê-leão, impostos no exterior, DARF e recolhimentos mensais
          </p>
        </div>
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button>Adicionar Imposto Pago</Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Novo Imposto Pago</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-4">
                <div>
                  <Label htmlFor="tax_type">Tipo de Imposto *</Label>
                  <Select name="tax_type" required>
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="darf">DARF</SelectItem>
                      <SelectItem value="carne_leao">Carnê-Leão</SelectItem>
                      <SelectItem value="ganho_capital">Ganho de Capital</SelectItem>
                      <SelectItem value="exterior">Impostos no Exterior</SelectItem>
                      <SelectItem value="outros">Outros</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="tax_period">Período de Apuração *</Label>
                  <Input id="tax_period" name="tax_period" required placeholder="Ex: 01/2024" />
                </div>
                <div>
                  <Label htmlFor="darf_number">Número do DARF</Label>
                  <Input id="darf_number" name="darf_number" placeholder="Número do documento" />
                </div>
                <div>
                  <Label htmlFor="payment_date">Data do Pagamento *</Label>
                  <Input id="payment_date" name="payment_date" type="date" required />
                </div>
                <div>
                  <Label htmlFor="amount_paid">Valor Pago *</Label>
                  <Input id="amount_paid" name="amount_paid" type="number" step="0.01" required placeholder="0,00" />
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
        {taxes.length === 0 ? (
          <Card>
            <CardContent className="py-8 text-center text-muted-foreground">
              Nenhum imposto pago cadastrado
            </CardContent>
          </Card>
        ) : (
          taxes.map((tax) => (
            <Card key={tax.id}>
              <CardHeader>
                <div className="flex justify-between items-start">
                  <div>
                    <CardTitle className="text-lg">{tax.tax_type}</CardTitle>
                    <CardDescription>Período: {tax.tax_period} {tax.darf_number && `- DARF: ${tax.darf_number}`}</CardDescription>
                  </div>
                  <Button variant="ghost" size="sm" onClick={() => handleDelete(tax.id)}>Remover</Button>
                </div>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <p className="text-muted-foreground">Data de Pagamento</p>
                    <p className="font-semibold">{new Date(tax.payment_date).toLocaleDateString('pt-BR')}</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Valor Pago</p>
                    <p className="font-semibold">R$ {tax.amount_paid.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </div>
  )
}
