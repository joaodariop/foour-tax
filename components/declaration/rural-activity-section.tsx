'use client'

import { useState, useEffect } from 'react'
import { useAuth } from '@/lib/hooks/use-auth'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'

interface RuralActivity {
  id: string
  property_name: string
  property_location: string
  activity_type: string
  gross_income: number
  deductible_expenses: number
  net_result: number
}

export function RuralActivitySection() {
  const { user } = useAuth()
  const [activities, setActivities] = useState<RuralActivity[]>([])
  const [loading, setLoading] = useState(true)
  const [open, setOpen] = useState(false)

  const loadActivities = async () => {
    if (!user?.id) return
    try {
      const res = await fetch('/api/declaration/rural-activity', {
        headers: { 'x-user-id': user.id }
      })
      const data = await res.json()
      setActivities(data.activities || [])
    } catch (error) {
      console.error('[v0] Error loading rural activities:', error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadActivities()
  }, [user?.id])

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    if (!user?.id) return

    const formData = new FormData(e.currentTarget)
    const grossIncome = parseFloat(formData.get('gross_income') as string) || 0
    const deductibleExpenses = parseFloat(formData.get('deductible_expenses') as string) || 0

    const data = {
      property_name: formData.get('property_name'),
      property_location: formData.get('property_location'),
      activity_type: formData.get('activity_type'),
      gross_income: grossIncome,
      deductible_expenses: deductibleExpenses,
      net_result: grossIncome - deductibleExpenses,
    }

    try {
      await fetch('/api/declaration/rural-activity', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'x-user-id': user.id },
        body: JSON.stringify(data)
      })
      loadActivities()
      setOpen(false)
    } catch (error) {
      console.error('[v0] Error saving rural activity:', error)
    }
  }

  const handleDelete = async (id: string) => {
    if (!user?.id) return
    try {
      await fetch(`/api/declaration/rural-activity/${id}`, {
        method: 'DELETE',
        headers: { 'x-user-id': user.id }
      })
      loadActivities()
    } catch (error) {
      console.error('[v0] Error deleting rural activity:', error)
    }
  }

  if (loading) return <div>Carregando...</div>

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-xl font-semibold">Atividade Rural</h2>
          <p className="text-sm text-muted-foreground">
            Receitas, despesas, livro caixa e resultado da atividade rural
          </p>
        </div>
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button>Adicionar Atividade Rural</Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Nova Atividade Rural</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-4">
                <div>
                  <Label htmlFor="property_name">Nome da Propriedade *</Label>
                  <Input id="property_name" name="property_name" required />
                </div>
                <div>
                  <Label htmlFor="property_location">Localização *</Label>
                  <Input id="property_location" name="property_location" required placeholder="Cidade/Estado" />
                </div>
                <div>
                  <Label htmlFor="activity_type">Tipo de Atividade *</Label>
                  <Input id="activity_type" name="activity_type" required placeholder="Ex: Agricultura, Pecuária" />
                </div>
                <div>
                  <Label htmlFor="gross_income">Receita Bruta *</Label>
                  <Input id="gross_income" name="gross_income" type="number" step="0.01" required placeholder="0,00" />
                </div>
                <div>
                  <Label htmlFor="deductible_expenses">Despesas Dedutíveis *</Label>
                  <Input id="deductible_expenses" name="deductible_expenses" type="number" step="0.01" required placeholder="0,00" />
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
        {activities.length === 0 ? (
          <Card>
            <CardContent className="py-8 text-center text-muted-foreground">
              Nenhuma atividade rural cadastrada
            </CardContent>
          </Card>
        ) : (
          activities.map((activity) => (
            <Card key={activity.id}>
              <CardHeader>
                <div className="flex justify-between items-start">
                  <div>
                    <CardTitle className="text-lg">{activity.property_name}</CardTitle>
                    <CardDescription>{activity.activity_type} - {activity.property_location}</CardDescription>
                  </div>
                  <Button variant="ghost" size="sm" onClick={() => handleDelete(activity.id)}>Remover</Button>
                </div>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-3 gap-4 text-sm">
                  <div>
                    <p className="text-muted-foreground">Receita Bruta</p>
                    <p className="font-semibold">R$ {activity.gross_income.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Despesas</p>
                    <p className="font-semibold">R$ {activity.deductible_expenses.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Resultado</p>
                    <p className={`font-semibold ${activity.net_result >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                      R$ {activity.net_result.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                    </p>
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
