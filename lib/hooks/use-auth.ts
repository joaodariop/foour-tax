'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { getSession, clearSession, type User } from '@/lib/auth/session'

export function useAuth() {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)
  const router = useRouter()

  useEffect(() => {
    const sessionUser = getSession()
    setUser(sessionUser)
    setLoading(false)
  }, [])

  const signOut = () => {
    clearSession()
    router.push('/login')
  }

  return { user, loading, signOut }
}
