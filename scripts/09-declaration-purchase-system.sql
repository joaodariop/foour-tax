CREATE TABLE IF NOT EXISTS system_settings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  setting_key VARCHAR(255) UNIQUE NOT NULL,
  setting_value JSONB NOT NULL,
  description TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Configuração de preço da declaração
INSERT INTO system_settings (setting_key, setting_value, description)
VALUES 
  ('declaration_price', '{"amount": 149.90, "currency": "BRL"}', 'Preço cobrado por declaração')
ON CONFLICT (setting_key) DO NOTHING;

-- Configuração de perfis de cliente
INSERT INTO system_settings (setting_key, setting_value, description)
VALUES 
  ('client_profile_rules', '{
    "autonomous_threshold": {
      "max_assets": 5,
      "max_total_value": 500000,
      "max_debts": 3,
      "max_incomes": 3
    },
    "inconsistency_threshold": {
      "min_assets": 6,
      "min_total_value": 500001
    }
  }', 'Regras para determinar perfil autônomo vs inconsistência')
ON CONFLICT (setting_key) DO NOTHING;

-- Tabela de compras de declaração
CREATE TABLE IF NOT EXISTS declaration_purchases (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  declaration_id UUID REFERENCES declarations(id) ON DELETE SET NULL,
  amount DECIMAL(10, 2) NOT NULL,
  status VARCHAR(50) NOT NULL DEFAULT 'pending', -- pending, completed, cancelled
  payment_method VARCHAR(50),
  payment_id TEXT,
  purchased_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_declaration_purchases_user_id ON declaration_purchases(user_id);
CREATE INDEX IF NOT EXISTS idx_declaration_purchases_status ON declaration_purchases(status);
