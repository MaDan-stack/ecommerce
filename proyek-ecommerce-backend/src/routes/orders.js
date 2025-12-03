const express = require('express');
const router = express.Router();
const orderController = require('../controllers/orderController');
const verifyToken = require('../middleware/authMiddleware');
const upload = require('../middleware/upload');

// Semua rute order butuh Login (verifyToken)
router.post('/', verifyToken, orderController.createOrder); // Checkout
router.get('/my-orders', verifyToken, orderController.getMyOrders); // Riwayat User
router.get('/', verifyToken, orderController.getAllOrders); // Admin Dashboard
router.put('/:id/status', verifyToken, orderController.updateOrderStatus);
// User Upload Bukti Bayar
// POST /api/orders/:id/payment-proof
router.post(
    '/:id/payment-proof', 
    verifyToken, 
    upload.single('image'), // Gunakan field 'image'
    orderController.uploadPaymentProof
);

module.exports = router;