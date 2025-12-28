const express = require('express');
const router = express.Router();
const orderController = require('../controllers/orderController');
// PERBAIKAN: Import verifyToken DAN adminOnly
const { verifyToken, adminOnly } = require('../middleware/authMiddleware');
const upload = require('../middleware/upload');

// User Checkout (Cukup verifyToken)
router.post('/', verifyToken, orderController.createOrder); 

// User melihat orderannya sendiri (Cukup verifyToken)
router.get('/my-orders', verifyToken, orderController.getMyOrders); 

// Admin melihat SEMUA order (Wajib adminOnly)
router.get('/', verifyToken, adminOnly, orderController.getAllOrders); 

// Admin update status order (Wajib adminOnly)
router.put('/:id/status', verifyToken, adminOnly, orderController.updateOrderStatus);

// User Upload Bukti Bayar
router.post(
    '/:id/payment-proof', 
    verifyToken, 
    upload.single('image'), 
    orderController.uploadPaymentProof
);

module.exports = router;