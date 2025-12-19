"use client"

import { useAdminAuth } from '@/lib/hooks/use-admin-auth'
import { Skeleton } from '@/components/ui/skeleton'

export function AdminGuard({ children }: { children: React.ReactNode }) {
  const { admin, loading } = useAdminAuth()

  if (loading) {
    return (
      <div className="min-h-screen p-8 space-y-4">
        <Skeleton className="h-8 w-64" />
        <Skeleton className="h-64 w-full" />
      </div>
    )
  }

  if (!admin) {
    return null // useAdminAuth já redireciona para login
  }

  return <>{children}</>
}
