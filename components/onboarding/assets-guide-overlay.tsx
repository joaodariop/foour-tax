'use client'

import { useEffect, useState } from 'react'
import { useOnboarding } from '@/lib/contexts/onboarding-context'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { ArrowDown, ArrowRight, CheckCircle2 } from 'lucide-react'

export function AssetsGuideOverlay() {
  const { currentStep, isActive, completeStep } = useOnboarding()
  const [hasScrolled, setHasScrolled] = useState(false)
  const [showGuide, setShowGuide] = useState(true)

  useEffect(() => {
    if (currentStep !== 'assets' || !isActive) {
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

  const handleComplete = () => {
    completeStep('completed')
    setShowGuide(false)
  }

  if (!isActive || currentStep !== 'assets' || !showGuide) return null

  return (
    <>
      {/* Sticky guide banner */}
      <div className="sticky top-0 z-50 bg-green-600 text-white shadow-lg">
        <div className="container mx-auto px-4 py-3">
          <div className="flex items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="flex size-8 items-center justify-center rounded-full bg-white/20 text-sm font-bold">
                2
              </div>
              <div>
                <p className="font-semibold">Tutorial: Cadastre seus bens e ativos</p>
                <p className="text-sm opacity-90">
                  {hasScrolled ? '✓ Navegando pelas categorias' : 'Use as setas ou arraste para ver todas as categorias'}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              {hasScrolled && (
                <Button
                  variant="secondary"
                  size="sm"
                  onClick={handleComplete}
                  className="gap-2"
                >
                  Concluir tutorial
                  <CheckCircle2 className="size-4" />
                </Button>
              )}
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setShowGuide(false)}
                className="text-white hover:bg-white/20"
              >
                Fechar
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Scroll/swipe indicator for mobile carousel */}
      {!hasScrolled && (
        <div className="fixed inset-x-0 bottom-8 z-40 flex justify-center pointer-events-none md:hidden">
          <Card className="pointer-events-auto shadow-2xl border-2 border-green-600 animate-pulse">
            <CardContent className="flex items-center gap-3 p-4">
              <ArrowRight className="size-6 text-green-600" />
              <div>
                <p className="font-semibold">Arraste para os lados</p>
                <p className="text-sm text-muted-foreground">
                  Navegue pelas 13 categorias de declaração
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Desktop scroll indicator */}
      {!hasScrolled && (
        <div className="fixed inset-x-0 bottom-8 z-40 justify-center pointer-events-none hidden md:flex">
          <Card className="pointer-events-auto shadow-2xl border-2 border-green-600">
            <CardContent className="flex items-center gap-3 p-4">
              <ArrowDown className="size-6 text-green-600" />
              <div>
                <p className="font-semibold">Role a página</p>
                <p className="text-sm text-muted-foreground">
                  Explore as categorias e seus campos
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </>
  )
}
