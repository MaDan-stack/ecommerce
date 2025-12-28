const express = require('express');
const router = express.Router();
const reviewController = require('../controllers/reviewController');
// PERBAIKAN: Import verifyToken DAN adminOnly
const { verifyToken, adminOnly } = require('../middleware/authMiddleware');

// Public: Melihat review
router.get('/:productId', reviewController.getProductReviews);

// Private: Memberi review
router.post('/', verifyToken, reviewController.addReview);

// Admin: Lihat semua review (Wajib adminOnly)
router.get('/', verifyToken, adminOnly, reviewController.getAllReviewsAdmin); 

// Admin: Hapus review (Wajib adminOnly)
router.delete('/:id', verifyToken, adminOnly, reviewController.deleteReview);

module.exports = router;