'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { useAuth } from '@/lib/hooks/use-auth'

type ExclusiveTaxation = {
  id: string
  cnpj: string
  income_type: string
  gross_amount: number
  net_amount: number
  tax_code: string
}

export function ExclusiveTaxationSection() {
  const { user } = useAuth()
  const [items, setItems] = useState<ExclusiveTaxation[]>([])
  const [loading, setLoading] = useState(true)
  const [dialogOpen, setDialogOpen] = useState(false)
  const [formData, setFormData] = useState({
    cnpj: '',
    income_type: 'ltc_lci',
    gross_amount: '',
    net_amount: '',
    tax_code: ''
  })

  useEffect(() => {
    if (user) {
      loadItems()
    }
  }, [user])

  const loadItems = async () => {
    try {
      const response = await fetch('/api/declaration/exclusive-taxation', {
        headers: { 'x-user-id': user!.id }
      })
      if (response.ok) {
        const data = await response.json()
        setItems(data.items || [])
      }
    } catch (error) {
      console.error('Error loading exclusive taxation:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      const response = await fetch('/api/declaration/exclusive-taxation', {
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
          cnpj: '',
          income_type: 'ltc_lci',
          gross_amount: '',
          net_amount: '',
          tax_code: ''
        })
        loadItems()
      }
    } catch (error) {
      console.error('Error saving exclusive taxation:', error)
    }
  }

  const handleDelete = async (id: string) => {
    try {
      const response = await fetch(`/api/declaration/exclusive-taxation/${id}`, {
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
    { value: 'ltc_lci', label: 'LCI/LCA' },
    { value: 'cdb_juros', label: 'CDB/RDB com Juros' },
    { value: '13_exclusivo', label: '13º Salário (Tributação Exclusiva)' },
    { value: 'plr', label: 'PLR - Participação nos Lucros' },
    { value: 'aplicacoes_financeiras', label: 'Aplicações Financeiras' },
    { value: 'juros_capital_proprio', label: 'Juros sobre Capital Próprio' }
  ]

  if (loading) {
    return <div className="text-sm text-muted-foreground">Carregando...</div>
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Rendimentos Tributação Exclusiva/Definitiva</CardTitle>
        <CardDescription>
          Rendimentos sujeitos à tributação exclusiva na fonte
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogTrigger asChild>
            <Button>Adicionar Rendimento</Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Novo Rendimento Tributação Exclusiva</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
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

              <div className="space-y-2">
                <Label htmlFor="cnpj">CNPJ da Fonte Pagadora</Label>
                <Input
                  id="cnpj"
                  value={formData.cnpj}
                  onChange={(e) => setFormData({ ...formData, cnpj: e.target.value })}
                />
              </div>

              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="gross_amount">Valor Bruto (R$) *</Label>
                  <Input
                    id="gross_amount"
                    type="number"
                    step="0.01"
                    required
                    value={formData.gross_amount}
                    onChange={(e) => setFormData({ ...formData, gross_amount: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="net_amount">Valor Líquido (R$) *</Label>
                  <Input
                    id="net_amount"
                    type="number"
                    step="0.01"
                    required
                    value={formData.net_amount}
                    onChange={(e) => setFormData({ ...formData, net_amount: e.target.value })}
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
                      <p className="font-medium">
                        {incomeTypes.find(t => t.value === item.income_type)?.label}
                      </p>
                      <p className="text-sm">
                        Bruto: R$ {item.gross_amount.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
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
