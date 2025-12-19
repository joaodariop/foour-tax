'use client'

import { useEffect, useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Checkbox } from '@/components/ui/checkbox'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'

interface DomesticEmployeesSectionProps {
  userId?: string
}

export function DomesticEmployeesSection({ userId }: DomesticEmployeesSectionProps) {
  const [loading, setLoading] = useState(true)
  const [employees, setEmployees] = useState<any[]>([])
  const [dialogOpen, setDialogOpen] = useState(false)

  useEffect(() => {
    loadData()
  }, [userId])

  const loadData = async () => {
    if (!userId) return
    
    try {
      const response = await fetch('/api/profile/domestic-employees', {
        headers: { 'x-user-id': userId }
      })
      
      if (response.ok) {
        const result = await response.json()
        setEmployees(result.employees || [])
      }
    } catch (error) {
      console.error('[v0] Error loading employees:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Deseja remover este empregado?')) return

    try {
      await fetch(`/api/profile/domestic-employees/${id}`, {
        method: 'DELETE',
        headers: { 'x-user-id': userId! }
      })
      loadData()
    } catch (error) {
      console.error('[v0] Error deleting employee:', error)
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
            <CardTitle>7. Empregados Domésticos</CardTitle>
            <CardDescription>
              Se houver empregados domésticos
            </CardDescription>
          </div>
          <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
            <DialogTrigger asChild>
              <Button size="sm">
                Adicionar Empregado
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Adicionar Empregado Doméstico</DialogTitle>
                <DialogDescription>
                  Preencha os dados do empregado
                </DialogDescription>
              </DialogHeader>
              <EmployeeForm userId={userId} onSuccess={() => { setDialogOpen(false); loadData(); }} />
            </DialogContent>
          </Dialog>
        </div>
      </CardHeader>
      <CardContent>
        {employees.length === 0 ? (
          <p className="text-muted-foreground text-center py-8">
            Nenhum empregado cadastrado
          </p>
        ) : (
          <div className="space-y-4">
            {employees.map((employee) => (
              <div key={employee.id} className="flex items-center justify-between p-4 border rounded-lg">
                <div className="flex-1">
                  <p className="font-medium">{employee.full_name}</p>
                  <p className="text-sm text-muted-foreground">CPF: {employee.cpf}</p>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => handleDelete(employee.id)}
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

function EmployeeForm({ userId, onSuccess }: { userId?: string; onSuccess: () => void }) {
  const [saving, setSaving] = useState(false)

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setSaving(true)

    const formData = new FormData(e.currentTarget)
    const employeeData = {
      cpf: formData.get('cpf'),
      full_name: formData.get('full_name'),
      admission_date: formData.get('admission_date'),
      termination_date: formData.get('termination_date'),
      esocial_contributions: formData.get('esocial_contributions') === 'on'
    }

    try {
      const response = await fetch('/api/profile/domestic-employees', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-user-id': userId!
        },
        body: JSON.stringify(employeeData)
      })

      if (response.ok) {
        onSuccess()
      }
    } catch (error) {
      console.error('[v0] Error creating employee:', error)
    } finally {
      setSaving(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="cpf">CPF *</Label>
        <Input id="cpf" name="cpf" placeholder="000.000.000-00" required disabled={saving} />
      </div>

      <div className="space-y-2">
        <Label htmlFor="full_name">Nome Completo *</Label>
        <Input id="full_name" name="full_name" required disabled={saving} />
      </div>

      <div className="space-y-2">
        <Label htmlFor="admission_date">Data de Admissão</Label>
        <Input id="admission_date" name="admission_date" type="date" disabled={saving} />
      </div>

      <div className="space-y-2">
        <Label htmlFor="termination_date">Data de Demissão</Label>
        <Input id="termination_date" name="termination_date" type="date" disabled={saving} />
      </div>

      <div className="flex items-center space-x-2">
        <Checkbox
          id="esocial_contributions"
          name="esocial_contributions"
          defaultChecked
          disabled={saving}
        />
        <Label htmlFor="esocial_contributions" className="font-normal">
          Contribuições via eSocial
        </Label>
      </div>

      <div className="flex justify-end gap-3">
        <Button type="submit" disabled={saving}>
          {saving ? 'Salvando...' : 'Salvar'}
        </Button>
      </div>
    </form>
  )
}
