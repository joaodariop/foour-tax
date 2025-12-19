'use client'

import { useEffect, useState } from 'react'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Button } from '@/components/ui/button'
import { Search, ExternalLink, ShoppingBag } from 'lucide-react'

interface Product {
  id: string
  title: string
  description: string | null
  category: string | null
  price: number | null
  image_url: string | null
  external_link: string | null
  is_active: boolean
  created_at: string
}

export default function MarketplacePage() {
  const [products, setProducts] = useState<Product[]>([])
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [searchTerm, setSearchTerm] = useState('')

  useEffect(() => {
    const loadProducts = async () => {
      const response = await fetch('/api/marketplace/products')
      const data = await response.json()

      if (data.error) {
        setError('Erro ao carregar oportunidades')
      } else {
        setProducts(data || [])
        setFilteredProducts(data || [])
      }

      setLoading(false)
    }

    loadProducts()
  }, [])

  useEffect(() => {
    if (searchTerm.trim() === '') {
      setFilteredProducts(products)
    } else {
      const filtered = products.filter(product => 
        product.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        product.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        product.category?.toLowerCase().includes(searchTerm.toLowerCase())
      )
      setFilteredProducts(filtered)
    }
  }, [searchTerm, products])

  return (
    <div className="container mx-auto px-4 py-6 lg:py-8">
      <div className="mb-6 lg:mb-8">
        <h1 className="text-2xl lg:text-3xl font-bold mb-2">Oportunidades</h1>
        <p className="text-sm lg:text-base text-muted-foreground">
          Descubra produtos e serviços selecionados para você
        </p>
      </div>

      <div className="mb-6">
        <div className="relative max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Buscar oportunidades..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-9"
          />
        </div>
      </div>

      {loading ? (
        <p className="text-muted-foreground">Carregando oportunidades...</p>
      ) : error ? (
        <Alert variant="destructive">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      ) : filteredProducts.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <ShoppingBag className="h-16 w-16 text-muted-foreground mb-4" />
            <p className="text-muted-foreground mb-2 text-center">
              {searchTerm ? 'Nenhuma oportunidade encontrada' : 'Nenhuma oportunidade disponível no momento'}
            </p>
            {searchTerm && (
              <Button variant="link" onClick={() => setSearchTerm('')}>
                Limpar busca
              </Button>
            )}
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4 sm:gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {filteredProducts.map(product => (
            <Card key={product.id} className="flex flex-col">
              {product.image_url && (
                <div className="aspect-video w-full overflow-hidden rounded-t-lg bg-muted">
                  <img
                    src={product.image_url || "/placeholder.svg"}
                    alt={product.title}
                    className="h-full w-full object-cover"
                  />
                </div>
              )}
              <CardHeader>
                <div className="flex items-start justify-between gap-2">
                  <CardTitle className="text-base lg:text-lg leading-tight">{product.title}</CardTitle>
                  {product.category && (
                    <Badge variant="secondary" className="shrink-0 text-xs">
                      {product.category}
                    </Badge>
                  )}
                </div>
                {product.description && (
                  <CardDescription className="line-clamp-2 text-sm">
                    {product.description}
                  </CardDescription>
                )}
              </CardHeader>
              <CardContent className="flex-1">
                {product.price !== null && (
                  <div className="text-xl lg:text-2xl font-bold text-primary">
                    {new Intl.NumberFormat('pt-BR', {
                      style: 'currency',
                      currency: 'BRL',
                    }).format(product.price)}
                  </div>
                )}
              </CardContent>
              <CardFooter>
                {product.external_link ? (
                  <Button asChild className="w-full" size="sm">
                    <a href={product.external_link} target="_blank" rel="noopener noreferrer">
                      Saiba Mais
                      <ExternalLink className="ml-2 h-4 w-4" />
                    </a>
                  </Button>
                ) : (
                  <Button className="w-full" size="sm" disabled>
                    Em Breve
                  </Button>
                )}
              </CardFooter>
            </Card>
          ))}
        </div>
      )}

      {filteredProducts.length > 0 && (
        <p className="text-xs lg:text-sm text-muted-foreground text-center mt-6 lg:mt-8">
          Mostrando {filteredProducts.length} de {products.length} oportunidades
        </p>
      )}
    </div>
  )
}
