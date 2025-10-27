// backend/controllers/vendasController.js
const pool = require('../models/db');

// POST /api/vendas
exports.createVenda = async (req, res) => {
  let { produto_id, quantidade } = req.body;

  // Normaliza e valida
  produto_id = Number(produto_id);
  quantidade = Number(quantidade);

  if (!produto_id || !Number.isFinite(quantidade) || quantidade <= 0) {
    return res.status(400).json({ error: 'Produto e quantidade válidos são obrigatórios.' });
  }

  try {
    // Verifica produto e estoque
    const prodRes = await pool.query(
      'SELECT id, preco, quantidade FROM produtos WHERE id = $1',
      [produto_id]
    );
    if (prodRes.rowCount === 0) {
      return res.status(404).json({ error: 'Produto não encontrado.' });
    }

    const { preco, quantidade: estoqueAtual } = prodRes.rows[0];
    if (estoqueAtual < quantidade) {
      return res.status(400).json({ error: 'Estoque insuficiente.' });
    }

    // Transação: insere venda e atualiza estoque
    await pool.query('BEGIN');

    await pool.query(
      `INSERT INTO vendas (produto_id, quantidade, valor_unitario)
       VALUES ($1, $2, $3)`,
      [produto_id, quantidade, preco]
    );

    await pool.query(
      `UPDATE produtos
         SET quantidade = quantidade - $1
       WHERE id = $2`,
      [quantidade, produto_id]
    );

    await pool.query('COMMIT');
    return res.status(201).json({ message: 'Venda registrada com sucesso.' });

  } catch (err) {
    // Garante rollback se algo falhar após o BEGIN
    try { await pool.query('ROLLBACK'); } catch (_) {}
    console.error('Erro ao registrar venda:', err);
    return res.status(500).json({ error: 'Erro ao registrar venda.' });
  }
};

// GET /api/vendas
exports.getVendas = async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT
        v.id,
        p.nome AS produto,
        v.quantidade,
        v.valor_unitario,
        v.data_entrada   -- existe no seu schema; se renomear, ajuste aqui
      FROM vendas v
      JOIN produtos p ON v.produto_id = p.id
      ORDER BY v.id DESC  -- ou ORDER BY v.data_entrada DESC se preferir
    `);

    return res.json(result.rows);
  } catch (err) {
    console.error('Erro ao buscar vendas:', err);
    return res.status(500).json({ error: err.message });
  }
};
