'use client'

import { useEffect, useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent } from '@/components/ui/card'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'

interface FIIOperationsSectionProps {
  userId?: string
}

export function FIIOperationsSection({ userId }: FIIOperationsSectionProps) {
  const [operations, setOperations] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [dialogOpen, setDialogOpen] = useState(false)

  useEffect(() => {
    loadOperations()
  }, [userId])

  const loadOperations = async () => {
    if (!userId) return
    
    try {
      const response = await fetch('/api/declaration/fii-operations', {
        headers: { 'x-user-id': userId }
      })
      
      if (response.ok) {
        const data = await response.json()
        setOperations(data)
      }
    } catch (error) {
      console.error('[v0] Error loading FII operations:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    
    const formData = new FormData(e.currentTarget)
    const operationData = {
      ticker: formData.get('ticker'),
      operation_type: formData.get('operation_type'),
      quantity: Number(formData.get('quantity')),
      unit_price: Number(formData.get('unit_price')),
      total_value: Number(formData.get('total_value')),
      operation_date: formData.get('operation_date'),
      brokerage_fee: Number(formData.get('brokerage_fee')) || 0,
    }

    try {
      const response = await fetch('/api/declaration/fii-operations', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-user-id': userId!
        },
        body: JSON.stringify(operationData)
      })

      if (response.ok) {
        setDialogOpen(false)
        loadOperations()
        e.currentTarget.reset()
      }
    } catch (error) {
      console.error('[v0] Error saving FII operation:', error)
    }
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Deseja excluir esta operação?')) return

    try {
      const response = await fetch(`/api/declaration/fii-operations/${id}`, {
        method: 'DELETE',
        headers: { 'x-user-id': userId! }
      })

      if (response.ok) {
        loadOperations()
      }
    } catch (error) {
      console.error('[v0] Error deleting FII operation:', error)
    }
  }

  if (loading) {
    return <div className="text-center py-8">Carregando...</div>
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold">Operações com FIIs</h3>
          <p className="text-sm text-muted-foreground">
            Compra e venda de cotas de fundos imobiliários
          </p>
        </div>
        
        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogTrigger asChild>
            <Button>Adicionar Operação</Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Nova Operação com FII</DialogTitle>
              <DialogDescription>
                Registre operações de compra ou venda de fundos imobiliários
              </DialogDescription>
            </DialogHeader>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="ticker">Ticker do FII *</Label>
                  <Input
                    id="ticker"
                    name="ticker"
                    placeholder="Ex: HGLG11"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="operation_type">Tipo de Operação *</Label>
                  <Select name="operation_type" required>
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="buy">Compra</SelectItem>
                      <SelectItem value="sell">Venda</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="quantity">Quantidade *</Label>
                  <Input
                    id="quantity"
                    name="quantity"
                    type="number"
                    step="1"
                    min="1"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="unit_price">Preço Unitário (R$) *</Label>
                  <Input
                    id="unit_price"
                    name="unit_price"
                    type="number"
                    step="0.01"
                    min="0"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="total_value">Valor Total (R$) *</Label>
                  <Input
                    id="total_value"
                    name="total_value"
                    type="number"
                    step="0.01"
                    min="0"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="operation_date">Data da Operação *</Label>
                  <Input
                    id="operation_date"
                    name="operation_date"
                    type="date"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="brokerage_fee">Taxa de Corretagem (R$)</Label>
                  <Input
                    id="brokerage_fee"
                    name="brokerage_fee"
                    type="number"
                    step="0.01"
                    min="0"
                    defaultValue="0"
                  />
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-4">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setDialogOpen(false)}
                >
                  Cancelar
                </Button>
                <Button type="submit">Salvar</Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {operations.length === 0 ? (
        <Card>
          <CardContent className="py-8 text-center text-muted-foreground">
            Nenhuma operação com FII cadastrada
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4">
          {operations.map((operation) => (
            <Card key={operation.id}>
              <CardContent className="pt-6">
                <div className="flex items-start justify-between">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="font-semibold">{operation.ticker}</span>
                      <span className={`text-sm px-2 py-0.5 rounded ${
                        operation.operation_type === 'buy' 
                          ? 'bg-green-100 text-green-800' 
                          : 'bg-red-100 text-red-800'
                      }`}>
                        {operation.operation_type === 'buy' ? 'Compra' : 'Venda'}
                      </span>
                    </div>
                    <div className="text-sm text-muted-foreground">
                      {operation.quantity} cotas × R$ {Number(operation.unit_price).toFixed(2)} = R$ {Number(operation.total_value).toFixed(2)}
                    </div>
                    <div className="text-xs text-muted-foreground">
                      Data: {new Date(operation.operation_date).toLocaleDateString('pt-BR')}
                      {operation.brokerage_fee > 0 && ` • Taxa: R$ ${Number(operation.brokerage_fee).toFixed(2)}`}
                    </div>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleDelete(operation.id)}
                  >
                    Remover
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}
