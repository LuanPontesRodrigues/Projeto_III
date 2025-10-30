const pool = require('../models/db');

// POST /api/vendas
exports.createVenda = async (req, res) => {
  let { produto_id, quantidade, valor_unitario, nota_fiscal, data_saida, cliente_id } = req.body;

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

    // Monta INSERT incluindo campos opcionais se existirem na tabela
    // Tenta detectar colunas opcionais de forma simples
    const colsRes = await pool.query(
      `SELECT column_name FROM information_schema.columns
         WHERE table_schema = 'public' AND table_name = 'vendas'`
    );
    const colSet = new Set(colsRes.rows.map(r => r.column_name));

    const cols = ['empresa_id', 'produto_id', 'quantidade', 'valor_unitario'];
    const vals = [empresaId, produto_id, quantidade, (Number(valor_unitario) || preco)];

    if (colSet.has('nota_fiscal') && typeof nota_fiscal !== 'undefined') {
      cols.push('nota_fiscal');
      vals.push(nota_fiscal || null);
    }
    if (colSet.has('cliente_id') && cliente_id) {
      cols.push('cliente_id');
      vals.push(Number(cliente_id));
    }
    if (colSet.has('data_venda') && data_saida) {
      cols.push('data_venda');
      vals.push(new Date(data_saida));
    }

    const params = vals.map((_, i) => `$${i + 1}`).join(', ');
    const sql = `INSERT INTO vendas (${cols.join(', ')}) VALUES (${params})`;
    await pool.query(sql, vals);

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
    // Detecta colunas opcionais na tabela vendas para evitar erros em esquemas diferentes
    const colsRes = await pool.query(
      `SELECT column_name FROM information_schema.columns
         WHERE table_schema = 'public' AND table_name = 'vendas'`
    );
    const colSet = new Set(colsRes.rows.map(r => r.column_name));

    const hasClienteId = colSet.has('cliente_id');
    const hasDataVenda = colSet.has('data_venda');
    const hasNotaFiscal = colSet.has('nota_fiscal');

    let selectParts = [
      'v.id',
      'p.nome AS produto',
      'p.codigo AS codigo',
      'v.quantidade',
      'v.valor_unitario'
    ];

    // data_saida
    if (hasDataVenda) {
      selectParts.push('v.data_venda AS data_saida');
    } else {
      selectParts.push('NULL AS data_saida');
    }

    // nota_fiscal
    if (hasNotaFiscal) {
      selectParts.push('v.nota_fiscal');
    } else {
      selectParts.push('NULL AS nota_fiscal');
    }

    // cliente
    if (hasClienteId) {
      selectParts.push('c.nome AS cliente');
    } else {
      selectParts.push('NULL AS cliente');
    }

    let sql = `SELECT ${selectParts.join(', ')}
                 FROM vendas v
                 JOIN produtos p ON v.produto_id = p.id`;
    if (hasClienteId) {
      sql += `
                 LEFT JOIN clientes c ON c.id = v.cliente_id AND c.empresa_id = v.empresa_id`;
    }
    sql += `
                WHERE v.empresa_id = $1`;
    // Ordena pela data se existir, senao por id
    if (hasDataVenda) {
      sql += `
                ORDER BY v.data_venda DESC`;
    } else {
      sql += `
                ORDER BY v.id DESC`;
    }

    const result = await pool.query(sql, [empresaId]);
    return res.json(result.rows);
  } catch (err) {
    console.error('Erro ao buscar vendas:', err);
    return res.status(500).json({ error: err.message });
  }
};
