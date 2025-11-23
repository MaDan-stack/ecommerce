const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const verifyToken = require('../middleware/authMiddleware'); // Pastikan Anda sudah punya file ini

router.post('/register', authController.register);
router.post('/login', authController.login);
router.delete('/logout', authController.logout);

// --- TAMBAHKAN BARIS INI ---
// GET /api/auth/me
// verifyToken memastikan user sudah login sebelum masuk ke controller
router.get('/me', verifyToken, authController.getMe); 

module.exports = router;