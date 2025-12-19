'use client'

import { useState, useEffect } from 'react'
import { useAuth } from '@/lib/hooks/use-auth'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'

interface Donation {
  id: string
  recipient_name: string
  recipient_cpf_cnpj: string
  donation_type: string
  amount: number
  donation_date: string
}

export function DonationsSection() {
  const { user } = useAuth()
  const [donations, setDonations] = useState<Donation[]>([])
  const [loading, setLoading] = useState(true)
  const [open, setOpen] = useState(false)

  const loadDonations = async () => {
    if (!user?.id) return
    try {
      const res = await fetch('/api/declaration/donations', {
        headers: { 'x-user-id': user.id }
      })
      const data = await res.json()
      setDonations(data.donations || [])
    } catch (error) {
      console.error('[v0] Error loading donations:', error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadDonations()
  }, [user?.id])

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    if (!user?.id) return

    const formData = new FormData(e.currentTarget)
    const data = {
      recipient_name: formData.get('recipient_name'),
      recipient_cpf_cnpj: formData.get('recipient_cpf_cnpj'),
      donation_type: formData.get('donation_type'),
      amount: parseFloat(formData.get('amount') as string) || 0,
      donation_date: formData.get('donation_date'),
    }

    try {
      await fetch('/api/declaration/donations', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'x-user-id': user.id },
        body: JSON.stringify(data)
      })
      loadDonations()
      setOpen(false)
    } catch (error) {
      console.error('[v0] Error saving donation:', error)
    }
  }

  const handleDelete = async (id: string) => {
    if (!user?.id) return
    try {
      await fetch(`/api/declaration/donations/${id}`, {
        method: 'DELETE',
        headers: { 'x-user-id': user.id }
      })
      loadDonations()
    } catch (error) {
      console.error('[v0] Error deleting donation:', error)
    }
  }

  if (loading) return <div>Carregando...</div>

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-xl font-semibold">Doações Efetuadas</h2>
          <p className="text-sm text-muted-foreground">
            Doações para partidos, candidatos, fundos e instituições
          </p>
        </div>
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button>Adicionar Doação</Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Nova Doação</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-4">
                <div>
                  <Label htmlFor="recipient_name">Nome do Beneficiário *</Label>
                  <Input id="recipient_name" name="recipient_name" required />
                </div>
                <div>
                  <Label htmlFor="recipient_cpf_cnpj">CPF/CNPJ do Beneficiário *</Label>
                  <Input id="recipient_cpf_cnpj" name="recipient_cpf_cnpj" required />
                </div>
                <div>
                  <Label htmlFor="donation_type">Tipo de Doação *</Label>
                  <Input id="donation_type" name="donation_type" required placeholder="Ex: Cultura, Esporte, Político" />
                </div>
                <div>
                  <Label htmlFor="amount">Valor Doado *</Label>
                  <Input id="amount" name="amount" type="number" step="0.01" required placeholder="0,00" />
                </div>
                <div>
                  <Label htmlFor="donation_date">Data da Doação *</Label>
                  <Input id="donation_date" name="donation_date" type="date" required />
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
        {donations.length === 0 ? (
          <Card>
            <CardContent className="py-8 text-center text-muted-foreground">
              Nenhuma doação cadastrada
            </CardContent>
          </Card>
        ) : (
          donations.map((donation) => (
            <Card key={donation.id}>
              <CardHeader>
                <div className="flex justify-between items-start">
                  <div>
                    <CardTitle className="text-lg">{donation.recipient_name}</CardTitle>
                    <CardDescription>{donation.donation_type} - {donation.recipient_cpf_cnpj}</CardDescription>
                  </div>
                  <Button variant="ghost" size="sm" onClick={() => handleDelete(donation.id)}>Remover</Button>
                </div>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <p className="text-muted-foreground">Data</p>
                    <p className="font-semibold">{new Date(donation.donation_date).toLocaleDateString('pt-BR')}</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Valor</p>
                    <p className="font-semibold">R$ {donation.amount.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</p>
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
