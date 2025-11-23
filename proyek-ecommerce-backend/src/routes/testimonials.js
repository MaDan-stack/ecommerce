const express = require('express');
const router = express.Router();
const testimonialController = require('../controllers/testimonialController');
const verifyToken = require('../middleware/authMiddleware');

// Public: Semua orang bisa lihat
router.get('/', testimonialController.getAllTestimonials);

// Private: Hanya user login bisa posting
router.post('/', verifyToken, testimonialController.createTestimonial);

module.exports = router;