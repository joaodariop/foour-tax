'use client'

import { useEffect, useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'

interface AddressSectionProps {
  userId?: string
}

const brazilianStates = [
  { value: 'AC', label: 'Acre' },
  { value: 'AL', label: 'Alagoas' },
  { value: 'AP', label: 'Amapá' },
  { value: 'AM', label: 'Amazonas' },
  { value: 'BA', label: 'Bahia' },
  { value: 'CE', label: 'Ceará' },
  { value: 'DF', label: 'Distrito Federal' },
  { value: 'ES', label: 'Espírito Santo' },
  { value: 'GO', label: 'Goiás' },
  { value: 'MA', label: 'Maranhão' },
  { value: 'MT', label: 'Mato Grosso' },
  { value: 'MS', label: 'Mato Grosso do Sul' },
  { value: 'MG', label: 'Minas Gerais' },
  { value: 'PA', label: 'Pará' },
  { value: 'PB', label: 'Paraíba' },
  { value: 'PR', label: 'Paraná' },
  { value: 'PE', label: 'Pernambuco' },
  { value: 'PI', label: 'Piauí' },
  { value: 'RJ', label: 'Rio de Janeiro' },
  { value: 'RN', label: 'Rio Grande do Norte' },
  { value: 'RS', label: 'Rio Grande do Sul' },
  { value: 'RO', label: 'Rondônia' },
  { value: 'RR', label: 'Roraima' },
  { value: 'SC', label: 'Santa Catarina' },
  { value: 'SP', label: 'São Paulo' },
  { value: 'SE', label: 'Sergipe' },
  { value: 'TO', label: 'Tocantins' }
]

export function AddressSection({ userId }: AddressSectionProps) {
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
      const response = await fetch('/api/profile', {
        headers: { 'x-user-id': userId }
      })
      
      if (response.ok) {
        const result = await response.json()
        setData(result)
      }
    } catch (error) {
      console.error('[v0] Error loading address:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setSaving(true)
    setSuccess(false)

    const formData = new FormData(e.currentTarget)
    const updates = {
      address_zip: formData.get('address_zip'),
      address_street: formData.get('address_street'),
      address_number: formData.get('address_number'),
      address_complement: formData.get('address_complement'),
      address_neighborhood: formData.get('address_neighborhood'),
      address_city: formData.get('address_city'),
      address_state: formData.get('address_state')
    }

    try {
      const response = await fetch('/api/profile', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'x-user-id': userId!
        },
        body: JSON.stringify(updates)
      })

      if (response.ok) {
        setSuccess(true)
        setTimeout(() => setSuccess(false), 3000)
      }
    } catch (error) {
      console.error('[v0] Error updating address:', error)
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
        <CardTitle>4. Endereço e Contato</CardTitle>
        <CardDescription>
          Endereço residencial completo
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          {success && (
            <Alert>
              <AlertDescription>Endereço salvo com sucesso!</AlertDescription>
            </Alert>
          )}

          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="address_zip">CEP *</Label>
              <Input
                id="address_zip"
                name="address_zip"
                placeholder="00000-000"
                defaultValue={data?.address_zip || ''}
                required
                disabled={saving}
              />
            </div>

            <div className="space-y-2 sm:col-span-2">
              <Label htmlFor="address_street">Logradouro *</Label>
              <Input
                id="address_street"
                name="address_street"
                defaultValue={data?.address_street || ''}
                required
                disabled={saving}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="address_number">Número *</Label>
              <Input
                id="address_number"
                name="address_number"
                defaultValue={data?.address_number || ''}
                required
                disabled={saving}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="address_complement">Complemento</Label>
              <Input
                id="address_complement"
                name="address_complement"
                placeholder="Apto, Bloco, etc"
                defaultValue={data?.address_complement || ''}
                disabled={saving}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="address_neighborhood">Bairro *</Label>
              <Input
                id="address_neighborhood"
                name="address_neighborhood"
                defaultValue={data?.address_neighborhood || ''}
                required
                disabled={saving}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="address_city">Cidade *</Label>
              <Input
                id="address_city"
                name="address_city"
                defaultValue={data?.address_city || ''}
                required
                disabled={saving}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="address_state">Estado *</Label>
              <Select
                name="address_state"
                defaultValue={data?.address_state || ''}
                disabled={saving}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Selecione" />
                </SelectTrigger>
                <SelectContent>
                  {brazilianStates.map(state => (
                    <SelectItem key={state.value} value={state.value}>
                      {state.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
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
