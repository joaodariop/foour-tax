'use client'

import { useState } from 'react'
import { useAuth } from '@/lib/hooks/use-auth'
import { Button } from '@/components/ui/button'
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Textarea } from '@/components/ui/textarea'
import { Alert, AlertDescription } from '@/components/ui/alert'

interface AddDebtDialogProps {
  children: React.ReactNode
  onSuccess?: () => void
}

export function AddDebtDialog({ children, onSuccess }: AddDebtDialogProps) {
  const { user } = useAuth()
  const [open, setOpen] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    const formData = new FormData(e.currentTarget)
    const debt = {
      user_id: user?.id,
      type: formData.get('debt_type') as string,
      creditor: formData.get('creditor') as string,
      description: formData.get('description') as string || null,
      value: formData.get('current_balance') ? parseFloat(formData.get('current_balance') as string) : 0,
      due_date: formData.get('start_date') as string || null,
      status: 'active',
    }

    try {
      const response = await fetch('/api/debts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(debt),
      })

      const data = await response.json()

      if (!response.ok) {
        setError(data.error || 'Erro ao adicionar dívida')
      } else {
        setOpen(false)
        onSuccess?.()
        e.currentTarget.reset()
      }
    } catch (err) {
      console.error('[v0] Error adding debt:', err)
      setError('Erro ao adicionar dívida')
    }

    setLoading(false)
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle>Adicionar Dívida</DialogTitle>
            <DialogDescription>
              Cadastre uma nova dívida ou obrigação financeira
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-4">
            {error && (
              <Alert variant="destructive">
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            <div className="space-y-2">
              <Label htmlFor="debt_type">Tipo de Dívida *</Label>
              <Select name="debt_type" required>
                <SelectTrigger>
                  <SelectValue placeholder="Selecione" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="mortgage">Financiamento Imobiliário</SelectItem>
                  <SelectItem value="car_loan">Financiamento Veículo</SelectItem>
                  <SelectItem value="personal_loan">Empréstimo Pessoal</SelectItem>
                  <SelectItem value="credit_card">Cartão de Crédito</SelectItem>
                  <SelectItem value="student_loan">Empréstimo Estudantil</SelectItem>
                  <SelectItem value="other">Outro</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="creditor">Credor *</Label>
              <Input
                id="creditor"
                name="creditor"
                placeholder="Ex: Banco XYZ"
                required
                disabled={loading}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Descrição</Label>
              <Textarea
                id="description"
                name="description"
                placeholder="Informações adicionais sobre a dívida"
                disabled={loading}
              />
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="original_amount">Valor Original (R$)</Label>
                <Input
                  id="original_amount"
                  name="original_amount"
                  type="number"
                  step="0.01"
                  placeholder="0.00"
                  disabled={loading}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="current_balance">Saldo Atual (R$)</Label>
                <Input
                  id="current_balance"
                  name="current_balance"
                  type="number"
                  step="0.01"
                  placeholder="0.00"
                  disabled={loading}
                />
              </div>
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="monthly_payment">Parcela Mensal (R$)</Label>
                <Input
                  id="monthly_payment"
                  name="monthly_payment"
                  type="number"
                  step="0.01"
                  placeholder="0.00"
                  disabled={loading}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="interest_rate">Taxa de Juros (% a.a.)</Label>
                <Input
                  id="interest_rate"
                  name="interest_rate"
                  type="number"
                  step="0.01"
                  placeholder="0.00"
                  disabled={loading}
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="start_date">Data de Início</Label>
              <Input
                id="start_date"
                name="start_date"
                type="date"
                disabled={loading}
              />
            </div>
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => setOpen(false)} disabled={loading}>
              Cancelar
            </Button>
            <Button type="submit" disabled={loading}>
              {loading ? 'Salvando...' : 'Salvar'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
