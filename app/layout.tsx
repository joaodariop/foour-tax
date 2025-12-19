import type { Metadata } from 'next'
import { Geist, Geist_Mono, Red_Hat_Display, Lexend_Deca } from 'next/font/google'
import './globals.css'
import { OnboardingProvider } from '@/lib/contexts/onboarding-context'
import { WhatsAppButton } from '@/components/support/whatsapp-button'

const _geist = Geist({ subsets: ["latin"] });
const _geistMono = Geist_Mono({ subsets: ["latin"] });
const redHatDisplay = Red_Hat_Display({
  weight: ['700', '800'],
  subsets: ['latin'],
  variable: '--font-heading',
});
const lexendDeca = Lexend_Deca({
  weight: ['300', '400', '500'],
  subsets: ['latin'],
  variable: '--font-body',
});

export const metadata: Metadata = {
  title: 'Foour - Declaração de IRPF',
  description: 'Plataforma moderna para declaração de imposto de renda (IRPF) com assistência guiada e declaração autônoma.',
  generator: 'v0.app',
  icons: {
    icon: [
      {
        url: '/images/foour-logo01.png',
        type: 'image/png',
      },
    ],
    apple: '/images/foour-logo01.png',
  },
  keywords: ['IRPF', 'Declaração Imposto de Renda', 'Foour', 'Imposto de Renda Brasil', 'Tax Declaration'],
  authors: [{ name: 'Foour' }],
}

export const viewport = {
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: '#F87315' },
    { media: '(prefers-color-scheme: dark)', color: '#101827' },
  ],
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="pt-BR">
      <body className={`${redHatDisplay.variable} ${lexendDeca.variable} font-sans antialiased`}>
        <OnboardingProvider>
          {children}
          <WhatsAppButton />
        </OnboardingProvider>
      </body>
    </html>
  )
}
