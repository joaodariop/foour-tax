'use client'

import { useEffect, useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
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

interface BankAccountsSectionProps {
  userId?: string
}

export function BankAccountsSection({ userId }: BankAccountsSectionProps) {
  const [loading, setLoading] = useState(true)
  const [accounts, setAccounts] = useState<any[]>([])
  const [dialogOpen, setDialogOpen] = useState(false)

  useEffect(() => {
    loadData()
  }, [userId])

  const loadData = async () => {
    if (!userId) return
    
    try {
      const response = await fetch('/api/profile/bank-accounts', {
        headers: { 'x-user-id': userId }
      })
      
      if (response.ok) {
        const result = await response.json()
        setAccounts(result.accounts || [])
      }
    } catch (error) {
      console.error('[v0] Error loading bank accounts:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Deseja remover esta conta?')) return

    try {
      await fetch(`/api/profile/bank-accounts/${id}`, {
        method: 'DELETE',
        headers: { 'x-user-id': userId! }
      })
      loadData()
    } catch (error) {
      console.error('[v0] Error deleting bank account:', error)
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
            <CardTitle>5. Dados Bancários</CardTitle>
            <CardDescription>
              Para restituição ou débito automático
            </CardDescription>
          </div>
          <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
            <DialogTrigger asChild>
              <Button size="sm">
                Adicionar Conta
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl">
              <DialogHeader>
                <DialogTitle>Adicionar Conta Bancária</DialogTitle>
                <DialogDescription>
                  Preencha os dados da conta
                </DialogDescription>
              </DialogHeader>
              <BankAccountForm userId={userId} onSuccess={() => { setDialogOpen(false); loadData(); }} />
            </DialogContent>
          </Dialog>
        </div>
      </CardHeader>
      <CardContent>
        {accounts.length === 0 ? (
          <p className="text-muted-foreground text-center py-8">
            Nenhuma conta cadastrada
          </p>
        ) : (
          <div className="space-y-4">
            {accounts.map((account) => (
              <div key={account.id} className="flex items-center justify-between p-4 border rounded-lg">
                <div className="flex-1">
                  <p className="font-medium">{account.bank_name}</p>
                  <p className="text-sm text-muted-foreground">
                    Ag: {account.agency} • Conta: {account.account_number} • {account.account_type}
                  </p>
                  {account.is_default && (
                    <span className="text-xs bg-primary/10 text-primary px-2 py-0.5 rounded">
                      Padrão
                    </span>
                  )}
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => handleDelete(account.id)}
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

function BankAccountForm({ userId, onSuccess }: { userId?: string; onSuccess: () => void }) {
  const [saving, setSaving] = useState(false)

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setSaving(true)

    const formData = new FormData(e.currentTarget)
    const accountData = {
      bank_code: formData.get('bank_code'),
      bank_name: formData.get('bank_name'),
      agency: formData.get('agency'),
      account_number: formData.get('account_number'),
      account_type: formData.get('account_type'),
      ownership: formData.get('ownership'),
      is_default: formData.get('is_default') === 'on',
      auto_debit_authorized: formData.get('auto_debit_authorized') === 'on'
    }

    try {
      const response = await fetch('/api/profile/bank-accounts', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-user-id': userId!
        },
        body: JSON.stringify(accountData)
      })

      if (response.ok) {
        onSuccess()
      }
    } catch (error) {
      console.error('[v0] Error creating bank account:', error)
    } finally {
      setSaving(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid gap-4 sm:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="bank_code">Código do Banco</Label>
          <Input id="bank_code" name="bank_code" placeholder="001" disabled={saving} />
        </div>

        <div className="space-y-2">
          <Label htmlFor="bank_name">Nome do Banco *</Label>
          <Input id="bank_name" name="bank_name" required disabled={saving} />
        </div>

        <div className="space-y-2">
          <Label htmlFor="agency">Agência *</Label>
          <Input id="agency" name="agency" required disabled={saving} />
        </div>

        <div className="space-y-2">
          <Label htmlFor="account_number">Número da Conta *</Label>
          <Input id="account_number" name="account_number" required disabled={saving} />
        </div>

        <div className="space-y-2">
          <Label htmlFor="account_type">Tipo de Conta *</Label>
          <Select name="account_type" required disabled={saving}>
            <SelectTrigger>
              <SelectValue placeholder="Selecione" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="corrente">Conta Corrente</SelectItem>
              <SelectItem value="poupanca">Conta Poupança</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="ownership">Titularidade *</Label>
          <Select name="ownership" required disabled={saving}>
            <SelectTrigger>
              <SelectValue placeholder="Selecione" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="own">Própria</SelectItem>
              <SelectItem value="joint">Conjunta</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="flex flex-col gap-3 sm:col-span-2">
          <div className="flex items-center space-x-2">
            <Checkbox id="is_default" name="is_default" disabled={saving} />
            <Label htmlFor="is_default" className="font-normal">
              Definir como conta padrão
            </Label>
          </div>

          <div className="flex items-center space-x-2">
            <Checkbox id="auto_debit_authorized" name="auto_debit_authorized" disabled={saving} />
            <Label htmlFor="auto_debit_authorized" className="font-normal">
              Autorizar débito automático da 1ª quota
            </Label>
          </div>
        </div>
      </div>

      <div className="flex justify-end gap-3">
        <Button type="submit" disabled={saving}>
          {saving ? 'Salvando...' : 'Salvar Conta'}
        </Button>
      </div>
    </form>
  )
}
