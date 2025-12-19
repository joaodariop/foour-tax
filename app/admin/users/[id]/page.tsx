'use client'

import { useEffect, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { useAdminAuth } from '@/lib/hooks/use-admin-auth'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Button } from '@/components/ui/button'
import { ArrowLeft, User, FileText, Wallet, TrendingUp } from 'lucide-react'

export default function UserDetailsPage() {
  const params = useParams()
  const router = useRouter()
  const { admin, loading: adminLoading } = useAdminAuth()
  const [userData, setUserData] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const loadUserData = async () => {
      if (!admin) return

      const response = await fetch(`/api/admin/users/${params.id}`)
      const data = await response.json()

      if (response.ok) {
        setUserData(data)
      }

      setLoading(false)
    }

    if (admin) {
      loadUserData()
    }
  }, [admin, params.id])

  if (adminLoading || !admin || loading) {
    return <div className="container mx-auto px-4 py-8">Carregando...</div>
  }

  if (!userData) {
    return <div className="container mx-auto px-4 py-8">Usuário não encontrado</div>
  }

  return (
    <main className="container mx-auto px-4 py-8">
      <Button
        variant="ghost"
        onClick={() => router.back()}
        className="mb-6"
      >
        <ArrowLeft className="mr-2 h-4 w-4" />
        Voltar
      </Button>

      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">{userData.user.full_name || 'Usuário'}</h1>
        <p className="text-muted-foreground">{userData.user.email}</p>
      </div>

      <Tabs defaultValue="profile" className="space-y-4">
        <TabsList>
          <TabsTrigger value="profile">
            <User className="mr-2 h-4 w-4" />
            Perfil
          </TabsTrigger>
          <TabsTrigger value="declarations">
            <FileText className="mr-2 h-4 w-4" />
            Declarações
          </TabsTrigger>
          <TabsTrigger value="assets">
            <Wallet className="mr-2 h-4 w-4" />
            Bens e Ativos
          </TabsTrigger>
          <TabsTrigger value="financial">
            <TrendingUp className="mr-2 h-4 w-4" />
            Financeiro
          </TabsTrigger>
        </TabsList>

        <TabsContent value="profile" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Informações Pessoais</CardTitle>
            </CardHeader>
            <CardContent className="grid gap-4">
              {Object.entries(userData.profile || {}).map(([key, value]: [string, any]) => (
                <div key={key} className="grid grid-cols-2 gap-4">
                  <span className="text-sm text-muted-foreground capitalize">
                    {key.replace(/_/g, ' ')}:
                  </span>
                  <span className="text-sm font-medium">{value || '-'}</span>
                </div>
              ))}
            </CardContent>
          </Card>

          {userData.spouse && (
            <Card>
              <CardHeader>
                <CardTitle>Cônjuge</CardTitle>
              </CardHeader>
              <CardContent className="grid gap-4">
                {Object.entries(userData.spouse).map(([key, value]: [string, any]) => (
                  <div key={key} className="grid grid-cols-2 gap-4">
                    <span className="text-sm text-muted-foreground capitalize">
                      {key.replace(/_/g, ' ')}:
                    </span>
                    <span className="text-sm font-medium">{value || '-'}</span>
                  </div>
                ))}
              </CardContent>
            </Card>
          )}

          {userData.dependents?.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle>Dependentes ({userData.dependents.length})</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {userData.dependents.map((dep: any) => (
                  <div key={dep.id} className="p-4 border rounded-lg">
                    <p className="font-medium">{dep.full_name}</p>
                    <p className="text-sm text-muted-foreground">CPF: {dep.cpf}</p>
                    <p className="text-sm text-muted-foreground">Relação: {dep.relationship}</p>
                  </div>
                ))}
              </CardContent>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="declarations" className="space-y-4">
          {userData.declarations?.length > 0 ? (
            userData.declarations.map((dec: any) => (
              <Card key={dec.id}>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle>Declaração {dec.year}</CardTitle>
                    <Badge>{dec.status}</Badge>
                  </div>
                  <CardDescription>Tipo: {dec.type}</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <span className="text-muted-foreground">Total de Rendimentos:</span>
                      <p className="font-medium">
                        {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(dec.total_income || 0)}
                      </p>
                    </div>
                    <div>
                      <span className="text-muted-foreground">Total de Bens:</span>
                      <p className="font-medium">
                        {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(dec.total_assets || 0)}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))
          ) : (
            <Card>
              <CardContent className="py-12 text-center text-muted-foreground">
                Nenhuma declaração cadastrada
              </CardContent>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="assets" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-3">
            <Card>
              <CardHeader>
                <CardTitle className="text-sm">Bens e Direitos</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-2xl font-bold">{userData.assets?.length || 0}</p>
                <p className="text-xs text-muted-foreground">
                  Total: {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(
                    userData.assets?.reduce((sum: number, a: any) => sum + (a.value || 0), 0) || 0
                  )}
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-sm">Dívidas</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-2xl font-bold">{userData.debts?.length || 0}</p>
                <p className="text-xs text-muted-foreground">
                  Total: {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(
                    userData.debts?.reduce((sum: number, d: any) => sum + (d.value || 0), 0) || 0
                  )}
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-sm">Rendimentos</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-2xl font-bold">{userData.incomes?.length || 0}</p>
                <p className="text-xs text-muted-foreground">
                  Total: {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(
                    userData.incomes?.reduce((sum: number, i: any) => sum + (i.value || 0), 0) || 0
                  )}
                </p>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="financial" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Resumo Financeiro</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex justify-between items-center pb-2 border-b">
                  <span className="text-muted-foreground">Declarações Compradas:</span>
                  <span className="font-bold">{userData.declarations?.length || 0}</span>
                </div>
                <div className="flex justify-between items-center pb-2 border-b">
                  <span className="text-muted-foreground">Valor Total Gasto:</span>
                  <span className="font-bold">R$ 0,00</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-muted-foreground">Última Compra:</span>
                  <span className="font-medium">-</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </main>
  )
}
