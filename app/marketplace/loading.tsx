export default function MarketplaceLoading() {
  return (
    <div className="container mx-auto px-4 py-6 lg:py-8">
      <div className="mb-6 lg:mb-8">
        <div className="h-8 w-48 bg-muted rounded animate-pulse mb-2" />
        <div className="h-5 w-96 bg-muted rounded animate-pulse" />
      </div>

      <div className="mb-6">
        <div className="h-10 w-full max-w-md bg-muted rounded animate-pulse" />
      </div>

      <div className="grid gap-4 sm:gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {[...Array(6)].map((_, i) => (
          <div key={i} className="border rounded-lg overflow-hidden">
            <div className="aspect-video w-full bg-muted animate-pulse" />
            <div className="p-6 space-y-3">
              <div className="h-6 bg-muted rounded animate-pulse" />
              <div className="h-4 bg-muted rounded animate-pulse w-3/4" />
              <div className="h-8 bg-muted rounded animate-pulse w-1/3 mt-4" />
              <div className="h-9 bg-muted rounded animate-pulse mt-4" />
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
