'use client'

import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { CheckCircle, ArrowRight, FileText, Shield, TrendingUp, Users, Database, Clock, HeadphonesIcon } from 'lucide-react'
import { useEffect, useState } from 'react'

export default function HomePage() {
  const [price, setPrice] = useState<number>(199.90)

  useEffect(() => {
    fetch('/api/public/pricing')
      .then(res => res.json())
      .then(data => {
        const fetchedPrice = parseFloat(data.price)
        if (!isNaN(fetchedPrice) && fetchedPrice > 0) {
          setPrice(fetchedPrice)
        }
      })
      .catch(() => {
        console.log('[v0] Using default price due to API error')
      })
  }, [])

  return (
    <div className="min-h-screen bg-gradient-to-b from-background via-muted/20 to-background">
      {/* Header */}
      <header className="sticky top-0 z-50 border-b border-border/40 bg-background/80 backdrop-blur-xl supports-[backdrop-filter]:bg-background/60">
        <div className="container mx-auto px-4 sm:px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <img 
              src="/images/foour-logo01.png" 
              alt="Foour" 
              className="h-8 sm:h-10"
            />
          </div>
          <nav className="hidden md:flex items-center gap-8 text-sm">
            <a href="#sobre" className="text-muted-foreground hover:text-foreground transition-colors">Sobre Nós</a>
            <a href="#como-funciona" className="text-muted-foreground hover:text-foreground transition-colors">Como Funciona</a>
            <a href="#precos" className="text-muted-foreground hover:text-foreground transition-colors">Preços</a>
          </nav>
          <div className="flex items-center gap-3">
            <Link href="/login">
              <Button variant="ghost" size="sm">
                Entrar
              </Button>
            </Link>
            <Link href="/signup">
              <Button size="sm" className="hidden sm:inline-flex">
                Começar Agora
              </Button>
            </Link>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="container mx-auto px-4 sm:px-6 py-16 sm:py-24 md:py-32">
        <div className="max-w-5xl mx-auto text-center">
          <Badge variant="secondary" className="mb-6 text-sm px-4 py-1.5">
            🎉 Simplifique sua Declaração de IRPF 2025
          </Badge>
          <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold text-foreground mb-6 text-balance leading-[1.1]">
            Declaração de Imposto de Renda{' '}
            <span className="text-primary">Descomplicada</span>
          </h1>
          <p className="text-lg sm:text-xl md:text-2xl text-muted-foreground mb-10 text-pretty max-w-3xl mx-auto leading-relaxed">
            Organize seus dados, calcule deduções e receba orientação completa para fazer sua declaração com segurança e tranquilidade
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link href="/signup">
              <Button size="lg" className="text-lg px-8 py-6 h-auto shadow-lg shadow-primary/20 hover:shadow-xl hover:shadow-primary/30 transition-all">
                Começar Gratuitamente
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </Link>
            <a href="#precos">
              <Button size="lg" variant="outline" className="text-lg px-8 py-6 h-auto">
                Ver Planos
              </Button>
            </a>
          </div>
          <p className="text-sm text-muted-foreground mt-6">
            ✓ Sem cartão de crédito · ✓ Comece em 2 minutos
          </p>
        </div>
      </section>

      {/* Sobre Nós Section */}
      <section id="sobre" className="py-16 sm:py-24 bg-muted/30">
        <div className="container mx-auto px-4 sm:px-6">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-4 text-balance">
                Sobre a Foour
              </h2>
              <p className="text-lg sm:text-xl text-muted-foreground text-pretty max-w-3xl mx-auto">
                Simplificando a declaração de imposto de renda para milhares de brasileiros
              </p>
            </div>

            <div className="grid md:grid-cols-2 gap-8 items-center mb-16">
              <div className="space-y-6">
                <h3 className="text-2xl sm:text-3xl font-bold">
                  Nossa Missão
                </h3>
                <p className="text-muted-foreground text-lg leading-relaxed">
                  A Foour nasceu com o propósito de tornar a declaração de imposto de renda acessível e descomplicada para todos. Combinamos tecnologia de ponta com orientação especializada para garantir que você faça sua declaração com confiança e segurança.
                </p>
                <p className="text-muted-foreground text-lg leading-relaxed">
                  Nossa plataforma inteligente organiza todos os seus dados fiscais, identifica oportunidades de dedução e fornece um tutorial passo a passo personalizado baseado no seu perfil.
                </p>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <Card className="border-2">
                  <CardHeader className="space-y-2 pb-4">
                    <div className="rounded-lg bg-primary/10 w-12 h-12 flex items-center justify-center mb-2">
                      <Users className="h-6 w-6 text-primary" />
                    </div>
                    <CardTitle className="text-2xl">10k+</CardTitle>
                    <CardDescription>Usuários ativos</CardDescription>
                  </CardHeader>
                </Card>
                <Card className="border-2">
                  <CardHeader className="space-y-2 pb-4">
                    <div className="rounded-lg bg-primary/10 w-12 h-12 flex items-center justify-center mb-2">
                      <FileText className="h-6 w-6 text-primary" />
                    </div>
                    <CardTitle className="text-2xl">5k+</CardTitle>
                    <CardDescription>Declarações realizadas</CardDescription>
                  </CardHeader>
                </Card>
                <Card className="border-2">
                  <CardHeader className="space-y-2 pb-4">
                    <div className="rounded-lg bg-primary/10 w-12 h-12 flex items-center justify-center mb-2">
                      <Shield className="h-6 w-6 text-primary" />
                    </div>
                    <CardTitle className="text-2xl">100%</CardTitle>
                    <CardDescription>Segurança garantida</CardDescription>
                  </CardHeader>
                </Card>
                <Card className="border-2">
                  <CardHeader className="space-y-2 pb-4">
                    <div className="rounded-lg bg-primary/10 w-12 h-12 flex items-center justify-center mb-2">
                      <TrendingUp className="h-6 w-6 text-primary" />
                    </div>
                    <CardTitle className="text-2xl">98%</CardTitle>
                    <CardDescription>Satisfação</CardDescription>
                  </CardHeader>
                </Card>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Como Funciona Section */}
      <section id="como-funciona" className="py-16 sm:py-24">
        <div className="container mx-auto px-4 sm:px-6">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-4 text-balance">
                Como Funciona
              </h2>
              <p className="text-lg sm:text-xl text-muted-foreground text-pretty max-w-3xl mx-auto">
                Apenas 4 passos simples para uma declaração completa e sem complicações
              </p>
            </div>

            <div className="grid md:grid-cols-2 gap-8">
              <Card className="border-2 hover:border-primary/50 transition-all hover:shadow-lg">
                <CardHeader className="space-y-4">
                  <div className="flex items-start justify-between">
                    <div className="rounded-full bg-primary text-primary-foreground w-12 h-12 flex items-center justify-center text-xl font-bold">
                      1
                    </div>
                    <Database className="h-8 w-8 text-primary" />
                  </div>
                  <CardTitle className="text-2xl">Cadastre seus Dados</CardTitle>
                  <CardDescription className="text-base leading-relaxed">
                    Preencha suas informações pessoais, bens, rendimentos e despesas dedutíveis de forma organizada em nossa plataforma intuitiva.
                  </CardDescription>
                </CardHeader>
              </Card>

              <Card className="border-2 hover:border-primary/50 transition-all hover:shadow-lg">
                <CardHeader className="space-y-4">
                  <div className="flex items-start justify-between">
                    <div className="rounded-full bg-primary text-primary-foreground w-12 h-12 flex items-center justify-center text-xl font-bold">
                      2
                    </div>
                    <TrendingUp className="h-8 w-8 text-primary" />
                  </div>
                  <CardTitle className="text-2xl">Análise Automática</CardTitle>
                  <CardDescription className="text-base leading-relaxed">
                    Nossa IA analisa seus dados, identifica oportunidades de dedução e calcula automaticamente seu patrimônio líquido e impostos.
                  </CardDescription>
                </CardHeader>
              </Card>

              <Card className="border-2 hover:border-primary/50 transition-all hover:shadow-lg">
                <CardHeader className="space-y-4">
                  <div className="flex items-start justify-between">
                    <div className="rounded-full bg-primary text-primary-foreground w-12 h-12 flex items-center justify-center text-xl font-bold">
                      3
                    </div>
                    <FileText className="h-8 w-8 text-primary" />
                  </div>
                  <CardTitle className="text-2xl">Tutorial Personalizado</CardTitle>
                  <CardDescription className="text-base leading-relaxed">
                    Receba um guia passo a passo personalizado de como preencher sua declaração no site da Receita Federal usando seus dados.
                  </CardDescription>
                </CardHeader>
              </Card>

              <Card className="border-2 hover:border-primary/50 transition-all hover:shadow-lg">
                <CardHeader className="space-y-4">
                  <div className="flex items-start justify-between">
                    <div className="rounded-full bg-primary text-primary-foreground w-12 h-12 flex items-center justify-center text-xl font-bold">
                      4
                    </div>
                    <HeadphonesIcon className="h-8 w-8 text-primary" />
                  </div>
                  <CardTitle className="text-2xl">Suporte Completo</CardTitle>
                  <CardDescription className="text-base leading-relaxed">
                    Tire dúvidas com nossa IA via WhatsApp ou receba suporte da nossa equipe especializada durante todo o processo.
                  </CardDescription>
                </CardHeader>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section id="precos" className="py-16 sm:py-24 bg-muted/30">
        <div className="container mx-auto px-4 sm:px-6">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-4 text-balance">
                Escolha seu Plano
              </h2>
              <p className="text-lg sm:text-xl text-muted-foreground text-pretty max-w-3xl mx-auto">
                Comece gratuitamente ou tenha orientação completa para sua declaração
              </p>
            </div>

            <div className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto">
              {/* Free Plan */}
              <Card className="border-2 relative">
                <CardHeader className="space-y-6 pb-8">
                  <div>
                    <CardTitle className="text-2xl mb-2">Plano Gratuito</CardTitle>
                    <CardDescription className="text-base">
                      Perfeito para quem quer organizar seus dados
                    </CardDescription>
                  </div>
                  <div>
                    <div className="flex items-baseline gap-2">
                      <span className="text-5xl font-bold">R$ 0</span>
                      <span className="text-muted-foreground">/sempre</span>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="space-y-6">
                  <ul className="space-y-4">
                    <li className="flex items-start gap-3">
                      <CheckCircle className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
                      <span className="text-base">Cadastro completo de dados pessoais e fiscais</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <CheckCircle className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
                      <span className="text-base">Gestão de bens, rendimentos e despesas</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <CheckCircle className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
                      <span className="text-base">Cálculo automático de patrimônio líquido</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <CheckCircle className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
                      <span className="text-base">Identificação de despesas dedutíveis</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <CheckCircle className="h-5 w-5 text-muted-foreground/50 mt-0.5 flex-shrink-0" />
                      <span className="text-base text-muted-foreground line-through">Tutorial de preenchimento personalizado</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <CheckCircle className="h-5 w-5 text-muted-foreground/50 mt-0.5 flex-shrink-0" />
                      <span className="text-base text-muted-foreground line-through">Suporte especializado</span>
                    </li>
                  </ul>
                  <Link href="/signup" className="block">
                    <Button variant="outline" size="lg" className="w-full text-base">
                      Começar Gratuitamente
                    </Button>
                  </Link>
                </CardContent>
              </Card>

              {/* Paid Plan */}
              <Card className="border-2 border-primary relative shadow-xl shadow-primary/10">
                <div className="absolute -top-4 left-1/2 -translate-x-1/2">
                  <Badge className="text-sm px-4 py-1 shadow-lg">Mais Popular</Badge>
                </div>
                <CardHeader className="space-y-6 pb-8">
                  <div>
                    <CardTitle className="text-2xl mb-2">Plano Completo</CardTitle>
                    <CardDescription className="text-base">
                      Orientação completa para fazer sua declaração
                    </CardDescription>
                  </div>
                  <div>
                    <div className="flex items-baseline gap-2">
                      <span className="text-5xl font-bold text-primary">R$ {price.toFixed(2).replace('.', ',')}</span>
                      <span className="text-muted-foreground">/única vez</span>
                    </div>
                    <p className="text-sm text-muted-foreground mt-2">
                      Pagamento único por declaração
                    </p>
                  </div>
                </CardHeader>
                <CardContent className="space-y-6">
                  <ul className="space-y-4">
                    <li className="flex items-start gap-3">
                      <CheckCircle className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
                      <span className="text-base font-medium">Tudo do Plano Gratuito, mais:</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <CheckCircle className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
                      <span className="text-base">Tutorial passo a passo personalizado</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <CheckCircle className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
                      <span className="text-base">Orientação baseada nos seus dados</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <CheckCircle className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
                      <span className="text-base">Guia de preenchimento no e-CAC</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <CheckCircle className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
                      <span className="text-base">Suporte via WhatsApp AI</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <CheckCircle className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
                      <span className="text-base">Atendimento de equipe especializada</span>
                    </li>
                  </ul>
                  <Link href="/signup" className="block">
                    <Button size="lg" className="w-full text-base shadow-lg shadow-primary/20">
                      Começar Agora
                      <ArrowRight className="ml-2 h-5 w-5" />
                    </Button>
                  </Link>
                </CardContent>
              </Card>
            </div>

            <p className="text-center text-muted-foreground mt-12 text-lg">
              💡 <strong>Dica:</strong> Cadastre-se gratuitamente e organize seus dados. Quando estiver pronto para declarar, upgrade para o plano completo.
            </p>
          </div>
        </div>
      </section>

      {/* CTA Final */}
      <section className="py-16 sm:py-24">
        <div className="container mx-auto px-4 sm:px-6">
          <div className="max-w-4xl mx-auto">
            <Card className="border-2 border-primary/20 bg-gradient-to-br from-primary/5 via-background to-background relative overflow-hidden">
              <div className="absolute inset-0 bg-grid-white/5 [mask-image:radial-gradient(white,transparent_85%)]" />
              <CardHeader className="text-center space-y-6 p-8 sm:p-12 relative">
                <CardTitle className="text-3xl sm:text-4xl md:text-5xl font-bold text-balance">
                  Pronto para Simplificar sua Declaração?
                </CardTitle>
                <CardDescription className="text-lg sm:text-xl text-pretty">
                  Junte-se a milhares de brasileiros que já declararam com segurança usando a Foour
                </CardDescription>
                <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
                  <Link href="/signup">
                    <Button size="lg" className="text-lg px-8 py-6 h-auto shadow-lg">
                      Começar Gratuitamente
                      <ArrowRight className="ml-2 h-5 w-5" />
                    </Button>
                  </Link>
                  <a href="#como-funciona">
                    <Button size="lg" variant="outline" className="text-lg px-8 py-6 h-auto">
                      Saiba Mais
                    </Button>
                  </a>
                </div>
                <div className="flex flex-col sm:flex-row items-center justify-center gap-6 pt-6 text-sm text-muted-foreground">
                  <div className="flex items-center gap-2">
                    <Clock className="h-4 w-4" />
                    <span>Setup em 2 minutos</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Shield className="h-4 w-4" />
                    <span>Dados 100% seguros</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Users className="h-4 w-4" />
                    <span>10k+ usuários</span>
                  </div>
                </div>
              </CardHeader>
            </Card>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border py-12 bg-muted/20">
        <div className="container mx-auto px-4 sm:px-6">
          <div className="max-w-6xl mx-auto grid md:grid-cols-4 gap-8 mb-8">
            <div className="space-y-4">
              <img src="/images/foour-logo01.png" alt="Foour" className="h-8" />
              <p className="text-sm text-muted-foreground">
                Simplificando a declaração de IRPF para todos os brasileiros.
              </p>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Produto</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li><a href="#sobre" className="hover:text-foreground transition-colors">Sobre Nós</a></li>
                <li><a href="#como-funciona" className="hover:text-foreground transition-colors">Como Funciona</a></li>
                <li><a href="#precos" className="hover:text-foreground transition-colors">Preços</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Suporte</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li><Link href="/login" className="hover:text-foreground transition-colors">Entrar</Link></li>
                <li><Link href="/signup" className="hover:text-foreground transition-colors">Criar Conta</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Legal</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li><a href="#" className="hover:text-foreground transition-colors">Termos de Uso</a></li>
                <li><a href="#" className="hover:text-foreground transition-colors">Política de Privacidade</a></li>
              </ul>
            </div>
          </div>
          <div className="border-t border-border pt-8 text-center">
            <p className="text-sm text-muted-foreground">
              © 2025 Foour. Todos os direitos reservados.
            </p>
          </div>
        </div>
      </footer>
    </div>
  )
}
