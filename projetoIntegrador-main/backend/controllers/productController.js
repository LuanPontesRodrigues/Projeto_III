const pool = require('../models/db');

exports.getProducts = async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM produtos');
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.createProduct = async (req, res) => {
  const { nome, codigo } = req.body;
  try {
    await pool.query(
      'INSERT INTO produtos (nome, codigo, preco, quantidade) VALUES ($1, $2, $3, $4)',
      [nome, codigo, 0, 0]
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
    await pool.query(
      'UPDATE produtos SET nome = $1, codigo = $2, preco = $3, quantidade = $4 WHERE id = $5',
      [nome, codigo, preco, quantidade, id]
    );
    res.send('Produto atualizado com sucesso.');
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};


exports.deleteProduct = async (req, res) => {
  const { id } = req.params;
  try {
    await pool.query('DELETE FROM produtos WHERE id = $1', [id]);
    res.send('Produto excluído com sucesso.');
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.getEstoque = async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT id, nome, codigo, preco, quantidade, 
             (preco * quantidade) AS valor_total_estoque
      FROM produtos
      ORDER BY nome
    `);

    res.json(result.rows);
  } catch (err) {
    console.error('Erro ao buscar estoque:', err);
    res.status(500).json({ error: 'Erro ao buscar dados do estoque.' });
  }
};
