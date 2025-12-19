'use client'

export interface User {
  id: string
  email: string
  full_name: string | null
}

export function setSession(user: User) {
  if (typeof window !== 'undefined') {
    localStorage.setItem('foour_user', JSON.stringify(user))
  }
}

export function getSession(): User | null {
  if (typeof window === 'undefined') return null
  
  const userData = localStorage.getItem('foour_user')
  if (!userData) return null
  
  try {
    return JSON.parse(userData)
  } catch {
    return null
  }
}

export function clearSession() {
  if (typeof window !== 'undefined') {
    localStorage.removeItem('foour_user')
  }
}
