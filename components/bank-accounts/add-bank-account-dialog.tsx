'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { useAuth } from '@/lib/hooks/use-auth'
import { Plus } from 'lucide-react'

const accountTypes = [
  { value: 'checking', label: 'Conta Corrente' },
  { value: 'savings', label: 'Poupança' },
  { value: 'investment', label: 'Investimento' },
  { value: 'salary', label: 'Conta Salário' },
]

const ownerships = [
  { value: 'individual', label: 'Individual' },
  { value: 'joint', label: 'Conjunta' },
]

interface AddBankAccountDialogProps {
  onAccountAdded: () => void
}

export function AddBankAccountDialog({ onAccountAdded }: AddBankAccountDialogProps) {
  const { user } = useAuth()
  const [open, setOpen] = useState(false)
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState({
    bank_name: '',
    bank_code: '',
    agency: '',
    account_number: '',
    account_type: 'checking',
    ownership: 'individual',
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      const response = await fetch('/api/bank-accounts', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-user-id': user?.id || '',
        },
        body: JSON.stringify(formData),
      })

      if (response.ok) {
        setOpen(false)
        setFormData({
          bank_name: '',
          bank_code: '',
          agency: '',
          account_number: '',
          account_type: 'checking',
          ownership: 'individual',
        })
        onAccountAdded()
      }
    } catch (error) {
      console.error('[v0] Error adding bank account:', error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" className="w-full">
          <Plus className="mr-2 h-4 w-4" />
          Adicionar Conta Manualmente
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Adicionar Conta Bancária</DialogTitle>
          <DialogDescription>
            Preencha os dados da sua conta bancária para gerenciar suas declarações
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="bank_name">Nome do Banco</Label>
            <Input
              id="bank_name"
              value={formData.bank_name}
              onChange={e => setFormData({ ...formData, bank_name: e.target.value })}
              placeholder="Ex: Banco do Brasil"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="bank_code">Código do Banco</Label>
            <Input
              id="bank_code"
              value={formData.bank_code}
              onChange={e => setFormData({ ...formData, bank_code: e.target.value })}
              placeholder="Ex: 001"
              maxLength={3}
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="agency">Agência</Label>
              <Input
                id="agency"
                value={formData.agency}
                onChange={e => setFormData({ ...formData, agency: e.target.value })}
                placeholder="0000"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="account_number">Número da Conta</Label>
              <Input
                id="account_number"
                value={formData.account_number}
                onChange={e => setFormData({ ...formData, account_number: e.target.value })}
                placeholder="00000-0"
                required
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="account_type">Tipo de Conta</Label>
            <Select
              value={formData.account_type}
              onValueChange={value => setFormData({ ...formData, account_type: value })}
            >
              <SelectTrigger id="account_type">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {accountTypes.map(type => (
                  <SelectItem key={type.value} value={type.value}>
                    {type.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="ownership">Titularidade</Label>
            <Select
              value={formData.ownership}
              onValueChange={value => setFormData({ ...formData, ownership: value })}
            >
              <SelectTrigger id="ownership">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {ownerships.map(own => (
                  <SelectItem key={own.value} value={own.value}>
                    {own.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="flex gap-2">
            <Button type="button" variant="outline" onClick={() => setOpen(false)} className="flex-1">
              Cancelar
            </Button>
            <Button type="submit" disabled={loading} className="flex-1">
              {loading ? 'Adicionando...' : 'Adicionar Conta'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}
