const express = require('express');
const router = express.Router();
const { Subscriber } = require('../models');
const verifyToken = require('../middleware/authMiddleware');

// 1. PUBLIC: Subscribe (User)
router.post('/subscribe', async (req, res) => {
    try {
        const { email } = req.body;
        if (!email) return res.status(400).json({ status: 'fail', message: 'Email wajib diisi' });

        const existing = await Subscriber.findOne({ where: { email } });
        if (existing) {
            return res.status(400).json({ status: 'fail', message: 'Email ini sudah terdaftar' });
        }

        await Subscriber.create({ email });
        res.status(201).json({ status: 'success', message: 'Berhasil berlangganan newsletter!' });
    } catch (error) {
        // Perbaikan: Log error agar tidak "swallowed" (ditelan) begitu saja
        console.error("Newsletter subscribe error:", error);
        res.status(500).json({ status: 'error', message: 'Terjadi kesalahan server' });
    }
});

// 2. ADMIN: Get All Subscribers
router.get('/', verifyToken, async (req, res) => {
    try {
        if (req.user.role !== 'admin') return res.status(403).json({ message: 'Akses ditolak' });

        const subscribers = await Subscriber.findAll({
            order: [['createdAt', 'DESC']]
        });
        res.json({ status: 'success', data: subscribers });
    } catch (error) {
        console.error("Get subscribers error:", error);
        res.status(500).json({ status: 'error', message: error.message });
    }
});

// 3. ADMIN: Delete Subscriber
router.delete('/:id', verifyToken, async (req, res) => {
    try {
        if (req.user.role !== 'admin') return res.status(403).json({ message: 'Akses ditolak' });

        const { id } = req.params;
        await Subscriber.destroy({ where: { id } });
        res.json({ status: 'success', message: 'Subscriber dihapus' });
    } catch (error) {
        console.error("Delete subscriber error:", error);
        res.status(500).json({ status: 'error', message: error.message });
    }
});

module.exports = router;