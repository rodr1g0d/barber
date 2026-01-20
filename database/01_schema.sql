-- ============================================
-- BARBERX - Schema do Banco de Dados
-- Execute no Supabase SQL Editor
-- ============================================

-- Habilitar extensões necessárias
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ============================================
-- TABELA: barbearias (tenants)
-- ============================================
CREATE TABLE barbearias (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    nome VARCHAR(255) NOT NULL,
    slug VARCHAR(100) UNIQUE NOT NULL, -- URL amigável: barberx.com/slug
    descricao TEXT,
    logo_url TEXT,
    telefone VARCHAR(20),
    email VARCHAR(255),

    -- Endereço
    endereco VARCHAR(255),
    cidade VARCHAR(100),
    estado VARCHAR(2),
    cep VARCHAR(10),
    latitude DECIMAL(10, 8),
    longitude DECIMAL(11, 8),

    -- Configurações
    horario_abertura TIME DEFAULT '08:00',
    horario_fechamento TIME DEFAULT '20:00',
    dias_funcionamento JSONB DEFAULT '["seg", "ter", "qua", "qui", "sex", "sab"]',
    intervalo_agendamento INTEGER DEFAULT 30, -- minutos

    -- PIX
    chave_pix VARCHAR(255),
    tipo_chave_pix VARCHAR(20), -- cpf, cnpj, email, telefone, aleatoria

    -- Plano
    plano VARCHAR(20) DEFAULT 'basico', -- basico, pro
    plano_ativo BOOLEAN DEFAULT true,
    plano_expira_em TIMESTAMP WITH TIME ZONE,

    -- Metadata
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ============================================
-- TABELA: usuarios (admins e clientes)
-- ============================================
CREATE TABLE usuarios (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    auth_id UUID UNIQUE, -- ID do Supabase Auth

    nome VARCHAR(255) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    telefone VARCHAR(20),
    avatar_url TEXT,

    -- Tipo de usuário
    tipo VARCHAR(20) NOT NULL DEFAULT 'cliente', -- admin, profissional, cliente

    -- Se for admin/profissional, pertence a uma barbearia
    barbearia_id UUID REFERENCES barbearias(id) ON DELETE SET NULL,

    -- OAuth
    provider VARCHAR(20), -- google, facebook, email
    provider_id VARCHAR(255),

    -- Metadata
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    ultimo_login TIMESTAMP WITH TIME ZONE
);

-- ============================================
-- TABELA: profissionais
-- ============================================
CREATE TABLE profissionais (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    barbearia_id UUID NOT NULL REFERENCES barbearias(id) ON DELETE CASCADE,
    usuario_id UUID REFERENCES usuarios(id) ON DELETE SET NULL,

    nome VARCHAR(255) NOT NULL,
    apelido VARCHAR(100),
    foto_url TEXT,
    telefone VARCHAR(20),
    email VARCHAR(255),

    -- Configurações
    ativo BOOLEAN DEFAULT true,
    comissao_percentual DECIMAL(5, 2) DEFAULT 50.00, -- % de comissão
    cor_agenda VARCHAR(7) DEFAULT '#d4a853', -- cor no calendário

    -- Horários específicos (sobrescreve barbearia)
    horario_abertura TIME,
    horario_fechamento TIME,
    dias_trabalho JSONB, -- ["seg", "ter", "qua", "qui", "sex"]

    -- Metadata
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ============================================
-- TABELA: servicos
-- ============================================
CREATE TABLE servicos (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    barbearia_id UUID NOT NULL REFERENCES barbearias(id) ON DELETE CASCADE,

    nome VARCHAR(255) NOT NULL,
    descricao TEXT,
    preco DECIMAL(10, 2) NOT NULL,
    duracao_minutos INTEGER NOT NULL DEFAULT 30,

    -- Categorias
    categoria VARCHAR(100), -- corte, barba, combo, coloracao, etc

    -- Configurações
    ativo BOOLEAN DEFAULT true,
    ordem INTEGER DEFAULT 0, -- ordem de exibição

    -- Metadata
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ============================================
-- TABELA: profissional_servicos (N:N)
-- Quais serviços cada profissional faz
-- ============================================
CREATE TABLE profissional_servicos (
    profissional_id UUID NOT NULL REFERENCES profissionais(id) ON DELETE CASCADE,
    servico_id UUID NOT NULL REFERENCES servicos(id) ON DELETE CASCADE,

    -- Preço específico do profissional (opcional)
    preco_especial DECIMAL(10, 2),

    PRIMARY KEY (profissional_id, servico_id)
);

-- ============================================
-- TABELA: agendamentos
-- ============================================
CREATE TABLE agendamentos (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    barbearia_id UUID NOT NULL REFERENCES barbearias(id) ON DELETE CASCADE,
    profissional_id UUID NOT NULL REFERENCES profissionais(id) ON DELETE CASCADE,
    cliente_id UUID REFERENCES usuarios(id) ON DELETE SET NULL,
    servico_id UUID NOT NULL REFERENCES servicos(id) ON DELETE CASCADE,

    -- Data/Hora
    data DATE NOT NULL,
    hora_inicio TIME NOT NULL,
    hora_fim TIME NOT NULL,

    -- Valores
    preco DECIMAL(10, 2) NOT NULL,

    -- Status
    status VARCHAR(20) DEFAULT 'pendente', -- pendente, confirmado, concluido, cancelado, faltou

    -- Cliente (se não tiver conta)
    cliente_nome VARCHAR(255),
    cliente_telefone VARCHAR(20),
    cliente_email VARCHAR(255),

    -- Observações
    observacoes TEXT,

    -- Pagamento
    pago BOOLEAN DEFAULT false,
    forma_pagamento VARCHAR(20), -- pix, dinheiro, cartao
    pago_em TIMESTAMP WITH TIME ZONE,

    -- Avaliação
    avaliacao INTEGER CHECK (avaliacao >= 1 AND avaliacao <= 5),
    avaliacao_comentario TEXT,
    avaliacao_em TIMESTAMP WITH TIME ZONE,

    -- Metadata
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    cancelado_em TIMESTAMP WITH TIME ZONE,
    cancelado_motivo TEXT
);

-- ============================================
-- TABELA: horarios_bloqueados
-- Folgas, férias, horários indisponíveis
-- ============================================
CREATE TABLE horarios_bloqueados (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    barbearia_id UUID NOT NULL REFERENCES barbearias(id) ON DELETE CASCADE,
    profissional_id UUID REFERENCES profissionais(id) ON DELETE CASCADE, -- NULL = toda barbearia

    data_inicio DATE NOT NULL,
    data_fim DATE NOT NULL,
    hora_inicio TIME, -- NULL = dia inteiro
    hora_fim TIME,

    motivo VARCHAR(255),

    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ============================================
-- TABELA: lista_espera
-- ============================================
CREATE TABLE lista_espera (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    barbearia_id UUID NOT NULL REFERENCES barbearias(id) ON DELETE CASCADE,
    profissional_id UUID REFERENCES profissionais(id) ON DELETE CASCADE,
    servico_id UUID NOT NULL REFERENCES servicos(id) ON DELETE CASCADE,

    cliente_id UUID REFERENCES usuarios(id) ON DELETE CASCADE,
    cliente_nome VARCHAR(255),
    cliente_telefone VARCHAR(20),
    cliente_email VARCHAR(255),

    data_desejada DATE NOT NULL,
    horario_preferido VARCHAR(20), -- manha, tarde, noite, qualquer

    notificado BOOLEAN DEFAULT false,
    notificado_em TIMESTAMP WITH TIME ZONE,

    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ============================================
-- TABELA: portfolio (fotos de trabalhos)
-- ============================================
CREATE TABLE portfolio (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    barbearia_id UUID NOT NULL REFERENCES barbearias(id) ON DELETE CASCADE,
    profissional_id UUID REFERENCES profissionais(id) ON DELETE CASCADE,

    imagem_url TEXT NOT NULL,
    titulo VARCHAR(255),
    descricao TEXT,

    ativo BOOLEAN DEFAULT true,
    ordem INTEGER DEFAULT 0,

    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ============================================
-- ÍNDICES para performance
-- ============================================
CREATE INDEX idx_agendamentos_data ON agendamentos(data);
CREATE INDEX idx_agendamentos_barbearia ON agendamentos(barbearia_id);
CREATE INDEX idx_agendamentos_profissional ON agendamentos(profissional_id);
CREATE INDEX idx_agendamentos_status ON agendamentos(status);
CREATE INDEX idx_usuarios_email ON usuarios(email);
CREATE INDEX idx_usuarios_barbearia ON usuarios(barbearia_id);
CREATE INDEX idx_barbearias_slug ON barbearias(slug);
CREATE INDEX idx_profissionais_barbearia ON profissionais(barbearia_id);
CREATE INDEX idx_servicos_barbearia ON servicos(barbearia_id);

-- ============================================
-- FUNÇÃO: Atualizar updated_at automaticamente
-- ============================================
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Triggers para updated_at
CREATE TRIGGER update_barbearias_updated_at BEFORE UPDATE ON barbearias FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_usuarios_updated_at BEFORE UPDATE ON usuarios FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_profissionais_updated_at BEFORE UPDATE ON profissionais FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_servicos_updated_at BEFORE UPDATE ON servicos FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_agendamentos_updated_at BEFORE UPDATE ON agendamentos FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- ============================================
-- FUNÇÃO: Verificar conflito de horário
-- ============================================
CREATE OR REPLACE FUNCTION verificar_conflito_agendamento()
RETURNS TRIGGER AS $$
BEGIN
    IF EXISTS (
        SELECT 1 FROM agendamentos
        WHERE profissional_id = NEW.profissional_id
        AND data = NEW.data
        AND status NOT IN ('cancelado', 'faltou')
        AND id != COALESCE(NEW.id, '00000000-0000-0000-0000-000000000000')
        AND (
            (NEW.hora_inicio >= hora_inicio AND NEW.hora_inicio < hora_fim)
            OR (NEW.hora_fim > hora_inicio AND NEW.hora_fim <= hora_fim)
            OR (NEW.hora_inicio <= hora_inicio AND NEW.hora_fim >= hora_fim)
        )
    ) THEN
        RAISE EXCEPTION 'Conflito de horário: já existe um agendamento neste período';
    END IF;
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER check_agendamento_conflito
BEFORE INSERT OR UPDATE ON agendamentos
FOR EACH ROW EXECUTE FUNCTION verificar_conflito_agendamento();

-- ============================================
-- RLS (Row Level Security)
-- ============================================
ALTER TABLE barbearias ENABLE ROW LEVEL SECURITY;
ALTER TABLE usuarios ENABLE ROW LEVEL SECURITY;
ALTER TABLE profissionais ENABLE ROW LEVEL SECURITY;
ALTER TABLE servicos ENABLE ROW LEVEL SECURITY;
ALTER TABLE agendamentos ENABLE ROW LEVEL SECURITY;
ALTER TABLE horarios_bloqueados ENABLE ROW LEVEL SECURITY;
ALTER TABLE lista_espera ENABLE ROW LEVEL SECURITY;
ALTER TABLE portfolio ENABLE ROW LEVEL SECURITY;

-- Políticas básicas (ajustar conforme necessidade)
-- Barbearias: leitura pública, escrita apenas admin
CREATE POLICY "Barbearias são públicas para leitura" ON barbearias FOR SELECT USING (true);
CREATE POLICY "Admin pode editar sua barbearia" ON barbearias FOR ALL USING (
    EXISTS (SELECT 1 FROM usuarios WHERE auth_id = auth.uid() AND barbearia_id = barbearias.id AND tipo = 'admin')
);

-- Serviços: leitura pública
CREATE POLICY "Serviços são públicos" ON servicos FOR SELECT USING (true);

-- Profissionais: leitura pública
CREATE POLICY "Profissionais são públicos" ON profissionais FOR SELECT USING (true);

-- Agendamentos: cliente vê os seus, admin vê da barbearia
CREATE POLICY "Cliente vê seus agendamentos" ON agendamentos FOR SELECT USING (
    cliente_id = (SELECT id FROM usuarios WHERE auth_id = auth.uid())
    OR EXISTS (SELECT 1 FROM usuarios WHERE auth_id = auth.uid() AND barbearia_id = agendamentos.barbearia_id AND tipo IN ('admin', 'profissional'))
);

CREATE POLICY "Cliente pode criar agendamento" ON agendamentos FOR INSERT WITH CHECK (true);

-- ============================================
-- DADOS INICIAIS (opcional - para teste)
-- ============================================
-- Descomente para inserir dados de teste

/*
INSERT INTO barbearias (nome, slug, telefone, email, endereco, cidade, estado)
VALUES ('Barbearia Teste', 'barbearia-teste', '11999999999', 'teste@barberx.com', 'Rua Teste, 123', 'São Paulo', 'SP');

INSERT INTO servicos (barbearia_id, nome, preco, duracao_minutos, categoria)
SELECT id, 'Corte Masculino', 45.00, 30, 'corte' FROM barbearias WHERE slug = 'barbearia-teste'
UNION ALL
SELECT id, 'Barba', 30.00, 20, 'barba' FROM barbearias WHERE slug = 'barbearia-teste'
UNION ALL
SELECT id, 'Corte + Barba', 65.00, 45, 'combo' FROM barbearias WHERE slug = 'barbearia-teste'
UNION ALL
SELECT id, 'Platinado', 150.00, 90, 'coloracao' FROM barbearias WHERE slug = 'barbearia-teste';

INSERT INTO profissionais (barbearia_id, nome, apelido)
SELECT id, 'João Silva', 'João' FROM barbearias WHERE slug = 'barbearia-teste'
UNION ALL
SELECT id, 'Pedro Santos', 'Pedrão' FROM barbearias WHERE slug = 'barbearia-teste';
*/
