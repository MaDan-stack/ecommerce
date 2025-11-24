const express = require('express');
const router = express.Router();
const heroController = require('../controllers/heroController');
const verifyToken = require('../middleware/authMiddleware');

// Public
router.get('/', heroController.getAllSlides);

// Admin Only
router.post('/', verifyToken, heroController.addSlide);
router.put('/:id', verifyToken, heroController.updateSlide);
router.delete('/:id', verifyToken, heroController.deleteSlide);

module.exports = router;