-- Tabela de cônjuge
CREATE TABLE IF NOT EXISTS spouses (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  cpf TEXT,
  full_name TEXT,
  birth_date DATE,
  marriage_regime TEXT, -- Regime de casamento
  declaration_type TEXT, -- conjunta ou separada
  has_income BOOLEAN DEFAULT false,
  responsible_for_common_assets TEXT, -- 'user' ou 'spouse'
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id)
);

-- Tabela de dependentes
CREATE TABLE IF NOT EXISTS dependents (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  cpf TEXT,
  full_name TEXT NOT NULL,
  birth_date DATE,
  relationship TEXT NOT NULL, -- filho, enteado, pai, mãe, etc
  lives_with_taxpayer BOOLEAN DEFAULT true,
  has_income BOOLEAN DEFAULT false,
  education_level TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Tabela de dados bancários
CREATE TABLE IF NOT EXISTS bank_accounts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  bank_code TEXT,
  bank_name TEXT,
  agency TEXT,
  account_number TEXT,
  account_type TEXT, -- corrente, poupança
  ownership TEXT, -- própria, conjunta
  is_default BOOLEAN DEFAULT false,
  auto_debit_authorized BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Tabela de informações específicas
CREATE TABLE IF NOT EXISTS taxpayer_info (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  voter_id TEXT, -- Título de eleitor
  occupation_code TEXT,
  occupation_nature TEXT,
  declaration_type TEXT, -- original ou retificadora
  previous_receipt_number TEXT,
  changed_address_during_year BOOLEAN DEFAULT false,
  resident_in_brazil BOOLEAN DEFAULT true,
  has_foreign_assets BOOLEAN DEFAULT false,
  started_activity BOOLEAN DEFAULT false,
  ended_activity BOOLEAN DEFAULT false,
  authorizes_prefilled BOOLEAN DEFAULT true,
  authorizes_sharing_with_rfb BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id)
);

-- Tabela de empregados domésticos
CREATE TABLE IF NOT EXISTS domestic_employees (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  cpf TEXT NOT NULL,
  full_name TEXT NOT NULL,
  admission_date DATE,
  termination_date DATE,
  esocial_contributions BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Tabela de atividade rural
CREATE TABLE IF NOT EXISTS rural_activity (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  has_rural_activity BOOLEAN DEFAULT false,
  exploitation_type TEXT,
  co_exploiters JSONB, -- Array de CPF/CNPJ dos coexploradores
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id)
);

-- Atualizar tabela profiles com novos campos
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS voter_id TEXT;
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS birth_date DATE;
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS email TEXT;
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS cell_phone TEXT;

-- Criar índices para melhor performance
CREATE INDEX IF NOT EXISTS idx_dependents_user_id ON dependents(user_id);
CREATE INDEX IF NOT EXISTS idx_bank_accounts_user_id ON bank_accounts(user_id);
CREATE INDEX IF NOT EXISTS idx_domestic_employees_user_id ON domestic_employees(user_id);

-- Função para atualizar updated_at
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Triggers para atualizar updated_at automaticamente
DROP TRIGGER IF EXISTS update_spouses_updated_at ON spouses;
CREATE TRIGGER update_spouses_updated_at BEFORE UPDATE ON spouses
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_dependents_updated_at ON dependents;
CREATE TRIGGER update_dependents_updated_at BEFORE UPDATE ON dependents
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_bank_accounts_updated_at ON bank_accounts;
CREATE TRIGGER update_bank_accounts_updated_at BEFORE UPDATE ON bank_accounts
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_taxpayer_info_updated_at ON taxpayer_info;
CREATE TRIGGER update_taxpayer_info_updated_at BEFORE UPDATE ON taxpayer_info
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_domestic_employees_updated_at ON domestic_employees;
CREATE TRIGGER update_domestic_employees_updated_at BEFORE UPDATE ON domestic_employees
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_rural_activity_updated_at ON rural_activity;
CREATE TRIGGER update_rural_activity_updated_at BEFORE UPDATE ON rural_activity
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
