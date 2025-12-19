'use client'

import { Button } from '@/components/ui/button'
import { AssetsList } from '@/components/assets/assets-list'
import { AddAssetDialog } from '@/components/assets/add-asset-dialog'
import { useState } from 'react'

export function AssetsSection() {
  const [refreshKey, setRefreshKey] = useState(0)

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-xl font-semibold">Bens e Direitos</h2>
          <p className="text-sm text-muted-foreground">
            Imóveis, veículos, investimentos, contas bancárias e outros ativos
          </p>
        </div>
        <AddAssetDialog onSuccess={() => setRefreshKey(prev => prev + 1)}>
          <Button className="w-full sm:w-auto">Adicionar Bem</Button>
        </AddAssetDialog>
      </div>
      <AssetsList key={refreshKey} />
    </div>
  )
}
