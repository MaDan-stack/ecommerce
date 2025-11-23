const express = require('express');
const router = express.Router();
const upload = require('../middleware/upload');

router.post('/', upload.single('image'), (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ status: 'fail', message: 'Tidak ada file yang diupload' });
    }

    // Cloudinary otomatis menaruh URL gambar di req.file.path
    const imageUrl = req.file.path;

    res.json({
      status: 'success',
      message: 'File berhasil diupload ke Cloudinary',
      data: {
        imageUrl: imageUrl
      }
    });
  } catch (error) {
    res.status(500).json({ status: 'error', message: error.message });
  }
});

module.exports = router;