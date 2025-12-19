'use client'

import { useEffect, useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'

interface IdentificationSectionProps {
  userId?: string
}

export function IdentificationSection({ userId }: IdentificationSectionProps) {
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
      console.error('[v0] Error loading profile:', error)
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
      full_name: formData.get('full_name'),
      cpf: formData.get('cpf'),
      birth_date: formData.get('birth_date'),
      voter_id: formData.get('voter_id'),
      email: formData.get('email'),
      phone: formData.get('phone'),
      cell_phone: formData.get('cell_phone'),
      occupation: formData.get('occupation'),
      marital_status: formData.get('marital_status')
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
      console.error('[v0] Error updating profile:', error)
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
        <CardTitle>1. Identificação do Contribuinte</CardTitle>
        <CardDescription>
          Dados pessoais básicos para a declaração
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          {success && (
            <Alert>
              <AlertDescription>Dados salvos com sucesso!</AlertDescription>
            </Alert>
          )}

          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="full_name">Nome Completo *</Label>
              <Input
                id="full_name"
                name="full_name"
                defaultValue={data?.full_name || ''}
                required
                disabled={saving}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="cpf">CPF *</Label>
              <Input
                id="cpf"
                name="cpf"
                placeholder="000.000.000-00"
                defaultValue={data?.cpf || ''}
                required
                disabled={saving}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="birth_date">Data de Nascimento *</Label>
              <Input
                id="birth_date"
                name="birth_date"
                type="date"
                defaultValue={data?.birth_date || ''}
                required
                disabled={saving}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="voter_id">Título de Eleitor</Label>
              <Input
                id="voter_id"
                name="voter_id"
                defaultValue={data?.voter_id || ''}
                disabled={saving}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="email">E-mail *</Label>
              <Input
                id="email"
                name="email"
                type="email"
                defaultValue={data?.email || ''}
                required
                disabled={saving}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="phone">Telefone</Label>
              <Input
                id="phone"
                name="phone"
                type="tel"
                placeholder="(00) 0000-0000"
                defaultValue={data?.phone || ''}
                disabled={saving}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="cell_phone">Celular *</Label>
              <Input
                id="cell_phone"
                name="cell_phone"
                type="tel"
                placeholder="(00) 00000-0000"
                defaultValue={data?.cell_phone || ''}
                required
                disabled={saving}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="occupation">Ocupação Principal</Label>
              <Input
                id="occupation"
                name="occupation"
                defaultValue={data?.occupation || ''}
                disabled={saving}
              />
            </div>

            <div className="space-y-2 sm:col-span-2">
              <Label htmlFor="marital_status">Estado Civil *</Label>
              <Select
                name="marital_status"
                defaultValue={data?.marital_status || ''}
                disabled={saving}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Selecione" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="single">Solteiro(a)</SelectItem>
                  <SelectItem value="married">Casado(a)</SelectItem>
                  <SelectItem value="divorced">Divorciado(a)</SelectItem>
                  <SelectItem value="widowed">Viúvo(a)</SelectItem>
                  <SelectItem value="separated">Separado(a)</SelectItem>
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
