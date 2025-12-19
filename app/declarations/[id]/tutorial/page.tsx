'use client'

import { useState } from 'react'
import { useRouter, useParams } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { CheckCircle2, Circle, ExternalLink } from 'lucide-react'
import { Separator } from '@/components/ui/separator'

export default function DeclarationTutorialPage() {
  const router = useRouter()
  const params = useParams()
  const [currentStep, setCurrentStep] = useState(0)

  const steps = [
    {
      title: 'Acesse o Programa da Receita Federal',
      description: 'Baixe e instale o programa oficial do IRPF',
      content: (
        <div className="space-y-4">
          <p>Primeiro, você precisa baixar o programa oficial da Receita Federal:</p>
          <Button asChild className="w-full">
            <a href="https://www.gov.br/receitafederal/pt-br/centrais-de-conteudo/download/pgd/dirpf" target="_blank">
              <ExternalLink className="mr-2 h-4 w-4" />
              Baixar Programa IRPF 2024
            </a>
          </Button>
          <Alert>
            <AlertDescription>
              Escolha a versão compatível com seu sistema operacional (Windows, Mac ou Linux)
            </AlertDescription>
          </Alert>
        </div>
      )
    },
    {
      title: 'Prepare seus Documentos',
      description: 'Tenha em mãos os documentos necessários',
      content: (
        <div className="space-y-3">
          <p className="font-semibold">Documentos que você já cadastrou no sistema:</p>
          <ul className="space-y-2 ml-4">
            <li className="flex items-start gap-2">
              <CheckCircle2 className="h-5 w-5 text-green-600 mt-0.5 flex-shrink-0" />
              <span>Dados pessoais e CPF (já preenchidos no perfil)</span>
            </li>
            <li className="flex items-start gap-2">
              <CheckCircle2 className="h-5 w-5 text-green-600 mt-0.5 flex-shrink-0" />
              <span>Bens e ativos cadastrados</span>
            </li>
            <li className="flex items-start gap-2">
              <CheckCircle2 className="h-5 w-5 text-green-600 mt-0.5 flex-shrink-0" />
              <span>Rendimentos e despesas dedutíveis</span>
            </li>
          </ul>
          <Separator />
          <p className="font-semibold">Documentos adicionais necessários:</p>
          <ul className="space-y-1 ml-4 text-sm text-muted-foreground">
            <li>• Informes de rendimentos (empresas, bancos, aluguéis)</li>
            <li>• Comprovantes de despesas médicas (se aplicável)</li>
            <li>• Recibos de doações</li>
            <li>• Documentos de compra/venda de bens</li>
          </ul>
        </div>
      )
    },
    {
      title: 'Inicie Nova Declaração',
      description: 'Crie uma nova declaração no programa',
      content: (
        <div className="space-y-3">
          <ol className="space-y-3 ml-4">
            <li className="flex gap-3">
              <span className="flex-shrink-0 w-6 h-6 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-sm font-semibold">1</span>
              <div>
                <p className="font-semibold">Abra o programa da Receita</p>
                <p className="text-sm text-muted-foreground">Clique em "Criar Nova Declaração"</p>
              </div>
            </li>
            <li className="flex gap-3">
              <span className="flex-shrink-0 w-6 h-6 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-sm font-semibold">2</span>
              <div>
                <p className="font-semibold">Escolha o tipo de declaração</p>
                <p className="text-sm text-muted-foreground">Selecione "Declaração de Ajuste Anual" e o ano correspondente</p>
              </div>
            </li>
            <li className="flex gap-3">
              <span className="flex-shrink-0 w-6 h-6 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-sm font-semibold">3</span>
              <div>
                <p className="font-semibold">Informe seus dados</p>
                <p className="text-sm text-muted-foreground">Use as informações do seu perfil Foour para preencher</p>
              </div>
            </li>
          </ol>
        </div>
      )
    },
    {
      title: 'Preencha as Fichas',
      description: 'Insira os dados de acordo com seu perfil',
      content: (
        <div className="space-y-4">
          <Alert>
            <AlertDescription>
              Use os dados cadastrados no sistema Foour como referência para cada ficha do programa da Receita
            </AlertDescription>
          </Alert>
          <div className="space-y-3">
            <div className="p-3 border rounded-lg">
              <p className="font-semibold mb-1">Ficha: Identificação do Contribuinte</p>
              <p className="text-sm text-muted-foreground">→ Use os dados do seu Perfil</p>
            </div>
            <div className="p-3 border rounded-lg">
              <p className="font-semibold mb-1">Ficha: Bens e Direitos</p>
              <p className="text-sm text-muted-foreground">→ Use os dados de Bens e Ativos cadastrados</p>
            </div>
            <div className="p-3 border rounded-lg">
              <p className="font-semibold mb-1">Ficha: Rendimentos Tributáveis</p>
              <p className="text-sm text-muted-foreground">→ Use os Rendimentos PJ cadastrados</p>
            </div>
            <div className="p-3 border rounded-lg">
              <p className="font-semibold mb-1">Ficha: Pagamentos Efetuados</p>
              <p className="text-sm text-muted-foreground">→ Use as Despesas Dedutíveis cadastradas</p>
            </div>
          </div>
        </div>
      )
    },
    {
      title: 'Revise e Transmita',
      description: 'Confira tudo antes de enviar',
      content: (
        <div className="space-y-4">
          <div className="space-y-3">
            <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
              <p className="font-semibold text-yellow-900 mb-2">⚠️ Checklist Final</p>
              <ul className="space-y-1 text-sm text-yellow-800">
                <li>✓ Todos os campos obrigatórios preenchidos</li>
                <li>✓ Valores conferidos e corretos</li>
                <li>✓ CPFs e CNPJs validados</li>
                <li>✓ Bens e direitos declarados</li>
              </ul>
            </div>
          </div>
          
          <p className="text-sm">
            Após revisar, clique em <strong>"Transmitir Declaração"</strong> no programa da Receita Federal.
          </p>
          
          <Alert className="bg-green-50 border-green-200">
            <AlertDescription className="text-green-900">
              Guarde o recibo de entrega! Você pode cadastrá-lo aqui no sistema após a transmissão.
            </AlertDescription>
          </Alert>
        </div>
      )
    }
  ]

  return (
    <div className="container mx-auto px-4 py-6 max-w-4xl">
      <div className="mb-6">
        <h1 className="text-3xl font-bold mb-2">Tutorial: Como Preencher sua Declaração</h1>
        <p className="text-muted-foreground">
          Siga este guia passo a passo para declarar seu IRPF usando os dados do sistema Foour
        </p>
      </div>

      <div className="grid md:grid-cols-[250px_1fr] gap-6">
        {/* Sidebar com steps */}
        <div className="space-y-2">
          {steps.map((step, index) => (
            <button
              key={index}
              onClick={() => setCurrentStep(index)}
              className={`w-full text-left p-3 rounded-lg transition-colors ${
                currentStep === index 
                  ? 'bg-primary text-primary-foreground' 
                  : 'bg-muted hover:bg-muted/80'
              }`}
            >
              <div className="flex items-start gap-2">
                {currentStep > index ? (
                  <CheckCircle2 className="h-5 w-5 flex-shrink-0 mt-0.5" />
                ) : (
                  <Circle className="h-5 w-5 flex-shrink-0 mt-0.5" />
                )}
                <div>
                  <p className="font-semibold text-sm">Passo {index + 1}</p>
                  <p className="text-xs opacity-90">{step.title}</p>
                </div>
              </div>
            </button>
          ))}
        </div>

        {/* Content */}
        <Card>
          <CardHeader>
            <div className="flex items-center gap-2 mb-2">
              <span className="flex-shrink-0 w-8 h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-bold">
                {currentStep + 1}
              </span>
              <div>
                <CardTitle>{steps[currentStep].title}</CardTitle>
                <CardDescription>{steps[currentStep].description}</CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            {steps[currentStep].content}
            
            <div className="flex justify-between mt-6 pt-6 border-t">
              <Button
                variant="outline"
                onClick={() => setCurrentStep(Math.max(0, currentStep - 1))}
                disabled={currentStep === 0}
              >
                Anterior
              </Button>
              
              {currentStep < steps.length - 1 ? (
                <Button onClick={() => setCurrentStep(currentStep + 1)}>
                  Próximo Passo
                </Button>
              ) : (
                <Button onClick={() => router.push('/declarations')}>
                  Concluir Tutorial
                </Button>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
