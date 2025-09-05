// api/logout.js
module.exports = (req, res) => {
  res.setHeader('Set-Cookie', `remo_admin=deleted; HttpOnly; Path=/; Max-Age=0; SameSite=Lax`);
  res.json({ ok:true });
};
