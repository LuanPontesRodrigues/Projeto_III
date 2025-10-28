const pool = require('../models/db'); // importa a conexão com o banco

// 📋 Buscar todos os clientes
exports.getClientes = async (req, res) => {
  try {
    const empresaId = req.user.empresa_id;
    const result = await pool.query(
      'SELECT * FROM clientes WHERE empresa_id = $1 ORDER BY id DESC',
      [empresaId]
    );
    res.json(result.rows);
  } catch (error) {
    console.error("Erro ao listar clientes:", error);
    res.status(500).json({ message: "Erro interno ao listar clientes." });
  }
};

// ➕ Criar um novo cliente
exports.createCliente = async (req, res) => {
  try {
    const { nome, tipo_cliente, cpf_cnpj, endereco, complemento, telefone } = req.body;

    if (!nome || !tipo_cliente || !cpf_cnpj) {
      return res.status(400).json({ message: "Nome, tipo de cliente e CPF/CNPJ são obrigatórios." });
    }

    const empresaId = req.user.empresa_id;
    const query = `
      INSERT INTO clientes (empresa_id, nome, tipo_cliente, cpf_cnpj, endereco, complemento, telefone)
      VALUES ($1, $2, $3, $4, $5, $6, $7)
      RETURNING *;
    `;
    const values = [
      empresaId,
      nome,
      tipo_cliente,
      cpf_cnpj,
      endereco,
      complemento,
      telefone,
    ];
    const result = await pool.query(query, values);

    res.status(201).json({
      message: "Cliente cadastrado com sucesso!",
      cliente: result.rows[0],
    });
  } catch (error) {
    console.error("Erro ao cadastrar cliente:", error);
    res.status(500).json({ message: "Erro interno ao cadastrar cliente." });
  }
};

// ✏️ Atualizar cliente
exports.updateCliente = async (req, res) => {
  try {
    const { id } = req.params;
    const { nome, tipo_cliente, cpf_cnpj, endereco, complemento, telefone } = req.body;

    const empresaId = req.user.empresa_id;
    const query = `
      UPDATE clientes
         SET nome = $1,
             tipo_cliente = $2,
             cpf_cnpj = $3,
             endereco = $4,
             complemento = $5,
             telefone = $6
       WHERE id = $7 AND empresa_id = $8
       RETURNING *;
    `;
    const values = [nome, tipo_cliente, cpf_cnpj, endereco, complemento, telefone, id, empresaId];
    const result = await pool.query(query, values);

    if (result.rowCount === 0) {
      return res.status(404).json({ message: "Cliente não encontrado." });
    }

    res.json({
      message: "Cliente atualizado com sucesso!",
      cliente: result.rows[0],
    });
  } catch (error) {
    console.error("Erro ao atualizar cliente:", error);
    res.status(500).json({ message: "Erro interno ao atualizar cliente." });
  }
};

// 🗑️ Excluir cliente
exports.deleteCliente = async (req, res) => {
  try {
    const { id } = req.params;
    const empresaId = req.user.empresa_id;
    const result = await pool.query('DELETE FROM clientes WHERE id = $1 AND empresa_id = $2', [id, empresaId]);

    if (result.rowCount === 0) {
      return res.status(404).json({ message: "Cliente não encontrado." });
    }

    res.json({ message: "Cliente excluído com sucesso!" });
  } catch (error) {
    console.error("Erro ao excluir cliente:", error);
    res.status(500).json({ message: "Erro interno ao excluir cliente." });
  }
};
