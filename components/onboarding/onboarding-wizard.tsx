'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Progress } from '@/components/ui/progress'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import { CheckCircle2, Loader2, AlertCircle, ArrowRight, FileText, User } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { useOnboarding } from '@/lib/contexts/onboarding-context'

type WizardStep = 'welcome' | 'cpf' | 'ecac-checking' | 'ecac-error' | 'profile-guide'

export function OnboardingWizard() {
  const router = useRouter()
  const { isActive, cpf, setCpf, completeStep, skipOnboarding } = useOnboarding()
  const [step, setStep] = useState<WizardStep>('welcome')
  const [showWizard, setShowWizard] = useState(true)

  const handleCpfSubmit = async () => {
    if (cpf.replace(/\D/g, '').length < 11) {
      alert('CPF inválido. Digite um CPF válido.')
      return
    }

    setStep('ecac-checking')
    
    setTimeout(() => {
      setStep('ecac-error')
    }, 3000)
  }

  const handleStartTutorial = () => {
    setStep('profile-guide')
  }

  const handleGoToProfile = () => {
    completeStep('profile')
    setShowWizard(false)
    router.push('/profile')
  }

  const handleSkip = () => {
    skipOnboarding()
    setShowWizard(false)
  }

  const formatCpf = (value: string) => {
    const numbers = value.replace(/\D/g, '')
    if (numbers.length <= 11) {
      setCpf(numbers.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, '$1.$2.$3-$4'))
    }
  }

  if (!showWizard || !isActive) return null

  const progressMap = {
    'welcome': 0,
    'cpf': 25,
    'ecac-checking': 50,
    'ecac-error': 50,
    'profile-guide': 75,
  }

  return (
    <Dialog open={showWizard} onOpenChange={setShowWizard}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle className="text-2xl">
            {step === 'welcome' && '👋 Bem-vindo ao Foour!'}
            {step === 'cpf' && '📝 Primeiro passo: seu CPF'}
            {step === 'ecac-checking' && '🔍 Consultando e-CAC...'}
            {step === 'ecac-error' && '⚠️ Dados não disponíveis'}
            {step === 'profile-guide' && '🎯 Vamos começar!'}
          </DialogTitle>
          <DialogDescription>
            {step === 'welcome' && 'Configure sua conta em poucos passos simples'}
            {step === 'cpf' && 'Informe seu CPF para buscarmos suas declarações anteriores'}
            {step === 'ecac-checking' && 'Aguarde enquanto consultamos o sistema da Receita Federal'}
            {step === 'ecac-error' && 'Não se preocupe, vamos te guiar passo a passo'}
            {step === 'profile-guide' && 'Siga o tutorial para preencher seus dados'}
          </DialogDescription>
        </DialogHeader>

        <div className="my-4">
          <Progress value={progressMap[step]} className="h-2" />
        </div>

        <div className="space-y-4">
          {/* Welcome Step */}
          {step === 'welcome' && (
            <div className="space-y-4">
              <Alert>
                <CheckCircle2 className="size-4" />
                <AlertTitle>Comece por aqui!</AlertTitle>
                <AlertDescription>
                  Vamos te ajudar a preparar sua declaração de imposto de renda de forma rápida e descomplicada.
                </AlertDescription>
              </Alert>

              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">O que você vai fazer:</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex items-start gap-3">
                    <div className="rounded-full bg-primary/10 p-2">
                      <span className="text-sm font-bold text-primary">1</span>
                    </div>
                    <div>
                      <p className="font-medium">Informar seu CPF</p>
                      <p className="text-sm text-muted-foreground">
                        Vamos tentar buscar suas declarações anteriores
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="rounded-full bg-primary/10 p-2">
                      <span className="text-sm font-bold text-primary">2</span>
                    </div>
                    <div>
                      <p className="font-medium">Completar seu perfil</p>
                      <p className="text-sm text-muted-foreground">
                        Dados pessoais, endereço e dependentes
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="rounded-full bg-primary/10 p-2">
                      <span className="text-sm font-bold text-primary">3</span>
                    </div>
                    <div>
                      <p className="font-medium">Cadastrar bens e rendimentos</p>
                      <p className="text-sm text-muted-foreground">
                        Imóveis, veículos, investimentos e mais
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}

          {/* CPF Input Step */}
          {step === 'cpf' && (
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="cpf">CPF</Label>
                <Input
                  id="cpf"
                  placeholder="000.000.000-00"
                  value={cpf}
                  onChange={(e) => formatCpf(e.target.value)}
                  maxLength={14}
                  className="text-lg"
                />
                <p className="text-sm text-muted-foreground">
                  Vamos consultar o e-CAC para buscar suas declarações anteriores e facilitar o preenchimento
                </p>
              </div>

              <Alert>
                <AlertCircle className="size-4" />
                <AlertDescription>
                  Seus dados estão seguros e protegidos conforme a LGPD
                </AlertDescription>
              </Alert>
            </div>
          )}

          {/* e-CAC Checking Step */}
          {step === 'ecac-checking' && (
            <div className="flex flex-col items-center justify-center py-8 space-y-4">
              <Loader2 className="size-16 animate-spin text-primary" />
              <div className="text-center">
                <p className="font-medium">Consultando e-CAC da Receita Federal...</p>
                <p className="text-sm text-muted-foreground mt-2">
                  CPF: {cpf}
                </p>
                <p className="text-sm text-muted-foreground">
                  Isso pode levar alguns segundos
                </p>
              </div>
            </div>
          )}

          {/* e-CAC Error Step */}
          {step === 'ecac-error' && (
            <div className="space-y-4">
              <Alert variant="destructive">
                <AlertCircle className="size-4" />
                <AlertTitle>Não foi possível coletar dados do e-CAC</AlertTitle>
                <AlertDescription>
                  Não conseguimos acessar suas declarações anteriores no e-CAC para o CPF {cpf}.
                  Isso pode acontecer por diversos motivos.
                </AlertDescription>
              </Alert>

              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Mas não se preocupe!</CardTitle>
                  <CardDescription>
                    Vamos te guiar passo a passo no preenchimento manual
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-3">
                  <p className="text-sm">
                    Nosso sistema foi feito para ser simples e intuitivo. Você vai preencher:
                  </p>
                  <ul className="space-y-2 text-sm">
                    <li className="flex items-center gap-2">
                      <CheckCircle2 className="size-4 text-green-600" />
                      <span>Dados pessoais e de dependentes</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle2 className="size-4 text-green-600" />
                      <span>Bens e direitos (imóveis, veículos, etc)</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle2 className="size-4 text-green-600" />
                      <span>Rendimentos e despesas</span>
                    </li>
                  </ul>
                </CardContent>
              </Card>
            </div>
          )}

          {/* Profile Guide Step */}
          {step === 'profile-guide' && (
            <div className="space-y-4">
              <Alert>
                <User className="size-4" />
                <AlertTitle>Próximo passo: Complete seu perfil</AlertTitle>
                <AlertDescription>
                  Vamos começar pelos seus dados pessoais. É rápido e você pode salvar e voltar depois.
                </AlertDescription>
              </Alert>

              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Tutorial ativo</CardTitle>
                  <CardDescription>
                    Siga as instruções destacadas em cada página
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex items-center gap-3 p-3 bg-muted rounded-lg">
                    <User className="size-8 text-primary" />
                    <div>
                      <p className="font-medium">1. Perfil</p>
                      <p className="text-sm text-muted-foreground">
                        Preencha seus dados pessoais
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 p-3 bg-muted/50 rounded-lg">
                    <FileText className="size-8 text-muted-foreground" />
                    <div>
                      <p className="font-medium text-muted-foreground">2. Bens e Ativos</p>
                      <p className="text-sm text-muted-foreground">
                        Após completar o perfil
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}
        </div>

        <DialogFooter className="gap-2">
          {step !== 'ecac-checking' && (
            <Button variant="ghost" onClick={handleSkip}>
              Pular tutorial
            </Button>
          )}
          
          {step === 'welcome' && (
            <Button onClick={() => setStep('cpf')}>
              Começar <ArrowRight className="ml-2 size-4" />
            </Button>
          )}
          
          {step === 'cpf' && (
            <Button onClick={handleCpfSubmit} disabled={cpf.length < 14}>
              Consultar e-CAC <ArrowRight className="ml-2 size-4" />
            </Button>
          )}
          
          {step === 'ecac-error' && (
            <Button onClick={handleStartTutorial}>
              Iniciar tutorial <ArrowRight className="ml-2 size-4" />
            </Button>
          )}
          
          {step === 'profile-guide' && (
            <Button onClick={handleGoToProfile}>
              Ir para Perfil <ArrowRight className="ml-2 size-4" />
            </Button>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
