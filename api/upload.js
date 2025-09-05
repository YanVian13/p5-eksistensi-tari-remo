// api/upload.js  (Vercel serverless function)
const cloudinary = require('cloudinary').v2;
const formidable = require('formidable');
const fs = require('fs');

cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
});

module.exports = async (req, res) => {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  // Parse form data (supports file upload or field 'url')
  const form = new formidable.IncomingForm();
  form.parse(req, async (err, fields, files) => {
    if (err) return res.status(500).json({ error: 'form parse error', detail: err.message });

    try {
      if (files?.file) {
        // Upload local file
        const file = files.file;
        const uploadResult = await new Promise((resolve, reject) => {
          const stream = cloudinary.uploader.upload_stream(
            { folder: 'remo/pending', tags: ['pending'], resource_type: 'auto' },
            (error, result) => error ? reject(error) : resolve(result)
          );
          fs.createReadStream(file.path).pipe(stream);
        });
        // cleanup temp file
        try { fs.unlinkSync(files.file.path); } catch(e){}
        return res.json({ ok: true, public_id: uploadResult.public_id, url: uploadResult.secure_url, raw: uploadResult });
      }

      if (fields?.url) {
        // Upload by remote URL
        const result = await cloudinary.uploader.upload(fields.url, { folder: 'remo/pending', tags: ['pending'], resource_type: 'auto' });
        return res.json({ ok: true, public_id: result.public_id, url: result.secure_url, raw: result });
      }

      return res.status(400).json({ error: 'No file or url provided' });

    } catch(uploadErr) {
      console.error('Upload error', uploadErr);
      return res.status(500).json({ error: 'Upload failed', detail: uploadErr.message || uploadErr });
    }
  });
};
