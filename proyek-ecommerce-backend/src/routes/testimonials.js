const express = require('express');
const router = express.Router();
const testimonialController = require('../controllers/testimonialController');
const verifyToken = require('../middleware/authMiddleware');

// Public: Semua orang bisa lihat
router.get('/', testimonialController.getAllTestimonials);

// Private: User login bisa posting
router.post('/', verifyToken, testimonialController.createTestimonial);

// Admin: Hapus Testimoni (BARU)
router.delete('/:id', verifyToken, testimonialController.deleteTestimonial);

module.exports = router;