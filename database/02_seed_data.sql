-- ============================================
-- BARBERX - Dados de Teste
-- Execute no Supabase SQL Editor APOS o schema
-- ============================================

-- Inserir barbearia de teste
INSERT INTO barbearias (nome, slug, telefone, email, endereco, cidade, estado, cep, descricao, horario_abertura, horario_fechamento)
VALUES (
    'Barbearia Teste',
    'barbearia-teste',
    '11999999999',
    'teste@barberx.com',
    'Rua das Flores, 123',
    'Sao Paulo',
    'SP',
    '01234-567',
    'A melhor barbearia da regiao! Cortes modernos e atendimento de primeira.',
    '08:00',
    '20:00'
);

-- Inserir servicos
INSERT INTO servicos (barbearia_id, nome, preco, duracao_minutos, categoria, descricao, ordem)
SELECT
    id,
    'Corte Masculino',
    45.00,
    30,
    'corte',
    'Corte tradicional masculino com maquina e tesoura',
    1
FROM barbearias WHERE slug = 'barbearia-teste';

INSERT INTO servicos (barbearia_id, nome, preco, duracao_minutos, categoria, descricao, ordem)
SELECT
    id,
    'Barba',
    30.00,
    20,
    'barba',
    'Aparar e modelar a barba com navalha',
    2
FROM barbearias WHERE slug = 'barbearia-teste';

INSERT INTO servicos (barbearia_id, nome, preco, duracao_minutos, categoria, descricao, ordem)
SELECT
    id,
    'Corte + Barba',
    65.00,
    45,
    'combo',
    'Combo completo: corte masculino + barba',
    3
FROM barbearias WHERE slug = 'barbearia-teste';

INSERT INTO servicos (barbearia_id, nome, preco, duracao_minutos, categoria, descricao, ordem)
SELECT
    id,
    'Platinado',
    150.00,
    90,
    'coloracao',
    'Descoloracao completa do cabelo',
    4
FROM barbearias WHERE slug = 'barbearia-teste';

INSERT INTO servicos (barbearia_id, nome, preco, duracao_minutos, categoria, descricao, ordem)
SELECT
    id,
    'Pigmentacao',
    80.00,
    60,
    'coloracao',
    'Pigmentacao da barba para cobertura de falhas',
    5
FROM barbearias WHERE slug = 'barbearia-teste';

-- Inserir profissionais
INSERT INTO profissionais (barbearia_id, nome, apelido, telefone, email, comissao_percentual, cor_agenda)
SELECT
    id,
    'Joao Silva',
    'Joao',
    '11988881111',
    'joao@barberx.com',
    50.00,
    '#d4a853'
FROM barbearias WHERE slug = 'barbearia-teste';

INSERT INTO profissionais (barbearia_id, nome, apelido, telefone, email, comissao_percentual, cor_agenda)
SELECT
    id,
    'Pedro Santos',
    'Pedrao',
    '11988882222',
    'pedro@barberx.com',
    50.00,
    '#3b82f6'
FROM barbearias WHERE slug = 'barbearia-teste';

INSERT INTO profissionais (barbearia_id, nome, apelido, telefone, email, comissao_percentual, cor_agenda)
SELECT
    id,
    'Carlos Oliveira',
    'Carlao',
    '11988883333',
    'carlos@barberx.com',
    45.00,
    '#22c55e'
FROM barbearias WHERE slug = 'barbearia-teste';

-- Associar todos os servicos a todos os profissionais
INSERT INTO profissional_servicos (profissional_id, servico_id)
SELECT p.id, s.id
FROM profissionais p
CROSS JOIN servicos s
WHERE p.barbearia_id = s.barbearia_id;

-- Verificar dados inseridos
SELECT 'Barbearias' as tabela, COUNT(*) as total FROM barbearias
UNION ALL
SELECT 'Servicos', COUNT(*) FROM servicos
UNION ALL
SELECT 'Profissionais', COUNT(*) FROM profissionais
UNION ALL
SELECT 'Profissional_Servicos', COUNT(*) FROM profissional_servicos;
