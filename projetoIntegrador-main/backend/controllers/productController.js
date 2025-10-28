const pool = require('../models/db');

exports.getProducts = async (req, res) => {
  try {
    const empresaId = req.user.empresa_id;
    const result = await pool.query(
      `SELECT id, nome, codigo, preco, quantidade, quantidade_em_rota
         FROM produtos
        WHERE empresa_id = $1
        ORDER BY nome`,
      [empresaId]
    );
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.createProduct = async (req, res) => {
  const { nome, codigo, preco = 0, quantidade = 0 } = req.body;
  try {
    const empresaId = req.user.empresa_id;
    const precoNormalizado = Number(preco) || 0;
    const quantidadeNormalizada = Number(quantidade) || 0;
    await pool.query(
      'INSERT INTO produtos (empresa_id, nome, codigo, preco, quantidade) VALUES ($1, $2, $3, $4, $5)',
      [empresaId, nome, codigo, precoNormalizado, quantidadeNormalizada]
    );
    res.status(201).send('Produto criado com sucesso.');
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.updateProduct = async (req, res) => {
  const { id } = req.params;
  const { nome, codigo, preco, quantidade } = req.body;
  try {
    const empresaId = req.user.empresa_id;
    const precoNormalizado = Number(preco);
    const quantidadeNormalizada = Number(quantidade);
    const result = await pool.query(
      `UPDATE produtos
          SET nome = $1,
              codigo = $2,
              preco = $3,
              quantidade = $4
        WHERE id = $5 AND empresa_id = $6`,
      [nome, codigo, precoNormalizado, quantidadeNormalizada, id, empresaId]
    );

    if (result.rowCount === 0) {
      return res.status(404).json({ error: 'Produto não encontrado.' });
    }

    res.send('Produto atualizado com sucesso.');
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};


exports.deleteProduct = async (req, res) => {
  const { id } = req.params;
  try {
    const empresaId = req.user.empresa_id;
    const result = await pool.query('DELETE FROM produtos WHERE id = $1 AND empresa_id = $2', [id, empresaId]);

    if (result.rowCount === 0) {
      return res.status(404).json({ error: 'Produto não encontrado.' });
    }

    res.send('Produto excluído com sucesso.');
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.getEstoque = async (req, res) => {
  try {
    const empresaId = req.user.empresa_id;
    const result = await pool.query(
      `SELECT id, nome, codigo, preco, quantidade,
              (preco * quantidade) AS valor_total_estoque
         FROM produtos
        WHERE empresa_id = $1
        ORDER BY nome`,
      [empresaId]
    );

    res.json(result.rows);
  } catch (err) {
    console.error('Erro ao buscar estoque:', err);
    res.status(500).json({ error: 'Erro ao buscar dados do estoque.' });
  }
};
