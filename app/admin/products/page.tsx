'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { useAdminAuth } from '@/lib/hooks/use-admin-auth'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Alert, AlertDescription } from '@/components/ui/alert'
import Link from 'next/link'
import Image from 'next/image'
import { Plus, Trash2, Edit, Eye, EyeOff } from 'lucide-react'
import { AddProductDialog } from '@/components/admin/add-product-dialog'

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

export default function AdminProductsPage() {
  const { admin, loading: adminLoading } = useAdminAuth()
  const router = useRouter()
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [refreshKey, setRefreshKey] = useState(0)

  useEffect(() => {
    if (!adminLoading && !admin) {
      router.push('/dashboard')
    }
  }, [admin, adminLoading, router])

  useEffect(() => {
    const loadProducts = async () => {
      if (!admin) return

      try {
        const response = await fetch('/api/products')
        
        if (!response.ok) {
          const errorData = await response.json()
          console.error('[v0] Error loading products:', errorData)
          setError('Erro ao carregar produtos')
          setLoading(false)
          return
        }

        const data = await response.json()
        setProducts(data || [])
      } catch (err) {
        console.error('[v0] Error loading products:', err)
        setError('Erro ao carregar produtos')
      }

      setLoading(false)
    }

    if (admin) {
      loadProducts()
    }
  }, [admin, refreshKey])

  const handleToggleActive = async (id: string, currentStatus: boolean) => {
    const response = await fetch(`/api/products/${id}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ active: !currentStatus }),
    })

    if (!response.ok) {
      console.error('[v0] Error toggling product status:', await response.json())
      alert('Erro ao atualizar status do produto')
    } else {
      setRefreshKey(prev => prev + 1)
    }
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Tem certeza que deseja excluir este produto?')) return

    const response = await fetch(`/api/products/${id}`, {
      method: 'DELETE',
    })

    if (!response.ok) {
      console.error('[v0] Error deleting product:', await response.json())
      alert('Erro ao excluir produto')
    } else {
      setProducts(products.filter(p => p.id !== id))
    }
  }

  const handleRefresh = () => {
    setRefreshKey(prev => prev + 1)
  }

  if (adminLoading || !admin) {
    return null
  }

  return (
    <main className="container mx-auto px-4 py-8">
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold mb-2">Gerenciamento de Produtos</h1>
          <p className="text-muted-foreground">
            Gerencie os produtos do marketplace
          </p>
        </div>
        <AddProductDialog onSuccess={handleRefresh}>
          <Button>
            <Plus className="mr-2 h-4 w-4" />
            Novo Produto
          </Button>
        </AddProductDialog>
      </div>

      {loading ? (
        <p className="text-muted-foreground">Carregando produtos...</p>
      ) : error ? (
        <Alert variant="destructive">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      ) : products.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <p className="text-muted-foreground">Nenhum produto cadastrado</p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {products.map(product => (
            <Card key={product.id} className={!product.is_active ? 'opacity-60' : ''}>
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
                  <CardTitle className="text-lg">{product.title}</CardTitle>
                  <div className="flex gap-1">
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handleToggleActive(product.id, product.is_active)}
                      title={product.is_active ? 'Desativar' : 'Ativar'}
                    >
                      {product.is_active ? (
                        <Eye className="h-4 w-4" />
                      ) : (
                        <EyeOff className="h-4 w-4" />
                      )}
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handleDelete(product.id)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
                <div className="flex gap-2">
                  {product.category && (
                    <Badge variant="secondary">{product.category}</Badge>
                  )}
                  <Badge variant={product.is_active ? 'default' : 'outline'}>
                    {product.is_active ? 'Ativo' : 'Inativo'}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className="space-y-2">
                {product.description && (
                  <p className="text-sm text-muted-foreground line-clamp-2">
                    {product.description}
                  </p>
                )}
                {product.price !== null && (
                  <div className="text-lg font-bold text-primary">
                    {new Intl.NumberFormat('pt-BR', {
                      style: 'currency',
                      currency: 'BRL',
                    }).format(product.price)}
                  </div>
                )}
                {product.external_link && (
                  <p className="text-xs text-muted-foreground truncate">
                    {product.external_link}
                  </p>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </main>
  )
}
