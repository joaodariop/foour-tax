'use client'

import { useState, useEffect } from 'react'
import { useAuth } from '@/lib/hooks/use-auth'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'

interface TaxableIncomePJ {
  id: string
  cnpj: string
  company_name: string
  income_received: number
  social_security_contribution: number
  withheld_tax: number
  thirteenth_salary: number
  thirteenth_withheld_tax: number
}

export function TaxableIncomePJSection() {
  const { user } = useAuth()
  const [incomes, setIncomes] = useState<TaxableIncomePJ[]>([])
  const [loading, setLoading] = useState(true)
  const [open, setOpen] = useState(false)

  const loadIncomes = async () => {
    if (!user?.id) return
    try {
      const res = await fetch('/api/declaration/taxable-income-pj', {
        headers: { 'x-user-id': user.id }
      })
      const data = await res.json()
      setIncomes(data.incomes || [])
    } catch (error) {
      console.error('[v0] Error loading taxable income PJ:', error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadIncomes()
  }, [user?.id])

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    if (!user?.id) return

    const formData = new FormData(e.currentTarget)
    const data = {
      cnpj: formData.get('cnpj'),
      company_name: formData.get('company_name'),
      income_received: parseFloat(formData.get('income_received') as string) || 0,
      social_security_contribution: parseFloat(formData.get('social_security_contribution') as string) || 0,
      withheld_tax: parseFloat(formData.get('withheld_tax') as string) || 0,
      thirteenth_salary: parseFloat(formData.get('thirteenth_salary') as string) || 0,
      thirteenth_withheld_tax: parseFloat(formData.get('thirteenth_withheld_tax') as string) || 0,
    }

    try {
      await fetch('/api/declaration/taxable-income-pj', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'x-user-id': user.id },
        body: JSON.stringify(data)
      })
      loadIncomes()
      setOpen(false)
    } catch (error) {
      console.error('[v0] Error saving income:', error)
    }
  }

  if (loading) return <div>Carregando...</div>

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-xl font-semibold">Rendimentos Tributáveis de Pessoa Jurídica</h2>
          <p className="text-sm text-muted-foreground">
            Salários, pró-labore e outros rendimentos recebidos de empresas
          </p>
        </div>
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button>Adicionar Rendimento PJ</Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Novo Rendimento de Pessoa Jurídica</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="sm:col-span-2">
                  <Label htmlFor="cnpj">CNPJ da Fonte Pagadora *</Label>
                  <Input id="cnpj" name="cnpj" required placeholder="00.000.000/0000-00" />
                </div>
                <div className="sm:col-span-2">
                  <Label htmlFor="company_name">Nome da Empresa *</Label>
                  <Input id="company_name" name="company_name" required />
                </div>
                <div>
                  <Label htmlFor="income_received">Rendimentos Recebidos</Label>
                  <Input id="income_received" name="income_received" type="number" step="0.01" defaultValue="0" />
                </div>
                <div>
                  <Label htmlFor="social_security_contribution">Contribuição Previdenciária</Label>
                  <Input id="social_security_contribution" name="social_security_contribution" type="number" step="0.01" defaultValue="0" />
                </div>
                <div>
                  <Label htmlFor="withheld_tax">Imposto Retido na Fonte</Label>
                  <Input id="withheld_tax" name="withheld_tax" type="number" step="0.01" defaultValue="0" />
                </div>
                <div>
                  <Label htmlFor="thirteenth_salary">13º Salário</Label>
                  <Input id="thirteenth_salary" name="thirteenth_salary" type="number" step="0.01" defaultValue="0" />
                </div>
                <div>
                  <Label htmlFor="thirteenth_withheld_tax">IRRF do 13º</Label>
                  <Input id="thirteenth_withheld_tax" name="thirteenth_withheld_tax" type="number" step="0.01" defaultValue="0" />
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
        {incomes.length === 0 ? (
          <Card>
            <CardContent className="py-8 text-center text-muted-foreground">
              Nenhum rendimento de PJ cadastrado
            </CardContent>
          </Card>
        ) : (
          incomes.map((income) => (
            <Card key={income.id}>
              <CardHeader>
                <CardTitle className="text-lg">{income.company_name}</CardTitle>
                <CardDescription>CNPJ: {income.cnpj}</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 text-sm">
                  <div>
                    <p className="text-muted-foreground">Rendimentos</p>
                    <p className="font-semibold">R$ {income.income_received.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">INSS</p>
                    <p className="font-semibold">R$ {income.social_security_contribution.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">IRRF</p>
                    <p className="font-semibold">R$ {income.withheld_tax.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</p>
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
