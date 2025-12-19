'use client'

import { useState, useEffect } from 'react'
import { useAuth } from '@/lib/hooks/use-auth'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'

interface CryptoOperation {
  id: string
  operation_type: string
  crypto_symbol: string
  quantity: number
  unit_price_brl: number
  total_value_brl: number
  operation_date: string
  exchange_name: string
}

export function CryptoOperationsSection() {
  const { user } = useAuth()
  const [operations, setOperations] = useState<CryptoOperation[]>([])
  const [loading, setLoading] = useState(true)
  const [open, setOpen] = useState(false)

  const loadOperations = async () => {
    if (!user?.id) return
    try {
      const res = await fetch('/api/declaration/crypto-operations', {
        headers: { 'x-user-id': user.id }
      })
      const data = await res.json()
      setOperations(data.operations || [])
    } catch (error) {
      console.error('[v0] Error loading crypto operations:', error)
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
    const unitPrice = parseFloat(formData.get('unit_price_brl') as string) || 0

    const data = {
      operation_type: formData.get('operation_type'),
      crypto_symbol: formData.get('crypto_symbol'),
      quantity,
      unit_price_brl: unitPrice,
      total_value_brl: quantity * unitPrice,
      operation_date: formData.get('operation_date'),
      exchange_name: formData.get('exchange_name'),
    }

    try {
      await fetch('/api/declaration/crypto-operations', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'x-user-id': user.id },
        body: JSON.stringify(data)
      })
      loadOperations()
      setOpen(false)
    } catch (error) {
      console.error('[v0] Error saving crypto operation:', error)
    }
  }

  const handleDelete = async (id: string) => {
    if (!user?.id) return
    try {
      await fetch(`/api/declaration/crypto-operations/${id}`, {
        method: 'DELETE',
        headers: { 'x-user-id': user.id }
      })
      loadOperations()
    } catch (error) {
      console.error('[v0] Error deleting crypto operation:', error)
    }
  }

  if (loading) return <div>Carregando...</div>

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-xl font-semibold">Operações com Criptoativos</h2>
          <p className="text-sm text-muted-foreground">
            Bitcoin, Ethereum e outras criptomoedas - apuração mensal
          </p>
        </div>
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button>Adicionar Operação Cripto</Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Nova Operação com Criptoativo</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="operation_type">Tipo *</Label>
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
                  <Label htmlFor="crypto_symbol">Criptoativo *</Label>
                  <Input id="crypto_symbol" name="crypto_symbol" required placeholder="Ex: BTC, ETH" />
                </div>
                <div>
                  <Label htmlFor="quantity">Quantidade *</Label>
                  <Input id="quantity" name="quantity" type="number" step="0.00000001" required placeholder="0.00000000" />
                </div>
                <div>
                  <Label htmlFor="unit_price_brl">Preço Unit. (BRL) *</Label>
                  <Input id="unit_price_brl" name="unit_price_brl" type="number" step="0.01" required placeholder="0,00" />
                </div>
                <div>
                  <Label htmlFor="operation_date">Data *</Label>
                  <Input id="operation_date" name="operation_date" type="date" required />
                </div>
                <div>
                  <Label htmlFor="exchange_name">Exchange</Label>
                  <Input id="exchange_name" name="exchange_name" placeholder="Ex: Binance, Mercado Bitcoin" />
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
              Nenhuma operação com criptoativos cadastrada
            </CardContent>
          </Card>
        ) : (
          operations.map((op) => (
            <Card key={op.id}>
              <CardHeader>
                <div className="flex justify-between items-start">
                  <div>
                    <CardTitle className="text-lg">{op.crypto_symbol}</CardTitle>
                    <CardDescription>{op.operation_type} - {new Date(op.operation_date).toLocaleDateString('pt-BR')} {op.exchange_name && `- ${op.exchange_name}`}</CardDescription>
                  </div>
                  <Button variant="ghost" size="sm" onClick={() => handleDelete(op.id)}>Remover</Button>
                </div>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 text-sm">
                  <div>
                    <p className="text-muted-foreground">Quantidade</p>
                    <p className="font-semibold">{op.quantity}</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Preço Unit.</p>
                    <p className="font-semibold">R$ {op.unit_price_brl.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Total (BRL)</p>
                    <p className="font-semibold">R$ {op.total_value_brl.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</p>
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
