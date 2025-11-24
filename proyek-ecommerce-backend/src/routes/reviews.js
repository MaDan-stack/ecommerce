const express = require('express');
const router = express.Router();
const reviewController = require('../controllers/reviewController');
const verifyToken = require('../middleware/authMiddleware');

// Public: Melihat review suatu produk
router.get('/:productId', reviewController.getProductReviews);

// Private: Memberi review (Wajib Login)
router.post('/', verifyToken, reviewController.addReview);

router.get('/', verifyToken, reviewController.getAllReviewsAdmin); // GET /api/reviews (Admin only)
router.delete('/:id', verifyToken, reviewController.deleteReview); // DELETE /api/reviews/:id

module.exports = router;