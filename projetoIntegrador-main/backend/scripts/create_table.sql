-- Script de apoio para criação e adequação das tabelas utilizadas pelo projeto

-- Estrutura principal da tabela de produtos
CREATE TABLE IF NOT EXISTS produtos (
    id SERIAL PRIMARY KEY,
    nome VARCHAR(100) NOT NULL,
    codigo VARCHAR(50) NOT NULL UNIQUE,
    preco NUMERIC(10,2) NOT NULL DEFAULT 0,
    quantidade INTEGER NOT NULL DEFAULT 0,
    quantidade_em_rota INTEGER NOT NULL DEFAULT 0
);

-- Adequações para bases já existentes
ALTER TABLE produtos
    ADD COLUMN IF NOT EXISTS codigo VARCHAR(50),
    ADD COLUMN IF NOT EXISTS quantidade_em_rota INTEGER DEFAULT 0;

ALTER TABLE produtos
    ALTER COLUMN preco SET DEFAULT 0,
    ALTER COLUMN quantidade SET DEFAULT 0,
    ALTER COLUMN quantidade_em_rota SET DEFAULT 0;

UPDATE produtos
   SET quantidade_em_rota = COALESCE(quantidade_em_rota, 0);

ALTER TABLE produtos
    ALTER COLUMN quantidade_em_rota SET NOT NULL;

CREATE UNIQUE INDEX IF NOT EXISTS produtos_codigo_key ON produtos(codigo);

-- Dados base opcionais para ambiente de desenvolvimento
INSERT INTO produtos (nome, codigo, preco, quantidade)
VALUES
    ('Mouse sem fio', 'MOUSE-001', 59.90, 20),
    ('Teclado mecânico', 'TECLADO-001', 199.90, 15),
    ('Monitor 24"', 'MONITOR-024', 899.99, 8),
    ('Cabo HDMI 2m', 'CABO-HDMI-02', 25.50, 50)
ON CONFLICT (codigo) DO NOTHING;

-- Nova tabela para controlar produtos que saem em rota de troca/assistência
CREATE TABLE IF NOT EXISTS produtos_em_rota (
    id SERIAL PRIMARY KEY,
    produto_id INTEGER NOT NULL REFERENCES produtos(id),
    quantidade INTEGER NOT NULL CHECK (quantidade > 0),
    destino VARCHAR(255) NOT NULL,
    data_envio TIMESTAMP WITHOUT TIME ZONE NOT NULL DEFAULT NOW(),
    data_retorno TIMESTAMP WITHOUT TIME ZONE,
    status VARCHAR(20) NOT NULL DEFAULT 'Em rota' CHECK (status IN ('Em rota', 'Recebido')),
    observacao TEXT
);

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

-- Referências a outras tabelas envolvidas no fluxo
-- Estas instruções evidenciam os ajustes esperados nas demais tabelas
-- para garantir integridade referencial com o novo processo de rota.
ALTER TABLE entradas
    ADD CONSTRAINT IF NOT EXISTS fk_entradas_produto FOREIGN KEY (produto_id) REFERENCES produtos(id);

ALTER TABLE vendas
    ADD CONSTRAINT IF NOT EXISTS fk_vendas_produto FOREIGN KEY (produto_id) REFERENCES produtos(id);
