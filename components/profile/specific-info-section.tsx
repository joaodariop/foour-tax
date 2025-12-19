'use client'

import { useEffect, useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Checkbox } from '@/components/ui/checkbox'

interface SpecificInfoSectionProps {
  userId?: string
}

export function SpecificInfoSection({ userId }: SpecificInfoSectionProps) {
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
      const response = await fetch('/api/profile/taxpayer-info', {
        headers: { 'x-user-id': userId }
      })
      
      if (response.ok) {
        const result = await response.json()
        setData(result)
      }
    } catch (error) {
      console.error('[v0] Error loading taxpayer info:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setSaving(true)
    setSuccess(false)

    const formData = new FormData(e.currentTarget)
    const infoData = {
      occupation_code: formData.get('occupation_code'),
      occupation_nature: formData.get('occupation_nature'),
      declaration_type: formData.get('declaration_type'),
      previous_receipt_number: formData.get('previous_receipt_number'),
      changed_address_during_year: formData.get('changed_address_during_year') === 'on',
      resident_in_brazil: formData.get('resident_in_brazil') === 'on',
      has_foreign_assets: formData.get('has_foreign_assets') === 'on',
      started_activity: formData.get('started_activity') === 'on',
      ended_activity: formData.get('ended_activity') === 'on',
      authorizes_prefilled: formData.get('authorizes_prefilled') === 'on',
      authorizes_sharing_with_rfb: formData.get('authorizes_sharing_with_rfb') === 'on'
    }

    try {
      const response = await fetch('/api/profile/taxpayer-info', {
        method: data?.id ? 'PUT' : 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-user-id': userId!
        },
        body: JSON.stringify(infoData)
      })

      if (response.ok) {
        setSuccess(true)
        setTimeout(() => setSuccess(false), 3000)
      }
    } catch (error) {
      console.error('[v0] Error updating taxpayer info:', error)
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
        <CardTitle>6. Informações Específicas</CardTitle>
        <CardDescription>
          Dados adicionais para a declaração
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          {success && (
            <Alert>
              <AlertDescription>Informações salvas!</AlertDescription>
            </Alert>
          )}

          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="occupation_code">Código da Ocupação</Label>
              <Input
                id="occupation_code"
                name="occupation_code"
                defaultValue={data?.occupation_code || ''}
                disabled={saving}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="occupation_nature">Natureza da Ocupação</Label>
              <Select
                name="occupation_nature"
                defaultValue={data?.occupation_nature || ''}
                disabled={saving}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Selecione" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="clt">CLT</SelectItem>
                  <SelectItem value="autonomo">Autônomo</SelectItem>
                  <SelectItem value="empresario">Empresário</SelectItem>
                  <SelectItem value="aposentado">Aposentado</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="declaration_type">Tipo de Declaração</Label>
              <Select
                name="declaration_type"
                defaultValue={data?.declaration_type || 'original'}
                disabled={saving}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Selecione" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="original">Original</SelectItem>
                  <SelectItem value="retificadora">Retificadora</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="previous_receipt_number">Nº Recibo Declaração Anterior</Label>
              <Input
                id="previous_receipt_number"
                name="previous_receipt_number"
                defaultValue={data?.previous_receipt_number || ''}
                disabled={saving}
              />
            </div>

            <div className="flex flex-col gap-3 sm:col-span-2">
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="changed_address_during_year"
                  name="changed_address_during_year"
                  defaultChecked={data?.changed_address_during_year}
                  disabled={saving}
                />
                <Label htmlFor="changed_address_during_year" className="font-normal">
                  Mudou de endereço durante o ano
                </Label>
              </div>

              <div className="flex items-center space-x-2">
                <Checkbox
                  id="resident_in_brazil"
                  name="resident_in_brazil"
                  defaultChecked={data?.resident_in_brazil ?? true}
                  disabled={saving}
                />
                <Label htmlFor="resident_in_brazil" className="font-normal">
                  Residente no Brasil
                </Label>
              </div>

              <div className="flex items-center space-x-2">
                <Checkbox
                  id="has_foreign_assets"
                  name="has_foreign_assets"
                  defaultChecked={data?.has_foreign_assets}
                  disabled={saving}
                />
                <Label htmlFor="has_foreign_assets" className="font-normal">
                  Possui bens no exterior
                </Label>
              </div>

              <div className="flex items-center space-x-2">
                <Checkbox
                  id="started_activity"
                  name="started_activity"
                  defaultChecked={data?.started_activity}
                  disabled={saving}
                />
                <Label htmlFor="started_activity" className="font-normal">
                  Iniciou atividade (autônomo)
                </Label>
              </div>

              <div className="flex items-center space-x-2">
                <Checkbox
                  id="ended_activity"
                  name="ended_activity"
                  defaultChecked={data?.ended_activity}
                  disabled={saving}
                />
                <Label htmlFor="ended_activity" className="font-normal">
                  Encerrou atividade (autônomo)
                </Label>
              </div>

              <div className="flex items-center space-x-2">
                <Checkbox
                  id="authorizes_prefilled"
                  name="authorizes_prefilled"
                  defaultChecked={data?.authorizes_prefilled ?? true}
                  disabled={saving}
                />
                <Label htmlFor="authorizes_prefilled" className="font-normal">
                  Autoriza declaração pré-preenchida
                </Label>
              </div>

              <div className="flex items-center space-x-2">
                <Checkbox
                  id="authorizes_sharing_with_rfb"
                  name="authorizes_sharing_with_rfb"
                  defaultChecked={data?.authorizes_sharing_with_rfb ?? true}
                  disabled={saving}
                />
                <Label htmlFor="authorizes_sharing_with_rfb" className="font-normal">
                  Autoriza compartilhamento com RFB
                </Label>
              </div>
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
