const express = require('express');
const router = express.Router();
const dashboardController = require('../controllers/dashboardController');
// PERBAIKAN: Import verifyToken DAN adminOnly
const { verifyToken, adminOnly } = require('../middleware/authMiddleware');

// GET /api/dashboard/stats
// PERBAIKAN: Tambahkan adminOnly karena ini data rahasia toko
router.get('/stats', verifyToken, adminOnly, dashboardController.getStats);

module.exports = router;