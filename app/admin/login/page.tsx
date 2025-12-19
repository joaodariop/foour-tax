"use client"

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Alert, AlertDescription } from '@/components/ui/alert'
import Image from 'next/image'

export default function AdminLoginPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  const handleSetupAdmin = async () => {
    setError('')
    setLoading(true)

    try {
      const response = await fetch('/api/admin/auth/setup', {
        method: 'POST'
      })

      const data = await response.json()

      if (response.ok) {
        setError('')
        alert('Admin configurado! Use as credenciais padrão para entrar.')
      } else {
        setError(data.error || 'Erro ao configurar admin')
      }
    } catch (error) {
      setError('Erro ao configurar admin')
    } finally {
      setLoading(false)
    }
  }

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    try {
      console.log('[v0] Attempting login with:', email)
      
      const response = await fetch('/api/admin/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      })

      const data = await response.json()

      console.log('[v0] Login response:', { ok: response.ok, data })

      if (!response.ok) {
        setError(data.error || 'Credenciais inválidas')
        return
      }

      // Salvar token
      localStorage.setItem('admin_token', data.token)
      
      // Redirecionar para admin
      router.push('/admin')
    } catch (error) {
      console.error('[v0] Login error:', error)
      setError('Erro ao fazer login. Tente novamente.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-orange-50 to-orange-100 p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-4">
          <div className="flex justify-center">
            <Image
              src="/images/foour-logo01.png"
              alt="Foour Logo"
              width={120}
              height={40}
              className="h-10 w-auto"
            />
          </div>
          <div className="space-y-2 text-center">
            <CardTitle className="text-2xl">Backoffice Foour</CardTitle>
            <CardDescription>
              Acesso restrito a administradores
            </CardDescription>
          </div>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleLogin} className="space-y-4">
            {error && (
              <Alert variant="destructive">
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            <Alert className="bg-blue-50 border-blue-200">
              <AlertDescription className="text-sm text-blue-800">
                <strong>Credenciais padrão:</strong>
                <br />
                Email: admin@foour.com.br
                <br />
                Senha: Admin@123
              </AlertDescription>
            </Alert>

            <div className="space-y-2">
              <Label htmlFor="email">E-mail</Label>
              <Input
                id="email"
                type="email"
                placeholder="admin@foour.com.br"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                disabled={loading}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="password">Senha</Label>
              <Input
                id="password"
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                disabled={loading}
              />
            </div>

            <div className="space-y-2">
              <Button
                type="submit"
                className="w-full"
                disabled={loading}
              >
                {loading ? 'Entrando...' : 'Entrar no Backoffice'}
              </Button>

              <Button
                type="button"
                variant="outline"
                className="w-full"
                onClick={handleSetupAdmin}
                disabled={loading}
              >
                Configurar Admin (Primeira vez)
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
