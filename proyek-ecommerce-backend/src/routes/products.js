const express = require('express');
const router = express.Router();

// 1. Import Controller dengan Destructuring (Agar addProduct terbaca)
const { 
    getAllProducts, 
    getProductById, 
    addProduct, 
    editProduct, 
    deleteProduct 
} = require('../controllers/productController');

// 2. Import Middleware Auth & AdminOnly (Pastikan adminOnly diimpor!)
const { verifyToken, adminOnly } = require('../middleware/authMiddleware');

// 3. Import Middleware Upload (Wajib ada)
const upload = require('../middleware/upload');

// --- ROUTES ---

// Public Routes
router.get('/', getAllProducts);
router.get('/:id', getProductById);

// Protected Routes (Admin Only)
router.post('/', verifyToken, adminOnly, upload.array('images', 5), addProduct);
router.put('/:id', verifyToken, adminOnly, upload.array('images', 5), editProduct);
router.delete('/:id', verifyToken, adminOnly, deleteProduct);

module.exports = router;