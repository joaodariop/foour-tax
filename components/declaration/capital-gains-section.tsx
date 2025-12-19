'use client'

import { useState, useEffect } from 'react'
import { useAuth } from '@/lib/hooks/use-auth'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'

interface CapitalGain {
  id: string
  asset_type: string
  asset_description: string
  acquisition_date: string
  acquisition_value: number
  sale_date: string
  sale_value: number
  capital_gain: number
  tax_paid: number
}

export function CapitalGainsSection() {
  const { user } = useAuth()
  const [gains, setGains] = useState<CapitalGain[]>([])
  const [loading, setLoading] = useState(true)
  const [open, setOpen] = useState(false)

  const loadGains = async () => {
    if (!user?.id) return
    try {
      const res = await fetch('/api/declaration/capital-gains', {
        headers: { 'x-user-id': user.id }
      })
      const data = await res.json()
      setGains(data.gains || [])
    } catch (error) {
      console.error('[v0] Error loading capital gains:', error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadGains()
  }, [user?.id])

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    if (!user?.id) return

    const formData = new FormData(e.currentTarget)
    const acquisitionValue = parseFloat(formData.get('acquisition_value') as string) || 0
    const saleValue = parseFloat(formData.get('sale_value') as string) || 0
    const capitalGain = Math.max(0, saleValue - acquisitionValue)

    const data = {
      asset_type: formData.get('asset_type'),
      asset_description: formData.get('asset_description'),
      acquisition_date: formData.get('acquisition_date'),
      acquisition_value: acquisitionValue,
      sale_date: formData.get('sale_date'),
      sale_value: saleValue,
      capital_gain: capitalGain,
      tax_paid: parseFloat(formData.get('tax_paid') as string) || 0,
    }

    try {
      await fetch('/api/declaration/capital-gains', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'x-user-id': user.id },
        body: JSON.stringify(data)
      })
      loadGains()
      setOpen(false)
    } catch (error) {
      console.error('[v0] Error saving capital gain:', error)
    }
  }

  const handleDelete = async (id: string) => {
    if (!user?.id) return
    try {
      await fetch(`/api/declaration/capital-gains/${id}`, {
        method: 'DELETE',
        headers: { 'x-user-id': user.id }
      })
      loadGains()
    } catch (error) {
      console.error('[v0] Error deleting capital gain:', error)
    }
  }

  if (loading) return <div>Carregando...</div>

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-xl font-semibold">Ganhos de Capital</h2>
          <p className="text-sm text-muted-foreground">
            Venda de imóveis, veículos e outros bens com apuração de ganho
          </p>
        </div>
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button>Adicionar Ganho de Capital</Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Novo Ganho de Capital</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="sm:col-span-2">
                  <Label htmlFor="asset_type">Tipo de Bem *</Label>
                  <Select name="asset_type" required>
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione o tipo" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="imovel">Imóvel</SelectItem>
                      <SelectItem value="veiculo">Veículo</SelectItem>
                      <SelectItem value="outros">Outros Bens</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="sm:col-span-2">
                  <Label htmlFor="asset_description">Descrição do Bem *</Label>
                  <Input id="asset_description" name="asset_description" required />
                </div>
                <div>
                  <Label htmlFor="acquisition_date">Data de Aquisição *</Label>
                  <Input id="acquisition_date" name="acquisition_date" type="date" required />
                </div>
                <div>
                  <Label htmlFor="acquisition_value">Valor de Aquisição *</Label>
                  <Input id="acquisition_value" name="acquisition_value" type="number" step="0.01" required placeholder="0,00" />
                </div>
                <div>
                  <Label htmlFor="sale_date">Data de Venda *</Label>
                  <Input id="sale_date" name="sale_date" type="date" required />
                </div>
                <div>
                  <Label htmlFor="sale_value">Valor de Venda *</Label>
                  <Input id="sale_value" name="sale_value" type="number" step="0.01" required placeholder="0,00" />
                </div>
                <div>
                  <Label htmlFor="tax_paid">Imposto Pago (GCAP)</Label>
                  <Input id="tax_paid" name="tax_paid" type="number" step="0.01" defaultValue="0" placeholder="0,00" />
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
        {gains.length === 0 ? (
          <Card>
            <CardContent className="py-8 text-center text-muted-foreground">
              Nenhum ganho de capital cadastrado
            </CardContent>
          </Card>
        ) : (
          gains.map((gain) => (
            <Card key={gain.id}>
              <CardHeader>
                <div className="flex justify-between items-start">
                  <div>
                    <CardTitle className="text-lg">{gain.asset_description}</CardTitle>
                    <CardDescription>{gain.asset_type}</CardDescription>
                  </div>
                  <Button variant="ghost" size="sm" onClick={() => handleDelete(gain.id)}>Remover</Button>
                </div>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <p className="text-muted-foreground">Aquisição</p>
                    <p className="font-semibold">R$ {gain.acquisition_value.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</p>
                    <p className="text-xs text-muted-foreground">{new Date(gain.acquisition_date).toLocaleDateString('pt-BR')}</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Venda</p>
                    <p className="font-semibold">R$ {gain.sale_value.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</p>
                    <p className="text-xs text-muted-foreground">{new Date(gain.sale_date).toLocaleDateString('pt-BR')}</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Ganho de Capital</p>
                    <p className="font-semibold text-green-600">R$ {gain.capital_gain.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Imposto Pago</p>
                    <p className="font-semibold">R$ {gain.tax_paid.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</p>
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
