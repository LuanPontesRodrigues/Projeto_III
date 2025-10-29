const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const DEFAULT_SALT_ROUNDS = Number(process.env.BCRYPT_SALT_ROUNDS || 10);

function hashPassword(plain) {
  if (typeof plain !== 'string' || plain.length === 0) {
    throw new Error('Senha inválida para hash.');
  }
  const salt = bcrypt.genSaltSync(DEFAULT_SALT_ROUNDS);
  return bcrypt.hashSync(plain, salt);
}

function verifyPassword(plain, hash) {
  if (!hash || typeof plain !== 'string') return false;
  try {
    return bcrypt.compareSync(plain, hash);
  } catch (_) {
    return false;
  }
}

function signToken(payload, secret, options = {}) {
  if (!secret) throw new Error('JWT secret não fornecido.');
  return jwt.sign(payload, secret, options);
}

module.exports = {
  hashPassword,
  verifyPassword,
  signToken,
};

