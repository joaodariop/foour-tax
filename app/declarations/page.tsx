'use client'

import { useEffect, useState } from 'react'
import { useAuth } from '@/lib/hooks/use-auth'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import Link from 'next/link'
import Image from 'next/image'
import { Plus } from 'lucide-react'
import { DeclarationsList } from '@/components/declarations/declarations-list'
import { CreateDeclarationDialog } from '@/components/declarations/create-declaration-dialog'

export default function DeclarationsPage() {
  const { user, signOut } = useAuth()
  const [refreshKey, setRefreshKey] = useState(0)

  const handleRefresh = () => {
    setRefreshKey(prev => prev + 1)
  }

  return (
    <div className="container mx-auto px-4 py-6 lg:py-8">
      <div className="mb-6 lg:mb-8 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl lg:text-3xl font-bold mb-2">Minhas Declarações</h1>
          <p className="text-sm lg:text-base text-muted-foreground">
            Gerencie suas declarações de imposto de renda (IRPF)
          </p>
        </div>
        <CreateDeclarationDialog onSuccess={handleRefresh}>
          <Button size="default" className="w-full sm:w-auto">
            <Plus className="mr-2 h-4 w-4" />
            Nova Declaração
          </Button>
        </CreateDeclarationDialog>
      </div>

      <DeclarationsList key={refreshKey} />
    </div>
  )
}
