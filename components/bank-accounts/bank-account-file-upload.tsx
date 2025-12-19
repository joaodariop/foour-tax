'use client'

import { useState, useRef } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import { Upload, FileText } from 'lucide-react'
import { useAuth } from '@/lib/hooks/use-auth'
import { useToast } from '@/hooks/use-toast'

interface BankAccountFileUploadProps {
  accountId: string
  onUploadSuccess?: () => void
}

export function BankAccountFileUpload({ accountId, onUploadSuccess }: BankAccountFileUploadProps) {
  const { user } = useAuth()
  const { toast } = useToast()
  const [open, setOpen] = useState(false)
  const [uploading, setUploading] = useState(false)
  const [file, setFile] = useState<File | null>(null)
  const [referenceYear, setReferenceYear] = useState(new Date().getFullYear().toString())
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0]
    if (selectedFile) {
      // Validate file type (PDF only)
      if (selectedFile.type !== 'application/pdf') {
        toast({
          title: 'Tipo de arquivo inválido',
          description: 'Por favor, selecione um arquivo PDF.',
          variant: 'destructive',
        })
        return
      }
      // Validate file size (max 10MB)
      if (selectedFile.size > 10 * 1024 * 1024) {
        toast({
          title: 'Arquivo muito grande',
          description: 'O arquivo deve ter no máximo 10MB.',
          variant: 'destructive',
        })
        return
      }
      setFile(selectedFile)
    }
  }

  const handleUpload = async () => {
    if (!file || !user) return

    setUploading(true)
    try {
      // In a real app, upload to blob storage first
      // For now, simulate upload
      const formData = new FormData()
      formData.append('file', file)
      formData.append('reference_year', referenceYear)
      formData.append('bank_account_id', accountId)

      const response = await fetch(`/api/bank-accounts/${accountId}/attachments`, {
        method: 'POST',
        headers: {
          'x-user-id': user.id,
        },
        body: formData,
      })

      if (response.ok) {
        toast({
          title: 'Arquivo enviado com sucesso!',
          description: 'A declaração bancária foi anexada à conta.',
        })
        setOpen(false)
        setFile(null)
        if (onUploadSuccess) onUploadSuccess()
      } else {
        throw new Error('Falha ao enviar arquivo')
      }
    } catch (error) {
      console.error('[v0] Upload error:', error)
      toast({
        title: 'Erro ao enviar arquivo',
        description: 'Tente novamente mais tarde.',
        variant: 'destructive',
      })
    } finally {
      setUploading(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm" className="w-full">
          <Upload className="h-4 w-4 mr-2" />
          Anexar Declaração
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Anexar Declaração Bancária</DialogTitle>
          <DialogDescription>
            Envie o arquivo de declaração de rendimentos fornecido pelo seu banco para IR.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="year">Ano de Referência</Label>
            <Input
              id="year"
              type="number"
              min="2020"
              max={new Date().getFullYear()}
              value={referenceYear}
              onChange={(e) => setReferenceYear(e.target.value)}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="file">Arquivo PDF</Label>
            <div className="flex items-center gap-2">
              <Input
                id="file"
                type="file"
                accept=".pdf"
                ref={fileInputRef}
                onChange={handleFileSelect}
                className="cursor-pointer"
              />
            </div>
            {file && (
              <div className="flex items-center gap-2 p-2 bg-muted rounded">
                <FileText className="h-4 w-4" />
                <span className="text-sm truncate">{file.name}</span>
              </div>
            )}
          </div>

          <div className="rounded-lg bg-blue-50 p-3 text-sm text-blue-900">
            <p className="font-medium mb-1">Dica:</p>
            <p>
              Este documento é fornecido pelo banco anualmente e contém informações sobre rendimentos,
              impostos retidos e saldo de contas para a declaração de IR.
            </p>
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => setOpen(false)} disabled={uploading}>
            Cancelar
          </Button>
          <Button onClick={handleUpload} disabled={!file || uploading}>
            {uploading ? 'Enviando...' : 'Enviar Arquivo'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
