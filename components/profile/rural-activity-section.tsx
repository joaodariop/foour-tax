'use client'

import { useEffect, useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Checkbox } from '@/components/ui/checkbox'
import { Textarea } from '@/components/ui/textarea'

interface RuralActivitySectionProps {
  userId?: string
}

export function RuralActivitySection({ userId }: RuralActivitySectionProps) {
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [success, setSuccess] = useState(false)
  const [data, setData] = useState<any>(null)
  const [hasActivity, setHasActivity] = useState(false)

  useEffect(() => {
    loadData()
  }, [userId])

  const loadData = async () => {
    if (!userId) return
    
    try {
      const response = await fetch('/api/profile/rural-activity', {
        headers: { 'x-user-id': userId }
      })
      
      if (response.ok) {
        const result = await response.json()
        setData(result)
        setHasActivity(result?.has_rural_activity || false)
      }
    } catch (error) {
      console.error('[v0] Error loading rural activity:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setSaving(true)
    setSuccess(false)

    const formData = new FormData(e.currentTarget)
    
    let coExploiters = null
    const coExploitersText = formData.get('co_exploiters') as string
    if (coExploitersText) {
      try {
        coExploiters = coExploitersText.split(',').map(cpf => cpf.trim())
      } catch (e) {
        coExploiters = null
      }
    }

    const activityData = {
      has_rural_activity: hasActivity,
      exploitation_type: hasActivity ? formData.get('exploitation_type') : null,
      co_exploiters: coExploiters
    }

    try {
      const response = await fetch('/api/profile/rural-activity', {
        method: data?.id ? 'PUT' : 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-user-id': userId!
        },
        body: JSON.stringify(activityData)
      })

      if (response.ok) {
        setSuccess(true)
        setTimeout(() => setSuccess(false), 3000)
      }
    } catch (error) {
      console.error('[v0] Error updating rural activity:', error)
    } finally {
      setSaving(false)
    }
  }

  if (loading) {
    return <div className="text-center py-8">Carregando...</div>
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>9. Atividade Rural</CardTitle>
        <CardDescription>
          Se exerce atividade rural
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          {success && (
            <Alert>
              <AlertDescription>Informações salvas!</AlertDescription>
            </Alert>
          )}

          <div className="flex items-center space-x-2">
            <Checkbox
              id="has_rural_activity"
              name="has_rural_activity"
              checked={hasActivity}
              onCheckedChange={(checked) => setHasActivity(!!checked)}
              disabled={saving}
            />
            <Label htmlFor="has_rural_activity" className="font-normal">
              Exerce atividade rural
            </Label>
          </div>

          {hasActivity && (
            <div className="space-y-4 pl-6 border-l-2">
              <div className="space-y-2">
                <Label htmlFor="exploitation_type">Tipo de Exploração</Label>
                <Select
                  name="exploitation_type"
                  defaultValue={data?.exploitation_type || ''}
                  disabled={saving}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="individual">Individual</SelectItem>
                    <SelectItem value="condominio">Condomínio</SelectItem>
                    <SelectItem value="cooperativa">Cooperativa</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="co_exploiters">CPF/CNPJ dos Coexploradores</Label>
                <Textarea
                  id="co_exploiters"
                  name="co_exploiters"
                  placeholder="Separe múltiplos CPF/CNPJ por vírgula"
                  defaultValue={data?.co_exploiters ? data.co_exploiters.join(', ') : ''}
                  disabled={saving}
                  rows={3}
                />
                <p className="text-xs text-muted-foreground">
                  Ex: 000.000.000-00, 11.111.111/0001-11
                </p>
              </div>
            </div>
          )}

          <div className="flex justify-end">
            <Button type="submit" disabled={saving}>
              {saving ? 'Salvando...' : 'Salvar'}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  )
}
