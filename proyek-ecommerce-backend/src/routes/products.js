const express = require('express');
const router = express.Router();
const productController = require('../controllers/productController');
const verifyToken = require('../middleware/authMiddleware');

// Public Routes (Semua orang bisa akses)
router.get('/', productController.getAllProducts);
router.get('/:id', productController.getProductById);

// Protected Routes (Hanya Admin - butuh token)
// Kita pasang middleware 'verifyToken' sebelum controller
router.post('/', verifyToken, productController.addProduct);
router.put('/:id', verifyToken, productController.editProduct);
router.delete('/:id', verifyToken, productController.deleteProduct);

module.exports = router;