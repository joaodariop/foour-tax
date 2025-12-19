-- Script completo para sistema de declaração de IR
-- Adiciona todas as tabelas necessárias para uma declaração completa

-- 2. Rendimentos Tributáveis de PJ
CREATE TABLE IF NOT EXISTS taxable_income_pj (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  dependent_id UUID REFERENCES dependents(id) ON DELETE SET NULL,
  cnpj TEXT NOT NULL,
  company_name TEXT NOT NULL,
  income_received NUMERIC(15,2) DEFAULT 0,
  social_security_contribution NUMERIC(15,2) DEFAULT 0,
  withheld_tax NUMERIC(15,2) DEFAULT 0,
  thirteenth_salary NUMERIC(15,2) DEFAULT 0,
  thirteenth_withheld_tax NUMERIC(15,2) DEFAULT 0,
  alimony_received NUMERIC(15,2) DEFAULT 0,
  additional_thirteenths NUMERIC(15,2) DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 3. Rendimentos de PF/Exterior
CREATE TABLE IF NOT EXISTS income_pf_foreign (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  dependent_id UUID REFERENCES dependents(id) ON DELETE SET NULL,
  payer_name TEXT NOT NULL,
  payer_cpf_cnpj TEXT,
  income_type TEXT NOT NULL, -- trabalho_sem_vinculo, alugueis, outros
  amount_received NUMERIC(15,2) DEFAULT 0,
  carne_leao_paid NUMERIC(15,2) DEFAULT 0,
  inss_paid NUMERIC(15,2) DEFAULT 0,
  foreign_tax_paid NUMERIC(15,2) DEFAULT 0,
  currency_conversion_rate NUMERIC(10,4),
  deductible_expenses NUMERIC(15,2) DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 4. Rendimentos Tributação Exclusiva/Definitiva
CREATE TABLE IF NOT EXISTS exclusive_taxation_income (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  dependent_id UUID REFERENCES dependents(id) ON DELETE SET NULL,
  cnpj TEXT,
  income_type TEXT NOT NULL, -- ltc_lci, cdb_juros, 13_exclusivo, plr, aplicacoes_financeiras, juros_capital_proprio
  gross_amount NUMERIC(15,2) DEFAULT 0,
  net_amount NUMERIC(15,2) DEFAULT 0,
  tax_code TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 5. Rendimentos Isentos e Não Tributáveis
CREATE TABLE IF NOT EXISTS tax_exempt_income (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  dependent_id UUID REFERENCES dependents(id) ON DELETE SET NULL,
  cnpj_cpf TEXT,
  income_type TEXT NOT NULL, -- fgts, poupanca, dividendos, aposentadoria, bolsas, doacoes, herancas, bdr_isento
  description TEXT,
  amount NUMERIC(15,2) DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 9. Impostos Pagos e Deduções
CREATE TABLE IF NOT EXISTS taxes_paid (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  tax_type TEXT NOT NULL, -- carne_leao, imposto_exterior, complementar, estimativas, compensacao, doacoes_incentivadas, irrf, recolhimentos_mensais
  amount NUMERIC(15,2) DEFAULT 0,
  payment_date DATE,
  description TEXT,
  receipt_number TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 10. Pagamentos Efetuados (Despesas Dedutíveis)
CREATE TABLE IF NOT EXISTS deductible_expenses (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  dependent_id UUID REFERENCES dependents(id) ON DELETE SET NULL,
  expense_code TEXT NOT NULL,
  provider_name TEXT NOT NULL,
  provider_cpf_cnpj TEXT NOT NULL,
  expense_type TEXT NOT NULL, -- medicas, dentistas, fono, psicologos, hospital, instrucao, pensao_judicial, previdencia_privada, previdencia_oficial, doacoes, aluguel, outros
  amount_paid NUMERIC(15,2) DEFAULT 0,
  payment_date DATE,
  description TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 13. Doações Efetuadas
CREATE TABLE IF NOT EXISTS donations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  donation_code TEXT,
  donation_type TEXT NOT NULL, -- partido_politico, candidato, fundo_eleitoral, pessoa_fisica, instituicao_sem_fins_lucrativos
  beneficiary_cpf_cnpj TEXT NOT NULL,
  beneficiary_name TEXT NOT NULL,
  amount NUMERIC(15,2) DEFAULT 0,
  donation_date DATE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 14. Doações Incentivadas
CREATE TABLE IF NOT EXISTS incentivized_donations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  fund_type TEXT NOT NULL, -- crianca_adolescente_nacional, crianca_adolescente_estadual, crianca_adolescente_municipal, idoso
  entity_cnpj TEXT NOT NULL,
  entity_name TEXT NOT NULL,
  amount NUMERIC(15,2) DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 15. Ganhos de Capital
CREATE TABLE IF NOT EXISTS capital_gains (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  asset_type TEXT NOT NULL,
  acquisition_date DATE NOT NULL,
  acquisition_cost NUMERIC(15,2) DEFAULT 0,
  sale_date DATE NOT NULL,
  sale_amount NUMERIC(15,2) DEFAULT 0,
  expenses NUMERIC(15,2) DEFAULT 0,
  tax_due NUMERIC(15,2) DEFAULT 0,
  exemption_applied BOOLEAN DEFAULT FALSE,
  description TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 16. Operações de Renda Variável - Ações
CREATE TABLE IF NOT EXISTS stock_operations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  operation_month DATE NOT NULL,
  operation_type TEXT NOT NULL, -- swing_trade, day_trade
  purchases NUMERIC(15,2) DEFAULT 0,
  sales NUMERIC(15,2) DEFAULT 0,
  profit_loss NUMERIC(15,2) DEFAULT 0,
  irrf_withheld NUMERIC(15,2) DEFAULT 0,
  loss_compensation NUMERIC(15,2) DEFAULT 0,
  tax_due NUMERIC(15,2) DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 16. Operações de Renda Variável - FIIs/ETFs
CREATE TABLE IF NOT EXISTS fii_operations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  operation_month DATE NOT NULL,
  tax_exempt_income NUMERIC(15,2) DEFAULT 0, -- dividendos FIIs
  sale_gains NUMERIC(15,2) DEFAULT 0,
  accumulated_losses NUMERIC(15,2) DEFAULT 0,
  irrf_withheld NUMERIC(15,2) DEFAULT 0,
  tax_due NUMERIC(15,2) DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 16. Operações de Renda Variável - Criptoativos
CREATE TABLE IF NOT EXISTS crypto_operations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  crypto_type TEXT NOT NULL, -- BTC, ETH, etc
  exchange_name TEXT,
  acquisition_value NUMERIC(15,2) DEFAULT 0,
  sale_month DATE NOT NULL,
  monthly_sales NUMERIC(15,2) DEFAULT 0,
  taxable_gains NUMERIC(15,2) DEFAULT 0, -- acima de 35k
  average_cost NUMERIC(15,2) DEFAULT 0,
  tax_due NUMERIC(15,2) DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Atualizar tabela de atividade rural existente com mais campos
ALTER TABLE rural_activity ADD COLUMN IF NOT EXISTS revenue NUMERIC(15,2) DEFAULT 0;
ALTER TABLE rural_activity ADD COLUMN IF NOT EXISTS expenses NUMERIC(15,2) DEFAULT 0;
ALTER TABLE rural_activity ADD COLUMN IF NOT EXISTS inventory NUMERIC(15,2) DEFAULT 0;
ALTER TABLE rural_activity ADD COLUMN IF NOT EXISTS accumulated_losses NUMERIC(15,2) DEFAULT 0;
ALTER TABLE rural_activity ADD COLUMN IF NOT EXISTS inss_paid NUMERIC(15,2) DEFAULT 0;
ALTER TABLE rural_activity ADD COLUMN IF NOT EXISTS production_sale NUMERIC(15,2) DEFAULT 0;
ALTER TABLE rural_activity ADD COLUMN IF NOT EXISTS tax_due NUMERIC(15,2) DEFAULT 0;

-- Criar índices para performance
CREATE INDEX IF NOT EXISTS idx_taxable_income_pj_user ON taxable_income_pj(user_id);
CREATE INDEX IF NOT EXISTS idx_income_pf_foreign_user ON income_pf_foreign(user_id);
CREATE INDEX IF NOT EXISTS idx_exclusive_taxation_user ON exclusive_taxation_income(user_id);
CREATE INDEX IF NOT EXISTS idx_tax_exempt_income_user ON tax_exempt_income(user_id);
CREATE INDEX IF NOT EXISTS idx_taxes_paid_user ON taxes_paid(user_id);
CREATE INDEX IF NOT EXISTS idx_deductible_expenses_user ON deductible_expenses(user_id);
CREATE INDEX IF NOT EXISTS idx_donations_user ON donations(user_id);
CREATE INDEX IF NOT EXISTS idx_incentivized_donations_user ON incentivized_donations(user_id);
CREATE INDEX IF NOT EXISTS idx_capital_gains_user ON capital_gains(user_id);
CREATE INDEX IF NOT EXISTS idx_stock_operations_user ON stock_operations(user_id);
CREATE INDEX IF NOT EXISTS idx_fii_operations_user ON fii_operations(user_id);
CREATE INDEX IF NOT EXISTS idx_crypto_operations_user ON crypto_operations(user_id);

-- Triggers para updated_at
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
   NEW.updated_at = NOW();
   RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_taxable_income_pj_updated_at BEFORE UPDATE ON taxable_income_pj FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_income_pf_foreign_updated_at BEFORE UPDATE ON income_pf_foreign FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_exclusive_taxation_updated_at BEFORE UPDATE ON exclusive_taxation_income FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_tax_exempt_income_updated_at BEFORE UPDATE ON tax_exempt_income FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_taxes_paid_updated_at BEFORE UPDATE ON taxes_paid FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_deductible_expenses_updated_at BEFORE UPDATE ON deductible_expenses FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_donations_updated_at BEFORE UPDATE ON donations FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_incentivized_donations_updated_at BEFORE UPDATE ON incentivized_donations FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_capital_gains_updated_at BEFORE UPDATE ON capital_gains FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_stock_operations_updated_at BEFORE UPDATE ON stock_operations FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_fii_operations_updated_at BEFORE UPDATE ON fii_operations FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_crypto_operations_updated_at BEFORE UPDATE ON crypto_operations FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
