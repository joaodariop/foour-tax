-- Criar tabela para anexos de declarações bancárias
CREATE TABLE IF NOT EXISTS bank_account_attachments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  bank_account_id UUID NOT NULL REFERENCES bank_accounts(id) ON DELETE CASCADE,
  file_name TEXT NOT NULL,
  file_url TEXT NOT NULL,
  file_size INTEGER,
  file_type TEXT,
  reference_year INTEGER,
  uploaded_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_bank_account_attachments_user ON bank_account_attachments(user_id);
CREATE INDEX IF NOT EXISTS idx_bank_account_attachments_account ON bank_account_attachments(bank_account_id);

-- Trigger para atualizar updated_at
CREATE OR REPLACE FUNCTION update_bank_account_attachments_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER bank_account_attachments_updated_at
  BEFORE UPDATE ON bank_account_attachments
  FOR EACH ROW
  EXECUTE FUNCTION update_bank_account_attachments_updated_at();
