const pool = require("../models/db");

exports.getClientes = async (req, res) => {
  try {
    const result = await pool.query("SELECT * FROM clientes ORDER BY id ASC");
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: "Erro ao buscar clientes." });
  }
};

exports.createCliente = async (req, res) => {
  const { nome, tipoCliente, documento, endereco, complemento, telefone } = req.body;
  try {
    const result = await pool.query(
      "INSERT INTO clientes (nome, tipo_cliente, documento, endereco, complemento, telefone) VALUES ($1, $2, $3, $4, $5, $6) RETURNING *",
      [nome, tipoCliente, documento, endereco, complemento, telefone]
    );
    res.status(201).json(result.rows[0]);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Erro ao cadastrar cliente." });
  }
};

exports.updateCliente = async (req, res) => {
  const { id } = req.params;
  const { nome, tipoCliente, documento, endereco, complemento, telefone } = req.body;
  try {
    const result = await pool.query(
      "UPDATE clientes SET nome=$1, tipo_cliente=$2, documento=$3, endereco=$4, complemento=$5, telefone=$6 WHERE id=$7 RETURNING *",
      [nome, tipoCliente, documento, endereco, complemento, telefone, id]
    );
    if (result.rowCount === 0) {
      return res.status(404).json({ error: "Cliente não encontrado." });
    }
    res.json(result.rows[0]);
  } catch (error) {
    res.status(500).json({ error: "Erro ao atualizar cliente." });
  }
};

exports.deleteCliente = async (req, res) => {
  const { id } = req.params;
  try {
    const result = await pool.query("DELETE FROM clientes WHERE id = $1", [id]);
    if (result.rowCount === 0) {
      return res.status(404).json({ error: "Cliente não encontrado." });
    }
    res.json({ message: "Cliente excluído com sucesso." });
  } catch (error) {
    res.status(500).json({ error: "Erro ao excluir cliente." });
  }
};
