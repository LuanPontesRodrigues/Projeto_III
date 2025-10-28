const crypto = require('crypto');

const PASSWORD_ITERATIONS = 160000;
const PASSWORD_KEY_LENGTH = 64;
const PASSWORD_DIGEST = 'sha512';

const TOKEN_HEADER = Buffer.from(
  JSON.stringify({ alg: 'HS256', typ: 'JWT' }),
  'utf8'
).toString('base64url');

const DEFAULT_TOKEN_TTL_SECONDS = 60 * 60 * 8; // 8 horas

const base64UrlEncode = (value) => {
  if (typeof value === 'string') {
    return Buffer.from(value, 'utf8').toString('base64url');
  }

  if (Buffer.isBuffer(value)) {
    return value.toString('base64url');
  }

  return Buffer.from(JSON.stringify(value), 'utf8').toString('base64url');
};

const base64UrlDecode = (value) => Buffer.from(value, 'base64url');

const parseDurationToSeconds = (raw, fallbackSeconds = DEFAULT_TOKEN_TTL_SECONDS) => {
  if (!raw) {
    return fallbackSeconds;
  }

  if (typeof raw === 'number' && Number.isFinite(raw)) {
    return Math.max(0, Math.trunc(raw));
  }

  const normalized = String(raw).trim().toLowerCase();
  const match = normalized.match(/^(\d+)([smhd])?$/);

  if (!match) {
    return fallbackSeconds;
  }

  const value = Number.parseInt(match[1], 10);
  const unit = match[2] || 's';

  switch (unit) {
    case 'm':
      return value * 60;
    case 'h':
      return value * 60 * 60;
    case 'd':
      return value * 24 * 60 * 60;
    case 's':
    default:
      return value;
  }
};

const buildTokenSignature = (unsignedToken, secret) =>
  crypto.createHmac('sha256', secret).update(unsignedToken).digest('base64url');

const signToken = (payload, secret, options = {}) => {
  const now = Math.floor(Date.now() / 1000);
  const ttlSeconds = parseDurationToSeconds(options.expiresIn);

  const tokenPayload = { ...payload, iat: now };

  if (ttlSeconds > 0) {
    tokenPayload.exp = now + ttlSeconds;
  }

  const encodedPayload = base64UrlEncode(JSON.stringify(tokenPayload));
  const unsignedToken = `${TOKEN_HEADER}.${encodedPayload}`;
  const signature = buildTokenSignature(unsignedToken, secret);

  return `${unsignedToken}.${signature}`;
};

const verifyToken = (token, secret) => {
  if (typeof token !== 'string' || token.split('.').length !== 3) {
    throw new Error('Token malformado.');
  }

  const [headerPart, payloadPart, signature] = token.split('.');

  if (headerPart !== TOKEN_HEADER) {
    throw new Error('Cabeçalho do token inválido.');
  }

  const unsignedToken = `${headerPart}.${payloadPart}`;
  const expectedSignature = buildTokenSignature(unsignedToken, secret);

  const signatureBuffer = Buffer.from(signature, 'base64url');
  const expectedBuffer = Buffer.from(expectedSignature, 'base64url');

  if (
    signatureBuffer.length !== expectedBuffer.length ||
    !crypto.timingSafeEqual(signatureBuffer, expectedBuffer)
  ) {
    throw new Error('Assinatura inválida.');
  }

  const payloadBuffer = base64UrlDecode(payloadPart);
  const payload = JSON.parse(payloadBuffer.toString('utf8'));

  if (payload.exp && payload.exp < Math.floor(Date.now() / 1000)) {
    throw new Error('Token expirado.');
  }

  return payload;
};

const hashPassword = (plainPassword) => {
  if (!plainPassword) {
    throw new Error('Senha inválida.');
  }

  const salt = crypto.randomBytes(16);
  const derivedKey = crypto.pbkdf2Sync(
    String(plainPassword),
    salt,
    PASSWORD_ITERATIONS,
    PASSWORD_KEY_LENGTH,
    PASSWORD_DIGEST
  );

  return [
    PASSWORD_ITERATIONS,
    PASSWORD_KEY_LENGTH,
    PASSWORD_DIGEST,
    salt.toString('hex'),
    derivedKey.toString('hex'),
  ].join(':');
};

const verifyPassword = (plainPassword, storedHash) => {
  if (!plainPassword || !storedHash) {
    return false;
  }

  const parts = storedHash.split(':');

  if (parts.length !== 5) {
    return false;
  }

  const [iterStr, keyLenStr, digest, saltHex, hashHex] = parts;
  const iterations = Number.parseInt(iterStr, 10);
  const keyLength = Number.parseInt(keyLenStr, 10);

  if (!iterations || !keyLength || !digest || !saltHex || !hashHex) {
    return false;
  }

  const salt = Buffer.from(saltHex, 'hex');
  const storedKey = Buffer.from(hashHex, 'hex');

  const derivedKey = crypto.pbkdf2Sync(
    String(plainPassword),
    salt,
    iterations,
    keyLength,
    digest
  );

  if (storedKey.length !== derivedKey.length) {
    return false;
  }

  return crypto.timingSafeEqual(storedKey, derivedKey);
};

module.exports = {
  hashPassword,
  verifyPassword,
  signToken,
  verifyToken,
  parseDurationToSeconds,
};
