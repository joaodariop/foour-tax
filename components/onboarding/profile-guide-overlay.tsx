'use client'

import { useEffect, useState } from 'react'
import { useOnboarding } from '@/lib/contexts/onboarding-context'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import { ArrowDown, ArrowRight, CheckCircle2 } from 'lucide-react'
import { useRouter } from 'next/navigation'

export function ProfileGuideOverlay() {
  const { currentStep, isActive, completeStep } = useOnboarding()
  const router = useRouter()
  const [hasScrolled, setHasScrolled] = useState(false)
  const [showGuide, setShowGuide] = useState(true)

  useEffect(() => {
    if (currentStep !== 'profile' || !isActive) {
      setShowGuide(false)
      return
    }

    const handleScroll = () => {
      if (window.scrollY > 100 && !hasScrolled) {
        setHasScrolled(true)
      }
    }

    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [currentStep, isActive, hasScrolled])

  const handleContinue = () => {
    completeStep('assets')
    router.push('/assets')
  }

  if (!isActive || currentStep !== 'profile' || !showGuide) return null

  return (
    <>
      {/* Sticky guide banner at top */}
      <div className="sticky top-0 z-50 bg-primary text-primary-foreground shadow-lg">
        <div className="container mx-auto px-4 py-3">
          <div className="flex items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="flex size-8 items-center justify-center rounded-full bg-primary-foreground/20 text-sm font-bold">
                1
              </div>
              <div>
                <p className="font-semibold">Tutorial: Preencha seu perfil</p>
                <p className="text-sm opacity-90">
                  {hasScrolled ? '✓ Explorando as seções' : 'Role a página para ver todas as seções'}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              {hasScrolled && (
                <Button
                  variant="secondary"
                  size="sm"
                  onClick={handleContinue}
                  className="gap-2"
                >
                  Continuar para Bens e Ativos
                  <ArrowRight className="size-4" />
                </Button>
              )}
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setShowGuide(false)}
                className="text-primary-foreground hover:bg-primary-foreground/20"
              >
                Fechar
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Scroll indicator */}
      {!hasScrolled && (
        <div className="fixed inset-x-0 bottom-8 z-40 flex justify-center pointer-events-none">
          <Card className="pointer-events-auto shadow-2xl border-2 border-primary animate-bounce">
            <CardContent className="flex items-center gap-3 p-4">
              <ArrowDown className="size-6 text-primary" />
              <div>
                <p className="font-semibold">Role para baixo</p>
                <p className="text-sm text-muted-foreground">
                  Explore todas as abas e campos disponíveis
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </>
  )
}
