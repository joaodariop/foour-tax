'use client'

import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { ChevronLeft, ChevronRight, ExternalLink, ShoppingBag } from 'lucide-react'
import { useEffect, useState } from 'react'
import Image from 'next/image'

interface Product {
  id: string
  title: string
  description: string
  image_url: string | null
  external_link: string | null
  category: string
}

export function OpportunitiesCarousel() {
  const [products, setProducts] = useState<Product[]>([])
  const [currentIndex, setCurrentIndex] = useState(0)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchProducts() {
      try {
        const response = await fetch('/api/marketplace/products?limit=5')
        if (response.ok) {
          const data = await response.json()
          setProducts(data)
        }
      } catch (error) {
        console.error('[v0] Error fetching products:', error)
      } finally {
        setLoading(false)
      }
    }
    fetchProducts()
  }, [])

  const nextSlide = () => {
    setCurrentIndex((prev) => (prev + 1) % products.length)
  }

  const prevSlide = () => {
    setCurrentIndex((prev) => (prev - 1 + products.length) % products.length)
  }

  if (loading) {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="h-48 bg-muted animate-pulse rounded-lg" />
        </CardContent>
      </Card>
    )
  }

  if (products.length === 0) {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="text-center py-12 text-muted-foreground">
            <ShoppingBag className="size-16 mx-auto mb-4 opacity-20" />
            <p className="text-sm">Nenhuma oportunidade disponível</p>
          </div>
        </CardContent>
      </Card>
    )
  }

  const currentProduct = products[currentIndex]

  return (
    <Card className="overflow-hidden">
      <CardContent className="p-0">
        <div className="relative">
          <div className="aspect-video bg-muted relative">
            {currentProduct.image_url ? (
              <Image
                src={currentProduct.image_url || "/placeholder.svg"}
                alt={currentProduct.title}
                fill
                className="object-cover"
              />
            ) : (
              <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-primary/10 to-primary/5">
                <ShoppingBag className="size-20 text-primary/20" />
              </div>
            )}
          </div>

          {/* Navigation buttons */}
          {products.length > 1 && (
            <>
              <Button
                variant="secondary"
                size="icon"
                className="absolute left-2 top-1/2 -translate-y-1/2 rounded-full"
                onClick={prevSlide}
              >
                <ChevronLeft className="size-4" />
              </Button>
              <Button
                variant="secondary"
                size="icon"
                className="absolute right-2 top-1/2 -translate-y-1/2 rounded-full"
                onClick={nextSlide}
              >
                <ChevronRight className="size-4" />
              </Button>
            </>
          )}

          {/* Indicators */}
          <div className="absolute bottom-2 left-1/2 -translate-x-1/2 flex gap-1.5">
            {products.map((_, idx) => (
              <button
                key={idx}
                onClick={() => setCurrentIndex(idx)}
                className={`size-2 rounded-full transition-all ${
                  idx === currentIndex
                    ? 'bg-white w-6'
                    : 'bg-white/50 hover:bg-white/75'
                }`}
              />
            ))}
          </div>
        </div>

        {/* Product info */}
        <div className="p-6">
          <div className="flex items-start justify-between gap-4 mb-3">
            <div>
              <h3 className="font-semibold text-lg mb-1">{currentProduct.title}</h3>
              <p className="text-sm text-muted-foreground">
                {currentProduct.category}
              </p>
            </div>
            {currentProduct.external_link && (
              <Button size="sm" asChild>
                <a
                  href={currentProduct.external_link}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <ExternalLink className="size-4 mr-2" />
                  Ver
                </a>
              </Button>
            )}
          </div>
          <p className="text-sm text-muted-foreground line-clamp-2">
            {currentProduct.description}
          </p>
        </div>
      </CardContent>
    </Card>
  )
}
