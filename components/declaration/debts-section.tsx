'use client'

import { Button } from '@/components/ui/button'
import { DebtsList } from '@/components/assets/debts-list'
import { AddDebtDialog } from '@/components/assets/add-debt-dialog'
import { useState } from 'react'

export function DebtsSection() {
  const [refreshKey, setRefreshKey] = useState(0)

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-xl font-semibold">Dívidas e Ônus Reais</h2>
          <p className="text-sm text-muted-foreground">
            Financiamentos, empréstimos e outras obrigações
          </p>
        </div>
        <AddDebtDialog onSuccess={() => setRefreshKey(prev => prev + 1)}>
          <Button className="w-full sm:w-auto">Adicionar Dívida</Button>
        </AddDebtDialog>
      </div>
      <DebtsList key={refreshKey} />
    </div>
  )
}
