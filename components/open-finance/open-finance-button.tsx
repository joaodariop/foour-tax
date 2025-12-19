'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import { Loader2, Landmark, AlertCircle } from 'lucide-react'

export function OpenFinanceButton() {
  const [isOpen, setIsOpen] = useState(false)
  const [isConnecting, setIsConnecting] = useState(false)
  const [showHomologation, setShowHomologation] = useState(false)

  const handleConnect = async () => {
    setIsConnecting(true)
    
    // Simulate connection attempt
    await new Promise(resolve => setTimeout(resolve, 2000))
    
    setIsConnecting(false)
    setShowHomologation(true)
  }

  return (
    <>
      <Button 
        onClick={() => setIsOpen(true)} 
        variant="outline"
        className="w-full"
      >
        <Landmark className="mr-2 size-4" />
        Conectar Open Finance
      </Button>

      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Landmark className="size-5" />
              Open Finance
            </DialogTitle>
            <DialogDescription>
              Conecte suas contas bancárias automaticamente
            </DialogDescription>
          </DialogHeader>

          {!showHomologation ? (
            <div className="space-y-4">
              <Alert>
                <AlertCircle className="size-4" />
                <AlertTitle>Importação Automática</AlertTitle>
                <AlertDescription className="text-sm">
                  Com o Open Finance, você pode importar automaticamente:
                  <ul className="list-disc list-inside mt-2 space-y-1">
                    <li>Saldos e investimentos</li>
                    <li>Rendimentos e dividendos</li>
                    <li>Movimentações financeiras</li>
                    <li>Declarações anuais do banco</li>
                  </ul>
                </AlertDescription>
              </Alert>

              <div className="flex gap-2">
                <Button 
                  onClick={handleConnect} 
                  disabled={isConnecting}
                  className="flex-1"
                >
                  {isConnecting && <Loader2 className="mr-2 size-4 animate-spin" />}
                  {isConnecting ? 'Conectando...' : 'Conectar Agora'}
                </Button>
                <Button 
                  variant="outline" 
                  onClick={() => setIsOpen(false)}
                  disabled={isConnecting}
                >
                  Cancelar
                </Button>
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              <Alert variant="default" className="border-amber-500 bg-amber-50">
                <AlertCircle className="size-4 text-amber-600" />
                <AlertTitle className="text-amber-900">Em Homologação</AlertTitle>
                <AlertDescription className="text-sm text-amber-800">
                  No momento, a integração com Open Finance está em fase de homologação. 
                  Em breve você poderá conectar suas contas automaticamente.
                </AlertDescription>
              </Alert>

              <div className="rounded-lg border bg-muted/30 p-4">
                <p className="text-sm font-medium mb-2">Enquanto isso, você pode:</p>
                <ul className="text-sm space-y-1.5 text-muted-foreground">
                  <li>• Cadastrar manualmente seus bens e ativos</li>
                  <li>• Solicitar declaração anual no seu banco</li>
                  <li>• Anexar documentos bancários</li>
                </ul>
              </div>

              <Button onClick={() => setIsOpen(false)} className="w-full">
                Entendi
              </Button>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </>
  )
}
