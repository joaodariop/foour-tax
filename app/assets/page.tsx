import { Suspense } from 'react'
import { AssetsContent } from '@/components/assets/assets-content'
import { Skeleton } from '@/components/ui/skeleton'

function AssetsLoading() {
  return (
    <div className="min-h-screen bg-background space-y-6">
      <div className="mb-6">
        <Skeleton className="h-8 w-64 mb-2" />
        <Skeleton className="h-5 w-96" />
      </div>
      <div className="space-y-4">
        <Skeleton className="h-6 w-48" />
        <Skeleton className="h-12 w-full" />
        <Skeleton className="h-96 w-full" />
      </div>
    </div>
  )
}

export default function AssetsPage() {
  return (
    <Suspense fallback={<AssetsLoading />}>
      <AssetsContent />
    </Suspense>
  )
}
