'use client'

import { useState, useEffect } from 'react'
import { useAuth } from '@/lib/hooks/use-auth'
import { Button } from '@/components/ui/button'
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { PurchaseDeclarationDialog } from './purchase-declaration-dialog'

interface CreateDeclarationDialogProps {
  children: React.ReactNode
  onSuccess?: () => void
}

export function CreateDeclarationDialog({ children, onSuccess }: CreateDeclarationDialogProps) {
  const { user } = useAuth()
  const [open, setOpen] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [canCreateDeclaration, setCanCreateDeclaration] = useState(false)
  const [validationMessage, setValidationMessage] = useState('')
  const [checkingRequirements, setCheckingRequirements] = useState(true)
  const [createdDeclarationId, setCreatedDeclarationId] = useState<string | null>(null)
  const [showPurchase, setShowPurchase] = useState(false)

  useEffect(() => {
    async function checkRequirements() {
      if (!user?.id) return
      
      try {
        const [profileRes, assetsRes] = await Promise.all([
          fetch('/api/profile', {
            headers: { 'x-user-id': user.id }
          }),
          fetch('/api/assets', {
            headers: { 'x-user-id': user.id }
          })
        ])

        const profile = await profileRes.json()
        const assets = await assetsRes.json()

        const hasProfile = profile?.cpf && profile?.cpf.length > 0
        const hasAssets = assets?.assets && assets.assets.length > 0

        if (!hasProfile && !hasAssets) {
          setValidationMessage('Complete seu perfil e cadastre ao menos um bem antes de criar uma declaração.')
          setCanCreateDeclaration(false)
        } else if (!hasProfile) {
          setValidationMessage('Complete seu perfil antes de criar uma declaração.')
          setCanCreateDeclaration(false)
        } else if (!hasAssets) {
          setValidationMessage('Cadastre ao menos um bem antes de criar uma declaração.')
          setCanCreateDeclaration(false)
        } else {
          setCanCreateDeclaration(true)
        }
      } catch (error) {
        console.error('[v0] Error checking requirements:', error)
      } finally {
        setCheckingRequirements(false)
      }
    }

    if (open) {
      checkRequirements()
    }
  }, [open, user?.id])

  const currentYear = new Date().getFullYear()
  const availableYears = Array.from({ length: 5 }, (_, i) => currentYear - i)

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    const formData = new FormData(e.currentTarget)
    const declaration = {
      user_id: user?.id,
      year: parseInt(formData.get('year') as string),
      status: 'draft',
      type: formData.get('declaration_type') as string || null,
    }

    const response = await fetch('/api/declarations', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-user-id': user?.id || ''
      },
      body: JSON.stringify(declaration),
    })

    const data = await response.json()

    if (!response.ok) {
      console.error('[v0] Error creating declaration:', data.error)
      if (data.error?.includes('duplicate') || data.error?.includes('já possui')) {
        setError('Você já possui uma declaração para este ano')
      } else {
        setError('Erro ao criar declaração: ' + data.error)
      }
      setLoading(false)
    } else {
      setCreatedDeclarationId(data.declaration.id)
      setShowPurchase(true)
      setLoading(false)
    }
  }

  const handlePurchaseSuccess = () => {
    setOpen(false)
    setShowPurchase(false)
    setCreatedDeclarationId(null)
    onSuccess?.()
  }

  return (
    <>
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger asChild>{children}</DialogTrigger>
        <DialogContent className="max-w-lg">
          {checkingRequirements ? (
            <div className="py-8 text-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4" />
              <p className="text-sm text-muted-foreground">Verificando requisitos...</p>
            </div>
          ) : !canCreateDeclaration ? (
            <>
              <DialogHeader>
                <DialogTitle>Requisitos Não Atendidos</DialogTitle>
                <DialogDescription>
                  Complete os passos necessários antes de criar uma declaração
                </DialogDescription>
              </DialogHeader>
              <div className="py-4">
                <Alert>
                  <AlertDescription>{validationMessage}</AlertDescription>
                </Alert>
                <div className="mt-4 space-y-2">
                  <Button asChild variant="outline" className="w-full">
                    <a href="/profile">Completar Perfil</a>
                  </Button>
                  <Button asChild variant="outline" className="w-full">
                    <a href="/assets">Cadastrar Bens</a>
                  </Button>
                </div>
              </div>
              <DialogFooter>
                <Button variant="ghost" onClick={() => setOpen(false)}>
                  Fechar
                </Button>
              </DialogFooter>
            </>
          ) : (
            <form onSubmit={handleSubmit}>
              <DialogHeader>
                <DialogTitle>Nova Declaração IRPF</DialogTitle>
                <DialogDescription>
                  Inicie uma nova declaração de imposto de renda
                </DialogDescription>
              </DialogHeader>

              <div className="space-y-4 py-4">
                {error && (
                  <Alert variant="destructive">
                    <AlertDescription>{error}</AlertDescription>
                  </Alert>
                )}

                <div className="space-y-2">
                  <Label htmlFor="year">Ano de Exercício *</Label>
                  <Select name="year" required>
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione o ano" />
                    </SelectTrigger>
                    <SelectContent>
                      {availableYears.map(year => (
                        <SelectItem key={year} value={year.toString()}>
                          {year}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <p className="text-xs text-muted-foreground">
                    Selecione o ano-calendário dos rendimentos que deseja declarar
                  </p>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="declaration_type">Tipo de Declaração *</Label>
                  <Select name="declaration_type" required>
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="complete">Completa</SelectItem>
                      <SelectItem value="simplified">Simplificada</SelectItem>
                    </SelectContent>
                  </Select>
                  <p className="text-xs text-muted-foreground">
                    Completa: deduções detalhadas | Simplificada: desconto padrão de 20%
                  </p>
                </div>
              </div>

              <DialogFooter>
                <Button type="button" variant="outline" onClick={() => setOpen(false)} disabled={loading}>
                  Cancelar
                </Button>
                <Button type="submit" disabled={loading}>
                  {loading ? 'Criando...' : 'Criar Declaração'}
                </Button>
              </DialogFooter>
            </form>
          )}
        </DialogContent>
      </Dialog>

      {showPurchase && createdDeclarationId && (
        <PurchaseDeclarationDialog
          open={showPurchase}
          onOpenChange={setShowPurchase}
          declarationId={createdDeclarationId}
          onSuccess={handlePurchaseSuccess}
        />
      )}
    </>
  )
}
