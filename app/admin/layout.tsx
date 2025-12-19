'use client'

import { useEffect } from 'react'
import { useRouter, usePathname } from 'next/navigation'
import { useAdminAuth } from '@/lib/hooks/use-admin-auth'
import { Button } from '@/components/ui/button'
import { Users, ShoppingBag, AlertTriangle, BarChart3, Menu, FileText, Bell, DollarSign, Settings } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'
import { useState } from 'react'

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const { admin, loading, signOut } = useAdminAuth()
  const router = useRouter()
  const pathname = usePathname()
  const [sidebarOpen, setSidebarOpen] = useState(false)

  useEffect(() => {
    if (!loading && !admin && pathname !== '/admin/login') {
      router.push('/admin/login')
    }
  }, [admin, loading, router, pathname])

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <p className="text-muted-foreground">Verificando permissões...</p>
      </div>
    )
  }

  if (pathname === '/admin/login') {
    return <>{children}</>
  }

  if (!admin) {
    return null
  }

  return (
    <div className="flex h-screen bg-background">
      {/* Sidebar */}
      <aside className={`${sidebarOpen ? 'translate-x-0' : '-translate-x-full'} md:translate-x-0 fixed md:static inset-y-0 left-0 z-50 w-64 bg-card border-r transition-transform`}>
        <div className="flex flex-col h-full">
          {/* Logo */}
          <div className="p-6 border-b">
            <Image
              src="/images/foour-logo01.png"
              alt="Foour Admin"
              width={120}
              height={36}
              priority
            />
            <p className="text-xs text-muted-foreground mt-2">Painel Administrativo</p>
          </div>

          {/* Navigation */}
          <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
            <Link
              href="/admin"
              className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                pathname === '/admin' 
                  ? 'bg-primary text-primary-foreground' 
                  : 'hover:bg-accent'
              }`}
            >
              <BarChart3 className="h-5 w-5" />
              <span className="font-medium">Dashboard</span>
            </Link>

            <Link
              href="/admin/users"
              className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                pathname?.startsWith('/admin/users')
                  ? 'bg-primary text-primary-foreground' 
                  : 'hover:bg-accent'
              }`}
            >
              <Users className="h-5 w-5" />
              <span className="font-medium">Usuários</span>
            </Link>

            <Link
              href="/admin/declarations"
              className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                pathname === '/admin/declarations' 
                  ? 'bg-primary text-primary-foreground' 
                  : 'hover:bg-accent'
              }`}
            >
              <FileText className="h-5 w-5" />
              <span className="font-medium">Declarações</span>
            </Link>

            <Link
              href="/admin/products"
              className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                pathname === '/admin/products' 
                  ? 'bg-primary text-primary-foreground' 
                  : 'hover:bg-accent'
              }`}
            >
              <ShoppingBag className="h-5 w-5" />
              <span className="font-medium">Produtos</span>
            </Link>

            <Link
              href="/admin/inconsistencies"
              className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                pathname === '/admin/inconsistencies' 
                  ? 'bg-primary text-primary-foreground' 
                  : 'hover:bg-accent'
              }`}
            >
              <AlertTriangle className="h-5 w-5" />
              <span className="font-medium">Inconsistências</span>
            </Link>

            <Link
              href="/admin/notifications"
              className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                pathname === '/admin/notifications' 
                  ? 'bg-primary text-primary-foreground' 
                  : 'hover:bg-accent'
              }`}
            >
              <Bell className="h-5 w-5" />
              <span className="font-medium">Notificações</span>
            </Link>

            <Link
              href="/admin/financeiro"
              className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                pathname === '/admin/financeiro' 
                  ? 'bg-primary text-primary-foreground' 
                  : 'hover:bg-accent'
              }`}
            >
              <DollarSign className="h-5 w-5" />
              <span className="font-medium">Financeiro</span>
            </Link>

            <Link
              href="/admin/settings"
              className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                pathname === '/admin/settings' 
                  ? 'bg-primary text-primary-foreground' 
                  : 'hover:bg-accent'
              }`}
            >
              <Settings className="h-5 w-5" />
              <span className="font-medium">Configurações</span>
            </Link>
          </nav>

          {/* User info & logout */}
          <div className="p-4 border-t">
            <div className="mb-3">
              <p className="text-sm font-medium">{admin?.full_name}</p>
              <p className="text-xs text-muted-foreground">{admin?.email}</p>
            </div>
            <Button 
              onClick={signOut} 
              variant="destructive" 
              className="w-full"
              size="sm"
            >
              Sair
            </Button>
          </div>
        </div>
      </aside>

      {/* Main content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Mobile header */}
        <header className="md:hidden border-b bg-card p-4 flex items-center justify-between">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setSidebarOpen(!sidebarOpen)}
          >
            <Menu className="h-5 w-5" />
          </Button>
          <Image
            src="/images/foour-logo01.png"
            alt="Foour"
            width={100}
            height={30}
          />
          <div className="w-10" /> {/* Spacer */}
        </header>

        {/* Page content */}
        <main className="flex-1 overflow-y-auto">
          {children}
        </main>
      </div>

      {/* Mobile overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 md:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}
    </div>
  )
}
