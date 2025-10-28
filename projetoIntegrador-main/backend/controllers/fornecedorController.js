const pool = require('../models/db');

exports.getFornecedor = async (req, res) => {
  try {
    const empresaId = req.user.empresa_id;
    const result = await pool.query(
      'SELECT * FROM fornecedores WHERE empresa_id = $1 ORDER BY id ASC',
      [empresaId]
    );
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error:'Erro ao buscar fornecedor.' });
  }
};

exports.createFornecedor = async (req, res) => {
  const { cnpj, nome, telefone } = req.body;

  try {
    const empresaId = req.user.empresa_id;
    const result = await pool.query(
      'INSERT INTO fornecedores (empresa_id, cnpj, nome, telefone) VALUES ($1, $2, $3, $4) RETURNING *',
      [empresaId, cnpj, nome, telefone]
    );
    res.status(201).json(result.rows[0]);
  } catch (error) {
    res.status(500).json({ error: 'Erro ao cadastrar fornecedor' });
  }
};

exports.updateFornecedor = async (req, res) => {
  const { id } = req.params;
  const { cnpj, nome, telefone } = req.body;
  try {
    const empresaId = req.user.empresa_id;
    const result = await pool.query(
      'UPDATE fornecedores SET cnpj = $1, nome = $2, telefone = $3 WHERE id = $4 AND empresa_id = $5 RETURNING *',
      [cnpj, nome, telefone, id, empresaId]
    );
    if (result.rowCount === 0) {
      return res.status(404).json({ error: 'Fornecedor não encontrado.' });
    }
    res.json(result.rows[0]);
  } catch (error) {
    res.status(500).json({ error: 'Erro ao atualizar fornecedor.' });
  }
};

exports.deleteFornecedor = async (req, res) => {
  const { id } = req.params;
  try {
    const empresaId = req.user.empresa_id;
    const result = await pool.query('DELETE FROM fornecedores WHERE id = $1 AND empresa_id = $2', [id, empresaId]);
    if (result.rowCount === 0) {
      return res.status(404).json({ error: 'Fornecedor não encontrado.' });
    }
    res.json({ message: 'Fornecedor excluído com sucesso.' });
  } catch (error) {
    res.status(500).json({ error: 'Erro ao excluir fornecedor.' });
  }
};
