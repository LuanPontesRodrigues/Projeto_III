-- Script de apoio para criação e adequação das tabelas utilizadas pelo projeto

-- =========================================================
-- Empresas e usuários (multi-tenant)
-- =========================================================
CREATE TABLE IF NOT EXISTS empresas (
    id SERIAL PRIMARY KEY,
    nome VARCHAR(150) NOT NULL,
    cnpj VARCHAR(18) UNIQUE,
    criado_em TIMESTAMP WITHOUT TIME ZONE NOT NULL DEFAULT NOW()
);

INSERT INTO empresas (id, nome, cnpj)
VALUES (1, 'Empresa Padrão', NULL)
ON CONFLICT (id) DO NOTHING;

SELECT setval(
    pg_get_serial_sequence('empresas', 'id'),
    GREATEST((SELECT MAX(id) FROM empresas), 1)
);

CREATE TABLE IF NOT EXISTS usuarios (
    id SERIAL PRIMARY KEY,
    empresa_id INTEGER NOT NULL REFERENCES empresas(id) ON DELETE CASCADE,
    nome VARCHAR(150) NOT NULL,
    email VARCHAR(150) NOT NULL,
    senha_hash TEXT NOT NULL,
    ativo BOOLEAN NOT NULL DEFAULT TRUE,
    criado_em TIMESTAMP WITHOUT TIME ZONE NOT NULL DEFAULT NOW()
);

CREATE UNIQUE INDEX IF NOT EXISTS usuarios_email_lower_idx
    ON usuarios (LOWER(email));

-- =========================================================
-- Produtos
-- =========================================================
CREATE TABLE IF NOT EXISTS produtos (
    id SERIAL PRIMARY KEY,
    empresa_id INTEGER NOT NULL REFERENCES empresas(id) ON DELETE CASCADE,
    nome VARCHAR(100) NOT NULL,
    codigo VARCHAR(50) NOT NULL,
    preco NUMERIC(10,2) NOT NULL DEFAULT 0,
    quantidade INTEGER NOT NULL DEFAULT 0,
    quantidade_em_rota INTEGER NOT NULL DEFAULT 0
);

ALTER TABLE produtos
    ADD COLUMN IF NOT EXISTS empresa_id INTEGER REFERENCES empresas(id) ON DELETE CASCADE,
    ADD COLUMN IF NOT EXISTS codigo VARCHAR(50),
    ADD COLUMN IF NOT EXISTS quantidade_em_rota INTEGER DEFAULT 0;

UPDATE produtos
   SET empresa_id = 1
 WHERE empresa_id IS NULL;

ALTER TABLE produtos
    ALTER COLUMN empresa_id SET NOT NULL,
    ALTER COLUMN preco SET DEFAULT 0,
    ALTER COLUMN quantidade SET DEFAULT 0,
    ALTER COLUMN quantidade_em_rota SET DEFAULT 0,
    ADD CONSTRAINT IF NOT EXISTS produtos_empresa_fk FOREIGN KEY (empresa_id) REFERENCES empresas(id) ON DELETE CASCADE;

UPDATE produtos
   SET quantidade_em_rota = COALESCE(quantidade_em_rota, 0);

CREATE UNIQUE INDEX IF NOT EXISTS produtos_codigo_key ON produtos(codigo);
CREATE INDEX IF NOT EXISTS produtos_empresa_idx ON produtos(empresa_id);

-- Dados base opcionais para ambiente de desenvolvimento
INSERT INTO produtos (empresa_id, nome, codigo, preco, quantidade)
VALUES
    (1, 'Mouse sem fio', 'MOUSE-001', 59.90, 20),
    (1, 'Teclado mecânico', 'TECLADO-001', 199.90, 15),
    (1, 'Monitor 24"', 'MONITOR-024', 899.99, 8),
    (1, 'Cabo HDMI 2m', 'CABO-HDMI-02', 25.50, 50)
ON CONFLICT (codigo) DO NOTHING;

-- =========================================================
-- Fornecedores
-- =========================================================
CREATE TABLE IF NOT EXISTS fornecedores (
    id SERIAL PRIMARY KEY,
    empresa_id INTEGER NOT NULL REFERENCES empresas(id) ON DELETE CASCADE,
    nome VARCHAR(150) NOT NULL,
    cnpj VARCHAR(20),
    telefone VARCHAR(30)
);

ALTER TABLE fornecedores
    ADD COLUMN IF NOT EXISTS empresa_id INTEGER REFERENCES empresas(id) ON DELETE CASCADE;

UPDATE fornecedores
   SET empresa_id = 1
 WHERE empresa_id IS NULL;

ALTER TABLE fornecedores
    ALTER COLUMN empresa_id SET NOT NULL,
    ADD CONSTRAINT IF NOT EXISTS fornecedores_empresa_fk FOREIGN KEY (empresa_id) REFERENCES empresas(id) ON DELETE CASCADE;

CREATE INDEX IF NOT EXISTS fornecedores_empresa_idx ON fornecedores(empresa_id);

-- =========================================================
-- Clientes
-- =========================================================
CREATE TABLE IF NOT EXISTS clientes (
    id SERIAL PRIMARY KEY,
    empresa_id INTEGER NOT NULL REFERENCES empresas(id) ON DELETE CASCADE,
    nome VARCHAR(150) NOT NULL,
    tipo_cliente VARCHAR(30) NOT NULL,
    cpf_cnpj VARCHAR(30) NOT NULL,
    endereco VARCHAR(200),
    complemento VARCHAR(100),
    telefone VARCHAR(30)
);

ALTER TABLE clientes
    ADD COLUMN IF NOT EXISTS empresa_id INTEGER REFERENCES empresas(id) ON DELETE CASCADE;

UPDATE clientes
   SET empresa_id = 1
 WHERE empresa_id IS NULL;

ALTER TABLE clientes
    ALTER COLUMN empresa_id SET NOT NULL,
    ADD CONSTRAINT IF NOT EXISTS clientes_empresa_fk FOREIGN KEY (empresa_id) REFERENCES empresas(id) ON DELETE CASCADE;

CREATE INDEX IF NOT EXISTS clientes_empresa_idx ON clientes(empresa_id);

-- =========================================================
-- Entradas
-- =========================================================
CREATE TABLE IF NOT EXISTS entradas (
    id SERIAL PRIMARY KEY,
    empresa_id INTEGER NOT NULL REFERENCES empresas(id) ON DELETE CASCADE,
    produto_id INTEGER NOT NULL REFERENCES produtos(id),
    fornecedor_id INTEGER NOT NULL REFERENCES fornecedores(id),
    nota_fiscal VARCHAR(100),
    data_entrada DATE NOT NULL,
    quantidade INTEGER NOT NULL,
    valor_unitario NUMERIC(10,2) NOT NULL
);

ALTER TABLE entradas
    ADD COLUMN IF NOT EXISTS empresa_id INTEGER REFERENCES empresas(id) ON DELETE CASCADE;

UPDATE entradas
   SET empresa_id = 1
 WHERE empresa_id IS NULL;

ALTER TABLE entradas
    ALTER COLUMN empresa_id SET NOT NULL,
    ADD CONSTRAINT IF NOT EXISTS entradas_empresa_fk FOREIGN KEY (empresa_id) REFERENCES empresas(id) ON DELETE CASCADE,
    ADD CONSTRAINT IF NOT EXISTS fk_entradas_produto FOREIGN KEY (produto_id) REFERENCES produtos(id),
    ADD CONSTRAINT IF NOT EXISTS fk_entradas_fornecedor FOREIGN KEY (fornecedor_id) REFERENCES fornecedores(id);

CREATE INDEX IF NOT EXISTS entradas_empresa_idx ON entradas(empresa_id);

-- =========================================================
-- Vendas
-- =========================================================
CREATE TABLE IF NOT EXISTS vendas (
    id SERIAL PRIMARY KEY,
    empresa_id INTEGER NOT NULL REFERENCES empresas(id) ON DELETE CASCADE,
    produto_id INTEGER NOT NULL REFERENCES produtos(id),
    quantidade INTEGER NOT NULL,
    valor_unitario NUMERIC(10,2) NOT NULL,
    data_venda TIMESTAMP WITHOUT TIME ZONE NOT NULL DEFAULT NOW()
);

ALTER TABLE vendas
    ADD COLUMN IF NOT EXISTS empresa_id INTEGER REFERENCES empresas(id) ON DELETE CASCADE;

UPDATE vendas
   SET empresa_id = 1
 WHERE empresa_id IS NULL;

ALTER TABLE vendas
    ALTER COLUMN empresa_id SET NOT NULL,
    ADD CONSTRAINT IF NOT EXISTS vendas_empresa_fk FOREIGN KEY (empresa_id) REFERENCES empresas(id) ON DELETE CASCADE,
    ADD CONSTRAINT IF NOT EXISTS fk_vendas_produto FOREIGN KEY (produto_id) REFERENCES produtos(id);

CREATE INDEX IF NOT EXISTS vendas_empresa_idx ON vendas(empresa_id);

-- =========================================================
-- Produtos em rota
-- =========================================================
CREATE TABLE IF NOT EXISTS produtos_em_rota (
    id SERIAL PRIMARY KEY,
    empresa_id INTEGER NOT NULL REFERENCES empresas(id) ON DELETE CASCADE,
    produto_id INTEGER NOT NULL REFERENCES produtos(id),
    quantidade INTEGER NOT NULL CHECK (quantidade > 0),
    destino VARCHAR(255) NOT NULL,
    data_envio TIMESTAMP WITHOUT TIME ZONE NOT NULL DEFAULT NOW(),
    data_retorno TIMESTAMP WITHOUT TIME ZONE,
    status VARCHAR(20) NOT NULL DEFAULT 'Em rota' CHECK (status IN ('Em rota', 'Recebido')),
    observacao TEXT
);

ALTER TABLE produtos_em_rota
    ADD COLUMN IF NOT EXISTS empresa_id INTEGER REFERENCES empresas(id) ON DELETE CASCADE;

UPDATE produtos_em_rota per
   SET empresa_id = COALESCE(per.empresa_id, prod.empresa_id)
  FROM produtos prod
 WHERE per.produto_id = prod.id
   AND per.empresa_id IS NULL;

UPDATE produtos_em_rota
   SET empresa_id = 1
 WHERE empresa_id IS NULL;

ALTER TABLE produtos_em_rota
    ALTER COLUMN empresa_id SET NOT NULL,
    ADD CONSTRAINT IF NOT EXISTS produtos_em_rota_empresa_fk FOREIGN KEY (empresa_id) REFERENCES empresas(id) ON DELETE CASCADE;

CREATE INDEX IF NOT EXISTS produtos_em_rota_empresa_idx ON produtos_em_rota(empresa_id);

-- Sincroniza o campo quantidade_em_rota conforme registros abertos
UPDATE produtos p
   SET quantidade_em_rota = COALESCE(sub.total_em_rota, 0)
  FROM (
        SELECT produto_id, SUM(quantidade) AS total_em_rota
          FROM produtos_em_rota
         WHERE status = 'Em rota'
         GROUP BY produto_id
       ) sub
 WHERE p.id = sub.produto_id;
