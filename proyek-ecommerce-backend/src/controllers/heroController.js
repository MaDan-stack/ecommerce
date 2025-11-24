const { Hero } = require('../models');

const heroController = {
    // GET: Ambil semua slide (Public)
    getAllSlides: async (req, res) => {
        try {
            const slides = await Hero.findAll({
                order: [['createdAt', 'ASC']] // Urutkan dari yang terlama dibuat
            });
            res.json({ status: 'success', data: slides });
        } catch (error) {
            res.status(500).json({ status: 'error', message: error.message });
        }
    },

    // POST: Tambah Slide Baru (Admin)
    addSlide: async (req, res) => {
        try {
            if (req.user.role !== 'admin') {
                return res.status(403).json({ status: 'fail', message: 'Akses ditolak' });
            }

            const { title, description, img } = req.body;

            const newSlide = await Hero.create({ title, description, img });

            res.status(201).json({
                status: 'success',
                message: 'Slide berhasil ditambahkan',
                data: newSlide
            });
        } catch (error) {
            res.status(500).json({ status: 'error', message: error.message });
        }
    },

    // PUT: Edit Slide (Admin)
    updateSlide: async (req, res) => {
        try {
            if (req.user.role !== 'admin') {
                return res.status(403).json({ status: 'fail', message: 'Akses ditolak' });
            }

            const { id } = req.params;
            const { title, description, img } = req.body;

            const slide = await Hero.findByPk(id);
            if (!slide) {
                return res.status(404).json({ status: 'fail', message: 'Slide tidak ditemukan' });
            }

            await slide.update({ title, description, img });

            res.json({ status: 'success', message: 'Slide berhasil diperbarui' });
        } catch (error) {
            res.status(500).json({ status: 'error', message: error.message });
        }
    },

    // DELETE: Hapus Slide (Admin)
    deleteSlide: async (req, res) => {
        try {
            if (req.user.role !== 'admin') {
                return res.status(403).json({ status: 'fail', message: 'Akses ditolak' });
            }

            const { id } = req.params;
            await Hero.destroy({ where: { id } });

            res.json({ status: 'success', message: 'Slide berhasil dihapus' });
        } catch (error) {
            res.status(500).json({ status: 'error', message: error.message });
        }
    }
};

module.exports = heroController;