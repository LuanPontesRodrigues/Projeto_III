
CREATE TABLE produtos (
    id SERIAL PRIMARY KEY,
    nome VARCHAR(100) NOT NULL,
    preco NUMERIC(10,2) NOT NULL,
    quantidade INTEGER NOT NULL
);

INSERT INTO produtos (nome, preco, quantidade) VALUES
('Mouse sem fio', 59.90, 20),
('Teclado mecânico', 199.90, 15),
('Monitor 24"', 899.99, 8),
('Cabo HDMI 2m', 25.50, 50);

