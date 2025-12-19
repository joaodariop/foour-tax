'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { getSession, type User } from '@/lib/auth/session'
import { useOnboarding } from '@/lib/contexts/onboarding-context'
import { StatsCards } from '@/components/dashboard/stats-cards'
import { NotificationsPanel } from '@/components/dashboard/notifications-panel'
import { OpportunitiesCarousel } from '@/components/dashboard/opportunities-carousel'
import { OnboardingWizard } from '@/components/onboarding/onboarding-wizard'
import { DeductibleExpensesCard } from '@/components/dashboard/deductible-expenses-card'
import { OpenFinanceButton } from '@/components/open-finance/open-finance-button'
import { BankDeclarationUpload } from '@/components/bank-declaration/bank-declaration-upload'

export default function DashboardPage() {
  const router = useRouter()
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)
  const { isActive } = useOnboarding()

  useEffect(() => {
    const sessionUser = getSession()
    
    if (!sessionUser) {
      router.push('/login')
      return
    }
    
    setUser(sessionUser)
    setLoading(false)
  }, [router])

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4" />
          <p className="text-muted-foreground">Carregando dashboard...</p>
        </div>
      </div>
    )
  }

  return (
    <>
      {isActive && <OnboardingWizard />}

      {/* Welcome section */}
      <div className="mb-4">
        <h1 className="text-2xl font-bold">
          Bem-vindo, {user?.email?.split('@')[0] || 'Usuário'}!
        </h1>
        <p className="text-sm text-muted-foreground">
          Gerencie suas declarações de imposto de renda de forma simples e segura
        </p>
      </div>

      {/* Stats cards */}
      <StatsCards />

      <div className="grid gap-4 lg:grid-cols-2 mt-4">
        {/* Left column - Deductible expenses and integrations */}
        <div className="space-y-4">
          <DeductibleExpensesCard />
          
          <div className="grid gap-3">
            <OpenFinanceButton />
            <BankDeclarationUpload />
          </div>
        </div>

        {/* Right column - Opportunities */}
        <div className="space-y-4">
          <div>
            <h2 className="text-xl font-bold mb-3">Oportunidades para Você</h2>
            <OpportunitiesCarousel />
          </div>
        </div>
      </div>
    </>
  )
}
