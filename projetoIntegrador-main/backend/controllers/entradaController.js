const pool = require('../models/db');

// Listar todas as entradas
exports.getEntradas = async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT e.id,
             p.nome AS produto,
             f.nome AS fornecedor,
             e.nota_fiscal,
             e.data_entrada,
             e.quantidade,
             e.valor_unitario
      FROM entradas e
      JOIN produtos p   ON e.produto_id   = p.id
      JOIN fornecedores f ON e.fornecedor_id = f.id
      ORDER BY e.data_entrada DESC
    `);
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).send("Erro ao buscar entradas");
  }
};

// Criar nova entrada (com conversão de tipos e lock de estoque)
exports.createEntrada = async (req, res) => {
  let { produto_id, fornecedor_id, nota_fiscal, data_entrada, quantidade, valor_unitario } = req.body;

  // 🔧 conversões (req.body chega como string)
  produto_id     = Number(produto_id);
  fornecedor_id  = Number(fornecedor_id);
  quantidade     = Number(quantidade);
  valor_unitario = Number(valor_unitario);
  nota_fiscal    = nota_fiscal && String(nota_fiscal).trim() !== '' ? nota_fiscal : null;

  if (!produto_id || !fornecedor_id || !data_entrada || !quantidade || !valor_unitario) {
    return res.status(400).send("Campos obrigatórios ausentes");
  }

  try {
    await pool.query('BEGIN');

    // (opcional, mas recomendado) Verifica se o produto existe e faz lock
    const prodRes = await pool.query(
      `SELECT id, quantidade FROM produtos WHERE id = $1 FOR UPDATE`,
      [produto_id]
    );
    if (prodRes.rowCount === 0) {
      await pool.query('ROLLBACK');
      return res.status(400).send('Produto inválido.');
    }

    // (opcional) verifica fornecedor também
    const fornRes = await pool.query(
      `SELECT id FROM fornecedores WHERE id = $1`,
      [fornecedor_id]
    );
    if (fornRes.rowCount === 0) {
      await pool.query('ROLLBACK');
      return res.status(400).send('Fornecedor inválido.');
    }

    const insertRes = await pool.query(
      `INSERT INTO entradas (produto_id, fornecedor_id, nota_fiscal, data_entrada, quantidade, valor_unitario)
       VALUES ($1, $2, $3, $4, $5, $6)
       RETURNING *`,
      [produto_id, fornecedor_id, nota_fiscal, data_entrada, quantidade, valor_unitario]
    );

    // Atualiza estoque
    await pool.query(
      `UPDATE produtos
         SET quantidade = quantidade + $1
       WHERE id = $2`,
      [quantidade, produto_id]
    );

    await pool.query('COMMIT');
    res.status(201).json(insertRes.rows[0]);
  } catch (err) {
    await pool.query('ROLLBACK');
    console.error(err);
    res.status(500).send("Erro ao criar entrada");
  }
};

// Atualizar entrada (também com conversões)
exports.updateEntrada = async (req, res) => {
  const { id } = req.params;
  let { produto_id, fornecedor_id, nota_fiscal, data_entrada, quantidade, valor_unitario } = req.body;

  produto_id     = Number(produto_id);
  fornecedor_id  = Number(fornecedor_id);
  quantidade     = Number(quantidade);
  valor_unitario = Number(valor_unitario);
  nota_fiscal    = nota_fiscal && String(nota_fiscal).trim() !== '' ? nota_fiscal : null;

  try {
    const result = await pool.query(
      `UPDATE entradas
         SET produto_id   = $1,
             fornecedor_id= $2,
             nota_fiscal  = $3,
             data_entrada = $4,
             quantidade   = $5,
             valor_unitario = $6
       WHERE id = $7
       RETURNING *`,
      [produto_id, fornecedor_id, nota_fiscal, data_entrada, quantidade, valor_unitario, id]
    );

    if (result.rowCount === 0) return res.status(404).send("Entrada não encontrada");
    res.json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).send("Erro ao atualizar entrada");
  }
};

// Excluir entrada
exports.deleteEntrada = async (req, res) => {
  const { id } = req.params;
  try {
    const result = await pool.query(`DELETE FROM entradas WHERE id=$1 RETURNING *`, [id]);
    if (result.rowCount === 0) return res.status(404).send("Entrada não encontrada");
    res.send("Entrada excluída com sucesso");
  } catch (err) {
    console.error(err);
    res.status(500).send("Erro ao excluir entrada");
  }
};
