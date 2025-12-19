'use client'

import { createContext, useContext, useState, useEffect, ReactNode } from 'react'
import { usePathname } from 'next/navigation'

type OnboardingStep = 'cpf' | 'profile' | 'assets' | 'completed'

interface OnboardingContextType {
  currentStep: OnboardingStep
  isActive: boolean
  cpf: string
  setCpf: (cpf: string) => void
  completeStep: (step: OnboardingStep) => void
  skipOnboarding: () => void
  restartOnboarding: () => void
}

const OnboardingContext = createContext<OnboardingContextType | undefined>(undefined)

export function OnboardingProvider({ children }: { children: ReactNode }) {
  const pathname = usePathname()
  const [currentStep, setCurrentStep] = useState<OnboardingStep>('cpf')
  const [isActive, setIsActive] = useState(false)
  const [cpf, setCpf] = useState('')

  useEffect(() => {
    const onboardingStatus = localStorage.getItem('onboarding_status')
    if (!onboardingStatus || onboardingStatus === 'active') {
      setIsActive(true)
    }
    
    const savedStep = localStorage.getItem('onboarding_step') as OnboardingStep
    const savedCpf = localStorage.getItem('onboarding_cpf')
    if (savedStep) setCurrentStep(savedStep)
    if (savedCpf) setCpf(savedCpf)
  }, [])

  const completeStep = (step: OnboardingStep) => {
    const stepOrder: OnboardingStep[] = ['cpf', 'profile', 'assets', 'completed']
    const currentIndex = stepOrder.indexOf(currentStep)
    const newIndex = stepOrder.indexOf(step)
    
    if (newIndex > currentIndex) {
      setCurrentStep(step)
      localStorage.setItem('onboarding_step', step)
      
      if (step === 'completed') {
        setIsActive(false)
        localStorage.setItem('onboarding_status', 'completed')
      }
    }
  }

  const skipOnboarding = () => {
    setIsActive(false)
    localStorage.setItem('onboarding_status', 'skipped')
  }

  const restartOnboarding = () => {
    setIsActive(true)
    setCurrentStep('cpf')
    localStorage.setItem('onboarding_status', 'active')
    localStorage.setItem('onboarding_step', 'cpf')
  }

  useEffect(() => {
    if (cpf) {
      localStorage.setItem('onboarding_cpf', cpf)
    }
  }, [cpf])

  return (
    <OnboardingContext.Provider
      value={{
        currentStep,
        isActive,
        cpf,
        setCpf,
        completeStep,
        skipOnboarding,
        restartOnboarding,
      }}
    >
      {children}
    </OnboardingContext.Provider>
  )
}

export function useOnboarding() {
  const context = useContext(OnboardingContext)
  if (!context) {
    throw new Error('useOnboarding must be used within OnboardingProvider')
  }
  return context
}
