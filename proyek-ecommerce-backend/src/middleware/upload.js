const multer = require('multer');
const cloudinary = require('cloudinary').v2;
const { CloudinaryStorage } = require('multer-storage-cloudinary');
require('dotenv').config();

// 1. Konfigurasi Cloudinary dengan kredensial dari .env
cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET
});

// 2. Siapkan Storage Engine
const storage = new CloudinaryStorage({
    cloudinary: cloudinary,
    params: {
        folder: 'lokalstyle-products', // Nama folder di Cloudinary
        allowed_formats: ['jpg', 'png', 'jpeg', 'webp'], // Format yang diizinkan
        transformation: [{ width: 800, height: 800, crop: 'limit' }] // Opsional: Resize otomatis biar hemat
    }
});

// 3. Inisialisasi Multer
const upload = multer({ storage: storage });

module.exports = upload;