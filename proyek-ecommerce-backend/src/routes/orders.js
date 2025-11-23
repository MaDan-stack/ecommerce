const express = require('express');
const router = express.Router();
const orderController = require('../controllers/orderController');
const verifyToken = require('../middleware/authMiddleware');

// Semua rute order butuh Login (verifyToken)
router.post('/', verifyToken, orderController.createOrder); // Checkout
router.get('/my-orders', verifyToken, orderController.getMyOrders); // Riwayat User
router.get('/', verifyToken, orderController.getAllOrders); // Admin Dashboard
router.put('/:id/status', verifyToken, orderController.updateOrderStatus);

module.exports = router;