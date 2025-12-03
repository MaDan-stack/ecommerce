const { PaymentMethod } = require('../models');

const paymentController = {
    // GET: Ambil semua metode (Public)
    getAllMethods: async (req, res) => {
        try {
            const methods = await PaymentMethod.findAll({
                where: { isActive: true }
            });
            res.json({ status: 'success', data: methods });
        } catch (error) {
            res.status(500).json({ status: 'error', message: error.message });
        }
    },

    // POST: Tambah Metode (Admin)
    addMethod: async (req, res) => {
        try {
            if (req.user.role !== 'admin') return res.status(403).json({ message: 'Akses ditolak' });

            const { type, name, number, holder } = req.body;
            let image = null;

            // Jika ada upload file (untuk QRIS atau Logo Bank)
            if (req.file) {
                image = req.file.path;
            }

            const newMethod = await PaymentMethod.create({
                type, name, number, holder, image
            });

            res.status(201).json({ status: 'success', data: newMethod });
        } catch (error) {
            res.status(500).json({ status: 'error', message: error.message });
        }
    },

    // DELETE: Hapus Metode (Admin)
    deleteMethod: async (req, res) => {
        try {
            if (req.user.role !== 'admin') return res.status(403).json({ message: 'Akses ditolak' });
            
            const { id } = req.params;
            await PaymentMethod.destroy({ where: { id } });
            res.json({ status: 'success', message: 'Metode dihapus' });
        } catch (error) {
            res.status(500).json({ status: 'error', message: error.message });
        }
    }
};

module.exports = paymentController;