const crypto = require('crypto');

// Secreto para firmar los tokens. DEFINIR en server/.env para producción.
const SECRET = process.env.JWT_SECRET || 'dev-insecure-secret-change-me';
if (!process.env.JWT_SECRET) {
  console.warn(
    '⚠️  JWT_SECRET no está definido: usando un secreto de desarrollo. ' +
    'Definí JWT_SECRET en server/.env antes de publicar.'
  );
}

function base64url(buf) {
  return Buffer.from(buf)
    .toString('base64')
    .replace(/=/g, '')
    .replace(/\+/g, '-')
    .replace(/\//g, '_');
}

function hmac(body) {
  return base64url(crypto.createHmac('sha256', SECRET).update(body).digest());
}

/** Firma un payload y devuelve un token "body.firma" (mini-JWT HMAC). */
function sign(payload) {
  const body = base64url(JSON.stringify(payload));
  return `${body}.${hmac(body)}`;
}

/** Verifica firma y expiración. Devuelve el payload o null si es inválido. */
function verify(token) {
  if (typeof token !== 'string' || !token.includes('.')) return null;
  const [body, sig] = token.split('.');
  if (!body || !sig) return null;

  const expected = hmac(body);
  const sigBuf = Buffer.from(sig);
  const expBuf = Buffer.from(expected);
  if (sigBuf.length !== expBuf.length || !crypto.timingSafeEqual(sigBuf, expBuf)) {
    return null;
  }

  let payload;
  try {
    payload = JSON.parse(
      Buffer.from(body.replace(/-/g, '+').replace(/_/g, '/'), 'base64').toString()
    );
  } catch {
    return null;
  }

  if (payload.exp && Date.now() > payload.exp) return null;
  return payload;
}

/** Genera un token de sesión de admin (24 hs por defecto). */
function signSession(ttlMs = 24 * 60 * 60 * 1000) {
  const now = Date.now();
  return sign({ sub: 'admin', iat: now, exp: now + ttlMs });
}

module.exports = { sign, verify, signSession };
