const pool = require('../models/db');
const { hashPassword, verifyPassword, signToken } = require('../utils/security');

const JWT_SECRET = process.env.JWT_SECRET || 'development-secret';
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || '8h';

const buildTokenPayload = (user) => ({
  id: user.id,
  email: user.email,
  empresa_id: user.empresa_id,
});

const issueToken = (user) =>
  signToken(buildTokenPayload(user), JWT_SECRET, { expiresIn: JWT_EXPIRES_IN });

const mapUserResponse = (row) => ({
  id: row.id,
  nome: row.nome,
  email: row.email,
});

const mapEmpresaResponse = (row) => ({
  id: row.empresa_id || row.id,
  nome: row.empresa_nome || row.nome,
  cnpj: row.empresa_cnpj || row.cnpj,
});

exports.register = async (req, res) => {
  const {
    empresa_nome,
    empresa_cnpj,
    nome,
    email,
    senha,
  } = req.body;

  if (!empresa_nome || !nome || !email || !senha) {
    return res
      .status(400)
      .json({ error: 'Nome da empresa, nome do usuário, e-mail e senha são obrigatórios.' });
  }

  try {
    await pool.query('BEGIN');

    const existingEmail = await pool.query(
      'SELECT 1 FROM usuarios WHERE LOWER(email) = LOWER($1)',
      [email]
    );

    if (existingEmail.rowCount > 0) {
      await pool.query('ROLLBACK');
      return res.status(409).json({ error: 'E-mail já cadastrado.' });
    }

    const empresaResult = await pool.query(
      `INSERT INTO empresas (nome, cnpj)
       VALUES ($1, NULLIF($2, ''))
       RETURNING id, nome, cnpj`,
      [empresa_nome.trim(), empresa_cnpj || null]
    );

    const empresa = empresaResult.rows[0];

    const senhaHash = hashPassword(String(senha));

    const usuarioResult = await pool.query(
      `INSERT INTO usuarios (empresa_id, nome, email, senha_hash)
       VALUES ($1, $2, LOWER($3), $4)
       RETURNING id, empresa_id, nome, email`,
      [empresa.id, nome.trim(), email.trim(), senhaHash]
    );

    const usuario = usuarioResult.rows[0];

    await pool.query('COMMIT');

    const token = issueToken(usuario);

    return res.status(201).json({
      token,
      user: mapUserResponse(usuario),
      empresa: mapEmpresaResponse({
        empresa_id: empresa.id,
        empresa_nome: empresa.nome,
        empresa_cnpj: empresa.cnpj,
      }),
    });
  } catch (error) {
    await pool.query('ROLLBACK');
    console.error('Erro ao registrar empresa e usuário:', error);
    return res.status(500).json({ error: 'Erro ao criar conta.' });
  }
};

exports.login = async (req, res) => {
  const { email, senha } = req.body;

  if (!email || !senha) {
    return res.status(400).json({ error: 'E-mail e senha são obrigatórios.' });
  }

  try {
    const resultado = await pool.query(
      `SELECT u.id,
              u.nome,
              u.email,
              u.senha_hash,
              u.empresa_id,
              u.ativo,
              e.nome  AS empresa_nome,
              e.cnpj  AS empresa_cnpj
         FROM usuarios u
         JOIN empresas e ON e.id = u.empresa_id
        WHERE LOWER(u.email) = LOWER($1)
          AND u.ativo = TRUE`,
      [email.trim()]
    );

    if (resultado.rowCount === 0) {
      return res.status(401).json({ error: 'Credenciais inválidas.' });
    }

    const usuario = resultado.rows[0];

    const senhaValida = verifyPassword(String(senha), usuario.senha_hash);

    if (!senhaValida) {
      return res.status(401).json({ error: 'Credenciais inválidas.' });
    }

    const token = issueToken(usuario);

    return res.json({
      token,
      user: mapUserResponse(usuario),
      empresa: mapEmpresaResponse(usuario),
    });
  } catch (error) {
    console.error('Erro ao autenticar usuário:', error);
    return res.status(500).json({ error: 'Erro ao autenticar.' });
  }
};

exports.me = async (req, res) => {
  try {
    const resultado = await pool.query(
      `SELECT u.id,
              u.nome,
              u.email,
              u.empresa_id,
              e.nome AS empresa_nome,
              e.cnpj AS empresa_cnpj
         FROM usuarios u
         JOIN empresas e ON e.id = u.empresa_id
        WHERE u.id = $1`,
      [req.user.id]
    );

    if (resultado.rowCount === 0) {
      return res.status(404).json({ error: 'Usuário não encontrado.' });
    }

    const usuario = resultado.rows[0];

    return res.json({
      user: mapUserResponse(usuario),
      empresa: mapEmpresaResponse(usuario),
    });
  } catch (error) {
    console.error('Erro ao consultar perfil:', error);
    return res.status(500).json({ error: 'Erro ao consultar perfil.' });
  }
};