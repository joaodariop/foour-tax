-- Tabela de notificações do sistema
CREATE TABLE IF NOT EXISTS notifications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  type VARCHAR(20) NOT NULL CHECK (type IN ('info', 'warning', 'success', 'alert')),
  title VARCHAR(255) NOT NULL,
  message TEXT NOT NULL,
  is_read BOOLEAN DEFAULT FALSE,
  is_global BOOLEAN DEFAULT FALSE, -- Se TRUE, aparece para todos os usuários
  created_at TIMESTAMP DEFAULT NOW(),
  expires_at TIMESTAMP, -- Opcional: data de expiração da notificação
  metadata JSONB -- Dados extras (links, ações, etc)
);

-- Índices para performance
CREATE INDEX IF NOT EXISTS idx_notifications_user_id ON notifications(user_id);
CREATE INDEX IF NOT EXISTS idx_notifications_is_read ON notifications(is_read);
CREATE INDEX IF NOT EXISTS idx_notifications_is_global ON notifications(is_global);
CREATE INDEX IF NOT EXISTS idx_notifications_created_at ON notifications(created_at DESC);

-- Trigger para atualizar updated_at (se adicionar essa coluna)
CREATE OR REPLACE FUNCTION update_notifications_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Adicionar coluna updated_at se necessário
ALTER TABLE notifications ADD COLUMN IF NOT EXISTS updated_at TIMESTAMP DEFAULT NOW();

CREATE TRIGGER trigger_update_notifications_updated_at
  BEFORE UPDATE ON notifications
  FOR EACH ROW
  EXECUTE FUNCTION update_notifications_updated_at();

-- Inserir algumas notificações de exemplo para o sistema
INSERT INTO notifications (type, title, message, is_global, metadata) VALUES
  ('info', 'Bem-vindo ao Foour!', 'Complete seu perfil para começar a gerenciar suas declarações de forma eficiente.', TRUE, '{"action": "/profile"}'),
  ('warning', 'Prazo de declaração se aproxima', 'Lembre-se: o prazo para entrega da declaração do IR 2024 termina em 31 de maio.', TRUE, NULL),
  ('info', 'Dica: Organize seus documentos', 'Mantenha todos os seus comprovantes e documentos organizados para facilitar o preenchimento.', TRUE, NULL);
