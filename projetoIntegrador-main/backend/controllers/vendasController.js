// backend/controllers/vendasController.js
const pool = require('../models/db');

// POST /api/vendas
exports.createVenda = async (req, res) => {
  let { produto_id, quantidade } = req.body;

  produto_id = Number(produto_id);
  quantidade = Number(quantidade);

  if (!produto_id || !Number.isFinite(quantidade) || quantidade <= 0) {
    return res.status(400).json({ error: 'Produto e quantidade válidos são obrigatórios.' });
  }

  try {
    const empresaId = req.user.empresa_id;
    // Confere produto e estoque
    const prodRes = await pool.query(
      'SELECT id, preco, quantidade FROM produtos WHERE id = $1 AND empresa_id = $2',
      [produto_id, empresaId]
    );
    if (prodRes.rowCount === 0) {
      return res.status(404).json({ error: 'Produto não encontrado.' });
    }

    const { preco, quantidade: estoqueAtual } = prodRes.rows[0];
    if (estoqueAtual < quantidade) {
      return res.status(400).json({ error: 'Estoque insuficiente.' });
    }

    await pool.query('BEGIN');

    await pool.query(
      `INSERT INTO vendas (empresa_id, produto_id, quantidade, valor_unitario)
       VALUES ($1, $2, $3, $4)`,
      [empresaId, produto_id, quantidade, preco]
    );

    await pool.query(
      `UPDATE produtos
         SET quantidade = quantidade - $1
       WHERE id = $2 AND empresa_id = $3`,
      [quantidade, produto_id, empresaId]
    );

    await pool.query('COMMIT');
    return res.status(201).json({ message: 'Venda registrada com sucesso.' });
  } catch (err) {
    try { await pool.query('ROLLBACK'); } catch {}
    console.error('Erro ao registrar venda:', err);
    return res.status(500).json({ error: 'Erro ao registrar venda.' });
  }
};

// GET /api/vendas
exports.getVendas = async (req, res) => {
  try {
    const empresaId = req.user.empresa_id;
    const result = await pool.query(
      `SELECT
         v.id,
         p.nome AS produto,
         v.quantidade,
         v.valor_unitario,
         v.data_venda AS data_entrada
        FROM vendas v
        JOIN produtos p ON v.produto_id = p.id
       WHERE v.empresa_id = $1
       ORDER BY v.data_venda DESC`,
      [empresaId]
    );

    return res.json(result.rows);
  } catch (err) {
    console.error('Erro ao buscar vendas:', err);
    return res.status(500).json({ error: err.message });
  }
};
