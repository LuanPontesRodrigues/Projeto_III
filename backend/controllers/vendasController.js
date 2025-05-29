const pool = require('../models/db');

// Cadastrar uma nova venda
exports.createVenda = async (req, res) => {
  const { produto_id, quantidade } = req.body;

  try {
    // Verifica se o produto existe e obtém o preço
    const produtoRes = await pool.query('SELECT preco, quantidade FROM produtos WHERE id = $1', [produto_id]);

    if (produtoRes.rows.length === 0) {
      return res.status(404).json({ error: 'Produto não encontrado.' });
    }

    const { preco, quantidade: estoqueAtual } = produtoRes.rows[0];

    if (estoqueAtual < quantidade) {
      return res.status(400).json({ error: 'Estoque insuficiente.' });
    }

    // Insere a venda
    await pool.query(
      'INSERT INTO vendas (produto_id, quantidade, valor_unitario) VALUES ($1, $2, $3)',
      [produto_id, quantidade, preco]
    );

    // Atualiza o estoque
    await pool.query(
      'UPDATE produtos SET quantidade = quantidade - $1 WHERE id = $2',
      [quantidade, produto_id]
    );

    res.status(201).json({ message: 'Venda registrada com sucesso.' });
  } catch (err) {
    console.error('Erro ao registrar venda:', err);
    res.status(500).json({ error: 'Erro ao registrar venda.' });
  }
};

// Buscar vendas (opcional)
exports.getVendas = async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT v.*, p.nome AS produto_nome, p.categoria
      FROM vendas v
      JOIN produtos p ON v.produto_id = p.id
      ORDER BY v.data_entrada DESC
    `);

    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
