const { Testimonial, User } = require('../models');

const testimonialController = {
    // GET: Ambil semua testimoni
    getAllTestimonials: async (req, res) => {
        try {
            const testimonials = await Testimonial.findAll({
                include: [{
                    model: User,
                    attributes: ['name'] // Kita ambil nama user juga
                }],
                order: [['createdAt', 'DESC']] // Yang terbaru di atas
            });
            res.json({ status: 'success', data: testimonials });
        } catch (error) {
            console.error(error);
            res.status(500).json({ status: 'error', message: error.message });
        }
    },

    // POST: Tambah testimoni baru (Perlu Login)
    createTestimonial: async (req, res) => {
        try {
            const { text } = req.body;
            const userId = req.user.id;
            
            // Ambil data user untuk mendapatkan nama
            const user = await User.findByPk(userId);
            if (!user) return res.status(404).json({ message: 'User tidak ditemukan' });

            // Generate avatar url sederhana
            const img = `https://ui-avatars.com/api/?name=${encodeURIComponent(user.name)}&background=random`;

            const newTestimonial = await Testimonial.create({
                name: user.name,
                text,
                img,
                userId
            });

            res.status(201).json({
                status: 'success',
                message: 'Testimoni berhasil ditambahkan',
                data: newTestimonial
            });
        } catch (error) {
            console.error(error);
            res.status(500).json({ status: 'error', message: error.message });
        }
    }
};

module.exports = testimonialController;