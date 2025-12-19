'use client'

import { useEffect, useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Checkbox } from '@/components/ui/checkbox'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'

interface DependentsSectionProps {
  userId?: string
}

export function DependentsSection({ userId }: DependentsSectionProps) {
  const [loading, setLoading] = useState(true)
  const [dependents, setDependents] = useState<any[]>([])
  const [dialogOpen, setDialogOpen] = useState(false)

  useEffect(() => {
    loadData()
  }, [userId])

  const loadData = async () => {
    if (!userId) return
    
    try {
      const response = await fetch('/api/profile/dependents', {
        headers: { 'x-user-id': userId }
      })
      
      if (response.ok) {
        const result = await response.json()
        setDependents(result.dependents || [])
      }
    } catch (error) {
      console.error('[v0] Error loading dependents:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Deseja remover este dependente?')) return

    try {
      await fetch(`/api/profile/dependents/${id}`, {
        method: 'DELETE',
        headers: { 'x-user-id': userId! }
      })
      loadData()
    } catch (error) {
      console.error('[v0] Error deleting dependent:', error)
    }
  }

  if (loading) {
    return <div className="text-center py-8">Carregando...</div>
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle>3. Dependentes</CardTitle>
            <CardDescription>
              Filhos, cônjuge, pais ou outros dependentes
            </CardDescription>
          </div>
          <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
            <DialogTrigger asChild>
              <Button size="sm">
                Adicionar Dependente
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>Adicionar Dependente</DialogTitle>
                <DialogDescription>
                  Preencha os dados do dependente
                </DialogDescription>
              </DialogHeader>
              <DependentForm userId={userId} onSuccess={() => { setDialogOpen(false); loadData(); }} />
            </DialogContent>
          </Dialog>
        </div>
      </CardHeader>
      <CardContent>
        {dependents.length === 0 ? (
          <p className="text-muted-foreground text-center py-8">
            Nenhum dependente cadastrado
          </p>
        ) : (
          <div className="space-y-4">
            {dependents.map((dependent) => (
              <div key={dependent.id} className="flex items-center justify-between p-4 border rounded-lg">
                <div className="flex-1">
                  <p className="font-medium">{dependent.full_name}</p>
                  <p className="text-sm text-muted-foreground">
                    {dependent.relationship} • CPF: {dependent.cpf || 'Não informado'}
                  </p>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => handleDelete(dependent.id)}
                >
                  Remover
                </Button>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  )
}

function DependentForm({ userId, onSuccess }: { userId?: string; onSuccess: () => void }) {
  const [saving, setSaving] = useState(false)

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setSaving(true)

    const formData = new FormData(e.currentTarget)
    const dependentData = {
      cpf: formData.get('cpf'),
      full_name: formData.get('full_name'),
      birth_date: formData.get('birth_date'),
      relationship: formData.get('relationship'),
      lives_with_taxpayer: formData.get('lives_with_taxpayer') === 'on',
      has_income: formData.get('has_income') === 'on',
      education_level: formData.get('education_level')
    }

    try {
      const response = await fetch('/api/profile/dependents', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-user-id': userId!
        },
        body: JSON.stringify(dependentData)
      })

      if (response.ok) {
        onSuccess()
      }
    } catch (error) {
      console.error('[v0] Error creating dependent:', error)
    } finally {
      setSaving(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid gap-4 sm:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="full_name">Nome Completo *</Label>
          <Input id="full_name" name="full_name" required disabled={saving} />
        </div>

        <div className="space-y-2">
          <Label htmlFor="cpf">CPF</Label>
          <Input id="cpf" name="cpf" placeholder="000.000.000-00" disabled={saving} />
        </div>

        <div className="space-y-2">
          <Label htmlFor="birth_date">Data de Nascimento</Label>
          <Input id="birth_date" name="birth_date" type="date" disabled={saving} />
        </div>

        <div className="space-y-2">
          <Label htmlFor="relationship">Parentesco *</Label>
          <Select name="relationship" required disabled={saving}>
            <SelectTrigger>
              <SelectValue placeholder="Selecione" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="filho">Filho(a)</SelectItem>
              <SelectItem value="enteado">Enteado(a)</SelectItem>
              <SelectItem value="pai">Pai</SelectItem>
              <SelectItem value="mae">Mãe</SelectItem>
              <SelectItem value="irmao">Irmão/Irmã</SelectItem>
              <SelectItem value="neto">Neto(a)</SelectItem>
              <SelectItem value="outro">Outro</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="education_level">Grau de Instrução</Label>
          <Select name="education_level" disabled={saving}>
            <SelectTrigger>
              <SelectValue placeholder="Selecione" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="infantil">Educação Infantil</SelectItem>
              <SelectItem value="fundamental">Ensino Fundamental</SelectItem>
              <SelectItem value="medio">Ensino Médio</SelectItem>
              <SelectItem value="superior">Ensino Superior</SelectItem>
              <SelectItem value="pos">Pós-graduação</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="flex flex-col gap-3 sm:col-span-2">
          <div className="flex items-center space-x-2">
            <Checkbox id="lives_with_taxpayer" name="lives_with_taxpayer" defaultChecked disabled={saving} />
            <Label htmlFor="lives_with_taxpayer" className="font-normal">
              Mora com o contribuinte
            </Label>
          </div>

          <div className="flex items-center space-x-2">
            <Checkbox id="has_income" name="has_income" disabled={saving} />
            <Label htmlFor="has_income" className="font-normal">
              Possui rendimentos
            </Label>
          </div>
        </div>
      </div>

      <div className="flex justify-end gap-3">
        <Button type="submit" disabled={saving}>
          {saving ? 'Salvando...' : 'Salvar Dependente'}
        </Button>
      </div>
    </form>
  )
}
