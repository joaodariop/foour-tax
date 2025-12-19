'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import { Card } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import { Upload, FileText, Info, ExternalLink, AlertCircle } from 'lucide-react'
import { useToast } from '@/hooks/use-toast'

const BANK_GUIDES = [
  {
    bank: 'Nubank',
    steps: [
      'Acesse o app do Nubank',
      'Toque no ícone de perfil (canto superior esquerdo)',
      'Selecione "Documentos e Comprovantes"',
      'Escolha "Informe de Rendimentos" ou "Declaração Anual"',
      'Baixe o PDF do ano desejado'
    ],
    link: 'https://nubank.com.br/ajuda'
  },
  {
    bank: 'Itaú',
    steps: [
      'Acesse o Internet Banking do Itaú',
      'Vá em "Minha Conta" > "Meus Documentos"',
      'Selecione "Informe de Rendimentos"',
      'Escolha o ano-calendário',
      'Faça o download do documento'
    ],
    link: 'https://www.itau.com.br'
  },
  {
    bank: 'Bradesco',
    steps: [
      'Entre no app ou site do Bradesco',
      'Acesse "Produtos e Serviços"',
      'Clique em "Documentos"',
      'Selecione "Informe de Rendimentos"',
      'Baixe o arquivo PDF'
    ],
    link: 'https://banco.bradesco'
  },
  {
    bank: 'Banco do Brasil',
    steps: [
      'Acesse o app ou site do BB',
      'Vá em "Autoatendimento"',
      'Selecione "Documentos e Declarações"',
      'Escolha "Informe de Rendimentos para IRPF"',
      'Gere e baixe o documento'
    ],
    link: 'https://www.bb.com.br'
  },
  {
    bank: 'Caixa Econômica Federal',
    steps: [
      'Entre no Internet Banking da Caixa',
      'Acesse "Meus Documentos"',
      'Clique em "Informe de Rendimentos"',
      'Selecione o período desejado',
      'Baixe o PDF gerado'
    ],
    link: 'https://www.caixa.gov.br'
  },
  {
    bank: 'Inter',
    steps: [
      'Abra o app do Banco Inter',
      'Toque em "Investimentos" ou "Conta"',
      'Acesse "Documentos"',
      'Selecione "Informe de Rendimentos"',
      'Faça o download'
    ],
    link: 'https://www.bancointer.com.br'
  }
]

export function BankDeclarationUpload() {
  const [isOpen, setIsOpen] = useState(false)
  const { toast } = useToast()

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      // TODO: Implement file upload to server
      toast({
        title: 'Arquivo recebido!',
        description: `${file.name} será processado em breve.`,
      })
      setIsOpen(false)
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" className="w-full">
          <FileText className="mr-2 size-4" />
          Anexar Declaração Bancária
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-3xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Declaração Anual do Banco</DialogTitle>
          <DialogDescription>
            Anexe sua declaração/informe de rendimentos ou veja como solicitar no seu banco
          </DialogDescription>
        </DialogHeader>

        <Tabs defaultValue="upload" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="upload">Enviar Arquivo</TabsTrigger>
            <TabsTrigger value="guide">Como Solicitar</TabsTrigger>
          </TabsList>

          <TabsContent value="upload" className="space-y-4">
            <Alert>
              <Info className="size-4" />
              <AlertTitle>Documentos Aceitos</AlertTitle>
              <AlertDescription className="text-sm">
                Informe de Rendimentos, Declaração Anual de Investimentos, 
                Extrato Consolidado ou qualquer documento oficial do banco 
                que contenha dados fiscais.
              </AlertDescription>
            </Alert>

            <Card className="border-2 border-dashed border-muted-foreground/25 hover:border-primary/50 transition-colors">
              <label className="flex flex-col items-center justify-center p-12 cursor-pointer">
                <Upload className="size-12 text-muted-foreground mb-4" />
                <p className="text-sm font-medium mb-1">
                  Clique para selecionar ou arraste o arquivo
                </p>
                <p className="text-xs text-muted-foreground">
                  PDF, JPG ou PNG até 10MB
                </p>
                <input
                  type="file"
                  accept=".pdf,.jpg,.jpeg,.png"
                  onChange={handleFileUpload}
                  className="hidden"
                />
              </label>
            </Card>

            <Alert variant="default" className="bg-blue-50 border-blue-200">
              <Info className="size-4 text-blue-600" />
              <AlertDescription className="text-sm text-blue-900">
                Seus documentos são armazenados com segurança e criptografia. 
                Eles serão usados apenas para facilitar o preenchimento da sua declaração.
              </AlertDescription>
            </Alert>
          </TabsContent>

          <TabsContent value="guide" className="space-y-4">
            <Alert>
              <Info className="size-4" />
              <AlertTitle>Informe de Rendimentos</AlertTitle>
              <AlertDescription className="text-sm">
                Todo banco é obrigado a fornecer o Informe de Rendimentos para IRPF. 
                Este documento contém todos os dados necessários para sua declaração.
              </AlertDescription>
            </Alert>

            <div className="space-y-3">
              {BANK_GUIDES.map((guide) => (
                <Card key={guide.bank} className="p-4 hover:shadow-md transition-shadow">
                  <div className="flex items-start justify-between mb-3">
                    <h4 className="font-semibold text-base">{guide.bank}</h4>
                    <Button
                      variant="ghost"
                      size="sm"
                      asChild
                      className="h-auto p-1"
                    >
                      <a href={guide.link} target="_blank" rel="noopener noreferrer">
                        <ExternalLink className="size-4" />
                      </a>
                    </Button>
                  </div>
                  <ol className="space-y-1.5 text-sm">
                    {guide.steps.map((step, index) => (
                      <li key={index} className="flex gap-2">
                        <span className="font-medium text-primary shrink-0">
                          {index + 1}.
                        </span>
                        <span className="text-muted-foreground">{step}</span>
                      </li>
                    ))}
                  </ol>
                </Card>
              ))}
            </div>

            <Alert variant="default" className="bg-amber-50 border-amber-200">
              <AlertCircle className="size-4 text-amber-600" />
              <AlertDescription className="text-sm text-amber-900">
                Se você não encontrar o documento, entre em contato com o SAC do seu banco. 
                Eles são obrigados a fornecer gratuitamente.
              </AlertDescription>
            </Alert>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  )
}
