const { Product, Order, Variant } = require('../models');
const { Op } = require('sequelize');

const dashboardController = {
    getStats: async (req, res) => {
        try {
            // Pastikan hanya admin
            if (req.user.role !== 'admin') {
                return res.status(403).json({ status: 'fail', message: 'Akses ditolak' });
            }

            // 1. Hitung Total Produk
            const totalProducts = await Product.count();

            // 2. Hitung Total Pesanan (Semua status kecuali cancelled bisa dianggap aktivitas, tapi kita hitung semua)
            const totalOrders = await Order.count();

            // 3. Hitung Total Pendapatan (Hanya dari pesanan yang sudah dibayar/selesai)
            // Status: 'paid', 'shipped', 'completed'
            const totalRevenue = await Order.sum('totalAmount', {
                where: {
                    status: {
                        [Op.or]: ['paid', 'shipped', 'completed']
                    }
                }
            }) || 0; // Default 0 jika belum ada pesanan

            // 4. Hitung Total Stok (Jumlahkan field 'stock' dari tabel Variant)
            const totalStock = await Variant.sum('stock') || 0;

            res.json({
                status: 'success',
                data: {
                    totalProducts,
                    totalOrders,
                    totalRevenue,
                    totalStock
                }
            });

        } catch (error) {
            console.error(error);
            res.status(500).json({ status: 'error', message: 'Gagal mengambil data statistik' });
        }
    }
};

module.exports = dashboardController;