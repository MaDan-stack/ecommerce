const express = require('express');
const router = express.Router();
const testimonialController = require('../controllers/testimonialController');
// PERBAIKAN: Import verifyToken DAN adminOnly
const { verifyToken, adminOnly } = require('../middleware/authMiddleware');

// Public
router.get('/', testimonialController.getAllTestimonials);

// Private: User posting
router.post('/', verifyToken, testimonialController.createTestimonial);

// Admin: Hapus Testimoni (Wajib adminOnly)
router.delete('/:id', verifyToken, adminOnly, testimonialController.deleteTestimonial);

module.exports = router;