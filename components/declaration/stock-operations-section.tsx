'use client'

import { useState, useEffect } from 'react'
import { useAuth } from '@/lib/hooks/use-auth'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'

interface StockOperation {
  id: string
  operation_type: string
  ticker: string
  quantity: number
  unit_price: number
  total_value: number
  operation_date: string
  brokerage_fee: number
}

export function StockOperationsSection() {
  const { user } = useAuth()
  const [operations, setOperations] = useState<StockOperation[]>([])
  const [loading, setLoading] = useState(true)
  const [open, setOpen] = useState(false)

  const loadOperations = async () => {
    if (!user?.id) return
    try {
      const res = await fetch('/api/declaration/stock-operations', {
        headers: { 'x-user-id': user.id }
      })
      const data = await res.json()
      setOperations(data.operations || [])
    } catch (error) {
      console.error('[v0] Error loading stock operations:', error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadOperations()
  }, [user?.id])

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    if (!user?.id) return

    const formData = new FormData(e.currentTarget)
    const quantity = parseFloat(formData.get('quantity') as string) || 0
    const unitPrice = parseFloat(formData.get('unit_price') as string) || 0

    const data = {
      operation_type: formData.get('operation_type'),
      ticker: formData.get('ticker'),
      quantity,
      unit_price: unitPrice,
      total_value: quantity * unitPrice,
      operation_date: formData.get('operation_date'),
      brokerage_fee: parseFloat(formData.get('brokerage_fee') as string) || 0,
    }

    try {
      await fetch('/api/declaration/stock-operations', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'x-user-id': user.id },
        body: JSON.stringify(data)
      })
      loadOperations()
      setOpen(false)
    } catch (error) {
      console.error('[v0] Error saving stock operation:', error)
    }
  }

  const handleDelete = async (id: string) => {
    if (!user?.id) return
    try {
      await fetch(`/api/declaration/stock-operations/${id}`, {
        method: 'DELETE',
        headers: { 'x-user-id': user.id }
      })
      loadOperations()
    } catch (error) {
      console.error('[v0] Error deleting stock operation:', error)
    }
  }

  if (loading) return <div>Carregando...</div>

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-xl font-semibold">Operações em Renda Variável</h2>
          <p className="text-sm text-muted-foreground">
            Ações, FIIs, ETFs, swing trade e day trade
          </p>
        </div>
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button>Adicionar Operação</Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Nova Operação em Renda Variável</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="operation_type">Tipo de Operação *</Label>
                  <Select name="operation_type" required>
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="compra">Compra</SelectItem>
                      <SelectItem value="venda">Venda</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="ticker">Código do Ativo *</Label>
                  <Input id="ticker" name="ticker" required placeholder="Ex: PETR4, BBAS3" />
                </div>
                <div>
                  <Label htmlFor="quantity">Quantidade *</Label>
                  <Input id="quantity" name="quantity" type="number" step="1" required placeholder="0" />
                </div>
                <div>
                  <Label htmlFor="unit_price">Preço Unitário *</Label>
                  <Input id="unit_price" name="unit_price" type="number" step="0.01" required placeholder="0,00" />
                </div>
                <div>
                  <Label htmlFor="operation_date">Data da Operação *</Label>
                  <Input id="operation_date" name="operation_date" type="date" required />
                </div>
                <div>
                  <Label htmlFor="brokerage_fee">Taxas de Corretagem</Label>
                  <Input id="brokerage_fee" name="brokerage_fee" type="number" step="0.01" defaultValue="0" placeholder="0,00" />
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
        {operations.length === 0 ? (
          <Card>
            <CardContent className="py-8 text-center text-muted-foreground">
              Nenhuma operação cadastrada
            </CardContent>
          </Card>
        ) : (
          operations.map((op) => (
            <Card key={op.id}>
              <CardHeader>
                <div className="flex justify-between items-start">
                  <div>
                    <CardTitle className="text-lg">{op.ticker}</CardTitle>
                    <CardDescription>{op.operation_type} - {new Date(op.operation_date).toLocaleDateString('pt-BR')}</CardDescription>
                  </div>
                  <Button variant="ghost" size="sm" onClick={() => handleDelete(op.id)}>Remover</Button>
                </div>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-sm">
                  <div>
                    <p className="text-muted-foreground">Quantidade</p>
                    <p className="font-semibold">{op.quantity}</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Preço Unit.</p>
                    <p className="font-semibold">R$ {op.unit_price.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Valor Total</p>
                    <p className="font-semibold">R$ {op.total_value.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Taxas</p>
                    <p className="font-semibold">R$ {op.brokerage_fee.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</p>
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
