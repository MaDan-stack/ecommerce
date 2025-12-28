const express = require('express');
const router = express.Router();
const heroController = require('../controllers/heroController');
// PERBAIKAN: Gunakan kurung kurawal {} dan import adminOnly
const { verifyToken, adminOnly } = require('../middleware/authMiddleware');

// Public
router.get('/', heroController.getAllSlides);

// Admin Only (Tambahkan middleware adminOnly agar lebih aman)
router.post('/', verifyToken, adminOnly, heroController.addSlide);
router.put('/:id', verifyToken, adminOnly, heroController.updateSlide);
router.delete('/:id', verifyToken, adminOnly, heroController.deleteSlide);

module.exports = router;