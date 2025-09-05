// api/admin.js  (simple admin list + approve/reject)
const cloudinary = require('cloudinary').v2;
cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
});

function checkAdmin(req) {
  const token = req.headers['x-admin-token'] || req.headers['authorization'];
  return token && token === process.env.ADMIN_SECRET;
}

module.exports = async (req, res) => {
  if (!checkAdmin(req)) return res.status(401).json({ error: 'unauthorized' });

  try {
    if (req.method === 'GET') {
      // list first 100 resources with tag 'pending'
      const resp = await cloudinary.api.resources_by_tag('pending', { max_results: 100, resource_type: 'image' });
      return res.json({ ok: true, resources: resp.resources || [] });
    }

    if (req.method === 'POST') {
      const body = req.body || (req._body ? req._body : {});
      const { action, public_id } = body;
      if (!action || !public_id) return res.status(400).json({ error: 'missing action or public_id' });

      if (action === 'approve') {
        // add approved tag, remove pending tag
        await cloudinary.uploader.add_tag('approved', public_id);
        await cloudinary.uploader.remove_tag('pending', public_id);
        return res.json({ ok: true, action: 'approved' });
      }

      if (action === 'reject') {
        // delete asset
        await cloudinary.uploader.destroy(public_id, { resource_type: 'image' }); // 'auto' if you may have videos
        return res.json({ ok: true, action: 'deleted' });
      }

      return res.status(400).json({ error: 'unknown action' });
    }

    return res.status(405).json({ error: 'method not allowed' });

  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: err.message || err });
  }
};
