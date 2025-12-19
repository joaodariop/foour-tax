'use client'

import { useEffect, useState } from 'react'
import { useAuth } from '@/lib/hooks/use-auth'
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious, type CarouselApi } from '@/components/ui/carousel'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { ProfileGuideOverlay } from '@/components/onboarding/profile-guide-overlay'
import { IdentificationSection } from '@/components/profile/identification-section'
import { SpouseSection } from '@/components/profile/spouse-section'
import { DependentsSection } from '@/components/profile/dependents-section'
import { AddressSection } from '@/components/profile/address-section'
import { BankAccountsSection } from '@/components/profile/bank-accounts-section'
import { SpecificInfoSection } from '@/components/profile/specific-info-section'
import { DomesticEmployeesSection } from '@/components/profile/domestic-employees-section'
import { RuralActivitySection } from '@/components/profile/rural-activity-section'

const categories = [
  { value: 'identification', label: 'Identificação', component: (userId: string) => <><IdentificationSection userId={userId} /><AddressSection userId={userId} /></> },
  { value: 'family', label: 'Família', component: (userId: string) => <><SpouseSection userId={userId} /><DependentsSection userId={userId} /></> },
  { value: 'financial', label: 'Financeiro', component: (userId: string) => <BankAccountsSection userId={userId} /> },
  { value: 'other', label: 'Outros', component: (userId: string) => <><SpecificInfoSection userId={userId} /><DomesticEmployeesSection userId={userId} /><RuralActivitySection userId={userId} /></> },
]

export default function ProfilePage() {
  const { user } = useAuth()
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [activeTab, setActiveTab] = useState('identification')
  const [api, setApi] = useState<CarouselApi>()
  const [current, setCurrent] = useState(0)

  useEffect(() => {
    if (user) {
      setLoading(false)
    }
  }, [user])

  useEffect(() => {
    if (!api) return

    const onSelect = () => {
      const selected = api.selectedScrollSnap()
      setCurrent(selected)
      setActiveTab(categories[selected].value)
    }

    api.on('select', onSelect)
    return () => {
      api.off('select', onSelect)
    }
  }, [api])

  const handleTabChange = (value: string) => {
    setActiveTab(value)
    const index = categories.findIndex(c => c.value === value)
    if (index !== -1 && api) {
      api.scrollTo(index)
    }
  }

  const handleCarouselChange = (index: number) => {
    if (api) {
      api.scrollTo(index)
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <p className="text-muted-foreground">Carregando...</p>
      </div>
    )
  }

  return (
    <>
      <ProfileGuideOverlay />

      <div className="mb-6">
        <p className="text-muted-foreground">
          Preencha todos os dados necessários para a declaração de IRPF
        </p>
      </div>

      {error && (
        <Alert variant="destructive" className="mb-6">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      <Tabs value={activeTab} onValueChange={handleTabChange} className="w-full">
        {/* Desktop tabs */}
        <TabsList className="hidden md:grid w-full grid-cols-4 gap-2 h-auto">
          {categories.map((cat) => (
            <TabsTrigger key={cat.value} value={cat.value}>
              {cat.label}
            </TabsTrigger>
          ))}
        </TabsList>

        {/* Mobile carousel */}
        <div className="md:hidden space-y-4">
          <Carousel setApi={setApi} className="w-full">
            <CarouselContent>
              {categories.map((cat, index) => (
                <CarouselItem key={cat.value}>
                  <div className="p-1">
                    <div className="flex items-center justify-center p-6 bg-muted rounded-lg">
                      <span className="text-lg font-semibold">{cat.label}</span>
                    </div>
                  </div>
                </CarouselItem>
              ))}
            </CarouselContent>
            <CarouselPrevious className="left-2" />
            <CarouselNext className="right-2" />
          </Carousel>

          {/* Indicadores de posição */}
          <div className="flex flex-col items-center gap-2">
            <div className="text-sm text-muted-foreground">
              {current + 1} / {categories.length}
            </div>
            <div className="flex gap-2">
              {categories.map((cat, index) => (
                <button
                  key={cat.value}
                  onClick={() => handleCarouselChange(index)}
                  className={`size-2 rounded-full transition-colors ${
                    index === current ? 'bg-primary' : 'bg-muted-foreground/30'
                  }`}
                  aria-label={`Ir para ${cat.label}`}
                />
              ))}
            </div>
          </div>
        </div>

        {/* Content sections */}
        {categories.map((cat) => (
          <TabsContent key={cat.value} value={cat.value} className="space-y-6 mt-6">
            {cat.component(user?.id || '')}
          </TabsContent>
        ))}
      </Tabs>
    </>
  )
}
