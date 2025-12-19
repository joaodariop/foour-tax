'use client'

import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { Home, User, Briefcase, FileText, ShoppingBag, LogOut } from 'lucide-react'
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarSeparator,
  useSidebar,
} from '@/components/ui/sidebar'
import { Button } from '@/components/ui/button'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import Image from 'next/image'
import { getSession, clearSession } from '@/lib/auth/session'

export function AppSidebar() {
  const pathname = usePathname()
  const router = useRouter()
  const user = getSession()
  const { isMobile, setOpenMobile } = useSidebar()

  const handleLogout = () => {
    clearSession()
    router.push('/login')
  }

  const handleLinkClick = () => {
    if (isMobile) {
      setOpenMobile(false)
    }
  }

  const menuItems = [
    { href: '/dashboard', label: 'Dashboard', icon: Home },
    { href: '/profile', label: 'Perfil', icon: User },
    { href: '/assets', label: 'Bens e Ativos', icon: Briefcase },
    { href: '/declarations', label: 'Declarações', icon: FileText },
    { href: '/marketplace', label: 'Oportunidades', icon: ShoppingBag },
  ]

  return (
    <Sidebar>
      <SidebarHeader className="p-4">
        <Link href="/dashboard" className="flex items-center gap-2" onClick={handleLinkClick}>
          <Image
            src="/images/icone-2002.png"
            alt="Foour"
            width={32}
            height={32}
            priority
          />
          <span className="text-xl font-bold font-heading">Foour</span>
        </Link>
      </SidebarHeader>

      <SidebarSeparator />

      <SidebarContent>
        <SidebarMenu className="px-2 py-4">
          {menuItems.map((item) => {
            const Icon = item.icon
            const isActive = pathname === item.href
            
            return (
              <SidebarMenuItem key={item.href}>
                <SidebarMenuButton asChild isActive={isActive}>
                  <Link href={item.href} onClick={handleLinkClick}>
                    <Icon />
                    <span>{item.label}</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            )
          })}
        </SidebarMenu>
      </SidebarContent>

      <SidebarSeparator />

      <SidebarFooter className="p-4">
        <div className="flex items-center gap-3 mb-3">
          <Avatar className="size-10">
            <AvatarFallback className="bg-primary text-primary-foreground">
              {user?.email?.charAt(0).toUpperCase() || 'U'}
            </AvatarFallback>
          </Avatar>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium truncate">{user?.email}</p>
            <p className="text-xs text-muted-foreground">Usuário</p>
          </div>
        </div>
        <Button
          variant="destructive"
          size="sm"
          onClick={handleLogout}
          className="w-full justify-start"
        >
          <LogOut className="size-4 mr-2" />
          Sair
        </Button>
      </SidebarFooter>
    </Sidebar>
  )
}
