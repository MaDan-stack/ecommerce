const express = require('express');
const router = express.Router();
const paymentController = require('../controllers/paymentController');
// PERBAIKAN: Gunakan kurung kurawal {} dan import adminOnly
const { verifyToken, adminOnly } = require('../middleware/authMiddleware');
const upload = require('../middleware/upload');

// Public
router.get('/', paymentController.getAllMethods);

// Admin Only (Tambahkan middleware adminOnly)
router.post('/', verifyToken, adminOnly, upload.single('image'), paymentController.addMethod);
router.delete('/:id', verifyToken, adminOnly, paymentController.deleteMethod);

module.exports = router;