const express = require('express');
const router = express.Router();
const upload = require('../middleware/upload');

router.post('/', upload.single('image'), (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ status: 'fail', message: 'Tidak ada file yang diupload' });
    }

    // Buat URL lengkap untuk gambar
    // Contoh: http://localhost:5000/uploads/172938...jpg
    const imageUrl = `${req.protocol}://${req.get('host')}/uploads/${req.file.filename}`;

    res.json({
      status: 'success',
      message: 'File berhasil diupload',
      data: {
        imageUrl: imageUrl
      }
    });
  } catch (error) {
    res.status(500).json({ status: 'error', message: error.message });
  }
});

module.exports = router;