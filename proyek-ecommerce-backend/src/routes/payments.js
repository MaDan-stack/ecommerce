const express = require('express');
const router = express.Router();
const paymentController = require('../controllers/paymentController');
const verifyToken = require('../middleware/authMiddleware');
const upload = require('../middleware/upload');

// Public
router.get('/', paymentController.getAllMethods);

// Admin Only
router.post('/', verifyToken, upload.single('image'), paymentController.addMethod);
router.delete('/:id', verifyToken, paymentController.deleteMethod);

module.exports = router;