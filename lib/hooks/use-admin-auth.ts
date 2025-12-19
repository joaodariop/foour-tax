"use client"

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'

interface Admin {
  id: string
  email: string
  full_name: string
  role: 'superadmin' | 'admin'
}

export function useAdminAuth() {
  const [admin, setAdmin] = useState<Admin | null>(null)
  const [loading, setLoading] = useState(true)
  const router = useRouter()

  useEffect(() => {
    checkAuth()
  }, [])

  const checkAuth = async () => {
    try {
      const token = localStorage.getItem('admin_token')
      
      if (!token) {
        setLoading(false)
        return
      }

      const response = await fetch('/api/admin/auth/verify', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      })

      if (!response.ok) {
        localStorage.removeItem('admin_token')
        setAdmin(null)
        setLoading(false)
        return
      }

      const data = await response.json()
      setAdmin(data.admin)
    } catch (error) {
      console.error('[v0] Admin auth error:', error)
      localStorage.removeItem('admin_token')
      setAdmin(null)
    } finally {
      setLoading(false)
    }
  }

  const signOut = () => {
    localStorage.removeItem('admin_token')
    setAdmin(null)
    router.push('/admin/login')
  }

  return { admin, loading, signOut, checkAuth }
}
