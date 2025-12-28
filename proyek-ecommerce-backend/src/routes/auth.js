const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
// PERBAIKAN: Gunakan kurung kurawal {}
const { verifyToken } = require('../middleware/authMiddleware'); 

router.post('/register', authController.register);
router.post('/login', authController.login);
router.delete('/logout', authController.logout);

router.post('/forgot-password', authController.forgotPassword);
router.post('/reset-password/:token', authController.resetPassword);
router.put('/profile', verifyToken, authController.updateProfile);

router.get('/me', verifyToken, authController.getMe); 

module.exports = router;