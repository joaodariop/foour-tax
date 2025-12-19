-- FOOUR Tax App - Complete Schema
-- Sistema simples sem Supabase Auth e sem RLS
-- Execute este script ÚNICO no Supabase SQL Editor

-- Limpar schema existente
DROP TABLE IF EXISTS admin_roles CASCADE;
DROP TABLE IF EXISTS products CASCADE;
DROP TABLE IF EXISTS inconsistencies CASCADE;
DROP TABLE IF EXISTS questionnaire_responses CASCADE;
DROP TABLE IF EXISTS declarations CASCADE;
DROP TABLE IF EXISTS incomes CASCADE;
DROP TABLE IF EXISTS debts CASCADE;
DROP TABLE IF EXISTS assets CASCADE;
DROP TABLE IF EXISTS profiles CASCADE;
DROP TABLE IF EXISTS users CASCADE;

-- Função para atualizar updated_at
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- 1. USERS TABLE (Autenticação simples)
CREATE TABLE users (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  email text UNIQUE NOT NULL,
  password text NOT NULL,
  full_name text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

CREATE INDEX idx_users_email ON users(email);
CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON users 
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- 2. PROFILES TABLE (Dados pessoais do usuário)
CREATE TABLE profiles (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES users(id) ON DELETE CASCADE,
  cpf text,
  birth_date date,
  phone text,
  occupation text,
  marital_status text,
  address_zip text,
  address_street text,
  address_number text,
  address_complement text,
  address_neighborhood text,
  address_city text,
  address_state text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  UNIQUE(user_id)
);

CREATE INDEX idx_profiles_user_id ON profiles(user_id);
CREATE TRIGGER update_profiles_updated_at BEFORE UPDATE ON profiles 
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- 3. ASSETS TABLE (Bens)
CREATE TABLE assets (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES users(id) ON DELETE CASCADE,
  type text NOT NULL,
  description text NOT NULL,
  value decimal(15,2) NOT NULL,
  acquisition_date date,
  status text DEFAULT 'active',
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

CREATE INDEX idx_assets_user_id ON assets(user_id);
CREATE TRIGGER update_assets_updated_at BEFORE UPDATE ON assets 
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- 4. DEBTS TABLE (Dívidas)
CREATE TABLE debts (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES users(id) ON DELETE CASCADE,
  type text NOT NULL,
  description text NOT NULL,
  value decimal(15,2) NOT NULL,
  creditor text,
  due_date date,
  status text DEFAULT 'active',
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

CREATE INDEX idx_debts_user_id ON debts(user_id);
CREATE TRIGGER update_debts_updated_at BEFORE UPDATE ON debts 
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- 5. INCOMES TABLE (Rendimentos)
CREATE TABLE incomes (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES users(id) ON DELETE CASCADE,
  type text NOT NULL,
  description text NOT NULL,
  value decimal(15,2) NOT NULL,
  source text,
  received_date date,
  status text DEFAULT 'active',
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

CREATE INDEX idx_incomes_user_id ON incomes(user_id);
CREATE TRIGGER update_incomes_updated_at BEFORE UPDATE ON incomes 
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- 6. DECLARATIONS TABLE (Declarações IRPF)
CREATE TABLE declarations (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES users(id) ON DELETE CASCADE,
  year integer NOT NULL,
  type text NOT NULL,
  status text DEFAULT 'draft',
  total_income decimal(15,2),
  total_assets decimal(15,2),
  receipt_number text,
  submitted_at timestamptz,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

CREATE INDEX idx_declarations_user_id ON declarations(user_id);
CREATE TRIGGER update_declarations_updated_at BEFORE UPDATE ON declarations 
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- 7. QUESTIONNAIRE_RESPONSES TABLE (Respostas do questionário)
CREATE TABLE questionnaire_responses (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES users(id) ON DELETE CASCADE,
  declaration_id uuid REFERENCES declarations(id) ON DELETE CASCADE,
  question_key text NOT NULL,
  answer jsonb,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

CREATE INDEX idx_questionnaire_user_id ON questionnaire_responses(user_id);
CREATE TRIGGER update_questionnaire_updated_at BEFORE UPDATE ON questionnaire_responses 
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- 8. INCONSISTENCIES TABLE (Inconsistências detectadas)
CREATE TABLE inconsistencies (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES users(id) ON DELETE CASCADE,
  declaration_id uuid REFERENCES declarations(id) ON DELETE CASCADE,
  type text NOT NULL,
  description text,
  severity text DEFAULT 'medium',
  status text DEFAULT 'pending',
  resolved_at timestamptz,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

CREATE INDEX idx_inconsistencies_user_id ON inconsistencies(user_id);
CREATE TRIGGER update_inconsistencies_updated_at BEFORE UPDATE ON inconsistencies 
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- 9. PRODUCTS TABLE (Marketplace/Oportunidades)
CREATE TABLE products (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  description text,
  category text,
  price decimal(10,2),
  image_url text,
  external_url text,
  is_active boolean DEFAULT true,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

CREATE TRIGGER update_products_updated_at BEFORE UPDATE ON products 
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- 10. ADMIN_ROLES TABLE (Controle de acesso admin)
CREATE TABLE admin_roles (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES users(id) ON DELETE CASCADE,
  role text DEFAULT 'admin',
  created_at timestamptz DEFAULT now(),
  UNIQUE(user_id)
);

CREATE INDEX idx_admin_roles_user_id ON admin_roles(user_id);

-- Dados de exemplo (opcional - remova se não quiser)
-- Criar usuário admin de exemplo
-- Email: admin@foour.com | Senha: admin123
INSERT INTO users (email, password, full_name) 
VALUES ('admin@foour.com', 'admin123', 'Administrador Foour');

-- Tornar o usuário admin
INSERT INTO admin_roles (user_id, role) 
SELECT id, 'admin' FROM users WHERE email = 'admin@foour.com';

-- Produtos de exemplo no marketplace
INSERT INTO products (title, description, category, price, is_active) VALUES
('Consultoria Tributária', 'Consultoria especializada em planejamento tributário', 'Serviços', 500.00, true),
('Curso IRPF Completo', 'Curso online sobre declaração de IRPF', 'Educação', 199.90, true),
('Revisão de Declaração', 'Revisão profissional da sua declaração', 'Serviços', 299.00, true);
