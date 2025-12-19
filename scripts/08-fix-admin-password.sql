-- Atualizar a senha do admin para texto simples (temporário para desenvolvimento)
-- Senha: Admin@123
UPDATE admins 
SET password_hash = 'Admin@123'
WHERE email = 'admin@foour.com.br';

-- Se o admin não existir, criar
INSERT INTO admins (email, password_hash, full_name, role, is_active)
VALUES (
  'admin@foour.com.br',
  'Admin@123',
  'Super Administrador',
  'superadmin',
  true
)
ON CONFLICT (email) 
DO UPDATE SET 
  password_hash = 'Admin@123',
  is_active = true;
