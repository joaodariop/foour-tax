'use client'

import { useState, useEffect } from 'react'
import { useAuth } from '@/lib/hooks/use-auth'
import { useRouter } from 'next/navigation'
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Separator } from '@/components/ui/separator'
import { CheckCircle2, AlertTriangle } from 'lucide-react'

interface PurchaseDeclarationDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  declarationId: string
  onSuccess: () => void
}

export function PurchaseDeclarationDialog({ 
  open, 
  onOpenChange, 
  declarationId,
  onSuccess 
}: PurchaseDeclarationDialogProps) {
  const { user } = useAuth()
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [price, setPrice] = useState<number>(0)
  const [loadingPrice, setLoadingPrice] = useState(true)

  useEffect(() => {
    if (open) {
      fetchPrice()
    }
  }, [open])

  const fetchPrice = async () => {
    try {
      const res = await fetch('/api/declarations/price')
      const data = await res.json()
      setPrice(data.amount || 149.90)
    } catch (error) {
      console.error('Error fetching price:', error)
      setPrice(149.90)
    } finally {
      setLoadingPrice(false)
    }
  }

  const handlePurchase = async () => {
    setLoading(true)
    
    try {
      const res = await fetch('/api/declarations/purchase', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-user-id': user?.id || ''
        },
        body: JSON.stringify({
          declaration_id: declarationId,
          amount: price
        })
      })
      
      const data = await res.json()
      
      if (!res.ok) throw new Error('Erro ao processar compra')
      
      if (data.classification?.requiresManualReview) {
        // Show notification about manual review
        alert('Sua declaração será revisada por nossa equipe devido à complexidade. Você receberá um retorno em até 48 horas.')
      }
      
      onSuccess()
      onOpenChange(false)
      
      // Redirect to tutorial
      router.push(`/declarations/${declarationId}/tutorial`)
    } catch (error) {
      console.error('Error purchasing:', error)
      alert('Erro ao processar compra. Tente novamente.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle>Adquirir Declaração</DialogTitle>
          <DialogDescription>
            Complete a compra para iniciar o preenchimento da sua declaração
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-4">
          <div className="bg-muted p-4 rounded-lg">
            <div className="flex justify-between items-center mb-2">
              <span className="text-sm text-muted-foreground">Declaração IRPF</span>
              {loadingPrice ? (
                <div className="h-6 w-20 bg-gray-300 animate-pulse rounded" />
              ) : (
                <span className="text-2xl font-bold">
                  {new Intl.NumberFormat('pt-BR', {
                    style: 'currency',
                    currency: 'BRL'
                  }).format(price)}
                </span>
              )}
            </div>
            <p className="text-xs text-muted-foreground">
              Inclui preenchimento guiado e suporte completo
            </p>
          </div>

          <Separator />

          <div className="space-y-2">
            <h4 className="font-semibold text-sm">O que está incluído:</h4>
            <ul className="space-y-2">
              {[
                'Tutorial passo a passo personalizado',
                'Revisão automática de inconsistências',
                'Suporte via WhatsApp com IA',
                'Exportação para programa da Receita Federal'
              ].map((item, i) => (
                <li key={i} className="flex items-start gap-2 text-sm">
                  <CheckCircle2 className="h-4 w-4 text-green-600 mt-0.5 flex-shrink-0" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>

          <Alert>
            <AlertDescription className="text-sm">
              Neste momento, estamos em fase beta. A compra será registrada mas não haverá cobrança real.
            </AlertDescription>
          </Alert>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)} disabled={loading}>
            Cancelar
          </Button>
          <Button onClick={handlePurchase} disabled={loading || loadingPrice}>
            {loading ? 'Processando...' : 'Adquirir Agora'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
