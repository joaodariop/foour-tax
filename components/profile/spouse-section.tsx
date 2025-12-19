'use client'

import { useEffect, useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Checkbox } from '@/components/ui/checkbox'

interface SpouseSectionProps {
  userId?: string
}

export function SpouseSection({ userId }: SpouseSectionProps) {
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [success, setSuccess] = useState(false)
  const [data, setData] = useState<any>(null)

  useEffect(() => {
    loadData()
  }, [userId])

  const loadData = async () => {
    if (!userId) return
    
    try {
      const response = await fetch('/api/profile/spouse', {
        headers: { 'x-user-id': userId }
      })
      
      if (response.ok) {
        const result = await response.json()
        setData(result)
      }
    } catch (error) {
      console.error('[v0] Error loading spouse:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setSaving(true)
    setSuccess(false)

    const formData = new FormData(e.currentTarget)
    const spouseData = {
      cpf: formData.get('cpf'),
      full_name: formData.get('full_name'),
      birth_date: formData.get('birth_date'),
      marriage_regime: formData.get('marriage_regime'),
      declaration_type: formData.get('declaration_type'),
      has_income: formData.get('has_income') === 'on',
      responsible_for_common_assets: formData.get('responsible_for_common_assets')
    }

    try {
      const response = await fetch('/api/profile/spouse', {
        method: data?.id ? 'PUT' : 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-user-id': userId!
        },
        body: JSON.stringify(spouseData)
      })

      if (response.ok) {
        setSuccess(true)
        loadData()
        setTimeout(() => setSuccess(false), 3000)
      }
    } catch (error) {
      console.error('[v0] Error updating spouse:', error)
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
        <CardTitle>2. Cônjuge</CardTitle>
        <CardDescription>
          Informações do cônjuge (se casado ou união estável)
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          {success && (
            <Alert>
              <AlertDescription>Dados do cônjuge salvos!</AlertDescription>
            </Alert>
          )}

          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="cpf">CPF do Cônjuge</Label>
              <Input
                id="cpf"
                name="cpf"
                placeholder="000.000.000-00"
                defaultValue={data?.cpf || ''}
                disabled={saving}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="full_name">Nome Completo</Label>
              <Input
                id="full_name"
                name="full_name"
                defaultValue={data?.full_name || ''}
                disabled={saving}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="birth_date">Data de Nascimento</Label>
              <Input
                id="birth_date"
                name="birth_date"
                type="date"
                defaultValue={data?.birth_date || ''}
                disabled={saving}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="marriage_regime">Regime de Casamento</Label>
              <Select
                name="marriage_regime"
                defaultValue={data?.marriage_regime || ''}
                disabled={saving}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Selecione" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="community">Comunhão Total de Bens</SelectItem>
                  <SelectItem value="partial_community">Comunhão Parcial de Bens</SelectItem>
                  <SelectItem value="separation">Separação de Bens</SelectItem>
                  <SelectItem value="participation">Participação Final nos Aquestos</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="declaration_type">Tipo de Declaração</Label>
              <Select
                name="declaration_type"
                defaultValue={data?.declaration_type || ''}
                disabled={saving}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Selecione" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="joint">Conjunta</SelectItem>
                  <SelectItem value="separate">Separada</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="responsible_for_common_assets">Responsável pelos Bens Comuns</Label>
              <Select
                name="responsible_for_common_assets"
                defaultValue={data?.responsible_for_common_assets || ''}
                disabled={saving}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Selecione" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="user">Você</SelectItem>
                  <SelectItem value="spouse">Cônjuge</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="flex items-center space-x-2 sm:col-span-2">
              <Checkbox
                id="has_income"
                name="has_income"
                defaultChecked={data?.has_income}
                disabled={saving}
              />
              <Label htmlFor="has_income" className="font-normal">
                Cônjuge possui rendimentos próprios
              </Label>
            </div>
          </div>

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
