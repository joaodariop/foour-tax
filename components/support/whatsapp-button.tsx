'use client'

import { MessageCircle } from 'lucide-react'
import { Button } from '@/components/ui/button'
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip'

export function WhatsAppButton() {
  const handleWhatsAppClick = () => {
    const phoneNumber = '5511999999999' // Format: country code + number
    const message = encodeURIComponent('Olá! Preciso de ajuda com minha declaração de IR no Foour.')
    const whatsappUrl = `https://wa.me/${phoneNumber}?text=${message}`
    
    window.open(whatsappUrl, '_blank')
  }

  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <Button
            onClick={handleWhatsAppClick}
            size="lg"
            className="fixed bottom-6 right-6 h-14 w-14 rounded-full shadow-lg hover:shadow-xl transition-all z-50 bg-green-600 hover:bg-green-700"
          >
            <MessageCircle className="size-6" />
            <span className="sr-only">Falar com agente IA via WhatsApp</span>
          </Button>
        </TooltipTrigger>
        <TooltipContent side="left" className="max-w-xs">
          <p className="font-medium">Precisa de ajuda?</p>
          <p className="text-sm text-muted-foreground">
            Fale com nosso agente de IA via WhatsApp
          </p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  )
}
