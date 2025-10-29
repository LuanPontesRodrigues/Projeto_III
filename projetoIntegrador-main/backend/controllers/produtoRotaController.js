const pool = require('../models/db');

const STATUS_EM_ROTA = 'Em rota';
const STATUS_RECEBIDO = 'Recebido';

exports.getProdutosEmRota = async (req, res) => {
  try {
    const empresaId = req.user.empresa_id;
    const result = await pool.query(
      `SELECT
         pr.id,
         pr.produto_id,
         p.nome AS produto_nome,
         p.codigo AS produto_codigo,
         pr.quantidade,
         pr.destino,
         pr.data_envio,
         pr.data_retorno,
         pr.status,
         pr.observacao
        FROM produtos_em_rota pr
        JOIN produtos p ON pr.produto_id = p.id
       WHERE pr.empresa_id = $1
       ORDER BY pr.data_envio DESC, pr.id DESC`,
      [empresaId]
    );

    return res.json(result.rows);
  } catch (error) {
    console.error('Erro ao listar produtos em rota:', error);
    return res.status(500).json({ error: 'Erro ao listar produtos em rota.' });
  }
};

exports.createProdutoEmRota = async (req, res) => {
  let { produto_id, quantidade, destino, data_envio, observacao } = req.body;

  produto_id = Number(produto_id);
  quantidade = Number(quantidade);
  destino = typeof destino === 'string' ? destino.trim() : '';
  observacao = typeof observacao === 'string' && observacao.trim() !== '' ? observacao.trim() : null;
  const dataEnvioFormatada = (() => {
    if (!data_envio) return new Date();
    const base = typeof data_envio === 'string' ? `${data_envio}T00:00:00` : data_envio;
    const parsed = new Date(base);
    return Number.isNaN(parsed.getTime()) ? new Date() : parsed;
  })();

  if (!produto_id || !Number.isFinite(quantidade) || quantidade <= 0 || !destino) {
    return res.status(400).json({ error: 'Produto, quantidade e destino são obrigatórios.' });
  }

  try {
    const empresaId = req.user.empresa_id;

    await pool.query('BEGIN');

    const produtoRes = await pool.query(
      'SELECT id, quantidade FROM produtos WHERE id = $1 AND empresa_id = $2 FOR UPDATE',
      [produto_id, empresaId]
    );

    if (produtoRes.rowCount === 0) {
      await pool.query('ROLLBACK');
      return res.status(404).json({ error: 'Produto não encontrado.' });
    }

    const estoqueAtual = Number(produtoRes.rows[0].quantidade) || 0;
    if (estoqueAtual < quantidade) {
      await pool.query('ROLLBACK');
      return res.status(400).json({ error: 'Estoque insuficiente para registrar o envio.' });
    }

    const insertRes = await pool.query(
      `INSERT INTO produtos_em_rota (empresa_id, produto_id, quantidade, destino, data_envio, status, observacao)
       VALUES ($1, $2, $3, $4, $5, $6, $7)
       RETURNING *`,
      [
        empresaId,
        produto_id,
        quantidade,
        destino,
        dataEnvioFormatada,
        STATUS_EM_ROTA,
        observacao,
      ]
    );

    await pool.query(
      `UPDATE produtos
         SET quantidade = quantidade - $1,
             quantidade_em_rota = quantidade_em_rota + $1
       WHERE id = $2 AND empresa_id = $3`,
      [quantidade, produto_id, empresaId]
    );

    await pool.query('COMMIT');

    return res.status(201).json({
      message: 'Produto enviado para rota registrado com sucesso.',
      registro: insertRes.rows[0],
    });
  } catch (error) {
    try {
      await pool.query('ROLLBACK');
    } catch (_) {
      // ignora erro de rollback
    }
    console.error('Erro ao registrar produto em rota:', error);
    return res.status(500).json({ error: 'Erro ao registrar produto em rota.' });
  }
};

exports.marcarComoRecebido = async (req, res) => {
  const { id } = req.params;

  try {
    await pool.query('BEGIN');

    const empresaId = req.user.empresa_id;

    const registroRes = await pool.query(
      'SELECT id, produto_id, quantidade, status FROM produtos_em_rota WHERE id = $1 AND empresa_id = $2 FOR UPDATE',
      [id, empresaId]
    );

    if (registroRes.rowCount === 0) {
      await pool.query('ROLLBACK');
      return res.status(404).json({ error: 'Registro não encontrado.' });
    }

    const registro = registroRes.rows[0];

    if (registro.status === STATUS_RECEBIDO) {
      await pool.query('ROLLBACK');
      return res.status(400).json({ error: 'Este registro já foi marcado como recebido.' });
    }

    const updateRes = await pool.query(
      `UPDATE produtos_em_rota
         SET status = $1,
             data_retorno = NOW()
       WHERE id = $2
       RETURNING *`,
      [STATUS_RECEBIDO, id]
    );

    await pool.query(
      `UPDATE produtos
         SET quantidade_em_rota = GREATEST(quantidade_em_rota - $1, 0)
       WHERE id = $2 AND empresa_id = $3`,
      [registro.quantidade, registro.produto_id, empresaId]
    );

    await pool.query('COMMIT');

    return res.json({
      message: 'Produto marcado como recebido com sucesso.',
      registro: updateRes.rows[0],
    });
  } catch (error) {
    try {
      await pool.query('ROLLBACK');
    } catch (_) {
      // ignora erro de rollback
    }
    console.error('Erro ao atualizar status do produto em rota:', error);
    return res.status(500).json({ error: 'Erro ao atualizar status do produto em rota.' });
  }
};

exports.deleteProdutoEmRota = async (req, res) => {
  const { id } = req.params;

  try {
    await pool.query('BEGIN');

    const empresaId = req.user.empresa_id;

    const registroRes = await pool.query(
      'SELECT id, produto_id, quantidade, status FROM produtos_em_rota WHERE id = $1 AND empresa_id = $2 FOR UPDATE',
      [id, empresaId]
    );

    if (registroRes.rowCount === 0) {
      await pool.query('ROLLBACK');
      return res.status(404).json({ error: 'Registro não encontrado.' });
    }

    const registro = registroRes.rows[0];

    await pool.query(
      'DELETE FROM produtos_em_rota WHERE id = $1 AND empresa_id = $2',
      [id, empresaId]
    );

    if (registro.status === STATUS_EM_ROTA) {
      await pool.query(
        `UPDATE produtos
           SET quantidade = quantidade + $1,
               quantidade_em_rota = GREATEST(quantidade_em_rota - $1, 0)
         WHERE id = $2 AND empresa_id = $3`,
        [registro.quantidade, registro.produto_id, empresaId]
      );
    }

    await pool.query('COMMIT');

    return res.json({ message: 'Registro removido com sucesso.' });
  } catch (error) {
    try {
      await pool.query('ROLLBACK');
    } catch (_) {
      // ignora erro de rollback
    }
    console.error('Erro ao excluir registro de produto em rota:', error);
    return res.status(500).json({ error: 'Erro ao excluir registro de produto em rota.' });
  }
};