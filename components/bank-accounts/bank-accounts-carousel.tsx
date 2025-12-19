'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
  type CarouselApi,
} from '@/components/ui/carousel'
import { Badge } from '@/components/ui/badge'
import { OpenFinanceButton } from '@/components/open-finance/open-finance-button'
import { BankAccountFileUpload } from './bank-account-file-upload'
import { useAuth } from '@/lib/hooks/use-auth'
import { AddBankAccountDialog } from './add-bank-account-dialog'

interface BankAccount {
  id: string
  bank_name: string
  bank_code: string
  agency: string
  account_number: string
  account_type: string
  ownership: string
}

interface BankAccountAttachment {
  id: string
  file_name: string
  file_url: string
  reference_year: number
  uploaded_at: string
}

export function BankAccountsCarousel() {
  const { user } = useAuth()
  const [accounts, setAccounts] = useState<BankAccount[]>([])
  const [attachments, setAttachments] = useState<Record<string, BankAccountAttachment[]>>({})
  const [loading, setLoading] = useState(true)
  const [currentIndex, setCurrentIndex] = useState(0)
  const [carouselApi, setCarouselApi] = useState<CarouselApi>()

  useEffect(() => {
    if (!carouselApi) return
    carouselApi.on('select', () => {
      setCurrentIndex(carouselApi.selectedScrollSnap())
    })
  }, [carouselApi])

  useEffect(() => {
    if (user) {
      fetchBankAccounts()
    }
  }, [user])

  const fetchBankAccounts = async () => {
    try {
      const response = await fetch('/api/bank-accounts', {
        headers: { 'x-user-id': user?.id || '' }
      })
      if (response.ok) {
        const data = await response.json()
        setAccounts(data.accounts || [])
        // Fetch attachments for each account
        data.accounts?.forEach((account: BankAccount) => {
          fetchAttachments(account.id)
        })
      }
    } catch (error) {
      console.error('[v0] Error loading bank accounts:', error)
    } finally {
      setLoading(false)
    }
  }

  const fetchAttachments = async (accountId: string) => {
    try {
      const response = await fetch(`/api/bank-accounts/${accountId}/attachments`, {
        headers: { 'x-user-id': user?.id || '' }
      })
      if (response.ok) {
        const data = await response.json()
        setAttachments(prev => ({ ...prev, [accountId]: data.attachments || [] }))
      }
    } catch (error) {
      console.error('[v0] Error loading attachments:', error)
    }
  }

  const handleFileUploaded = (accountId: string) => {
    fetchAttachments(accountId)
  }

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Contas Bancárias</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">Carregando contas...</p>
        </CardContent>
      </Card>
    )
  }

  if (accounts.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Contas Bancárias</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-muted-foreground">
            Nenhuma conta bancária cadastrada. Conecte com Open Finance para importar automaticamente ou adicione manualmente.
          </p>
          <div className="space-y-2">
            <OpenFinanceButton />
            <AddBankAccountDialog onAccountAdded={fetchBankAccounts} />
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle>Contas Bancárias</CardTitle>
          <div className="flex gap-2">
            <AddBankAccountDialog onAccountAdded={fetchBankAccounts} />
            <OpenFinanceButton variant="outline" size="sm" />
          </div>
        </div>
      </CardHeader>
      <CardContent>
        {/* Desktop - Grid */}
        <div className="hidden md:grid md:grid-cols-2 lg:grid-cols-3 gap-4">
          {accounts.map(account => (
            <Card key={account.id} className="border">
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between">
                  <div>
                    <h3 className="font-semibold">{account.bank_name}</h3>
                    <p className="text-sm text-muted-foreground">
                      Ag: {account.agency} - Conta: {account.account_number}
                    </p>
                  </div>
                  <Badge variant="secondary" className="text-xs">
                    {account.account_type}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="space-y-2">
                  <p className="text-xs font-medium">Arquivos Anexados:</p>
                  {attachments[account.id]?.length > 0 ? (
                    <div className="space-y-1">
                      {attachments[account.id].slice(0, 2).map(att => (
                        <div key={att.id} className="text-xs p-2 bg-muted rounded flex items-center justify-between">
                          <span className="truncate">{att.file_name}</span>
                          <Badge variant="outline" className="text-xs">
                            {att.reference_year}
                          </Badge>
                        </div>
                      ))}
                      {attachments[account.id].length > 2 && (
                        <p className="text-xs text-muted-foreground">
                          +{attachments[account.id].length - 2} arquivo(s)
                        </p>
                      )}
                    </div>
                  ) : (
                    <p className="text-xs text-muted-foreground">Nenhum arquivo anexado</p>
                  )}
                </div>
                <BankAccountFileUpload 
                  accountId={account.id}
                  onUploadSuccess={() => handleFileUploaded(account.id)}
                />
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Mobile - Carousel */}
        <div className="md:hidden">
          <Carousel setApi={setCarouselApi} className="w-full">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold">
                {accounts[currentIndex]?.bank_name}
              </h3>
              <div className="flex items-center gap-2">
                <CarouselPrevious className="static translate-y-0" />
                <span className="text-sm text-muted-foreground">
                  {currentIndex + 1} / {accounts.length}
                </span>
                <CarouselNext className="static translate-y-0" />
              </div>
            </div>

            <CarouselContent>
              {accounts.map(account => (
                <CarouselItem key={account.id}>
                  <div className="space-y-4 p-4 border rounded-lg">
                    <div>
                      <p className="text-sm text-muted-foreground">
                        Ag: {account.agency} - Conta: {account.account_number}
                      </p>
                      <Badge variant="secondary" className="mt-2">
                        {account.account_type}
                      </Badge>
                    </div>

                    <div className="space-y-2">
                      <p className="text-sm font-medium">Arquivos Anexados:</p>
                      {attachments[account.id]?.length > 0 ? (
                        <div className="space-y-2">
                          {attachments[account.id].map(att => (
                            <div key={att.id} className="text-sm p-2 bg-muted rounded">
                              <p className="font-medium truncate">{att.file_name}</p>
                              <p className="text-xs text-muted-foreground">
                                Ano: {att.reference_year}
                              </p>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <p className="text-sm text-muted-foreground">Nenhum arquivo anexado</p>
                      )}
                    </div>

                    <BankAccountFileUpload 
                      accountId={account.id}
                      onUploadSuccess={() => handleFileUploaded(account.id)}
                    />
                  </div>
                </CarouselItem>
              ))}
            </CarouselContent>
          </Carousel>

          <div className="flex justify-center gap-2 py-4">
            {accounts.map((_, index) => (
              <button
                key={index}
                onClick={() => carouselApi?.scrollTo(index)}
                className={`h-2 rounded-full transition-all ${
                  index === currentIndex
                    ? 'w-8 bg-primary'
                    : 'w-2 bg-muted-foreground/30'
                }`}
                aria-label={`Ir para conta ${index + 1}`}
              />
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
