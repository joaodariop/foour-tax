'use client'

import { useState, useEffect } from 'react'
import { useSearchParams } from 'next/navigation'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { ScrollArea, ScrollBar } from '@/components/ui/scroll-area'
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
  type CarouselApi,
} from '@/components/ui/carousel'
import { Card } from '@/components/ui/card'
import { Separator } from '@/components/ui/separator'
import { AssetsGuideOverlay } from '@/components/onboarding/assets-guide-overlay'
import { BankAccountsCarousel } from '@/components/bank-accounts/bank-accounts-carousel'

import { AssetsSection } from '@/components/declaration/assets-section'
import { DebtsSection } from '@/components/declaration/debts-section'
import { TaxableIncomePJSection } from '@/components/declaration/taxable-income-pj-section'
import { IncomePFForeignSection } from '@/components/declaration/income-pf-foreign-section'
import { ExclusiveTaxationSection } from '@/components/declaration/exclusive-taxation-section'
import { TaxExemptIncomeSection } from '@/components/declaration/tax-exempt-income-section'
import { TaxesPaidSection } from '@/components/declaration/taxes-paid-section'
import { DeductibleExpensesSection } from '@/components/declaration/deductible-expenses-section'
import { DonationsSection } from '@/components/declaration/donations-section'
import { CapitalGainsSection } from '@/components/declaration/capital-gains-section'
import { StockOperationsSection } from '@/components/declaration/stock-operations-section'
import { CryptoOperationsSection } from '@/components/declaration/crypto-operations-section'
import { RuralActivitySection } from '@/components/declaration/rural-activity-section'

const categories = [
  { value: 'assets', label: 'Bens e Direitos', component: AssetsSection },
  { value: 'debts', label: 'Dívidas e Ônus', component: DebtsSection },
  { value: 'income-pj', label: 'Rendimentos PJ', component: TaxableIncomePJSection },
  { value: 'income-pf', label: 'Rendimentos PF/Exterior', component: IncomePFForeignSection },
  { value: 'exclusive', label: 'Tributação Exclusiva', component: ExclusiveTaxationSection },
  { value: 'exempt', label: 'Isentos', component: TaxExemptIncomeSection },
  { value: 'taxes', label: 'Impostos Pagos', component: TaxesPaidSection },
  { value: 'expenses', label: 'Despesas Dedutíveis', component: DeductibleExpensesSection },
  { value: 'donations', label: 'Doações', component: DonationsSection },
  { value: 'capital', label: 'Ganhos de Capital', component: CapitalGainsSection },
  { value: 'stocks', label: 'Renda Variável', component: StockOperationsSection },
  { value: 'crypto', label: 'Criptoativos', component: CryptoOperationsSection },
  { value: 'rural', label: 'Atividade Rural', component: RuralActivitySection },
]

export function AssetsContent() {
  const searchParams = useSearchParams()
  const categoryParam = searchParams.get('category')
  
  const [activeTab, setActiveTab] = useState(categoryParam || 'assets')
  const [currentIndex, setCurrentIndex] = useState(0)
  const [carouselApi, setCarouselApi] = useState<CarouselApi>()

  useEffect(() => {
    if (categoryParam) {
      const index = categories.findIndex(cat => cat.value === categoryParam)
      if (index !== -1) {
        setActiveTab(categoryParam)
        setCurrentIndex(index)
        carouselApi?.scrollTo(index)
      }
    }
  }, [categoryParam, carouselApi])

  useEffect(() => {
    if (!carouselApi) return

    carouselApi.on('select', () => {
      const index = carouselApi.selectedScrollSnap()
      setCurrentIndex(index)
      setActiveTab(categories[index].value)
    })
  }, [carouselApi])

  const handleTabChange = (value: string) => {
    setActiveTab(value)
    const index = categories.findIndex(cat => cat.value === value)
    if (index !== -1) setCurrentIndex(index)
  }

  const handleCarouselChange = (index: number) => {
    setCurrentIndex(index)
    setActiveTab(categories[index].value)
    carouselApi?.scrollTo(index)
  }

  return (
    <>
      <AssetsGuideOverlay />
      
      <div className="min-h-screen bg-background space-y-6">
        <div className="mb-6">
          <h1 className="text-2xl font-bold mb-2">Declaração de Imposto de Renda</h1>
          <p className="text-muted-foreground">
            Gerencie todos os dados necessários para sua declaração completa
          </p>
        </div>

        <div className="space-y-4">
          <h2 className="text-lg font-semibold">Categorias de Declaração</h2>
          
          <div className="hidden md:block">
            <Tabs value={activeTab} onValueChange={handleTabChange} className="space-y-6">
              <ScrollArea className="w-full whitespace-nowrap">
                <TabsList className="inline-flex h-auto flex-nowrap gap-2 p-1">
                  {categories.map(cat => (
                    <TabsTrigger key={cat.value} value={cat.value} className="text-sm">
                      {cat.label}
                    </TabsTrigger>
                  ))}
                </TabsList>
                <ScrollBar orientation="horizontal" />
              </ScrollArea>

              {categories.map(cat => (
                <TabsContent key={cat.value} value={cat.value}>
                  <cat.component />
                </TabsContent>
              ))}
            </Tabs>
          </div>

          <div className="md:hidden space-y-4">
            <Carousel
              setApi={setCarouselApi}
              opts={{
                align: 'start',
                loop: false,
              }}
              className="w-full"
            >
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold">{categories[currentIndex].label}</h3>
                <div className="flex items-center gap-2">
                  <CarouselPrevious className="static translate-y-0" />
                  <span className="text-sm text-muted-foreground">
                    {currentIndex + 1} / {categories.length}
                  </span>
                  <CarouselNext className="static translate-y-0" />
                </div>
              </div>

              <CarouselContent>
                {categories.map((cat, index) => (
                  <CarouselItem key={cat.value}>
                    <Card className="border-0 shadow-none">
                      <cat.component />
                    </Card>
                  </CarouselItem>
                ))}
              </CarouselContent>
            </Carousel>

            <div className="flex justify-center gap-2 py-4">
              {categories.map((cat, index) => (
                <button
                  key={cat.value}
                  onClick={() => handleCarouselChange(index)}
                  className={`h-2 rounded-full transition-all ${
                    index === currentIndex
                      ? 'w-8 bg-primary'
                      : 'w-2 bg-muted-foreground/30'
                  }`}
                  aria-label={`Ir para ${cat.label}`}
                />
              ))}
            </div>
          </div>
        </div>

        <Separator />

        <div className="space-y-4">
          <BankAccountsCarousel />
        </div>
      </div>
    </>
  )
}
