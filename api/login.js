// api/login.js
const jwt = require('jsonwebtoken');
const qs = require('querystring');

const ADMIN_SECRET = process.env.ADMIN_SECRET || 'please-set-this';

module.exports = async (req, res) => {
  if (req.method !== 'POST') return res.status(405).end();

  // Accept JSON or form-urlencoded
  const buf = [];
  for await (const chunk of req) buf.push(chunk);
  const bodyRaw = Buffer.concat(buf).toString();
  let body = {};
  try { body = JSON.parse(bodyRaw); } catch(e) { body = qs.parse(bodyRaw); }

  const password = body.password;
  if (!password || password !== ADMIN_SECRET) {
    return res.status(401).json({ ok: false, error: 'invalid' });
  }

  // Create JWT (signed by ADMIN_SECRET). Short expiry recommended.
  const token = jwt.sign({ role: 'admin' }, ADMIN_SECRET, { expiresIn: '2h' });

  // Set cookie httpOnly, Secure if https, SameSite=Lax
  res.setHeader('Set-Cookie', `remo_admin=${token}; HttpOnly; Path=/; Max-Age=${2*60*60}; SameSite=Lax`);
  res.json({ ok: true });
};
